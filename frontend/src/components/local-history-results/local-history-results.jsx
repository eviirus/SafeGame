import React, { useEffect, useState } from "react";
import emptyIcon from "../../assets/images/empty.png";
import "./local-history-results.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LocalHistoryResults() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(storedHistory);
  }, []);

  const redirectToRecord = (title, date, time) => {
    navigate(
      `/istorija/${encodeURIComponent(title)}/${encodeURIComponent(
        date
      )}/${encodeURIComponent(time)}`
    );
  };

  const removeRecord = (date, time) => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];

    const updatedHistory = storedHistory.filter(
      (item) => item.date !== date || item.time !== time
    );

    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    toast.success("Įrašas pašalintas sėkmingai!");
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
                <p className="title">{element.title}</p>
                <div className="subTitle">
                  <p>{element.date}</p>
                  <div className="separator"></div>
                  <p>{element.time}</p>
                </div>
              </div>
              <div className="buttons">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => removeRecord(element.date, element.time)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
                      stroke="#cecece"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    redirectToRecord(element.title, element.date, element.time)
                  }
                >
                  Peržiūrėti
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocalHistoryResults;