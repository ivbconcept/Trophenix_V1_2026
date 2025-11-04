import { useState } from 'react';
import { Shield, Bell, Lock, Globe, Palette, Eye, EyeOff, Mail, Key, Smartphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type SettingsTab = 'account' | 'security' | 'notifications' | 'privacy' | 'appearance';

export function UserSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [applicationNotifications, setApplicationNotifications] = useState(true);

  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const tabs = [
    { id: 'account' as SettingsTab, label: 'Compte', icon: Mail },
    { id: 'security' as SettingsTab, label: 'Sécurité', icon: Shield },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'privacy' as SettingsTab, label: 'Confidentialité', icon: Lock },
    { id: 'appearance' as SettingsTab, label: 'Apparence', icon: Palette },
  ];

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Paramètres</h1>
          <p className="text-slate-600 dark:text-zinc-400">Gérez vos préférences et paramètres de compte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 md:p-8">
              {message && (
                <div className={`mb-6 p-4 rounded-xl ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Informations du compte</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                        Adresse email
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="flex-1 px-4 py-3 border border-slate-300 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white"
                        />
                        <button className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                          Modifier
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                        Cette adresse email est utilisée pour vous connecter
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-zinc-800">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Zone de danger</h3>
                      <div className="p-4 border border-red-200 dark:border-red-800 rounded-xl bg-red-50 dark:bg-red-900/20">
                        <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">Supprimer le compte</h4>
                        <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                          Cette action est irréversible. Toutes vos données seront supprimées définitivement.
                        </p>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
                          Supprimer mon compte
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Sécurité</h2>

                  <div className="space-y-6">
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          required
                          minLength={6}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                          Confirmer le mot de passe
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          required
                          minLength={6}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                      </button>
                    </form>

                    <div className="pt-6 border-t border-slate-200 dark:border-zinc-800">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Authentification à deux facteurs
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-zinc-400 mb-4">
                        Ajoutez une couche de sécurité supplémentaire à votre compte
                      </p>
                      <button className="px-4 py-3 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors font-medium">
                        Activer 2FA
                      </button>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-zinc-800">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Sessions actives
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 border border-slate-200 dark:border-zinc-800 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">Session actuelle</p>
                                <p className="text-sm text-slate-500 dark:text-zinc-400">Dernière activité: maintenant</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notifications</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-zinc-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Notifications par email</p>
                          <p className="text-sm text-slate-500 dark:text-zinc-400">Recevoir des emails de notification</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-zinc-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Notifications push</p>
                          <p className="text-sm text-slate-500 dark:text-zinc-400">Recevoir des notifications sur votre appareil</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-zinc-800">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Préférences de notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Nouveaux messages</p>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">Être notifié des nouveaux messages</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={messageNotifications}
                              onChange={(e) => setMessageNotifications(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Candidatures</p>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">Être notifié des mises à jour de candidatures</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={applicationNotifications}
                              onChange={(e) => setApplicationNotifications(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Confidentialité</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-3">
                        Visibilité du profil
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                          <input
                            type="radio"
                            name="visibility"
                            value="public"
                            checked={profileVisibility === 'public'}
                            onChange={() => setProfileVisibility('public')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                              <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Public</p>
                              <p className="text-sm text-slate-500 dark:text-zinc-400">Visible par tous les utilisateurs</p>
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                          <input
                            type="radio"
                            name="visibility"
                            value="private"
                            checked={profileVisibility === 'private'}
                            onChange={() => setProfileVisibility('private')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                              <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Privé</p>
                              <p className="text-sm text-slate-500 dark:text-zinc-400">Visible uniquement par vous</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-zinc-800">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Informations visibles
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Adresse email</p>
                              <p className="text-sm text-slate-500 dark:text-zinc-400">Afficher mon email sur mon profil public</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showEmail}
                              onChange={(e) => setShowEmail(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Numéro de téléphone</p>
                              <p className="text-sm text-slate-500 dark:text-zinc-400">Afficher mon téléphone sur mon profil public</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showPhone}
                              onChange={(e) => setShowPhone(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Apparence</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-3">
                        Thème
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border-2 border-blue-500 rounded-xl cursor-pointer bg-white">
                          <div className="w-full h-24 bg-gradient-to-br from-slate-50 to-white rounded-lg mb-3 border border-slate-200"></div>
                          <p className="font-medium text-slate-900 text-center">Clair</p>
                        </div>
                        <div className="p-4 border-2 border-slate-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                          <div className="w-full h-24 bg-gradient-to-br from-zinc-900 to-black rounded-lg mb-3"></div>
                          <p className="font-medium text-slate-900 dark:text-white text-center">Sombre</p>
                        </div>
                        <div className="p-4 border-2 border-slate-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                          <div className="w-full h-24 bg-gradient-to-br from-slate-50 via-zinc-900 to-white rounded-lg mb-3"></div>
                          <p className="font-medium text-slate-900 dark:text-white text-center">Auto</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-zinc-800">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Langue
                      </h3>
                      <select className="w-full px-4 py-3 border border-slate-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
