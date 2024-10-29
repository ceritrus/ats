import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fetch, Post, Put } from "../utils/Api";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { setID, setName, setEmail, setRole } from "../utils/UserSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Apply() {
  const [fileName, setFileName] = useState("Upload Boundary File");
  const navigate = useNavigate();
  const [offer, setOffer] = useState({});
  const [resume, setResume] = useState(null);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [needsValidation, setNeedsValidation] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [applicationID, setApplicationID] = useState(null);

  useEffect(() => {
    if (!user.id) {
      navigate("/login", { state: { from: "/profile" } });
    } else {
      const request = async () => {
        try {
          const response = await Fetch("/api/job-offer/" + String(id));
          setOffer(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      request();
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    if (!resume) {
      setShowError(true);
      setError(<p className="error">Veuillez sélectionner un CV</p>);
    } else if (resume.size > 5000000) {
      setShowError(true);
      setError(<p className="error">Fichier trop volumineux</p>);
    } else if (resume.type !== "application/pdf") {
      setShowError(true);
      setError(<p className="error">Fichier non supporté</p>);
    } else {
      const fileData = new FormData();
      fileData.append("file", resume);
      if (needsValidation) {
        Put("/api/application/" + applicationID, {
          status: "Processing",
        })
          .then((innerResponse) => {
            navigate("/offers/" + id);
          })
          .catch((error) => {
            setShowError(true);
            setError(
              <p className="error">
                Erreur lors de la mise à jour de la candidature
              </p>
            );
          });
      } else {
        Post("/api/upload", fileData)
          .then((response) => {
            Post("/api/application/create", {
              id_job_offer: id,
              id_candidate: user.id,
              cv_link: response.data.cv_name,
              applicant_message: message,
            })
              .then((innerResponse) => {
                setShowError(false);
                setShowNote(true);
                setNeedsValidation(true);
                setApplicationID(innerResponse.data.id);
                setNote(
                  <div className="note">
                    <p>
                      Prénotation du système:{" "}
                      <b>{innerResponse.data.ats_prenotation} / 5.0</b>
                    </p>
                    <p>
                      Note de notre IA:{" "}
                      <b>{innerResponse.data.ats_final_note} / 5.0</b>
                    </p>
                  </div>
                );
              })
              .catch((error) => {
                setShowError(true);
                setError(
                  <p className="error">Erreur lors de l'envoie candidature</p>
                );
                console.error("Error posting data:", error);
              });
          })
          .catch((error) => {
            setShowError(true);
            setError(<p className="error">Erreur lors de l'upload du CV</p>);
            console.error("Error posting data:", error);
          });
      }
    }
  };

  const handleChange = (event) => {
    setShowError(false);
    setShowNote(false);
    setNeedsValidation(false);
    setApplicationID(null);
  };

  return (
    <Container className="apply">
      <h1>Candidature simplifiée</h1>
      <section className="description">
        {offer.title} - {offer.job_location}
      </section>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3 applyGroup">
          <Form.Label>Veuillez sélectionner votre CV:</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              setResume(e.target.files[0]);
              handleChange(e);
            }}
            placeholder="Selectionner un fichier"
          />
        </Form.Group>
        <Form.Group
          className="mb-3 applyGroup"
          controlId="exampleForm.ControlTextarea1"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        >
          <Form.Label>Message optionel pour le recruteur:</Form.Label>
          <Form.Control as="textarea" rows={4} />
        </Form.Group>
        {showNote && note}
        {showError && error}
        <Button variant="primary" type="submit">
          {needsValidation
            ? "Confirmer la candidature"
            : "Envoyer pour validation"}
        </Button>
      </Form>
    </Container>
  );
}
