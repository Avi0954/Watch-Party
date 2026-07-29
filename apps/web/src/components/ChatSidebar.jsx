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

// Automatic rotating colors for avatars & sender names (Purple, Pink, Cyan, Yellow, Blue)
const ROTATING_THEMES = [
  { border: 'border-[#A855F7]', name: 'text-[#C084FC]', dot: 'bg-[#A855F7]' },
  { border: 'border-[#F43F5E]', name: 'text-[#FB7185]', dot: 'bg-[#F43F5E]' },
  { border: 'border-[#06B6D4]', name: 'text-[#38BDF8]', dot: 'bg-[#06B6D4]' },
  { border: 'border-[#FACC15]', name: 'text-[#FDE047]', dot: 'bg-[#FACC15]' },
  { border: 'border-[#3B82F6]', name: 'text-[#60A5FA]', dot: 'bg-[#3B82F6]' },
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
    <div className="w-full md:w-[340px] lg:w-[380px] flex-1 md:flex-none flex flex-col bg-[#0A0D1F] border-2 border-[#1E2442] rounded-[30px] shadow-2xl overflow-hidden relative transition-all duration-300">

      {/* Decorative Edge Doodles */}
      <svg className="absolute top-2 left-3 w-4 h-4 text-purple-400 opacity-40 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12 C 8 8, 16 16, 20 12" />
      </svg>
      <svg className="absolute top-2 right-4 w-4 h-4 text-amber-400 opacity-50 pointer-events-none animate-sparkle-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>

      {/* Top Tabs Navigation */}
      <div className="flex border-b border-slate-800/80 bg-[#070914] px-5 pt-4 pb-3 items-center gap-8 relative z-20 select-none font-handdrawn">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2.5 py-1 font-handdrawn text-base uppercase tracking-wider transition-all relative ${
            activeTab === 'chat' ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200 font-bold'
          }`}
        >
          <MessageSquare className={`w-5 h-5 ${activeTab === 'chat' ? 'text-[#EC4899] fill-[#EC4899]/15' : 'text-slate-400'}`} />
          <span>CHAT</span>

          {/* Active Tab Hand-Drawn Pink Scribble Marker Underline */}
          {activeTab === 'chat' && (
            <svg
              className="absolute -bottom-2.5 -left-1 w-28 h-3 text-[#EC4899] overflow-visible pointer-events-none"
              viewBox="0 0 100 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            >
              <path d="M 2 5 C 30 2, 70 8, 98 4" />
              <path d="M 4 8 C 32 6, 68 9, 95 7" opacity="0.8" strokeWidth="2.4" />
            </svg>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2.5 py-1 font-handdrawn text-base uppercase tracking-wider transition-all relative ${
            activeTab === 'users' ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200 font-bold'
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === 'users' ? 'text-[#EC4899]' : 'text-slate-400'}`} />
          <span>USERS ({users.length})</span>

          {activeTab === 'users' && (
            <svg
              className="absolute -bottom-2.5 -left-1 w-32 h-3 text-[#EC4899] overflow-visible pointer-events-none"
              viewBox="0 0 110 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            >
              <path d="M 2 5 C 35 2, 75 8, 108 4" />
              <path d="M 4 8 C 38 6, 72 9, 105 7" opacity="0.8" strokeWidth="2.4" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Panel Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'chat' ? (
          <>
            {/* Messages Scroll Area */}
            <div
              ref={scrollRef}
              onScroll={handleChatScroll}
              className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 scroll-smooth custom-scrollbar relative"
            >
              <div className="min-h-full flex flex-col justify-end space-y-3">
                {messages.map((m, i) => {
                  const isSystem = m.sender === 'System';
                  const theme = getSenderTheme(m.sender, i);

                  {/* System Join / Announcement Note Pill */ }
                  if (isSystem) {
                    return (
                      <div key={i} className="flex justify-center py-2 animate-in fade-in duration-200">
                        <div className="relative inline-flex items-center">
                          {/* Radiating yellow spark doodle */}
                          <svg
                            className="absolute -top-2.5 -right-2.5 w-4 h-4 text-amber-400 pointer-events-none"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M4 10L1 8" />
                            <path d="M8 4L6 1" />
                          </svg>

                          <div className="bg-[#FACC15] text-slate-950 font-handdrawn font-bold px-4 py-1.5 rounded-lg border-2 border-slate-950 shadow-md rotate-[-1deg] text-xs flex items-center gap-2">
                            <span>{m.text}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 group"
                    >
                      {/* Avatar Outside Bubble with Doodle Circle Ring */}
                      <div className="relative shrink-0 mt-0.5">
                        <div
                          className={`w-10 h-10 rounded-full bg-[#0D1026] border-2 ${theme.border} flex items-center justify-center shadow-md relative overflow-hidden`}
                        >
                          <AvatarIcon avatar={m.avatar || 'ghost'} className="w-5 h-5 text-white" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${theme.dot} ring-2 ring-[#0A0D1F]`} />
                      </div>

                      {/* Doodle Speech Bubble Card */}
                      <div className="flex-1 bg-[#121633] border-2 border-[#28315C] rounded-[20px] p-3 px-4 shadow-md group-hover:border-purple-500/50 transition-colors relative">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-xs font-bold font-handdrawn ${theme.name}`}>
                            {m.sender}
                          </span>
                          <span className="text-[10px] font-handdrawn text-slate-400">
                            {formatTime ? formatTime(m.timestamp) : '10:00 AM'}
                          </span>
                        </div>
                        <p className="text-xs text-white font-sans leading-relaxed font-normal break-words whitespace-pre-wrap">
                          {m.text}
                        </p>
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
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-[#9333EA] text-white px-4 py-1.5 rounded-full text-xs font-handdrawn font-bold shadow-xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2 hover:bg-purple-600 transition-all active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 rotate-[270deg]" /> NEW MESSAGES
              </button>
            )}

            {/* Emoji Quick Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 z-40 bg-[#121633] border-2 border-[#28315C] rounded-2xl p-2 shadow-2xl flex items-center gap-1 animate-in zoom-in-95 duration-150">
                {EMOJIS.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-white/10 rounded-xl transition-colors active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Input Area */}
            <div className="p-3 border-t border-[#1E2442] bg-[#0A0D1F] relative z-20">
              <form onSubmit={sendChatMessage} className="flex items-center gap-2">
                {/* Emoji Button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                  className="w-10 h-10 rounded-full bg-[#0D1026] border-2 border-[#242C54] hover:border-purple-400 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95"
                  title="Emoji"
                >
                  <Smile className="w-5 h-5 text-slate-400 hover:text-purple-300" />
                </button>

                {/* Input Box */}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Say something fun..."
                  className="flex-1 bg-[#0D1026] border-2 border-[#242C54] focus:border-purple-500 rounded-full py-2.5 px-4 text-xs font-handdrawn text-white placeholder:text-slate-500 placeholder:font-handdrawn outline-none transition-colors"
                />

                {/* Send Button with Spark Doodle */}
                <div className="relative shrink-0">
                  <svg
                    className="absolute -top-2 -right-2 w-4 h-4 text-amber-400 pointer-events-none animate-sparkle-pulse"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M4 10L1 8" />
                    <path d="M8 4L6 1" />
                    <path d="M12 7L13 3" />
                  </svg>

                  <button
                    type="submit"
                    className="w-10 h-10 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-full flex items-center justify-center shadow-[0_0_14px_rgba(147,51,234,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Send"
                  >
                    <Send className="w-4 h-4 text-white transform rotate-12 -translate-y-0.5 translate-x-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Users Panel Tab */
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs font-bold font-handdrawn text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#F43F5E]" />
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
                      className={`group flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${isMe
                          ? 'bg-[#121633] border-purple-500/50 shadow-md'
                          : 'bg-[#0D1026] border-[#242C54] hover:border-slate-600'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-9 h-9 rounded-full bg-[#0D1026] border-2 ${theme.border} flex items-center justify-center shadow-md`}>
                            <AvatarIcon avatar={u.avatar} className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#0A0D1F] rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_6px_#10B981]" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold font-handdrawn ${isMe ? 'text-white' : 'text-slate-200'}`}>
                              {isMe ? `You (${u.name})` : u.name}
                            </span>
                            {isUserHost && (
                              <span className="bg-[#FACC15] text-slate-950 font-black font-handdrawn text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm shadow-sm rotate-[-2deg]">
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
                            className="hidden lg:flex opacity-0 group-hover:opacity-100 transition-all bg-[#9333EA] hover:bg-[#7E22CE] text-white border-2 border-slate-900 text-[9px] font-bold font-handdrawn uppercase tracking-wider px-2.5 py-1.5 rounded-xl items-center gap-1 active:scale-95"
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
                  className="w-full py-3 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold font-handdrawn uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
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
