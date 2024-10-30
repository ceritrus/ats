import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fetch, Post } from "../utils/Api";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { setID, setName, setEmail, setRole } from "../utils/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@mui/material";

export default function Register() {
  const [currentUser, setUser] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Candidat");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.length === 0) {
      setShowError(true);
      setError(<p className="error">Nom d'utilisateur obligatoire</p>);
      return;
    } else if (password !== confirmPassword) {
      setShowError(true);
      setError(<p className="error">Les mots de passe ne correspondent pas</p>);
    } else if (email.length === 0) {
      setShowError(true);
      setError(<p className="error">L'email est obligatoire</p>);
    } else if (firstName.length === 0) {
      setShowError(true);
      setError(<p className="error">Le prénom est obligatoire</p>);
    } else if (lastName.length === 0) {
      setShowError(true);
      setError(<p className="error">Le nom est obligatoire</p>);
    } else if (phone.length === 0) {
      setShowError(true);
      setError(<p className="error">Le téléphone est obligatoire</p>);
    } else {
      setShowError(false);
      Post("/api/user/create", {
        username: username,
        password: password,
        email: email,
      })
        .then((response) => {
          console.log("User created:", response.data);
          if (role === "Candidat") {
            Post("/api/candidate/create", {
              id_user: response.data.id,
              first_name: firstName,
              last_name: lastName,
              phone_number: phone,
              cv_link: "undefined",
            })
              .then((response) => {
                console.log(role + "created:", response.data);
              })
              .catch((error) => {
                console.error("Error creating candidate:", error);
              });
          } else {
            Post("/api/recruiter/create", {
              id_user: response.data.id,
              first_name: firstName,
              last_name: lastName,
              phone_number: phone,
            })
              .then((response) => {
                console.log(role + "created:", response.data);
              })
              .catch((error) => {
                console.error("Error creating recruiter:", error);
              });
          }
          navigate("/login");
        })
        .catch((error) => {
          console.error("Login failed:", error);
          setShowError(true);
          setError(
            <p className="error">Nom d'utilisateur ou mot de passe incorrect</p>
          );
        });
    }
  };

  return (
    <Container className="login">
      <Row>
        <Col>
          <h1>Créer un compte</h1>
        </Col>
      </Row>
      <Row>
        <Form.Group className="mb-3 role-toggle" controlId="formBasicRole">
          <span>
            <Form.Label
              className={role === "Candidat" ? "active-role" : "inactive-role"}
            >
              Candidat
            </Form.Label>
            <Switch
              onChange={(e) => {
                setRole(e.target.checked ? "Recruteur" : "Candidat");
              }}
              size="large"
            />
            <Form.Label
              className={role === "Recruteur" ? "active-role" : "inactive-role"}
            >
              Recruteur
            </Form.Label>
          </span>
        </Form.Group>
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Nom d'utilisateur:</Form.Label>
                  <Form.Control
                    type="username"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Entrez votre adresse mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicFirstName">
                  <Form.Label>Prénom:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez votre prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicLastName">
                  <Form.Label>Nom:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez votre nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Label>Téléphone:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez votre numéro de téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mot de passe:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formBasicPasswordConfirmation"
                >
                  <Form.Label>Confirmer le mot de passe:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
                {showError && error}
                <Container className="login-footer">
                  <Button variant="primary" type="submit" className="w-100">
                    Valider
                  </Button>
                </Container>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
