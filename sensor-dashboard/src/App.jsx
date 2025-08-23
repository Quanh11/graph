import { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/api/data")
        .then(res => res.json())
        .then(d => {
          setData(prev => [...prev, d].slice(-20)); 
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Sensor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Temperature Chart */}
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="mb-2 font-semibold">Temperature (°C)</h2>
          <LineChart width={300} height={200} data={data}>
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" hide />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>

        {/* Humidity Chart */}
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="mb-2 font-semibold">Humidity (%)</h2>
          <LineChart width={300} height={200} data={data}>
            <Line type="monotone" dataKey="humidity" stroke="#00bfff" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" hide />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>

        {/* Gas Chart */}
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="mb-2 font-semibold">Gas Level</h2>
          <LineChart width={300} height={200} data={data}>
            <Line type="monotone" dataKey="gas" stroke="#32cd32" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" hide />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default App;
