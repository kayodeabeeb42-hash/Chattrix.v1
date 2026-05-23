import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ScanLine, Smartphone, Settings, LogOut, CheckCheck, 
  CornerDownRight, Globe, Lock, Code, Cpu, Terminal, ShieldAlert as AlertIcon, X
} from 'lucide-react';

// Data and Types imports
import { Chat, Story, BroadcastChannel, Community, CallLog, Message, ActiveTab } from './types';
import { INITIAL_CHATS, INITIAL_STORIES, BROADCAST_CHANNELS, COMMUNITIES, CALL_LOGS, AVAILABLE_CONTACTS } from './data';

// Custom inline secure WhatsApp-styled logo representation for Chattrix
function ChattrixLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12C2 13.921 2.541 15.714 3.479 17.243L2.091 21.408C1.983 21.732 2.268 22.017 2.592 21.909L6.757 20.521C8.286 21.459 10.079 21.999 12 21.999C17.523 21.999 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#00a884" />
      <path d="M9 10V9C9 7.343 10.343 6 12 6C13.657 6 15 7.343 15 9V10" stroke="#111B21" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="8.5" y="10.5" width="7" height="5.5" rx="1.2" fill="white" />
      <circle cx="12" cy="13" r="1" fill="#00a884" />
    </svg>
  );
}

// Component imports
import LoginScreen from './components/LoginScreen';
import BottomNavBar from './components/BottomNavBar';
import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';
import UpdatesView from './components/UpdatesView';
import SettingsView from './components/SettingsView';
import CallScreen from './components/CallScreen';

export default function App() {
  // Splash control
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);

  // Splash auto progress handler
  useEffect(() => {
    if (showSplash) {
      const interval = setInterval(() => {
        setSplashProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowSplash(false);
            }, 350);
            return 100;
          }
          const increment = Math.floor(Math.random() * 8) + 12;
          return Math.min(prev + increment, 100);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showSplash]);

  // Auth control
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const savedUser = localStorage.getItem('chattrix_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed && parsed.loggedIn === true;
      }
    } catch (e) {
      console.error('Failed to parse auto login state', e);
    }
    return false;
  });

  const [username, setUsername] = useState(() => {
    try {
      const savedUser = localStorage.getItem('chattrix_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed?.username || 'Kayzeehh';
      }
    } catch (e) {}
    return 'Kayzeehh';
  });

  const [phoneNumber, setPhoneNumber] = useState(() => {
    try {
      const savedUser = localStorage.getItem('chattrix_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed?.phoneNumber || '+1 (555) 019-3294';
      }
    } catch (e) {}
    return '+1 (555) 019-3294';
  });

  const [userAvatar, setUserAvatar] = useState(() => {
    try {
      const savedUser = localStorage.getItem('chattrix_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed?.userAvatar || '';
      }
    } catch (e) {}
    return '';
  });

  // App core datasets
  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const savedUser = localStorage.getItem('chattrix_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.phoneNumber) {
          const savedChats = localStorage.getItem(`chattrix_chats_${parsed.phoneNumber}`);
          if (savedChats) {
            return JSON.parse(savedChats);
          }
        }
      }
    } catch (e) {
      console.error('Failed to retrieve active secure chats from local db', e);
    }
    return INITIAL_CHATS;
  });
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [channels, setChannels] = useState<BroadcastChannel[]>(BROADCAST_CHANNELS);
  const [communities, setCommunities] = useState<Community[]>(COMMUNITIES);
  const [callLogs, setCallLogs] = useState<CallLog[]>(CALL_LOGS);

  // Tab and view controllers
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{ contactName: string; contactAvatar: string; type: 'voice' | 'video' } | null>(null);
  const [inspectedFingerprintChat, setInspectedFingerprintChat] = useState<Chat | null>(null);

  // Dynamic chat handler: starts chat with pre-defined contact nodes or opens existing one
  const handleStartChatWithContact = (contactId: string) => {
    const exists = chats.find(c => c.id === contactId);
    if (exists) {
      setActiveChatId(contactId);
      return;
    }

    const contact = AVAILABLE_CONTACTS.find(c => c.id === contactId);
    if (!contact) return;

    const newChat: Chat = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      status: contact.status,
      unreadCount: 0,
      pinned: false,
      keyFingerprint: contact.keyFingerprint,
      messages: [
        {
          id: 'welcome-' + Date.now(),
          text: contact.welcomeMessage,
          sender: 'other',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          type: 'text',
          status: 'read'
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(contactId);
  };

  // Add chat by phone number manually
  const handleAddChatByPhone = (phone: string, name: string) => {
    const exists = chats.find(c => c.id === 'phone-' + phone);
    if (exists) {
      setActiveChatId('phone-' + phone);
      return;
    }

    const newChat: Chat = {
      id: 'phone-' + phone,
      name: name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      status: 'offline',
      unreadCount: 0,
      pinned: false,
      keyFingerprint: 'FPR-' + Math.floor(100000 + Math.random() * 900000).toString() + '-SHA256',
      messages: [
        {
          id: 'init-' + Date.now(),
          text: `🔒 Handshake established. Symmetrical keys generated with ${name}. Phone number: ${phone}`,
          sender: 'system',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          type: 'text',
          status: 'read'
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  // Helper: Retrieve active chat index
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  // Helper: Calculate global unread badge numbers for lower buttons
  const unreadChatsCount = chats.filter(c => c.unreadCount > 0 && !c.archived).length;
  const hasNewStatusUpdates = stories.some(s => !s.viewed);
  const unreadCommunitiesAlert = communities.some(com => com.joined && com.subgroups.some(sub => sub.unread));
  const hasMissedCallsAlert = callLogs.some(log => log.direction === 'missed');

  // Auto clear active room unreads when open
  useEffect(() => {
    if (activeChatId && activeTab === 'chats') {
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      }));
    }
  }, [activeChatId, activeTab]);

  // Handle Login event from OTP verify
  const handleLoginSuccess = (phone: string, uname: string, isNewSignUp: boolean) => {
    setPhoneNumber(phone);
    setUsername(uname);
    setIsLoggedIn(true);
    setUserAvatar('');

    try {
      localStorage.setItem('chattrix_current_user', JSON.stringify({
        username: uname,
        phoneNumber: phone,
        userAvatar: '',
        loggedIn: true
      }));
    } catch (e) {
      console.error('Failed to persist user session', e);
    }
    
    if (isNewSignUp) {
      // Empty chats for brand new accounts!
      setChats([]);
    } else {
      // Load chats matching phone number if found
      try {
        const saved = localStorage.getItem(`chattrix_chats_${phone}`);
        if (saved) {
          setChats(JSON.parse(saved));
        } else {
          setChats([]);
        }
      } catch (err) {
        setChats([]);
      }
    }
  };

  // Auto-save chats whenever they undergo transformation
  useEffect(() => {
    if (isLoggedIn && phoneNumber) {
      try {
        localStorage.setItem(`chattrix_chats_${phoneNumber}`, JSON.stringify(chats));
      } catch (err) {
        console.error('LocalStorage write failed:', err);
      }
    }
  }, [chats, isLoggedIn, phoneNumber]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('chattrix_current_user');
    } catch (e) {}
    setIsLoggedIn(false);
    setActiveTab('chats');
    setActiveChatId(null);
    setChats([]);
  };

  // Profile metadata update
  const handleUpdateProfile = (name: string, phone: string, avatarUrl?: string) => {
    setUsername(name);
    setPhoneNumber(phone);
    if (avatarUrl) {
      setUserAvatar(avatarUrl);
    }
    try {
      localStorage.setItem('chattrix_current_user', JSON.stringify({
        username: name,
        phoneNumber: phone,
        userAvatar: avatarUrl || userAvatar,
        loggedIn: true
      }));
    } catch (e) {
      console.error('Failed to update persisted user session', e);
    }
  };

  // Dispatched action: MESSAGE SENDER HANDLER
  const handleSendMessage = (text: string, type: Message['type'] = 'text', meta: Partial<Message> = {}) => {
    if (!activeChatId) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      text,
      sender: 'me',
      timestamp: formattedTime,
      type,
      status: 'sent',
      ...meta
    };

    // Update active chat's message state
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    // Start ticks progression simulation (sent -> delivered -> read)
    simulateReadReceipts(activeChatId, newMsg.id);

    // AI or Peer automated responses trigger
    if (activeChatId === 'chattrix-ai') {
      triggerAiAssistantResponse(text);
    } else {
      triggerPeerResponse(activeChatId, text);
    }
  };

  // Receipt single/double checks timers logic
  const simulateReadReceipts = (chatId: string, msgId: string) => {
    setTimeout(() => {
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === msgId ? { ...m, status: 'delivered' as const } : m)
          };
        }
        return c;
      }));
    }, 800);

    setTimeout(() => {
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === msgId ? { ...m, status: 'read' as const } : m)
          };
        }
        return c;
      }));
    }, 1800);
  };

  // AI assistant integration via backend server-side proxy
  const triggerAiAssistantResponse = async (userText: string) => {
    // 1. Set AI user typing dot animation
    setChats(prev => prev.map(c => c.id === 'chattrix-ai' ? { ...c, typing: true } : c));

    try {
      // Collect message history state for Gemini content payload
      const aiChatObj = chats.find(c => c.id === 'chattrix-ai');
      const msgList = aiChatObj ? [...aiChatObj.messages] : [];
      
      const payloadMessages = msgList.map(m => ({
        text: m.text,
        sender: m.sender
      }));

      // Append the newly sent message which might not be inside chats state just yet
      payloadMessages.push({ text: userText, sender: 'me' });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: payloadMessages })
      });

      if (!res.ok) {
        throw new Error('Satellite node communication error');
      }

      const data = await res.json();
      
      const responseText = data.text || "Transmission error. My AI quantum relay was disrupted, try again.";

      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const aiMsg: Message = {
        id: 'msg-ai-' + Date.now(),
        text: responseText,
        sender: 'other',
        timestamp: formattedTime,
        type: 'text',
        status: 'read'
      };

      setChats(prev => prev.map(c => {
        if (c.id === 'chattrix-ai') {
          return {
            ...c,
            typing: false,
            messages: [...c.messages, aiMsg]
          };
        }
        return c;
      }));

    } catch (err) {
      console.log("Error contacting Gemini server API, falling back to secure sandbox simulations.", err);
      
      // Sandbox fallback response after delay
      setTimeout(() => {
        const fallbackText = "I've analyzed your transmission! Under typical conditions, the Gemini server-side controller decodes this via photonic streams. Try checking Setting secrets or retry.";
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
        const aiMsg: Message = {
          id: 'msg-ai-fallback-' + Date.now(),
          text: fallbackText,
          sender: 'other',
          timestamp: formattedTime,
          type: 'text',
          status: 'read'
        };

        setChats(prev => prev.map(c => c.id === 'chattrix-ai' ? { ...c, typing: false, messages: [...c.messages, aiMsg] } : c));
      }, 1500);
    }
  };

  // Simulated peer instant chatter replies (Aria, Zia)
  const triggerPeerResponse = (chatId: string, userText: string) => {
    // Determine typical chatter bio
    const contact = chats.find(c => c.id === chatId);
    if (!contact || contact.isGroup) return;

    setTimeout(() => {
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, typing: true } : c));
    }, 1500);

    setTimeout(() => {
      let replyText = "Received coordinates! I am encrypting a payload index packet to match.";
      const phrase = userText.toLowerCase();

      if (phrase.includes('call') || phrase.includes('talk')) {
        replyText = "Initiate an safe VOIP downlink from your top-right video or speech buttons; I am online and verified!";
      } else if (chatId === 'aria-nova') {
        if (phrase.includes('key') || phrase.includes('shield')) {
          replyText = "I rotated the asymmetric key sequences. No cyber-intruder holds card decoders now!";
        } else {
          replyText = "That sounds fascinating Kayzeehh! Let's schedule a tactical sync on our Dev Cyberdeck Alliance community subgroups.";
        }
      } else if (chatId === 'zia-chen') {
        replyText = "Aria and I just reviewed the glassmorphism layout animations. It looks super futuristic and performant!";
      }

      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const replyMsg: Message = {
        id: 'msg-reply-' + Date.now(),
        text: replyText,
        sender: 'other',
        timestamp: formattedTime,
        type: 'text',
        status: 'read'
      };

      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            typing: false,
            messages: [...c.messages, replyMsg]
          };
        }
        return c;
      }));
    }, 4500);
  };

  // Star/unstar messages
  const handleStarMessage = (msgId: string) => {
    if (!activeChatId) return;
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: c.messages.map(m => m.id === msgId ? { ...m, starred: !m.starred } : m)
        };
      }
      return c;
    }));
  };

  // Delete message
  const handleDeleteMessage = (msgId: string) => {
    if (!activeChatId) return;
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: c.messages.filter(m => m.id !== msgId)
        };
      }
      return c;
    }));
  };

  // Edit message
  const handleEditMessage = (msgId: string, newText: string) => {
    if (!activeChatId) return;
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: c.messages.map(m => m.id === msgId ? { ...m, text: newText, edited: true } : m)
        };
      }
      return c;
    }));
  };

  // Forward message across chat rooms
  const handleForwardMessage = (msgId: string, targetChatId: string) => {
    if (!activeChatId) return;
    const srcChat = chats.find(c => c.id === activeChatId);
    const targetMsg = srcChat?.messages.find(m => m.id === msgId);
    
    if (!targetMsg) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const copiedMsg: Message = {
      ...targetMsg,
      id: 'forward-' + Date.now(),
      sender: 'me',
      timestamp: formattedTime,
      forwarded: true,
      status: 'sent'
    };

    setChats(prev => prev.map(c => {
      if (c.id === targetChatId) {
        return {
          ...c,
          messages: [...c.messages, copiedMsg],
          unreadCount: targetChatId !== activeChatId ? c.unreadCount + 1 : c.unreadCount
        };
      }
      return c;
    }));

    simulateReadReceipts(targetChatId, copiedMsg.id);
  };

  // React to msg
  const handleReactMessage = (msgId: string, reaction: string) => {
    if (!activeChatId) return;
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: c.messages.map(m => m.id === msgId ? { ...m, reaction } : m)
        };
      }
      return c;
    }));
  };

  // Pin/unpin chat in sidebar list
  const handleTogglePin = (chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, pinned: !c.pinned } : c));
  };

  // Archive/unarchive chat in sidebar list
  const handleToggleArchive = (chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, archived: !c.archived } : c));
  };

  // Post dynamic user Status Story
  const handleAddStory = (statusText: string) => {
    const newStory: Story = {
      id: 'story-' + Date.now(),
      contactName: 'My Status',
      contactAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      mediaUrl: '',
      timestamp: 'Just now',
      type: 'text',
      textContent: statusText,
      bgColor: 'from-cyan-600/80 to-slate-900/90',
      viewed: false
    };

    setStories(prev => [newStory, ...prev]);
  };

  // Subscribe to broadcasting channels
  const handleFollowChannel = (chanId: string) => {
    setChannels(prev => prev.map(c => c.id === chanId ? { ...c, followed: !c.followed, subscribersCount: c.followed ? c.subscribersCount - 1 : c.subscribersCount + 1 } : c));
  };

  // Like broadcasting posts
  const handleLikePost = (chanId: string, postId: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === chanId) {
        return {
          ...c,
          posts: c.posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
        };
      }
      return c;
    }));
  };

  // Join/leave Parent communities
  const handleJoinCommunity = (commId: string) => {
    setCommunities(prev => prev.map(c => c.id === commId ? { ...c, joined: !c.joined } : c));
  };

  // Trigger VoIP call simulated screen pop-up
  const handleStartCall = (type: 'voice' | 'video') => {
    if (!activeChat) return;
    setActiveCall({
      contactName: activeChat.name,
      contactAvatar: activeChat.avatar,
      type
    });
  };

  // Hangup call logic and insert outgoing log entry
  const handleEndCall = (duration: string) => {
    if (!activeCall) return;

    const newLog: CallLog = {
      id: 'call-log-' + Date.now(),
      contactName: activeCall.contactName,
      contactAvatar: activeCall.contactAvatar,
      type: activeCall.type,
      direction: duration === 'Cancelled' ? 'missed' : 'outgoing',
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      duration: duration !== 'Cancelled' ? duration : undefined
    };

    setCallLogs(prev => [newLog, ...prev]);
    setActiveCall(null);
  };

  // Main UI render
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 p-0 md:p-4 selection:bg-emerald-500/30 font-sans text-slate-100">
      
      {/* Outer ambient styling panels for desktop layouts */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse delay-500" />

      {/* Responsive Smartphone Mockup frame (acts of full screen width on viewport sizes below small) */}
      <div 
        className="w-full max-w-lg md:max-w-md h-screen md:h-[820px] bg-[#080B12] md:rounded-[40px] border-none md:border-2 md:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)] relative flex flex-col overflow-hidden"
        id="device-frame"
      >
        {/* Elegant top notch frame for phone mock */}
        <div className="hidden md:flex absolute top-0 inset-x-0 h-6 bg-[#080B12] items-center justify-center z-40 select-none">
          <div className="w-24 h-4 bg-[#0D121D] rounded-full border border-white/5 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-[#080B12] rounded-full" />
          </div>
        </div>

        {/* Dynamic content routing layers */}
        <div className="flex-1 mt-0 md:mt-4 h-full relative flex flex-col bg-[#080B12] pb-0">
          
          <AnimatePresence mode="wait">
            {showSplash ? (
              <motion.div
                key="splash-screen"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.35, ease: 'easeInOut' } }}
                className="absolute inset-0 z-50 bg-[#080B12] flex flex-col justify-between items-center p-8 select-none"
              >
                <div />

                <div className="flex flex-col items-center space-y-6">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative w-20 h-20 bg-[#00a884]/10 rounded-[24px] flex items-center justify-center border border-[#00a884]/30 shadow-[0_0_35px_rgba(0,168,132,0.25)]"
                  >
                    <svg className="w-11 h-11 text-[#00a884]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.477 2 2 6.477 2 12C2 13.921 2.541 15.714 3.479 17.243L2.091 21.408C1.983 21.732 2.268 22.017 2.592 21.909L6.757 20.521C8.286 21.459 10.079 21.999 12 21.999C17.523 21.999 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor" />
                      <path d="M9 10V9C9 7.343 10.343 6 12 6C13.657 6 15 7.343 15 9V10" stroke="#080B12" strokeWidth="2.2" strokeLinecap="round" />
                      <rect x="8.5" y="10.5" width="7" height="5.5" rx="1.2" fill="white" />
                    </svg>
                    <span className="absolute inset-0 rounded-[24px] border border-[#00a884]/30 animate-pulse pointer-events-none" />
                  </motion.div>

                  <div className="text-center space-y-1.5 animate-pulse">
                    <motion.h1 
                      initial={{ letterSpacing: '0.1em', opacity: 0 }}
                      animate={{ letterSpacing: '0.2em', opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="text-lg font-sans font-black tracking-widest text-slate-100 uppercase"
                    >
                      CHATTRIX
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.65 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-[9px] text-[#00a884] font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 bg-[#25d366] rounded-full animate-pulse" />
                      E2EE Quantum gateway
                    </motion.p>
                  </div>
                </div>

                <div className="w-full max-w-[240px] text-center space-y-4">
                  <div className="space-y-1.5">
                    <div className="h-1 bg-[#111b21] rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#00a884] to-[#25d366] transition-all duration-100 ease-out" 
                        style={{ width: `${splashProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-slate-500">
                      <span>Initializing gateway...</span>
                      <span>{splashProgress}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSplash(false)}
                    className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-[#202c33]/50 border border-white/5 py-1 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Skip Intro
                  </button>
                </div>
              </motion.div>
            ) : !isLoggedIn ? (
              <motion.div
                key="login-screen-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="absolute inset-0 flex flex-col"
              >
                <LoginScreen onLoginSuccess={handleLoginSuccess} />
              </motion.div>
            ) : activeCall ? (
              <CallScreen
                contactName={activeCall.contactName}
                contactAvatar={activeCall.contactAvatar}
                callType={activeCall.type}
                onEndCall={handleEndCall}
              />
            ) : (
              <motion.div
                key="main-app"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col h-full relative" 
                id="auth-app-frame"
              >
                {/* Primary Top App Bar styled like WhatsApp premium layout */}
                <div className="px-4 py-3 bg-[#202c33] border-b border-white/5 flex justify-between items-center shrink-0 z-30 shadow-sm select-none">
                  <div className="flex items-center gap-2">
                    <ChattrixLogo className="w-5.5 h-5.5 shrink-0" />
                    <h1 className="text-sm font-sans font-black tracking-wider text-white">
                      CHATTRIX
                    </h1>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-[#111b21] border border-white/5 px-2.5 py-1 rounded-lg text-[9px] font-sans font-bold text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#25d366] rounded-full animate-pulse" />
                      SECURE UPLINK
                    </div>
                  </div>
                </div>

                {/* Central Tab Content Router Switch */}
                <div className="flex-1 min-h-0 bg-[#080B12]/45 backdrop-blur-xs relative">
                  
                  {/* A. CHATS TAB */}
                  {activeTab === 'chats' && (
                    <div className="grid grid-cols-1 h-full">
                      {activeChatId && activeChat ? (
                        /* Chat room splits back to list dynamically on layout or selection toggles */
                        <div className="flex flex-col h-full">
                          {/* Sub-toolbar to go back to chat lines list in WhatsApp style */}
                          <div className="bg-[#202c33] border-b border-white/5 px-4 py-2 flex items-center gap-2 shrink-0 select-none">
                            <button
                              id="back-to-chats-list-btn"
                              onClick={() => setActiveChatId(null)}
                              className="bg-[#111b21] text-[10px] font-sans font-semibold hover:bg-white/5 text-[#00a884] px-3 py-1.5 rounded-lg border border-white/15 transition-all cursor-pointer flex items-center gap-1"
                            >
                              ← Back to Chats List
                            </button>
                          </div>
                          <ChatRoom
                            chat={activeChat}
                            onSendMessage={handleSendMessage}
                            onDeleteMessage={handleDeleteMessage}
                            onStarMessage={handleStarMessage}
                            onForwardMessage={handleForwardMessage}
                            onEditMessage={handleEditMessage}
                            onReactMessage={handleReactMessage}
                            onStartCall={handleStartCall}
                            triggerSearchInChat={false}
                            currentUserIdPhone={phoneNumber}
                            contactsToForwardList={chats.filter(c => c.id !== activeChatId).map(c => ({ id: c.id, name: c.name }))}
                          />
                        </div>
                      ) : (
                        <ChatList
                          chats={chats}
                          activeChatId={activeChatId}
                          onChatSelect={(id) => setActiveChatId(id)}
                          onTogglePin={handleTogglePin}
                          onToggleArchive={handleToggleArchive}
                          onShowEncryptionFingerprint={(chat) => setInspectedFingerprintChat(chat)}
                          onStartChatWithContact={handleStartChatWithContact}
                          onAddChatByPhone={handleAddChatByPhone}
                        />
                      )}
                  </div>
                  )}

                  {/* B. UPDATES STATUS TIMELINE TAB */}
                  {activeTab === 'updates' && (
                    <UpdatesView
                      stories={stories}
                      channels={channels}
                      communities={communities}
                      onAddStory={handleAddStory}
                      onFollowChannel={handleFollowChannel}
                      onLikePost={handleLikePost}
                      onJoinCommunity={handleJoinCommunity}
                    />
                  )}

                  {/* E. SETTINGS TAB */}
                  {activeTab === 'settings' && (
                    <SettingsView
                      username={username}
                      phoneNumber={phoneNumber}
                      onUpdateProfile={handleUpdateProfile}
                      onLogout={handleLogout}
                      currentUserAvatar={userAvatar}
                    />
                  )}

                </div>

                {/* App Bottom navigation deck */}
                <BottomNavBar
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    // Dynamic: on clicking chats, if you had an active chat, preserve or reset it
                    if (tab === 'chats') {
                      // Do not auto-reset active chat unless previously closed
                    } else {
                      setActiveChatId(null);
                    }
                  }}
                  unreadChats={unreadChatsCount}
                  hasNewStatus={hasNewStatusUpdates}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* 6. SYSTEM OVERLAY: EMBEDDED SHA-256 E2E INSULATION CARD INSPECTOR */}
        <AnimatePresence>
          {inspectedFingerprintChat && (
            <div 
              className="absolute inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
              id="fingerprint-inspector-modal"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6.5 w-full max-w-sm space-y-5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-indigo-500" />
                
                <div className="mx-auto w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-850">
                  <Lock className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)] animate-pulse" />
                </div>
                
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">SHA-256 Key Verified</h3>
                  <span className="text-[10px] text-slate-500 block mt-1">E2E Cryptographic Fingerprint for:</span>
                  <span className="text-xs font-sans font-bold text-slate-200 mt-2 block">{inspectedFingerprintChat.name}</span>
                </div>

                <div className="bg-slate-955 p-4 rounded-2xl border border-slate-850 space-y-3.5 text-left">
                  <div className="flex gap-1.5 items-start">
                    <CornerDownRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-mono text-slate-400">
                      Unique symmetrical handshakes scramble outgoing metadata layers. Local deck validates fingerprint authenticity match.
                    </p>
                  </div>
                  
                  <span className="font-mono text-[11px] font-bold text-emerald-400 bg-slate-950 p-2.5 rounded-lg border border-slate-900 select-all block tracking-widest text-center">
                    {inspectedFingerprintChat.keyFingerprint}
                  </span>
                </div>

                <div className="flex gap-2 font-mono text-[9px] text-slate-500 justify-center">
                  <span>CHATTRIX CYBER GUARD SECURE</span>
                </div>

                <button
                  onClick={() => setInspectedFingerprintChat(null)}
                  className="w-full bg-slate-800 hover:bg-slate-755 font-sans py-2.5 rounded-xl border border-slate-705 text-xs text-slate-300 select-none"
                >
                  Terminate Audit Readout
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
