import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Post, Fetch, Put } from "../utils/Api";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useNavigate, useParams } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const paginationModel = { page: 0, pageSize: 10 };

export default function Application_offer() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const params = useParams();

    const columns = [
        { field: "last_name", headerName: "NOM", minWidth: 300 },
        { field: "first_name", headerName: "PRENOM", minWidth: 300 },
        { field: "application_date", headerName: "DATE DE CANDIDATURE", minWidth: 170 },
        {
            field: "status",
            headerName: "STATUT DE LA CANDIDATURE",
            minWidth: 170,
            renderCell: (params) => (
                <Select
                    value={params.row.status}
                    onChange={(e) => handleStatusChange(e, params.row)}
                    displayEmpty
                >
                    <MenuItem value="Processing">En attente</MenuItem>
                    <MenuItem value="Received">Accepté</MenuItem>
                    <MenuItem value="Rejected">Rejeté</MenuItem>
                </Select>
            ),
        },
        { field: "feedback", headerName: "COMMENTAIRE", minWidth: 170 },
        { field: "ats_final_note", headerName: "NOTATION", minWidth: 170 },
    ];

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

                const applications = applicationResponse.data.items;

                const applicationsWithCandidateInfo = await Promise.all(
                    applications.map(async (application) => {
                        const candidateResponse = await Fetch(`/api/candidate/${application.id_candidate}`);
                        return {
                            ...application,
                            last_name: candidateResponse.data.last_name,
                            first_name: candidateResponse.data.first_name,
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

    const handleRowClick = (params) => {
        const candidateId = params.row.id_candidate;
        const applicationId = params.row.id;
        navigate(`/about_candidate/${applicationId}/${candidateId}`);
    };

    const handleStatusChange = async (event, row) => {
        const newStatus = event.target.value;
        row.status = newStatus
        try {
            await Put(`/api/application/${row.id}`, row);

            setData((prevData) =>
                prevData.map((application) =>
                    application.id === row.id ? { ...application, status: newStatus } : application
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
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
