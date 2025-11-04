import { useState, useEffect, useRef } from 'react';
import { FileText, Download, Edit2, Save, Plus, Image, BarChart, Users, MoreVertical, Upload } from 'lucide-react';

export function SponsorKit() {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [kitData, setKitData] = useState({
    title: 'Mon Kit Sponsor',
    description: '',
    achievements: '',
    audience: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: ''
    },
    statistics: {
      followers: '',
      engagement: '',
      reach: ''
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDownloadPDF = () => {
    window.print();
    setShowMenu(false);
  };

  const handleUploadPDF = () => {
    fileInputRef.current?.click();
    setShowMenu(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <section className="sticky top-0 px-8 py-8 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Mon Kit Sponsor</h3>
            <p className="text-slate-600 text-lg">Créez votre kit de présentation pour les sponsors</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-900 transition-all font-medium"
                >
                  <Edit2 className="w-5 h-5" />
                  Modifier
                </button>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all font-medium"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                      <button
                        onClick={handleDownloadPDF}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Download className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Télécharger PDF</span>
                      </button>
                      <button
                        onClick={handleUploadPDF}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                      >
                        <Upload className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Uploader un PDF</span>
                      </button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all font-medium"
              >
                <Save className="w-5 h-5" />
                Enregistrer
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <FileText className="w-8 h-8 text-white mb-2" />
              {isEditing ? (
                <input
                  type="text"
                  value={kitData.title}
                  onChange={(e) => setKitData({ ...kitData, title: e.target.value })}
                  className="w-full bg-white/20 text-white text-2xl font-bold px-4 py-2 rounded-lg border-2 border-white/30 focus:outline-none focus:border-white"
                  placeholder="Titre du kit"
                />
              ) : (
                <h4 className="text-2xl font-bold text-white">{kitData.title}</h4>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Présentation
                </label>
                {isEditing ? (
                  <textarea
                    value={kitData.description}
                    onChange={(e) => setKitData({ ...kitData, description: e.target.value })}
                    className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Présentez-vous et votre parcours sportif..."
                  />
                ) : (
                  <p className="text-slate-700 p-4 bg-slate-50 rounded-lg">
                    {kitData.description || 'Aucune présentation ajoutée'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Réalisations et Palmarès
                </label>
                {isEditing ? (
                  <textarea
                    value={kitData.achievements}
                    onChange={(e) => setKitData({ ...kitData, achievements: e.target.value })}
                    className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Listez vos principales réalisations sportives..."
                  />
                ) : (
                  <p className="text-slate-700 p-4 bg-slate-50 rounded-lg">
                    {kitData.achievements || 'Aucune réalisation ajoutée'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-900">Followers</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={kitData.statistics.followers}
                      onChange={(e) => setKitData({
                        ...kitData,
                        statistics: { ...kitData.statistics, followers: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 10K"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900">
                      {kitData.statistics.followers || '-'}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-slate-900">Engagement</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={kitData.statistics.engagement}
                      onChange={(e) => setKitData({
                        ...kitData,
                        statistics: { ...kitData.statistics, engagement: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 5%"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900">
                      {kitData.statistics.engagement || '-'}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-slate-900">Portée</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={kitData.statistics.reach}
                      onChange={(e) => setKitData({
                        ...kitData,
                        statistics: { ...kitData.statistics, reach: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 50K"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900">
                      {kitData.statistics.reach || '-'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Réseaux Sociaux
                </label>
                <div className="space-y-3">
                  {Object.entries(kitData.socialMedia).map(([platform, value]) => (
                    <div key={platform} className="flex items-center gap-3">
                      <label className="w-24 text-sm text-slate-600 capitalize">{platform}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setKitData({
                            ...kitData,
                            socialMedia: { ...kitData.socialMedia, [platform]: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`@${platform}`}
                        />
                      ) : (
                        <p className="flex-1 text-slate-700 p-2">
                          {value || '-'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
