import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';

const LOADING_MESSAGES = [
  "Getting things ready…",
  "Starting the party…",
  "Joining the room…",
  "Syncing with host…",
  "Almost showtime…",
  "Preparing your watch party…",
  "Loading your experience…",
  "Just a moment…",
  "Grab your popcorn…",
  "Warming up the stream…"
];

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [loadingMessage] = useState(() => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1000);
    const removeLoader = setTimeout(() => setShowLoader(false), 1500);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeLoader);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-[100dvh] bg-slate-950 text-slate-50">
        {showLoader && (
          <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#050816] transition-opacity duration-700 ease-in-out ${isAppLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-1000">
              <div className="relative">
                {/* Icon wrapper */}
                <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.15)] rotate-3 backdrop-blur-md">
                  <svg className="w-12 h-12 text-blue-500 ml-1 fill-cyan-400/20 drop-shadow-lg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                </div>
                {/* Orbiting element */}
                <div className="absolute -inset-4 border border-white/5 rounded-[2.5rem] animate-[spin_4s_linear_infinite]">
                  <div className="absolute -top-1 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                </div>
                <div className="absolute -inset-8 border border-white/[0.02] rounded-[3rem] animate-[spin_7s_linear_infinite_reverse]">
                  <div className="absolute bottom-4 -right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
                  Watch<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Party</span>
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] animate-in fade-in duration-500">{loadingMessage}</span>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
