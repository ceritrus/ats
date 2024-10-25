import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Post, Fetch } from "../utils/Api";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useNavigate, useParams } from "react-router-dom";

const columns = [
    { field: "last_name", headerName: "NOM", minWidth: 300 },
    { field: "first_name", headerName: "PRENOM", minWidth: 300 },
    { field: "application_date", headerName: "DATE DE CANDIDATURE", minWidth: 170 },
    { field: "status", headerName: "SATUT DE LA CANDIDATURE", minWidth: 170 },
    { field: "feedback", headerName: "COMMENTAIRE", minWidth: 170 },
    { field: "ats_final_note", headerName: "NOTATION", minWidth: 170 },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function Application_offer() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Get ID from URL
    const params = useParams();

    useEffect(() => {
        const request = async () => {
            try {
                const applicationResponse = await Post("/api/application/search_paginated", {
                    "query": { "id_job_offer": Number(params.id) },
                    "fields": ["id_job_offer"],
                    "limit": 10,
                    "offset": 0,
                    "exact": true
                });

                const applications = applicationResponse.items;

                // Pour chaque candidature, récupérer les infos du candidat
                const applicationsWithCandidateInfo = await Promise.all(
                    applications.map(async (application) => {
                        // Récupérer les informations du candidat à partir de l'ID candidat
                        const candidateResponse = await Fetch(`/api/candidate/${application.id_candidate}`);
                        return {
                            ...application,
                            last_name: candidateResponse.last_name,
                            first_name: candidateResponse.first_name,
                        };
                    })
                );

                setData(applicationsWithCandidateInfo);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        request();
    }, []);

    //Fonction pour gérer le clic sur une ligne
    const handleRowClick = (params) => {
        const candidateId = params.row.id_candidate;
        const applicationid = params.row.id;
        navigate(`/about_candidate/${applicationid}/${candidateId}`);
      };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="offers">
                <h1>Mes offres d'emploi publiées</h1>
                <Paper sx={{ height: "90%", width: "100%" }}>
                    <DataGrid
                        rows={data}
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
