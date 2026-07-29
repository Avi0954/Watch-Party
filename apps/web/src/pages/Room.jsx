import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Send, LogOut, MessageSquare, Shield, User,
  Users, Copy, Check, Play, Settings, X, ChevronLeft, Bell, Share2, Link, ArrowRight, RefreshCw,
  Ghost, Cat, Dog, Bot, Smile, Sparkles, MoreVertical
} from 'lucide-react';
import { useSyncPlayer } from '../hooks/useSyncPlayer';
import Navbar from '../components/Navbar';
import ChatSidebar from '../components/ChatSidebar';

const AVATAR_MAP = {
  ghost: Ghost,
  cat: Cat,
  dog: Dog,
  bot: Bot,
  smile: Smile,
  sparkles: Sparkles,
};

const AvatarIcon = ({ avatar, className }) => {
  const Icon = AVATAR_MAP[avatar] || Ghost;
  return <Icon className={className} />;
};

const Room = () => {
  const { roomId: rawRoomId } = useParams();
  const roomId = rawRoomId?.toUpperCase();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    const queryName = query.get('name');
    if (queryName) {
      localStorage.setItem('watchit_username', queryName);
      return queryName;
    }
    return localStorage.getItem('watchit_username') || '';
  });

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    return query.get('avatar') || 'ghost';
  });

  const [token] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  });

  const [inputMessage, setInputMessage] = useState('');
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=aqz-KE-bpKQ');
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHostLeaveModal, setShowHostLeaveModal] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [toasts, setToasts] = useState([]);

  const playerRef = useRef(null);
  const chatEndRef = useRef(null);
  const [openUserMenuId, setOpenUserMenuId] = useState(null);

  const handleJoin = (name) => {
    localStorage.setItem('watchit_username', name);
    setUsername(name);
  };

  const handleRoomEnd = () => {
    showToast("The host has ended the room.");
    setTimeout(() => navigate('/'), 2000);
  };

  const {
    messages,
    users,
    role,
    syncStatus,
    playbackRate,
    handlePlay,
    handlePause,
    handleSeek,
    handleReady,
    handleVideoChange,
    handleSendMessage,
    handleTransferHost,
    resyncToHost,
    handleManualSync,
    handleEndRoom,
    handleHostLeaving
  } = useSyncPlayer(roomId, playerRef, setPlaying, setUrl, username, selectedAvatar, handleRoomEnd, token);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (role === 'HOST') {
        handleHostLeaving();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [role, handleHostLeaving]);

  // Format time helper
  const formatTime = (timestamp) => {
    if (!timestamp) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollRef = useRef(null);

  const handleChatScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    if (isAtBottom && showScrollIndicator) setShowScrollIndicator(false);
  };

  // Auto-scroll logic refined
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

      if (isNearBottom) {
        scrollRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
      } else if (messages.length > 0) {
        setShowScrollIndicator(true);
      }
    }
  }, [messages]);

  // Toast helper
  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Monitor for joins
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'System') {
        showToast(lastMsg.text);
      }
    }
  }, [messages.length]);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Visual Viewport Handling for Mobile Keyboard
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const height = window.visualViewport.height;
      document.documentElement.style.setProperty('--visual-viewport-height', `${height}px`);

      // Detect keyboard active state
      const isKeyboard = height < window.innerHeight * 0.85;
      setIsKeyboardOpen(isKeyboard);
    };

    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    handleResize();

    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
      window.visualViewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      handleSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    showToast("Room ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyRoomLink = async () => {
    const link = window.location.origin + "/room/" + roomId;
    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copied to clipboard!");
    } catch (error) {
      showToast("Error copying link");
    }
  };

  const triggerVideoChange = (e) => {
    e.preventDefault();
    const url = newUrlInput.trim();
    if (!url) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      showToast("Please enter a valid URL (include http/https)");
      return;
    }

    // Support check (YouTube, Vimeo, Twitch, etc.)
    const isSupported = url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('vimeo.com') ||
      url.includes('twitch.tv');

    if (!isSupported) {
      showToast("Note: This URL might not be properly supported for sync.");
    }

    if (role === "HOST") {
      handleVideoChange(url);
      setIsModalOpen(false);
      setNewUrlInput('');
      showToast("Video synced for everyone!");
    }
  };

  if (!token) {
    alert("Invalid session. Please create a new room.");
    navigate('/');
    return null;
  }

  if (!username) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#050816] p-4 z-[100] font-sans relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl p-10 lg:p-12 animate-in fade-in zoom-in duration-500 relative z-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(34,211,238,0.2)] rotate-3">
              <Play className="w-10 h-10 text-blue-500 ml-1 fill-cyan-400/20" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-3">Join Watch Party</h1>
            <p className="text-slate-500 text-sm font-medium">Enter your name to join the party</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.username.value.trim();
              if (name) handleJoin(name);
            }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Your Identity</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  autoFocus
                  name="username"
                  type="text"
                  placeholder="What should we call you?"
                  className="w-full bg-[#050816]/50 backdrop-blur-sm border border-white/10 py-5 pl-16 pr-8 rounded-3xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm shadow-inner placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Enter Room <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const [isMobileUsersOpen, setIsMobileUsersOpen] = useState(false);

  return (
    <div
      className="flex flex-col bg-[#090B18] text-white overflow-hidden font-handdrawn selection:bg-purple-500/30 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131938] via-[#090B18] to-[#050711]"
      style={{ height: 'var(--visual-viewport-height, 100dvh)' }}
    >
      {/* Decorative Hand-Drawn Edge Doodles */}
      <svg className="absolute top-16 left-6 w-6 h-6 text-purple-400 opacity-40 pointer-events-none animate-sparkle-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
      <svg className="absolute bottom-6 left-10 w-8 h-8 text-amber-400 opacity-30 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12 C 8 8, 16 16, 20 12" />
      </svg>

      {/* Header - Navbar */}
      <header className={`w-full z-30 transition-all duration-500 ease-in-out ${isKeyboardOpen ? 'h-0 opacity-0 overflow-hidden border-none' : 'h-auto opacity-100'}`}>
        <Navbar
          roomId={roomId}
          username={username}
          selectedAvatar={selectedAvatar}
          role={role}
          syncStatus={syncStatus}
          copyRoomId={copyRoomId}
          copyRoomLink={copyRoomLink}
          handleManualSync={handleManualSync}
          handleLeaveRoom={() => {
            if (role === 'HOST') {
              setShowHostLeaveModal(true);
            } else {
              navigate('/');
            }
          }}
          copied={copied}
        />
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-[1400px] 2xl:max-w-[1500px] mx-auto w-full px-2 md:px-4 lg:px-5 py-1.5 md:py-4 gap-2 md:gap-4 lg:gap-5 items-start md:items-stretch overflow-hidden md:max-h-[85dvh]">
        {/* Video Section - Outer Player Container with Sketch Corners */}
        <div className={`w-full ${isKeyboardOpen ? 'h-32' : 'aspect-video'} md:aspect-auto md:flex-1 bg-[#0A0D1E] relative overflow-hidden group rounded-[24px] shadow-2xl border-2 border-white/10 shrink-0 transition-all duration-500 ease-in-out`}>
          {/* Sketch doodle corners */}
          <svg className="absolute top-2 left-2 z-10 w-5 h-5 text-amber-400 opacity-80 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
          <svg className="absolute top-2 right-2 z-10 w-5 h-5 text-cyan-400 opacity-70 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 8L10 2M14 2L20 8" />
          </svg>

          {/* Iframe / ReactPlayer (Unchanged logic, controls & API) */}
          <ReactPlayer
            ref={playerRef}
            url={url}
            width="100%"
            height="100%"
            playing={playing}
            playbackRate={playbackRate}
            controls={true}
            onReady={handleReady}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            config={{
              youtube: {
                playerVars: { origin: window.location.origin }
              }
            }}
            onError={(e) => {
              console.error("Player error:", e);
              showToast("Error loading video. Please check the URL.");
            }}
            className="absolute top-0 left-0"
          />
        </div>

        {/* Chat Sidebar Component */}
        <ChatSidebar
          messages={messages}
          users={users}
          username={username}
          selectedAvatar={selectedAvatar}
          role={role}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendChatMessage={sendChatMessage}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formatTime={formatTime}
          handleTransferHost={handleTransferHost}
          openUserMenuId={openUserMenuId}
          setOpenUserMenuId={setOpenUserMenuId}
          setIsModalOpen={setIsModalOpen}
          showScrollIndicator={showScrollIndicator}
          scrollRef={scrollRef}
          chatEndRef={chatEndRef}
          handleChatScroll={handleChatScroll}
        />
      </main>

      {/* Mobile Participants Bottom Sheet */}
      {isMobileUsersOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex items-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#050816]/80 backdrop-blur-sm" onClick={() => setIsMobileUsersOpen(false)} />
          <div className="relative w-full bg-gradient-to-b from-[#0B0F1A] to-[#050816] backdrop-blur-xl rounded-t-[32px] border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[85dvh] flex flex-col">
            {/* Handle for swipe visual */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" onClick={() => setIsMobileUsersOpen(false)} />

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-black text-white uppercase tracking-widest">Participants</h2>
                <span className="bg-indigo-500/20 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-500/20">
                  {users.length}
                </span>
              </div>
              <button
                onClick={() => setIsMobileUsersOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
              {users.map((u, i) => {
                const isMe = u.name === username;
                const isUserHost = u.isHost;

                return (
                  <div key={i} className="flex flex-col">
                    <div
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isMe ? 'bg-indigo-500/10 border border-blue-500/20' : 'bg-white/5 border border-white/10'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shadow-lg border border-white/10`}>
                            <AvatarIcon avatar={u.avatar} className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050816]" />
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isMe ? 'text-white' : 'text-gray-200'}`}>
                              {isMe ? `You (${u.name})` : u.name}
                            </span>
                            {isUserHost && (
                              <div className="bg-indigo-500/20 border border-blue-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                <Shield className="w-2.5 h-2.5 text-blue-500" />
                                <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">Host</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {isUserHost ? 'Moderator' : 'Viewer'}
                          </span>
                        </div>
                      </div>

                      {role === 'HOST' && !isUserHost && (
                        <div className="relative z-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenUserMenuId(openUserMenuId === u.id ? null : u.id);
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Inline Mobile Menu */}
                    {role === 'HOST' && !isUserHost && openUserMenuId === u.id && (
                      <div className="px-2 pt-1 pb-3 animate-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={() => {
                            handleTransferHost(u.id);
                            setOpenUserMenuId(null);
                          }}
                          className="w-full px-4 py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-left text-[10px] font-black text-white hover:bg-indigo-600 flex items-center gap-3 uppercase tracking-widest transition-colors"
                        >
                          <Shield className="w-4 h-4 text-blue-500" />
                          Make Host
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {role === 'HOST' && (
              <div className="px-6 py-4 border-t border-white/5 bg-white/5 backdrop-blur-md">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95 flex items-center justify-center gap-3"
                >
                  <Settings className="w-5 h-5" />
                  Change Video
                </button>
              </div>
            )}

            {/* Bottom padding for mobile home indicator */}
            <div className="h-8 w-full" />
          </div>
        </div>
      )}

      {/* Toasts Container */}
      <div className="fixed top-24 right-4 lg:right-12 z-[60] flex flex-col gap-3 w-[90%] max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="bg-gradient-to-r from-[#0B0F1A] to-[#050816] text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-2xl border border-blue-500/30 flex items-center gap-3 animate-in slide-in-from-right-8 duration-500 backdrop-blur-xl">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {t.message}
          </div>
        ))}
      </div>

      {/* Change Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050816]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0B0F1A] to-[#050816] backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in fade-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Sync New Video</h2>
                <p className="text-xs text-gray-400 font-medium">Update the playback for everyone in the room</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={triggerVideoChange} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Paste Link</label>
                <input
                  autoFocus
                  type="text"
                  value={newUrlInput}
                  onChange={(e) => setNewUrlInput(e.target.value)}
                  className="w-full bg-[#050816]/50 backdrop-blur-sm border border-white/10 p-5 rounded-3xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm shadow-inner placeholder:text-gray-400"
                  placeholder="YouTube, Vimeo, Twitch, or Direct URL..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center justify-center gap-3 active:scale-95"
              >
                Apply Sync
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Host Leave Modal */}
      {showHostLeaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050816]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowHostLeaveModal(false)} />
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0B0F1A] to-[#050816] backdrop-blur-xl border border-red-500/20 rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in fade-in duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-white">You are the host</h2>
              <p className="text-sm text-gray-400 mt-2">What would you like to do before leaving?</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowHostLeaveModal(false);
                  setActiveTab('users');
                  showToast("Please select a user to transfer host role.");
                }}
                className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold text-sm transition-all"
              >
                Transfer Host
              </button>
              
              <button
                onClick={() => {
                  handleEndRoom();
                  setShowHostLeaveModal(false);
                  navigate('/');
                }}
                className="w-full py-4 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 rounded-2xl font-bold text-sm transition-all"
              >
                End Room for All
              </button>
              
              <button
                onClick={() => setShowHostLeaveModal(false)}
                className="w-full py-4 text-gray-500 hover:text-gray-300 font-bold text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
