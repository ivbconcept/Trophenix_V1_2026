import { useState, useEffect } from 'react';
import { FileText, Save, Plus, Trash2, Edit2, Download, Check, Upload, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface CoverLetter {
  id: string;
  title: string;
  content: string;
  is_default: boolean;
  job_offer_id: string | null;
  created_at: string;
  updated_at: string;
}

interface CoverLetterFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

export default function CoverLetterBuilder() {
  const { user } = useAuth();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [activeTab, setActiveTab] = useState<'created' | 'uploaded'>('created');
  const [uploadedFiles, setUploadedFiles] = useState<CoverLetterFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadCoverLetters();
      loadUploadedFiles();
    }
  }, [user]);

  const loadCoverLetters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCoverLetters(data || []);
      if (data && data.length > 0) {
        const defaultLetter = data.find(l => l.is_default) || data[0];
        setSelectedLetter(defaultLetter);
        setEditedTitle(defaultLetter.title);
        setEditedContent(defaultLetter.content);
      }
    } catch (error) {
      console.error('Error loading cover letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      if (selectedLetter) {
        const { error } = await supabase
          .from('cover_letters')
          .update({
            title: editedTitle,
            content: editedContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedLetter.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('cover_letters')
          .insert({
            user_id: user.id,
            title: editedTitle || 'Ma lettre de motivation',
            content: editedContent,
            is_default: coverLetters.length === 0
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setSelectedLetter(data);
      }

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setIsEditing(false);
      await loadCoverLetters();
    } catch (error) {
      console.error('Error saving cover letter:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNew = async () => {
    setSelectedLetter(null);
    setEditedTitle('Nouvelle lettre de motivation');
    setEditedContent('');
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette lettre de motivation ?')) return;

    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadCoverLetters();
    } catch (error) {
      console.error('Error deleting cover letter:', error);
    }
  };

  const handleSelectLetter = (letter: CoverLetter) => {
    setSelectedLetter(letter);
    setEditedTitle(letter.title);
    setEditedContent(letter.content);
    setIsEditing(false);
  };

  const loadUploadedFiles = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('cover_letter_files')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setUploadedFiles(data || []);
    } catch (error) {
      console.error('Error loading uploaded files:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user) return;

    setUploading(true);
    setUploadMessage('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${user.id}/cover-letters/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('cv-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('cover_letter_files')
          .insert({
            user_id: user.id,
            file_name: file.name,
            file_path: fileName,
            file_size: file.size,
            file_type: file.type
          });

        if (dbError) throw dbError;
      }

      await loadUploadedFiles();
      setUploadMessage('Fichier(s) téléchargé(s) avec succès');
      setTimeout(() => setUploadMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleFileDelete = async (file: CoverLetterFile) => {
    if (!confirm(`Supprimer ${file.file_name} ?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('cv-files')
        .remove([file.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('cover_letter_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      await loadUploadedFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleFileDownload = async (file: CoverLetterFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('cv-files')
        .download(file.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDownloadPDF = () => {
    alert('Fonctionnalité de téléchargement PDF à venir');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {showSuccessMessage && (
        <div className="fixed top-20 right-8 bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <Check className="w-5 h-5" />
          <span className="font-medium">Lettre de motivation enregistrée avec succès!</span>
        </div>
      )}

      {uploadMessage && (
        <div className={`fixed top-20 right-8 ${uploadMessage.includes('Erreur') ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'} px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50`}>
          <Check className="w-5 h-5" />
          <span className="font-medium">{uploadMessage}</span>
        </div>
      )}

      {uploading && (
        <div className="fixed top-20 right-8 bg-blue-50 border border-blue-200 text-blue-800 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="font-medium">Téléchargement en cours...</span>
        </div>
      )}

      <section className="sticky top-0 px-8 py-8 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Lettre de Motivation</h3>
            <p className="text-slate-600 text-lg">Créez et personnalisez vos lettres de motivation</p>
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
          <div className="col-span-4 border-r border-slate-200 bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('created')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'created'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Lettres créées ({coverLetters.length})
                </button>
                <button
                  onClick={() => setActiveTab('uploaded')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'uploaded'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Téléchargées ({uploadedFiles.length})
                </button>
              </div>

              {activeTab === 'created' ? (
                <div className="space-y-2">
                {coverLetters.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Aucune lettre de motivation</p>
                    <p className="text-slate-400 text-xs mt-1">Créez votre première lettre</p>
                  </div>
                ) : (
                  coverLetters.map((letter) => (
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
              ) : (
                <div className="space-y-2">
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">Aucun fichier téléchargé</p>
                      <label className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        <Upload className="w-3 h-3 inline mr-1" />
                        Ajouter des fichiers
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                    </div>
                  ) : (
                    <>
                      <label className="flex items-center justify-center gap-2 p-3 mb-2 bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Ajouter des fichiers</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="group p-4 rounded-lg border bg-white border-slate-200 hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-slate-900 text-sm truncate">
                                  {file.file_name}
                                </h5>
                                <p className="text-xs text-slate-500">
                                  {(file.file_size / 1024).toFixed(0)} Ko • {new Date(file.uploaded_at).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleFileDownload(file)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Télécharger"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleFileDelete(file)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-8 overflow-y-auto bg-slate-50">
            <div className="max-w-4xl mx-auto p-8">
              {activeTab === 'uploaded' ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-slate-900 mb-2">Fichiers téléchargés</h4>
                  <p className="text-slate-600">
                    Sélectionnez un fichier dans la liste pour le télécharger ou le supprimer.
                  </p>
                </div>
              ) : (selectedLetter || isEditing) ? (
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

Je me permets de vous adresser ma candidature pour le poste de...

[Développez votre motivation, vos compétences et votre projet professionnel]

Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."
                      />
                    ) : (
                      <div className="prose prose-slate max-w-none">
                        <div className="whitespace-pre-wrap font-serif text-base leading-relaxed text-slate-700">
                          {editedContent || 'Commencez à écrire votre lettre de motivation...'}
                        </div>
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
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
