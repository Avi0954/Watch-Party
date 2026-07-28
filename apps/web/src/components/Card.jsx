import React from 'react';
import AvatarSelector from './AvatarSelector';
import TextInput from './TextInput';
import PrimaryButton from './PrimaryButton';
import Divider from './Divider';
import JoinRoomSection from './JoinRoomSection';
import { User } from 'lucide-react';

const Card = ({
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
    <div className="relative w-full max-w-[520px] mx-auto lg:ml-auto select-none">
      {/* Floating Glass Container */}
      <div className="w-full bg-[#111522] border border-white/[0.06] rounded-[28px] p-6 sm:p-8 lg:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between space-y-5">
        
        {/* Subtle inner top highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* 1. Avatar Selector */}
        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onSelectAvatar={setSelectedAvatar}
        />

        {/* 2. Room / User Name Input */}
        <TextInput
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

        {/* 5. Secondary Join Room Section */}
        <JoinRoomSection
          roomIdInput={roomIdInput}
          setRoomIdInput={setRoomIdInput}
          onJoinRoom={joinRoom}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Card;
