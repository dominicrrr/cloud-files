const FLOOR_DISPLAY = document.getElementById("floors");
const MAP = document.getElementById("map");
const PIN_BUTTON = document.getElementById("drop-pin");
const HAMBURGER_MENU = document.getElementById("openSidebarMenu");
const SAVED_POPUP = document.getElementById("saved-noti");

const INCIDENT_DETAILS = document.getElementById("incident-details");
const STUDENT_ID = document.getElementById("studentId");
const FLOOR = document.getElementById("floor-level");

const redPin = document.getElementById("red-pin-button");
const bluePin = document.getElementById("blue-pin-button");
const greenPin = document.getElementById("green-pin-button");
const purplePin = document.getElementById("purple-pin-button");

function date() {
  return new Date();
}

const TOP_VIEW = "top_view.jpg";
const NORM_VIEW = "map.png";

const topAttri = "No attribution";
const normAttri = "No attribution";

const TOP_LAYER = L.tileLayer(TOP_VIEW, { attribution: topAttri });
const NORM_LAYER = L.tileLayer(NORM_VIEW, { attribution: normAttri });

const normMarkerLayer = L.layerGroup();
const topMarkerLayer = L.layerGroup();

const greenIcon = L.icon({
  iconUrl: "images/pins/pin-green.png",
  shadowUrl: "images/pins/pin-shadow.png",
  iconSize: [34, 52],
  shadowSize: [75, 117],
  iconAnchor: [17, 50],
  shadowAnchor: [38, 105],
  popupAnchor: [0, -45],
});

const blueIcon = L.icon({
  iconUrl: "images/pins/pin-blue.png",
  shadowUrl: "images/pins/pin-shadow.png",
  iconSize: [34, 52],
  shadowSize: [75, 117],
  iconAnchor: [17, 50],
  shadowAnchor: [38, 105],
  popupAnchor: [0, -45],
});

const redIcon = L.icon({
  iconUrl: "images/pins/map-pin-icon.png",
  shadowUrl: "images/pins/pin-shadow.png",
  iconSize: [34, 52],
  shadowSize: [75, 117],
  iconAnchor: [17, 50],
  shadowAnchor: [38, 105],
  popupAnchor: [0, -45],
});

const purpleIcon = L.icon({
  iconUrl: "images/pins/pin-purple.png",
  shadowUrl: "images/pins/pin-shadow.png",
  iconSize: [34, 52],
  shadowSize: [75, 117],
  iconAnchor: [17, 50],
  shadowAnchor: [38, 105],
  popupAnchor: [0, -45],
});

const pictureDict = {
  red: "images/pins/map-pin-icon.png",
  blue: "images/pins/pin-blue.png",
  green: "images/pins/pin-green.png",
  purple: "images/pins/pin-purple.png",
};

let current_color = "";
let current_layer = "norm";
let pinDropActive = false;
let mapInstance;
let markersList = [];
let topMarkersList = [];

let markerIdCounter = 0;
let markersById = {};
let currentMarked;

function onlyOne(checkbox) {
  // makes sure only one checkbox is checked by manually unchecking every other box while checking the target box
  var checkboxes = document.querySelectorAll(".pin-button");
  checkboxes.forEach((item) => {
    if (item !== checkbox) item.checked = false;
  });
  checkTheBox();
}

function checkTheBox() {
  //
  var checkBoxes = document.querySelectorAll(".pin-button");
  checkBoxes.forEach(function (checkBox) {
    // iterates through all the checkboxes, sees if a checkbox is checked and if so, applies the CSS. also removes any styling for
    var parentElement = checkBox.parentElement; // an unchecked box
    var picture = parentElement.querySelector("img");
    if (checkBox.checked == true) {
      if (picture) picture.style.outline = "2px solid white";
      current_color = checkBox.getAttribute("data-color");
      console.log(current_color);
    } else {
      if (picture) picture.style.outline = "none";
    }
  });
}

function pin_drop() {
  // function is called by the click of the drop a pin button, simply enables the pinDrop variable and enables some responsive css
  PIN_BUTTON.textContent = pinDropActive ? "Drop a pin" : "[CANCEL]";
  PIN_BUTTON.classList.toggle("active");
  MAP.classList.toggle("active");
  pinDropActive = !pinDropActive;
}

document.addEventListener("DOMContentLoaded", display_map); // runs the display_map function on the loading of the document

function display_map() {
  redPin.checked = true; //when the document loads, makes the redPin the default pin and calls the function to check the box.
  checkTheBox();
  mapInstance.on("click", function (e) {
    //this function generally works outside the display_map function but its purpose is unaffected.
    const todaysDate = date().toLocaleDateString(); // grabs the current date
    const markerPlace = document.getElementById("marker-position");
    let proper_pin = pinBasedOnCheckbox(); // gets the pin color from the pinBasedOnCheckbox function and assigning it to a variable
    console.log(proper_pin); // test
    if (pinDropActive) {
      markerPlace.textContent = e.latlng;
      markerIdCounter++;
      let markerId = `marker-${markerIdCounter}`;
      const marker = L.marker(e.latlng, {
        icon: proper_pin,
        draggable: true,
        xy: e.latlng,
        layer: current_layer,
        id: markerId,
        color: current_color,
        date: todaysDate,
        studentId: "",
        details: "",
      }).addTo(mapInstance); //adds pin

      markersById[markerId] = marker;

      for (const markerId in markersById) {
        // iterates through the all markers and assigns the marker a value
        if (markersById.hasOwnProperty(markerId)) {
          const marker = markersById[markerId];
          marker.on("click", function () {
            console.log("Hey Hey Hey Hello I've been clicked!"); // test
            openHamburgerMenu();
            updatePinDetails(markersById[markerId]);
            currentMarked = markersById[markerId];
          });
        }
      }

      Object.keys(markersById).forEach((markerId) => {
        // for testing purposes
        const marker = markersById[markerId];
        const markerJSON = {
          id: marker.options.id, // Get the id from the marker options
          color: marker.options.color, // Get the color from the marker options
          layer: marker.options.layer, // Get the layer from the marker options
          xy: marker.options.xy, // Get the xy from the marker options
          date: marker.options.date,
          studentId: marker.options.studentId,
          details: marker.options.details,
        };
        console.log(JSON.stringify(markerJSON));
      });

      const popupContent = document.createElement("div");
      popupContent.innerHTML = `${todaysDate}<br><button type="button" class="remove" id=${markerId}>delete marker 💔</button>`;
      marker.bindPopup(popupContent); // binds popup to maker on click containing the date the marker was placed and the button to delete the marker

      const removeButton = popupContent.querySelector("button.remove");
      removeButton.onclick = function removeMarker() {
        const markerToRemove = markersById[markerId];
        if (markerToRemove) {
          mapInstance.removeLayer(markerToRemove); //removes selected marker from the map
          delete markersById[markerId];
        }
      };
    }
  });
}

function openHamburgerMenu() {
  if (HAMBURGER_MENU.checked == false) {
    HAMBURGER_MENU.checked = true;
  }
}

function updatePinDetails(pin_marker) {
  // inside the sidebar menu changes the big pin based on selected pin
  STUDENT_ID.textContent = pin_marker.options.studentId;
  INCIDENT_DETAILS.textContent = pin_marker.options.details;
  FLOOR.textContent = pin_marker.options.layer;
  const img = document.getElementById("pin-display");
  img.src = pictureDict[pin_marker.options.color]; // changes the big pin
}

function saveDetails() {
  //save details and assign it to the marker
  currentMarked.options.details = INCIDENT_DETAILS.textContent;
  currentMarked.options.studentId = STUDENT_ID.textContent;
  savedPopup();
}

function savedPopup() {
  // toggle the thingy
  SAVED_POPUP.classList.toggle("active");
  setTimeout(function () {
    SAVED_POPUP.classList.toggle("active");
  }, 3000);
}

function pinBasedOnCheckbox() {
  // indexes the pinList dict with the current color and returns the corresponding active icon
  const pinList = {
    red: redIcon,
    blue: blueIcon,
    green: greenIcon,
    purple: purpleIcon,
  };
  const key = Object.keys(pinList).find((k) => k === current_color);
  return pinList[key]; //returns the icon
}

function masterMarkerDisplay() {
  for (let markerId in markersById) {
    if (markersById.hasOwnProperty(markerId)) {
      let marker = markersById[markerId];

      if (current_layer === "top") {
        if (marker.options.layer === "norm") {
          if (mapInstance.hasLayer(marker)) {
            mapInstance.removeLayer(marker);
          }
        } else {
          if (!mapInstance.hasLayer(marker)) {
            marker.addTo(mapInstance);
          }
        }
      } else {
        if (marker.options.layer === "top") {
          if (mapInstance.hasLayer(marker)) {
            mapInstance.removeLayer(marker);
          }
        } else {
          if (!mapInstance.hasLayer(marker)) {
            marker.addTo(mapInstance);
          }
        }
      }
    }
  }
}

const bounds = [
  // bounds for leaflet map
  [0, 0],
  [500, 1100],
];

mapInstance = L.map("map", {
  // establishes leaflet map
  crs: L.CRS.Simple,
  layers: [NORM_LAYER],
  maxZoom: 2,
  minZoom: -0.1,
  maxBounds: bounds,
});

const baseLayers = {
  // layers for leaflet map
  "Normal view": NORM_LAYER,
  "Top view": TOP_LAYER,
};

L.control.layers(baseLayers).addTo(mapInstance); // adds layers to map

mapInstance.on("baselayerchange", function (eventLayer) {
  // on base layer change click, changes the layer to wanted layer.
  if (eventLayer.name === "Normal view") {
    mapInstance.removeLayer(TOP_LAYER);
    L.imageOverlay(NORM_VIEW, bounds).addTo(mapInstance);
    current_layer = "norm";
  } else if (eventLayer.name === "Top view") {
    mapInstance.removeLayer(NORM_LAYER);
    L.imageOverlay(TOP_VIEW, bounds).addTo(mapInstance);
    current_layer = "top";
  }
  masterMarkerDisplay();
});

L.imageOverlay(NORM_VIEW, bounds).addTo(mapInstance);

mapInstance.fitBounds(bounds);
