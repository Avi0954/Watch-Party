import React from 'react';
import { ArrowRight } from 'lucide-react';
import InputField from './InputField';

const JoinSection = ({ roomIdInput, setRoomIdInput, onJoinRoom, loading }) => {
  return (
    <form onSubmit={onJoinRoom} className="space-y-2.5 select-none font-handdrawn">
      {/* Input Field for Room ID */}
      <InputField
        icon={({ className }) => (
          <svg className={`w-5 h-5 text-cyan-400 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* TV Screen Box */}
            <rect x="3" y="8" width="18" height="12" rx="2.5" />
            {/* Antennas */}
            <line x1="12" y1="4" x2="8" y2="8" />
            <line x1="12" y1="4" x2="16" y2="8" />
            {/* Inner Play Signal */}
            <polygon points="10,12 15,14 10,16" fill="currentColor" stroke="none" />
          </svg>
        )}
        iconColor="text-cyan-400"
        placeholder="Paste ROOM ID here..."
        value={roomIdInput}
        onChange={(e) => setRoomIdInput(e.target.value)}
      />

      {/* Secondary Outlined CTA Button */}
      <div className="relative">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-[#0B0E17]/90 hover:bg-cyan-950/20 border border-cyan-400/40 text-cyan-400 hover:text-cyan-300 rounded-xl font-bold text-base uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:shadow-[0_0_16px_rgba(6,182,212,0.25)] hover:border-cyan-400/60 active:scale-[0.99] group font-handdrawn"
        >
          <span className="font-bold text-base tracking-wider text-center">JOIN ROOM</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 stroke-[2.5]" />
        </button>

        {/* Teal hand-drawn scribble underline accent under JOIN ROOM button */}
        <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-2.5 text-cyan-400 pointer-events-none opacity-85" viewBox="0 0 120 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M 2 5 C 20 1, 40 9, 60 4 C 80 1, 100 9, 118 5" />
        </svg>
      </div>
    </form>
  );
};

export default JoinSection;
