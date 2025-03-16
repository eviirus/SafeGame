import React from "react";
import { Helmet } from "react-helmet";
import Input from "../components/input-fields/input-fields";
import Hero from "../components/hero/hero";

function Home() {
  return (
    <>
      <Helmet>
        <title>Privatumo politikos analizavimo sistema</title>
      </Helmet>
      <Hero title={"Privatumo politikos analizavimo sistema"} />
      <Input />
    </>
  );
}

export default Home;
