import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Camera, LogOut, CheckCheck, 
  Phone, Globe, Check, Smile, ArrowRight, Settings
} from 'lucide-react';
import Avatar from './Avatar';

interface SettingsViewProps {
  username: string;
  phoneNumber: string;
  onUpdateProfile: (name: string, phone: string, avatarUrl?: string) => void;
  onLogout: () => void;
  currentUserAvatar?: string;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
];

export default function SettingsView({
  username,
  phoneNumber,
  onUpdateProfile,
  onLogout,
  currentUserAvatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
}: SettingsViewProps) {
  const [nameInput, setNameInput] = useState(username);
  const [bioInput, setBioInput] = useState('Hey there! I am using Chattrix.');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUserAvatar);
  const [isSaved, setIsSaved] = useState(false);
  
  // Custom picture picker state
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Change number workflow
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [showChangeNumberModal, setShowChangeNumberModal] = useState(false);
  const [isNumberChanged, setIsNumberChanged] = useState(false);
  const [numberChangeError, setNumberChangeError] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(nameInput, phoneNumber, selectedAvatar);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSelectPresetAvatar = (url: string) => {
    setSelectedAvatar(url);
    onUpdateProfile(nameInput, phoneNumber, url);
  };

  const handleApplyCustomAvatar = () => {
    if (customAvatarUrl.trim()) {
      setSelectedAvatar(customAvatarUrl.trim());
      onUpdateProfile(nameInput, phoneNumber, customAvatarUrl.trim());
      setCustomAvatarUrl('');
      setShowAvatarPicker(false);
    }
  };

  const handleChangePhoneNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoneNumber || newPhoneNumber.trim().length < 7) {
      setNumberChangeError('Please enter a valid phone number.');
      return;
    }
    setNumberChangeError('');
    onUpdateProfile(nameInput, newPhoneNumber, selectedAvatar);
    setIsNumberChanged(true);
    setNewPhoneNumber('');
    setTimeout(() => {
      setIsNumberChanged(false);
      setShowChangeNumberModal(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]" id="settings-view">
      
      {/* 1. USER QUICK OVERVIEW WITH AVATAR CHANGE */}
      <div className="flex flex-col items-center bg-[#111b21] rounded-2xl p-6 relative overflow-hidden border border-white/5">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full p-[2px] bg-[#00a884] flex items-center justify-center relative shadow-lg">
            <Avatar src={selectedAvatar} name={username} size="xl" className="w-full h-full" />
          </div>
          <button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="absolute bottom-0 right-0 p-2.5 bg-[#00a884] hover:bg-[#128c7e] text-white rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer"
            title="Change Profile Picture"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center mt-4">
          <h3 className="text-base font-sans font-bold text-slate-100">{username}</h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">{phoneNumber}</p>
          <p className="text-[11px] text-[#00a884] font-medium mt-1 italic">"{bioInput}"</p>
        </div>
      </div>

      {/* AVATAR SELECTOR DRAWER */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#202c33] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl overflow-hidden"
          >
            <h4 className="text-xs font-sans uppercase tracking-wider text-[#00a884] font-bold">Choose Profile Picture</h4>
            
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPresetAvatar(url)}
                  className={`w-full aspect-square rounded-full overflow-hidden border-2 relative transition-all cursor-pointer ${
                    selectedAvatar === url ? 'border-[#00a884]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img referrerPolicy="no-referrer" src={url} className="w-full h-full object-cover" />
                  {selectedAvatar === url && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white font-extrabold" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3.5 space-y-2">
              <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans">Or Enter Custom Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="flex-1 bg-[#111b21] text-xs font-sans text-slate-200 border-none px-3.5 py-2 rounded-lg focus:outline-none"
                  placeholder="https://example.com/photo.jpg"
                />
                <button
                  onClick={handleApplyCustomAvatar}
                  className="bg-[#00a884] hover:bg-[#128c7e] text-white font-sans text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PROFILE PROFILE DETAILS FORM */}
      <div className="bg-[#111b21] rounded-2xl p-5 space-y-4 border border-white/5 shadow">
        <h4 className="text-xs font-sans uppercase tracking-widest text-[#00a884] font-bold flex items-center gap-1.5">
          <User className="w-4 h-4 text-[#00a884]" /> Profile Details
        </h4>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans mb-1.5">Display Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-[#111b21] border border-white/10 p-3 rounded-xl text-xs font-sans focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans mb-1.5">Custom Status Message</label>
            <input
              type="text"
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              className="w-full bg-[#111b21] border border-white/10 p-3 rounded-xl text-xs font-sans focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all text-slate-200"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[9px] font-sans text-slate-400">Settings update across chats in real-time.</span>
            <button
              id="save-settings-btn"
              type="submit"
              className="bg-[#00a884] hover:bg-[#128c7e] text-white font-sans text-xs font-bold px-4 py-2 rounded-lg transition-all select-none cursor-pointer"
            >
              {isSaved ? (
                <span className="flex items-center gap-1"><CheckCheck className="w-3.5 h-3.5" /> Saved</span>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. CHANGE NUMBER ACTION DRAWER */}
      <div className="bg-[#111b21] rounded-2xl p-5 space-y-3.5 border border-white/5 shadow">
        <h4 className="text-xs font-sans uppercase tracking-widest text-[#00a884] font-bold flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-[#00a884]" /> Change Phone Number
        </h4>
        
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          Changing your number will migrate your registration credentials and verify active sessions securely.
        </p>

        <button
          onClick={() => setShowChangeNumberModal(true)}
          className="w-full bg-[#202c33] hover:bg-[#2a3942] border border-transparent hover:border-[#00a884]/30 text-white font-sans text-xs font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
        >
          <Phone className="w-4 h-4 text-[#00a884]" /> Change Phone Number
        </button>
      </div>

      {/* CHANGE NUMBER MODAL */}
      <AnimatePresence>
        {showChangeNumberModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111b21] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4"
            >
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider text-[#00a884]">Migrate Comms Number</h3>
              <p className="text-xs text-slate-300 font-sans">
                Enter your new WhatsApp-style telephone number to verify key alignment.
              </p>

              <form onSubmit={handleChangePhoneNumberSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans mb-1.5 font-bold">New Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    className="w-full bg-[#202c33] border-none p-3 rounded-xl text-xs font-sans text-slate-200 focus:outline-[#00a884]"
                    placeholder="+1 (555) 765-4321"
                  />
                </div>

                {numberChangeError && (
                  <p className="text-xs text-red-400 font-mono">{numberChangeError}</p>
                )}

                {isNumberChanged && (
                  <div className="flex items-center gap-2 bg-[#00a884]/20 border border-[#00a884]/20 rounded-lg p-2.5 text-xs text-[#25d366]">
                    <CheckCheck className="w-4 h-4" />
                    <span>Number Migrated Successfully!</span>
                  </div>
                )}

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangeNumberModal(false);
                      setNumberChangeError('');
                    }}
                    className="flex-1 bg-[#202c33] text-slate-300 rounded-lg text-xs py-2.5 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#00a884] hover:bg-[#128c7e] text-white rounded-lg text-xs py-2.5 font-bold cursor-pointer"
                  >
                    Update Number
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. LOGOUT */}
      <button
        id="settings-logout-btn"
        onClick={onLogout}
        className="w-full bg-red-950/10 hover:bg-red-950/20 border border-red-900/30 text-red-400 font-sans font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 select-none text-xs cursor-pointer"
      >
        <LogOut className="w-4.5 h-4.5" /> Terminate Active Session
      </button>

    </div>
  );
}
