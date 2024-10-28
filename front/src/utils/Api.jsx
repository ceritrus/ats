import React, { useState, useEffect } from "react";

const back = "http://localhost:8000";

export async function Fetch(url) {
  try {
    const response = await fetch(`${back}${url}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function Post(url, data) {
  try {
    const response = await fetch(`${back}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting data:", error);
  }
}

export async function Put(url, data) {
  try {
    const response = await fetch(`${back}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting data:", error);
  }
}
