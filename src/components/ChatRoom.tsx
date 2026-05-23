import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Phone, Video, Search, MoreVertical, Paperclip, Smile, Mic, Trash2, 
  MapPin, Check, CheckCheck, Compass, Info, FileText, UserPlus, Image, 
  X, AlertTriangle, ArrowRight, ShieldCheck, Clock, Bookmark, Reply, AlertCircle, Sparkles, Star
} from 'lucide-react';
import { Chat, Message } from '../types';
import Avatar from './Avatar';

interface ChatRoomProps {
  chat: Chat;
  onSendMessage: (text: string, type?: Message['type'], meta?: Partial<Message>) => void;
  onDeleteMessage: (msgId: string) => void;
  onStarMessage: (msgId: string) => void;
  onForwardMessage: (msgId: string, targetChatId: string) => void;
  onEditMessage: (msgId: string, newText: string) => void;
  onReactMessage: (msgId: string, reaction: string) => void;
  onStartCall: (type: 'voice' | 'video') => void;
  triggerSearchInChat: boolean;
  contactsToForwardList: { id: string, name: string }[];
  currentUserIdPhone: string;
}

export default function ChatRoom({
  chat,
  onSendMessage,
  onDeleteMessage,
  onStarMessage,
  onForwardMessage,
  onEditMessage,
  onReactMessage,
  onStartCall,
  contactsToForwardList,
  currentUserIdPhone
}: ChatRoomProps) {
  const [inputText, setInputText] = useState('');
  const [inChatSearch, setInChatSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuMsgId, setActiveMenuMsgId] = useState<string | null>(null);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [forwardingMsgId, setForwardingMsgId] = useState<string | null>(null);
  const [themeGradient, setThemeGradient] = useState('from-slate-900 to-slate-950');

  // Simulated Voice Note state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const recordInterval = useRef<any>(null);

  // Auto scroll
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  // Handle disappearing messages checks
  useEffect(() => {
    if (chat.disappearingActive && chat.disappearingDuration) {
      // Just showing a micro visual alert on how newly sent messages will stay active
    }
  }, [chat.disappearingActive, chat.disappearingDuration]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText, 'text');
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // Start Voice Note Recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordSecs(0);
    recordInterval.current = setInterval(() => {
      setRecordSecs(s => s + 1);
    }, 1000);
  };

  const stopRecordingAndSend = () => {
    clearInterval(recordInterval.current);
    setIsRecording(false);
    
    const minutes = Math.floor(recordSecs / 60);
    const seconds = recordSecs % 60;
    const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    onSendMessage(`Voice Note (${formattedDuration})`, 'voice', {
      voiceDuration: formattedDuration,
      mediaUrl: 'recording-' + Date.now() + '.mp3'
    });
  };

  // Handle Attachments Simulation directly
  const triggerAttachment = (type: Message['type'], name: string, detail: string, media?: string) => {
    setShowAttachMenu(false);
    if (type === 'image') {
      onSendMessage(name, 'image', { mediaUrl: media });
    } else if (type === 'document') {
      onSendMessage(name, 'document', { fileName: name, fileSize: detail });
    } else if (type === 'location') {
      onSendMessage(name, 'location', { fileName: name, fileSize: detail });
    } else if (type === 'contact') {
      onSendMessage(name, 'contact', { fileName: name, fileSize: detail });
    } else if (type === 'sticker') {
      onSendMessage(' sticker payload', 'sticker', { mediaUrl: name });
    } else if (type === 'gif') {
      onSendMessage(' gif payload', 'gif', { mediaUrl: name });
    }
  };

  const saveEdit = (msgId: string) => {
    if (!editText.trim()) return;
    onEditMessage(msgId, editText);
    setIsEditingId(null);
    setEditText('');
    setActiveMenuMsgId(null);
  };

  const formatRecordTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sc = secs % 60;
    return `${min}:${sc < 10 ? '0' : ''}${sc}`;
  };

  // Sticker pack configuration
  const STICKERS = ['👾', '🤖', '⚡', '🛡️', '🌐', '🧪', '🔥', '💻', '💖', '🍿'];
  const GIFS = [
    { name: 'Abstract Grid', url: 'https://media.giphy.com/media/l41YcGT5ShJa09kty/giphy.gif' },
    { name: 'Core Matrix', url: 'https://media.giphy.com/media/f3pwQ6fb4fS2A/giphy.gif' },
    { name: 'Futuristic Loop', url: 'https://media.giphy.com/media/AI8M6S89sc9aM/giphy.gif' },
    { name: 'Neon Glitch', url: 'https://media.giphy.com/media/Vsc6LiaEInZte/giphy.gif' }
  ];

  // Colors gradients for Custom background
  const GRADIENTS = [
    { label: 'Cyber Dark', class: 'from-[#080B12] via-slate-950/20 to-[#0D121D]' },
    { label: 'Neon Blue', class: 'from-[#080B12] via-cyan-950/15 to-[#0D121D]' },
    { label: 'Deep Cosmos', class: 'from-[#080B12] via-indigo-950/15 to-[#0D121D]' },
    { label: 'Sleek Slate', class: 'from-[#080B12] via-slate-900/45 to-[#0D121D]' }
  ];

  // Filter messages check
  const displayMessages = chat.messages.filter((msg) => {
    if (!inChatSearch || !searchQuery) return true;
    return msg.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-[#0b141a] text-slate-100 relative" id={`chatroom-${chat.id}`}>
      
      {/* 1. Header Toolbar in WhatsApp style */}
      <div className="p-3 bg-[#202c33] border-b border-white/5 flex justify-between items-center z-10 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar src={chat.avatar} name={chat.name} size="sm" className="w-9 h-9" />
          <div className="min-w-0">
            <h3 className="text-xs font-sans font-bold tracking-tight text-slate-100 flex items-center gap-1 truncate">
              {chat.name}
              {chat.isGroup && (
                <span className="bg-[#111b21] px-1 py-0.5 rounded text-[8px] text-slate-400 font-sans font-extrabold uppercase tracking-wider">Group</span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400 capitalize truncate mt-0.5">
              {chat.status === 'online' ? (
                <span className="text-[#25d366] flex items-center gap-1 font-sans font-semibold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]" /> Online
                </span>
              ) : (
                chat.status
              )}
            </p>
          </div>
        </div>

        {/* Action icons deck */}
        <div className="flex items-center gap-3.5">
          <button
            id="start-voice-call-btn"
            onClick={() => onStartCall('voice')}
            className="text-slate-300 hover:text-[#00a884] transition-colors select-none cursor-pointer"
            title="Start AES encrypted audio call"
          >
            <Phone className="w-4 h-4" />
          </button>
          
          <button
            id="start-video-call-btn"
            onClick={() => onStartCall('video')}
            className="text-slate-300 hover:text-[#00a884] transition-colors select-none cursor-pointer"
            title="Start AES encrypted video call"
          >
            <Video className="w-4.5 h-4.5" />
          </button>

          <button
            id="toggle-search-btn"
            onClick={() => setInChatSearch(!inChatSearch)}
            className={`text-slate-300 hover:text-[#00a884] transition-colors select-none cursor-pointer ${inChatSearch ? 'text-[#00a884]' : ''}`}
            title="Search inside transmission log"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Chat background customizer */}
          <div className="relative group">
            <button className="text-slate-400 hover:text-slate-100 p-1 rounded hover:bg-[#080B12] transition-all select-none">
              <Compass className="w-4.5 h-4.5 animate-spin-slow text-slate-500 hover:text-slate-300" />
            </button>
            <div className="absolute right-0 top-full mt-2 bg-[#0D121D] border border-white/10 rounded-xl p-2 shadow-2xl invisible group-hover:visible min-w-[140px] z-50">
              <p className="text-[9px] font-sans uppercase text-slate-500 mb-1 px-1.5">Theme Array</p>
              {GRADIENTS.map((g) => (
                <button
                  key={g.label}
                  onClick={() => setThemeGradient(g.class)}
                  className="w-full text-left text-[10px] text-slate-400 px-2 py-1.5 rounded hover:bg-[#080B12] hover:text-cyan-400 block transition-all cursor-pointer"
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. In-Chat search bar sliding panel */}
      <AnimatePresence>
        {inChatSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#0D121D] border-b border-white/5 px-4 py-2 flex items-center justify-between z-10"
            id="in-chat-search-panel"
          >
            <div className="flex items-center gap-2 flex-1 relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080B12] border border-white/5 text-[11px] font-sans text-slate-200 pl-8 pr-4 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="Query message texts locally..."
              />
            </div>
            <button 
              onClick={() => { setInChatSearch(false); setSearchQuery(''); }}
              className="text-slate-500 hover:text-slate-300 pl-3 select-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Message Logs Display Block */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-250px)]" id="message-scroller">
        
        {/* End to end encryption compliance splash card formatted in WhatsApp style */}
        <div className="flex justify-center flex-col items-center gap-1.5 py-4 px-8 mb-4 border border-white/5 bg-[#202c33]/40 backdrop-blur-sm rounded-xl max-w-sm mx-auto text-center shadow">
          <ShieldCheck className="w-5.5 h-5.5 text-[#00a884]" />
          <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#00a884] mt-1">E2E Secure Channel</h4>
          <p className="text-[10px] text-slate-350 font-sans leading-relaxed">
            All chats are dynamically encrypted with AES-256. Code pairing identity:
            <span className="font-sans text-[9px] block text-[#25d366] font-bold tracking-widest bg-black/25 px-2 py-1 rounded border border-white/5 mt-1.5">{chat.keyFingerprint}</span>
          </p>
        </div>

        {displayMessages.map((msg, idx) => {
          const isMe = msg.sender === 'me';
          const isSystem = msg.sender === 'system';
          const isMenuOpen = activeMenuMsgId === msg.id;

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="bg-[#202c33] border border-transparent text-[10px] font-sans text-slate-400 px-3 py-1 rounded-lg">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} relative group`}
              id={`msg-bubble-${msg.id}`}
            >
              {/* Message Context Wrapper */}
              <div className="relative max-w-[85%] flex flex-col gap-1">
                
                {/* Replying Context Indicator (Forwarded etc) */}
                {msg.forwarded && (
                  <span className="text-[8px] text-slate-400 font-sans flex items-center gap-1 uppercase tracking-wider mb-0.5">
                    <ArrowRight className="w-2.5 h-2.5 text-[#00a884]" /> Forwarded
                  </span>
                )}
                
                {msg.starred && (
                  <span className="text-[8px] text-slate-400 font-sans flex items-center gap-1 uppercase tracking-wider mb-0.5">
                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" /> Starred
                  </span>
                )}

                {/* Main bubble styled like WhatsApp Web bubble */}
                <div
                  className={`p-2.5 rounded-xl relative shadow transition-all duration-300 border-none ${
                    isMe
                      ? 'bg-[#005c4b] text-slate-100 rounded-tr-none'
                      : 'bg-[#202c33] text-slate-100 rounded-tl-none'
                  }`}
                  onClick={() => setActiveMenuMsgId(isMenuOpen ? null : msg.id)}
                >
                  {/* Reaction overlay */}
                  {msg.reaction && (
                    <span className="absolute -bottom-2 -right-1 text-xs bg-[#0D121D] border border-white/10 px-1.5 py-0.5 rounded-full shadow-lg z-10 animate-pulse">
                      {msg.reaction}
                    </span>
                  )}

                  {/* 3a. IMAGE Type bubble */}
                  {msg.type === 'image' && (
                    <div className="space-y-2">
                      <img
                        referrerPolicy="no-referrer"
                        src={msg.mediaUrl}
                        alt="Photo Transmission"
                        className="rounded-lg max-w-full h-auto object-cover border border-slate-800"
                      />
                      <p className="text-xs font-sans text-slate-100">{msg.text}</p>
                    </div>
                  )}

                  {/* 3b. VOICE Note Type bubble */}
                  {msg.type === 'voice' && (
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center cursor-pointer select-none">
                        <Mic className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        {/* Audio wave animation mockup */}
                        <div className="flex items-center gap-0.5 h-4">
                          {[2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1].map((h, i) => (
                            <span 
                              key={i} 
                              className="bg-emerald-400/50 rounded-full flex-1 transition-all h-full"
                              style={{ height: `${h * 20}%` }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Duration: {msg.voiceDuration || '0:05'}</span>
                      </div>
                    </div>
                  )}

                  {/* 3c. DOCUMENT TYPE bubble */}
                  {msg.type === 'document' && (
                    <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <FileText className="w-8 h-8 text-cyan-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-mono font-semibold text-slate-200 block truncate">{msg.fileName}</span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block mt-1">{msg.fileSize}</span>
                      </div>
                    </div>
                  )}

                  {/* 3d. STICKER TYPE bubble */}
                  {msg.type === 'sticker' && (
                    <div className="text-4xl p-2 select-none animate-bounce duration-1000">
                      {msg.mediaUrl}
                    </div>
                  )}

                  {/* 3e. GIF TYPE bubble */}
                  {msg.type === 'gif' && (
                    <div className="space-y-1">
                      <img
                        referrerPolicy="no-referrer"
                        src={msg.mediaUrl}
                        alt="GIF Payload"
                        className="rounded-lg w-40 h-auto object-cover border border-slate-800"
                      />
                    </div>
                  )}

                  {/* 3f. LOCATION TYPE bubble */}
                  {msg.type === 'location' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-xl border border-slate-850">
                        <MapPin className="w-8 h-8 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-xs font-sans font-bold block">{msg.fileName}</span>
                          <span className="text-[10px] font-mono text-slate-500 block truncate">{msg.fileSize}</span>
                        </div>
                      </div>
                      <div className="h-24 bg-slate-950 rounded-lg overflow-hidden border border-slate-900 relative">
                        {/* Simulation maps wireframe */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-800" />
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-r border-dashed border-slate-800" />
                        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-emerald-500 rounded-full blur-xs" />
                        <MapPin className="w-5 h-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                        <p className="text-[8px] font-mono text-slate-600 uppercase absolute bottom-1 left-2">Orbit Wireframe Grid</p>
                      </div>
                    </div>
                  )}

                  {/* 3g. CONTACT TYPE bubble */}
                  {msg.type === 'contact' && (
                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-2.5 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-mono font-bold text-slate-200">
                          {msg.fileName?.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-sans font-bold text-slate-200 block">{msg.fileName}</span>
                          <span className="text-[10px] font-mono text-slate-400 block">{msg.fileSize}</span>
                        </div>
                      </div>
                      <button className="w-full bg-slate-900 text-[10px] font-sans font-bold hover:bg-slate-850 text-emerald-400 py-1.5 rounded-lg transition-all select-none">
                        Add Cyber Contact Card
                      </button>
                    </div>
                  )}

                  {/* 3h. TEXT TYPE bubble */}
                  {msg.type === 'text' && (
                    <div>
                      {isEditingId === msg.id ? (
                        <div className="space-y-2 min-w-[200px]">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-slate-950 text-xs font-mono text-slate-200 p-2 rounded-lg border border-indigo-500 focus:outline-none"
                            rows={3}
                          />
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => setIsEditingId(null)} className="text-[9px] font-mono text-slate-400 px-2 py-1 bg-slate-800 rounded">Cancel</button>
                            <button onClick={() => saveEdit(msg.id)} className="text-[9px] font-mono text-emerald-400 px-2 py-1 bg-emerald-950/20 border border-emerald-900 rounded">Save</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs font-sans whitespace-pre-wrap">{msg.text}</p>
                      )}
                    </div>
                  )}

                  {/* Bottom details of bubble */}
                  <div className="flex items-center justify-end gap-1.5 mt-1.5 opacity-60">
                    {msg.edited && (
                      <span className="text-[8px] font-mono text-slate-500 uppercase">EDITED</span>
                    )}
                    <span className="text-[9px] font-mono text-slate-500">{msg.timestamp}</span>
                    
                    {isMe && (
                      <span>
                        {msg.status === 'sent' && <Check className="w-3.5 h-3.5 text-slate-400" />}
                        {msg.status === 'delivered' && <CheckCheck className="w-3.5 h-3.5 text-slate-400" />}
                        {msg.status === 'read' && <CheckCheck className="w-3.5 h-3.5 text-[#34b7f1]" />}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dropdown/Interaction Deck for message (Click bubble to reveal) */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: -5 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="absolute top-full mt-1.5 bg-slate-950 border border-slate-900 rounded-2xl p-2.5 shadow-2xl z-40 flex flex-col gap-1 min-w-[220px]"
                    >
                      {/* Emoji reaction options */}
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-1.5">
                        {['👍', '❤️', '😂', '😮', '😢', '🔥'].map((emo) => (
                          <button
                            key={emo}
                            onClick={() => {
                              onReactMessage(msg.id, emo);
                              setActiveMenuMsgId(null);
                            }}
                            className="hover:scale-130 transition-transform p-1 text-sm bg-slate-900 hover:bg-slate-800 rounded cursor-pointer select-none"
                          >
                            {emo}
                          </button>
                        ))}
                      </div>

                      {/* Editing / Star / Forwards options */}
                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-400">
                        {isMe && msg.type === 'text' && (
                          <button
                            id={`action-edit-${msg.id}`}
                            onClick={() => {
                              setIsEditingId(msg.id);
                              setEditText(msg.text);
                            }}
                            className="flex items-center gap-1 px-2 py-1.5 hover:bg-slate-900 hover:text-slate-100 rounded text-left"
                          >
                            <Compass className="w-3 h-3 text-cyan-400" /> Edit Text
                          </button>
                        )}

                        <button
                          id={`action-star-${msg.id}`}
                          onClick={() => {
                            onStarMessage(msg.id);
                            setActiveMenuMsgId(null);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 hover:bg-slate-900 hover:text-slate-100 rounded text-left"
                        >
                          <Bookmark className={`w-3 h-3 ${msg.starred ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} /> {msg.starred ? 'Starred' : 'Star Msg'}
                        </button>

                        <button
                          id={`action-forward-${msg.id}`}
                          onClick={() => {
                            setForwardingMsgId(msg.id);
                            setActiveMenuMsgId(null);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 hover:bg-slate-900 hover:text-slate-100 rounded text-left"
                        >
                          <Reply className="w-3 h-3 text-emerald-400 transform scale-x-[-1]" /> Forward
                        </button>

                        <button
                          id={`action-delete-${msg.id}`}
                          onClick={() => {
                            onDeleteMessage(msg.id);
                            setActiveMenuMsgId(null);
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 hover:bg-slate-900 hover:text-red-400 rounded text-left"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" /> Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* 4. Active Forwarding selection Modal */}
      {forwardingMsgId && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-4" id="forward-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">Forward Transmission</h3>
            <p className="text-[11px] text-slate-400">Select which active communication deck grid line to forward the parsed payload to.</p>
            
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {contactsToForwardList.map(c => (
                <button
                  key={c.id}
                  id={`forward-node-${c.id}`}
                  onClick={() => {
                    onForwardMessage(forwardingMsgId, c.id);
                    setForwardingMsgId(null);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-indigo-950/40 border border-slate-900 hover:border-indigo-500/30 text-xs font-sans font-bold flex justify-between items-center transition-all select-none"
                >
                  <span>{c.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setForwardingMsgId(null)}
              className="w-full bg-slate-800 hover:bg-slate-750 font-sans py-2 rounded-xl text-xs text-slate-300 border border-slate-700 select-none"
            >
              Cancel Transfer
            </button>
          </div>
        </div>
      )}

      {/* 4b. AI intelligence writing feedback warning bubble - WhatsApp styled */}
      {chat.typing && chat.id === 'chattrix-ai' && (
        <div className="px-4 py-1.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-bounce block shrink-0" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-bounce block shrink-0 delay-150" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-bounce block shrink-0 delay-300" />
          <span className="text-[10px] font-sans text-[#25d366] ml-1.5 flex items-center gap-1 font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Decrypting Gemini response...
          </span>
        </div>
      )}

      {/* 5. Attachments drawer styled like WhatsApp */}
      <AnimatePresence>
        {showAttachMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bottom-18 left-0 right-0 p-4 bg-[#202c33] border-t border-white/5 grid grid-cols-4 gap-3 z-20"
            id="attachment-menu"
          >
            {/* Options list */}
            <button
              id="attach-photo-btn"
              onClick={() => triggerAttachment('image', 'Simulated Photo', 'Secure PNG Uplink', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=500&q=80')}
              className="flex flex-col items-center gap-1.5 p-2 bg-[#111b21] border border-transparent hover:border-[#00a884] rounded-xl select-none cursor-pointer"
            >
              <Image className="w-5 h-5 text-[#25d366]" />
              <span className="text-[10px] font-sans text-slate-300 font-semibold">Gallery</span>
            </button>

            <button
              id="attach-doc-btn"
              onClick={() => triggerAttachment('document', 'chattrix_blueprint_x11.pdf', '2.5 MB')}
              className="flex flex-col items-center gap-1.5 p-2 bg-[#111b21] border border-transparent hover:border-[#00a884] rounded-xl select-none cursor-pointer"
            >
              <FileText className="w-5 h-5 text-[#53bdeb]" />
              <span className="text-[10px] font-sans text-slate-300 font-semibold">Document</span>
            </button>

            <button
              id="attach-location-btn"
              onClick={() => triggerAttachment('location', 'Global Safehouse Sector 7', 'lat: 35.6894, lng: 139.6917')}
              className="flex flex-col items-center gap-1.5 p-2 bg-[#111b21] border border-transparent hover:border-yellow-400 rounded-xl select-none cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-[#ffbc34]" />
              <span className="text-[10px] font-sans text-slate-300 font-semibold">Location</span>
            </button>

            <button
              id="attach-contact-btn"
              onClick={() => triggerAttachment('contact', 'Aria Nova | Decryption Core', '+1 (555) 012-9011')}
              className="flex flex-col items-center gap-1.5 p-2 bg-[#111b21] border border-transparent hover:border-blue-500 rounded-xl select-none cursor-pointer"
            >
              <UserPlus className="w-5 h-5 text-[#3b82f6]" />
              <span className="text-[10px] font-sans text-slate-300 font-semibold">Contact</span>
            </button>

            {/* Sticker panel options inside attachment drawer */}
            <div className="col-span-4 border-t border-white/5 pt-3">
              <span className="text-[9px] font-sans uppercase text-slate-500 font-bold tracking-wider block mb-2">Sticker Matrix Deck</span>
              <div className="flex gap-2 bg-[#080B12] p-2 rounded-xl overflow-x-auto scroller-hidden">
                {STICKERS.map((st) => (
                  <button
                    key={st}
                    id={`sticker-btn-${st}`}
                    onClick={() => triggerAttachment('sticker', st, '')}
                    className="text-2xl hover:scale-130 transition-transform select-none shrink-0 cursor-pointer"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* GIF panel options inside attachment drawer */}
            <div className="col-span-4 border-t border-white/5 pt-3">
              <span className="text-[9px] font-sans uppercase text-slate-500 font-bold tracking-wider block mb-2">Simulated Gifs Array</span>
              <div className="grid grid-cols-2 gap-2">
                {GIFS.map((g) => (
                  <button
                    key={g.name}
                    id={`gif-btn-${g.name.replace(/\s+/g, '-')}`}
                    onClick={() => triggerAttachment('gif', g.url, '')}
                    className="flex items-center gap-2 bg-[#080B12] hover:bg-[#080B12]/80 hover:border-cyan-500/20 border border-white/5 rounded-lg p-1.5 text-[10px] text-slate-400 select-none text-left cursor-pointer"
                  >
                    <img referrerPolicy="no-referrer" src={g.url} className="w-8 h-8 rounded object-cover border border-white/5" />
                    <span className="truncate">{g.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Message Compose Bar styled in deep grey */}
      <div className="p-3 bg-[#202c33] border-t border-white/5 flex items-center gap-3 shrink-0 relative z-30" id="message-compose-panel">
        
        {/* Attachment menu toggle */}
        <button
          id="toggle-attach-btn"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className={`p-2.5 rounded-full hover:bg-[#111b21] transition-colors select-none shrink-0 cursor-pointer ${showAttachMenu ? 'bg-[#111b21] text-[#00a884]' : 'text-slate-300'}`}
        >
          <Paperclip className="w-4.5 h-4.5" />
        </button>

        {/* Input box */}
        <div className="flex-1 relative flex items-center bg-[#111b21] border-none rounded-xl px-3.5 py-1 mr-1">
          {isRecording ? (
            <div className="flex-1 flex items-center justify-between text-xs text-red-400 font-sans py-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                RECORDING AUDIO...
              </span>
              <span className="font-bold">{formatRecordTime(recordSecs)}</span>
            </div>
          ) : (
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full bg-transparent font-sans text-xs text-slate-100 placeholder-slate-450 py-2.5 focus:outline-none focus:ring-0"
              placeholder={chat.id === 'chattrix-ai' ? "Type a message to Gemini AI Assistant..." : "Type a message..."}
              id="message-text-input"
            />
          )}
        </div>

        {/* Dynamic microphone or submit button */}
        {inputText.trim() ? (
          <button
            id="send-message-btn"
            onClick={handleSend}
            className="p-3 bg-[#00a884] hover:bg-[#128c7e] text-white rounded-full shadow active:scale-95 transition-all select-none shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            id="voice-record-btn"
            onClick={isRecording ? stopRecordingAndSend : startRecording}
            className={`p-3 rounded-full shadow transition-all select-none shrink-0 cursor-pointer ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-[#111b21] text-slate-300 hover:text-white hover:bg-[#2a3942]'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
