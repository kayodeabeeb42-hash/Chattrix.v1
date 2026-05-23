import { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Extract initials
  const getInitials = (uname: string) => {
    if (!uname) return 'U';
    const parts = uname.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
    }
    return uname.trim().slice(0, 2).toUpperCase();
  };

  // Dynamic gradients based on name hashing for beautiful persistent premium identities
  const getGradientByName = (uname: string) => {
    const gradients = [
      'from-[#00a884] to-[#075e54]', // chattrix premium teal-green
      'from-slate-700 to-slate-900',  // dark slate
      'from-indigo-600 to-indigo-900', // high-sec indigo
      'from-purple-600 to-purple-900', // void purple
      'from-cyan-600 to-[#005c4b]',   // clean cyan-green
      'from-rose-600 to-rose-950',    // warning deep rose
    ];
    let sum = 0;
    for (let i = 0; i < uname.length; i++) {
      sum += uname.charCodeAt(i);
    }
    return gradients[sum % gradients.length];
  };

  const sizeClasses = {
    'xs': 'w-6 h-6 text-[9px]',
    'sm': 'w-8 h-8 text-[11px]',
    'md': 'w-10 h-10 text-xs',
    'lg': 'w-12 h-12 text-sm',
    'xl': 'w-24 h-24 text-xl',
    '2xl': 'w-20 h-20 text-lg'
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses['md'];

  if (!src || hasError) {
    const initials = getInitials(name);
    const gradient = getGradientByName(name);
    return (
      <div 
        className={`rounded-full flex items-center justify-center bg-gradient-to-br ${gradient} text-white font-sans font-bold uppercase shadow-inner border border-white/10 shrink-0 ${currentSizeClass} ${className}`}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`rounded-full object-cover border border-white/5 shadow shrink-0 ${currentSizeClass} ${className}`}
    />
  );
}
