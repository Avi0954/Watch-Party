import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LandingPage from '../components/LandingPage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Home = () => {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('ghost');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      alert('Please enter a room/user name first');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/create-room`);
      const { room_id, token } = response.data;
      localStorage.setItem(`token_${room_id}`, token);
      navigate(`/room/${room_id}?token=${token}&name=${encodeURIComponent(trimmedUsername)}&avatar=${selectedAvatar}`);
    } catch (error) {
      console.error(error);
      alert('Error creating room');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const normalizedRoomId = roomIdInput.trim().toUpperCase();

    if (!trimmedUsername) {
      alert('Please enter your name first');
      return;
    }
    if (!normalizedRoomId) {
      alert('Please enter a Room ID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/join-room`, {
        room_id: normalizedRoomId
      });

      const { token, room_id } = response.data;
      localStorage.setItem(`token_${room_id}`, token);
      navigate(`/room/${room_id}?token=${token}&name=${encodeURIComponent(trimmedUsername)}&avatar=${selectedAvatar}`);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        alert('Room not found. Please check the ID.');
      } else {
        alert('Error joining room. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LandingPage
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
  );
};

export default Home;
