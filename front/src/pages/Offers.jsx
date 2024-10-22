import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Fetch } from "../utils/Api";

export default function Offers() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const request = async () => {
      try {
        console.log("Fetching data...");
        const response = await Fetch("/api/v1/job-offer");
        console.log("Offers: ", response);
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    request();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="offers">
        <h1>Offres</h1>
        <table>
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Date de publication</th>
              <th>Date limite</th>
            </tr>
          </thead>
          <tbody>
            {data.map((offer) => (
              <tr key={offer.id}>
                <td>{offer.company_description}</td>
                <td>{offer.title}</td>
                <td>{offer.description}</td>
                <td>{String(offer.posted_date).replaceAll("-", "/")}</td>
                <td>{String(offer.end_of_application).replaceAll("-", "/")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
