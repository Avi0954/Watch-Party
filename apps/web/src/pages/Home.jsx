import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Plus, ArrowRight, User, Ghost, Cat, Dog, Bot, Smile, Sparkles, Film, MessageSquare, Link as LinkIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AVATARS = [
  { id: 'ghost', icon: Ghost },
  { id: 'cat', icon: Cat },
  { id: 'dog', icon: Dog },
  { id: 'bot', icon: Bot },
  { id: 'smile', icon: Smile },
  { id: 'sparkles', icon: Sparkles },
];

const Home = () => {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('ghost');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!username.trim()) {
      alert('Please enter your name first');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/create-room`);
      const { room_id, token } = response.data;
      localStorage.setItem(`token_${room_id}`, token);
      navigate(`/room/${room_id}?name=${encodeURIComponent(username.trim())}&avatar=${selectedAvatar}`);
    } catch (error) {
      console.error(error);
      alert('Error creating room');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter your name first');
      return;
    }
    if (roomIdInput.trim()) {
      navigate(`/room/${roomIdInput.trim()}?name=${encodeURIComponent(username.trim())}&avatar=${selectedAvatar}`);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] md:min-h-[100dvh] md:h-auto bg-[#050816] text-white relative overflow-hidden">
      {/* Background Vignette & Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050816] to-[#050816] pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-0 md:px-6 w-full flex-1 flex flex-col justify-center relative z-10 py-0 md:py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] md:gap-12 lg:gap-20 items-center">

          {/* Left Column: Product Explanation */}
          <div className="hidden md:block space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                <Play className="w-3 h-3 fill-blue-400" />
                Watch Party
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.1]">
                Watch videos together in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-gradient">real-time</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-400 font-medium max-w-xl leading-relaxed">
                Create a room, invite friends, and enjoy synced playback with chat.
              </p>
              
              {/* Trust Signal: Usage Indicator (Desktop Only) */}
              <div className="hidden lg:flex items-center gap-2 text-sm font-bold text-blue-400/80 uppercase tracking-widest pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[#050816] bg-slate-800 flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-500" />
                    </div>
                  ))}
                </div>
                <span>2,000+ watch parties today</span>
              </div>
            </div>

            {/* Compressed Feature List (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-6 pt-4 border-t border-white/[0.03]">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                <Film className="w-4 h-4 text-blue-500" /> Sync
              </div>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                <MessageSquare className="w-4 h-4 text-blue-500" /> Chat
              </div>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                <LinkIcon className="w-4 h-4 text-blue-500" /> Share
              </div>
            </div>

            {/* Platform Clarity */}
            <div className="hidden lg:block pt-2">
              <p className="text-sm text-slate-500 font-medium">
                Works with <span className="text-slate-400">YouTube</span>, <span className="text-slate-400">local videos</span> & more
              </p>
            </div>
          </div>

          {/* Right Column: Centerpiece Card Container */}
          <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 delay-150 h-[100dvh] md:h-auto flex flex-col overflow-hidden md:overflow-visible md:block relative">
            
            {/* Mobile Header Section (Top Spacer) */}
            <div className="md:hidden flex-1 flex flex-col justify-end items-center w-full pb-6">
              <div className="flex flex-col items-center text-center w-full px-4">
                <h2 className="text-3xl font-black leading-[1.05] text-white tracking-tight">
                  WATCH TOGETHER<br />
                  <span className="text-[22px] bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">in real-time</span>
                </h2>
                
                <div className="flex items-center gap-4 mt-4 py-1.5 px-3 rounded-full bg-white/[0.01] border border-white/5 opacity-30 scale-90">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                    <Film className="w-3 h-3 text-blue-500" /> Sync
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                    <MessageSquare className="w-3 h-3 text-blue-500" /> Chat
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                    <LinkIcon className="w-3 h-3 text-blue-500" /> Share
                  </div>
                </div>
              </div>
            </div>

            {/* Main Card (The Mathematically Centered Centerpiece) */}
            <div className="flex-none w-full max-w-md mx-auto lg:max-w-none px-4 md:px-0">
              <div className="w-full p-8 md:p-10 bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-blue-900/10">

                <div className="space-y-6 md:space-y-8">

                  {/* Identity Section */}
                  <div className="space-y-5">

                    {/* Avatar Selection */}
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Choose Avatar</label>
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        {AVATARS.map((av) => {
                          const Icon = av.icon;
                          const isSelected = selectedAvatar === av.id;
                          return (
                            <button
                              key={av.id}
                              onClick={() => setSelectedAvatar(av.id)}
                              className={`p-2 md:p-2.5 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90 ${isSelected
                                ? 'bg-blue-500/10 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                : 'border border-transparent hover:bg-white/10 hover:border-white/20'
                                }`}
                              title={av.id}
                            >
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Your Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="text"
                          placeholder="What should we call you?"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full py-4 pl-12 pr-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 text-gray-200 shadow-inner font-medium text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Action */}
                  <div className="space-y-3">
                    <button
                      onClick={createRoom}
                      disabled={loading}
                      className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 lg:hover:scale-[1.02] lg:hover:-translate-y-0.5 active:scale-95 text-sm md:text-base group"
                    >
                      {loading ? 'Creating...' : <><Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Start Watch Party</>}
                    </button>
                    <p className="hidden lg:block text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-80">
                      No signup • Start instantly
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4 py-1">
                    <div className="flex-1 border-t border-white/[0.04]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 opacity-60">
                      Or Join Room
                    </span>
                    <div className="flex-1 border-t border-white/[0.04]"></div>
                  </div>

                  {/* Secondary Action */}
                  <form onSubmit={joinRoom} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Paste Room ID here"
                      value={roomIdInput}
                      onChange={(e) => setRoomIdInput(e.target.value)}
                      className="w-full py-4 px-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 text-gray-200 shadow-inner font-mono text-center tracking-widest text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full py-4 bg-transparent border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 group text-sm md:text-base lg:hover:-translate-y-0.5 active:scale-95"
                    >
                      Join with Room ID
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Bottom Spacer (Mobile Only) */}
            <div className="md:hidden flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
