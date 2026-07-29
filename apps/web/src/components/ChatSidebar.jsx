import React, { useState } from 'react';
import {
  MessageSquare, Users, Send, Smile, ChevronLeft, Shield, User,
  Ghost, Cat, Dog, Bot, Sparkles, MoreVertical, ArrowRight, Settings
} from 'lucide-react';

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

// Rotating themes matching screenshot: Purple, Yellow, Cyan, Pink, Blue
const ROTATING_THEMES = [
  { border: 'border-[#A855F7]', text: 'text-[#C084FC]', bg: 'bg-[#A855F7]/10', hex: '#A855F7' },
  { border: 'border-[#FFD600]', text: 'text-[#FFD600]', bg: 'bg-[#FFD600]/10', hex: '#FFD600' },
  { border: 'border-[#00F0FF]', text: 'text-[#38BDF8]', bg: 'bg-[#00F0FF]/10', hex: '#00F0FF' },
  { border: 'border-[#FF2E93]', text: 'text-[#F472B6]', bg: 'bg-[#FF2E93]/10', hex: '#FF2E93' },
  { border: 'border-[#3B82F6]', text: 'text-[#60A5FA]', bg: 'bg-[#3B82F6]/10', hex: '#3B82F6' },
];

const getSenderTheme = (name = '', index = 0) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const themeIndex = (Math.abs(hash) + index) % ROTATING_THEMES.length;
  return ROTATING_THEMES[themeIndex];
};

const ChatSidebar = ({
  messages = [],
  users = [],
  username = '',
  selectedAvatar = 'ghost',
  role = 'MEMBER',
  inputMessage = '',
  setInputMessage,
  sendChatMessage,
  activeTab = 'chat',
  setActiveTab,
  formatTime,
  handleTransferHost,
  openUserMenuId,
  setOpenUserMenuId,
  setIsModalOpen,
  showScrollIndicator,
  scrollRef,
  chatEndRef,
  handleChatScroll
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const EMOJIS = ['👋', '🔥', '🍿', '😎', '✨', '🎉', '❤️', '😂', '👏', '🎬'];

  const addEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="w-full md:w-[340px] lg:w-[380px] flex-1 md:flex-none flex flex-col bg-[#070914] border-2 border-slate-700/60 rounded-[24px] shadow-2xl overflow-hidden relative select-none font-handdrawn transition-all duration-300">
      
      {/* Outer Sketched Frame Accent SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="1" y="1" width="98" height="98" rx="6" fill="none" stroke="white" strokeWidth="0.6" strokeDasharray="100 2 60 2" />
      </svg>

      {/* Top Tabs Navigation - Centered & Equal Width Alignment */}
      <div className="flex border-b border-slate-800/80 bg-[#070914] px-4 pt-3 pb-2.5 items-center justify-around relative z-20 select-none font-handdrawn">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-1 font-handdrawn text-sm uppercase tracking-wider transition-all relative ${
            activeTab === 'chat' ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200 font-bold'
          }`}
        >
          <MessageSquare className={`w-4 h-4 ${activeTab === 'chat' ? 'text-[#EC4899] fill-[#EC4899]/15' : 'text-slate-400'}`} />
          <span>CHAT</span>

          {/* Active Tab Hand-Drawn Pink Scribble Marker Underline */}
          {activeTab === 'chat' && (
            <svg
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-16 h-2.5 text-[#EC4899] overflow-visible pointer-events-none"
              viewBox="0 0 70 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M 2 5 C 20 2, 50 8, 68 4" />
              <path d="M 4 8 C 22 6, 48 9, 65 7" opacity="0.8" strokeWidth="2.2" />
            </svg>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 py-1 font-handdrawn text-sm uppercase tracking-wider transition-all relative ${
            activeTab === 'users' ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200 font-bold'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-[#EC4899]' : 'text-slate-400'}`} />
          <span>USERS ({users.length})</span>

          {activeTab === 'users' && (
            <svg
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-20 h-2.5 text-[#EC4899] overflow-visible pointer-events-none"
              viewBox="0 0 80 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M 2 5 C 25 2, 55 8, 78 4" />
              <path d="M 4 8 C 28 6, 52 9, 75 7" opacity="0.8" strokeWidth="2.2" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Panel Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'chat' ? (
          <>
            {/* Background Hand-Drawn Floating Doodles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
              {/* Top Left Squiggle */}
              <svg className="absolute top-10 left-4 w-7 h-7 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M2 12 Q 6 4, 10 12 T 18 12 T 22 12" />
              </svg>

              {/* Top Right Star */}
              <svg className="absolute top-14 right-4 w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>

              {/* Middle Right Heart */}
              <svg className="absolute top-1/2 right-3 w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>

              {/* Bottom Right Sparkle */}
              <svg className="absolute bottom-14 right-6 w-5 h-5 text-amber-400 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8Z" />
              </svg>
            </div>

            {/* Messages Scroll Area */}
            <div
              ref={scrollRef}
              onScroll={handleChatScroll}
              className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5 scroll-smooth custom-scrollbar relative z-10"
            >
              <div className="min-h-full flex flex-col justify-end space-y-2.5">
                {messages.map((m, i) => {
                  const isSystem = m.sender === 'System';
                  const theme = getSenderTheme(m.sender, i);

                  {/* System Join / Announcement Note Banner */}
                  if (isSystem) {
                    return (
                      <div key={i} className="flex justify-center py-1 animate-in fade-in duration-200">
                        <div className="relative inline-flex items-center">
                          {/* Radiating yellow spark doodle */}
                          <svg
                            className="absolute -top-2.5 -right-2.5 w-3.5 h-3.5 text-amber-400 pointer-events-none"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M4 10L1 8" />
                            <path d="M8 4L6 1" />
                          </svg>

                          <div className="bg-[#FFD600] text-slate-950 font-handdrawn font-black px-3.5 py-1 rounded-lg border-2 border-slate-950 shadow-md rotate-[-1deg] text-[11px] flex items-center gap-1.5">
                            <span>{m.text}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 group relative z-10"
                    >
                      {/* Avatar Circle with Sketched Theme Ring */}
                      <div className="relative shrink-0 mt-0.5">
                        <div
                          className={`w-8 h-8 rounded-full bg-[#0D1026] border-2 ${theme.border} flex items-center justify-center shadow-md relative`}
                        >
                          <AvatarIcon avatar={m.avatar || 'ghost'} className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Hand-Drawn Sketch Speech Bubble */}
                      <div className="flex-1 min-w-0 relative">
                        {/* Pointer Tail pointing left to Avatar */}
                        <div
                          className="absolute -left-1.5 top-3 w-2.5 h-2.5 bg-[#0E122B] border-l-2 border-b-2 transform rotate-45 z-10"
                          style={{ borderColor: theme.hex }}
                        />

                        <div className={`bg-[#0E122B]/95 border-2 ${theme.border} rounded-xl p-2.5 px-3.5 shadow-md transition-all relative z-0`}>
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className={`text-[11px] font-black font-handdrawn ${theme.text}`}>
                              {m.sender}
                            </span>
                            <span className="text-[9px] font-handdrawn text-slate-400">
                              {formatTime ? formatTime(m.timestamp) : '10:00 AM'}
                            </span>
                          </div>
                          <p className="text-[11px] text-white font-handdrawn leading-normal font-medium break-words whitespace-pre-wrap">
                            {m.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Scroll Indicator */}
            {showScrollIndicator && (
              <button
                onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-[#8B5CF6] text-white px-3.5 py-1 rounded-full text-[11px] font-handdrawn font-bold shadow-xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-1.5 hover:bg-purple-600 transition-all active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 rotate-[270deg]" /> NEW MESSAGES
              </button>
            )}

            {/* Emoji Quick Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 z-40 bg-[#0E122B] border-2 border-purple-500/50 rounded-2xl p-2 shadow-2xl flex items-center gap-1 animate-in zoom-in-95 duration-150">
                {EMOJIS.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="w-7 h-7 flex items-center justify-center text-base hover:bg-white/10 rounded-xl transition-colors active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Input Area - Full Width & Responsive Bounds */}
            <div className="p-2.5 sm:p-3 border-t border-slate-800/80 bg-[#070914] relative z-20 shrink-0 w-full overflow-hidden">
              <form onSubmit={sendChatMessage} className="flex items-center gap-2 w-full min-w-0">
                {/* Yellow Emoji Button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                  className="w-8 h-8 rounded-full bg-[#0D1026] border-2 border-amber-400 text-amber-400 hover:scale-105 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
                  title="Emoji"
                >
                  <Smile className="w-4 h-4 text-amber-400" />
                </button>

                {/* Input Box */}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Say something fun..."
                  className="flex-1 min-w-0 bg-[#0D1026] border-2 border-slate-700 focus:border-purple-400 rounded-full py-2 px-3.5 text-xs font-handdrawn text-white placeholder:text-slate-500 outline-none transition-all"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  className="w-9 h-9 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Send"
                >
                  <Send className="w-3.5 h-3.5 text-white transform rotate-12 -translate-y-0.5 translate-x-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Users Panel Tab */
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold font-handdrawn text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF2E93]" />
                PARTICIPANTS
              </span>
              <span className="text-xs font-black font-handdrawn bg-[#0D1026] border-2 border-[#242C54] px-2.5 py-0.5 rounded-full text-purple-400">
                {users.length}
              </span>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-10 h-10 text-slate-700 mx-auto mb-3 opacity-30" />
                <p className="text-xs font-bold font-handdrawn text-slate-500">NO USERS IN ROOM</p>
              </div>
            ) : (
              users.map((u, i) => {
                const isMe = u.name === username;
                const isUserHost = u.isHost;
                const theme = getSenderTheme(u.name, i);

                return (
                  <div key={i} className="flex flex-col">
                    <div
                      className={`group flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${
                        isMe
                          ? 'bg-[#121633] border-purple-500/50 shadow-md'
                          : 'bg-[#0D1026] border-[#242C54] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full bg-[#0D1026] border-2 ${theme.border} flex items-center justify-center shadow-md`}>
                            <AvatarIcon avatar={u.avatar} className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#0A0D1F] rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_6px_#10B981]" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold font-handdrawn ${isMe ? 'text-white' : 'text-slate-200'}`}>
                              {isMe ? `You (${u.name})` : u.name}
                            </span>
                            {isUserHost && (
                              <span className="bg-[#FFD600] text-slate-950 font-black font-handdrawn text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm shadow-sm rotate-[-2deg]">
                                HOST
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-medium font-handdrawn text-slate-500 uppercase tracking-widest">
                            {isUserHost ? 'MODERATOR' : 'VIEWER'}
                          </span>
                        </div>
                      </div>

                      {/* Host Actions */}
                      {role === 'HOST' && !isUserHost && (
                        <div>
                          <button
                            onClick={() => handleTransferHost(u.id)}
                            className="hidden lg:flex opacity-0 group-hover:opacity-100 transition-all bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-slate-900 text-[9px] font-bold font-handdrawn uppercase tracking-wider px-2 py-1 rounded-lg items-center gap-1 active:scale-95"
                          >
                            <ArrowRight className="w-3 h-3" />
                            MAKE HOST
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenUserMenuId(openUserMenuId === u.id ? null : u.id);
                            }}
                            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {role === 'HOST' && (
              <div className="pt-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold font-handdrawn uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  CHANGE VIDEO
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
