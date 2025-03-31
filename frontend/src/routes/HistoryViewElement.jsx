import React from "react";
import { Helmet } from "react-helmet";
import Hero from "../components/hero/hero";
import NavigationBar from "../components/navigation-bar/nav-bar";
import ViewElement from "../components/local-history-results/view-element/view-element";
import Footer from "../components/footer/footer";

function HistoryViewElement() {
  return (
    <>
      <Helmet>
        <title>Įrašo peržiūra</title>
      </Helmet>
      <NavigationBar />
      <Hero title={"Įrašo peržiūra"} />
      <ViewElement />
      <Footer />
    </>
  );
}

export default HistoryViewElement;
