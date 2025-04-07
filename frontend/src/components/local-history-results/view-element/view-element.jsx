import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GeneratedResultFields from "../../generated-result-fields/generated-result-fields";
import "./view-element.css";

function ViewElement() {
  const { date, time } = useParams();
  const [result, setResult] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history"));

    const matchedRecord = storedHistory.find(
      (element) => element.date === date && element.time === time
    );

    if (matchedRecord) {
      setResult(matchedRecord.result);
    }
  }, []);

  return (
    <div className="history-element">
      <h2 className="pp-title">Privatumo politikos pavadinimas</h2>
      <GeneratedResultFields isVisible={true} result={result} />
    </div>
  );
}

export default ViewElement;
