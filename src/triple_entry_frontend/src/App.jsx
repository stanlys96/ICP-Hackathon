import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Home from "./Home";
// import Dashboard from "./Dashboard";
// import Role from "./Role";
import LandingPage from "./LandingPage";
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/landing" element={<LandingPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/role" element={<Role />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
