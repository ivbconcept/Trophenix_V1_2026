import { useState } from 'react';
import { Search, BookOpen, MessageCircle, FileText, ChevronDown, ChevronUp, Send, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Comment créer mon profil athlète ?',
    answer: 'Pour créer votre profil athlète, connectez-vous à votre compte, puis accédez à la section "Paramètres". Remplissez toutes les informations demandées : informations personnelles, parcours sportif, résultats, et ajoutez des photos ou vidéos de vos performances.',
    category: 'Compte'
  },
  {
    id: '2',
    question: 'Comment postuler à une offre d\'emploi ?',
    answer: 'Rendez-vous dans la section "Job" puis "Explorer". Parcourez les offres disponibles et cliquez sur celle qui vous intéresse. Cliquez sur "Postuler" et remplissez le formulaire de candidature. Vous pouvez suivre vos candidatures dans "Mes candidatures".',
    category: 'Emploi'
  },
  {
    id: '3',
    question: 'Comment contacter un recruteur ?',
    answer: 'Vous pouvez contacter un recruteur via la messagerie intégrée. Accédez à l\'annuaire des entreprises, sélectionnez l\'entreprise qui vous intéresse, et cliquez sur "Envoyer un message". Assurez-vous que votre profil est complet pour maximiser vos chances de réponse.',
    category: 'Communication'
  },
  {
    id: '4',
    question: 'Comment modifier mes informations personnelles ?',
    answer: 'Allez dans "Paramètres" puis "Informations personnelles". Vous pourrez y modifier votre email, téléphone, adresse, et d\'autres informations. N\'oubliez pas de sauvegarder vos modifications.',
    category: 'Compte'
  },
  {
    id: '5',
    question: 'Qu\'est-ce qu\'Elea et comment l\'utiliser ?',
    answer: 'Elea est votre assistante virtuelle intelligente. Elle peut vous aider à trouver des offres d\'emploi, répondre à vos questions, vous guider dans l\'utilisation de la plateforme, et bien plus encore. Cliquez simplement sur l\'icône Elea dans la barre latérale pour commencer à discuter.',
    category: 'Assistance'
  },
  {
    id: '6',
    question: 'Comment créer mon CV sur la plateforme ?',
    answer: 'Accédez à "Job" puis "Mon CV". Notre outil de création de CV vous guidera étape par étape. Vous pourrez ajouter vos expériences professionnelles, votre parcours sportif, vos formations, et télécharger le résultat en PDF.',
    category: 'Emploi'
  },
  {
    id: '7',
    question: 'Comment rechercher des partenariats de sponsoring ?',
    answer: 'Dans la section "Sponsoring", cliquez sur "Explorer" pour découvrir les marques et entreprises recherchant des athlètes à sponsoriser. Vous pouvez filtrer par sport, secteur d\'activité, et budget. Créez votre média kit pour présenter votre profil aux sponsors potentiels.',
    category: 'Sponsoring'
  },
  {
    id: '8',
    question: 'Comment signaler un problème ou un bug ?',
    answer: 'Si vous rencontrez un problème technique, utilisez le formulaire de contact ci-dessous en sélectionnant "Bug technique" comme sujet. Notre équipe technique vous répondra dans les plus brefs délais.',
    category: 'Support'
  }
];

const guides: GuideItem[] = [
  {
    id: '1',
    title: 'Guide de démarrage rapide',
    description: 'Découvrez comment utiliser Trophenix en 5 minutes',
    icon: BookOpen,
    link: '#'
  },
  {
    id: '2',
    title: 'Optimiser votre profil',
    description: 'Conseils pour créer un profil attractif',
    icon: FileText,
    link: '#'
  },
  {
    id: '3',
    title: 'Réussir sa reconversion',
    description: 'Stratégies pour une transition réussie',
    icon: ExternalLink,
    link: '#'
  }
];

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categories = ['Tous', 'Compte', 'Emploi', 'Sponsoring', 'Communication', 'Assistance', 'Support'];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setFormSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-black dark:via-zinc-950 dark:to-blue-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Centre d'Aide
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400">
            Trouvez des réponses à vos questions et apprenez à utiliser Trophenix
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <a
                key={guide.id}
                href={guide.link}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-zinc-400">
                      {guide.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-blue-500" />
            Questions Fréquentes
          </h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-all hover:border-blue-500 dark:hover:border-blue-500"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {faq.question}
                      </h3>
                      <span className="text-xs text-blue-500 font-medium">{faq.category}</span>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-5 pb-5 pt-2 bg-slate-50 dark:bg-zinc-800/50">
                      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 dark:text-zinc-400 py-8">
                Aucune question ne correspond à votre recherche
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <Mail className="h-6 w-6 text-blue-500" />
              Contactez-nous
            </h2>

            {formSubmitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                <div className="text-green-600 dark:text-green-400 text-lg font-semibold mb-2">
                  Message envoyé avec succès !
                </div>
                <p className="text-green-600 dark:text-green-400">
                  Notre équipe vous répondra dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                    Sujet
                  </label>
                  <select
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="account">Problème de compte</option>
                    <option value="technical">Bug technique</option>
                    <option value="feature">Suggestion de fonctionnalité</option>
                    <option value="billing">Question de facturation</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    placeholder="Décrivez votre question ou problème..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Autres moyens de contact
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Email</h3>
                    <a href="mailto:support@trophenix.com" className="text-blue-500 hover:underline">
                      support@trophenix.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Phone className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Téléphone</h3>
                    <a href="tel:+33123456789" className="text-green-500 hover:underline">
                      +33 1 23 45 67 89
                    </a>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                      Lun-Ven: 9h-18h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <MapPin className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Adresse</h3>
                    <p className="text-slate-600 dark:text-zinc-400">
                      123 Avenue des Champs-Élysées<br />
                      75008 Paris, France
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-3">Besoin d'aide immédiate ?</h3>
              <p className="mb-5 text-blue-50">
                Notre assistante virtuelle Elea est disponible 24/7 pour répondre à vos questions.
              </p>
              <button
                onClick={() => window.location.href = '#elea'}
                className="bg-white text-blue-500 px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Discuter avec Elea
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
