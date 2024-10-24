import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Fetch } from "../utils/Api";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { setID, setName, setEmail, setRole } from "../utils/UserSlice";

export default function Profile() {
  const [currentUser, setUser] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.id) {
      navigate("/login", { state: { from: "/profile" } });
    } else {
      console.log("Fetching user data for:", user.id);
      Fetch("/api/user/" + user.id)
        .then((response) => {
          //   console.log(response.data);
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

  return (
    <Container>
      <Navbar />
      <Row>
        <Col>
          <h1>Profile</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{user?.name}</Card.Title>
              <Card.Text>
                <strong>Email:</strong> {user?.email}
              </Card.Text>
              <Card.Text>
                <strong>Role:</strong> {user?.role}
              </Card.Text>
              <Link to={"/profile/edit"} className="btn btn-primary">
                Edit
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
