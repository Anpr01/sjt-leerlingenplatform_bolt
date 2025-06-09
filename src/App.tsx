import React, { useState, useEffect, useRef } from 'react';
import {
  User, Upload, MessageCircle, Calendar, Search,
  LogOut, FileText, Image, Video, Download, Trash2,
  Send, Bot, Users, Home, Bell, BookOpen,
  EyeOff, CheckCircle, Clock,

} from 'lucide-react';
import { CloudflareGate } from './components/Security/CloudflareGate';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  year: string;
  stream: string;
  subjects: string[];
  avatar: string;
  joinDate: string;
  lastLogin: string;
  isOnline: boolean;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  uploader: string;
  year: string;
  stream: string;
  subject: string;
  exercise: string;
  url: string;
  comments: Comment[];
  reactions: { [key: string]: string[] };
}

interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isAI?: boolean;
  type: 'class' | 'ai';
}

interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Notification {
  id: string;
  type: 'upload' | 'chat' | 'homework' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const App: React.FC = () => {
  // State management
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'dashboard' | 'admin'>('login');
  const [activeTab, setActiveTab] = useState<'home' | 'files' | 'chat' | 'homework' | 'profile'>('home');
  const [securityPassed, setSecurityPassed] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', 
    year: '', stream: '', subjects: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Data states
  const [files, setFiles] = useState<FileItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([]);
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [passwordResets, setPasswordResets] = useState<{ id: string; email: string }[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  
  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newAiMessage, setNewAiMessage] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newHomework, setNewHomework] = useState({
    subject: '', title: '', description: '', dueDate: '', priority: 'medium' as const
  });
  const [uploadForm, setUploadForm] = useState({
    year: '', stream: '', subject: '', exercise: '', file: null as File | null
  });
  const [aiChatTyping, setAiChatTyping] = useState(false);
  const [classAiTyping, setClassAiTyping] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    stream: '',
    avatar: ''
  });
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const aiChatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants
  const streams = [
    'Latijn', 'Wetenschappen', 'Economie', 'Humane Wetenschappen', 
    'Moderne Talen', 'STEM', 'Grieks-Latijn', 'Sport', 
    'Techniek-Wetenschappen', 'Sociaal-Technische Wetenschappen'
  ];
  
  const subjects = [
    'Nederlands', 'Frans', 'Engels', 'Duits', 'Wiskunde', 'Geschiedenis',
    'Aardrijkskunde', 'Chemie', 'Fysica', 'Biologie', 'Economie',
    'Informatica', 'Lichamelijke Opvoeding', 'Plastische Opvoeding',
    'Muzikale Opvoeding', 'Grieks', 'Latijn', 'Sociale Wetenschappen',
    'Techniek', 'Godsdienst', 'Artistieke Vorming'
  ];

  // Endpoint for the local AI assistant (no API key required)
  const AI_ENDPOINT = '/api/assistant';

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatMessages]);

  // Data persistence
  const saveData = () => {
    localStorage.setItem('sjt_users', JSON.stringify(users));
    localStorage.setItem('sjt_files', JSON.stringify(files));
    localStorage.setItem('sjt_chat', JSON.stringify(chatMessages));
    localStorage.setItem('sjt_ai_chat', JSON.stringify(aiChatMessages));
    localStorage.setItem('sjt_homework', JSON.stringify(homework));
    localStorage.setItem('sjt_notifications', JSON.stringify(notifications));
    localStorage.setItem('sjt_password_resets', JSON.stringify(passwordResets));
  };

  const loadData = () => {
    const savedUsers = localStorage.getItem('sjt_users');
    const savedFiles = localStorage.getItem('sjt_files');
    const savedChat = localStorage.getItem('sjt_chat');
    const savedAiChat = localStorage.getItem('sjt_ai_chat');
    const savedHomework = localStorage.getItem('sjt_homework');
    const savedNotifications = localStorage.getItem('sjt_notifications');
    const savedResets = localStorage.getItem('sjt_password_resets');
    
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedFiles) setFiles(JSON.parse(savedFiles));
    if (savedChat) setChatMessages(JSON.parse(savedChat));
    if (savedAiChat) setAiChatMessages(JSON.parse(savedAiChat));
    if (savedHomework) setHomework(JSON.parse(savedHomework));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedResets) setPasswordResets(JSON.parse(savedResets));
  };

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginForm.email === 'admin@sjt.be' && loginForm.password === 'admin123') {
      setIsAdmin(true);
      setCurrentView('admin');
      return;
    }
    
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString(), isOnline: true };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      setCurrentView('dashboard');
      addNotification('system', 'Welkom terug!', `Hallo ${user.name}, leuk je weer te zien! 🎉`);
    } else {
      alert('Ongeldig email of wachtwoord');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupForm.email.endsWith('@leerling.sjt.be')) {
      alert('🦉 Oeps! Alleen @leerling.sjt.be email adressen zijn toegestaan. Vraag je leerkracht om hulp!');
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('🔒 Wachtwoorden komen niet overeen!');
      return;
    }
    
    if (users.some(u => u.email === signupForm.email)) {
      alert('📧 Dit email adres is al geregistreerd!');
      return;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name: signupForm.name,
      email: signupForm.email,
      password: signupForm.password,
      year: signupForm.year,
      stream: signupForm.stream,
      subjects: signupForm.subjects,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupForm.name}`,
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isOnline: true
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentView('dashboard');
    addNotification('system', 'Welkom bij SJT!', `Hallo ${newUser.name}! Je account is succesvol aangemaakt! 🎓`);
  };

  const handleLogout = () => {
    if (currentUser) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, isOnline: false } : u));
    }
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentView('login');
    setActiveTab('home');
  };

  // Notifications
  const addNotification = (type: Notification['type'], title: string, message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const requestPasswordReset = () => {
    if (!loginForm.email) {
      alert('Vul je email adres in');
      return;
    }
    setPasswordResets(prev => [...prev, { id: Date.now().toString(), email: loginForm.email }]);
    addNotification('system', 'Reset aangevraagd', `${loginForm.email} heeft om een nieuw wachtwoord gevraagd.`);
    alert('Je verzoek is verstuurd naar de admin.');
  };

  // File management
  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !currentUser) return;
    
    const fileItem: FileItem = {
      id: Date.now().toString(),
      name: uploadForm.file.name,
      type: uploadForm.file.type,
      size: uploadForm.file.size,
      uploadDate: new Date().toISOString(),
      uploader: currentUser.name,
      year: uploadForm.year,
      stream: uploadForm.stream,
      subject: uploadForm.subject,
      exercise: uploadForm.exercise,
      url: URL.createObjectURL(uploadForm.file),
      comments: [],
      reactions: {}
    };
    
    setFiles(prev => [...prev, fileItem]);
    setUploadForm({ year: '', stream: '', subject: '', exercise: '', file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
    addNotification('upload', 'Bestand geüpload!', `${fileItem.name} is succesvol geüpload voor ${fileItem.subject}`);
  };

  const addComment = (fileId: string) => {
    if (!newComment.trim() || !currentUser) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: currentUser.name,
      text: newComment,
      date: new Date().toISOString()
    };
    
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, comments: [...file.comments, comment] }
        : file
    ));
    setNewComment('');
  };

  const addReaction = (fileId: string, emoji: string) => {
    if (!currentUser) return;
    
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        const reactions = { ...file.reactions };
        if (!reactions[emoji]) reactions[emoji] = [];
        
        if (reactions[emoji].includes(currentUser.name)) {
          reactions[emoji] = reactions[emoji].filter(name => name !== currentUser.name);
        } else {
          reactions[emoji].push(currentUser.name);
        }
        
        return { ...file, reactions };
      }
      return file;
    }));
  };

  // Chat functionality
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      user: currentUser.name,
      text: newMessage,
      timestamp: new Date().toISOString(),
      type: 'class'
    };
    
    setChatMessages(prev => [...prev, message]);
    
    // Check for @ai mention
    if (newMessage.toLowerCase().includes('@ai')) {
      setTimeout(() => {
        handleAIResponse();
      }, 1000);
    }
    
    setNewMessage('');
    addNotification('chat', 'Nieuw bericht', `Je hebt een bericht gestuurd in de klaschat`);
  };

  const sendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAiMessage.trim() || !currentUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: currentUser.name,
      text: newAiMessage,
      timestamp: new Date().toISOString(),
      type: 'ai'
    };

    setAiChatMessages(prev => [...prev, message]);
    setNewAiMessage('');

    const recent = [...aiChatMessages, message].slice(-5);
    const msgs = recent.map(m => ({
      role: m.isAI ? 'assistant' : 'user',
      content: m.text
    })) as { role: 'user' | 'assistant'; content: string }[];

    setAiChatTyping(true);
    const reply = await callAssistant(msgs);
    setAiChatTyping(false);

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      user: 'SJT AI Assistent',
      text: reply,
      timestamp: new Date().toISOString(),
      isAI: true,
      type: 'ai'
    };
    setAiChatMessages(prev => [...prev, aiResponse]);
  };

  const handleAIResponse = async () => {
    if (!currentUser) return;

    const recentMessages = chatMessages.slice(-5);
    const msgs = recentMessages.map(m => ({
      role: m.isAI ? 'assistant' : 'user',
      content: m.text
    })) as { role: 'user' | 'assistant'; content: string }[];

    setClassAiTyping(true);
    const reply = await callAssistant(msgs);
    setClassAiTyping(false);

    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'SJT AI Assistent',
      text: reply,
      timestamp: new Date().toISOString(),
      isAI: true,
      type: 'class'
    };

    setChatMessages(prev => [...prev, aiMessage]);
  };

  const callAssistant = async (msgs: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: msgs })
      });
      const data = await response.json();
      return data.reply || '';
    } catch (err) {
      console.error(err);
      return 'Er is een fout opgetreden bij het ophalen van het AI antwoord.';
    }
  };

  // Homework management
  const addHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const homeworkItem: HomeworkItem = {
      id: Date.now().toString(),
      subject: newHomework.subject,
      title: newHomework.title,
      description: newHomework.description,
      dueDate: newHomework.dueDate,
      completed: false,
      priority: newHomework.priority
    };
    
    setHomework(prev => [...prev, homeworkItem]);
    setNewHomework({ subject: '', title: '', description: '', dueDate: '', priority: 'medium' });
    addNotification('homework', 'Huiswerk toegevoegd', `${homeworkItem.title} voor ${homeworkItem.subject}`);
  };

  const toggleHomework = (id: string) => {
    setHomework(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const openProfileEditor = () => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        stream: currentUser.stream,
        avatar: currentUser.avatar,
      });
      setEditingProfile(true);
    }
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      name: profileForm.name,
      stream: profileForm.stream,
      avatar: profileForm.avatar || currentUser.avatar,
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    setEditingProfile(false);
    addNotification('system', 'Profiel bijgewerkt', 'Je profiel is succesvol opgeslagen.');
  };

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-4 h-4" />;
    if (type.includes('video')) return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Save data when state changes
  useEffect(() => {
    saveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, files, chatMessages, aiChatMessages, homework, notifications, passwordResets]);

  if (!securityPassed) {
    return (
      <CloudflareGate
        onSuccess={(token) => {
          fetch('/api/verify-turnstile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.ok) setSecurityPassed(true);
              else alert('Verification failed');
            });
        }}
      />
    );
  }

  // Login Page
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🦉</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welkom bij SJT!</h1>
            <p className="text-gray-600">Log in om toegang te krijgen tot je schoolplatform</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email adres
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="jouw.naam@leerling.sjt.be"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Inloggen 🚀
            </button>
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={requestPasswordReset}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Wachtwoord vergeten?
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nog geen account?{' '}
              <button
                onClick={() => setCurrentView('signup')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Registreer hier!
              </button>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Admin login: admin@sjt.be / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Signup Page
  if (currentView === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎓</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Word lid van SJT!</h1>
            <p className="text-gray-600">Maak je account aan om te beginnen</p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volledige naam
              </label>
              <input
                type="text"
                value={signupForm.name}
                onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Jan Janssen"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email adres
              </label>
              <input
                type="email"
                value={signupForm.email}
                onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="jan.janssen@leerling.sjt.be"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jaar
                </label>
                <select
                  value={signupForm.year}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Kies jaar</option>
                  {['1e', '2e', '3e', '4e', '5e', '6e'].map(year => (
                    <option key={year} value={year}>{year} middelbaar</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Richting
                </label>
                <select
                  value={signupForm.stream}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, stream: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Kies richting</option>
                  {streams.map(stream => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vakken (selecteer minstens één)
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {subjects.map(subject => (
                  <label key={subject} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={signupForm.subjects.includes(subject)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSignupForm(prev => ({ 
                            ...prev, 
                            subjects: [...prev.subjects, subject] 
                          }));
                        } else {
                          setSignupForm(prev => ({ 
                            ...prev, 
                            subjects: prev.subjects.filter(s => s !== subject) 
                          }));
                        }
                      }}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signupForm.password}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bevestig wachtwoord
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              disabled={signupForm.subjects.length === 0}
            >
              Account aanmaken 🎉
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Al een account?{' '}
              <button
                onClick={() => setCurrentView('login')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Log hier in!
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">👨‍💼</div>
                <h1 className="text-xl font-bold text-gray-900">SJT Admin Dashboard</h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Uitloggen</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aantal gebruikers</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Geüploade bestanden</p>
                  <p className="text-2xl font-bold text-gray-900">{files.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Chatberichten</p>
                  <p className="text-2xl font-bold text-gray-900">{chatMessages.length}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Gebruikers Overzicht</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gebruiker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jaar & Richting
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aangemeld
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Laatste Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wachtwoord
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.year} middelbaar</div>
                        <div className="text-sm text-gray-500">{user.stream}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.joinDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isOnline
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visiblePasswords[user.id] ? (
                        user.password
                      ) : (
                        <button onClick={() => setVisiblePasswords(prev => ({ ...prev, [user.id]: true }))} className="text-green-600 hover:text-green-700">
                          Toon
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {passwordResets.length > 0 && (
          <div className="bg-white rounded-lg shadow mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Wachtwoord Reset Verzoeken</h2>
            </div>
            <div className="p-6 space-y-2">
              {passwordResets.map((req) => (
                <div key={req.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{req.email}</span>
                  <button
                    onClick={() => setPasswordResets(prev => prev.filter(r => r.id !== req.id))}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Afgehandeld
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🦉</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sint-Jozefcollege Turnhout</h1>
                <p className="text-sm text-gray-600">Welkom terug, {currentUser?.name}! 👋</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <img 
                  src={currentUser?.avatar} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Uitloggen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'files', label: 'Bestanden', icon: FileText },
              { id: 'chat', label: 'Chat', icon: MessageCircle },
              { id: 'homework', label: 'Huiswerk', icon: Calendar },
              { id: 'profile', label: 'Profiel', icon: User }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'home' | 'files' | 'chat' | 'homework' | 'profile')}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Hallo {currentUser?.name}! 🎓</h2>
                  <p className="text-green-100">
                    {currentUser?.year} middelbaar • {currentUser?.stream}
                  </p>
                  <p className="text-green-100 mt-1">
                    Lid sinds {formatDate(currentUser?.joinDate || '')}
                  </p>
                </div>
                <div className="text-6xl opacity-20">🦉</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Mijn Bestanden</p>
                        <p className="text-lg font-bold text-gray-900">
                          {files.filter(f => f.uploader === currentUser?.name).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Berichten</p>
                        <p className="text-lg font-bold text-gray-900">
                          {chatMessages.filter(m => m.user === currentUser?.name).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Huiswerk</p>
                        <p className="text-lg font-bold text-gray-900">
                          {homework.filter(h => !h.completed).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Vakken</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currentUser?.subjects.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Files */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Mijn Recente Bestanden</h3>
                  </div>
                  <div className="p-6">
                    {files.filter(f => f.uploader === currentUser?.name).slice(0, 5).length > 0 ? (
                      <div className="space-y-3">
                        {files.filter(f => f.uploader === currentUser?.name).slice(0, 5).map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file.type)}
                              <div>
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500">
                                  {file.subject} • {formatDate(file.uploadDate)}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Je hebt nog geen bestanden geüpload</p>
                        <button
                          onClick={() => setActiveTab('files')}
                          className="mt-2 text-green-600 hover:text-green-700 font-medium"
                        >
                          Upload je eerste bestand →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notifications & Homework */}
              <div className="space-y-6">
                {/* Notifications */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Notificaties</h3>
                  </div>
                  <div className="p-6">
                    {notifications.slice(0, 5).length > 0 ? (
                      <div className="space-y-3">
                        {notifications.slice(0, 5).map((notification) => (
                          <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                            <div className="flex items-start space-x-3">
                              <div className={`p-1 rounded-full ${
                                notification.type === 'upload' ? 'bg-green-100' :
                                notification.type === 'chat' ? 'bg-blue-100' :
                                notification.type === 'homework' ? 'bg-yellow-100' :
                                'bg-gray-100'
                              }`}>
                                {notification.type === 'upload' && <Upload className="w-4 h-4 text-green-600" />}
                                {notification.type === 'chat' && <MessageCircle className="w-4 h-4 text-blue-600" />}
                                {notification.type === 'homework' && <Calendar className="w-4 h-4 text-yellow-600" />}
                                {notification.type === 'system' && <Bell className="w-4 h-4 text-gray-600" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                                <p className="text-gray-600 text-xs">{notification.message}</p>
                                <p className="text-gray-400 text-xs mt-1">{formatDate(notification.timestamp)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Geen nieuwe notificaties</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming Homework */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Aankomend Huiswerk</h3>
                  </div>
                  <div className="p-6">
                    {homework.filter(h => !h.completed).slice(0, 3).length > 0 ? (
                      <div className="space-y-3">
                        {homework.filter(h => !h.completed).slice(0, 3).map((item) => (
                          <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.subject}</p>
                                <p className="text-xs text-gray-500">
                                  Deadline: {new Date(item.dueDate).toLocaleDateString('nl-NL')}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                                {item.priority === 'high' ? 'Hoog' : item.priority === 'medium' ? 'Gemiddeld' : 'Laag'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <p className="text-gray-500">Geen openstaand huiswerk! 🎉</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            {/* Upload Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Nieuw Bestand Uploaden 📁</h2>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={uploadForm.year}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, year: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecteer jaar</option>
                    {['1e', '2e', '3e', '4e', '5e', '6e'].map(year => (
                      <option key={year} value={year}>{year} middelbaar</option>
                    ))}
                  </select>
                  
                  <select
                    value={uploadForm.stream}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, stream: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecteer richting</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                  
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecteer vak</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={uploadForm.exercise}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, exercise: e.target.value }))}
                    placeholder="Oefening/Onderwerp"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Zoek bestanden..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files
                .filter(file => 
                  file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  file.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  file.exercise.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((file) => (
                  <div key={file.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.type)}
                          <span className="font-medium text-gray-900 truncate">{file.name}</span>
                        </div>
                        <button
                          onClick={() => setSelectedFile(file)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Vak:</span> {file.subject}</p>
                        <p><span className="font-medium">Oefening:</span> {file.exercise}</p>
                        <p><span className="font-medium">Jaar:</span> {file.year} middelbaar</p>
                        <p><span className="font-medium">Richting:</span> {file.stream}</p>
                        <p><span className="font-medium">Uploader:</span> {file.uploader}</p>
                        <p><span className="font-medium">Datum:</span> {formatDate(file.uploadDate)}</p>
                        <p><span className="font-medium">Grootte:</span> {formatFileSize(file.size)}</p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex space-x-2">
                          {['👍', '❤️', '🎉', '🤔'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(file.id, emoji)}
                              className={`px-2 py-1 rounded text-sm transition-colors ${
                                file.reactions[emoji]?.includes(currentUser?.name || '')
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {emoji} {file.reactions[emoji]?.length || 0}
                            </button>
                          ))}
                        </div>
                        <a
                          href={file.url}
                          download={file.name}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm">Download</span>
                        </a>
                      </div>
                      
                      {/* Comments */}
                      <div className="mt-4 border-t pt-4">
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {file.comments.map((comment) => (
                            <div key={comment.id} className="text-sm">
                              <span className="font-medium text-gray-900">{comment.user}:</span>
                              <span className="text-gray-600 ml-2">{comment.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Voeg een opmerking toe..."
                            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addComment(file.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => addComment(file.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Verstuur
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class Chat */}
            <div className="bg-white rounded-lg shadow flex flex-col h-96">
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50 rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-medium text-green-800">Klaschat</h3>
                  <span className="text-sm text-green-600">({currentUser?.year} {currentUser?.stream})</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Typ @ai om de AI assistent te roepen!</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.user === currentUser?.name ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isAI 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : message.user === currentUser?.name
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.user !== currentUser?.name && (
                        <div className="flex items-center space-x-1 mb-1">
                          {message.isAI && <Bot className="w-4 h-4" />}
                          <p className="text-xs font-medium opacity-75">{message.user}</p>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 opacity-75`}>
                        {formatDate(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {classAiTyping && (
                  <div className="text-center text-sm text-gray-500">AI is aan het denken...</div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Typ je bericht... (gebruik @ai voor AI hulp)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* AI Chat */}
            <div className="bg-white rounded-lg shadow flex flex-col h-96">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-blue-800">AI Assistent</h3>
                </div>
                <p className="text-sm text-blue-600 mt-1">Persoonlijke hulp van je AI assistent</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {aiChatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-500">Hallo! Ik ben je AI assistent. Stel me een vraag! 🤖</p>
                  </div>
                )}
                {aiChatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.user === currentUser?.name ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isAI 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : message.user === currentUser?.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.user !== currentUser?.name && (
                        <div className="flex items-center space-x-1 mb-1">
                          {message.isAI && <Bot className="w-4 h-4" />}
                          <p className="text-xs font-medium opacity-75">{message.user}</p>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 opacity-75`}>
                        {formatDate(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {aiChatTyping && (
                  <div className="text-center text-sm text-gray-500">AI is aan het denken...</div>
                )}
                <div ref={aiChatEndRef} />
              </div>
              
              <form onSubmit={sendAiMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAiMessage}
                    onChange={(e) => setNewAiMessage(e.target.value)}
                    placeholder="Stel een vraag aan de AI..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Homework Tab */}
        {activeTab === 'homework' && (
          <div className="space-y-6">
            {/* Add Homework Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Nieuw Huiswerk Toevoegen 📝</h2>
              <form onSubmit={addHomework} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={newHomework.subject}
                    onChange={(e) => setNewHomework(prev => ({ ...prev, subject: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecteer vak</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  
                  <select
                    value={newHomework.priority}
                    onChange={(e) =>
                      setNewHomework(prev => ({
                        ...prev,
                        priority: e.target.value as 'low' | 'medium' | 'high'
                      }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Lage prioriteit</option>
                    <option value="medium">Gemiddelde prioriteit</option>
                    <option value="high">Hoge prioriteit</option>
                  </select>
                </div>
                
                <input
                  type="text"
                  value={newHomework.title}
                  onChange={(e) => setNewHomework(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titel van het huiswerk"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                
                <textarea
                  value={newHomework.description}
                  onChange={(e) => setNewHomework(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Beschrijving van het huiswerk"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                
                <div className="flex items-center space-x-4">
                  <input
                    type="date"
                    value={newHomework.dueDate}
                    onChange={(e) => setNewHomework(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Toevoegen</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Homework List */}
            <div className="space-y-4">
              {homework.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Geen huiswerk toegevoegd. Voeg je eerste taak toe! 📚</p>
                </div>
              ) : (
                homework.map((item) => (
                  <div key={item.id} className={`bg-white rounded-lg shadow p-6 ${item.completed ? 'opacity-75' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <button
                          onClick={() => toggleHomework(item.id)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            item.completed
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {item.completed && <CheckCircle className="w-3 h-3" />}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {item.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                              {item.priority === 'high' ? 'Hoog' : item.priority === 'medium' ? 'Gemiddeld' : 'Laag'}
                            </span>
                          </div>
                          
                          <p className={`text-sm mb-2 ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{item.subject}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Deadline: {new Date(item.dueDate).toLocaleDateString('nl-NL')}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setHomework(prev => prev.filter(h => h.id !== item.id))}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && currentUser && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow p-6">

              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={editingProfile ? profileForm.avatar || currentUser.avatar : currentUser.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
                  <p className="text-gray-600">{currentUser.email}</p>
                  <p className="text-sm text-gray-500">
                    {currentUser.year} middelbaar • {currentUser.stream}
                  </p>
                </div>
              </div>

              {!editingProfile && (
                <div className="text-right mb-4">
                  <button
                    onClick={openProfileEditor}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Profiel bewerken
                  </button>
                </div>
              )}

              {editingProfile && (
                <form onSubmit={saveProfile} className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Richting</label>
                    <select
                      value={profileForm.stream}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, stream: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Kies richting</option>
                      {streams.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profielfoto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setProfileForm(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
                      }}
                    />
                    {profileForm.avatar && (
                      <img src={profileForm.avatar} alt="Preview" className="mt-2 w-16 h-16 rounded-full" />
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Opslaan
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Annuleren
                    </button>
                  </div>
                </form>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Persoonlijke Informatie</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Naam:</span> {currentUser.name}</p>
                    <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                    <p><span className="font-medium">Jaar:</span> {currentUser.year} middelbaar</p>
                    <p><span className="font-medium">Richting:</span> {currentUser.stream}</p>
                    <p><span className="font-medium">Lid sinds:</span> {formatDate(currentUser.joinDate)}</p>
                    <p><span className="font-medium">Laatste login:</span> {formatDate(currentUser.lastLogin)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Mijn Vakken</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-gray-900 mb-4">Activiteit Overzicht</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {files.filter(f => f.uploader === currentUser.name).length}
                  </div>
                  <div className="text-sm text-gray-600">Bestanden geüpload</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {chatMessages.filter(m => m.user === currentUser.name).length}
                  </div>
                  <div className="text-sm text-gray-600">Berichten verstuurd</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {homework.length}
                  </div>
                  <div className="text-sm text-gray-600">Huiswerk taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {homework.filter(h => h.completed).length}
                  </div>
                  <div className="text-sm text-gray-600">Taken voltooid</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;