import React, { useState, useEffect } from "react";
import { Post, Put, Delete } from "../utils/Api";
import { DataGrid } from "@mui/x-data-grid";
import { Select, MenuItem, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, TextField } from "@mui/material";
import { useSelector } from "react-redux";

export default function Recruiter_offer() {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formValues, setFormValues] = useState({
    job_ref: "",
    title: "",
    job_location: "",
    graduate: "",
    experience: "",
    salary: 0,
    description: "",
    company_description: "",
    posted_date: "",
    end_of_application: "",
    id_recruiter: 0,
    skill_ids: [],
    soft_skill_ids: [],
  });
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [idRecruiter, setIdRecruiter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recruiterResponse = await Post(
          "/api/recruiter/search_paginated",
          {
            query: { id_user: user.id },
            fields: ["id_user"],
            limit: 10,
            offset: 0,
            exact: true,
          }
        );

        if (recruiterResponse) {
          setIdRecruiter(recruiterResponse.data.items[0].id);
          const offerResponse = await Post("/api/job-offer/search_paginated", {
            query: { id_recruiter: idRecruiter },
            fields: ["id_recruiter"],
            limit: 10,
            offset: 0,
            exact: true,
          });
          setData(offerResponse.data.items);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (job) => {
    if (job) {
      setSelectedJob(job);
      setFormValues({
        job_ref: job.job_ref,
        title: job.title,
        job_location: job.job_location,
        graduate: job.graduate,
        experience: job.experience,
        salary: job.salary,
        description: job.description,
        company_description: job.company_description,
        posted_date: job.posted_date,
        end_of_application: job.end_of_application,
        skill_ids: job.skill_ids,
        soft_skill_ids: job.soft_skill_ids,
      });
    } else {
      setSelectedJob(null);
      setFormValues({
        job_ref: "",
        title: "",
        job_location: "",
        graduate: "",
        experience: "",
        salary: 0,
        description: "",
        company_description: "",
        posted_date: "",
        end_of_application: "",
        skill_ids: [],
        soft_skill_ids: [],
      });
    }
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
        graduate: formValues.graduate,
        experience: parseFloat(formValues.experience),
        salary: parseFloat(formValues.salary),
        description: formValues.description,
        company_description: formValues.company_description,
        posted_date: formValues.posted_date,
        end_of_application: formValues.end_of_application,
        id_recruiter: idRecruiter,
        skill_ids: formValues.skill_ids,
        soft_skill_ids: formValues.soft_skill_ids,
      };
      if (selectedJob != null) {
        await Put(`/api/job-offer/${selectedJob.id}`, updatedJob);
      } else {
        await Post(`/api/job-offer/create`, updatedJob);
      }
      setOpenModal(false);
      setSelectedJob(null);
      window.location.reload();
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const handleDeleteClick = async (job) => {
    try {
      var dialog = confirm("Voulez vous supprimer cette offre ?");
      if (dialog) {
        await Delete(`/api/job-offer/${job.id}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const columns = [
    { field: "job_ref", headerName: "REF.", width: 150 },
    { field: "title", headerName: "TITRE", width: 250 },
    { field: "description", headerName: "DESCRIPTION", width: 250 },
    { field: "posted_date", headerName: "PUBLIÉ LE", width: 120 },
    { field: "end_of_application", headerName: "DATE LIMITE", width: 120 },
    { field: "job_location", headerName: "LIEU", width: 120 },
    { field: "graduate", headerName: "NIVEAU DE DIPLÔME", width: 150 },
    {
      field: "experience",
      headerName: "ANNÉE D'EXPÉRIENCE REQUISE",
      width: 150,
    },
    { field: "salary", headerName: "SALAIRE", width: 120 },
    {
      field: "update",
      headerName: "MODIFIER",
      width: 120,
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
    {
      field: "delete",
      headerName: "SUPPRIMER",
      width: 80,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="red"
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteClick(params.row);
          }}
        >
          X
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
            rows={data}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 50]}
            sx={{ border: 0 }}
            onRowClick={(params, event) => {
              if (event.target.tagName !== "BUTTON") {
                navigate(`/application_offer/${params.row.id}`);
              }
            }}
          />
        </Paper>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            handleOpenModal();
          }}
        >
          Ajouter une offre
        </Button>
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
          <div style={{ display: "flex" }}>
            <p>Niveau de diplôme :</p>
            <Select
              label="Diplome"
              name="graduate"
              value={formValues.graduate}
              onChange={handleInputChange}
            >
              <MenuItem value="Premier cycle universitaire">
                Premier cycle universitaire
              </MenuItem>
              <MenuItem value="DUT">DUT</MenuItem>
              <MenuItem value="BUT">BUT</MenuItem>
              <MenuItem value="BTS">BTS</MenuItem>
              <MenuItem value="Licence">Licence</MenuItem>
              <MenuItem value="Master">Master</MenuItem>
              <MenuItem value="Doctorat">Doctorat</MenuItem>
              <MenuItem value="Post-doctorat">Post-doctorat</MenuItem>
              <MenuItem value="Diplôme spécialisé">Diplôme spécialisé</MenuItem>
              <MenuItem value="Certificat">Certificat</MenuItem>
            </Select>
          </div>
          <TextField
            fullWidth
            label="Expérience"
            name="experience"
            value={formValues.experience}
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
