import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import LoadingManager from './components/loading/LoadingManager';

function App() {
  return (
    <Router>
      <LoadingManager>
        <div className="min-h-[100dvh] bg-[#070B17] text-slate-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </div>
      </LoadingManager>
    </Router>
  );
}

export default App;
