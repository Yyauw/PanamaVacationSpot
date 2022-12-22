mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-80.826673508, 8.049286578], // starting position [lng, lat]
  zoom: 9, // starting zoom
});