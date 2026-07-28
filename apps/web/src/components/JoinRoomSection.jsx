import React from 'react';
import { Tv, ArrowRight } from 'lucide-react';
import InputField from './InputField';

const JoinRoomSection = ({ roomIdInput, setRoomIdInput, onJoinRoom, loading }) => {
  return (
    <form onSubmit={onJoinRoom} className="space-y-3">
      {/* Input Field for Room ID */}
      <InputField
        icon={Tv}
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
          className="w-full h-14 bg-[#0B0E17]/80 hover:bg-cyan-950/30 border border-cyan-500/40 text-cyan-400 hover:text-cyan-300 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:border-cyan-400 active:scale-[0.98] group"
        >
          <span>JOIN ROOM</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
        </button>

        {/* Teal hand-drawn scribble underline accent under JOIN ROOM button */}
        <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-2 text-cyan-400/80 pointer-events-none" viewBox="0 0 120 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 4 C 30 1, 60 6, 118 3" />
        </svg>
      </div>
    </form>
  );
};

export default JoinRoomSection;
