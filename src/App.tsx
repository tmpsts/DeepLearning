import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Project4Page, Project5Page, HomePage } from "./pages";

export default function App() {
  return (
    <Router basename="/DeepLearning">
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project4" element={<Project4Page />} />
          <Route path="/project5" element={<Project5Page />} />
        </Routes>
      </div>
    </Router>
  );
}
