import React, { useState } from 'react';
import { TrendingUp, Users, Globe, DollarSign, Rocket, Target, BarChart3, Building2, Shield, Zap, ArrowRight, Download, Mail, CheckCircle2, Trophy } from 'lucide-react';

interface InvestorsPageProps {
  onBack?: () => void;
}

const InvestorsPage: React.FC<InvestorsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'vision' | 'market' | 'business'>('vision');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header / Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Trophenix
              </span>
            </div>
            <button
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Retour Accueil
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Rocket className="h-4 w-4" />
              <span>Opportunité d'Investissement</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Investissez dans le
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Google du Sport
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Trophenix construit l'infrastructure mondiale du sport. De plateforme de recrutement à écosystème complet : social, sponsoring, tournois, e-commerce, et bien plus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Prendre Contact
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#vision"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-all border-2 border-slate-200 font-semibold"
              >
                <Download className="mr-2 h-5 w-5" />
                Voir la Vision
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-lg mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-slate-900">VISION : De Startup à Infrastructure Mondiale</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Équivalents Mondiaux</h3>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-start space-x-4 bg-white rounded-lg p-4 shadow-sm">
                <div className="flex-shrink-0 w-32 font-semibold text-slate-900">Google</div>
                <div className="flex-1 text-slate-600">Moteur de recherche → Écosystème complet</div>
              </div>
              <div className="flex items-start space-x-4 bg-white rounded-lg p-4 shadow-sm">
                <div className="flex-shrink-0 w-32 font-semibold text-slate-900">Palantir</div>
                <div className="flex-1 text-slate-600">Plateforme de données gouvernementale</div>
              </div>
              <div className="flex items-start space-x-4 bg-white rounded-lg p-4 shadow-sm">
                <div className="flex-shrink-0 w-32 font-semibold text-slate-900">Salesforce</div>
                <div className="flex-1 text-slate-600">CRM → Écosystème d'apps</div>
              </div>
              <div className="flex items-start space-x-4 bg-white rounded-lg p-4 shadow-sm">
                <div className="flex-shrink-0 w-32 font-semibold text-slate-900">AWS</div>
                <div className="flex-1 text-slate-600">Infrastructure → Marketplace de services</div>
              </div>
              <div className="flex items-start space-x-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-4 shadow-lg">
                <div className="flex-shrink-0 w-32 font-bold text-white">Trophenix</div>
                <div className="flex-1 text-white font-semibold">Sport → Écosystème complet</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1Mds€</div>
              <div className="text-sm text-slate-600">Revenus Projetés Année 10</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">50M+</div>
              <div className="text-sm text-slate-600">Utilisateurs Cibles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-sm text-slate-600">Pays Ciblés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">10Mds€</div>
              <div className="text-sm text-slate-600">Valorisation Cible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Le Problème</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">✗</span>
                  <span>Pas d'infrastructure unifiée pour le sport mondial</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">✗</span>
                  <span>Systèmes fragmentés et incompatibles entre organisations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">✗</span>
                  <span>Difficultés pour athlètes, sponsors, et organisations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">✗</span>
                  <span>Pas de données centralisées ni d'analytics avancés</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Notre Solution</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <CheckCircle2 className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Plateforme unifiée multi-tenant pour tous les acteurs du sport</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>API Gateway permettant intégrations avec tous les systèmes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Marketplace d'apps et services (App Store du sport)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>IA et analytics avancés pour tous les use cases</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Tabs */}
      <section id="vision" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Notre Vision</h2>
            <p className="text-xl text-slate-600 leading-relaxed">L'infrastructure complète du sport mondial</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('vision')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'vision'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Globe className="inline-block mr-2 h-5 w-5" />
              Roadmap 10 Ans
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'market'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="inline-block mr-2 h-5 w-5" />
              Opportunité Marché
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'business'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <DollarSign className="inline-block mr-2 h-5 w-5" />
              Modèle Économique
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            {activeTab === 'vision' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-900">Roadmap sur 10 Ans</h3>

                {/* Timeline */}
                <div className="space-y-6">
                  {/* Phase 1 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="text-sm font-semibold text-blue-600">Année 1-2</span>
                      <div className="text-xs text-slate-500">Actuel</div>
                    </div>
                    <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                    <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">MVP & Product-Market Fit</h4>
                      <p className="text-slate-600 mb-3 leading-relaxed">Recrutement athlètes + Multi-contextes + Agent IA</p>
                      <div className="flex items-center text-sm text-slate-600">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-semibold">10M€ revenus</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="text-sm font-semibold text-blue-600">Année 3-4</span>
                    </div>
                    <div className="flex-shrink-0 w-3 h-3 bg-cyan-600 rounded-full mt-1.5"></div>
                    <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Scale & Modules</h4>
                      <p className="text-slate-600 mb-3 leading-relaxed">Social Network + Sponsoring + Tournois + E-commerce</p>
                      <div className="flex items-center text-sm text-slate-600">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-semibold">150M€ revenus cumulés</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="text-sm font-semibold text-blue-600">Année 5-7</span>
                    </div>
                    <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                    <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Expansion Globale</h4>
                      <p className="text-slate-600 mb-3 leading-relaxed">USA + Asie + Comités Olympiques + FIFA/UEFA</p>
                      <div className="flex items-center text-sm text-slate-600">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-semibold">600M€ revenus année 7</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 4 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="text-sm font-semibold text-blue-600">Année 8-10</span>
                    </div>
                    <div className="flex-shrink-0 w-3 h-3 bg-cyan-600 rounded-full mt-1.5"></div>
                    <div className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 shadow-sm border border-blue-200">
                      <h4 className="font-bold text-slate-900 mb-2">Domination Mondiale</h4>
                      <p className="text-slate-600 mb-3 leading-relaxed">Leader incontesté - 100+ pays - 50M utilisateurs</p>
                      <div className="flex items-center text-sm text-slate-600">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-semibold">1 Milliard € revenus/an</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'market' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-900">Opportunité de Marché</h3>

                {/* Market Size */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">500Mds€</div>
                    <div className="text-sm text-slate-600">Industrie Sport Mondiale</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="text-3xl font-bold text-cyan-600 mb-2">5Mds+</div>
                    <div className="text-sm text-slate-600">Athlètes dans le Monde</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">TAM 50Mds€</div>
                    <div className="text-sm text-slate-600">Notre Marché Adressable</div>
                  </div>
                </div>

                {/* Target Customers */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Clients Cibles</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Comités Olympiques</div>
                          <div className="text-sm text-slate-600">200+ pays - 300k€/an chacun</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Gouvernements & Armées</div>
                          <div className="text-sm text-slate-600">50+ pays - 600k€/an chacun</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Marques & Sponsors</div>
                          <div className="text-sm text-slate-600">10,000+ contrats/an</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Fédérations & Clubs</div>
                          <div className="text-sm text-slate-600">100,000+ organisations</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Competitive Advantage */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Avantages Compétitifs</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-slate-200">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">Premier Mover</div>
                        <div className="text-sm text-slate-600">Aucun concurrent offrant infrastructure complète</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-slate-200">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">Network Effects</div>
                        <div className="text-sm text-slate-600">Plus d'utilisateurs = Plus de valeur pour tous</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-slate-200">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">Technologie IA Propriétaire</div>
                        <div className="text-sm text-slate-600">Agent Elea et analytics avancés exclusifs</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-slate-200">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">API-First & Extensible</div>
                        <div className="text-sm text-slate-600">Marketplace d'apps créant un écosystème lock-in</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-900">Modèle Économique</h3>

                {/* Revenue Streams */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Flux de Revenus (Année 10)</h4>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-6 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">Subscriptions B2B</span>
                        <span className="text-2xl font-bold text-blue-600">400M€</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                        <div className="bg-blue-600 h-3 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <div className="text-sm text-slate-600">40% des revenus - Tenants Enterprise, Olympic, etc.</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">Commissions Marketplace</span>
                        <span className="text-2xl font-bold text-cyan-600">300M€</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                        <div className="bg-cyan-600 h-3 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <div className="text-sm text-slate-600">30% des revenus - Recrutement, Sponsoring, E-commerce</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">API & Data</span>
                        <span className="text-2xl font-bold text-blue-600">200M€</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                        <div className="bg-blue-600 h-3 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <div className="text-sm text-slate-600">20% des revenus - API Calls, Data Export, Analytics</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">Autres (Fans B2C, Apps)</span>
                        <span className="text-2xl font-bold text-cyan-600">100M€</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                        <div className="bg-cyan-600 h-3 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <div className="text-sm text-slate-600">10% des revenus - Abonnements fans, Marketplace apps</div>
                    </div>
                  </div>
                </div>

                {/* Economics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="text-sm text-slate-600 mb-1">Marge Brute</div>
                    <div className="text-3xl font-bold text-blue-600">75%</div>
                    <div className="text-xs text-slate-500 mt-1">Software-as-a-Service</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="text-sm text-slate-600 mb-1">CAC Payback</div>
                    <div className="text-3xl font-bold text-cyan-600">6 mois</div>
                    <div className="text-xs text-slate-500 mt-1">Retour rapide sur acquisition</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="text-sm text-slate-600 mb-1">LTV / CAC</div>
                    <div className="text-3xl font-bold text-blue-600">8x</div>
                    <div className="text-xs text-slate-500 mt-1">Excellent ratio économique</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Cas d'Usage Majeurs</h2>
            <p className="text-xl text-slate-600 leading-relaxed">Des clients prestigieux, des revenus récurrents</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Olympic Committees */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Comités Olympiques</h3>
              <p className="text-slate-600 mb-4">
                Gestion de 10,000+ athlètes par pays, analytics nationaux, conformité WADA
              </p>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-sm text-slate-600">Revenus projetés</div>
                <div className="text-2xl font-bold text-blue-600">60M€/an</div>
                <div className="text-xs text-slate-500 mt-1">200 comités × 300k€/an</div>
              </div>
            </div>

            {/* Government */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Armée & Gouvernements</h3>
              <p className="text-slate-600 mb-4">
                Infrastructure isolée, sécurité niveau défense, conformité totale
              </p>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-sm text-slate-600">Revenus projetés</div>
                <div className="text-2xl font-bold text-cyan-600">30M€/an</div>
                <div className="text-xs text-slate-500 mt-1">50 contrats × 600k€/an</div>
              </div>
            </div>

            {/* Sponsors */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Marques & Sponsors</h3>
              <p className="text-slate-600 mb-4">
                Marketplace ambassadeurs, analytics ROI, gestion contrats automatisée
              </p>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-sm text-slate-600">Revenus projetés</div>
                <div className="text-2xl font-bold text-blue-600">50M€/an</div>
                <div className="text-xs text-slate-500 mt-1">10k contrats × 10% commission</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Opportunity */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Opportunité d'Investissement</h2>
            <p className="text-xl text-slate-600 leading-relaxed">Rejoignez-nous dans cette aventure</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Levée Actuelle</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Montant recherché</span>
                      <span className="font-bold text-slate-900">À définir</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Valorisation</span>
                      <span className="font-bold text-slate-900">À définir</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type</span>
                      <span className="font-bold text-slate-900">Série A</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Utilisation des Fonds</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Développement produit & IA</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Expansion équipe (20+ personnes)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Marketing & Acquisition clients B2B</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Infrastructure scalable</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-blue-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Pourquoi Investir Maintenant ?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Marché en croissance</div>
                      <div className="text-sm text-slate-600">Sport = 500Mds€ industrie mondiale</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Timing parfait</div>
                      <div className="text-sm text-slate-600">MVP validé, premiers clients conquis</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Équipe solide</div>
                      <div className="text-sm text-slate-600">Expertise sport + tech + IA</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Premiers contacts majeurs</div>
                      <div className="text-sm text-slate-600">Armée, Comités déjà intéressés</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à Investir dans le Futur du Sport ?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Contactez-nous pour recevoir notre deck complet et échanger sur l'opportunité
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:investors@trophenix.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Mail className="mr-2 h-5 w-5" />
              investors@trophenix.com
            </a>
            <button
              onClick={() => alert('Fonctionnalité à venir - Pour le moment, contactez-nous par email')}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all border-2 border-white font-semibold"
            >
              <Download className="mr-2 h-5 w-5" />
              Télécharger le Deck
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Trophy className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold text-white">Trophenix</span>
            </div>
            <div className="text-sm text-center md:text-right">
              <p>L'Infrastructure Mondiale du Sport</p>
              <p className="mt-1">© 2025 Trophenix. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InvestorsPage;
