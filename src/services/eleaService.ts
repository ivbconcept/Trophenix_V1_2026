import { supabaseDB2 as supabase } from '../lib/supabaseDB2';
import type { EleaConversation, EleaMessage, Profile } from '../types/database';
import type { AgentContext } from '../types/agent';

export class EleaService {
  static async getOrCreateActiveConversation(userId: string, context: AgentContext): Promise<string> {
    const { data: existingConv, error: fetchError } = await supabase
      .from('elea_conversations')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_message_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching conversation:', fetchError);
      throw fetchError;
    }

    if (existingConv) {
      await supabase
        .from('elea_conversations')
        .update({ context, last_message_at: new Date().toISOString() })
        .eq('id', existingConv.id);

      return existingConv.id;
    }

    const { data: newConv, error: createError } = await supabase
      .from('elea_conversations')
      .insert({
        user_id: userId,
        title: 'Nouvelle conversation',
        context,
        is_active: true,
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      throw createError;
    }

    return newConv.id;
  }

  static async getConversationHistory(conversationId: string): Promise<EleaMessage[]> {
    const { data, error } = await supabase
      .from('elea_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }

    return data || [];
  }

  static async saveMessage(
    conversationId: string,
    sender: 'user' | 'agent',
    content: string,
    messageType: 'text' | 'error' | 'suggestion' | 'system' = 'text',
    metadata: Record<string, unknown> = {}
  ): Promise<EleaMessage> {
    const { data, error } = await supabase
      .from('elea_messages')
      .insert({
        conversation_id: conversationId,
        sender,
        content,
        message_type: messageType,
        metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }

    return data;
  }

  static async getUserConversations(userId: string, activeOnly = true): Promise<EleaConversation[]> {
    let query = supabase
      .from('elea_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user conversations:', error);
      throw error;
    }

    return data || [];
  }

  static async archiveConversation(conversationId: string): Promise<void> {
    const { error } = await supabase
      .from('elea_conversations')
      .update({ is_active: false })
      .eq('id', conversationId);

    if (error) {
      console.error('Error archiving conversation:', error);
      throw error;
    }
  }

  static async deleteConversation(conversationId: string): Promise<void> {
    const { error } = await supabase
      .from('elea_conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  static getWelcomeMessage(userProfile: Profile | null, context: AgentContext): string {
    if (!userProfile) {
      return "Bonjour ! Je suis Elea, votre assistante personnelle sur Trophenix. Comment puis-je vous aider aujourd'hui ?";
    }

    const userName = userProfile.first_name || userProfile.company_name || 'cher utilisateur';

    if (userProfile.user_type === 'athlete') {
      return `Bonjour ${userName} ! Je suis Elea, votre assistante personnelle. Je suis là pour vous aider à trouver les meilleures opportunités sportives, gérer vos candidatures et optimiser votre profil. Comment puis-je vous assister aujourd'hui ?`;
    } else if (userProfile.user_type === 'company') {
      return `Bonjour ${userName} ! Je suis Elea, votre assistante pour le recrutement sportif. Je peux vous aider à créer des offres d'emploi, gérer les candidatures et trouver les meilleurs talents. Que puis-je faire pour vous ?`;
    }

    return `Bonjour ${userName} ! Je suis Elea, votre assistante personnelle sur Trophenix. Comment puis-je vous aider aujourd'hui ?`;
  }

  static getSuggestionsForUser(userProfile: Profile | null, context: AgentContext): Array<{ id: string; text: string }> {
    if (!userProfile) {
      return [
        { id: '1', text: 'Comment fonctionne Trophenix ?' },
        { id: '2', text: 'Quelles sont les fonctionnalités disponibles ?' },
      ];
    }

    if (userProfile.user_type === 'athlete') {
      return [
        { id: '1', text: 'Comment optimiser mon profil ?' },
        { id: '2', text: 'Voir les offres d\'emploi disponibles' },
        { id: '3', text: 'Comment postuler à une offre ?' },
        { id: '4', text: 'Gérer mes candidatures' },
      ];
    } else if (userProfile.user_type === 'company') {
      return [
        { id: '1', text: 'Comment créer une offre d\'emploi ?' },
        { id: '2', text: 'Voir les candidatures reçues' },
        { id: '3', text: 'Comment trouver des talents ?' },
        { id: '4', text: 'Optimiser mon profil entreprise' },
      ];
    }

    return [
      { id: '1', text: 'Comment fonctionne Trophenix ?' },
      { id: '2', text: 'Quelles sont les fonctionnalités disponibles ?' },
    ];
  }

  static async generateResponse(
    userMessage: string,
    userProfile: Profile | null,
    context: AgentContext,
    conversationHistory: EleaMessage[]
  ): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('profil') && lowerMessage.includes('optimiser')) {
      if (userProfile?.user_type === 'athlete') {
        return "Pour optimiser votre profil athlète, je vous recommande de :\n\n1. Compléter toutes les informations (sport, niveau, achievements)\n2. Ajouter une photo professionnelle\n3. Rédiger une bio percutante qui met en valeur vos compétences\n4. Mettre à jour régulièrement vos performances\n\nVoulez-vous que je vous guide vers votre page de profil ?";
      } else if (userProfile?.user_type === 'company') {
        return "Pour optimiser votre profil entreprise, je vous conseille de :\n\n1. Ajouter un logo et une photo de couverture\n2. Rédiger une description détaillée de votre activité\n3. Préciser vos besoins en recrutement\n4. Mettre en avant votre culture d'entreprise\n\nSouhaitez-vous accéder à votre page de profil ?";
      }
    }

    if (lowerMessage.includes('offre') || lowerMessage.includes('emploi')) {
      if (userProfile?.user_type === 'athlete') {
        return "Je peux vous aider à trouver les offres d'emploi qui correspondent à votre profil sportif ! Vous pouvez :\n\n- Parcourir toutes les offres disponibles\n- Filtrer par sport, niveau et localisation\n- Sauvegarder vos offres favorites\n- Postuler directement en ligne\n\nVoulez-vous voir les offres disponibles maintenant ?";
      } else if (userProfile?.user_type === 'company') {
        return "Je peux vous accompagner dans la création d'offres d'emploi ! Vous pouvez :\n\n- Créer une nouvelle offre en quelques clics\n- Gérer vos offres actives\n- Voir les statistiques de vos offres\n- Suivre les candidatures reçues\n\nSouhaitez-vous créer une nouvelle offre maintenant ?";
      }
    }

    if (lowerMessage.includes('candidature')) {
      if (userProfile?.user_type === 'athlete') {
        return "Je peux vous aider à gérer vos candidatures ! Dans votre espace candidatures, vous pouvez :\n\n- Voir toutes vos candidatures en cours\n- Suivre leur statut (en attente, acceptée, refusée)\n- Modifier vos lettres de motivation\n- Retirer une candidature si nécessaire\n\nVoulez-vous accéder à vos candidatures ?";
      } else if (userProfile?.user_type === 'company') {
        return "Je peux vous aider à gérer les candidatures reçues ! Vous pouvez :\n\n- Consulter toutes les candidatures\n- Filtrer par offre et par statut\n- Voir les profils détaillés des candidats\n- Accepter ou refuser les candidatures\n\nSouhaitez-vous voir les candidatures reçues ?";
      }
    }

    if (lowerMessage.includes('message') || lowerMessage.includes('contacter')) {
      return "La messagerie vous permet de communiquer directement avec les autres utilisateurs !\n\n- Envoyer des messages aux entreprises (pour les athlètes)\n- Contacter les candidats (pour les entreprises)\n- Gérer vos conversations\n- Recevoir des notifications\n\nVoulez-vous accéder à votre messagerie ?";
    }

    if (lowerMessage.includes('annuaire') || lowerMessage.includes('trouver')) {
      return "Les annuaires vous permettent de découvrir :\n\n📋 **Annuaire des Athlètes**\n- Parcourir les profils sportifs\n- Filtrer par sport et niveau\n- Voir les performances et achievements\n\n🏢 **Annuaire des Entreprises**\n- Découvrir les structures sportives\n- Voir leurs offres actives\n- Contacter les recruteurs\n\nQuel annuaire souhaitez-vous consulter ?";
    }

    if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('comment')) {
      return "Je suis là pour vous aider ! Voici ce que je peux faire pour vous :\n\n✅ Répondre à vos questions sur Trophenix\n✅ Vous guider dans l'utilisation de la plateforme\n✅ Vous aider à optimiser votre profil\n✅ Vous assister dans vos recherches\n\nN'hésitez pas à me poser vos questions, je suis là pour ça !";
    }

    return "Je comprends votre question. Actuellement, je suis en phase d'apprentissage et mes réponses sont limitées. Mais je m'améliore chaque jour !\n\nEn attendant, vous pouvez :\n- Explorer les différentes sections de la plateforme\n- Compléter votre profil\n- Contacter notre support si vous avez besoin d'aide\n\nQue puis-je faire d'autre pour vous ?";
  }
}
