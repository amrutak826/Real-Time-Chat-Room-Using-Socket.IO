
import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwnMessage: boolean;
}

const ChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to the chat! 👋',
      sender: 'System',
      timestamp: new Date(Date.now() - 300000),
      isOwnMessage: false,
    },
    {
      id: '2',
      text: 'Hey everyone! How is everyone doing today?',
      sender: 'Alice',
      timestamp: new Date(Date.now() - 240000),
      isOwnMessage: false,
    },
    {
      id: '3',
      text: 'Great! Just working on some exciting projects. What about you?',
      sender: 'Bob',
      timestamp: new Date(Date.now() - 180000),
      isOwnMessage: false,
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('You');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers] = useState(['Alice', 'Bob', 'Charlie', 'Diana']);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate real-time messaging
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomUsers = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const randomMessages = [
          'That sounds awesome!',
          'I agree! 💯',
          'Has anyone tried the new update?',
          'Working on something cool today',
          'Coffee break time! ☕',
          'Anyone up for a quick call?',
          'Great point!',
          'Thanks for sharing that',
        ];
        
        const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
        const randomText = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        const simulatedMessage: Message = {
          id: Date.now().toString(),
          text: randomText,
          sender: randomUser,
          timestamp: new Date(),
          isOwnMessage: false,
        };
        
        setMessages(prev => [...prev, simulatedMessage]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: username,
      timestamp: new Date(),
      isOwnMessage: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    toast({
      title: "Message sent",
      description: "Your message has been delivered!",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Sidebar */}
        <div className="w-80 bg-white/10 backdrop-blur-lg rounded-l-2xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h2 className="text-white text-xl font-bold">Live Chat</h2>
          </div>
          
          <div className="mb-6">
            <Input
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/80">
              <Users size={16} />
              <span className="text-sm font-medium">Online ({onlineUsers.length + 1})</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-green-500 text-white text-xs">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm">{username} (You)</span>
                <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
              </div>
              
              {onlineUsers.map((user) => (
                <div key={user} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`${getAvatarColor(user)} text-white text-xs`}>
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white/80 text-sm">{user}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-r-2xl border border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <h1 className="text-2xl font-bold text-white">General Chat</h1>
            <p className="text-white/60 text-sm">Real-time messaging • {messages.length} messages</p>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex gap-3 max-w-md ${message.isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!message.isOwnMessage && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className={`${getAvatarColor(message.sender)} text-white text-xs`}>
                          {getInitials(message.sender)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`space-y-1 ${message.isOwnMessage ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm font-medium">
                          {message.isOwnMessage ? 'You' : message.sender}
                        </span>
                        <span className="text-white/40 text-xs">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      
                      <div
                        className={`p-3 rounded-2xl ${
                          message.isOwnMessage
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-white/20 text-white rounded-bl-md'
                        } shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-[1.02]`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex gap-3 max-w-md">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-6 border-t border-white/20">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-12 py-3 rounded-xl"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <Smile size={18} />
                </Button>
              </div>
              
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
