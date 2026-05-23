import { MessageSquareCode, Compass, Users2, PhoneCall, Settings2 } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unreadChats: number;
  hasNewStatus: boolean;
}

export default function BottomNavBar({
  activeTab,
  onTabChange,
  unreadChats,
  hasNewStatus,
}: BottomNavBarProps) {
  const tabs = [
    {
      id: 'chats' as ActiveTab,
      label: 'Chats',
      icon: MessageSquareCode,
      badge: unreadChats > 0 ? unreadChats : undefined,
    },
    {
      id: 'updates' as ActiveTab,
      label: 'Updates',
      icon: Compass,
      badge: hasNewStatus ? '•' : undefined,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings2,
    },
  ];

  return (
    <div className="bg-[#0D121D]/90 backdrop-blur-lg border-t border-white/5 px-2 py-2 flex justify-around items-center sticky bottom-0 z-35" id="bottom-navbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center flex-1 py-1 px-2.5 rounded-2xl relative transition-all duration-300 select-none group"
          >
            {/* Ambient hover glowing backdrop */}
            <div className={`absolute inset-0 rounded-2xl transition-all duration-300 -z-10 ${
              isActive 
                ? 'bg-[#00a884]/15 opacity-100 scale-100' 
                : 'bg-white/0 opacity-0 scale-90 group-hover:scale-95 group-hover:bg-white/5 group-hover:opacity-100'
            }`} />

            <div className="relative">
               <Icon className={`w-5 h-5 transition-all duration-300 ${
                isActive 
                  ? 'text-[#00a884] scale-105' 
                  : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              
              {/* Glowing Notifications badge */}
              {tab.badge !== undefined && (
                <span className={`absolute -top-1.5 -right-2 flex items-center justify-center font-sans text-[9px] font-bold rounded-full ${
                  tab.badge === '•' 
                    ? 'w-2 h-2 bg-[#25d366] animate-pulse'
                    : tab.badge === '!' 
                    ? 'w-3 h-3 bg-purple-500 text-white'
                    : 'px-1.5 min-w-[14px] h-[14px] bg-[#25d366] text-black'
                }`}>
                  {tab.badge !== '•' && tab.badge !== '!' ? tab.badge : ''}
                </span>
              )}
            </div>

            <span className={`text-[10px] font-sans font-medium mt-1 tracking-tight transition-all duration-300 ${
              isActive 
                ? 'text-[#00a884] font-bold' 
                : 'text-slate-400 group-hover:text-slate-300'
            }`}>
              {tab.label}
            </span>

            {/* Micro horizontal pointer line */}
            {isActive && (
              <span className="absolute bottom-0 w-6 h-[2.2px] bg-gradient-to-r from-[#00a884] to-[#25d366] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
