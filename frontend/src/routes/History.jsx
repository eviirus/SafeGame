import React from "react";
import { Helmet } from "react-helmet";
import Hero from "../components/hero/hero";
import NavigationBar from "../components/navigation-bar/nav-bar";
import LocalHistoryResults from "../components/local-history-results/local-history-results";


function History() {
  return (
    <>
      <Helmet>
        <title>Istorija</title>
      </Helmet>
      <NavigationBar />
      <Hero title={"Istorija"} />
      <LocalHistoryResults />
    </>
  );
}

export default History;
