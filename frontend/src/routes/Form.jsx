import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Hero from "../components/hero/hero";
import NavigationBar from "../components/navigation-bar/nav-bar";
import ReviewForm from "../components/review-form/review-form";
import ShowAllReviews from "../components/review-form/show-all-reviews/show-all-reviews";
import Footer from "../components/footer/footer";
import "../components/styles/formComponentStyles.css";
import axios from "axios";
import { toast } from "react-toastify";

function Form() {
  const [reviews, setReviews] = useState([]);

  const fetchReview = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/endpoints/getAllReviews"
      );

      setReviews(response.data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  return (
    <>
      <Helmet>
        <title>Palikite atsiliepimą</title>
      </Helmet>
      <NavigationBar />
      <Hero title={"Palikite atsiliepimą"} />
      <div className="reviews-section">
        <ReviewForm onReviewSubmitted={fetchReview} />
        <ShowAllReviews reviews={reviews} />
      </div>
      <Footer />
    </>
  );
}

export default Form;