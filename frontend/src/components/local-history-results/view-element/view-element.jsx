import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GeneratedResultFields from "../../generated-result-fields/generated-result-fields";
import DownloadPdf from "../../download-pdf/download-pdf";
import "./view-element.css";

function ViewElement() {
  const { title, date, time } = useParams();
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
      <h2 className="pp-title">{title}</h2>
      <GeneratedResultFields isVisible={true} result={result} />
      <DownloadPdf
        isVisible={true}
        result={result}
        policyTitle={title}
        date={date}
        time={time}
      />
    </div>
  );
}

export default ViewElement;
