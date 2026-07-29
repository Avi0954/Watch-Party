import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Copy, Check, Link, RefreshCw, LogOut,
  Ghost, Cat, Dog, Bot, Smile, Sparkles, ChevronLeft
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
  copied = false
}) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#070914] border-b-2 border-[#1E2442] px-4 sm:px-6 py-2.5 flex items-center justify-between z-40 select-none relative font-handdrawn">
      {/* Left Section: Hand-Drawn Logo & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-1 text-slate-400 hover:text-white rounded-lg lg:hidden transition-colors"
          title="Go Home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Play Icon Box with Spark Doodles */}
          <div className="relative flex items-center justify-center">
            {/* Radiating yellow spark doodle SVGs */}
            <svg
              className="absolute -top-3 -left-3 w-5 h-5 text-amber-400 pointer-events-none animate-sparkle-pulse"
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

            {/* Hand-Drawn Yellow Border Box */}
            <div className="w-9 h-9 bg-[#0E122B] border-2 border-amber-400 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* WATCH PARTY Text with Yellow Sketch Underline */}
          <div className="relative pt-0.5">
            <span className="text-base sm:text-lg font-black tracking-wider text-white uppercase font-handdrawn">
              WATCH PARTY
            </span>
            {/* Hand-drawn yellow underline SVG */}
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

      {/* Center Section: Hand-Drawn Interactive Elements */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Purple Sticky Note Pill for Room ID */}
        <div
          onClick={copyRoomId}
          className="bg-[#8B5CF6] border-2 border-slate-900 rounded-xl px-3.5 py-1.5 flex items-center gap-2.5 cursor-pointer shadow-[2px_3px_0px_rgba(0,0,0,0.8)] rotate-[-1deg] animate-room-wiggle hover:bg-[#7C3AED] transition-all active:scale-95"
          title="Click to copy Room ID"
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-black font-handdrawn uppercase tracking-widest text-slate-950 leading-none mb-0.5">
              ROOM ID
            </span>
            <code className="text-xs font-handdrawn font-black text-white tracking-wider leading-none">
              {roomId}
            </code>
          </div>

          <div className="w-px h-4 bg-purple-950/40" />

          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-purple-100 hover:text-white transition-colors shrink-0" />
          )}
        </div>

        {/* White Paper Sticker Pill for Copy Link */}
        <button
          onClick={copyRoomLink}
          className="bg-white text-slate-950 border-2 border-slate-950 rounded-2xl px-3.5 py-1.5 flex items-center gap-2 text-xs font-black font-handdrawn shadow-[2px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
        >
          {/* Clipboard doodle icon */}
          <svg className="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <span>COPY LINK</span>
        </button>

        {/* Synced Green Sketch Pill */}
        <div className="bg-[#062C1B]/90 border-2 border-[#10B981] rounded-full px-4 py-1.5 flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00FF87] shadow-[0_0_8px_#00FF87]"></span>
          <span className="text-xs font-black font-handdrawn uppercase tracking-wider text-[#10B981]">
            {syncStatus?.toUpperCase() || 'SYNCED'}
          </span>
          <button
            onClick={handleManualSync}
            className="p-0.5 text-[#10B981] hover:text-emerald-200 transition-colors ml-0.5"
            title="Resync Player"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus !== 'Synced' ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Right Section: Avatar & Leave Action */}
      <div className="flex items-center gap-3">
        {/* User Avatar with White Sketch Ring & Yellow Tape Host Badge */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full border-2 border-white/90 bg-[#7C3AED] flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.5)] shrink-0">
            <AvatarIcon avatar={selectedAvatar} className="w-5 h-5 text-white" />
          </div>

          <span className="text-xs sm:text-sm font-black font-handdrawn text-white tracking-tight max-w-[90px] truncate">
            {username || 'Avi'}
          </span>

          {role === 'HOST' && (
            <span className="bg-[#FFD600] text-slate-950 font-black font-handdrawn text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm rotate-[-3deg] border border-slate-950/30 shrink-0">
              HOST
            </span>
          )}
        </div>

        {/* Leave Room Danger Sketched Pink Button with Spark Doodle */}
        <div className="relative shrink-0">
          {/* Radiating yellow spark doodle at top-right corner of Leave Room */}
          <svg
            className="absolute -top-3 -right-3 w-5 h-5 text-amber-400 pointer-events-none animate-sparkle-pulse z-10"
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
            className="bg-[#1C0D17] border-2 border-[#EC4899] text-[#F472B6] hover:bg-[#EC4899]/20 shadow-[0_0_12px_rgba(236,72,153,0.3)] rounded-[14px] px-3.5 py-1.5 text-xs font-black font-handdrawn transition-all flex items-center gap-1.5 animate-btn-shake active:scale-95 cursor-pointer"
            title="Leave Room"
          >
            <LogOut className="w-3.5 h-3.5 text-[#F472B6] shrink-0" />
            <span className="hidden sm:inline uppercase">LEAVE ROOM</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Controls Bar */}
      <div className="flex lg:hidden items-center justify-between gap-2 mt-2 px-1">
        <div
          onClick={copyRoomId}
          className="flex-1 bg-[#8B5CF6] border-2 border-slate-900 rounded-xl px-3 py-1 flex items-center justify-between cursor-pointer active:scale-95 transition-transform shadow-sm rotate-[-1deg]"
        >
          <span className="text-[9px] font-black font-handdrawn text-slate-950 uppercase tracking-wider">ROOM:</span>
          <code className="text-xs font-handdrawn font-black text-white">{roomId}</code>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-white" />}
        </div>

        <button
          onClick={copyRoomLink}
          className="bg-white text-slate-950 border-2 border-slate-950 rounded-xl px-3 py-1 flex items-center gap-1.5 text-xs font-black font-handdrawn active:scale-95 transition-transform"
        >
          <Link className="w-3.5 h-3.5 text-slate-950" />
          <span className="text-[10px] uppercase">Link</span>
        </button>

        <button
          onClick={handleManualSync}
          className="bg-[#062C1B] border-2 border-[#10B981] rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-black font-handdrawn text-[#10B981] active:scale-95 transition-transform"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00FF87]"></span>
          <span className="text-[10px] uppercase">{syncStatus}</span>
          <RefreshCw className={`w-3 h-3 text-[#10B981] ${syncStatus !== 'Synced' ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
