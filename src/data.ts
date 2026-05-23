import { Chat, Story, BroadcastChannel, Community, CallLog } from './types';

export const INITIAL_CHATS: Chat[] = [];

// Available standard nodes users can initialize
export const AVAILABLE_CONTACTS = [
  {
    id: 'chattrix-ai',
    name: 'Chattrix AI (Gemini)',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    status: 'Core Intelligence Online',
    keyFingerprint: 'AI-GMN-3.5-FLSH-88B9-994A',
    welcomeMessage: 'System initialized. Welcome! I am Chattrix AI, powered by Google Gemini. how can I help you today?'
  },
  {
    id: 'aria-nova',
    name: 'Aria Nova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'online',
    keyFingerprint: 'XTR-9021-AFDC-B911-CODE',
    welcomeMessage: 'Hey! I rotated the asymmetric key sequences. Let me know if you want to start a test voice relay!'
  },
  {
    id: 'zia-chen',
    name: 'Zia Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    status: 'Available',
    keyFingerprint: 'ZIA-4401-CHNX-0912-CORE',
    welcomeMessage: "Hey! Let's arrange our virtual workspace standup this afternoon. I'm excited to showcase Chattrix's glass design to the team."
  },
  {
    id: 'kaelen-vance',
    name: 'Kaelen Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'offline',
    keyFingerprint: 'KAE-2110-VNCX-7104-DECK',
    welcomeMessage: 'See you at the cyberpunk visual hacking conference tomorrow. Let me send you my contacts.'
  }
];


export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-self',
    contactName: 'My Status',
    contactAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    mediaUrl: '',
    timestamp: 'Just now',
    type: 'text',
    textContent: 'Welcome to Chattrix, the communications gateway of the future. 🚀🌐',
    bgColor: 'from-blue-600/80 to-indigo-900/85',
    viewed: false
  },
  {
    id: 'story-aria',
    contactName: 'Aria Nova',
    contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500&q=80',
    timestamp: '34m ago',
    type: 'image',
    textContent: 'Injecting dynamic layouts directly into high-fidelity screens ⚡🎨',
    viewed: false
  },
  {
    id: 'story-zia',
    contactName: 'Zia Chen',
    contactAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80',
    timestamp: '2h ago',
    type: 'image',
    textContent: 'Quantum servers behaving beautifully tonight! 🌌🧪',
    viewed: false
  },
  {
    id: 'story-kaelen',
    contactName: 'Kaelen Vance',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    mediaUrl: '',
    timestamp: '5h ago',
    type: 'text',
    textContent: 'Offline is a lifestyle. 🍃 Overcoming visual saturation with minimalism.',
    bgColor: 'from-emerald-500/80 to-slate-900/90',
    viewed: true
  }
];

export const BROADCAST_CHANNELS: BroadcastChannel[] = [
  {
    id: 'tech-quantum',
    name: 'Tech Quantum Broadcast',
    avatar: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80',
    description: 'Daily briefs on quantum communication protocols, fiber-grid architecture, and security chips.',
    subscribersCount: 14205,
    followed: true,
    posts: [
      {
        id: 'post-1',
        text: "Quantum Cryptology Breakthrough: Researchers successfully rotated symmetric encryption keys over standard fiber 1,200km away. 🛡️\n\nThis means future upgrades of Chattrix could employ pure photonic layers for even faster handshakes. The quantum future isn't far — it's here.",
        timestamp: '14:20',
        likes: 1240
      },
      {
        id: 'post-2',
        text: "Check out this visual blueprint of a laser communications node.",
        media: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=80',
        timestamp: 'Yesterday',
        likes: 852
      }
    ]
  },
  {
    id: 'retro-future',
    name: 'Retro Future Art Node',
    avatar: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=150&q=80',
    description: 'Exploring neon nostalgia, vintage user interfaces, cyber-aesthetic grids, and vaporwave.',
    subscribersCount: 8900,
    followed: false,
    posts: [
      {
        id: 'post-art-1',
        text: "Luminescent vector wireframe aesthetics are returning to core designs this quarter. The tactile, glassmorphic look combined with fine phosphor green borders feels both cozy and sophisticated.",
        timestamp: '10:15',
        likes: 412
      }
    ]
  }
];

export const COMMUNITIES: Community[] = [
  {
    id: 'comm-cybers',
    name: 'Dev Cyberdeck Alliance',
    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=150&q=80',
    description: 'The master community for mainframe coders, glassmorphic UI designers, and crypto engineers.',
    joined: true,
    subgroups: [
      {
        id: 'sub-ann',
        name: '📢 Announcements',
        unread: true,
        description: 'Global directives, framework patches, and conference scheduling.'
      },
      {
        id: 'sub-gen',
        name: '💬 General Cyberdeck',
        unread: false,
        description: 'Chitchat, desk setups, macro keypad configs, and coffee recipes.'
      },
      {
        id: 'sub-labs',
        name: '🧪 Experimental Labs',
        unread: true,
        description: 'Discussions about bleeding edge physics models, voice frequency modulation, and AI nodes.'
      }
    ]
  },
  {
    id: 'comm-ai',
    name: 'AI Pioneers Hub',
    avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=150&q=80',
    description: 'Coordinating neural setups, prompt strategies, and local context models on small device arrays.',
    joined: false,
    subgroups: [
      {
        id: 'sub-ai-ann',
        name: '📢 Model Releases',
        unread: false,
        description: 'Up-to-date information on Gemini, Imagen, and multimodality.'
      },
      {
        id: 'sub-ai-chat',
        name: '🤖 Agent Sandbox',
        unread: false,
        description: 'Showcasing prompt wrappers, functions, and responsive chat frames.'
      }
    ]
  }
];

export const CALL_LOGS: CallLog[] = [
  {
    id: 'call-1',
    contactName: 'Aria Nova',
    contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    direction: 'incoming',
    timestamp: 'Today, 18:32',
    duration: '4m 12s'
  },
  {
    id: 'call-2',
    contactName: 'Kaelen Vance',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    type: 'voice',
    direction: 'missed',
    timestamp: 'Today, 12:44'
  },
  {
    id: 'call-3',
    contactName: 'Zia Chen',
    contactAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    type: 'voice',
    direction: 'outgoing',
    timestamp: 'Yesterday, 15:10',
    duration: '11m 4s'
  },
  {
    id: 'call-4',
    contactName: 'Aria Nova',
    contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    type: 'voice',
    direction: 'incoming',
    timestamp: 'Yesterday, 09:22',
    duration: '54s'
  }
];
