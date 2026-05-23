import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneOff, MicOff, Mic, VideoOff, Video, Volume2, ShieldAlert, Wifi, Zap } from 'lucide-react';
import Avatar from './Avatar';

interface CallScreenProps {
  contactName: string;
  contactAvatar: string;
  callType: 'voice' | 'video';
  onEndCall: (duration: string) => void;
}

export default function CallScreen({
  contactName,
  contactAvatar,
  callType,
  onEndCall
}: CallScreenProps) {
  const [callState, setCallState] = useState<'connecting' | 'encrypted-handshake' | 'connected'>('connecting');
  const [timerSecs, setTimerSecs] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(3); // 1 to 5
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cycle connection logic
  useEffect(() => {
    const t1 = setTimeout(() => {
      setCallState('encrypted-handshake');
    }, 1200);

    const t2 = setTimeout(() => {
      setCallState('connected');
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Timer loop when connected
  useEffect(() => {
    let interval: any = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setTimerSecs(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  // Activate Web Camera for video calls!
  useEffect(() => {
    if (callType === 'video' && !cameraOff && callState === 'connected') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.log("Webcam denied or restricted in standard sandbox. Displaying sleek backup wireframe.", err);
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [callType, cameraOff, callState]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleHangUp = () => {
    const formattedDuration = formatTime(timerSecs);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onEndCall(timerSecs > 0 ? formattedDuration : 'Cancelled');
  };

  return (
    <div className="fixed inset-0 bg-[#0b141a] z-50 flex flex-col justify-between p-6 select-none text-slate-100" id="call-screen-overlay">
      
      {/* 1. TOP UTILITY BAR (Status banners, wifi strength, encryption seals) */}
      <div className="flex justify-between items-center text-[10px] font-sans text-slate-500">
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-[#00a884] animate-pulse" />
          <span className="text-slate-400 uppercase">SAT-LINK G7</span>
        </div>
        
        <div className="bg-[#00a884]/15 border border-[#00a884]/25 px-3 py-1 rounded-full text-[#00a884] font-bold flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 bg-[#25d366] rounded-full" />
          AES-256 SECURED CALL
        </div>

        <div>
          <span>VOLTS: 3.82V</span>
        </div>
      </div>

      {/* 2. DYNAMIC CALL CANVAS SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 my-4 relative">
        
        {/* Connection text alerts */}
        <AnimatePresence mode="wait">
          {callState === 'connecting' && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-2"
            >
              <div className="relative mb-6">
                <Avatar
                  src={contactAvatar}
                  name={contactName}
                  size="xl"
                  className="w-24 h-24 border-2 border-[#00a884]/40 mx-auto blur-[0.5px]"
                />
                <div className="absolute inset-0 rounded-full border-2 border-[#00a884] animate-ping opacity-35" />
              </div>
              <h2 className="text-lg font-sans font-bold">{contactName}</h2>
              <p className="text-xs text-[#00a884] font-sans animate-pulse uppercase tracking-widest">Establishing secure node links...</p>
            </motion.div>
          )}

          {callState === 'encrypted-handshake' && (
            <motion.div
              key="handshake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-2"
            >
              <div className="mx-auto w-20 h-20 bg-[#111b21] border border-white/5 rounded-2xl flex items-center justify-center mb-4 relative shadow">
                <Zap className="w-10 h-10 text-[#00a884] animate-bounce" />
              </div>
              <h2 className="text-sm font-sans text-[#00a884] uppercase tracking-widest font-bold">Exchanging Keys</h2>
              <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed font-sans">Rotating DH-Keys. Verifying fingerprint tags...</p>
            </motion.div>
          )}

          {callState === 'connected' && (
            <motion.div
              key="connected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex flex-col justify-between"
            >
              {/* VIDEO LAYBACK OR VOICE WAV */}
              {callType === 'video' && !cameraOff ? (
                <div className="relative w-full h-[60vh] rounded-3xl bg-[#111b21] border border-white/5 overflow-hidden shadow-2xl">
                  {/* Fictional remote participant camera mockup */}
                  <img
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                    alt="Remote Feed"
                    className="w-full h-full object-cover rounded-3xl opacity-85"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 border border-white/5 px-3 py-1.5 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 font-bold">
                    {contactName} <span className="text-[10px] text-[#25d366] font-normal">REMOTE</span>
                  </div>

                  {/* USER PERSONAL WEBCAM TARGET LAYER (Floating picture in picture card) */}
                  <div className="absolute bottom-4 right-4 w-28 h-40 bg-[#0b141a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover rounded-2xl transform scale-x-[-1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                      <span className="text-[8px] font-sans text-[#25d366] uppercase font-bold tracking-widest">LOCAL FEED</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* VOICE LAYOUT WAVES OR CAMERA IS DISABLED FALLBACK */
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  <div className="relative animate-pulse">
                    <Avatar
                      src={contactAvatar}
                      name={contactName}
                      size="xl"
                      className="w-28 h-28 border border-white/5 shadow-2xl"
                    />
                    <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                      <span className="bg-[#111b21] text-[#25d366] border border-[#00a884]/20 text-[9px] font-sans font-bold px-2 py-0.5 rounded-full uppercase shadow">Secure Voice</span>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-base font-sans font-bold text-slate-100">{contactName}</h2>
                    <p className="text-xs text-[#00a884] tracking-widest uppercase font-bold text-xs">END-TO-END ENCRYPTED</p>
                    <p className="text-xl font-sans text-slate-300 font-bold tabular-nums mt-3">{formatTime(timerSecs)}</p>
                  </div>

                  {/* High fidelity ambient floating sound wave bars */}
                  <div className="flex justify-center items-center gap-1.5 h-12 w-64 pt-4">
                    {[1, 4, 3, 5, 2, 6, 2, 5, 3, 4, 2, 7, 2, 4, 3, 6, 1].map((h, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-t from-[#00a884] to-[#25d366] rounded-full flex-1 transition-all"
                        style={{
                          height: `${Math.max(10, h * 12 * (micMuted ? 0.1 : Math.sin(timerSecs + i) * 0.4 + 0.6))}%`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 3. CONTROL DECK styled in deep grey */}
      <div className="bg-[#202c33] border border-[#2a3942]/50 rounded-3xl p-6.5 space-y-5 shadow-2xl z-10" id="call-interface-controls">
        
        {/* Encryption validation alert footer */}
        {callState === 'connected' && (
          <div className="flex items-center justify-between text-[10px] font-sans border-b border-[#2a3942]/30 pb-4 mb-2">
            <span className="text-slate-400 uppercase">Cryptographic Validation Bar</span>
            <span className="text-[#25d366] font-bold bg-[#00a884]/15 border border-[#00a884]/25 px-2 py-0.5 rounded">
              SHA: {contactName.charCodeAt(0) * 11}-B2E9-FF77
            </span>
          </div>
        )}

        <div className="flex justify-around items-center">
          
          {/* Mute toggle */}
          <button
            id="call-toggle-mic-btn"
            onClick={() => setMicMuted(!micMuted)}
            className={`p-4 rounded-2xl border transition-all select-none cursor-pointer ${
              micMuted
                ? 'bg-red-950/20 text-red-400 border-red-900/40'
                : 'bg-[#111b21] text-slate-300 hover:text-[#00a884] border-white/5 hover:bg-white/5'
            }`}
          >
            {micMuted ? <MicOff className="w-5.5 h-5.5 animate-pulse" /> : <Mic className="w-5.5 h-5.5" />}
          </button>

          {/* End/Hang-up button */}
          <button
            id="call-hangup-btn"
            onClick={handleHangUp}
            className="p-5 bg-red-600 hover:bg-red-500 text-slate-100 rounded-full shadow-lg hover:shadow-red-500/30 active:scale-95 transition-all select-none cursor-pointer"
            title="Terminate sat-relay downlink"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Disable video toggle (only for video calls) */}
          {callType === 'video' ? (
            <button
              id="call-toggle-cam-btn"
              onClick={() => setCameraOff(!cameraOff)}
              className={`p-4 rounded-2xl border transition-all select-none cursor-pointer ${
                cameraOff
                  ? 'bg-red-950/20 text-red-400 border-red-900/40'
                  : 'bg-[#111b21] text-slate-300 hover:text-[#00a884] border-white/5 hover:bg-white/5'
              }`}
            >
              {cameraOff ? <VideoOff className="w-5.5 h-5.5 animate-pulse" /> : <Video className="w-5.5 h-5.5" />}
            </button>
          ) : (
            /* Volume Booster simulator for Voice call */
            <button
              id="call-volume-btn"
              onClick={() => setVolumeLevel(v => (v % 5) + 1)}
              className="p-4 bg-[#111b21] text-slate-300 hover:text-[#00a884] border border-white/5 hover:bg-white/5 rounded-2xl transition-all relative select-none cursor-pointer"
              title={`Receiver Gain: Level {volumeLevel}`}
            >
              <Volume2 className="w-5.5 h-5.5" />
              <span className="absolute -top-1 -right-1 font-sans text-[9px] font-bold bg-[#00a884] text-black w-4 h-4 rounded-full flex items-center justify-center border border-[#111b21] select-none">
                {volumeLevel}
              </span>
            </button>
          )}

        </div>
      </div>

    </div>
  );
}
