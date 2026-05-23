import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Radio, Eye, Heart, Compass, CheckCircle2, UserCheck, Play, X, Clock, Video, Users2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { Story, BroadcastChannel, Community } from '../types';
import Avatar from './Avatar';

interface UpdatesViewProps {
  stories: Story[];
  channels: BroadcastChannel[];
  communities: Community[];
  onAddStory: (text: string) => void;
  onFollowChannel: (chanId: string) => void;
  onLikePost: (chanId: string, postId: string) => void;
  onJoinCommunity: (commId: string) => void;
}

export default function UpdatesView({
  stories,
  channels,
  communities,
  onAddStory,
  onFollowChannel,
  onLikePost,
  onJoinCommunity,
}: UpdatesViewProps) {
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [newStatusText, setNewStatusText] = useState('');
  const [showStatusComposer, setShowStatusComposer] = useState(false);
  const [showChannelsModal, setShowChannelsModal] = useState(false);
  const [showCommunitiesModal, setShowCommunitiesModal] = useState(false);
  const [activeSubgroup, setActiveSubgroup] = useState<{ commName: string; subName: string; desc: string } | null>(null);

  // Auto progression for viewing statuses
  useEffect(() => {
    let timer: any = null;
    if (activeStoryIdx !== null) {
      setStoryProgress(0);
      timer = setInterval(() => {
        setStoryProgress((p) => {
          if (p >= 100) {
            // Move to next story, or exit
            if (activeStoryIdx < stories.length - 1) {
              setActiveStoryIdx(activeStoryIdx + 1);
              return 0;
            } else {
              setActiveStoryIdx(null);
              clearInterval(timer);
              return 0;
            }
          }
          return p + 1.5;
        });
      }, 50);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeStoryIdx, stories.length]);

  const handleCreateStatus = () => {
    if (!newStatusText.trim()) return;
    onAddStory(newStatusText);
    setNewStatusText('');
    setShowStatusComposer(false);
  };

  const handleNextStory = () => {
    if (activeStoryIdx === null) return;
    if (activeStoryIdx < stories.length - 1) {
      setActiveStoryIdx(activeStoryIdx + 1);
    } else {
      setActiveStoryIdx(null);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIdx === null) return;
    if (activeStoryIdx > 0) {
      setActiveStoryIdx(activeStoryIdx - 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]" id="updates-view">
      
      {/* 1. STORIES SECTION */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-sans uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> State Status Feeds
          </h3>
          <button
            id="open-compose-status-btn"
            onClick={() => setShowStatusComposer(true)}
            className="text-[10px] font-sans font-medium text-cyan-400 border border-cyan-950/40 hover:border-cyan-500/30 bg-cyan-950/10 hover:bg-[#0D121D]/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Post Status
          </button>
        </div>

        {/* Stories Horizontal Circle Roll */}
        <div className="flex gap-4 overflow-x-auto pb-2 scroller-hidden">
          {stories.map((st, index) => {
            const hasSymmetricRing = !st.viewed;
            return (
              <button
                key={st.id}
                id={`story-orb-${st.id}`}
                onClick={() => setActiveStoryIdx(index)}
                className="flex flex-col items-center gap-1.5 shrink-0 select-none cursor-pointer focus:outline-none"
              >
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl p-[2px] flex items-center justify-center transition-transform ${
                    hasSymmetricRing 
                      ? 'bg-gradient-to-tr from-cyan-400 via-cyan-455 to-blue-500' 
                      : 'bg-white/5'
                  }`}>
                    <Avatar
                      src={st.contactAvatar}
                      name={st.contactName}
                      size="sm"
                      className="w-full h-full rounded-xl border border-[#080B12]"
                    />
                  </div>
                  {/* Plus tag on self story */}
                  {st.id === 'story-self' && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-400 rounded-lg flex items-center justify-center border border-[#080B12] shadow">
                      <Plus className="w-3 h-3 text-[#080B12] font-bold" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-300 font-sans truncate w-14 text-center">
                  {st.contactName === 'My Status' ? 'Me' : st.contactName.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CHANNELS AND COMMUNITIES PORTS */}
      <div className="space-y-3 pt-2">
        <h4 className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-bold block">
          Channels & Communities Hub
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Channels Button */}
          <button
            id="toggle-channels-hub-btn"
            onClick={() => setShowChannelsModal(true)}
            className="w-full py-4 px-4 bg-[#202c33]/45 hover:bg-[#202c33]/70 border border-[#00a884]/20 hover:border-[#00a884]/40 rounded-2xl flex items-center justify-between transition-all select-none cursor-pointer group text-slate-100 shadow-lg text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#00a884]/10 rounded-xl flex items-center justify-center border border-[#00a884]/20 group-hover:bg-[#00a884]/20 transition-colors shrink-0">
                <Radio className="w-4 h-4 text-[#00a884] animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-sans font-extrabold block text-slate-100">Broadcast Channels Hub</span>
                <span className="text-[9px] text-slate-400 font-sans leading-none block truncate">Explore, follow, and react to updates</span>
              </div>
            </div>
            <span className="bg-[#00a884]/20 text-[#25d366] text-[10px] font-sans font-extrabold px-3 py-1 rounded-xl group-hover:bg-[#00a884]/30 transition-all select-none shrink-0">
              {channels.length} Channels
            </span>
          </button>

          {/* Communities Button */}
          <button
            id="toggle-communities-hub-btn"
            onClick={() => setShowCommunitiesModal(true)}
            className="w-full py-4 px-4 bg-[#202c33]/45 hover:bg-[#202c33]/70 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl flex items-center justify-between transition-all select-none cursor-pointer group text-slate-100 shadow-lg text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors shrink-0">
                <Users2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-sans font-extrabold block text-slate-100">Enterprise Communities Hub</span>
                <span className="text-[9px] text-slate-400 font-sans leading-none block truncate">Coordinate alliance sub-channels & portals</span>
              </div>
            </div>
            <span className="bg-purple-500/25 text-purple-300 text-[10px] font-sans font-extrabold px-3 py-1 rounded-xl group-hover:bg-purple-500/35 transition-all select-none shrink-0">
              {communities.filter(c => c.joined).length}/{communities.length} Portals
            </span>
          </button>
        </div>
      </div>

      {/* CHANNELS MODAL HUB DRAWERS */}
      <AnimatePresence>
        {showChannelsModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md z-45 flex flex-col p-4 overflow-y-auto"
            id="channels-modal-hub"
          >
            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#00a884] animate-pulse" />
                <h3 className="text-xs font-sans uppercase tracking-widest text-[#00a884] font-extrabold">Broadcast Channels</h3>
              </div>
              <button
                onClick={() => setShowChannelsModal(false)}
                className="text-slate-400 hover:text-slate-100 font-sans text-[10px] font-bold py-1 px-3 bg-[#202c33] border border-white/5 rounded-lg select-none cursor-pointer"
              >
                ✕ Close Hub
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-sans mb-4 leading-relaxed">
              Subscribe to broadcast channels to receive direct messages, cryptographic updates, and developer logs.
            </p>

            <div className="space-y-4 pb-12" id="channels-list">
              {channels.map((chan) => (
                <div
                  key={chan.id}
                  id={`channel-card-${chan.id}`}
                  className="bg-[#0D121D]/85 border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden text-left"
                >
                  {/* Channel Head info */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar
                        src={chan.avatar}
                        name={chan.name}
                        size="md"
                        className="w-12 h-12 rounded-2xl border border-white/5"
                      />
                      <div>
                        <h4 className="text-xs font-sans font-bold text-slate-100 flex items-center gap-1">
                          {chan.name}
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-[#080B12] inline shrink-0" />
                        </h4>
                        <span className="text-[10px] font-sans text-slate-500 block mt-1">
                          {chan.subscribersCount.toLocaleString()} Subscribers
                        </span>
                      </div>
                    </div>

                    <button
                      id={`follow-btn-${chan.id}`}
                      onClick={() => onFollowChannel(chan.id)}
                      className={`text-[10px] font-sans font-medium px-3 py-1.5 rounded-lg border uppercase transition-all cursor-pointer ${
                        chan.followed
                          ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                          : 'bg-[#080B12] border-white/5 text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      {chan.followed ? (
                        <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Followed</span>
                      ) : (
                        'Follow'
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed border-b border-white/5 pb-3">{chan.description}</p>

                  {/* Latest Post Deck */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-sans uppercase tracking-widest text-slate-500 block">Latest Broadcaster Post</span>
                    {chan.posts.map((post) => (
                      <div key={post.id} className="bg-[#080B12] border border-white/5 rounded-2xl p-4.5 space-y-3">
                        {post.media && (
                          <div className="relative rounded-xl overflow-hidden max-h-48 border border-white/5">
                            <img
                              referrerPolicy="no-referrer"
                              src={post.media}
                              alt="Broadcaster attached upload"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-xs font-sans text-slate-200 whitespace-pre-line leading-relaxed">{post.text}</p>
                        
                        <div className="flex justify-between items-center text-[10px] font-sans text-slate-500 border-t border-white/5 pt-2.5">
                          <span>{post.timestamp}</span>
                          <button
                            id={`like-post-btn-${chan.id}-${post.id}`}
                            onClick={() => onLikePost(chan.id, post.id)}
                            className="flex items-center gap-1.5 hover:text-rose-450 transition-colors group select-none cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 group-hover:fill-rose-500 text-slate-400" />
                            <span>{post.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMMUNITIES AND SUBGROUPS ACCESSIBLE WITHIN UPDATES HUB */}
      <AnimatePresence>
        {showCommunitiesModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-md z-45 flex flex-col p-4 overflow-y-auto"
            id="communities-modal-hub"
          >
            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-sans uppercase tracking-widest text-purple-400 font-extrabold">Enterprise Communities</h3>
              </div>
              <button
                onClick={() => setShowCommunitiesModal(false)}
                className="text-slate-400 hover:text-slate-100 font-sans text-[10px] font-bold py-1 px-3 bg-[#202c33] border border-white/5 rounded-lg select-none cursor-pointer"
              >
                ✕ Close Hub
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-sans mb-4 leading-relaxed">
              Coordinate in sub-channels, secure announcement decks, and experimental discussion pipelines inside enterprise parent portals.
            </p>

            <div className="space-y-4 pb-12" id="communities-list">
              {communities.map((comm) => (
                <div
                  key={comm.id}
                  id={`community-card-${comm.id}`}
                  className="bg-[#0D121D]/85 border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden text-left"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar
                        src={comm.avatar}
                        name={comm.name}
                        size="md"
                        className="w-11 h-11 rounded-2xl border border-white/5"
                      />
                      <div>
                        <h4 className="text-xs font-sans font-bold text-slate-100 flex items-center gap-1.5">
                          {comm.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-sans mt-1">E2E Cryptographic Community Node</p>
                      </div>
                    </div>

                    <button
                      id={`join-community-btn-${comm.id}`}
                      onClick={() => onJoinCommunity(comm.id)}
                      className={`text-[10px] font-sans tracking-wide font-bold px-3 py-1.5 rounded-lg border uppercase transition-all select-none cursor-pointer ${
                        comm.joined
                          ? 'bg-[#080B12] border-white/5 text-slate-400 hover:text-red-400 hover:border-red-900/30 hover:bg-red-950/10'
                          : 'bg-purple-500 hover:bg-purple-400 border-purple-500 text-[#080B12]'
                      }`}
                    >
                      {comm.joined ? 'Leave Portal' : 'Join Portal'}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed border-b border-white/5 pb-3">
                    {comm.description}
                  </p>

                  {/* Subgroups Discussions list */}
                  {comm.joined ? (
                    <div className="space-y-2">
                      <span className="text-[9px] font-sans uppercase tracking-widest text-slate-500 block">Registered Sub-Channels</span>
                      
                      {comm.subgroups.map((sub) => (
                        <div
                          key={sub.id}
                          id={`subgroup-${sub.id}`}
                          onClick={() => setActiveSubgroup({ commName: comm.name, subName: sub.name, desc: sub.description })}
                          className="flex justify-between items-center bg-[#080B12] hover:bg-white/5 border border-white/5 cursor-pointer p-3 rounded-xl transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-xs font-sans font-bold text-slate-200 block truncate">{sub.name}</span>
                              <span className="text-[10px] font-sans text-slate-500 block truncate mt-0.5">{sub.description}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {sub.unread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                            )}
                            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#080B12]/60 rounded-2xl p-4 border border-white/5 text-center">
                      <p className="text-[11px] text-slate-500 font-sans">
                        Locked. Synchronize with parent portal coordinate deck to unlock discussions channels.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUBGROUP INFO MODAL */}
      <AnimatePresence>
        {activeSubgroup && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0D121D] border border-white/10 rounded-3xl p-6.5 w-full max-w-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-white/5">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <span className="text-[9px] font-sans text-slate-500 uppercase">{activeSubgroup.commName}</span>
                <h3 className="text-xs font-sans font-bold text-slate-100 mt-1">{activeSubgroup.subName}</h3>
              </div>
              
              <div className="bg-[#080B12] border border-white/5 rounded-2xl p-4 space-y-3 text-left">
                <span className="text-[9px] font-sans uppercase text-slate-500 block">Simulated Feed Transmission</span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  "Standby... Decryption codes synced. This channel contains the localized communications archive corresponding to: {activeSubgroup.desc}."
                </p>
              </div>

              <button
                onClick={() => setActiveSubgroup(null)}
                className="w-full bg-[#080B12] hover:bg-white/5 font-sans py-2.5 rounded-xl border border-white/5 text-xs text-slate-300 select-none cursor-pointer"
              >
                Close Secure Feed
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. SIMULATED TEXT STATUS COMPOSER MODAL */}
      {showStatusComposer && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-4" id="status-composer">
          <div className="bg-[#0D121D] border border-white/5 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="text-xs font-sans uppercase tracking-widest text-[#0D121D] bg-cyan-400 px-2.5 py-1 rounded inline-block font-bold">Write State Status</h3>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Post a fleeting status message to your orbital grid. Self-destructs after 24 hours.</p>
            
            <textarea
              value={newStatusText}
              onChange={(e) => setNewStatusText(e.target.value)}
              maxLength={120}
              className="w-full bg-[#080B12] text-xs font-sans text-slate-200 border border-white/5 p-3.5 rounded-2xl focus:outline-none focus:border-cyan-500"
              placeholder="What core updates are streaming today?..."
              rows={4}
              id="status-text-area"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusComposer(false)}
                className="flex-1 bg-[#080B12] hover:bg-white/5 text-slate-300 font-sans py-2.5 rounded-xl border border-white/5 select-none text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStatus}
                className="flex-1 bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-350 hover:to-blue-450 text-white font-sans font-bold py-2.5 rounded-xl active:scale-95 transition-all select-none text-xs cursor-pointer"
                id="submit-status-btn"
              >
                Publish Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FULL STORY STORY VIEWER SCREEN */}
      <AnimatePresence>
        {activeStoryIdx !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#080B12] z-50 flex flex-col justify-between p-4"
            id="story-viewer-modal"
          >
            {/* Top Bar progress indicators */}
            <div className="space-y-4">
              <div className="flex gap-1">
                {stories.map((st, idx) => {
                  let fillPercent = 0;
                  if (idx < activeStoryIdx) fillPercent = 100;
                  if (idx === activeStoryIdx) fillPercent = storyProgress;
                  return (
                    <div key={st.id} className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${fillPercent}%` }} />
                    </div>
                  );
                })}
              </div>

              {/* Story Author info */}
              <div className="flex justify-between items-center text-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    referrerPolicy="no-referrer"
                    src={stories[activeStoryIdx].contactAvatar}
                    className="w-9 h-9 rounded-xl object-cover border border-white/5"
                  />
                  <div>
                    <h5 className="text-xs font-sans font-bold">{stories[activeStoryIdx].contactName}</h5>
                    <span className="text-[9px] font-sans text-slate-400 uppercase tracking-widest">{stories[activeStoryIdx].timestamp}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStoryIdx(null)}
                  className="text-slate-400 hover:text-slate-100 select-none p-1 bg-[#0D121D] border border-white/5 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Immersive core story content canvas */}
            <div className="flex-1 flex items-center justify-center py-6 px-4">
              {stories[activeStoryIdx].type === 'image' ? (
                <div className="relative max-w-md w-full max-h-[60vh] rounded-3xl overflow-hidden border border-white/5">
                  <img
                    referrerPolicy="no-referrer"
                    src={stories[activeStoryIdx].mediaUrl}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  {stories[activeStoryIdx].textContent && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 text-center">
                      <p className="text-xs text-slate-100 font-sans leading-relaxed">{stories[activeStoryIdx].textContent}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`p-8 rounded-3xl max-w-sm w-full bg-[#0D121D] aspect-[4/5] flex items-center justify-center text-center shadow-2xl border border-white/5`}>
                  <p className="text-base font-sans font-bold leading-relaxed text-slate-100">{stories[activeStoryIdx].textContent}</p>
                </div>
              )}
            </div>

            {/* Bottom swipe slide helpers */}
            <div className="flex justify-between items-center px-4 py-2 text-xs font-sans text-slate-500">
              <button onClick={handlePrevStory} disabled={activeStoryIdx === 0} className="hover:text-slate-300 disabled:opacity-30 flex items-center gap-1 select-none">
                ◄ Previous Node
              </button>
              <button onClick={handleNextStory} className="hover:text-slate-300 flex items-center gap-1 select-none">
                Next Node ►
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
