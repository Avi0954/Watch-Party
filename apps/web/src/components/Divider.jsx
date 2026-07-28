import React from 'react';

const Divider = ({ text = "OR JOIN A ROOM" }) => {
  return (
    <div className="flex items-center gap-3 my-1 select-none font-handdrawn">
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-white/15" />
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-300/80 px-1 font-handdrawn">
        {text}
      </span>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-white/15 to-white/15" />
    </div>
  );
};

export default Divider;
