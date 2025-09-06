const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/iot_data_2")
  .then(() => console.log("Connected to MongoDB (iot_data_2)"))
  .catch(err => console.error("MongoDB connection error:", err));


const dataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  gas: Number,
  timestamp: String
});

const SensorData = mongoose.model("SensorData", dataSchema);


let latestData = { temperature: null, humidity: null, gas: null, timestamp: null };

async function fetchESPData() {
  try {
    const res = await axios.get("http://192.168.88.144/data");
    latestData = {
      ...res.data,
      timestamp: new Date().toISOString()
    };
    console.log("Fetched:", latestData);


    const newRecord = new SensorData(latestData);
    await newRecord.save();
    console.log("Data saved to MongoDB");
  } catch (err) {
    console.error("Error fetching or saving data:", err.message);
  }
}

setInterval(fetchESPData, 5000);


app.get("/api/data", async (req, res) => {
  res.json(latestData);
});

app.get("/api/history", async (req, res) => {
  try {
    const history = await SensorData.find().sort({ _id: -1 }).limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});


const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
