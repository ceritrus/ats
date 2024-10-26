import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Fetch } from "../utils/Api";
import { useParams } from "react-router-dom";

export default function Offer() {
  const [offer, setOffer] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const request = async () => {
      try {
        const response = await Fetch("/api/v1/job-offer/" + String(id));
        setOffer(response);
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
          <button>Postuler</button>
        </div>
        <section className="description">
          {offer.company_description} - 31000, Toulouse
        </section>
        <span>{offer.job_location}</span>
        <span> {parseFloat(offer.salary)}€</span>
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
