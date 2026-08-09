import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/Search";
import CollegeView from "./pages/CollegeView";
function App() {
  return (
    <Routes>
      {" "}
      <Route path="/" element={<SearchPage />} />{" "}
      <Route path="/colleges" element={<CollegeView />} />{" "}
    </Routes>
  );
}
export default App;
