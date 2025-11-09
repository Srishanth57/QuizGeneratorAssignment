import Home from "./components/Home";
import { Navigate, Route, Routes } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
