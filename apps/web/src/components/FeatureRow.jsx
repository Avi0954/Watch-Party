import React from 'react';
import { Film, MessageSquare, Share2 } from 'lucide-react';

const FeatureRow = () => {
  return (
    <div className="flex items-center gap-6 lg:gap-8 pt-4">
      {/* SYNC */}
      <div className="flex flex-col items-center gap-2 group cursor-default">
        <div className="w-10 h-10 rounded-xl border border-purple-500/40 bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:border-purple-400 group-hover:scale-105 transition-all shadow-[0_0_12px_rgba(168,85,247,0.15)]">
          <Film className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-black tracking-widest text-gray-300 uppercase">SYNC</span>
      </div>

      {/* Vertical Divider */}
      <div className="w-[1px] h-8 bg-white/10" />

      {/* CHAT */}
      <div className="flex flex-col items-center gap-2 group cursor-default">
        <div className="w-10 h-10 rounded-xl border border-pink-500/40 bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:border-pink-400 group-hover:scale-105 transition-all shadow-[0_0_12px_rgba(236,72,153,0.15)]">
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-black tracking-widest text-gray-300 uppercase">CHAT</span>
      </div>

      {/* Vertical Divider */}
      <div className="w-[1px] h-8 bg-white/10" />

      {/* SHARE */}
      <div className="flex flex-col items-center gap-2 group cursor-default">
        <div className="w-10 h-10 rounded-xl border border-yellow-500/40 bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:border-yellow-400 group-hover:scale-105 transition-all shadow-[0_0_12px_rgba(234,179,8,0.15)]">
          <Share2 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-black tracking-widest text-gray-300 uppercase">SHARE</span>
      </div>
    </div>
  );
};

export default FeatureRow;
