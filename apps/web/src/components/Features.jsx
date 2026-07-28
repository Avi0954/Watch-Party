import React from 'react';
import { Film, MessageSquare, Share2 } from 'lucide-react';

const Features = () => {
  return (
    <div className="flex items-center gap-5 pt-3 select-none">
      {/* SYNC */}
      <div className="flex flex-col items-center gap-2 group cursor-pointer opacity-80 hover:opacity-100 transition-all duration-200">
        <div className="w-10 h-10 rounded-xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:border-purple-400 transition-all shadow-[0_0_12px_rgba(168,85,247,0.12)]">
          <Film className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-black tracking-widest text-gray-300 uppercase font-display">SYNC</span>
      </div>

      {/* Vertical Divider */}
      <div className="w-[1px] h-7 bg-white/10" />

      {/* CHAT */}
      <div className="flex flex-col items-center gap-2 group cursor-pointer opacity-80 hover:opacity-100 transition-all duration-200">
        <div className="w-10 h-10 rounded-xl border border-pink-500/30 bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-105 group-hover:border-pink-400 transition-all shadow-[0_0_12px_rgba(236,72,153,0.12)]">
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-black tracking-widest text-gray-300 uppercase font-display">CHAT</span>
      </div>

      {/* Vertical Divider */}
      <div className="w-[1px] h-7 bg-white/10" />

      {/* SHARE */}
      <div className="flex flex-col items-center gap-2 group cursor-pointer opacity-80 hover:opacity-100 transition-all duration-200">
        <div className="w-10 h-10 rounded-xl border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:scale-105 group-hover:border-yellow-400 transition-all shadow-[0_0_12px_rgba(234,179,8,0.12)]">
          <Share2 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-black tracking-widest text-gray-300 uppercase font-display">SHARE</span>
      </div>

      {/* // White Slashes Doodle right next to SHARE */}
      <div className="ml-8 text-white/35 text-xl font-bold tracking-widest font-mono">
        //
      </div>
    </div>
  );
};

export default Features;
