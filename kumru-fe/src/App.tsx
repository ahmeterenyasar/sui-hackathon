import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatedBackground } from "./AnimatedBackground";
import { Navbar } from "./Navbar";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { CreateProfile } from "./pages/CreateProfile";
import { LinkManager } from "./pages/LinkManager";
import { Settings } from "./pages/Settings";
import { Explore } from "./pages/Explore";
import { PublicProfile } from "./pages/PublicProfile";

function App() {
  return (
    <Router>
      <AnimatedBackground />
      <Navbar />
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateProfile />} />
        <Route path="/links" element={<LinkManager />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
