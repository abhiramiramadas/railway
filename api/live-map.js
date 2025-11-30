export default async function handler(req, res) {
  try {
    const response = await fetch("https://railradar.in/api/v1/trains/live-map");

    const text = await response.text();

    try {
      JSON.parse(text); // validate JSON
    } catch (e) {
      console.error("RailRadar returned invalid JSON", text);
      return res.status(500).json({ error: "Invalid JSON from RailRadar" });
    }

    // success
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(text);

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Failed to reach RailRadar",
      details: error.toString(),
    });
  }
}
