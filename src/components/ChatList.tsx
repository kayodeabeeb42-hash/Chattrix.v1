import { useState } from 'react';
import { Search, Pin, Archive, HelpCircle, ShieldAlert, BadgeInfo, Star, Layers, FolderArchive, ArrowRightLeft, MessageSquare, Lock } from 'lucide-react';
import { Chat } from '../types';
import { AVAILABLE_CONTACTS } from '../data';
import Avatar from './Avatar';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onTogglePin: (chatId: string) => void;
  onToggleArchive: (chatId: string) => void;
  onShowEncryptionFingerprint: (chat: Chat) => void;
  onStartChatWithContact?: (contactId: string) => void;
  onAddChatByPhone?: (phone: string, name: string) => void;
}

type FilterType = 'all' | 'unread' | 'groups' | 'pinned' | 'archived';

export default function ChatList({
  chats,
  activeChatId,
  onChatSelect,
  onTogglePin,
  onToggleArchive,
  onShowEncryptionFingerprint,
  onStartChatWithContact,
  onAddChatByPhone
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showDirectory, setShowDirectory] = useState(false);
  const [phoneToAdd, setPhoneToAdd] = useState('');
  const [nameToAdd, setNameToAdd] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Filter messages based on search query AND tab filters
  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      chat.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Split archived vs non-archived logically in default view
    if (activeFilter === 'archived') {
      return matchesSearch && chat.archived;
    }

    // Usually, do not show archived chats unless 'archived' filter is open
    if (chat.archived) return false;

    switch (activeFilter) {
      case 'unread':
        return matchesSearch && chat.unreadCount > 0;
      case 'groups':
        return matchesSearch && chat.isGroup;
      case 'pinned':
        return matchesSearch && chat.pinned;
      default:
        return matchesSearch;
    }
  });

  // Sort chats: pinned always go to the top, then sorted by latest message timestamp
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const getLatestMessage = (chat: Chat) => {
    const textMsg = [...chat.messages].reverse().find(m => m.sender !== 'system');
    if (!textMsg) return 'No communications yet';
    
    if (textMsg.type === 'image') return '📸 Photo';
    if (textMsg.type === 'video') return '📹 Video';
    if (textMsg.type === 'voice') return '🎤 Voice Message';
    if (textMsg.type === 'document') return '📄 Document';
    if (textMsg.type === 'sticker') return `✨ Sticker: ${textMsg.mediaUrl}`;
    if (textMsg.type === 'gif') return '⚡ GIF';
    if (textMsg.type === 'location') return '📍 Location';
    if (textMsg.type === 'contact') return '👤 Contact card';

    return textMsg.text;
  };

  const getLatestTime = (chat: Chat) => {
    const activeMsgs = chat.messages.filter(m => m.sender !== 'system');
    if (activeMsgs.length === 0) return '';
    return activeMsgs[activeMsgs.length - 1].timestamp;
  };

  return (
    <div className="flex flex-col h-full bg-[#111b21]" id="chat-list-container">
      {/* Search Header styled like WhatsApp */}
      <div className="p-3.5 space-y-3 bg-[#111b21]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#202c33] border border-transparent rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 font-sans focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all"
            placeholder="Search or start new chat..."
            id="chat-search"
          />
        </div>

        {/* Categories/Filters Grid with WhatsApp Teal Colors */}
        <div className="flex gap-1.5 overflow-x-auto scroller-hidden pb-0.5">
          {(['all', 'unread', 'groups', 'pinned', 'archived'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              id={`filter-${filter}`}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-sans tracking-wider font-semibold border transition-all duration-200 shrink-0 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#005c4b] border-transparent text-[#00a884] font-bold shadow-sm'
                  : 'bg-[#202c33] border-transparent text-slate-300 hover:text-white hover:bg-[#2a3942]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Security alert indicator banner */}
      <div className="mx-3.5 mb-2.5 p-2 bg-[#202c33]/70 border border-white/5 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#00a884] shrink-0" />
          <span className="text-[10px] text-slate-300 font-sans tracking-tight leading-none">
            End-to-end encrypted
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-sans font-bold text-[#00a884] uppercase tracking-wider">
            Verified
          </span>
        </div>
      </div>

      {/* Main Chat Deck Scroll */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4" id="chat-list-scroller">
        
        {/* Onboarding directory toggle */}
        {chats.length > 0 && (
          <div className="px-1.5 pb-2">
            <button
              onClick={() => setShowDirectory(!showDirectory)}
              className="w-full py-2 px-3 bg-[#202c33]/40 hover:bg-[#202c33] rounded-xl border border-white/5 text-[10px] font-sans font-semibold text-[#00a884] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {showDirectory ? '✕ Close Add Chat' : '+ Add Chat by Phone Number'}
            </button>
          </div>
        )}

        {chats.length === 0 && (
          <div className="p-5 text-center space-y-4 bg-[#202c33]/40 rounded-2xl border border-[#00a884]/20 mx-1.5 my-3 relative overflow-hidden shadow-lg">
            <div className="mx-auto w-12 h-12 bg-[#00a884]/15 rounded-full flex items-center justify-center text-[#25d366]">
              <MessageSquare className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-sans uppercase tracking-wider text-white font-extrabold">No active conversations</h3>
              <p className="text-[10px] text-slate-400 font-sans leading-normal">
                Your end-to-end communication space is clear. Activate the Gemini AI assistant or input a contact's number to get started.
              </p>
            </div>
            <button
              onClick={() => {
                if (onStartChatWithContact) {
                  onStartChatWithContact('chattrix-ai');
                }
              }}
              className="w-full py-2.5 px-4 bg-[#00a884] hover:bg-[#128c7e] text-white font-sans text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              🤖 Quick Add AI Assistant (Gemini)
            </button>
          </div>
        )}

        {(showDirectory || chats.length === 0) && (
          <div className="p-4 bg-[#202c33]/70 border border-[#00a884]/20 rounded-2xl mb-3 space-y-4">
            <div className="text-center">
              <span className="text-xs font-sans font-extrabold text-[#00a884] block mb-1">
                Add Chat by Phone Number
              </span>
              <p className="text-[10px] text-slate-400 font-sans leading-tight">
                Instantly connect with any registered friend by entering their display name and mobile phone number.
              </p>
            </div>

            {/* Dynamic Add Form */}
            <div className="space-y-2.5">
              <div>
                <input
                  type="text"
                  value={nameToAdd}
                  onChange={(e) => setNameToAdd(e.target.value)}
                  className="w-full bg-[#111b21] hover:bg-slate-900 border border-transparent rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00a884]"
                  placeholder="Friend's Name (e.g. Alex Vance)"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={phoneToAdd}
                  onChange={(e) => setPhoneToAdd(e.target.value)}
                  className="flex-1 bg-[#111b21] hover:bg-slate-900 border border-transparent rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00a884]"
                  placeholder="Phone Number (e.g. +1 (555) 765-4321)"
                />
                <button
                  onClick={() => {
                    const cleanPhone = phoneToAdd.trim();
                    if (!cleanPhone) {
                      setAddError('Please enter a phone number.');
                      return;
                    }

                    // Check if phone number is registered
                    let registeredName = nameToAdd.trim();
                    let isRegistered = false;
                    try {
                      const registeredUsersStr = localStorage.getItem('chattrix_registered_users');
                      const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : {};
                      if (registeredUsers[cleanPhone]) {
                        isRegistered = true;
                        if (!registeredName) {
                          registeredName = registeredUsers[cleanPhone];
                        }
                      }
                    } catch (e) {
                      console.error(e);
                    }

                    if (!isRegistered) {
                      setAddError('number not registered');
                      return;
                    }

                    if (onAddChatByPhone) {
                      onAddChatByPhone(cleanPhone, registeredName);
                      setPhoneToAdd('');
                      setNameToAdd('');
                      setAddError('');
                      setAddSuccess('Chat initialized successfully!');
                      setTimeout(() => setAddSuccess(''), 2500);
                      setShowDirectory(false);
                    }
                  }}
                  className="bg-[#00a884] hover:bg-[#128c7e] text-white font-sans text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
                >
                  Add
                </button>
              </div>

              {addError && (
                <p className="text-[10px] text-red-400 font-mono text-center">{addError}</p>
              )}
              {addSuccess && (
                <p className="text-[10px] text-[#25d366] font-sans font-bold text-center">{addSuccess}</p>
              )}
            </div>

            {/* Directory divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-3 text-[9px] text-slate-500 uppercase tracking-widest font-bold">Or select a contact</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <div className="space-y-2">
              {AVAILABLE_CONTACTS.map((contact) => {
                const alreadyActive = chats.some(c => c.id === contact.id);
                return (
                  <div 
                    key={contact.id} 
                    className="flex items-center justify-between p-2 hover:bg-[#202c33]/80 rounded-xl transition-all border border-white/5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar src={contact.avatar} name={contact.name} size="sm" />
                      <div className="min-w-0">
                        <h5 className="text-[11px] font-sans font-semibold text-slate-100 truncate">
                          {contact.name}
                        </h5>
                        <p className="text-[9px] text-[#00a884] font-mono truncate">
                          🔒 Active
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (onStartChatWithContact) {
                          onStartChatWithContact(contact.id);
                          setShowDirectory(false);
                        }
                      }}
                      className="px-2.5 py-1 bg-[#128c7e] hover:bg-[#00a884] text-white font-sans font-bold text-[9px] rounded-lg transition-all"
                    >
                      {alreadyActive ? 'Open' : '+ Chat'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sortedChats.length === 0 ? (
          // If search matches nothing or list is truly empty
          chats.length > 0 && (
            <div className="text-center py-12 px-4 space-y-3">
              <ShieldAlert className="w-9 h-9 text-slate-600 mx-auto" />
              <h3 className="text-xs font-sans uppercase tracking-wider text-slate-400 font-bold">No Chats Found</h3>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                No active secure chats match the search filters. Try establishing a new contact chat above.
              </p>
            </div>
          )
        ) : (
          sortedChats.map((chat) => {
            const isSelected = activeChatId === chat.id;
            const latestMsg = getLatestMessage(chat);
            const time = getLatestTime(chat);

            return (
              <div
                key={chat.id}
                id={`chat-item-${chat.id}`}
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer relative transition-all duration-300 border ${
                  isSelected
                    ? 'bg-[#2a3942]/60 border-white/5 w-full'
                    : 'hover:bg-[#202c33] border-transparent'
                }`}
                onClick={() => onChatSelect(chat.id)}
              >
                {/* User Avatar with pulsing status indicator */}
                <div className="relative shrink-0">
                  <Avatar src={chat.avatar} name={chat.name} size="md" />
                  {chat.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25d366] border border-[#111b21] rounded-full shadow-md animate-pulse" />
                  )}
                  {chat.status.startsWith('writing') && (
                    <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25d366] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25d366]"></span>
                    </span>
                  )}
                </div>

                {/* Primary Meta Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-sans font-semibold text-[12.5px] text-slate-100 group-hover:text-[#25d366] transition-colors truncate">
                      {chat.name}
                    </h4>
                    <span className="text-[9px] font-sans text-slate-400 shrink-0">
                      {time}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans truncate pr-2">
                    {chat.typing ? (
                      <span className="text-[#25d366] font-sans animate-pulse font-medium">typing...</span>
                    ) : (
                      latestMsg
                    )}
                  </p>
                </div>

                {/* Left/Right controls (Pin, Archive, Star badge, Fingerprints) */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0 gap-1 opacity-80 group-hover:opacity-100">
                  <div className="flex gap-1">
                    {chat.pinned && (
                      <Pin className="w-3 h-3 text-[#00a884] shrink-0 transform rotate-45" />
                    )}
                    {chat.unreadCount > 0 && (
                      <span className="bg-[#25d366] text-black font-extrabold font-sans text-[9px] px-1 rounded-full min-w-4 h-4 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Slider controls visible on hover/focus */}
                  <div className="flex gap-0.5">
                    <button
                      id={`pin-btn-${chat.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(chat.id);
                      }}
                      title={chat.pinned ? 'Unpin' : 'Pin'}
                      className="p-1 hover:bg-[#2a3942] rounded text-slate-400 hover:text-[#25d366] transition-all select-none"
                    >
                      <Pin className={`w-3 h-3 ${chat.pinned ? 'text-[#00a884]' : ''}`} />
                    </button>
                    <button
                      id={`archive-btn-${chat.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleArchive(chat.id);
                      }}
                      title={chat.archived ? 'Unarchive' : 'Archive'}
                      className="p-1 hover:bg-[#2a3942] rounded text-slate-400 hover:text-[#25d366] transition-all select-none"
                    >
                      <Archive className={`w-3 h-3 ${chat.archived ? 'text-[#00a884]' : ''}`} />
                    </button>
                    <button
                      id={`fingerprint-btn-${chat.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowEncryptionFingerprint(chat);
                      }}
                      title="Encryption keys"
                      className="p-1 hover:bg-[#2a3942] rounded text-slate-400 hover:text-[#25d366] transition-all select-none"
                    >
                      <BadgeInfo className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

