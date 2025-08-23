const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

let latestData = { temperature: null, humidity: null, gas: null, timestamp: null };

async function fetchESPData() {
  try {
    const res = await axios.get("http://192.168.76.127/data");
    latestData = {
      ...res.data,
      timestamp: new Date().toISOString()
    };
    console.log("Fetched:", latestData);
  } catch (err) {
    console.error("Error fetching ESP data:", err.message);
  }
}

setInterval(fetchESPData, 5000);

app.get("/api/data", (req, res) => {
  res.json(latestData);
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
