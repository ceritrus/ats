import Navbar from "../components/Navbar";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function About_candidate() {
  const pdfUrl = 'http://127.0.0.1:8000/api/download/'; // racine du path pour les cv

  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{ display: 'flex'}}>
          <div style={{ width: '40%'}}>
          <h1>A propos de </h1>
            <p>Date de candidature : </p>
            <p>Score de pertinence : </p>
            <p>Message de motivation : </p>
            <p>Feedback sur la candidature : </p>
          </div>
          <div style={{ width: '60%', height: '70vh'}}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfUrl + "1/0/CV_EnzoOnesti.pdf"} />
            </Worker>
          </div>
        </div>
      </div>
    </div>
  );
}