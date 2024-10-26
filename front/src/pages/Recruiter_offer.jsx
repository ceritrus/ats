import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Post } from "../utils/Api";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

const columns = [
    { field: "title", headerName: "TITRE", minWidth: 300 },
    { field: "description", headerName: "DESCRIPTION", minWidth: 600 },
    { field: "posted_date", headerName: "PUBLIÉ LE", minWidth: 170 },
    { field: "end_of_application", headerName: "DATE LIMITE", minWidth: 170 },
    { field: "job_location", headerName: "LIEU", minWidth: 170 },
    { field: "salary", headerName: "SALAIRE", minWidth: 170 },
];
const paginationModel = { page: 0, pageSize: 10 };

export default function Recruiter_offer() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      const request = async () => {
        try {
          const response = await Post("/api/job-offer/search_paginated", 
            {
                "query": {"id_recruiter": 1},
                "fields": [
                  "id_recruiter"
                ],
                "limit": 10,
                "offset": 0,
                "exact": true
            }
          );
          console.log("Offers: ", response);
          setData(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      request();
    }, []);

    //Fonction pour gérer le clic sur une ligne
    const handleRowClick = (params) => {
      const jobId = params.row.id;
      navigate(`/application_offer/${jobId}`);
    };
  
    return (
        <div>
            <div className="offers">
                <h1>Mes offres d'emploi publiées</h1>
                <Paper sx={{ height: "90%", width: "100%" }}>
                    <DataGrid
                        rows={data.items}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 50]}
                        sx={{ border: 0 }}
                        onRowClick={handleRowClick}
                    />
                </Paper>
            </div>
        </div>
    );
}