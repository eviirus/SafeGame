import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Input from "../components/input-fields/input-fields";
import Hero from "../components/hero/hero";
import NavigationBar from "../components/navigation-bar/nav-bar";
import GeneratedResultFields from "../components/generated-result-fields/generated-result-fields";
import Footer from "../components/footer/footer";
import LoadingSpinner from "../components/loading-spinner/loading-spinner";
import QuestionsInput from "../components/questions-input/questions-input";
import "../components/styles/homeComponentStyles.css";

function Home() {
  const [resultReceived, setResultReceived] = useState(false);
  const [generatedResult, setGenratedResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleResultReceived = (status) => {
    setResultReceived(status);
  };

  const handleGeneratedResult = (result) => {
    setGenratedResult(result);
  };

  useEffect(() => {
    if (resultReceived && generatedResult.length > 0) {
      const newHistoryEntry = {
        date: new Date().toLocaleDateString("lt-LT", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        time: new Date().toLocaleTimeString("lt-LT", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        result: generatedResult,
      };

      const existingHistory = JSON.parse(localStorage.getItem("history")) || [];
      const updatedHistory = [newHistoryEntry, ...existingHistory];

      localStorage.setItem("history", JSON.stringify(updatedHistory));
      console.log(JSON.parse(localStorage.getItem("history")));
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
        <QuestionsInput />
        <Input
          handleResultReceived={handleResultReceived}
          handleGeneratedResult={handleGeneratedResult}
          setIsLoading={setIsLoading}
        />
      </div>
      {isLoading && <LoadingSpinner />}
      <GeneratedResultFields
        isVisible={resultReceived}
        result={generatedResult}
      />
      <Footer />
    </>
  );
}

export default Home;
