import React, { useEffect, useState } from "react";
import emptyIcon from "../../assets/images/empty.png";
import "./local-history-results.css";
import { useNavigate } from "react-router-dom";

function LocalHistoryResults() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(storedHistory);
  }, []);

  const redirectToRecord = (date, time) => {
    navigate(
      `/istorija/${encodeURIComponent(date)}/${encodeURIComponent(time)}`
    );
  };

  return (
    <div className="history-container">
      {history.length === 0 ? (
        <div
          className={`empty-indicator ${history.length === 0 ? "show" : ""}`}
        >
          <img src={emptyIcon} loading="lazy" alt="Empty" />
          <p>Istorija tuščia, atlikitė analizę, kad pamatyti įrašus</p>
          <a href="/">Atlikti analizę</a>
        </div>
      ) : (
        <div className="content">
          {history.map((element, index) => (
            <div className="item" key={index}>
              <div className="heading">
                <p className="title">Privatumo politikos pavadinimas</p>
                <div className="subTitle">
                  <p>{element.date}</p>
                  <div className="separator"></div>
                  <p>{element.time}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => redirectToRecord(element.date, element.time)}
              >
                Peržiūrėti
              </button>
              {/* <pre>{JSON.stringify(element.result, null, 2)}</pre> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocalHistoryResults;
