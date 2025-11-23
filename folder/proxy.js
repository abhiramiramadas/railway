const express = require("express");
const fetch = (...args) => import("node-fetch").then(({default: f}) => f(...args));

const app = express();

app.get("/live-map", async (req, res) => {
    const response = await fetch("https://railradar.in/api/v1/trains/live-map");
    const data = await response.text();
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", "application/json");
    res.send(data);
});

app.listen(3000, () => console.log("Proxy running at http://localhost:3000"));
