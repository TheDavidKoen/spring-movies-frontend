import React, { useEffect, useRef, useState } from 'react';
import api from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';

const Reviews = ({ getMovieData, movie, reviews, setReviews, isLoggedIn }) => {
  const revText = useRef();
  let params = useParams();
  const movieId = params.movieId;

  // Fetch reviews from the backend
  const getReviews = async (movieId) => {
    try {
      const response = await api.get(`/api/v1/reviews/${movieId}`);
      setReviews(response.data); // Update state with fetched reviews
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    getReviews(movieId); // Fetch reviews when the component is mounted
    getMovieData(movieId); // Fetch movie data (e.g., poster) when the component is mounted
  }, [movieId]);

  const addReview = async (e) => {
    e.preventDefault();
    const rev = revText.current.value;
    const userAlias = localStorage.getItem('userAlias');
    const token = localStorage.getItem('token');

    if (!rev.trim()) {
      alert('Review cannot be empty.');
      return;
    }

    try {
      const response = await api.post(
        '/api/v1/reviews',
        { reviewBody: rev, imdbId: movieId, alias: userAlias },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update reviews in the state without reloading
      const updatedReviews = [
        ...reviews,
        {
          alias: response.data?.alias || userAlias,
          reviewBody: response.data?.reviewBody || rev,
        },
      ];

      setReviews(updatedReviews);
      alert('Review submitted successfully!');
      revText.current.value = ''; // Clear the review text area
    } catch (err) {
      console.error('Error posting review:', err.response?.data || err.message);
      alert('Failed to submit review.');
    }
  };

  return (
    <Container>
      <Row>
        <Col><h3>Reviews</h3></Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <img src={movie?.poster} alt="" />
        </Col>
        <Col>
          {isLoggedIn && (
            <>
              <Row>
                <Col>
                  <ReviewForm handleSubmit={addReview} revText={revText} labelText="Write a Review?" />
                </Col>
              </Row>
              <Row>
                <Col>
                  <hr />
                </Col>
              </Row>
            </>
          )}
          {reviews?.map((r, index) => (
            <React.Fragment key={index}>
              <Row>
                <Col>
                  <strong>{r.alias || "Anonymous"}</strong>: {r.reviewBody}
                </Col>
              </Row>
              <Row>
                <Col>
                  <hr />
                </Col>
              </Row>
            </React.Fragment>
          ))}
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default Reviews;