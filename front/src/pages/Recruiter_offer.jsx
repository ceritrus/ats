import React, { useState, useEffect } from "react";
import { Post, Put, Delete, Fetch } from "../utils/Api";
import { DataGrid } from "@mui/x-data-grid";
import { Select, MenuItem, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { Checkbox, ListItemText } from "@mui/material";

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
    softskill_ids: [],
  });
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [idRecruiter, setIdRecruiter] = useState(null);
  const [skills, setSkills] = useState([]);
  const [softskills, setSoftskills] = useState([]);

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

    const fetchSkills = async () => {
      try {
        const response = await Fetch('/api/skill');
        setSkills(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des compétences :", error);
      }
    };

    const fetchSoftskills = async () => {
      try {
        const response = await Fetch('/api/soft-skill');
        setSoftskills(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des compétences :", error);
      }
    };

    fetchSkills();
    fetchSoftskills();
    fetchData();
  }, []);

  const handleOpenModal = (job) => {
    if (job) {
      console.log(job);
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
        skill_ids: job.skills.map(skill => skill.id),
      softskill_ids: job.soft_skills.map(softSkill => softSkill.id)
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
        softskill_ids: [],
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

    if (name === "skill_ids") {
      setFormValues((prevValues) => ({
        ...prevValues,
        skill_ids: value,
      }));
    }
    else if (name === "softskill_ids") {
      setFormValues((prevValues) => ({
        ...prevValues,
        softskill_ids: value,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }

    console.log(formValues);
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
        soft_skill_ids: formValues.softskill_ids,
      };
      console.log(updatedJob)
      if (selectedJob != null) {
        await Put(`/api/job-offer/${selectedJob.id}`, updatedJob);
      } else {
        await Post(`/api/job-of fer/create`, updatedJob);
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
            width: 1500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Modifier l'Offre</h2>
          <div style={{display: "flex", width: "100%"}}>
            <div style={{width: "50%", padding: "10px"}}>
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
              <div>
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
            </div>
            <div style={{width: "50%", padding: "10px"}}>
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
              <div>
                <p>Compétences:</p>
                <Select
                  multiple
                  value={formValues.skill_ids || []}  // Keep the actual IDs as values
                  onChange={(e) => setFormValues({ ...formValues, skill_ids: e.target.value })}
                  renderValue={(selected) =>
                    selected
                      .map((skillId) => skills.find((skill) => skill.id === skillId)?.label)
                      .join(", ")
                  }
                >
                  {skills.map((skill) => (
                    <MenuItem key={skill.id} value={skill.id}>
                      <Checkbox checked={(formValues.skill_ids || []).includes(skill.id)} />
                      <ListItemText primary={skill.label} />
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div>
                <p>Softskills:</p>
                <Select
                  multiple
                  value={formValues.softskill_ids || []}  // Keep the actual IDs as values
                  onChange={(e) => setFormValues({ ...formValues, softskill_ids: e.target.value })}
                  renderValue={(selected) =>
                    selected
                      .map((softskillId) => softskills.find((softskill) => softskill.id === softskillId)?.label)
                      .join(", ")
                  }
                >
                  {softskills.map((softskill) => (
                    <MenuItem key={softskill.id} value={softskill.id}>
                      <Checkbox checked={(formValues.softskill_ids || []).includes(softskill.id)} />
                      <ListItemText primary={softskill.label} />
                    </MenuItem>
                  ))}
                </Select>
              </div>
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
            </div>
          </div>
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
