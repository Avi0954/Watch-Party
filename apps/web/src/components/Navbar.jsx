import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Copy, Check, Link as LinkIcon, RefreshCw, LogOut, Video,
  Ghost, Cat, Dog, Bot, Smile, Sparkles, ChevronLeft,
  SlidersHorizontal, X
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

const Navbar = ({
  roomId,
  username,
  selectedAvatar = 'ghost',
  role = 'MEMBER',
  syncStatus = 'Synced',
  copyRoomId,
  copyRoomLink,
  handleManualSync,
  handleLeaveRoom,
  onOpenChangeVideo,
  copied = false
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="w-full bg-transparent px-3 sm:px-5 md:px-6 lg:px-8 py-2 md:py-2.5 select-none relative font-handdrawn pt-[calc(env(safe-area-inset-top,0px)+0.4rem)] pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] md:pt-2.5 max-w-full">
      {/* ========================================================================= */}
      {/* DESKTOP & TABLET SINGLE-ROW NAVIGATION (md:flex, hidden on mobile)       */}
      {/* ========================================================================= */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[1500px] mx-auto gap-1.5 lg:gap-3 xl:gap-4">
        
        {/* Left Section: Hand-Drawn Logo & Title */}
        <div className="flex items-center gap-1.5 lg:gap-2.5 xl:gap-3 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="p-1 lg:p-1.5 text-slate-400 hover:text-white rounded-lg xl:hidden transition-colors cursor-pointer"
            title="Go Home"
            aria-label="Go Home"
          >
            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 lg:gap-2.5 cursor-pointer group"
          >
            {/* Play Icon Box with Spark Doodles */}
            <div className="relative flex items-center justify-center">
              <svg
                className="absolute -top-2.5 -left-2.5 lg:-top-3 lg:-left-3 w-4 h-4 lg:w-5 lg:h-5 text-amber-400 pointer-events-none animate-sparkle-pulse"
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

              <div className="w-7 h-7 lg:w-9 lg:h-9 bg-[#0E122B] border-2 border-amber-400 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* WATCH PARTY Text with Yellow Sketch Underline */}
            <div className="relative pt-0.5">
              <span className="text-sm lg:text-base xl:text-lg font-black tracking-wider text-white uppercase font-handdrawn whitespace-nowrap">
                WATCH PARTY
              </span>
              <svg
                className="absolute -bottom-1.5 left-0 w-full h-2.5 text-amber-400 overflow-visible pointer-events-none"
                viewBox="0 0 120 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              >
                <path d="M 2 5 C 32 2, 75 8, 118 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Center Section: Adaptive Interactive Action Pills */}
        <div className="flex items-center gap-1.5 lg:gap-2.5 xl:gap-3 shrink-0 flex-nowrap justify-center">
          {/* Purple Sticky Note Pill for Room ID */}
          <div
            onClick={copyRoomId}
            className="bg-[#8B5CF6] border-2 border-slate-900 rounded-xl px-2 lg:px-3 py-1 lg:py-1.5 flex items-center gap-1.5 lg:gap-2 cursor-pointer shadow-[2px_3px_0px_rgba(0,0,0,0.8)] rotate-[-1deg] animate-room-wiggle hover:bg-[#7C3AED] hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-200 active:scale-95"
            title="Click to copy Room ID"
          >
            <div className="flex flex-col">
              <span className="text-[7.5px] lg:text-[9px] font-black font-handdrawn uppercase tracking-widest text-slate-950 leading-none mb-0.5">
                ROOM ID
              </span>
              <code className="text-[10px] lg:text-xs font-handdrawn font-black text-white tracking-wider leading-none">
                {roomId}
              </code>
            </div>

            <div className="w-px h-3 lg:h-4 bg-purple-950/40" />

            {copied ? (
              <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-emerald-300 shrink-0" />
            ) : (
              <Copy className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-purple-100 hover:text-white transition-colors shrink-0" />
            )}
          </div>

          {/* White Paper Sticker Pill for Copy Link */}
          <button
            onClick={copyRoomLink}
            className="bg-white text-slate-950 border-2 border-slate-950 rounded-xl lg:rounded-2xl px-2 lg:px-3 py-1 lg:py-1.5 flex items-center gap-1 lg:gap-1.5 text-[10px] lg:text-xs font-black font-handdrawn shadow-[2px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-slate-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            <span><span className="hidden xl:inline">COPY </span>LINK</span>
          </button>

          {/* Synced Green Sketch Pill */}
          <div className="bg-[#040E0A] border-2 border-[#10B981] rounded-[16px] lg:rounded-[18px] px-2 lg:px-3 py-1 lg:py-1.5 flex items-center gap-1 lg:gap-1.5 text-[#10B981] whitespace-nowrap">
            <span className="w-1.5 lg:w-2.5 h-1.5 lg:h-2.5 rounded-full bg-[#10B981] shrink-0"></span>
            <span className="text-[10px] lg:text-xs font-black font-handdrawn uppercase tracking-wider text-[#10B981]">
              {syncStatus?.toUpperCase() || 'SYNCED'}
            </span>
            <button
              onClick={handleManualSync}
              className="p-0.5 text-[#10B981] hover:text-emerald-200 transition-colors ml-0.5 cursor-pointer"
              title="Resync Player"
            >
              <RefreshCw className={`w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 ${syncStatus !== 'Synced' ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>

          {/* Host Only: Change Video Pill */}
          {role === 'HOST' && (
            <button
              onClick={onOpenChangeVideo}
              className="bg-[#0A1026] text-cyan-400 hover:text-cyan-300 border-2 border-cyan-500/70 hover:border-cyan-400 rounded-[16px] lg:rounded-[18px] px-2 lg:px-3 py-1 lg:py-1.5 flex items-center gap-1 lg:gap-1.5 text-[10px] lg:text-xs font-black font-handdrawn uppercase tracking-wider shadow-[2px_3px_0px_rgba(0,0,0,0.9)] hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
              title="Change Video"
            >
              <Video className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-cyan-400 shrink-0" />
              <span><span className="hidden xl:inline">CHANGE </span>VIDEO</span>
            </button>
          )}
        </div>

        {/* Right Section: Avatar & Leave Action */}
        <div className="flex items-center gap-1.5 lg:gap-2.5 xl:gap-3 shrink-0">
          {/* User Profile Info */}
          <div className="flex items-center gap-1 lg:gap-1.5">
            <div className="w-7 h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 rounded-full border-2 border-white/90 bg-[#7C3AED] flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.5)] shrink-0">
              <AvatarIcon avatar={selectedAvatar} className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-white" />
            </div>

            <span className="text-[11px] lg:text-xs xl:text-sm font-black font-handdrawn text-white tracking-tight max-w-[60px] lg:max-w-[90px] xl:max-w-[120px] truncate">
              {username || 'Avi'}
            </span>

            {role === 'HOST' && (
              <span className="bg-[#FFD600] text-slate-950 font-black font-handdrawn text-[8px] lg:text-[10px] uppercase tracking-wider px-1 lg:px-1.5 py-0.5 rounded-md shadow-sm rotate-[-3deg] border border-slate-950/30 shrink-0">
                HOST
              </span>
            )}
          </div>

          {/* Leave Room Button */}
          <div className="relative shrink-0">
            <svg
              className="absolute -top-2.5 -right-2.5 lg:-top-3 lg:-right-3 w-4 h-4 lg:w-5 lg:h-5 text-amber-400 pointer-events-none animate-sparkle-pulse z-10"
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
              onClick={handleLeaveRoom}
              className="bg-[#1C0D17] border-2 border-[#EC4899] text-[#F472B6] hover:bg-[#EC4899]/20 shadow-[0_0_12px_rgba(236,72,153,0.3)] hover:shadow-[0_0_16px_rgba(236,72,153,0.5)] hover:-translate-y-0.5 rounded-xl lg:rounded-[14px] px-2 lg:px-3 py-1 lg:py-1.5 text-[10px] lg:text-xs font-black font-handdrawn transition-all duration-200 flex items-center gap-1 lg:gap-1.5 animate-btn-shake active:scale-95 cursor-pointer whitespace-nowrap"
              title="Leave Room"
            >
              <LogOut className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-[#F472B6] shrink-0" />
              <span className="uppercase"><span className="hidden xl:inline">LEAVE </span><span>ROOM</span></span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE SINGLE-ROW HEADER WITH RIGHT FLOATING POPOVER (md:hidden)          */}
      {/* ========================================================================= */}
      <div className="flex md:hidden items-center justify-between w-full">
        {/* Logo Left */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate('/')}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Go Home"
            aria-label="Go Home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              <svg
                className="absolute -top-2.5 -left-2.5 w-4 h-4 text-amber-400 pointer-events-none animate-sparkle-pulse"
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

              <div className="w-7 h-7 bg-[#0E122B] border-2 border-amber-400 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            <div className="relative pt-0.5">
              <span className="text-sm font-black tracking-wider text-white uppercase font-handdrawn">
                WATCH PARTY
              </span>
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-amber-400 overflow-visible pointer-events-none"
                viewBox="0 0 120 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              >
                <path d="M 2 5 C 32 2, 75 8, 118 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Avatar Pill & Floating Menu Trigger */}
        <div className="flex items-center gap-1.5" ref={menuRef}>
          {/* User Profile Pill */}
          <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-full px-2 py-0.5">
            <div className="w-6 h-6 rounded-full border-2 border-white/90 bg-[#7C3AED] flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.5)] shrink-0">
              <AvatarIcon avatar={selectedAvatar} className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-black font-handdrawn text-white max-w-[65px] truncate">
              {username || 'Avi'}
            </span>
            {role === 'HOST' && (
              <span className="bg-[#FFD600] text-slate-950 font-black font-handdrawn text-[8.5px] uppercase px-1.5 py-0.5 rounded shadow-sm rotate-[-3deg] border border-slate-950/30 shrink-0">
                HOST
              </span>
            )}
          </div>

          {/* Menu Button Container with Anchored Popover */}
          <div className="relative">
            {/* Screen Dim / Fade Backdrop */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className={`h-8 px-2.5 rounded-xl border-2 font-handdrawn font-black text-xs flex items-center gap-1.5 transition-all shadow-[1px_2px_0px_rgba(0,0,0,0.8)] active:scale-95 cursor-pointer relative z-[160] ${
                isMobileMenuOpen
                  ? 'bg-purple-600 text-white border-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.6)]'
                  : 'bg-[#8B5CF6]/20 border-purple-500/80 text-purple-200 hover:text-white hover:bg-[#8B5CF6]/30'
              }`}
              title="Room Menu"
              aria-label="Room Menu"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wide">Menu</span>
            </button>

            {/* Anchored Floating Dropdown Popover (100% Solid Opaque, Ultra-Compact 2-Column Grid) */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-9.5 z-[160] w-56 bg-[#0E122B] border-2 border-purple-500 rounded-2xl p-2.5 shadow-[0_15px_50px_rgba(0,0,0,0.98),0_0_20px_rgba(139,92,246,0.3)] flex flex-col gap-2 animate-in fade-in slide-in-from-top-1.5 duration-150 font-handdrawn select-none">
                
                {/* Popover Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 px-0.5">
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3 h-3 text-purple-400" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-white">
                      Room Controls
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-0.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2-Column Action Grid (Row 1: Room ID & Copy Link) */}
                <div className="grid grid-cols-2 gap-1.5">
                  {/* Room ID Pill */}
                  <button
                    onClick={copyRoomId}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-slate-900 rounded-xl py-1 px-1.5 flex flex-col items-center justify-center cursor-pointer shadow-[1px_1px_0px_rgba(0,0,0,0.8)] active:scale-95 transition-transform"
                    title="Copy Room ID"
                  >
                    <div className="flex items-center gap-1">
                      {copied ? (
                        <Check className="w-2.5 h-2.5 text-emerald-300" />
                      ) : (
                        <Copy className="w-2.5 h-2.5 text-purple-100" />
                      )}
                      <span className="text-[8px] font-black uppercase tracking-widest text-purple-200 leading-none">
                        {copied ? 'COPIED' : 'ROOM ID'}
                      </span>
                    </div>
                    <code className="text-[10.5px] font-black text-white tracking-wider leading-none mt-0.5">
                      {roomId}
                    </code>
                  </button>

                  {/* Copy Link Button */}
                  <button
                    onClick={copyRoomLink}
                    className="bg-white hover:bg-slate-100 text-slate-950 border-2 border-slate-950 rounded-xl py-1 px-1.5 flex flex-col items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,1)] active:scale-95 transition-transform cursor-pointer"
                    title="Copy Invite Link"
                  >
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-2.5 h-2.5 text-slate-950 shrink-0" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-700 leading-none">
                        INVITE
                      </span>
                    </div>
                    <span className="text-[10px] font-black leading-none mt-0.5 whitespace-nowrap">
                      COPY LINK
                    </span>
                  </button>
                </div>

                {/* 2-Column Action Grid (Row 2: Sync Status & Change Video) */}
                <div className={`grid ${role === 'HOST' ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5`}>
                  {/* Live Sync Button */}
                  <button
                    onClick={handleManualSync}
                    className="bg-[#040E0A] border-2 border-[#10B981] hover:border-emerald-400 rounded-xl py-1 px-1.5 flex items-center justify-center gap-1 text-[#10B981] active:scale-95 transition-all cursor-pointer"
                    title="Click to Resync"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shrink-0"></span>
                    <span className="text-[9.5px] font-black uppercase tracking-wide truncate">
                      {syncStatus?.toUpperCase() || 'SYNCED'}
                    </span>
                    <RefreshCw className={`w-2.5 h-2.5 ml-0.5 shrink-0 ${syncStatus !== 'Synced' ? 'animate-spin' : ''}`} />
                  </button>

                  {/* Host Only: Change Video */}
                  {role === 'HOST' && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenChangeVideo();
                      }}
                      className="bg-[#0A1026] text-cyan-400 border-2 border-cyan-500/80 hover:border-cyan-400 rounded-xl py-1 px-1.5 flex items-center justify-center gap-1 text-[9.5px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-transform cursor-pointer"
                      title="Change Video URL"
                    >
                      <Video className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">VIDEO</span>
                    </button>
                  )}
                </div>

                {/* Row 3: Leave Room Danger Action */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLeaveRoom();
                  }}
                  className="w-full bg-[#1C0D17] border-2 border-[#EC4899] text-[#F472B6] hover:bg-[#EC4899]/20 shadow-sm rounded-xl py-1.5 px-2 flex items-center justify-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider active:scale-95 transition-transform cursor-pointer"
                >
                  <LogOut className="w-3 h-3 text-[#F472B6] shrink-0" />
                  <span>LEAVE WATCH PARTY</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
