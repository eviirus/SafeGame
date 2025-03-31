import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Input from "../components/input-fields/input-fields";
import Hero from "../components/hero/hero";
import NavigationBar from "../components/navigation-bar/nav-bar";
import GeneratedResultFields from "../components/generated-result-fields/generated-result-fields";
import Footer from "../components/footer/footer";

function Home() {
  const [resultReceived, setResultReceived] = useState(false);
  const [generatedResult, setGenratedResult] = useState([]);

  const handleResultReceived = (status) => {
    setResultReceived(status);
  };

  const handleGeneratedResult = (result) => {
    setGenratedResult(result);
  };

  return (
    <>
      <Helmet>
        <title>Privatumo politikos analizavimo sistema</title>
      </Helmet>
      <NavigationBar />
      <Hero title={"Privatumo politikos analizavimo sistema"} />
      <Input
        handleResultReceived={handleResultReceived}
        handleGeneratedResult={handleGeneratedResult}
      />
      <GeneratedResultFields
        isVisible={resultReceived}
        result={generatedResult}
      />
      <Footer />
    </>
  );
}

export default Home;
