import { useState, useEffect } from 'react';
import { Mail, MailOpen, Send, X } from 'lucide-react';
import { MessageService } from '../../services/messageService';
import type { Message } from '../../types/messages';
import { useAuth } from '../../contexts/AuthContext';

export default function MessagesList() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'received' | 'sent'>('all');
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user, filter]);

  const loadMessages = async () => {
    if (!user) return;
    try {
      setLoading(true);
      let data: Message[];
      if (filter === 'received') {
        data = await MessageService.getReceivedMessages(user.id);
      } else if (filter === 'sent') {
        data = await MessageService.getSentMessages(user.id);
      } else {
        data = await MessageService.getUserMessages(user.id);
      }
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.read && message.recipient_id === user?.id) {
      try {
        await MessageService.markAsRead(message.id);
        setMessages(prev =>
          prev.map(m => m.id === message.id ? { ...m, read: true, read_at: new Date().toISOString() } : m)
        );
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const unreadCount = messages.filter(m => !m.read && m.recipient_id === user?.id).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messagerie</h1>
          <p className="text-gray-600">
            {unreadCount > 0 && `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setComposing(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          <Send className="h-5 w-5" />
          Nouveau message
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('received')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'received'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Reçus
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'sent'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Envoyés
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
          <p className="text-gray-600">Votre boîte de réception est vide</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {messages.map((message) => {
            const isReceived = message.recipient_id === user?.id;
            const isUnread = !message.read && isReceived;

            return (
              <div
                key={message.id}
                onClick={() => handleSelectMessage(message)}
                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  isUnread ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 ${isUnread ? 'text-blue-600' : 'text-gray-400'}`}>
                    {isUnread ? (
                      <Mail className="h-5 w-5" />
                    ) : (
                      <MailOpen className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {isReceived ? 'De: ' : 'À: '}
                        <span className="text-gray-600">
                          {isReceived ? message.sender_id.slice(0, 8) : message.recipient_id.slice(0, 8)}...
                        </span>
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(message.sent_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className={`text-sm ${isUnread ? 'font-medium text-gray-900' : 'text-gray-600'} mb-1`}>
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}

      {composing && (
        <ComposeMessageModal
          onClose={() => setComposing(false)}
          onSent={() => {
            setComposing(false);
            loadMessages();
          }}
        />
      )}
    </div>
  );
}

function MessageDetailModal({ message, onClose }: { message: Message; onClose: () => void }) {
  const { user } = useAuth();
  const isReceived = message.recipient_id === user?.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{message.subject}</h2>
              <p className="text-sm text-gray-600">
                {isReceived ? 'De: ' : 'À: '}
                {isReceived ? message.sender_id.slice(0, 8) : message.recipient_id.slice(0, 8)}...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.sent_at).toLocaleString('fr-FR')}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 whitespace-pre-line">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

function ComposeMessageModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const { user } = useAuth();
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !recipientId || !subject || !content) return;

    try {
      setSending(true);
      const result = await MessageService.sendMessage(user.id, {
        recipient_id: recipientId,
        subject,
        content,
      });

      if (result.success) {
        alert('Message envoyé avec succès !');
        onSent();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nouveau message</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destinataire (ID)
            </label>
            <input
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="UUID du destinataire"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Objet du message"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={8}
              placeholder="Votre message..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
