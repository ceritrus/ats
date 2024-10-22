import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Fetch } from "../utils/Api";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "company_description", headerName: "ENTREPRISE", minWidth: 170 },
  { field: "title", headerName: "TITRE", minWidth: 170 },
  { field: "description", headerName: "DESCRIPTION", minWidth: 300 },
  { field: "posted_date", headerName: "PUBLIÉ LE", minWidth: 170 },
  { field: "end_of_application", headerName: "DATE LIMITE", minWidth: 170 },
  { field: "job_location", headerName: "LIEU", minWidth: 170 },
];
const paginationModel = { page: 0, pageSize: 10 };

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
        <Paper sx={{ height: "90%", width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 50]}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    </div>
  );
}
