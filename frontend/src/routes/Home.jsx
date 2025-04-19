import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import Input from "../components/input-fields/input-fields";
import Hero from "../components/hero/hero";
import NavigationBar from "../components/navigation-bar/nav-bar";
import GeneratedResultFields from "../components/generated-result-fields/generated-result-fields";
import DownloadPdf from "../components/download-pdf/download-pdf";
import Footer from "../components/footer/footer";

import QuestionsInput from "../components/questions-input/questions-input";
import "../components/styles/homeComponentStyles.css";

function Home() {
  const [resultReceived, setResultReceived] = useState(false);
  const [generatedResult, setGeneratedResult] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [policyTitle, setPolicyTitle] = useState("");
  const resultSectionRef = useRef(null);

  const handleResultReceived = (status) => {
    setResultReceived(status);
  };

  const handleGeneratedResult = (result) => {
    setGeneratedResult(result);
  };

  const date = () => {
    return new Date().toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const time = () => {
    return new Date().toLocaleTimeString("lt-LT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    if (resultReceived && generatedResult.length > 0) {
      const newHistoryEntry = {
        title: policyTitle,
        date: date(),
        time: time(),
        result: generatedResult,
      };

      const existingHistory = JSON.parse(localStorage.getItem("history")) || [];
      const updatedHistory = [newHistoryEntry, ...existingHistory];

      localStorage.setItem("history", JSON.stringify(updatedHistory));
    }
  }, [resultReceived, generatedResult]);

  useEffect(() => {
    if (
      resultReceived &&
      generatedResult.length > 0 &&
      resultSectionRef.current
    ) {
      setTimeout(() => {
        resultSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [resultReceived, generatedResult]);

  return (
    <>
      <Helmet>
        <title>Privatumo politikos analizavimo sistema</title>
      </Helmet>
      <NavigationBar />
      <Hero title={"Privatumo politikos analizavimo sistema"} />
      <div className="input-container">
        <QuestionsInput
          selectedCheckboxes={selectedCheckboxes}
          setSelectedCheckboxes={setSelectedCheckboxes}
        />
        <Input
          handleResultReceived={handleResultReceived}
          handleGeneratedResult={handleGeneratedResult}
          selectedCheckboxes={selectedCheckboxes}
          setPolicyTitle={setPolicyTitle}
        />
      </div>
      <div ref={resultSectionRef}>
        <GeneratedResultFields
          isVisible={resultReceived}
          result={generatedResult}
        />
      </div>
      <DownloadPdf
        isVisible={resultReceived}
        result={generatedResult}
        policyTitle={policyTitle}
        date={date()}
        time={time()}
      />
      <Footer />
    </>
  );
}

export default Home;
