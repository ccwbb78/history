import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Teachers from "@/pages/Teachers";
import Students from "@/pages/Students";
import Checking from "@/pages/Checking";
import Man from "@/pages/Man";
import End from "@/pages/End";
import ProtectedRoute from "@/components/ProtectedRoute";
import ClickSpark from "@/components/ClickSpark";

export default function App() {
  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
      className="min-h-screen"
    >
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route path="/checking" element={<Checking />} />
        <Route path="/man" element={<Man />} />
        <Route path="/end" element={<End />} />
      </Routes>
    </Router>
    </ClickSpark>
  );
}
