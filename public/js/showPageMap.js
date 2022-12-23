mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: Spot.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});
const popup = new mapboxgl.Popup({ offset: 25 }).setText(
    Spot.title
    );
new mapboxgl.Marker().setLngLat(Spot.geometry.coordinates).setPopup(popup).addTo(map);
