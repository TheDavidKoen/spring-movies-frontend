import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import api from '../../api/axiosConfig';

const Auth = ({ isRegister, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        await api.post('/api/v1/auth/register', { email, password });
        alert('Registration successful! You can now log in.');
      } else {
        const response = await api.post('/api/v1/auth/login', { email, password });

        console.log('Login Response:', response.data); // Debugging the response

        const { token, userAlias } = response.data;

        if (token) {
          localStorage.setItem('token', token);
          console.log('Token saved to localStorage:', localStorage.getItem('token'));
          console.log('Token saved at:', new Date().toISOString());
        
          // Ensure Axios has time to pick up the saved token
          setTimeout(() => {
            setIsLoggedIn(true);
            alert('Login successful!');
          }, 100);
        } else {
          console.error('No token received to save.');
        }

        localStorage.setItem('userAlias', userAlias);

        setIsLoggedIn(true);
        alert('Login successful!');
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'An error occurred.';
      alert(message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3>{isRegister ? 'Register' : 'Login'}</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {isRegister && (
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
            )}

            <Button variant="primary" type="submit">
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Auth;