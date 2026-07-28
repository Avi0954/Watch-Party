import React from 'react';

const InputField = ({ label, labelDoodle, icon: Icon, iconColor = "text-yellow-400", placeholder, value, onChange, type = "text" }) => {
  return (
    <div className="space-y-2 select-none font-handdrawn">
      {label && (
        <div className="flex items-center gap-2 ml-0.5">
          <label className="text-xs font-black uppercase tracking-[0.15em] text-gray-200">
            {label}
          </label>
          {labelDoodle && (
            <svg className="w-6 h-3 text-purple-400 inline-block pointer-events-none opacity-80" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M 2 6 C 6 2, 10 10, 14 6 C 18 2, 22 10, 24 6" />
            </svg>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4.5 pointer-events-none flex items-center justify-center">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-[60px] bg-[#121624] border border-white/10 rounded-xl ${Icon ? 'pl-14' : 'pl-6'
            } pr-6 text-gray-100 placeholder:text-gray-400/90 placeholder:italic font-handdrawn text-base focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 shadow-inner flex items-center`}
        />
      </div>
    </div>
  );
};

export default InputField;
