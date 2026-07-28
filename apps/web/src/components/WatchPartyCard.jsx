import React from 'react';
import AvatarSelector from './AvatarSelector';
import InputField from './InputField';
import PrimaryButton from './PrimaryButton';
import Divider from './Divider';
import JoinSection from './JoinSection';
import { User } from 'lucide-react';

const WatchPartyCard = ({
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
    <div className="relative w-full sm:w-[90%] lg:w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[528px] h-auto min-h-[640px] lg:h-[668px] mx-auto lg:ml-auto select-none font-handdrawn">
      {/* 3 White Dash Burst Lines outside top-right corner of card */}
      <div className="absolute -top-3 right-8 sm:right-12 text-white/70 text-xs pointer-events-none font-mono z-20 hidden sm:block">
        \ | /
      </div>

      {/* Floating Glass Container with Slight Counter-Clockwise Tilt (-0.8deg on Desktop) */}
      <div className="w-full h-full bg-[#111522] border border-white/[0.08] rounded-[24px] sm:rounded-[26px] pt-8 sm:pt-11 px-6 sm:px-9 pb-8 sm:pb-10 shadow-[0_25px_65px_rgba(0,0,0,0.45)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between z-10 lg:transform lg:-rotate-[0.8deg] transition-all duration-300 gap-4 sm:gap-0">
        
        {/* Subtle inner top highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* 1. Avatar Selector */}
        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onSelectAvatar={setSelectedAvatar}
        />

        {/* 2. Room / User Name Input */}
        <InputField
          label="WHAT'S THE ROOM CALLED?"
          labelDoodle={true}
          icon={User}
          iconColor="text-yellow-400"
          placeholder="Give your room a name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* 3. Primary CTA Button */}
        <PrimaryButton
          onClick={createRoom}
          loading={loading}
          text="CREATE WATCH PARTY"
        />

        {/* 4. Divider */}
        <Divider text="OR JOIN A ROOM" />

        {/* 5. Secondary Join Section */}
        <JoinSection
          roomIdInput={roomIdInput}
          setRoomIdInput={setRoomIdInput}
          onJoinRoom={joinRoom}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default WatchPartyCard;
