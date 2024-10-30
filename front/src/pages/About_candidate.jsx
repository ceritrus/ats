import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Fetch } from "../utils/Api";
import { useParams } from "react-router-dom";

export default function About_candidate() {
  const [candidate, setCandidate] = useState(null);
  const [application, setApplication] = useState(null);

  // Get ID from URL
  const params = useParams();
  const application_id = params.application_id;
  const candidate_id = params.candidate_id;

  // Fonction pour récupérer les données du candidat
  const fetchCandidateData = async () => {
    try {
      const candidateData = await Fetch(`/api/candidate/${candidate_id}`);
      setCandidate(candidateData.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du candidat :", error);
    }
  };

  // Fonction pour récupérer les données de la candidature
  const fetchApplicationData = async () => {
    try {
      Fetch(`/api/application/${application_id}`).then((applicationData) => { 
        setApplication(applicationData.data);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la candidature :", error);
    }
  };

  useEffect(() => {
    fetchCandidateData();
    fetchApplicationData();
  }, []);

  if (!candidate || !application) {
    return <div>Chargement des données...</div>;
  }

  return (
    <div>
      <div className="container">
        <div style={{ display: 'flex' }}>
          <div style={{ width: '40%' }}>
            <h1>A propos de {candidate.first_name} {candidate.last_name}</h1>
            <p>Date de candidature : <strong>{application.application_date}</strong></p>
            <p>Score de pertinence auto-calculé : <strong>{application.ats_prenotation}/5</strong></p>
            <p>Score de pertinence calculé par l'IA : <strong>{application.ats_final_note}/5</strong></p>
            <p>Message de motivation : <strong>{application.applicant_message}</strong></p>
          </div>
          <div style={{ width: '60%', height: '70vh' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
              <Viewer httpHeaders={{Authorization: 'Bearer ' + localStorage.getItem("token")}} fileUrl={'http://127.0.0.1:8000/api/download/' + application.cv_link} />
            </Worker>
          </div>
        </div>
      </div>
    </div>
  );
}
