import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Edit2, Download, Save, Check } from 'lucide-react';

interface PresentationLetter {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_default: boolean;
}

export function PresentationLetter() {
  const [letters, setLetters] = useState<PresentationLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<PresentationLetter | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCreateNew = () => {
    setSelectedLetter(null);
    setIsEditing(true);
    setEditedTitle('Nouvelle lettre de présentation');
    setEditedContent('');
  };

  const handleSelectLetter = (letter: PresentationLetter) => {
    setSelectedLetter(letter);
    setEditedTitle(letter.title);
    setEditedContent(letter.content);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setIsEditing(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDelete = async (letterId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette lettre ?')) {
      setLetters(letters.filter(l => l.id !== letterId));
      if (selectedLetter?.id === letterId) {
        setSelectedLetter(null);
      }
    }
  };

  const handleDownloadPDF = () => {
    alert('Téléchargement du PDF en cours...');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {showSuccessMessage && (
        <div className="fixed top-20 right-8 bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <Check className="w-5 h-5" />
          <span className="font-medium">Lettre de présentation enregistrée avec succès!</span>
        </div>
      )}

      <section className="sticky top-0 px-8 py-8 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Lettre de Présentation</h3>
            <p className="text-slate-600 text-lg">Créez et personnalisez vos lettres de présentation pour les sponsors</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-3 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-900 hover:text-slate-700 transition-all font-medium"
            >
              <div className="w-8 h-8 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-white" />
              </div>
              Nouvelle lettre
            </button>
          </div>
        </div>
      </section>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-12 h-full">
          <div className="col-span-3 border-r border-slate-200 bg-white overflow-y-auto">
            <div className="p-6">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Mes lettres ({letters.length})
              </h4>
              <div className="space-y-2">
                {letters.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Aucune lettre de présentation</p>
                    <p className="text-slate-400 text-xs mt-1">Créez votre première lettre</p>
                  </div>
                ) : (
                  letters.map((letter) => (
                    <div
                      key={letter.id}
                      className={`group p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedLetter?.id === letter.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleSelectLetter(letter)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-slate-900 text-sm line-clamp-1">
                          {letter.title}
                        </h5>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(letter.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Modifié le {new Date(letter.updated_at).toLocaleDateString('fr-FR')}
                      </p>
                      {letter.is_default && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Par défaut
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-span-9 overflow-y-auto bg-slate-50">
            <div className="max-w-4xl mx-auto p-8">
              {selectedLetter || isEditing ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-white" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="bg-white/20 text-white text-xl font-bold px-4 py-2 rounded-lg border-2 border-white/30 focus:outline-none focus:border-white"
                          placeholder="Titre de la lettre"
                        />
                      ) : (
                        <h4 className="text-xl font-bold text-white">{editedTitle}</h4>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleDownloadPDF}
                            className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-8">
                    {isEditing ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-[600px] p-6 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-serif text-base leading-relaxed"
                        placeholder="Madame, Monsieur,

Je me permets de vous contacter pour vous présenter mon profil d'athlète...

Cordialement,"
                      />
                    ) : (
                      <div className="prose prose-slate max-w-none">
                        <div className="whitespace-pre-wrap font-serif text-base leading-relaxed text-slate-700">
                          {editedContent}
                        </div>
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            if (selectedLetter) {
                              setEditedTitle(selectedLetter.title);
                              setEditedContent(selectedLetter.content);
                            }
                          }}
                          className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                        >
                          <Save className="w-5 h-5" />
                          {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <FileText className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Aucune lettre sélectionnée
                  </h3>
                  <p className="text-slate-600 mb-8">
                    Sélectionnez une lettre existante ou créez-en une nouvelle
                  </p>
                  <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-900 hover:text-slate-700 transition-all font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Créer ma première lettre
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
