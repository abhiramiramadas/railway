// script.js — RailRadar live-map integration + prediction logic
// Crossing coordinates: Prem Nagar / Melaranoor (Thiruvananthapuram)
const CROSSING = {
  name: "Prem Nagar / Melaranoor",
  lat: 8.4855164921516,
  lng: 76.9628715202519
};

// IMPORTANT: USE YOUR LOCAL PROXY
const RAILRADAR_LIVE_MAP = "http://localhost:3000/live-map";

let map, crossingMarker, trainMarkers = [];
let refreshTimer = null;

// Haversine formula for distance
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = x => x * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.asin(Math.sqrt(a));
}

function formatTimeMs(ms) {
  return new Date(ms).toLocaleString();
}

function minutesBetween(msFuture) {
  return Math.max(0, Math.round((msFuture - Date.now()) / 60000));
}

// Leaflet map init
function initMap() {
  map = L.map('map').setView([CROSSING.lat, CROSSING.lng], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  crossingMarker = L.marker([CROSSING.lat, CROSSING.lng])
    .addTo(map)
    .bindPopup(`<b>${CROSSING.name}</b><br>${CROSSING.lat}, ${CROSSING.lng}`)
    .openPopup();
}

// Predict gate timing for a train — Kerala realistic version
function predictForTrain(train, blockDistKm) {

  const lat = Number(train.current_lat);
  const lng = Number(train.current_lng);

  if (!isFinite(lat) || !isFinite(lng)) return null;

  const distKm = haversineKm(lat, lng, CROSSING.lat, CROSSING.lng);

  const assumedSpeed = 45; // Kerala trains slow near TVC suburbs
  const leadBufferMin = 6; // gates close ~6 min before train arrives
  const postClearMin = 8;  // gates open ~8 min after train clears

  // Time for train to reach the crossing
  const timeToReachMin = (distKm / assumedSpeed) * 60;

  // Block distance: when train enters block section
  const timeToBlockMin = ((distKm - blockDistKm) / assumedSpeed) * 60;

  const now = Date.now();

  // When train reaches the block
  const blockReachedAt = now + timeToBlockMin * 60000;

  // When gates should close realistically
  const gateCloseAt = blockReachedAt - leadBufferMin * 60000;

  // When gates open — delayed real-life behaviour
  const gateOpenAt = blockReachedAt + (postClearMin * 60000);

  return {
    distKm,
    assumedSpeed,
    gateCloseAt,
    gateOpenAt
  };
}


// Fetch with proxy — FIXED VERSION
async function fetchLiveMap() {
  try {
    const response = await fetch(RAILRADAR_LIVE_MAP);

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ Proxy returned non-JSON:", text);
      throw new Error("Invalid JSON from proxy");
    }

    // 🚨 NEW API FORMAT:
    // If data = { success: true, data: [...], meta: {...} }
    if (data && Array.isArray(data.data)) {
      return data.data; // return the actual train array
    }

    // OLD API FORMAT (if RailRadar changes back)
    if (Array.isArray(data)) {
      return data;
    }

    console.error("❌ Unexpected API format:", data);
    throw new Error("Live-map did not return a valid train array");

  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
}

// Remove old train markers
function clearTrainMarkers() {
  trainMarkers.forEach(m => map.removeLayer(m));
  trainMarkers = [];
}

function renderTrains(trains) {
  const list = document.getElementById("trainsList");
  list.innerHTML = "";
  clearTrainMarkers();

  trains.sort((a, b) => a._distance - b._distance);

  trains.forEach(t => {
    const div = document.createElement("div");
    div.className = "train-item";

    const left = document.createElement("div");
    left.className = "train-left";
    left.innerHTML = `
      <strong>${t.train_number || "Train"}</strong><br>
      <small>${t.current_station_name || ""}</small>
    `;

    const right = document.createElement("div");
    right.className = "train-right";

    const pred = t._prediction;

    right.innerHTML = `
      <div class="badge">${t._distance.toFixed(2)} km</div>
      <div style="margin-top:6px;font-size:13px">
        Close: <strong>${pred ? formatTimeMs(pred.gateCloseAt) : "n/a"}</strong><br>
        Open: <strong>${pred ? formatTimeMs(pred.gateOpenAt) : "n/a"}</strong>
      </div>
    `;

    div.appendChild(left);
    div.appendChild(right);
    list.appendChild(div);

    const marker = L.marker([t.current_lat, t.current_lng])
      .addTo(map)
      .bindPopup(`<b>${t.train_number}</b><br>${t._distance.toFixed(2)} km away`);

    trainMarkers.push(marker);
  });
}

// MAIN refresh function
async function refreshAll() {
  const radiusKm = Number(document.getElementById("radius").value);
  const blockDist = Number(document.getElementById("blockDist").value);

  document.getElementById("mapStatus").innerText = "Fetching live trains...";

  try {
    const data = await fetchLiveMap();

    const nearby = data
      .filter(t => t.current_lat && t.current_lng)
      .map(t => {
        const dist = haversineKm(t.current_lat, t.current_lng, CROSSING.lat, CROSSING.lng);
        t._distance = dist;
        t._prediction = predictForTrain(t, blockDist);
        return t;
      })
      .filter(t => t._distance <= radiusKm);

    document.getElementById("mapStatus").innerText =
      `Found ${nearby.length} trains within ${radiusKm} km.`;

    renderTrains(nearby);

  } catch (err) {
    document.getElementById("mapStatus").innerText = "❌ Error fetching live data.";
  }
}

// Auto-refresh
function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  const interval = Number(document.getElementById("refreshInterval").value) * 1000;
  refreshTimer = setInterval(refreshAll, interval);
}

// On page load
window.onload = async () => {
  initMap();
  await refreshAll();
  startAutoRefresh();
  document.getElementById("refreshBtn").onclick = refreshAll;
};
