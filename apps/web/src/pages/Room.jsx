import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Send, LogOut, MessageSquare, Shield, User,
  Users, Copy, Check, Play, Settings, X, ChevronLeft, Bell, Share2, Link, ArrowRight, RefreshCw,
  Ghost, Cat, Dog, Bot, Smile, Sparkles, MoreVertical
} from 'lucide-react';
import { useSyncPlayer } from '../hooks/useSyncPlayer';

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
  const { roomId } = useParams();
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
  } = useSyncPlayer(roomId, playerRef, setPlaying, setUrl, username, selectedAvatar, handleRoomEnd);

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
      className="flex flex-col bg-[#050816] text-white overflow-hidden font-sans selection:bg-cyan-500/30 relative"
      style={{ height: 'var(--visual-viewport-height, 100dvh)' }}
    >
      {/* Subtle background glow for the whole room */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header - Adaptive for Desktop */}
      <header className={`flex flex-col bg-white/[0.02] backdrop-blur-md border-b border-white/[0.04] z-30 lg:h-16 lg:justify-center relative transition-all duration-500 ease-in-out ${isKeyboardOpen ? 'h-0 opacity-0 overflow-hidden border-none' : 'h-auto opacity-100'}`}>
        <div className="max-w-screen-2xl mx-auto w-full px-2 md:px-4 lg:px-12">
          {/* Main Desktop Header & Mobile Row 1 */}
          <div className="h-14 lg:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors lg:hidden flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-400" />
                </button>
                <div className="hidden lg:flex w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-lg items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                  <Play className="w-4 h-4 text-blue-500 ml-0.5 fill-cyan-400/20" />
                </div>
                <h1 className="text-base lg:text-xl font-bold tracking-tight text-white uppercase lg:tracking-widest">
                  Watch Party
                </h1>
              </div>
            </div>

            {/* Right Section: Mobile User Identity (Polished Compact Style) */}
            <div className="flex lg:hidden items-center h-full">
              <div className="flex items-center gap-1.5 bg-white/[0.05] backdrop-blur-md border border-white/10 pl-1 pr-2 py-1 rounded-lg h-9 shadow-lg shadow-black/20">
                <div className="w-6.5 h-6.5 rounded-full border border-blue-500/50 flex items-center justify-center bg-[#050816] shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.15)] ml-0.5">
                  <AvatarIcon avatar={selectedAvatar} className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[11px] font-bold text-white truncate leading-none tracking-tight">{username}</span>
                  {role === 'HOST' && (
                    <span className="bg-blue-600 text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[3px] leading-none shadow-sm shadow-blue-900/20">
                      HOST
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (role === 'HOST') {
                    setShowHostLeaveModal(true);
                  } else {
                    navigate('/');
                  }
                }}
                className="flex items-center justify-center ml-2 w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors active:scale-95"
                title="Leave Room"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Center Section: Desktop Controls */}
            <div className="hidden lg:flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
              <div
                className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-lg px-4 h-10 cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-200 group active:border-blue-400"
                onClick={copyRoomId}
              >
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Room ID</span>
                <code className="text-[14px] font-mono text-blue-500 font-semibold tracking-tight">{roomId}</code>
                <div className="w-px h-4 bg-white/10 mx-1" />
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />}
              </div>

              <button
                onClick={copyRoomLink}
                className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg px-4 h-10 hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-200 group active:border-blue-400"
              >
                <Link className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-200 transition-colors">Copy Link</span>
              </button>

              <button
                onClick={handleManualSync}
                className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg px-4 h-10 hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-200 group active:border-blue-400"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'Synced' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 group-hover:text-gray-200 transition-colors">{syncStatus}</span>
                <RefreshCw className={`w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors ${syncStatus !== 'Synced' ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Right Section: Desktop Profile & Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-lg px-3 h-10 hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-200 group">
                <div className="w-7 h-7 rounded-full border border-blue-500/40 flex items-center justify-center bg-[#050816] shrink-0">
                  <AvatarIcon avatar={selectedAvatar} className="w-3.5 h-3.5 text-blue-400 transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200 tracking-tight">{username}</span>
                  {role === 'HOST' && (
                    <span className="bg-blue-500/[0.12] text-blue-500 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md leading-none">
                      HOST
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (role === 'HOST') {
                    setShowHostLeaveModal(true);
                  } else {
                    navigate('/');
                  }
                }}
                className="flex items-center gap-2 px-4 h-10 ml-5 rounded-lg border border-red-500/20 bg-white/[0.02] text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200 text-xs font-semibold group"
              >
                <LogOut className="w-4 h-4 text-red-500/70 group-hover:text-red-500 transition-colors" />
                <span>Leave Room</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-only Room Code Badge Row */}
        <div className="px-2 md:px-4 pb-1.5 md:pb-3 flex items-center justify-between lg:hidden">
          <div
            className="flex items-center gap-2 bg-[#0B0F1A] border border-white/5 rounded-lg px-3 py-1.5 cursor-pointer active:scale-95 transition-transform"
            onClick={copyRoomId}
          >
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ROOM:</span>
            <code className="text-xs font-mono text-blue-500 font-bold">{roomId}</code>
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
          </div>

          <button
            onClick={copyRoomLink}
            className="flex lg:hidden items-center gap-2 bg-[#0B0F1A] border border-white/5 rounded-lg px-3 py-1.5 active:scale-95 transition-transform"
          >
            <Link className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link</span>
          </button>

          <button
            onClick={handleManualSync}
            className="flex items-center gap-2 bg-[#0B0F1A] border border-white/5 rounded-lg px-3 py-1.5 active:scale-95 transition-transform"
          >
            <div className={`w-2 h-2 rounded-full ${syncStatus === 'Synced' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{syncStatus}</span>
            <RefreshCw className={`w-3 h-3 text-blue-500 ${syncStatus !== 'Synced' ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-[1400px] 2xl:max-w-[1500px] mx-auto w-full px-2 md:px-4 lg:px-5 py-1.5 md:py-6 gap-1.5 md:gap-4 lg:gap-5 items-start md:items-stretch overflow-hidden md:max-h-[85dvh]">
        {/* Video Section */}
        <div className={`w-full ${isKeyboardOpen ? 'h-32' : 'aspect-video'} md:aspect-auto md:flex-1 bg-black relative overflow-hidden group rounded-xl md:rounded-[32px] shadow-2xl border border-white/5 shrink-0 transition-all duration-500 ease-in-out`}>
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

        {/* Chat Panel - Sidebar on Desktop, Bottom Sheet on Mobile */}
        <div className="w-full md:w-[340px] lg:w-[380px] flex-1 md:flex-none flex flex-col bg-slate-900/90 backdrop-blur-2xl rounded-lg md:rounded-[32px] border border-white/10 shadow-2xl overflow-hidden relative transition-all duration-500 ease-in-out">
          {/* Tabs Navigation */}
          <div className="flex border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-20 px-2 md:px-4 pt-2 md:pt-3">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 py-1 md:py-1.5 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'chat' ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
              {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex flex-1 items-center justify-center gap-2 py-1 md:py-1.5 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'users' ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <Users className="w-3.5 h-3.5" />
              Users ({users.length})
              {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative flex flex-col">
            {activeTab === 'chat' ? (
              <>
                <div
                  ref={scrollRef}
                  onScroll={handleChatScroll}
                  className="flex-1 overflow-y-auto pt-2 md:pt-4 pb-2 md:pb-3 scroll-smooth custom-scrollbar relative"
                >
                  <div className="min-h-full flex flex-col justify-end">
                    {messages.map((m, i) => {
                    const isSystem = m.sender === 'System';
                    const isMe = m.sender === username;
                    const prevMsg = i > 0 ? messages[i - 1] : null;
                    const isFirstInGroup = !prevMsg || prevMsg.sender !== m.sender || prevMsg.sender === 'System';

                    if (isSystem) {
                      return (
                        <div key={i} className="flex justify-center py-1.5 md:py-3 animate-in fade-in duration-200 px-3 md:px-6">
                          <span className="text-[11px] text-white/40 font-medium text-center">
                            {m.text}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start gap-2.5 items-start'} ${isFirstInGroup ? 'mt-[10px]' : 'mt-[4px]'} px-2 md:px-4 animate-in fade-in duration-200`}>
                        {!isMe && (
                          <div className="w-7 h-7 flex-shrink-0 mt-1">
                            {isFirstInGroup ? (
                              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                                <AvatarIcon avatar={m.avatar} className="w-3.5 h-3.5 text-blue-400" />
                              </div>
                            ) : null}
                          </div>
                        )}

                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                          {isFirstInGroup && !isMe && (
                            <span className="text-[11px] font-bold text-blue-400/80 mb-1 ml-1 opacity-60">
                              {m.sender}
                            </span>
                          )}
                          <div className={`px-3.5 py-2 rounded-xl text-sm leading-relaxed break-words whitespace-pre-wrap relative ${isMe
                              ? 'bg-[#2563eb] text-white rounded-tr-none shadow-md shadow-blue-900/10'
                              : 'bg-white/[0.08] text-[#e5e7eb] rounded-tl-none'
                            }`}>
                            {m.text}
                            <span className="text-[9px] opacity-40 ml-2 float-right mt-1.5 font-medium">
                              {formatTime(m.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                  </div>
                </div>

                {/* New Messages Indicator */}
                {showScrollIndicator && (
                  <button
                    onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2 hover:bg-indigo-500 transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-3 h-3 rotate-[270deg]" /> New Messages
                  </button>
                )}

                {/* Chat Input */}
                <div className="p-2 md:p-4 bg-white/5 border-t border-white/5 backdrop-blur-md sticky bottom-0 z-20">
                  <form onSubmit={sendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 py-1.5 md:py-3.5 px-3 md:px-3.5 rounded-full outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xs md:text-sm placeholder:text-gray-400 text-white shadow-inner backdrop-blur-md"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:to-cyan-500 text-white rounded-full transition-all flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-90"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto px-2 md:px-4 py-3 md:py-6 space-y-1.5 custom-scrollbar">
                <div className="flex items-center justify-between mb-6 px-1">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-3 h-3 text-blue-500" />
                    Participants
                  </div>
                  <span className="text-[10px] font-black bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-slate-400">
                    {users.length}
                  </span>
                </div>

                {/* Current User Info for Mobile */}
                <div className="lg:hidden mb-4 md:mb-8 p-3 md:p-4 bg-indigo-500/10 rounded-xl md:rounded-2xl border border-blue-500/20 shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User className="w-3 h-3 text-blue-500" />
                    My Identity
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shadow-xl">
                      <AvatarIcon avatar={selectedAvatar} className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{username}</span>
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{role}</span>
                    </div>
                  </div>
                </div>

                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-10 h-10 text-slate-800 mx-auto mb-3 opacity-20" />
                    <p className="text-xs font-bold text-gray-400">No users in room</p>
                  </div>
                ) : (
                  users.map((u, i) => {
                    const isMe = u.name === username;
                    const isUserHost = u.isHost;

                    return (
                      <div key={i} className="flex flex-col">
                        <div
                          className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 animate-in fade-in slide-in-from-right-2 duration-300 ${isMe ? 'bg-indigo-500/5 ring-1 ring-white/5' : 'hover:bg-white/5'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-white shadow-xl shadow-black/20 border border-white/10`}>
                                <AvatarIcon avatar={u.avatar} className="w-4 h-4 text-blue-500" />
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#111827] rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                              </div>
                            </div>

                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`text-[13px] font-bold tracking-tight ${isMe ? 'text-white' : 'text-gray-200 group-hover:text-white transition-colors'}`}>
                                  {isMe ? `You (${u.name})` : u.name}
                                </span>
                                {isUserHost && (
                                  <div className="flex items-center gap-1 bg-indigo-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-md">
                                    <Shield className="w-2.5 h-2.5 text-blue-500" />
                                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">Host</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                                {isUserHost ? 'Moderator' : 'Viewer'}
                              </span>
                            </div>
                          </div>

                          {/* Host Actions */}
                          {role === 'HOST' && !isUserHost && (
                            <div className="relative z-50">
                              {/* Desktop Hover Button */}
                              <button
                                onClick={() => handleTransferHost(u.id)}
                                className="hidden lg:flex opacity-0 group-hover:opacity-100 transition-all bg-[#0B0F1A] hover:bg-indigo-600 border border-white/10 hover:border-blue-500 text-[9px] font-black uppercase tracking-tighter text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg active:scale-95 items-center gap-1.5"
                                title={`Make ${u.name} Host`}
                              >
                                <ArrowRight className="w-3 h-3" />
                                Make Host
                              </button>

                              {/* Mobile 3-Dot Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenUserMenuId(openUserMenuId === u.id ? null : u.id);
                                }}
                                className="lg:hidden p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Inline Mobile Menu to avoid clipping */}
                        {role === 'HOST' && !isUserHost && openUserMenuId === u.id && (
                          <div className="lg:hidden px-3 pb-3 animate-in slide-in-from-top-2 duration-200">
                            <button
                              onClick={() => {
                                handleTransferHost(u.id);
                                setOpenUserMenuId(null);
                              }}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-left text-[10px] font-black text-white hover:bg-indigo-600 flex items-center gap-3 uppercase tracking-widest transition-colors"
                            >
                              <Shield className="w-4 h-4 text-blue-500" />
                              Make Host
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {role === 'HOST' && (
                  <div className="px-1 mt-4">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-4 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                      <Settings className="w-4 h-4" />
                      Change Video
                    </button>
                  </div>
                )}

                {/* Additional Room Info or Help */}
                <div className="pt-8 px-1">
                  <div className="p-4 bg-indigo-500/5 rounded-2xl border border-blue-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <Play className="w-3 h-3 text-blue-500" />
                      </div>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Host Controls</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                      The Host controls the global playback, video source, and can transfer their role to any other participant.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
