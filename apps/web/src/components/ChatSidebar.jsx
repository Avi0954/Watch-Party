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
    <div className="w-full xl:w-[380px] 2xl:w-[420px] flex-1 xl:flex-none flex flex-col bg-[#070914] rounded-[24px] shadow-2xl overflow-hidden relative select-none font-handdrawn transition-all duration-300 min-h-0">

      {/* Outer Sketched Frame Accent SVG (Doodle Frame) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="1" y="1" width="98" height="98" rx="6" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="100 2 60 2" />
      </svg>

      {/* Top Tabs Navigation - Centered & Equal Width Alignment */}
      <div className="flex border-b border-slate-800/80 bg-[#070914] px-4 pt-3 pb-2.5 items-center justify-around relative z-20 select-none font-handdrawn">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-1 font-handdrawn text-sm uppercase tracking-wider transition-all relative ${activeTab === 'chat' ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200 font-bold'
            }`}
        >
          <MessageSquare className={`w-4 h-4 ${activeTab === 'chat' ? 'text-white' : 'text-slate-400'}`} />
          <span>CHAT</span>

          {/* Active Tab Hand-Drawn Soft Pink Scribble Marker Underline */}
          {activeTab === 'chat' && (
            <svg
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[72px] h-2.5 text-[#F472B6] overflow-visible pointer-events-none drop-shadow-[0_0_5px_rgba(244,114,182,0.45)]"
              viewBox="0 0 74 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 2 5 C 22 2.5, 52 7.5, 72 4.5" />
              <path d="M 5 8 C 24 6, 50 8.5, 69 7" opacity="0.75" strokeWidth="2" />
            </svg>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 py-1 font-handdrawn text-sm uppercase tracking-wider transition-all relative ${activeTab === 'users' ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200 font-bold'
            }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-white' : 'text-slate-400'}`} />
          <span>USERS ({users.length})</span>

          {activeTab === 'users' && (
            <svg
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[92px] h-2.5 text-[#F472B6] overflow-visible pointer-events-none drop-shadow-[0_0_5px_rgba(244,114,182,0.45)]"
              viewBox="0 0 94 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 2 5 C 28 2.5, 66 7.5, 92 4.5" />
              <path d="M 5 8 C 30 6, 62 8.5, 89 7" opacity="0.75" strokeWidth="2" />
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
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5 select-none opacity-80 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border-2 border-purple-500/20 flex items-center justify-center text-2xl rotate-3 shadow-[0_0_15px_rgba(139,92,246,0.15)] mb-0.5">
                    💬
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black font-handdrawn uppercase tracking-wider text-slate-300">
                      No messages yet
                    </p>
                    <p className="text-[11px] font-handdrawn text-slate-400">
                      Start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="min-h-full flex flex-col justify-end space-y-2.5">
                  {messages.map((m, i) => {
                    const isSystem = m.sender === 'System';
                    const theme = getSenderTheme(m.sender, i);

                    {/* System Join / Announcement Note Banner */ }
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
                        className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 group relative z-10 max-w-full"
                      >
                        {/* Avatar Circle with Sketched Theme Ring */}
                        <div className="relative shrink-0 mt-0.5">
                          <div
                            className={`w-8 h-8 rounded-full bg-[#0D1026] border-2 ${theme.border} flex items-center justify-center shadow-md relative`}
                          >
                            <AvatarIcon avatar={m.avatar || 'ghost'} className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        {/* Hand-Drawn Sketch Speech Bubble (Content-Sized Dynamic Width with Strict Wrap) */}
                        <div className="relative max-w-[calc(100%-2.5rem)] min-w-0">
                          {/* Pointer Tail pointing left to Avatar */}
                          <div
                            className="absolute -left-1.5 top-3 w-2.5 h-2.5 bg-[#0E122B] border-l-2 border-b-2 transform rotate-45 z-10"
                            style={{ borderColor: theme.hex }}
                          />

                          <div className={`w-fit max-w-full bg-[#0E122B]/95 border-2 ${theme.border} rounded-xl p-2 px-3 shadow-md transition-all relative z-0`}>
                            <div className="flex items-center gap-2 mb-0.5 whitespace-nowrap">
                              <span className={`text-[11px] font-black font-handdrawn ${theme.text}`}>
                                {m.sender}
                              </span>
                              <span className="text-[9px] font-handdrawn text-slate-400">
                                {formatTime ? formatTime(m.timestamp) : '10:00 AM'}
                              </span>
                            </div>
                            <p className="text-[11px] text-white font-handdrawn leading-normal font-medium break-all [overflow-wrap:anywhere] whitespace-pre-wrap">
                              {m.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Scroll Indicator */}
            {showScrollIndicator && (
              <button
                onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-[#8B5CF6] text-white px-3.5 py-1 rounded-full text-[11px] font-handdrawn font-bold shadow-xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-1.5 hover:bg-purple-600 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer duration-200"
              >
                <ChevronLeft className="w-3.5 h-3.5 rotate-[270deg]" /> NEW MESSAGES
              </button>
            )}

            {/* Emoji Quick Picker */}
            {showEmojiPicker && (
              <>
                {/* Backdrop to close when clicking outside */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowEmojiPicker(false)}
                />
                <div className="absolute bottom-[60px] sm:bottom-[64px] left-2.5 right-2.5 sm:left-3 sm:right-3 z-40 bg-[#0E122B]/95 backdrop-blur-md border-2 border-purple-500/50 rounded-2xl p-1.5 sm:p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-between gap-0.5 sm:gap-1 animate-in zoom-in-95 fade-in duration-150">
                  {EMOJIS.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex-1 max-w-[32px] rounded-lg hover:bg-white/10 flex items-center justify-center text-sm transition-all hover:scale-125 active:scale-95 cursor-pointer duration-150 shrink-0"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Bottom Input Area - Full Width & Responsive Bounds with Safe Area Home Indicator Support */}
            <div className="p-2.5 sm:p-3 pb-[max(0.625rem,calc(env(safe-area-inset-bottom,0px)+0.35rem))] md:pb-3 border-t border-slate-800/80 bg-[#070914] relative z-20 shrink-0 w-full overflow-hidden">
              <form onSubmit={sendChatMessage} className="flex items-center gap-2 w-full min-w-0">
                {/* Yellow Emoji Button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                  className="w-8 h-8 rounded-full bg-[#0D1026] border-2 border-amber-400 text-amber-400 hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 active:scale-95 shadow-sm"
                  title="Emoji"
                >
                  <Smile className="w-4 h-4 text-amber-400" />
                </button>

                {/* Input Box with soft focus glow */}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Say something fun..."
                  className="flex-1 min-w-0 bg-[#0D1026] border-2 border-slate-700 focus:border-purple-400 focus:shadow-[0_0_12px_rgba(139,92,246,0.35)] rounded-full py-2 px-3.5 text-xs font-handdrawn text-white placeholder:text-slate-500 outline-none transition-all duration-200"
                />

                {/* Send Button with micro-lift and glow */}
                <button
                  type="submit"
                  className="w-9 h-9 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:shadow-[0_0_18px_rgba(139,92,246,0.7)] hover:scale-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
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
                      className={`group flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${isMe
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
