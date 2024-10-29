import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Fetch, Post, Put } from "../utils/Api";

const columns = [
  { field: "company_description", headerName: "ENTREPRISE", minWidth: 170 },
  { field: "title", headerName: "TITRE", minWidth: 200 },
  { field: "description", headerName: "DESCRIPTION", minWidth: 300 },
  { field: "job_location", headerName: "LIEU", minWidth: 170 },
  { field: "posted_date", headerName: "PUBLIÉ LE", minWidth: 170 },
  { field: "end_of_application", headerName: "DATE LIMITE", minWidth: 170 },
];
const paginationModel = { page: 0, pageSize: 10 };

export default function Offers() {
  const [data, setData] = useState([]);
  const { needle } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const request = async () => {
      try {
        setData([]);
        Post("/api/job-offer/search_paginated", {
          query: {
            title: needle,
          },
          fields: ["title"],
          limit: 50,
          offset: 0,
          exact: false,
        }).then((response) => {
          for (let i = 0; i < response.data.items.length; i++) {
            let seen = false;
            for (let j = 0; j < data.length; j++) {
              if (data[j].id === response.data.items[i].id) {
                seen = true;
              }
            }
            if (!seen) {
              const results = setData([...data, response.data.items[i]]);
            }
          }
        });
        Post("/api/job-offer/search_paginated", {
          query: {
            description: needle,
          },
          fields: ["description"],
          limit: 50,
          offset: 0,
          exact: false,
        }).then((response) => {
          for (let i = 0; i < response.data.items.length; i++) {
            let seen = false;
            for (let j = 0; j < data.length; j++) {
              if (data[j].id === response.data.items[i].id) {
                seen = true;
              }
            }
            if (!seen) {
              const results = [...data, response.data.items[i]];
              setData[results];
            }
          }
        });
        Post("/api/job-offer/search_paginated", {
          query: {
            company_description: needle,
          },
          fields: ["company_description"],
          limit: 50,
          offset: 0,
          exact: false,
        }).then((response) => {
          for (let i = 0; i < response.data.items.length; i++) {
            let seen = false;
            for (let j = 0; j < data.length; j++) {
              if (data[j].id === response.data.items[i].id) {
                seen = true;
              }
            }
            if (!seen) {
              const results = setData([...data, response.data.items[i]]);
            }
          }
        });
        Post("/api/job-offer/search_paginated", {
          query: {
            job_location: needle,
          },
          fields: ["job_location"],
          limit: 50,
          offset: 0,
          exact: false,
        }).then((response) => {
          for (let i = 0; i < response.data.items.length; i++) {
            let seen = false;
            for (let j = 0; j < data.length; j++) {
              if (data[j].id === response.data.items[i].id) {
                seen = true;
              }
            }
            if (!seen) {
              const results = setData([...data, response.data.items[i]]);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    request();
  }, [needle]);

  return (
    <div>
      <div className="offers">
        <h1>Offres: {needle}</h1>
        <Paper sx={{ height: "90%", width: "100%" }}>
          <DataGrid
            rows={data}
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
