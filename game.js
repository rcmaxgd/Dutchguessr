let map = L.map('map').setView([52.1, 5.1], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let locations = [];
let actualLocation;
let guessMarker;

fetch('locaties.json')
  .then(response => response.json())
  .then(data => {
    locations = data;
    actualLocation = getRandomLocation();
  });

map.on('click', function (e) {
  if (guessMarker) map.removeLayer(guessMarker);
  guessMarker = L.marker(e.latlng).addTo(map);
  guessMarker.bindPopup("Jouw gok!").openPopup();
  window.guessCoords = e.latlng;
});

document.getElementById("guessButton").onclick = () => {
  if (!window.guessCoords) return alert("Klik eerst op de kaart!");
  const dist = getDistance(guessCoords, actualLocation);
  const score = Math.max(0, 10000 - Math.round(dist * 100));
  document.getElementById("result").textContent =
    `Echte locatie: (${actualLocation.lat.toFixed(3)}, ${actualLocation.lng.toFixed(3)}) – Afstand: ${dist.toFixed(2)} km – Score: ${score}`;
};

function getRandomLocation() {
  return locations[Math.floor(Math.random() * locations.length)];
}

function getDistance(p1, p2) {
  const R = 6371;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLon = (p2.lng - p1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * Math.PI / 180) *
    Math.cos(p2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
