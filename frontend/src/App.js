import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import History from "./routes/History";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/istorija/" element={<History />} />
      </Routes>
    </div>
  );
}

export default App;
