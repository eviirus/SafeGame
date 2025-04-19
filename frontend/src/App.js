import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import History from "./routes/History";
import Form from "./routes/Form";
import HistoryViewElement from "./routes/HistoryViewElement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <ToastContainer />
    </div>
  );
}

export default App;
