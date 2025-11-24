export default async function handler(req, res) {
  try {
    const response = await fetch("https://railradar.in/api/v1/trains/live-map");
    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", detail: err.toString() });
  }
}
