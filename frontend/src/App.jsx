import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Resume from "./pages/Resume";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import ProjectDetail from "./components/ProjectDetail";
import Bg from "./components/Bg";

export default function App() {
  return (
    <BrowserRouter>
          <div className="min-h-screen bg-black relative">
        {/* Fireworks background */}
        <Bg shardCount={40} maxSize={60} minSize={20} />

        <Navbar />
        <main className="p-6 relative z-10 app-root">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
