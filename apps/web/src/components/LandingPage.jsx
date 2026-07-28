import React from 'react';
import Hero from './Hero';
import WatchPartyCard from './WatchPartyCard';

const LandingPage = ({
  selectedAvatar,
  setSelectedAvatar,
  username,
  setUsername,
  roomIdInput,
  setRoomIdInput,
  createRoom,
  joinRoom,
  loading
}) => {
  return (
    <div className="relative w-full min-h-screen bg-[#070B17] text-white overflow-x-hidden flex items-center justify-center font-sans select-none py-8 lg:py-0">
      {/* Background Radial Glow: Ultra Subtle Glow Behind Hero */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[600px] h-[60vw] max-h-[600px] bg-indigo-600/[0.035] blur-[140px] rounded-full pointer-events-none" />

      {/* Background Radial Glow: Ultra Subtle Glow Behind Card */}
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[600px] h-[60vw] max-h-[600px] bg-purple-600/[0.04] blur-[140px] rounded-full pointer-events-none" />

      {/* Decorative Blob 1: Top-Right Corner Yellow Blob (Hidden on small mobile < 400px) */}
      <div className="absolute top-0 right-0 w-[18vw] min-w-[140px] max-w-[220px] h-auto aspect-[210/260] pointer-events-none z-0 hidden min-[400px]:block">
        <svg viewBox="0 0 210 260" fill="none" className="w-full h-full">
          <path
            d="M 50 0 L 210 0 L 210 230 C 190 260, 165 240, 145 200 C 125 160, 150 110, 120 70 C 90 35, 60 15, 50 0 Z"
            fill="#FFD600"
          />
          <path
            d="M 85 35 C 80 25, 95 20, 98 32 C 102 44, 98 58, 108 36 C 112 25, 122 25, 125 36 C 128 46, 120 54, 135 44 C 142 40, 150 44, 145 50"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M 152 75 C 162 70, 170 80, 156 88 C 170 85, 176 96, 160 105 C 172 103, 178 114, 164 125 C 175 130, 168 145, 160 152"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Decorative Blob 2: Bottom-Left Corner Pink Fluid Blob */}
      <div className="absolute bottom-0 left-0 w-[16vw] min-w-[130px] max-w-[200px] h-auto aspect-[190/280] pointer-events-none z-0 hidden min-[400px]:block">
        <svg viewBox="0 0 190 280" fill="none" className="w-full h-full">
          <g fill="#E2E8F0" opacity="0.45">
            <circle cx="20" cy="35" r="2.8" />
            <circle cx="38" cy="30" r="3" />
            <circle cx="56" cy="40" r="2.8" />
            <circle cx="74" cy="52" r="3" />

            <circle cx="15" cy="58" r="3" />
            <circle cx="33" cy="52" r="3.5" />
            <circle cx="51" cy="62" r="3" />
            <circle cx="69" cy="74" r="3.5" />
            <circle cx="87" cy="92" r="3" />

            <circle cx="23" cy="80" r="3.5" />
            <circle cx="41" cy="74" r="3.8" />
            <circle cx="59" cy="84" r="3.5" />
            <circle cx="77" cy="100" r="3.8" />
            <circle cx="95" cy="118" r="3.5" />

            <circle cx="31" cy="102" r="3.8" />
            <circle cx="49" cy="96" r="4.2" />
            <circle cx="67" cy="110" r="3.8" />
            <circle cx="85" cy="126" r="3.5" />
            <circle cx="103" cy="144" r="3" />
          </g>

          <path
            d="M 0 110 C 30 110, 52 122, 65 145 C 78 170, 58 195, 75 228 C 92 255, 130 245, 140 280 L 0 280 Z"
            fill="#FF2A85"
          />

          <path
            d="M 22 125 C 30 116, 38 138, 32 146 C 40 134, 48 155, 40 163 C 46 150, 52 172, 44 180"
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M 60 250 Q 67 246, 73 252 M 82 257 Q 89 252, 95 259 M 104 263 Q 111 258, 117 266"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Main Responsive Grid Container: Desktop (48% / 52%), Tablet & Mobile (Vertical Stack) */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:grid lg:grid-cols-[48%_52%] items-center justify-between gap-10 lg:gap-12 min-h-screen lg:min-h-0">
        {/* Left Side: Hero Brand & Features */}
        <Hero />

        {/* Right Side: Centerpiece WatchPartyCard */}
        <WatchPartyCard
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          username={username}
          setUsername={setUsername}
          roomIdInput={roomIdInput}
          setRoomIdInput={setRoomIdInput}
          createRoom={createRoom}
          joinRoom={joinRoom}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LandingPage;
