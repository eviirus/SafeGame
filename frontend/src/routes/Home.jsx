import React from "react";
import { Helmet } from "react-helmet";

function Home() {
  return (
    <>
      <Helmet>
        <title>Privacy policy analyzer</title>
      </Helmet>
      <h1>test</h1>
      <div
        style={{
          backgroundColor: "var(--primary-color)",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        This is a div with primary background color.
      </div>
    </>
  );
}

export default Home;
