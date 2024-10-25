import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Fetch, Put } from "../utils/Api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { setID, setName, setEmail, setRole } from "../utils/UserSlice";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";

export default function ProfileEdit() {
  const [currentUser, setUser] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setCurrentEmail] = useState(user.email ? user.email : "");

  useEffect(() => {
    if (!user.id) {
      navigate("/login", { state: { from: "/profile" } });
    } else {
      Fetch("/api/user/" + user.id)
        .then((response) => {
          setUser(response.data);
          dispatch(setID(response.data.id));
          dispatch(setName(response.data.username));
          dispatch(setEmail(response.data.email));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user.id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    Put("/api/user/" + user.id, {
      email: email,
      password: currentUser.password,
      username: currentUser.username,
    })
      .then((response) => {
        dispatch(setEmail(email));
        navigate("/profile");
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <Container>
      <Navbar />
      <Container className="profile">
        <Row className="header">
          <Col>
            <h1>Modifier le profil</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>
                  <strong>Nom d'utilisateur:</strong> {user?.email}
                </Card.Text>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Card.Text>
                    <strong>Role:</strong> {user?.role}
                  </Card.Text>
                  <Button variant="primary" type="submit" className="w-100">
                    Valider
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
