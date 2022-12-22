mapboxgl.accessToken = mapToken;
const spotjson = JSON.parse(Spot)
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: spotjson.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});
const popup = new mapboxgl.Popup({ offset: 25 }).setText(
    spotjson.title
    );
new mapboxgl.Marker().setLngLat(spotjson.geometry.coordinates).setPopup(popup).addTo(map);
