export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other' | 'system';
  timestamp: string;
  type: 'text' | 'voice' | 'image' | 'video' | 'document' | 'contact' | 'location' | 'sticker' | 'gif';
  status: 'sent' | 'delivered' | 'read';
  edited?: boolean;
  starred?: boolean;
  fileName?: string;
  fileSize?: string;
  mediaUrl?: string;
  reaction?: string;
  disappearing?: boolean;
  voiceDuration?: string;
  originalMessageId?: string; // For forwarded / replied messages
  forwarded?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | string;
  typing?: boolean;
  unreadCount: number;
  messages: Message[];
  pinned?: boolean;
  archived?: boolean;
  isGroup?: boolean;
  keyFingerprint: string; // Dynamic simulated End-to-End hash!
  disappearingActive?: boolean;
  disappearingDuration?: number; // e.g. 5, 10 or 30 seconds
  themeColor?: string; // Custom chat background gradient
}

export interface Story {
  id: string;
  contactName: string;
  contactAvatar: string;
  mediaUrl: string;
  timestamp: string;
  textContent?: string;
  viewed?: boolean;
  type: 'image' | 'text' | 'video';
  bgColor?: string; // Fictional color background if text status
}

export interface ChannelPost {
  id: string;
  text: string;
  media?: string;
  timestamp: string;
  likes: number;
}

export interface BroadcastChannel {
  id: string;
  name: string;
  avatar: string;
  description: string;
  subscribersCount: number;
  posts: ChannelPost[];
  followed?: boolean;
}

export interface SubGroup {
  id: string;
  name: string;
  unread: boolean;
  description: string;
}

export interface Community {
  id: string;
  name: string;
  avatar: string;
  description: string;
  subgroups: SubGroup[];
  joined?: boolean;
}

export interface CallLog {
  id: string;
  contactName: string;
  contactAvatar: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export type ActiveTab = 'chats' | 'updates' | 'settings';
