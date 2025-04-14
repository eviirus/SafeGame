import React from "react";
import { Helmet } from "react-helmet";
import Hero from "../components/hero/hero";
import NavigationBar from "../components/navigation-bar/nav-bar";
import ReviewForm from "../components/review-form/review-form";

function Form() {
  return (
    <>
      <Helmet>
        <title>Forma</title>
      </Helmet>
      <NavigationBar />
      <Hero title={"Forma"} />
      <ReviewForm />
    </>
  );
}

export default Form;
