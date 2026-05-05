import { useEffect, useRef, useState } from 'react';
import socketService from '../services/socketService';

export const useSyncPlayer = (roomId, playerRef, setPlaying, setUrl, username, avatar, onRoomEnd, token) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(null);
  const [syncStatus, setSyncStatus] = useState('Synced');
  const [playbackRate, setPlaybackRate] = useState(1);

  const isPlayerReady = useRef(false);
  const isInternalChange = useRef(false);
  const internalChangeTimeout = useRef(null);
  const lastHostTime = useRef(0);
  const lastUrl = useRef(null);
  const pendingSyncTime = useRef(null);
  const lastReceivedHostState = useRef(null);
  const lastEventTime = useRef(0);

  // Background / Tab switch fix
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && role !== 'HOST') {
        socketService.sendMessage({ type: 'REQUEST_SYNC' });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [role]);

  // Latest handler ref to avoid stale closures
  const handlerRef = useRef(null);
  useEffect(() => {
    handlerRef.current = handleSocketMessage;
  });

  const setInternalChange = (duration = 1000) => {
    isInternalChange.current = true;
    if (internalChangeTimeout.current) clearTimeout(internalChangeTimeout.current);
    internalChangeTimeout.current = setTimeout(() => {
      isInternalChange.current = false;
    }, duration);
  };

  // Persistent but session-unique user ID to allow multiple tabs in same browser
  const userId = useRef(sessionStorage.getItem('watchit_user_id') || (() => {
    const newId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('watchit_user_id', newId);
    return newId;
  })()).current;

  // Connection Management
  useEffect(() => {
    if (!username || !roomId) return;

    const handleConnect = () => {
      console.log("Socket connected, sending join_room...");
      socketService.sendMessage({
        type: 'join_room',
        name: username,
        user_id: userId,
        roomId: roomId,
        avatar: avatar
      });
    };

    const handleMessage = (data) => {
      if (handlerRef.current) handlerRef.current(data);
    };

    console.log("Setting up socket connection...");
    socketService.connect(roomId, handleMessage, handleConnect, token);

    return () => {
      socketService.disconnect();
    };
  }, [roomId, username, userId]);

  // Role and Sync State Heartbeat
  useEffect(() => {
    if (!isPlayerReady.current) return;

    // Host heartbeat and seek detection
    const hostInterval = setInterval(() => {
      if (role === 'HOST' && isPlayerReady.current && playerRef.current && !isInternalChange.current) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const diff = Math.abs(currentTime - lastHostTime.current);

          // Detect manual seek
          if (diff > 1.5) {
            console.log('Manual seek detected on host:', currentTime);
            sendSyncState(currentTime);
          } else {
            // Heartbeat sync every 5 seconds (using count)
            const now = Date.now();
            if (now % 5000 < 1000) { // Simple heartbeat logic
              sendSyncState(currentTime);
            }
          }
          lastHostTime.current = currentTime;
        } catch (e) { }
      }
    }, 1000);

    // Viewer-side auto sync to correct drift
    const correctionInterval = setInterval(() => {
      if (role !== 'HOST' && isPlayerReady.current && playerRef.current && lastReceivedHostState.current) {
        const state = lastReceivedHostState.current;
        const lastUpdated = state.startTimestamp || state.timestamp || Date.now();
        const currentTime = state.baseTime || state.time || 0;
        const timeDiff = (Date.now() - lastUpdated) / 1000;
        const expectedTime = state.isPlaying ? currentTime + timeDiff : currentTime;
        
        const actualTime = playerRef.current.getCurrentTime();
        if (Math.abs(actualTime - expectedTime) > 1.5) {
          console.log('Auto-sync correcting drift:', actualTime, '->', expectedTime);
          setInternalChange(1000);
          playerRef.current.seekTo(expectedTime, 'seconds');
          setPlaying(state.isPlaying === true);
        } else if (playerRef.current.getInternalPlayer()?.getPlayerState) {
          const expectedState = state.isPlaying ? 1 : 2;
          const actualState = playerRef.current.getInternalPlayer().getPlayerState();
          // 1 is playing, 2 is paused. Only enforce if actual state differs from expected
          // and we aren't buffering (3)
          if ((expectedState === 1 && actualState === 2) || (expectedState === 2 && actualState === 1)) {
            setPlaying(state.isPlaying === true);
          }
        }
      }
    }, 4000);

    return () => {
      clearInterval(hostInterval);
      clearInterval(correctionInterval);
      if (internalChangeTimeout.current) clearTimeout(internalChangeTimeout.current);
    };
  }, [role, playbackRate, isPlayerReady.current]); // Heartbeat dependencies

  const sendSyncState = (time) => {
    if (role !== 'HOST') return;
    socketService.sendMessage({
      type: 'SYNC_STATE',
      time: time,
      isPlaying: playerRef.current?.getInternalPlayer()?.getPlayerState?.() === 1 || true,
      timestamp: Date.now(),
      url: lastUrl.current
    });
  };

  const resyncToHost = () => {
    if (role === 'HOST') return;

    if (lastReceivedHostState.current && playerRef.current) {
      const state = lastReceivedHostState.current;
      const lastUpdated = state.startTimestamp || state.timestamp || Date.now();
      const currentTime = state.baseTime || state.time || 0;
      const timeDiff = (Date.now() - lastUpdated) / 1000;
      const targetTime = state.isPlaying ? currentTime + timeDiff : currentTime;

      console.log('Force resync to host:', targetTime);
      setSyncStatus('Syncing...');
      setInternalChange(1500);
      playerRef.current.seekTo(targetTime, 'seconds');
      setPlaying(state.isPlaying === true);
      setTimeout(() => setSyncStatus('Synced'), 1500);
    } else {
      socketService.sendMessage({ type: 'REQUEST_SYNC' });
    }
  };

  const handleManualSync = () => {
    if (role === 'HOST') {
      const currentTime = playerRef.current?.getCurrentTime() || 0;
      sendSyncState(currentTime);
      setSyncStatus('Broadcasting...');
      setTimeout(() => setSyncStatus('Synced'), 2000);
    } else {
      socketService.sendMessage({ type: 'REQUEST_SYNC' });
      resyncToHost();
    }
  };

  const handleSocketMessage = (data) => {
    switch (data.type) {
      case 'ROLE':
        setRole(data.role);
        break;
      case 'end_room':
        if (onRoomEnd) onRoomEnd();
        break;
      case 'host_changed':
        // If I am the new host, my role will be updated via 'ROLE' message sent specifically to me,
        // but we can also update local state here to be sure.
        if (data.new_host === userId) {
          setRole('HOST');
        } else {
          setRole('VIEWER');
        }
        break;
      case 'USER_LIST':
        setUsers(data.users);
        break;
      case 'CHAT_HISTORY':
        if (data.messages) {
          setMessages(data.messages.map(m => ({
            text: m.message || m.text,
            sender: m.name || m.sender,
            avatar: m.avatar,
            timestamp: m.timestamp || Date.now()
          })));
        }
        break;
      case 'SYNC_STATE':
        const state = data.state || data;
        if (state && role !== 'HOST') {
          lastReceivedHostState.current = state;
          if (state.url && state.url !== lastUrl.current) {
            applyVideoChange(state.url);
            return;
          }

          const performSync = () => {
            if (!isPlayerReady.current || !playerRef.current) {
              // Store for when player is ready
              const lastUpdated = state.startTimestamp || state.timestamp || Date.now();
              const currentTime = state.baseTime || state.time || 0;
              const timeDiff = (Date.now() - lastUpdated) / 1000;
              pendingSyncTime.current = state.isPlaying ? currentTime + timeDiff : currentTime;
              if (state.isPlaying !== undefined) setPlaying(state.isPlaying === true);
              return;
            }

            // 1. Calculate correct time
            const lastUpdated = state.startTimestamp || state.timestamp || Date.now();
            const currentTime = state.baseTime || state.time || 0;
            const timeDiff = (Date.now() - lastUpdated) / 1000;
            const finalTime = state.isPlaying ? currentTime + timeDiff : currentTime;

            const currentVideoTime = playerRef.current.getCurrentTime();

            // 2. Apply time safely if diff > 1s
            if (Math.abs(currentVideoTime - finalTime) > 1) {
              setSyncStatus('Syncing...');
              setInternalChange(1000);
              playerRef.current.seekTo(finalTime, 'seconds');

              // 3. WAIT for seeked before enforcing playback state
              setTimeout(() => {
                // 4. Enforce playback state
                setPlaying(state.isPlaying === true);
                setSyncStatus('Synced');
              }, 200);
            } else {
              // 4. Enforce playback state
              setPlaying(state.isPlaying === true);
              setSyncStatus('Synced');
            }
          };

          performSync();
          // 5. Minimal retry for reliability
          setTimeout(performSync, 1000);
        }
        break;
      case 'CHAT':
        setMessages(prev => [...prev, { text: data.message, sender: data.name, avatar: data.avatar, timestamp: Date.now() }]);
        break;
      case 'PLAY':
        if (role !== 'HOST') {
          const latency = (Date.now() - (data.timestamp || Date.now())) / 1000;
          setInternalChange(1000);
          setPlaying(true);
          playerRef.current?.seekTo(data.time + latency, 'seconds');
          if (lastReceivedHostState.current) {
            lastReceivedHostState.current.isPlaying = true;
            lastReceivedHostState.current.baseTime = data.time;
            lastReceivedHostState.current.startTimestamp = data.timestamp || Date.now();
          }
        }
        break;
      case 'PAUSE':
        if (role !== 'HOST') {
          setInternalChange(1000);
          setPlaying(false);
          playerRef.current?.seekTo(data.time, 'seconds');
          if (lastReceivedHostState.current) {
            lastReceivedHostState.current.isPlaying = false;
            lastReceivedHostState.current.baseTime = data.time;
            lastReceivedHostState.current.startTimestamp = data.timestamp || Date.now();
          }
        }
        break;
      case 'VIDEO_CHANGE':
        applyVideoChange(data.url);
        break;
      default:
        break;
    }
  };

  const applyVideoChange = (newUrl) => {
    if (lastUrl.current === newUrl) return;
    lastUrl.current = newUrl;
    setInternalChange(2000);
    setUrl(newUrl);
    setPlaying(true);
    setPlaybackRate(1);
    setTimeout(() => {
      if (playerRef.current && isPlayerReady.current) {
        playerRef.current.seekTo(0);
      }
    }, 500);
  };

  const handlePlay = () => {
    if (isInternalChange.current) return;
    if (role === 'HOST') {
      const now = Date.now();
      if (now - lastEventTime.current < 300) return;
      lastEventTime.current = now;

      const currentTime = playerRef.current?.getCurrentTime() || 0;
      socketService.sendMessage({ type: 'PLAY', time: currentTime, timestamp: Date.now() });
      sendSyncState(currentTime);
    } else {
      // Viewer clicked play - force resync to host
      resyncToHost();
    }
  };

  const handlePause = () => {
    if (isInternalChange.current) return;
    if (role !== "HOST") {
      resyncToHost();
      return;
    }
    const now = Date.now();
    if (now - lastEventTime.current < 300) return;
    lastEventTime.current = now;

    const currentTime = playerRef.current?.getCurrentTime() || 0;
    socketService.sendMessage({ type: 'PAUSE', time: currentTime, timestamp: Date.now() });
    sendSyncState(currentTime);
  };

  const handleSeek = (seconds) => {
    if (isInternalChange.current) return;
    if (role !== "HOST") {
      resyncToHost();
      return;
    }
    const now = Date.now();
    if (now - lastEventTime.current < 300) return;
    lastEventTime.current = now;

    sendSyncState(seconds);
  };

  const handleReady = () => {
    isPlayerReady.current = true;
    if (pendingSyncTime.current !== null) {
      setInternalChange(1500);
      playerRef.current?.seekTo(pendingSyncTime.current, 'seconds');
      pendingSyncTime.current = null;
    }
  };

  const handleVideoChange = (newUrl) => {
    if (role !== "HOST") return;
    applyVideoChange(newUrl);
    socketService.sendMessage({ type: 'VIDEO_CHANGE', url: newUrl, time: 0 });
  };

  const handleSendMessage = (message) => {
    const timestamp = Date.now();
    setMessages(prev => [...prev, { text: message, sender: username, avatar: avatar, timestamp }]);
    socketService.sendMessage({ type: 'CHAT', name: username, message, avatar, timestamp });
  };

  const handleTransferHost = (targetUserId) => {
    if (role !== 'HOST') return;
    socketService.sendMessage({ type: 'transfer_host', new_host: targetUserId });
  };

  const handleEndRoom = () => {
    if (role !== 'HOST') return;
    socketService.sendMessage({ type: 'end_room' });
  };

  const handleHostLeaving = () => {
    if (role !== 'HOST') return;
    socketService.sendMessage({ type: 'host_leaving' });
  };

  return {
    messages,
    setMessages,
    users,
    role,
    syncStatus,
    playbackRate,
    handlePlay,
    handlePause,
    handleSeek,
    handleReady,
    handleVideoChange,
    handleSendMessage,
    handleTransferHost,
    resyncToHost,
    handleManualSync,
    handleEndRoom,
    handleHostLeaving
  };
};
