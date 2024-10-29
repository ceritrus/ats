import React, { useState, useEffect } from "react";
import axios from "axios";

const back = "http://localhost:8000";

export async function Fetch(url) {
  try {
    const response = await axios.get(`${back}${url}`);
    const result = await response;
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function Post(url, data) {
  try {
    const response = await axios.post(`${back}${url}`, data);
    const result = response;
    return result;
  } catch (error) {
    console.error("Error posting data:", error);
  }
}

export async function Put(url, data) {
  try {
    if (localStorage.getItem("token")) {
      const response = await axios.put(`${back}${url}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          ContentType: "application/json",
        },
      });
      return response;
    } else {
      const response = await axios.put(`${back}${url}`, data);
      return response;
    }
  } catch (error) {
    console.error("Error putting data:", error);
  }
}

export async function Delete(url) {
  try {
    const response = await axios.delete(`${back}${url}`);
    const result = await response;
    return result;
  } catch (error) {
    console.error("Error delete data:", error);
  }
}