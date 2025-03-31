import React, { useEffect, useState } from "react";

function LocalHistoryResults() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(storedHistory);
  }, []);
  return (
    <div className="history-container">
      {history.length === 0 ? (
        <p>Istorija tuščia, atlikitė analizę, kad pamatyti įrašus</p>
      ) : (
        <ul>
          {history.map((element, index) => (
            <li key={index}>
              <p>{element.date}</p>
              <p>{element.time}</p>
              <pre>{JSON.stringify(element.result, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocalHistoryResults;