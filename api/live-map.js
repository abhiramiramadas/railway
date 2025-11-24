export default async function handler(req, res) {
  const { lat, lon, radius } = req.query;

  const url = `https://api.railradar.in/api/v1/trains/live-map?lat=${lat}&lon=${lon}&r=${radius}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
