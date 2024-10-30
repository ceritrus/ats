import React, { useState, useEffect } from "react";
import { Post, Fetch } from "../utils/Api";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const columns = [
  { field: "company_description", headerName: "ENTREPRISE", minWidth: 170 },
  { field: "title", headerName: "TITRE", minWidth: 300 },
  { field: "application_date", headerName: "DATE DE CANDIDATURE", minWidth: 170},
  { field: "ats_final_note", headerName: "NOTE SYSTÈME", minWidth: 170 },
  { field: "ats_prenotation", headerName: "NOTE AGENT IA", minWidth: 170 },
  { field: "end_of_application", headerName: "FIN DE L'OFFRE", minWidth: 170 },
  { field: "applicant_message", headerName: "MESSAGE", minWidth: 300 },
];
const paginationModel = { page: 0, pageSize: 10 };

export default function CandidateOffers() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user.id) {
      navigate("/login", { state: { from: "/profile" } });
    } else {
      Post("/api/application/search_paginated", {
        query: {
          id_candidate: user.role_id,
        },
        fields: ["id_candidate"],
        limit: 50,
        offset: 0,
        exact: true,
        sort_by: "ats_final_note",
        order: "asc"
      }).then((response) => {
        for (let i = 0; i < response.data.items.length; i++) {
          Fetch("/api/job-offer/" + response.data.items[i].id_job_offer)
            .then((innerResponse) => {
              response.data.items[i].company_description =
                innerResponse.data.company_description;
              response.data.items[i].title = innerResponse.data.title;
              response.data.items[i].end_of_application =
                innerResponse.data.end_of_application;
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        }
        setApplications(response.data.items);
      });
    }
  }, [user.id]);

  return (
    <div>
      <div className="offers">
        <h1>Mes Candidatures</h1>
        <Paper sx={{ height: "90%", width: "100%" }}>
          <DataGrid
            rows={applications}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 50]}
            sx={{ border: 0 }}
            disableColumnSelector={true}
            onCellClick={(cell) => {
              navigate(`/offers/${cell.row.id}`);
            }}
          />
        </Paper>
      </div>
    </div>
  );
}
