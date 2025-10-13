# 🤖 Architecture Multi-Agents - Guide Développeur

## 🎯 Objectif

Ce document explique l'architecture **multi-agents scalable** de Trophenix, conçue pour supporter plusieurs agents IA qui collaborent intelligemment.

---

## 📊 Vue d'Ensemble

### Architecture Actuelle

```
FRONTEND (React/TypeScript)
    ↓
ORCHESTRATEUR (Routage intelligent)
    ↓
┌───────────┬───────────┬───────────┬───────────┐
│   Elea    │ Recruiter │  Career   │   Admin   │
│ (V1 ✅)   │  (V2 📅)  │  (V2 📅)  │  (V2 📅)  │
└───────────┴───────────┴───────────┴───────────┘
    ↓
BACKEND IA (OpenAI, Claude, Custom)
```

### Pourquoi Multi-Agents ?

| Problème | Solution Multi-Agents |
|----------|----------------------|
| **Agent généraliste peu précis** | Agents spécialisés par domaine |
| **Scalabilité limitée** | Ajout facile de nouveaux agents |
| **Maintenance complexe** | Chaque agent isolé et indépendant |
| **Expérience utilisateur** | L'utilisateur est toujours dirigé vers le bon expert |

---

## 🏗️ Structure des Fichiers

### Fichiers Créés

```
src/
├── config/
│   ├── features.ts           # ✅ Feature flags (V1/V2)
│   └── agents.ts             # ✅ Configuration multi-agents
│
├── types/
│   ├── agent.ts              # ✅ Types pour Elea (V1)
│   └── agents.ts             # ✅ Types multi-agents (V2)
│
├── services/
│   ├── agentService.ts       # ✅ Service Elea (V1)
│   └── agents/               # 📁 Services par agent (V2)
│       ├── orchestrator.ts   # À implémenter
│       ├── recruiterService.ts
│       ├── careerService.ts
│       └── adminService.ts
│
├── hooks/
│   └── useAgent.ts           # ✅ Hook React pour Elea
│
└── components/
    └── AI/
        ├── AgentElea.tsx     # ✅ Composant UI Elea
        └── MultiAgentChat.tsx # Composant multi-agents (V2)
```

---

## 🔧 Configuration des Agents

### Fichier : `src/config/agents.ts`

```typescript
export const AGENTS_CONFIG: Record<AgentType, AgentConfig> = {
  elea: {
    type: 'elea',
    name: 'Elea',
    role: 'general_assistant',
    avatar: '🤖',
    enabled: true, // ✅ Activé en V1
    capabilities: [
      'onboarding_assistance',
      'general_questions',
      'form_help',
    ],
    canHandoff: true, // Peut transférer vers d'autres agents
    handoffTargets: ['recruiter', 'career_advisor'],
  },

  recruiter: {
    type: 'recruiter',
    name: 'RecruiterBot',
    role: 'recruiter',
    avatar: '🎯',
    enabled: false, // 📅 V2
    capabilities: [
      'profile_matching',
      'candidate_recommendation',
    ],
    canHandoff: true,
    handoffTargets: ['career_advisor', 'elea'],
  },

  // ... autres agents
};
```

### Helpers Disponibles

```typescript
// Vérifier si un agent est activé
if (isAgentEnabled('recruiter')) {
  // ...
}

// Obtenir la config d'un agent
const config = getAgentConfig('elea');

// Routage automatique
const agent = routeToAgent(userMessage, context);
// → 'elea', 'recruiter', 'career_advisor', ou 'admin_assistant'

// Décider du transfert
const decision = shouldHandoff('elea', message, confidence);
if (decision.shouldHandoff) {
  console.log(`Transfert vers ${decision.targetAgent}`);
}
```

---

## 🔄 Flux de Communication

### 1. Message Simple (Sans Transfert)

```
┌──────┐       ┌──────────┐       ┌──────┐       ┌─────┐
│ User │──────▶│ Frontend │──────▶│ Elea │──────▶│ LLM │
└──────┘       └──────────┘       └──────┘       └─────┘
   ▲                                   │             │
   │                                   │             │
   └───────────────────────────────────┴─────────────┘
           "Voici comment remplir le formulaire..."
```

### 2. Message avec Transfert (Handoff)

```
┌──────┐       ┌──────────┐       ┌──────┐
│ User │──────▶│ Frontend │──────▶│ Elea │
└──────┘       └──────────┘       └──────┘
   ▲                                   │
   │                                   │ Détecte : besoin de RecruiterBot
   │                                   ▼
   │                              ┌──────────────┐
   │                              │ Orchestrator │
   │                              └──────────────┘
   │                                   │
   │                                   ▼
   │                              ┌───────────┐       ┌─────┐
   │                              │ Recruiter │──────▶│ LLM │
   │                              └───────────┘       └─────┘
   │                                   │                 │
   └───────────────────────────────────┴─────────────────┘
      "Je vous transfère à RecruiterBot ! Voici des profils..."
```

---

## 🚀 Ajouter un Nouvel Agent (Guide Pas à Pas)

### Exemple : Ajouter "FitnessBot" (conseils nutrition/entraînement)

#### Étape 1 : Définir le Type

```typescript
// src/types/agents.ts
export type AgentType =
  | 'elea'
  | 'recruiter'
  | 'career_advisor'
  | 'admin_assistant'
  | 'fitness_bot'; // ← Nouveau
```

#### Étape 2 : Ajouter la Configuration

```typescript
// src/config/agents.ts
export const AGENTS_CONFIG = {
  // ... agents existants

  fitness_bot: {
    type: 'fitness_bot',
    name: 'FitnessBot',
    role: 'fitness_advisor' as AgentRole, // Ajouter aussi dans les types
    avatar: '💪',
    description: 'Expert en nutrition et préparation physique',
    enabled: false, // V3
    apiEndpoint: '/api/ai/agents/fitness/chat',
    capabilities: [
      'nutrition_advice',
      'training_plans',
      'injury_prevention',
      'recovery_tips',
    ],
    priority: 2,
    canHandoff: true,
    handoffTargets: ['elea', 'career_advisor'],
  },
};
```

#### Étape 3 : Créer le Service

```typescript
// src/services/agents/fitnessService.ts
export class FitnessService {
  static async chat(message: string, context: AgentContext): Promise<string> {
    try {
      const response = await fetch('/api/ai/agents/fitness/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      // Fallback local
      return getFallbackFitnessResponse(context);
    }
  }

  static getFallbackFitnessResponse(context: AgentContext): string {
    return "Je suis FitnessBot ! Je peux vous aider avec votre nutrition et entraînement.";
  }
}
```

#### Étape 4 : Ajouter le Routage

```typescript
// src/config/agents.ts - fonction routeToAgent()
export function routeToAgent(message: string, context: any): AgentType {
  const messageLower = message.toLowerCase();

  // ... autres routages

  // Keywords pour FitnessBot
  const fitnessKeywords = [
    'nutrition',
    'entraînement',
    'alimentation',
    'blessure',
    'récupération',
    'condition physique',
    'régime',
    'musculation',
  ];

  if (
    isAgentEnabled('fitness_bot') &&
    fitnessKeywords.some(keyword => messageLower.includes(keyword))
  ) {
    return 'fitness_bot';
  }

  // Par défaut : Elea
  return 'elea';
}
```

#### Étape 5 : Activer l'Agent

```typescript
// src/config/agents.ts
fitness_bot: {
  enabled: true, // ← Activer
  // ...
}
```

**C'est tout !** Le nouvel agent est opérationnel. 🎉

---

## 📝 Bonnes Pratiques

### 1. Nommage des Agents

```typescript
// ✅ BON
'fitness_bot'
'career_advisor'
'admin_assistant'

// ❌ MAUVAIS
'bot1'
'agent_helper'
'ai_thing'
```

### 2. Définir des Capacités Claires

```typescript
// ✅ BON
capabilities: [
  'nutrition_advice',      // Spécifique
  'training_plans',        // Clair
  'injury_prevention',     // Précis
]

// ❌ MAUVAIS
capabilities: [
  'help',                  // Trop vague
  'answer_questions',      // Trop général
]
```

### 3. Priorités de Routage

```typescript
// Priority = 1 : Agent par défaut (Elea)
// Priority = 2 : Agents spécialisés
// Priority = 3 : Agents admin/support
```

### 4. Gestion des Transferts

```typescript
// ✅ BON : Transférer avec raison claire
{
  shouldHandoff: true,
  targetAgent: 'recruiter',
  reason: 'Cette question concerne le matching de profils. RecruiterBot est plus adapté.',
}

// ❌ MAUVAIS : Transfert sans explication
{
  shouldHandoff: true,
  targetAgent: 'recruiter',
}
```

---

## 🔬 Tests

### Tester un Nouvel Agent

```typescript
// test/agents/fitnessBot.test.ts
import { FitnessService } from '../../services/agents/fitnessService';
import { routeToAgent } from '../../config/agents';

describe('FitnessBot', () => {
  test('Doit répondre aux questions de nutrition', async () => {
    const response = await FitnessService.chat(
      'Que manger avant un match ?',
      { page: 'dashboard', userType: 'athlete' }
    );

    expect(response).toContain('nutrition');
  });

  test('Doit être routé pour les keywords fitness', () => {
    const agent = routeToAgent('Conseils entraînement', {});
    expect(agent).toBe('fitness_bot');
  });

  test('Ne doit pas être routé pour questions générales', () => {
    const agent = routeToAgent('Comment remplir le formulaire ?', {});
    expect(agent).toBe('elea');
  });
});
```

---

## 🔐 Sécurité Multi-Agents

### Isolation des Agents

```typescript
// Chaque agent a son propre endpoint
fitness_bot: {
  apiEndpoint: '/api/ai/agents/fitness/chat',
}

recruiter: {
  apiEndpoint: '/api/ai/agents/recruiter/chat',
}

// Avantage : Rate limiting par agent
// → Si RecruiterBot est spammé, les autres agents continuent de fonctionner
```

### Validation par Agent

```python
# Backend Django
class FitnessBotView(APIView):
    throttle_scope = 'fitness_bot'  # Rate limit spécifique

    def post(self, request):
        # Validation spécifique
        if request.user.user_type != 'athlete':
            return Response(
                {'error': 'FitnessBot réservé aux athlètes'},
                status=403
            )
        # ...
```

---

## 📊 Monitoring Multi-Agents

```python
# Métriques par agent
agent_requests_total.labels(agent_type='elea').inc()
agent_requests_total.labels(agent_type='recruiter').inc()
agent_requests_total.labels(agent_type='fitness_bot').inc()

# Durée par agent
with agent_response_duration.labels(agent_type='fitness_bot').time():
    response = call_fitness_api(message)

# Transferts entre agents
agent_handoffs_total.labels(
    source='elea',
    target='recruiter'
).inc()
```

---

## ✅ Checklist Avant de Déployer un Nouvel Agent

### Technique
- [ ] Type ajouté dans `src/types/agents.ts`
- [ ] Configuration dans `src/config/agents.ts`
- [ ] Service créé dans `src/services/agents/`
- [ ] Routage ajouté dans `routeToAgent()`
- [ ] Tests écrits et passés
- [ ] Documentation mise à jour

### Backend
- [ ] Endpoint API créé
- [ ] Validation des entrées
- [ ] Rate limiting configuré
- [ ] Logs configurés
- [ ] Métriques ajoutées

### Production
- [ ] Agent testé en staging
- [ ] `enabled: false` initialement
- [ ] Activation progressive (A/B test)
- [ ] Monitoring actif
- [ ] Alertes configurées

---

## 🎓 Ressources

### Documentation
- [z_README_AI_AGENT_INTEGRATION.md](./z_README_AI_AGENT_INTEGRATION.md) - Guide complet agent Elea
- [z_README_AI_DEPLOYMENT_SECURITY.md](./z_README_AI_DEPLOYMENT_SECURITY.md) - Déploiement & sécurité
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Intégration backend

### Fichiers Clés
- `src/config/agents.ts` - Configuration centrale
- `src/types/agents.ts` - Types TypeScript
- `src/services/agentService.ts` - Service Elea (référence)

---

✅ **Architecture multi-agents scalable et production-ready !**
