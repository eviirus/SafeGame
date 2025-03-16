import React from "react";
import { Helmet } from "react-helmet";
import Input from "../components/input-fields/input-fields";

function Home() {
  return (
    <>
      <Helmet>
        <title>Privacy policy analyzer</title>
      </Helmet>
      <Input />
    </>
  );
}

export default Home;
