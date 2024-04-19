const FLOOR_DISPLAY = document.getElementById("floors");
const MAP = document.getElementById("map");
const PIN_BUTTON = document.getElementById("drop-pin");
const MINUS_BUTTON = document.getElementById("minus-button");
const PLUS_BUTTON = document.getElementById("plus-button");
const TOP_VIEW = "top_view.jpg";
const NORM_VIEW = "map.png";

const topAttri = "No attribution";
const normAttri = "No attribution";

const TOP_LAYER = L.tileLayer(TOP_VIEW, { attribution: topAttri });
const NORM_LAYER = L.tileLayer(NORM_VIEW, { attribution: normAttri });

let current_map = "map.png";

let pinDropActive = false;

let mapInstance;

var greenIcon = L.icon({
iconURL: "images/leaf-green.png",
shadowURL: "images/leaf-shadow.png",

iconSize: [38, 95], // size of the icon
shadowSize: [50, 64], // size of the shadow
iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
shadowAnchor: [4, 62], // the same for the shadow
popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

function pin_drop() {
if (PIN_BUTTON.textContent === "Drop a pin") {
PIN_BUTTON.textContent = "[CANCEL]";
PIN_BUTTON.classList.add("active");
MAP.classList.add("active");
pinDropActive = true;
} else {
PIN_BUTTON.textContent = "Drop a pin";
PIN_BUTTON.classList.remove("active");
MAP.classList.remove("active");
pinDropActive = false;
}
mapInstance.on("click", function (e) {
const markerPlace = document.getElementById("marker-position");
if (pinDropActive) {
markerPlace.textContent = e.latlng;
L.marker([lat, lng], { icon: greenIcon }).addTo(mapInstance);
}
});
}

document.addEventListener("DOMContentLoaded", function () {
display_map();
});

function display_map() {
mapInstance = L.map("map", {
crs: L.CRS.Simple,
maxZoom: 2,
minZoom: -0.1,
});

var bounds = [
[0, 0],
[500, 1100],
];

var image = L.imageOverlay(NORM_VIEW, bounds).addTo(mapInstance);
mapInstance.fitBounds(bounds);
mapInstance.fitBounds(bounds, { maxZoom: -1 });

const baseLayers = {
"Normal view": NORM_LAYER,
"Top view": TOP_LAYER,
};

L.control.layers(baseLayers).addTo(mapInstance);
}
