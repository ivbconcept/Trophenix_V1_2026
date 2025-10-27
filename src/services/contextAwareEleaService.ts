import { supabaseDB2 as supabase } from '../lib/supabaseDB2';
import type { ActiveContext } from '../types/contexts';

export interface EleaContextSummary {
  has_context: boolean;
  context_type?: string;
  role?: string;
  organization?: {
    name: string;
    slug: string;
    team_size: number;
    active_tasks: number;
    my_tasks: number;
  };
  delegation?: {
    athlete_profile_id: string;
    athlete_name: string;
    my_role: string;
    delegates_count: number;
    active_tasks: number;
  };
  message?: string;
}

export class ContextAwareEleaService {
  static async getContextSummary(userId: string): Promise<EleaContextSummary> {
    const { data, error } = await supabase.rpc('get_elea_context_summary', {
      target_user_id: userId
    });

    if (error) {
      console.error('Error getting context summary:', error);
      return { has_context: false, message: 'Erreur lors de la récupération du contexte' };
    }

    return data as EleaContextSummary;
  }

  static async getOrCreateContextAwareSession(
    userId: string,
    agentId: string,
    currentContext: ActiveContext | null
  ): Promise<string> {
    const { data: existingSession, error: fetchError } = await supabase
      .from('agent_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('agent_id', agentId)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching session:', fetchError);
      throw fetchError;
    }

    if (existingSession) {
      const updateData: any = {
        last_message_at: new Date().toISOString()
      };

      if (currentContext) {
        updateData.current_context_id = currentContext.context.id;
        updateData.active_role = currentContext.context.role;
        updateData.context_data = {
          context_type: currentContext.context.context_type,
          role: currentContext.context.role,
          permissions: currentContext.permissions,
          organization: currentContext.organization,
          delegation: currentContext.delegation
        };
      }

      await supabase
        .from('agent_sessions')
        .update(updateData)
        .eq('id', existingSession.id);

      return existingSession.id;
    }

    const insertData: any = {
      user_id: userId,
      agent_id: agentId,
      title: 'Nouvelle conversation',
      status: 'active'
    };

    if (currentContext) {
      insertData.current_context_id = currentContext.context.id;
      insertData.active_role = currentContext.context.role;
      insertData.context_data = {
        context_type: currentContext.context.context_type,
        role: currentContext.context.role,
        permissions: currentContext.permissions,
        organization: currentContext.organization,
        delegation: currentContext.delegation
      };
    }

    const { data: newSession, error: createError } = await supabase
      .from('agent_sessions')
      .insert(insertData)
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating session:', createError);
      throw createError;
    }

    return newSession.id;
  }

  static async getSessionMessages(sessionId: string) {
    const { data, error } = await supabase
      .from('agent_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data || [];
  }

  static async sendMessage(
    sessionId: string,
    senderId: string,
    content: string,
    senderType: 'user' | 'agent' = 'user'
  ) {
    const { data, error } = await supabase
      .from('agent_messages')
      .insert({
        session_id: sessionId,
        sender_type: senderType,
        sender_id: senderId,
        content,
        content_type: 'text'
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data;
  }

  static getContextAwareWelcome(
    userId: string,
    contextSummary: EleaContextSummary,
    userEmail?: string
  ): string {
    if (!contextSummary.has_context) {
      return `Bonjour ! Je suis Elea, votre assistante IA personnelle sur Trophenix. Je m'adapte à votre rôle et votre contexte pour vous aider au mieux. Comment puis-je vous assister aujourd'hui ?`;
    }

    const userName = userEmail?.split('@')[0] || 'cher utilisateur';

    if (contextSummary.context_type === 'company_org' && contextSummary.organization) {
      const org = contextSummary.organization;
      const roleLabel = this.getRoleLabel(contextSummary.role || '');

      return `Bonjour ${userName} !

Je suis Elea, votre assistante IA personnelle. Je vois que vous êtes **${roleLabel}** chez **${org.name}**.

📊 Contexte actuel :
- Équipe : ${org.team_size} membre${org.team_size > 1 ? 's' : ''}
- Tâches actives : ${org.active_tasks}
- Vos tâches : ${org.my_tasks}

Je peux vous aider à :
✅ Gérer les tâches de l'équipe
✅ Consulter les candidatures
✅ Communiquer avec les candidats
✅ Poster des offres d'emploi
✅ Analyser les performances de l'équipe

Comment puis-je vous assister ?`;
    }

    if (contextSummary.context_type === 'athlete_delegation' && contextSummary.delegation) {
      const del = contextSummary.delegation;
      const roleLabel = this.getRoleLabel(del.my_role);

      return `Bonjour ${userName} !

Je suis Elea, votre assistante IA personnelle. Je vois que vous êtes **${roleLabel}** pour **${del.athlete_name}**.

📊 Contexte actuel :
- Délégués actifs : ${del.delegates_count}
- Tâches en cours : ${del.active_tasks}

Je peux vous aider à :
✅ Gérer les tâches et décisions importantes
✅ Suivre les candidatures de l'athlète
✅ Communiquer avec les recruteurs
✅ Coordonner avec les autres délégués

Comment puis-je vous aider aujourd'hui ?`;
    }

    if (contextSummary.context_type === 'athlete_profile') {
      return `Bonjour ${userName} !

Je suis Elea, votre assistante IA personnelle. Je suis là pour vous aider dans votre parcours sportif et professionnel.

Je peux vous aider à :
✅ Optimiser votre profil athlète
✅ Trouver des opportunités
✅ Gérer vos candidatures
✅ Préparer vos entretiens

Que puis-je faire pour vous ?`;
    }

    return `Bonjour ${userName} ! Je suis Elea, votre assistante personnelle. Comment puis-je vous aider ?`;
  }

  static getContextAwareSuggestions(contextSummary: EleaContextSummary): Array<{ id: string; text: string }> {
    if (!contextSummary.has_context) {
      return [
        { id: '1', text: 'Comment fonctionne Trophenix ?' },
        { id: '2', text: 'Gérer mon profil' }
      ];
    }

    if (contextSummary.context_type === 'company_org') {
      const myTasks = contextSummary.organization?.my_tasks || 0;
      const suggestions = [
        { id: '1', text: 'Voir les candidatures reçues' },
        { id: '2', text: 'Créer une nouvelle offre' },
        { id: '3', text: 'Consulter l\'équipe' }
      ];

      if (myTasks > 0) {
        suggestions.unshift({
          id: '0',
          text: `Voir mes ${myTasks} tâche${myTasks > 1 ? 's' : ''} en cours`
        });
      }

      return suggestions;
    }

    if (contextSummary.context_type === 'athlete_delegation') {
      const tasks = contextSummary.delegation?.active_tasks || 0;
      const suggestions = [
        { id: '1', text: 'Voir les candidatures de l\'athlète' },
        { id: '2', text: 'Consulter les autres délégués' }
      ];

      if (tasks > 0) {
        suggestions.unshift({
          id: '0',
          text: `Voir les ${tasks} tâche${tasks > 1 ? 's' : ''} en cours`
        });
      }

      return suggestions;
    }

    if (contextSummary.context_type === 'athlete_profile') {
      return [
        { id: '1', text: 'Optimiser mon profil' },
        { id: '2', text: 'Voir les offres disponibles' },
        { id: '3', text: 'Gérer mes candidatures' },
        { id: '4', text: 'Inviter un délégué (parent/agent)' }
      ];
    }

    return [
      { id: '1', text: 'Que puis-je faire ici ?' },
      { id: '2', text: 'Aide' }
    ];
  }

  static async generateContextAwareResponse(
    userMessage: string,
    userId: string,
    contextSummary: EleaContextSummary,
    conversationHistory: any[]
  ): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('tâche') || lowerMessage.includes('task')) {
      if (contextSummary.context_type === 'company_org') {
        const myTasks = contextSummary.organization?.my_tasks || 0;
        const totalTasks = contextSummary.organization?.active_tasks || 0;

        return `📋 **Tâches dans votre organisation**

Vous avez **${myTasks} tâche${myTasks > 1 ? 's' : ''}** qui vous sont assignées.
L'équipe a **${totalTasks} tâche${totalTasks > 1 ? 's' : ''}** actives au total.

Que souhaitez-vous faire ?
- Voir vos tâches assignées
- Créer une nouvelle tâche
- Consulter toutes les tâches de l'équipe`;
      }

      if (contextSummary.context_type === 'athlete_delegation') {
        const tasks = contextSummary.delegation?.active_tasks || 0;

        return `📋 **Tâches partagées**

Il y a **${tasks} tâche${tasks > 1 ? 's' : ''}** en cours pour ${contextSummary.delegation?.athlete_name}.

Ces tâches sont visibles par tous les délégués (parents, agents) pour une coordination optimale.

Souhaitez-vous consulter ces tâches ?`;
      }
    }

    if (lowerMessage.includes('équipe') || lowerMessage.includes('team') || lowerMessage.includes('membre')) {
      if (contextSummary.context_type === 'company_org') {
        const teamSize = contextSummary.organization?.team_size || 0;

        return `👥 **Votre équipe ${contextSummary.organization?.name}**

Vous avez **${teamSize} membre${teamSize > 1 ? 's' : ''}** dans votre organisation.

En tant que **${this.getRoleLabel(contextSummary.role || '')}**, vous pouvez :
${this.getTeamPermissions(contextSummary.role || '')}

Que souhaitez-vous faire ?`;
      }

      if (contextSummary.context_type === 'athlete_delegation') {
        const delegates = contextSummary.delegation?.delegates_count || 0;

        return `👥 **Délégués de ${contextSummary.delegation?.athlete_name}**

Il y a **${delegates} délégué${delegates > 1 ? 's' : ''}** actifs (parents, agents, managers).

Tous les délégués peuvent :
- Voir les candidatures et offres
- Consulter les messages avec les recruteurs
- Collaborer sur les décisions importantes

La transparence totale est garantie !

Souhaitez-vous voir la liste des délégués ?`;
      }
    }

    if (lowerMessage.includes('candidature') || lowerMessage.includes('application')) {
      if (contextSummary.context_type === 'company_org') {
        return `📨 **Gestion des candidatures**

En tant que membre de l'équipe ${contextSummary.organization?.name}, vous pouvez consulter et gérer les candidatures reçues.

Vos permissions dépendent de votre rôle (${this.getRoleLabel(contextSummary.role || '')}).

Que souhaitez-vous faire ?
- Voir toutes les candidatures
- Filtrer par offre
- Consulter les nouveaux profils`;
      }

      if (contextSummary.context_type === 'athlete_delegation') {
        return `📨 **Candidatures de ${contextSummary.delegation?.athlete_name}**

En tant que **${this.getRoleLabel(contextSummary.delegation?.my_role || '')}**, vous pouvez suivre toutes les candidatures envoyées.

Tous les délégués (parents, agents) ont accès aux mêmes informations pour prendre les meilleures décisions ensemble.

Souhaitez-vous voir les candidatures en cours ?`;
      }

      if (contextSummary.context_type === 'athlete_profile') {
        return `📨 **Vos candidatures**

Je peux vous aider à :
- Voir vos candidatures en cours
- Postuler à de nouvelles offres
- Préparer vos candidatures
- Suivre les réponses des recruteurs

Que souhaitez-vous faire ?`;
      }
    }

    if (lowerMessage.includes('message') || lowerMessage.includes('messagerie')) {
      if (contextSummary.context_type === 'company_org' || contextSummary.context_type === 'athlete_delegation') {
        return `💬 **Messagerie contextuelle**

Vos messages sont maintenant **partagés avec votre équipe** !

✅ **Avantages** :
- Toute l'équipe voit les échanges avec les candidats
- Pas de perte d'information si quelqu'un part
- Collaboration transparente
- Historique complet conservé

Les messages directs personnels restent privés.

Souhaitez-vous accéder à la messagerie ?`;
      }
    }

    if (lowerMessage.includes('rôle') || lowerMessage.includes('permission') || lowerMessage.includes('droits')) {
      return `🔐 **Votre rôle et permissions**

Contexte : **${this.getContextTypeLabel(contextSummary.context_type || '')}**
Rôle : **${this.getRoleLabel(contextSummary.role || '')}**

${this.getPermissionsDescription(contextSummary)}

Vos permissions sont automatiquement appliquées partout sur la plateforme.

Des questions sur ce que vous pouvez faire ?`;
    }

    if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
      return `🤖 **Je suis Elea - Votre assistante IA consciente du contexte**

Je m'adapte automatiquement à votre rôle actuel sur Trophenix :

✨ **Ce que je sais sur vous** :
- Votre contexte actuel : ${this.getContextTypeLabel(contextSummary.context_type || '')}
- Votre rôle : ${this.getRoleLabel(contextSummary.role || '')}
- Vos permissions et accès
- Votre équipe/délégation
- Vos tâches et responsabilités

✨ **Ce que je peux faire** :
- Répondre à vos questions contextuelles
- Vous guider selon votre rôle
- Vous donner accès aux bonnes fonctionnalités
- Vous aider dans vos tâches quotidiennes

N'hésitez pas à me poser des questions !`;
    }

    return `Je comprends votre question sur "${userMessage}".

Dans votre contexte actuel (${this.getRoleLabel(contextSummary.role || '')} - ${this.getContextTypeLabel(contextSummary.context_type || '')}), je peux vous aider avec :

${this.getContextSpecificHelp(contextSummary)}

Que souhaitez-vous faire ?`;
  }

  private static getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      owner: 'Propriétaire',
      hr_manager: 'Manager RH',
      hr_recruiter: 'Recruteur RH',
      technical_lead: 'Lead Technique',
      director: 'Directeur',
      guardian: 'Tuteur Légal',
      agent: 'Agent Sportif',
      manager: 'Manager',
      coach: 'Coach'
    };
    return labels[role] || role;
  }

  private static getContextTypeLabel(contextType: string): string {
    const labels: Record<string, string> = {
      company_org: 'Organisation Entreprise',
      athlete_delegation: 'Délégation Athlète',
      athlete_profile: 'Profil Athlète',
      platform_admin: 'Administration Plateforme'
    };
    return labels[contextType] || contextType;
  }

  private static getTeamPermissions(role: string): string {
    const permissions: Record<string, string> = {
      owner: '- Gérer toute l\'équipe\n- Inviter/retirer des membres\n- Tous les droits sur les offres\n- Accès complet',
      hr_manager: '- Inviter de nouveaux membres\n- Poster et gérer les offres\n- Gérer les candidatures\n- Voir les analytics',
      hr_recruiter: '- Consulter les candidatures\n- Voir les offres',
      technical_lead: '- Évaluer les compétences techniques\n- Voir les candidatures',
      director: '- Validation finale\n- Vue d\'ensemble et analytics'
    };
    return permissions[role] || '- Accès limité selon votre rôle';
  }

  private static getPermissionsDescription(contextSummary: EleaContextSummary): string {
    if (contextSummary.context_type === 'company_org') {
      return this.getTeamPermissions(contextSummary.role || '');
    }

    if (contextSummary.context_type === 'athlete_delegation') {
      const role = contextSummary.delegation?.my_role || '';
      const permissions: Record<string, string> = {
        guardian: 'En tant que tuteur légal, vous avez tous les droits :\n- Valider les documents légaux\n- Signer les contrats\n- Gérer le profil\n- Prendre toutes les décisions',
        agent: 'En tant qu\'agent sportif :\n- Négocier les contrats\n- Conseiller sur les offres\n- Voir toutes les opportunités\n- Communiquer avec les recruteurs',
        manager: 'En tant que manager :\n- Gérer la carrière\n- Voir les statistiques\n- Conseiller sur les choix',
        coach: 'En tant que coach :\n- Voir les performances\n- Donner du feedback\n- Suivre la progression'
      };
      return permissions[role] || 'Accès selon votre rôle';
    }

    return 'Permissions standard selon votre rôle';
  }

  private static getContextSpecificHelp(contextSummary: EleaContextSummary): string {
    if (contextSummary.context_type === 'company_org') {
      return `- Gérer les offres d'emploi
- Consulter les candidatures
- Gérer votre équipe
- Suivre les tâches actives
- Analyser les performances`;
    }

    if (contextSummary.context_type === 'athlete_delegation') {
      return `- Suivre les candidatures de l'athlète
- Gérer les tâches importantes
- Coordonner avec les autres délégués
- Communiquer avec les recruteurs`;
    }

    if (contextSummary.context_type === 'athlete_profile') {
      return `- Optimiser votre profil
- Trouver des opportunités
- Postuler aux offres
- Gérer vos candidatures`;
    }

    return '- Navigation sur la plateforme\n- Gestion de votre profil\n- Exploration des fonctionnalités';
  }
}
