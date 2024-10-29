import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Fetch } from "../utils/Api";
import { useNavigate, useParams } from "react-router-dom";

export default function Offer() {
  const [offer, setOffer] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const request = async () => {
      try {
        const response = await Fetch("/api/job-offer/" + String(id));
        setOffer(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    request();
  }, []);

  return (
    <div>
      <div className="offer">
        <div className="header">
          <h1>{offer.title}</h1>
          <button
            onClick={() => {
              navigate("/apply/" + id);
            }}
          >
            Postuler
          </button>
        </div>
        <section className="description">{offer.company_description}</section>
        <span>Lieux: {offer.job_location}</span>
        <span>Salaire: {parseFloat(offer.salary)}€</span>
        <span>
          Expérience requise: {offer.experience}{" "}
          {offer.experience <= 1 ? "an" : "ans"}
        </span>
        <span>Diplôme requis: {offer.graduate}</span>
        <br />
        <br />
        <section className="description">{offer.description}</section>
        <br />
        <section>Publié le {offer.posted_date}</section>
        <section>Disponible jusqu'au {offer.end_of_application}</section>
      </div>
    </div>
  );
}
