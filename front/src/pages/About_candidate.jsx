import Navbar from "../components/Navbar";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function About_candidate() {
  const pdfUrl = '/path/to/your/pdf-file.pdf'; // Replace with your PDF file path

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>A propos de </h1>
        <div style={{ display: 'flex'}}>
          <div style={{ width: '40%'}}>
            <p>Date de candidature : </p>
            <p>Score de pertinence : </p>
            <p>Message de motivation : </p>
            <p>Feedback sur la candidature : </p>
          </div>
          <div style={{ width: '60%', height: '100vh' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfUrl} />
            </Worker>
          </div>
        </div>
      </div>
    </div>
  );
}