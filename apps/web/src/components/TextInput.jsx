import React from 'react';

const TextInput = ({ label, labelDoodle, icon: Icon, iconColor = "text-yellow-400", placeholder, value, onChange, type = "text" }) => {
  return (
    <div className="space-y-2 select-none">
      {label && (
        <div className="flex items-center gap-1.5 ml-1">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">
            {label}
          </label>
          {labelDoodle && (
            <span className="text-purple-400 text-xs font-bold pointer-events-none">
              ~~
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 pointer-events-none">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-14 bg-[#121826] border border-white/10 rounded-2xl ${Icon ? 'pl-12' : 'pl-5'
            } pr-5 text-gray-100 placeholder:text-gray-500 font-medium text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all duration-200 shadow-inner`}
        />
      </div>
    </div>
  );
};

export default TextInput;
