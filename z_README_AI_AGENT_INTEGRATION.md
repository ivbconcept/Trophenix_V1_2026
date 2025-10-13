# 🤖 Intégration IA Agentique - Agent Elea

## 📝 Historique du document

| Date | Version | Lignes | Modifications | Auteur |
|------|---------|--------|---------------|--------|
| 2025-01-11 | 1.0 | 844 | Création guide intégration agent IA Elea | Claude |

---

## 📌 Vue d'ensemble

Ce document explique comment intégrer l'IA agentique sur la plateforme Trophenix. L'agent **Elea** accompagne les utilisateurs tout au long de leur parcours (onboarding, navigation, conseils).

---

## 🎯 Concept : Agent Elea

**Elea** est l'assistant IA de Trophenix qui :
- 🗣️ Guide l'utilisateur étape par étape lors de l'inscription
- 💡 Donne des conseils contextuels
- 🎨 Aide à remplir les formulaires
- 📊 Propose des recommandations personnalisées
- 🔍 Répond aux questions en temps réel

### Stratégie V1 / V2

```
┌─────────────────────────────────────┐
│  V1 - Agent préparé mais invisible  │
│  ✅ Code intégré                     │
│  ✅ Design prêt                      │
│  ❌ Caché via config                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  V2 - Agent activé                   │
│  ✅ Un simple toggle dans config     │
│  ✅ Pas de redesign nécessaire       │
│  ✅ Gain de temps énorme             │
└─────────────────────────────────────┘
```

---

## 🏗️ Architecture de l'Agent

### Structure des fichiers

```
src/
├── components/
│   └── AI/
│       ├── AgentElea.tsx          # Composant principal de l'agent
│       ├── ChatBubble.tsx         # Bulle de message
│       ├── AgentAvatar.tsx        # Avatar animé
│       └── AgentButton.tsx        # Bouton pour ouvrir/fermer
│
├── services/
│   └── agentService.ts            # Service pour communiquer avec l'IA
│
├── hooks/
│   └── useAgent.ts                # Hook React pour utiliser l'agent
│
├── config/
│   └── features.ts                # Configuration des fonctionnalités (V1/V2)
│
└── types/
    └── agent.ts                   # Types TypeScript pour l'agent
```

---

## 🔧 Implémentation

### 1. Configuration des fonctionnalités

**Fichier** : `src/config/features.ts`

```typescript
/**
 * Configuration des fonctionnalités par version
 *
 * Permet d'activer/désactiver des fonctionnalités sans modifier le code
 */

export const FEATURES = {
  /**
   * Agent Elea - Assistant IA
   *
   * V1: false (invisible, mais code présent)
   * V2: true (visible et actif)
   */
  AGENT_ELEA_ENABLED: false,

  /**
   * Chat en temps réel
   */
  REALTIME_CHAT_ENABLED: false,

  /**
   * Recommandations IA
   */
  AI_RECOMMENDATIONS_ENABLED: false,

  /**
   * Analytics avancées
   */
  ADVANCED_ANALYTICS_ENABLED: false,
} as const;

/**
 * Helper pour vérifier si une fonctionnalité est active
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature];
}
```

### 2. Types TypeScript

**Fichier** : `src/types/agent.ts`

```typescript
/**
 * Types pour l'agent IA Elea
 */

/**
 * Message de l'agent
 */
export interface AgentMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'help';
}

/**
 * Contexte de l'agent
 * Informations sur où se trouve l'utilisateur
 */
export interface AgentContext {
  page: string;
  step?: number;
  userType?: 'athlete' | 'company';
  formData?: Record<string, any>;
}

/**
 * Configuration de l'agent
 */
export interface AgentConfig {
  enabled: boolean;
  autoOpen?: boolean;
  showWelcomeMessage?: boolean;
  position?: 'bottom-right' | 'bottom-left';
}

/**
 * Suggestion de l'agent
 */
export interface AgentSuggestion {
  id: string;
  text: string;
  action?: () => void;
}
```

### 3. Service Agent

**Fichier** : `src/services/agentService.ts`

```typescript
/**
 * Service pour communiquer avec l'IA agentique
 *
 * Ce service peut être connecté à :
 * - Une API IA interne
 * - OpenAI, Anthropic Claude, etc.
 * - Un modèle local
 */

import type { AgentMessage, AgentContext, AgentSuggestion } from '../types/agent';

/**
 * URL de l'API IA (à configurer)
 */
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/ai';

export class AgentService {
  /**
   * Envoie un message à l'agent et reçoit une réponse
   *
   * @param message - Message de l'utilisateur
   * @param context - Contexte actuel (page, étape, etc.)
   * @returns Réponse de l'agent
   */
  static async sendMessage(
    message: string,
    context: AgentContext
  ): Promise<string> {
    try {
      const response = await fetch(`${AI_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          message,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur API IA');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Erreur lors de la communication avec l\'agent:', error);
      return this.getFallbackResponse(context);
    }
  }

  /**
   * Obtient des suggestions contextuelles
   *
   * @param context - Contexte actuel
   * @returns Liste de suggestions
   */
  static async getSuggestions(context: AgentContext): Promise<AgentSuggestion[]> {
    try {
      const response = await fetch(`${AI_API_URL}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error('Erreur API IA');
      }

      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      return this.getFallbackSuggestions(context);
    }
  }

  /**
   * Réponse de secours si l'API ne fonctionne pas
   */
  private static getFallbackResponse(context: AgentContext): string {
    const responses = {
      onboarding_athlete: "Je suis là pour vous aider à créer votre profil ! N'hésitez pas à poser des questions.",
      onboarding_company: "Bienvenue ! Je vais vous accompagner dans la création de votre profil entreprise.",
      default: "Je suis Elea, votre assistante. Comment puis-je vous aider ?",
    };

    const key = context.page as keyof typeof responses;
    return responses[key] || responses.default;
  }

  /**
   * Suggestions de secours
   */
  private static getFallbackSuggestions(context: AgentContext): AgentSuggestion[] {
    if (context.page === 'onboarding_athlete' && context.step === 1) {
      return [
        { id: '1', text: 'Quels sports puis-je choisir ?' },
        { id: '2', text: 'Comment décrire ma situation ?' },
        { id: '3', text: 'Aide-moi à remplir cette étape' },
      ];
    }

    return [
      { id: '1', text: 'Comment ça marche ?' },
      { id: '2', text: 'J\'ai besoin d\'aide' },
    ];
  }

  /**
   * Obtient le message de bienvenue contextuel
   */
  static getWelcomeMessage(context: AgentContext): string {
    const welcomeMessages = {
      onboarding_athlete: "Bonjour ! Je suis Elea 👋\n\nJe vais vous accompagner dans votre inscription. Je suis là pour répondre à vos questions et vous guider à chaque étape !",
      onboarding_company: "Bienvenue ! Je suis Elea 👋\n\nJe vais vous aider à créer votre profil entreprise. N'hésitez pas à me solliciter si vous avez des questions !",
      default: "Bonjour ! Je suis Elea, votre assistante Trophenix 👋\n\nComment puis-je vous aider aujourd'hui ?",
    };

    const key = context.page as keyof typeof welcomeMessages;
    return welcomeMessages[key] || welcomeMessages.default;
  }
}
```

### 4. Hook React

**Fichier** : `src/hooks/useAgent.ts`

```typescript
/**
 * Hook pour utiliser l'agent Elea dans les composants
 */

import { useState, useCallback } from 'react';
import { AgentService } from '../services/agentService';
import type { AgentMessage, AgentContext, AgentSuggestion } from '../types/agent';

export function useAgent(context: AgentContext) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [suggestions, setSuggestions] = useState<AgentSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Envoie un message à l'agent
   */
  const sendMessage = useCallback(
    async (content: string) => {
      // Ajouter le message de l'utilisateur
      const userMessage: AgentMessage = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Obtenir la réponse de l'agent
        const response = await AgentService.sendMessage(content, context);

        const agentMessage: AgentMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'agent',
          timestamp: new Date(),
          type: 'text',
        };

        setMessages((prev) => [...prev, agentMessage]);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  /**
   * Charge les suggestions contextuelles
   */
  const loadSuggestions = useCallback(async () => {
    try {
      const newSuggestions = await AgentService.getSuggestions(context);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Erreur lors du chargement des suggestions:', error);
    }
  }, [context]);

  /**
   * Initialise l'agent avec un message de bienvenue
   */
  const initialize = useCallback(() => {
    const welcomeMessage: AgentMessage = {
      id: 'welcome',
      content: AgentService.getWelcomeMessage(context),
      sender: 'agent',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages([welcomeMessage]);
    loadSuggestions();
  }, [context, loadSuggestions]);

  /**
   * Ouvre/ferme l'agent
   */
  const toggleAgent = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    messages,
    suggestions,
    isLoading,
    isOpen,
    sendMessage,
    loadSuggestions,
    initialize,
    toggleAgent,
  };
}
```

### 5. Composant Agent Elea

**Fichier** : `src/components/AI/AgentElea.tsx`

```typescript
/**
 * Composant Agent Elea
 *
 * Assistant IA qui accompagne l'utilisateur
 */

import { useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAgent } from '../../hooks/useAgent';
import { isFeatureEnabled } from '../../config/features';
import type { AgentContext } from '../../types/agent';

interface AgentEleaProps {
  context: AgentContext;
  position?: 'bottom-right' | 'bottom-left';
}

export function AgentElea({ context, position = 'bottom-right' }: AgentEleaProps) {
  const {
    messages,
    suggestions,
    isLoading,
    isOpen,
    sendMessage,
    initialize,
    toggleAgent,
  } = useAgent(context);

  // Initialiser l'agent au montage
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Si la fonctionnalité n'est pas activée, ne rien afficher
  if (!isFeatureEnabled('AGENT_ELEA_ENABLED')) {
    return null;
  }

  const positionClasses = position === 'bottom-right' ? 'right-6' : 'left-6';

  return (
    <div className={`fixed bottom-6 ${positionClasses} z-50`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold">Elea</h3>
                  <p className="text-xs text-teal-100">Votre assistante</p>
                </div>
              </div>
              <button
                onClick={toggleAgent}
                className="hover:bg-white/20 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-teal-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-500 mb-2">Suggestions :</p>
              <div className="space-y-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => sendMessage(suggestion.text)}
                    className="w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-gray-700"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem(
                  'message'
                ) as HTMLInputElement;
                if (input.value.trim()) {
                  sendMessage(input.value);
                  input.value = '';
                }
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                name="message"
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleAgent}
        className="w-14 h-14 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition" />
        )}
      </button>
    </div>
  );
}
```

---

## 🔌 Intégration dans l'Onboarding

### Exemple : AthleteOnboarding.tsx

```typescript
import { AgentElea } from '../AI/AgentElea';

export function AthleteOnboarding({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div>
      {/* Votre formulaire existant */}

      {/* Agent Elea - Contextuel à chaque étape */}
      <AgentElea
        context={{
          page: 'onboarding_athlete',
          step: currentStep,
          userType: 'athlete',
        }}
        position="bottom-right"
      />
    </div>
  );
}
```

---

## 🎨 Activation V1 → V2

### Pour activer l'agent en V2 :

**1. Modifier `src/config/features.ts`** :
```typescript
export const FEATURES = {
  AGENT_ELEA_ENABLED: true, // ← Passer de false à true
  // ...
};
```

**C'est tout ! Aucune autre modification nécessaire.**

---

## 🚀 Backend IA

### Option 1 : API Django avec OpenAI

```python
# apps/ai/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
import openai

@api_view(['POST'])
def chat(request):
    """
    Endpoint pour communiquer avec l'agent
    """
    message = request.data.get('message')
    context = request.data.get('context')

    # Construire le prompt avec contexte
    system_prompt = f"""
    Tu es Elea, l'assistante virtuelle de Trophenix.
    Contexte actuel :
    - Page : {context['page']}
    - Étape : {context.get('step', 'N/A')}
    - Type utilisateur : {context.get('userType', 'N/A')}

    Ton rôle est d'aider l'utilisateur de manière claire et concise.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )

    return Response({
        'response': response.choices[0].message.content
    })


@api_view(['POST'])
def suggestions(request):
    """
    Génère des suggestions contextuelles
    """
    context = request.data.get('context')

    suggestions = []

    if context['page'] == 'onboarding_athlete':
        if context.get('step') == 1:
            suggestions = [
                {'id': '1', 'text': 'Quels sports puis-je choisir ?'},
                {'id': '2', 'text': 'Que signifie "situation" ?'},
                {'id': '3', 'text': 'Aide-moi à remplir cette section'},
            ]
        elif context.get('step') == 2:
            suggestions = [
                {'id': '1', 'text': 'Qu\'est-ce que la liste ministérielle ?'},
                {'id': '2', 'text': 'Comment décrire mon niveau sportif ?'},
            ]

    return Response({'suggestions': suggestions})
```

### Option 2 : Anthropic Claude

```python
import anthropic

client = anthropic.Anthropic(api_key="votre_cle")

def chat_with_claude(message, context):
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"Contexte: {context}\n\nQuestion: {message}"
            }
        ]
    )
    return response.content[0].text
```

### Option 3 : IA Agentique Personnalisée

Si vous développez votre propre IA agentique :

```python
# apps/ai/agent.py
class EleaAgent:
    """
    Agent IA personnalisé pour Trophenix
    """

    def __init__(self):
        self.memory = {}
        self.context_history = []

    def process_message(self, message, context, user_id):
        """
        Traite un message avec contexte et mémoire
        """
        # Récupérer l'historique
        history = self.get_user_history(user_id)

        # Analyser le contexte
        intent = self.analyze_intent(message, context)

        # Générer la réponse
        response = self.generate_response(intent, context, history)

        # Sauvegarder dans la mémoire
        self.save_to_memory(user_id, message, response, context)

        return response

    def analyze_intent(self, message, context):
        """Analyse l'intention de l'utilisateur"""
        # Votre logique d'analyse
        pass

    def generate_response(self, intent, context, history):
        """Génère une réponse adaptée"""
        # Votre logique de génération
        pass
```

---

## 📊 Analytics de l'Agent

### Tracking des interactions

```typescript
// src/services/analyticsService.ts

export class AnalyticsService {
  /**
   * Track une interaction avec l'agent
   */
  static trackAgentInteraction(data: {
    userId?: string;
    message: string;
    context: AgentContext;
    responseTime: number;
  }) {
    // Envoyer à votre système d'analytics
    fetch('/api/analytics/agent-interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}
```

---

## ✅ Checklist d'Intégration

### Phase 1 : Préparation (V1)
- [x] Créer la structure de fichiers
- [x] Créer les types TypeScript
- [x] Créer le service agent
- [x] Créer le hook useAgent
- [x] Créer le composant AgentElea
- [x] Créer le système de configuration (features.ts)
- [x] Intégrer dans l'onboarding
- [x] Définir AGENT_ELEA_ENABLED = false

### Phase 2 : Backend IA
- [ ] Créer l'endpoint /api/ai/chat
- [ ] Créer l'endpoint /api/ai/suggestions
- [ ] Connecter à l'API IA (OpenAI, Claude, ou custom)
- [ ] Implémenter la mémoire conversationnelle
- [ ] Ajouter les analytics

### Phase 3 : Activation (V2)
- [ ] Tester l'agent en interne
- [ ] Affiner les réponses contextuelles
- [ ] Définir AGENT_ELEA_ENABLED = true
- [ ] Déployer
- [ ] Monitorer les interactions

---

## 🎯 Avantages de cette Architecture

| Aspect | Bénéfice |
|--------|----------|
| **Préparation V1** | Tout est prêt, caché derrière un flag |
| **Activation V2** | Un seul toggle à changer |
| **Gain de temps** | Pas de redesign ni redéveloppement |
| **Testabilité** | Peut être testé en V1 avec le flag activé |
| **Scalabilité** | Facile d'ajouter de nouvelles fonctionnalités |
| **Maintenance** | Code propre et séparé |

---

## 💡 Idées d'Amélioration Futures

1. **Proactivité** : L'agent détecte quand l'utilisateur est bloqué
2. **Personnalisation** : Adaptation au profil (athlète débutant vs expert)
3. **Multilingue** : Détection et réponse dans la langue de l'utilisateur
4. **Vocal** : Interaction vocale avec l'agent
5. **Avatar animé** : Personnage 3D qui parle

---

## 🤝 Architecture Multi-Agents (V2+)

### Vue d'Ensemble

L'architecture actuelle supporte **plusieurs agents spécialisés** qui peuvent collaborer :

```
┌─────────────────────────────────────────────────────────┐
│                    ORCHESTRATEUR                        │
│              (Routage & Handoff Management)             │
└───┬──────────────┬──────────────┬──────────────┬────────┘
    │              │              │              │
┌───▼────┐   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
│ Elea   │   │Recruiter│   │ Career  │   │  Admin  │
│(Général)│◄─►│  Bot   │◄─►│ Advisor │◄─►│   Bot   │
│        │   │(Matching)│   │(Conseil)│   │  (Admin)│
└────────┘   └─────────┘   └─────────┘   └─────────┘
     │            │             │             │
     └────────────┴─────────────┴─────────────┘
                  │
            Contexte Partagé
```

### Agents Disponibles

#### 1. **Elea** (Activé en V1)
- **Rôle** : Assistant général
- **Capacités** :
  - Guide d'onboarding
  - Questions générales
  - Navigation
  - FAQ

#### 2. **RecruiterBot** (V2+)
- **Rôle** : Agent recruteur
- **Capacités** :
  - Matching athlètes/entreprises
  - Recommandations de profils
  - Analyse de compétences
  - Insights marché

#### 3. **CareerAdvisor** (V2+)
- **Rôle** : Conseiller carrière
- **Capacités** :
  - Conseils de reconversion
  - Évaluation de compétences
  - Recommandations de formation
  - Planification de transition

#### 4. **AdminBot** (V2+)
- **Rôle** : Assistant administrateur
- **Capacités** :
  - Gestion utilisateurs
  - Workflow de validation
  - Analytics plateforme
  - Support modération

### Routage Automatique

```typescript
// Exemple : Routage intelligent selon le message
const message = "Je cherche un poste dans le commercial";

// L'orchestrateur analyse :
// 1. Keywords : "cherche", "poste" → RecruiterBot
// 2. Context : user_type = 'athlete' → Confirmed
// 3. Route vers RecruiterBot automatiquement

// Si RecruiterBot ne peut pas répondre :
// → Handoff vers CareerAdvisor (conseils de reconversion)
```

### Transfert entre Agents (Handoff)

```typescript
// Exemple de conversation multi-agents

User: "Comment remplir ce formulaire ?"
Elea: "Voici comment remplir le formulaire..." ✅

User: "Je cherche un poste dans le marketing sportif"
Elea: "Cette question est mieux traitée par RecruiterBot. Je vous transfère ! 🎯"
RecruiterBot: "Bonjour ! Je vais vous aider à trouver des opportunités..." ✅

User: "Quelles formations suivre pour me reconvertir ?"
RecruiterBot: "Je vous mets en contact avec CareerAdvisor, expert en reconversion ! 📈"
CareerAdvisor: "Excellent ! Pour votre reconversion, je recommande..." ✅
```

### Configuration Multi-Agents

**Fichier** : `src/config/agents.ts`

```typescript
export const AGENTS_CONFIG = {
  elea: {
    enabled: true,  // V1
    capabilities: ['onboarding', 'faq', 'navigation'],
    canHandoff: true,
    handoffTargets: ['recruiter', 'career_advisor'],
  },
  recruiter: {
    enabled: false, // V2+
    capabilities: ['matching', 'recommendations'],
    canHandoff: true,
    handoffTargets: ['career_advisor', 'elea'],
  },
  // ...
};
```

### Avantages de cette Architecture

| Aspect | Bénéfice |
|--------|----------|
| **Spécialisation** | Chaque agent est expert dans son domaine |
| **Scalabilité** | Ajouter un agent = ajouter sa config |
| **Maintenance** | Modifier un agent n'affecte pas les autres |
| **Qualité** | Réponses plus précises par agent spécialisé |
| **Flexibilité** | Activer/désactiver des agents selon les besoins |
| **Collaboration** | Les agents se passent le relais intelligemment |

### Implémentation

**Types** : `src/types/agents.ts` ✅
**Config** : `src/config/agents.ts` ✅
**Orchestration** : À implémenter dans `src/services/agents/orchestrator.ts`

---

## 🔐 Sécurité & Déploiement

### Documentation Complète

Pour la sécurité, le déploiement, le monitoring, et les coûts, consultez :

📄 **[z_README_AI_DEPLOYMENT_SECURITY.md](./z_README_AI_DEPLOYMENT_SECURITY.md)**

Ce document couvre :
- ✅ Architecture de déploiement complète
- ✅ Sécurité (auth, validation, chiffrement)
- ✅ Performance & scalabilité (caching, queue)
- ✅ Monitoring & alertes (Prometheus, logs)
- ✅ Coûts & budget (OpenAI, Claude, infra)
- ✅ Conformité RGPD
- ✅ Disaster recovery

---

✅ **L'agent Elea est prêt pour V1 (invisible) et V2 (visible) !**
✅ **Architecture multi-agents scalable pour V2+ !**
✅ **Documentation complète de déploiement et sécurité !**
