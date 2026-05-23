import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, CheckCircle2, ShieldAlert, KeyRound, MessageSquare, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (phoneNumber: string, username: string, isNewSignUp: boolean) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  // Pre-seed default users so testing is simple and direct
  useEffect(() => {
    try {
      const existing = localStorage.getItem('chattrix_registered_users');
      if (!existing) {
        const defaults = {
          '+1 (555) 019-3294': 'Kayzeehh',
          '+1 (555) 123-4567': 'Alex Vance',
        };
        localStorage.setItem('chattrix_registered_users', JSON.stringify(defaults));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Generate a random 6-digit OTP for simulation
  const handleSendOtp = () => {
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 5) {
      setError('Please enter a valid mobile phone number.');
      return;
    }

    try {
      const registeredUsersStr = localStorage.getItem('chattrix_registered_users');
      const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : {};

      if (isSignUp) {
        if (!username.trim()) {
          setError('Please enter a display username to sign up.');
          return;
        }
        if (registeredUsers[cleanPhone]) {
          setError('This phone number is already registered. Please go to Log In instead.');
          return;
        }
      } else {
        if (!registeredUsers[cleanPhone]) {
          setError('This phone number is not registered yet. Please check the number or Sign Up first.');
          return;
        }
      }
    } catch {
      // safe fallback if JSON parse fails
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedOtp(code);
      setOtpSent(true);
      setIsLoading(false);
      
      // Trigger SMS simulation alert
      setTimeout(() => {
        setShowSmsBanner(true);
      }, 500);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otpCode !== simulatedOtp) {
      setError('Incorrect SMS code. Please verify the code and try again.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanPhone = phoneNumber.trim();
      let finalUsername = username.trim();

      try {
        const registeredUsersStr = localStorage.getItem('chattrix_registered_users');
        const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : {};

        if (isSignUp) {
          registeredUsers[cleanPhone] = finalUsername;
          localStorage.setItem('chattrix_registered_users', JSON.stringify(registeredUsers));
        } else {
          finalUsername = registeredUsers[cleanPhone] || 'User';
        }
      } catch (e) {
        console.error(e);
      }

      onLoginSuccess(cleanPhone, finalUsername, isSignUp);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b141a] text-slate-100 p-4 relative overflow-hidden">
      
      {/* SIMULATED SMS TOAST NOTIFICATION BANNER */}
      <AnimatePresence>
        {showSmsBanner && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.95 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-[#202c33] border border-[#00a884]/30 rounded-2xl p-4 shadow-2xl z-50 cursor-pointer"
            onClick={() => {
              setOtpCode(simulatedOtp);
              setShowSmsBanner(false);
            }}
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-[#00a884]/20 rounded-full flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#00a884]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="text-xs font-sans font-bold text-white">Messages (Simulated SMS)</h4>
                  <span className="text-[9px] text-[#00a884] font-medium font-mono animate-pulse">JUST NOW</span>
                </div>
                <p className="text-xs text-slate-200 font-sans leading-tight">
                  <span className="font-bold text-white">CHATTRIX Verification: </span> 
                  Your registration security code is <span className="font-mono font-black text-[#25d366] tracking-wider text-sm">{simulatedOtp}</span>. Do not share this code.
                </p>
                <span className="text-[9px] text-[#00a884] font-bold mt-1 block uppercase tracking-wider">
                  ⚡ Click to Auto-Fill SMS Code
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-[#111b21] rounded-2xl p-8 shadow-xl border border-white/5 relative"
        id="login-card"
      >
        {/* Modern clean brand logo */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 bg-[#00a884] rounded-full flex items-center justify-center shadow-md mb-3">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12C2 13.921 2.541 15.714 3.479 17.243L2.091 21.408C1.983 21.732 2.268 22.017 2.592 21.909L6.757 20.521C8.286 21.459 10.079 21.999 12 21.999C17.523 21.999 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor" />
              <path d="M9 10V9C9 7.343 10.343 6 12 6C13.657 6 15 7.343 15 9V10" stroke="#111B21" strokeWidth="1.8" strokeLinecap="round" />
              <rect x="8.5" y="10.5" width="7" height="5.5" rx="1.2" fill="white" />
              <circle cx="12" cy="13" r="1" fill="#00a884" />
            </svg>
          </div>
          <h1 className="text-xl font-sans tracking-tight text-white font-extrabold uppercase">
            CHATTRIX
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-sans font-semibold">
            Premium Encrypted Messenger
          </p>
        </div>

        {!otpSent ? (
          <div className="space-y-5">
            {/* Top toggle tab bar */}
            <div className="flex bg-[#202c33] p-1 rounded-xl">
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                }}
                className={`flex-1 py-2 text-xs font-semibold text-center rounded-lg transition-all cursor-pointer ${
                  isSignUp 
                    ? 'bg-[#00a884] text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                }}
                className={`flex-1 py-2 text-xs font-semibold text-center rounded-lg transition-all cursor-pointer ${
                  !isSignUp 
                    ? 'bg-[#00a884] text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Log In
              </button>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-350 font-sans font-bold mb-1.5">Enter Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#202c33] border border-transparent rounded-lg px-3.5 py-3 text-xs font-sans focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all text-slate-100 placeholder-slate-500"
                  placeholder="Display Name"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-350 font-sans font-bold mb-1.5">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#202c33] border border-transparent rounded-lg pl-10 pr-4 py-3 text-xs font-sans focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all text-slate-100 placeholder-slate-500"
                  placeholder="+1 (555) 123-4567"
                  id="phone-input"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-1.5 leading-tight font-sans">
                {isSignUp 
                  ? 'Sign up with a new mobile number to generate simulated verification SMS code instantly.'
                  : 'Log in with your existing registered phone number to verify and load active chats.'
                }
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-red-400 text-xs">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-[#00a884] hover:bg-[#128c7e] text-white font-sans font-semibold py-3 px-4 rounded-lg shadow active:scale-[0.98] transition-all disabled:opacity-50 text-center flex items-center justify-center gap-2 text-xs cursor-pointer"
              id="send-otp-btn"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending secure SMS...
                </>
              ) : (
                isSignUp ? 'Verify & Register' : 'Request SMS Code'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-[#202c33] rounded-xl p-3 border border-white/5 text-center">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-sans font-bold block mb-1">Simulated SMS code issued for</span>
              <span className="text-xs font-semibold text-[#00a884] font-sans">{phoneNumber}</span>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-350 font-sans font-bold mb-1.5">Enter 6-Digit SMS Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-[#202c33] border border-transparent rounded-lg pl-10 pr-4 py-3 text-center text-sm font-sans tracking-widest focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition-all text-slate-100 placeholder-slate-700"
                  placeholder="000 000"
                  id="otp-input"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-red-400 text-xs">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2.5">
              <button
                onClick={() => setOtpSent(false)}
                className="flex-1 bg-[#202c33] hover:bg-[#2a3942] text-slate-300 font-sans font-medium py-3 px-4 rounded-lg active:scale-[0.98] transition-all text-xs cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="flex-2 bg-[#00a884] hover:bg-[#128c7e] text-white font-sans font-bold py-3 px-4 rounded-lg shadow active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                id="verify-otp-btn"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Verify & Login
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-[9px] text-slate-500 font-sans border-t border-white/5 pt-4 flex justify-between">
          <span>SECURE END-TO-END COMS</span>
          <span>AES-256 SECURED</span>
        </div>
      </motion.div>
    </div>
  );
}
