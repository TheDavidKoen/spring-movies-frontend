import { useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';

const Reviews = ({ getMovieData, movie, reviews, setReviews, isLoggedIn }) => {
  const revText = useRef();
  let params = useParams();
  const movieId = params.movieId;

  useEffect(() => {
    getMovieData(movieId);
  }, [movieId]);

  const addReview = async (e) => {
    e.preventDefault();
    const rev = revText.current.value;
    const userAlias = localStorage.getItem('userAlias');

    if (!rev.trim()) {
        alert('Review cannot be empty.');
        return;
    }

    try {
        const response = await api.post('/api/v1/reviews', {
            reviewBody: rev,
            imdbId: movieId,
            alias: userAlias,
        });

        const updatedReviews = [...reviews, response.data];
        revText.current.value = '';
        setReviews(updatedReviews);
    } catch (err) {
        console.error(err);
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
                  <strong>{r.alias}</strong>: {r.body} {/* Display the alias */}
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