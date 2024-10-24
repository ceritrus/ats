import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fetch, Post } from "../utils/Api";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { setID, setName, setEmail, setRole } from "../utils/UserSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
  const [currentUser, setUser] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login attempted with:", { username, password });
    Post(
      "/api/auth/token",
      "grant_type=password&username=" +
        username +
        "&password=" +
        password +
        "&scope=&client_id=string&client_secret=string"
    )
      .then((response) => {
        localStorage.setItem("token", response.data.access_token);
        const payload = JSON.parse(
          atob(response.data.access_token.split(".")[1])
        );
        dispatch(setID(payload.id));
        dispatch(setRole(payload.role));
        dispatch(setName(payload.sub));
        navigate("/profile");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setShowError(true);
        setError("Nom d'utilisateur ou mot de passe incorrect");
      });
  };

  return (
    <Container>
      <Navbar />
      <Row>
        <Col>
          <h1>Connexion</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {showError && error}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Nom d'utilisateur</Form.Label>
                  <Form.Control
                    type="username"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Connexion
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
