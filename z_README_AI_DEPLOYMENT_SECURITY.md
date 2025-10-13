# 🚀 Déploiement & Sécurité - Agent IA Elea

## 📋 Table des matières

- [Architecture de Déploiement](#architecture-de-déploiement)
- [Sécurité](#sécurité)
- [Performance & Scalabilité](#performance--scalabilité)
- [Monitoring & Observabilité](#monitoring--observabilité)
- [Coûts & Budget](#coûts--budget)
- [Conformité & RGPD](#conformité--rgpd)
- [Disaster Recovery](#disaster-recovery)

---

## 🏗️ Architecture de Déploiement

### Vue d'ensemble

```
┌──────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel/Netlify)                │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  AgentElea.tsx │  │  useAgent.ts   │  │ agentService.ts│ │
│  │  (UI Component)│  │     (Hook)     │  │    (Client)    │ │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘ │
│           │                   │                    │          │
│           └───────────────────┴────────────────────┘          │
│                               │                               │
└───────────────────────────────┼───────────────────────────────┘
                                │ HTTPS/WSS
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                      BACKEND API (Django/Express)            │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Gateway / Load Balancer              │   │
│  │              (NGINX, AWS ALB, Cloudflare)             │   │
│  └─────────────────────┬────────────────────────────────┘   │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐   │
│  │           Rate Limiting & Authentication              │   │
│  │           (JWT Validation, API Keys)                  │   │
│  └─────────────────────┬────────────────────────────────┘   │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐   │
│  │              Agent Orchestrator                        │   │
│  │        (Routing, Handoff, Context Management)         │   │
│  └────┬─────────────┬─────────────┬─────────────┬──────┘   │
│       │             │             │             │            │
│  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐       │
│  │  Elea   │  │Recruiter│  │ Career  │  │  Admin  │       │
│  │ Service │  │   Bot   │  │ Advisor │  │   Bot   │       │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │
│       │            │            │             │             │
└───────┼────────────┼────────────┼─────────────┼─────────────┘
        │            │            │             │
        └────────────┴────────────┴─────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                    IA SERVICE LAYER                          │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   OpenAI API   │  │ Anthropic      │  │  Custom Model  │ │
│  │   (GPT-4)      │  │  (Claude)      │  │   (Ollama)     │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│                    DATA & STORAGE LAYER                      │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   PostgreSQL   │  │     Redis      │  │   S3/Storage   │ │
│  │ (User Data,    │  │  (Cache,       │  │  (Logs,        │ │
│  │  Conversations)│  │   Sessions)    │  │   Analytics)   │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Sécurité

### 1. Authentification & Autorisation

#### Frontend → Backend

**JWT Bearer Token**
```typescript
// src/services/agentService.ts
const token = localStorage.getItem('jwt_token');

headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

**Validation Backend (Django)**
```python
# middleware/auth.py
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class AgentChatView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  # ✅ Utilisateur authentifié
        # ...
```

#### Backend → IA API

**API Keys dans Variables d'Environnement**
```python
# settings.py
import os

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')

# ⚠️ JAMAIS dans le code !
# ⚠️ JAMAIS dans Git !
# ✅ Uniquement dans .env ou secrets manager
```

---

### 2. Protection des Données Sensibles

#### Données à NE JAMAIS Envoyer à l'IA

```typescript
// ❌ MAUVAIS - Envoie des données sensibles
const message = `Mon email est ${user.email} et mon mot de passe est ${password}`;

// ✅ BON - Filtre les données sensibles
function sanitizeUserInput(message: string): string {
  // Retirer emails
  message = message.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL_MASQUÉ]');

  // Retirer numéros de téléphone
  message = message.replace(/\d{10}/g, '[TÉLÉPHONE_MASQUÉ]');

  // Retirer numéros de carte bancaire
  message = message.replace(/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g, '[CARTE_MASQUÉE]');

  return message;
}
```

#### Anonymisation Backend

```python
# services/ai_service.py
def prepare_context_for_ai(context, user):
    """
    Prépare le contexte en anonymisant les données sensibles
    """
    safe_context = {
        'page': context.get('page'),
        'step': context.get('step'),
        'user_type': user.user_type,
        # ⚠️ NE PAS inclure :
        # - Email
        # - Nom complet
        # - Numéro de téléphone
        # - Adresse
        # - Données bancaires
    }

    return safe_context
```

---

### 3. Rate Limiting

#### Frontend (Protection DDoS)

```typescript
// src/services/agentService.ts
class RateLimiter {
  private requests: number[] = [];
  private maxRequests = 10; // 10 requêtes
  private timeWindow = 60000; // par minute

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }
}

const rateLimiter = new RateLimiter();

export class AgentService {
  static async sendMessage(message: string, context: AgentContext) {
    if (!rateLimiter.canMakeRequest()) {
      throw new Error('Trop de requêtes. Veuillez patienter.');
    }
    // ...
  }
}
```

#### Backend (Django)

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10/minute',  # Non authentifiés : 10 req/min
        'user': '100/minute', # Authentifiés : 100 req/min
    }
}

# Pour l'agent IA spécifiquement
AI_AGENT_RATE_LIMIT = '50/minute'  # 50 messages par minute max
```

---

### 4. Validation des Entrées

#### Frontend

```typescript
// src/utils/validation.ts
export function validateAgentMessage(message: string): {
  valid: boolean;
  error?: string
} {
  // Longueur max
  if (message.length > 1000) {
    return {
      valid: false,
      error: 'Message trop long (max 1000 caractères)'
    };
  }

  // Pas de caractères dangereux (XSS)
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onclick=/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(message)) {
      return {
        valid: false,
        error: 'Caractères interdits détectés'
      };
    }
  }

  return { valid: true };
}
```

#### Backend

```python
# validators.py
from django.core.exceptions import ValidationError
import re

def validate_agent_message(message):
    """
    Valide le message de l'utilisateur
    """
    # Longueur
    if len(message) > 1000:
        raise ValidationError('Message trop long')

    # Injection SQL
    sql_patterns = [
        r'(DROP|DELETE|INSERT|UPDATE)\s+(TABLE|FROM)',
        r'(--|#)',  # SQL comments
    ]

    for pattern in sql_patterns:
        if re.search(pattern, message, re.IGNORECASE):
            raise ValidationError('Contenu interdit détecté')

    return message
```

---

### 5. Chiffrement

#### En Transit (HTTPS)

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.trophenix.com;

    # Certificat SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/trophenix.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/trophenix.com/privkey.pem;

    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

#### Au Repos (Database)

```python
# Django settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'trophenix_db',
        'OPTIONS': {
            'sslmode': 'require',  # ✅ SSL obligatoire
        },
    }
}

# Chiffrement des données sensibles
from cryptography.fernet import Fernet

class EncryptedConversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    encrypted_content = models.BinaryField()  # Chiffré
    created_at = models.DateTimeField(auto_now_add=True)

    def save_message(self, message):
        cipher = Fernet(settings.ENCRYPTION_KEY)
        self.encrypted_content = cipher.encrypt(message.encode())
        self.save()

    def get_message(self):
        cipher = Fernet(settings.ENCRYPTION_KEY)
        return cipher.decrypt(self.encrypted_content).decode()
```

---

## 📊 Performance & Scalabilité

### 1. Caching

#### Redis pour les Réponses Fréquentes

```python
# services/cache_service.py
import redis
import hashlib
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_response(message, context):
    """
    Récupère une réponse en cache si elle existe
    """
    # Créer une clé unique
    cache_key = hashlib.md5(
        f"{message}:{context.get('page')}:{context.get('step')}".encode()
    ).hexdigest()

    cached = redis_client.get(f'agent_response:{cache_key}')
    if cached:
        return json.loads(cached)

    return None

def cache_response(message, context, response, ttl=3600):
    """
    Met en cache une réponse (TTL: 1h par défaut)
    """
    cache_key = hashlib.md5(
        f"{message}:{context.get('page')}:{context.get('step')}".encode()
    ).hexdigest()

    redis_client.setex(
        f'agent_response:{cache_key}',
        ttl,
        json.dumps(response)
    )
```

### 2. Queue System (Celery)

```python
# tasks.py
from celery import shared_task
import openai

@shared_task
def process_agent_message_async(message, context, user_id):
    """
    Traite le message de manière asynchrone
    """
    # Appel à l'API IA (peut prendre du temps)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Tu es Elea..."},
            {"role": "user", "content": message}
        ]
    )

    # Sauvegarder la réponse
    Conversation.objects.create(
        user_id=user_id,
        message=message,
        response=response.choices[0].message.content
    )

    # Notifier via WebSocket
    notify_user(user_id, response)

    return response
```

### 3. Load Balancing

```yaml
# docker-compose.yml
version: '3.8'

services:
  api_1:
    build: .
    environment:
      - INSTANCE_ID=1

  api_2:
    build: .
    environment:
      - INSTANCE_ID=2

  api_3:
    build: .
    environment:
      - INSTANCE_ID=3

  load_balancer:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api_1
      - api_2
      - api_3
```

---

## 📈 Monitoring & Observabilité

### 1. Logging

```python
# settings.py
LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': '/var/log/trophenix/agent.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'agent': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    },
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
}

# Usage
import logging
logger = logging.getLogger('agent')

logger.info(f'User {user_id} sent message to agent {agent_type}')
logger.warning(f'High latency detected: {latency}ms')
logger.error(f'Agent API error: {error}')
```

### 2. Métriques (Prometheus)

```python
# metrics.py
from prometheus_client import Counter, Histogram, Gauge

# Compteurs
agent_requests_total = Counter(
    'agent_requests_total',
    'Total number of agent requests',
    ['agent_type', 'status']
)

# Histogrammes (latence)
agent_response_duration = Histogram(
    'agent_response_duration_seconds',
    'Agent response time',
    ['agent_type']
)

# Jauges (état)
active_conversations = Gauge(
    'active_conversations',
    'Number of active conversations'
)

# Usage dans le code
with agent_response_duration.labels(agent_type='elea').time():
    response = call_ai_api(message)

agent_requests_total.labels(agent_type='elea', status='success').inc()
```

### 3. Alertes

```yaml
# prometheus/alerts.yml
groups:
  - name: agent_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(agent_requests_total{status="error"}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "Taux d'erreur élevé sur l'agent"

      - alert: HighLatency
        expr: histogram_quantile(0.95, agent_response_duration_seconds) > 5
        for: 10m
        annotations:
          summary: "Latence élevée (p95 > 5s)"

      - alert: RateLimitExceeded
        expr: rate(rate_limit_exceeded_total[1m]) > 10
        for: 2m
        annotations:
          summary: "Trop de requêtes bloquées (rate limit)"
```

---

## 💰 Coûts & Budget

### Estimation des Coûts (Mensuel)

#### OpenAI GPT-4

| Métrique | Volume | Prix Unitaire | Coût Mensuel |
|----------|--------|---------------|--------------|
| Messages entrants | 100k | $0.03/1k tokens (~400 mots) | $300 |
| Messages sortants | 100k | $0.06/1k tokens | $600 |
| **Total OpenAI** | | | **$900** |

#### Anthropic Claude

| Métrique | Volume | Prix Unitaire | Coût Mensuel |
|----------|--------|---------------|--------------|
| Messages (Claude 3 Sonnet) | 100k | $0.003/1k tokens | $30 |
| **Total Anthropic** | | | **$30** |

#### Infrastructure

| Service | Coût Mensuel |
|---------|--------------|
| Backend API (AWS EC2 t3.medium) | $50 |
| Redis Cache (ElastiCache) | $30 |
| PostgreSQL (RDS) | $80 |
| Load Balancer | $20 |
| Monitoring (Datadog/Grafana) | $50 |
| **Total Infrastructure** | **$230** |

**TOTAL MENSUEL : ~$1,160** (pour 100k messages/mois)

---

## 📜 Conformité & RGPD

### 1. Consentement Utilisateur

```typescript
// Lors de la première utilisation
const AgentConsentModal = () => {
  return (
    <div className="modal">
      <h2>Utilisation de l'Assistant IA</h2>
      <p>
        Notre assistant Elea utilise l'intelligence artificielle pour vous aider.
        Vos conversations peuvent être analysées pour améliorer le service.
      </p>
      <ul>
        <li>✅ Vos données ne sont jamais vendues</li>
        <li>✅ Conversations chiffrées</li>
        <li>✅ Suppression possible à tout moment</li>
      </ul>
      <button onClick={acceptConsent}>J'accepte</button>
      <button onClick={refuseConsent}>Je refuse</button>
    </div>
  );
};
```

### 2. Droit à l'Oubli

```python
# views.py
class DeleteAgentConversations(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """
        Supprime toutes les conversations de l'utilisateur
        """
        user = request.user

        # Supprimer de la DB
        Conversation.objects.filter(user=user).delete()

        # Supprimer du cache
        redis_client.delete(f'user_conversations:{user.id}')

        # Logger l'action (RGPD)
        logger.info(f'User {user.id} deleted all agent conversations')

        return Response({'message': 'Conversations supprimées'})
```

### 3. Transparence IA

```typescript
// Afficher à l'utilisateur
<div className="agent-disclaimer">
  <InfoIcon />
  <p>
    Les réponses sont générées par IA et peuvent contenir des erreurs.
    Vérifiez toujours les informations importantes.
  </p>
</div>
```

---

## 🆘 Disaster Recovery

### 1. Backup Conversations

```bash
# Backup quotidien automatique
0 2 * * * pg_dump trophenix_db -t conversations > /backups/conversations_$(date +\%Y\%m\%d).sql
```

### 2. Fallback si API IA Down

```python
# services/agent_service.py
def get_ai_response(message, context):
    try:
        # Essayer l'API principale (OpenAI)
        return call_openai_api(message, context)
    except Exception as e:
        logger.error(f'OpenAI API failed: {e}')

        try:
            # Fallback 1 : Anthropic
            return call_anthropic_api(message, context)
        except Exception as e2:
            logger.error(f'Anthropic API failed: {e2}')

            # Fallback 2 : Réponses locales
            return get_local_fallback_response(context)
```

### 3. Circuit Breaker

```python
# circuit_breaker.py
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=60)
def call_ai_api(message):
    """
    Si 5 échecs consécutifs → circuit ouvert pendant 60s
    Évite de surcharger une API en panne
    """
    response = requests.post(AI_API_URL, json={'message': message})
    response.raise_for_status()
    return response.json()
```

---

## ✅ Checklist Déploiement Production

### Pré-Déploiement

- [ ] Variables d'environnement configurées (.env)
- [ ] API keys IA valides et testées
- [ ] Certificats SSL configurés (HTTPS)
- [ ] Rate limiting activé
- [ ] Logging configuré
- [ ] Monitoring configuré (Prometheus/Grafana)
- [ ] Alertes configurées
- [ ] Backups automatiques configurés
- [ ] Tests de charge effectués
- [ ] Documentation à jour

### Post-Déploiement

- [ ] Vérifier les logs (pas d'erreurs critiques)
- [ ] Tester l'agent en production
- [ ] Monitorer les métriques (latence, taux d'erreur)
- [ ] Vérifier les coûts IA (budget respecté)
- [ ] Tester le fallback (couper l'API IA)
- [ ] Tester la charge (100 utilisateurs simultanés)

---

**✅ Avec cette architecture, l'agent Elea est production-ready, sécurisé, et scalable !**
