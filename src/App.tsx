import React, { useState, useEffect } from 'react';
import { CloudflareGate } from './components/Security/CloudflareGate';
import { MobileSidebar } from './components/MobileSidebar';
import { Menu, Send, Users, BookOpen, Calendar, Bell, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  avatar?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  year: string;
  stream: string;
  lastMessage?: Message;
  unreadCount: number;
}

function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user] = useState({ name: 'Student', avatar: '👤' });

  // Mock data for demonstration
  const years = ['1ste', '2de', '3de', '4de', '5de', '6de'];
  const streams = ['ASO', 'TSO', 'BSO', 'KSO'];
  
  const [chatRooms] = useState<ChatRoom[]>([
    { id: '1', name: 'Algemeen', year: '1ste', stream: 'ASO', unreadCount: 3 },
    { id: '2', name: 'Wiskunde', year: '1ste', stream: 'ASO', unreadCount: 0 },
    { id: '3', name: 'Nederlands', year: '1ste', stream: 'ASO', unreadCount: 1 },
    { id: '4', name: 'Algemeen', year: '2de', stream: 'TSO', unreadCount: 5 },
    { id: '5', name: 'Informatica', year: '3de', stream: 'TSO', unreadCount: 0 },
  ]);

  const handleTurnstileSuccess = async (token: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      const result = await response.json();
      if (result.ok) {
        setIsVerified(true);
        initializeApp();
      } else {
        alert('Verificatie mislukt. Probeer opnieuw.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Er is een fout opgetreden tijdens de verificatie.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBypass = () => {
    setIsVerified(true);
    initializeApp();
  };

  const initializeApp = () => {
    // Set default room
    setSelectedRoom(chatRooms[0]);
    // Load mock messages
    setMessages([
      {
        id: '1',
        user: 'Leraar Janssen',
        content: 'Welkom in de algemene chatroom! Hier kunnen jullie vragen stellen over de lessen.',
        timestamp: new Date(Date.now() - 3600000),
        avatar: '👨‍🏫'
      },
      {
        id: '2',
        user: 'Emma De Vries',
        content: 'Hallo allemaal! Heeft iemand de huiswerkopdracht voor morgen?',
        timestamp: new Date(Date.now() - 1800000),
        avatar: '👩‍🎓'
      }
    ]);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;
    
    const message: Message = {
      id: Date.now().toString(),
      user: user.name,
      content: newMessage,
      timestamp: new Date(),
      avatar: user.avatar
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    setSidebarOpen(false);
    // In a real app, you'd load messages for this room
    setMessages([
      {
        id: '1',
        user: 'Leraar Peeters',
        content: `Welkom in ${room.name} - ${room.year} ${room.stream}!`,
        timestamp: new Date(Date.now() - 3600000),
        avatar: '👨‍🏫'
      }
    ]);
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {isVerifying ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verificatie bezig...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Sint-Jozefcollege Turnhout
                </h1>
                <p className="text-gray-600">Leerlingenplatform</p>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-4">
                  Verifieer jezelf om toegang te krijgen tot het platform
                </p>
              </div>
              
              <div className="space-y-4">
                <CloudflareGate onSuccess={handleTurnstileSuccess} />
                
                {/* Development Bypass Button */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">of</span>
                  </div>
                </div>
                
                <button
                  onClick={handleBypass}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  🚧 Ontwikkelingsmodus (Bypass Verificatie)
                </button>
                
                <p className="text-xs text-gray-400 text-center">
                  Bypass optie voor ontwikkeling - wordt verwijderd in productie
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">SJT Platform</h1>
              <p className="text-xs text-gray-500">Leerlingenportaal</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Chatrooms</h2>
          <div className="space-y-1">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => selectRoom(room)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedRoom?.id === room.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{room.name}</p>
                    <p className="text-xs text-gray-500">{room.year} {room.stream}</p>
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm">{user.avatar}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Uitloggen</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        years={years}
        streams={streams}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-semibold text-gray-900">
                  {selectedRoom ? `${selectedRoom.name} - ${selectedRoom.year} ${selectedRoom.stream}` : 'Selecteer een chatroom'}
                </h1>
                <p className="text-sm text-gray-500">
                  {selectedRoom ? `${messages.length} berichten` : 'Geen chatroom geselecteerd'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        {selectedRoom ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex space-x-3 ${
                      message.user === user.name ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.user !== user.name && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">{message.avatar}</span>
                      </div>
                    )}
                    <div className={`max-w-xs lg:max-w-md ${
                      message.user === user.name ? 'order-first' : ''
                    }`}>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.user === user.name
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}>
                        {message.user !== user.name && (
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            {message.user}
                          </p>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {message.timestamp.toLocaleTimeString('nl-NL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {message.user === user.name && (
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-white">{message.avatar}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Typ je bericht..."
                    className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={1}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white rounded-2xl px-6 py-3 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Verstuur</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welkom bij het SJT Leerlingenplatform
              </h2>
              <p className="text-gray-600">
                Selecteer een chatroom om te beginnen met chatten
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;