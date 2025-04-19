import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import History from "./routes/History";
import Form from "./routes/Form";
import HistoryViewElement from "./routes/HistoryViewElement";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/istorija/" element={<History />} />
      </Routes>
      <Routes>
        <Route path="/forma/" element={<Form />} />
      </Routes>
      <Routes>
        <Route
          path="/istorija/:title/:date/:time"
          element={<HistoryViewElement />}
        />
      </Routes>
    </div>
  );
}

export default App;
