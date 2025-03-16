import React from "react";
import { Helmet } from "react-helmet";
import Hero from "../components/hero/hero";
import NavigationBar from "../components/navigation-bar/nav-bar";

function History() {
  return (
    <>
      <Helmet>
        <title>Istorija</title>
      </Helmet>
      <NavigationBar />
      <Hero title={"Istorija"} />
    </>
  );
}

export default History;
