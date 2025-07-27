import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { chatAPI } from '../../services/api';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { showToast } from '../ui/Toast';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await chatAPI.getMessages();
      return response.data || [];
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: chatAPI.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
      setMessage('');
      showToast('success', 'Message sent');
    },
    onError: () => {
      showToast('error', 'Failed to send message');
    },
  });

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = e => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isLoading) return;

    sendMessageMutation.mutate({
      username: user.username,
      avatar_url: user.avatar_url,
      message: message.trim(),
    });
  };

  const formatTime = timestamp => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chat</h2>
          <p className="text-gray-600 mt-1">Real-time communication with your team</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Live</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{messages.length} messages</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="h-96 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No messages yet</p>
                <p className="text-sm">Send the first message to get started!</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="flex items-start space-x-3">
                <img
                  src={msg.avatar_url || '/img/default_avatar.png'}
                  alt={msg.username}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{msg.username}</span>
                    <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 break-words">{msg.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="form-input w-full"
                disabled={sendMessageMutation.isLoading}
                maxLength={500}
              />
            </div>
            <Button
              type="submit"
              loading={sendMessageMutation.isLoading}
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
