import React, { useEffect, useRef, useState } from 'react';
import api from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';

const Reviews = ({ getMovieData, movie, reviews, setReviews, isLoggedIn }) => {
  const revText = useRef();
  let params = useParams();
  const movieId = params.movieId;

  const [localReviewData, setLocalReviewData] = useState([]);

  // Load reviews from localStorage on initial component render
  useEffect(() => {
    const localReviews = JSON.parse(localStorage.getItem(`reviews-${movieId}`)) || [];
    if (localReviews.length) {
      setLocalReviewData(localReviews);
    } else {
      getMovieData(movieId);
    }
  }, [movieId]);

  // Persist reviews to localStorage whenever `reviews` are updated
  useEffect(() => {
    localStorage.setItem(`reviews-${movieId}`, JSON.stringify(localReviewData));
  }, [localReviewData, movieId]);

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

      console.log('Server response:', response.data); // Debugging line

      const updatedReviews = [
        ...localReviewData,
        {
          alias: response.data?.alias || userAlias,
          reviewBody: response.data?.reviewBody || rev,
        },
      ];

      setLocalReviewData(updatedReviews);
      alert('Review submitted successfully!');
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
          {localReviewData?.map((r, index) => (
            <React.Fragment key={index}>
              <Row>
                <Col>
                  {/* Ensure the alias is correctly rendered */}
                  {r.alias ? (
                    <strong>{r.alias}</strong>
                  ) : (
                    <strong>Anonymous</strong> // Fallback if alias is undefined
                  )}
                  : {r.reviewBody}
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