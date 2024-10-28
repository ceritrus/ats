import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Post, Put } from "../utils/Api";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, TextField } from "@mui/material";

export default function Recruiter_offer() {
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [formValues, setFormValues] = useState({
        job_ref: "",
        title: "",
        job_location: "",
        salary: 0,
        description: "",
        company_description: "",
        posted_date: "",
        end_of_application: "",
        id_recruiter: 0,
        skill_ids: [],
        soft_skill_ids: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        const request = async () => {
            try {
                const response = await Post("/api/job-offer/search_paginated", {
                    query: { id_recruiter: 1 },
                    fields: ["id_recruiter"],
                    limit: 10,
                    offset: 0,
                    exact: true,
                });
                setData(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        request();
    }, []);

    const handleOpenModal = (job) => {
        setSelectedJob(job);
        setFormValues({
          job_ref: job.job_ref || "",
          title: job.title || "",
          job_location: job.job_location || "",
          salary: job.salary || 0,
          description: job.description || "",
          company_description: job.company_description || "",
          posted_date: job.posted_date || "",
          end_of_application: job.end_of_application || "",
          id_recruiter: job.id_recruiter || 0,
          skill_ids: job.skill_ids || null,
          soft_skill_ids: job.soft_skill_ids || null
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedJob(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSaveClick = async () => {
        try {
            const updatedJob = {
                job_ref: formValues.job_ref,
                title: formValues.title,
                job_location: formValues.job_location,
                salary: parseFloat(formValues.salary),
                description: formValues.description,
                company_description: formValues.company_description,
                posted_date: formValues.posted_date,
                end_of_application: formValues.end_of_application,
                id_recruiter: formValues.id_recruiter,
                skill_ids: formValues.skill_ids,
                soft_skill_ids: formValues.soft_skill_ids
            };
            console.log(selectedJob.id)
            console.log(updatedJob)
            await Put(`/api/job-offer/${selectedJob.id}`, updatedJob);
            setOpenModal(false);
            setSelectedJob(null);
            window.location.reload();
            
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const columns = [
        { field: "title", headerName: "TITRE", width: 350 },
        { field: "description", headerName: "DESCRIPTION", width: 500 },
        { field: "posted_date", headerName: "PUBLIÉ LE", width: 150 },
        { field: "end_of_application", headerName: "DATE LIMITE", width: 150 },
        { field: "job_location", headerName: "LIEU", width: 150 },
        { field: "salary", headerName: "SALAIRE", width: 150 },
        {
            field: "update",
            headerName: "MODIFIER",
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleOpenModal(params.row);
                    }}
                >
                    Modifier
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div className="offers">
                <h1>Mes offres d'emploi publiées</h1>
                <Paper sx={{ height: "90%", width: "100%" }}>
                    <DataGrid
                        rows={data.items}
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                        pageSizeOptions={[5, 10, 50]}
                        sx={{ border: 0 }}
                        onRowClick={(params, event) => {
                            if (event.target.tagName !== "BUTTON") {
                                navigate(`/application_offer/${params.row.id}`);
                            }
                        }}
                    />
                </Paper>
            </div>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2>Modifier l'Offre</h2>
                    <TextField
                        fullWidth
                        label="Référence de l'offre"
                        name="job_ref"
                        value={formValues.job_ref}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Titre"
                        name="title"
                        value={formValues.title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Lieu"
                        name="job_location"
                        value={formValues.job_location}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Salaire"
                        name="salary"
                        value={formValues.salary}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Entreprise"
                        name="company_description"
                        value={formValues.company_description}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Date de publication"
                        name="posted_date"
                        type="date"
                        value={formValues.posted_date}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Date limite"
                        name="end_of_application"
                        type="date"
                        value={formValues.end_of_application}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveClick}
                        sx={{ mt: 2 }}
                    >
                        Sauvegarder
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
