// Variables
const orgSearch = document.getElementById('organizationSearch')
const pickMuseumList = document.getElementById('chooseMuseum')
const orgNameForm = document.getElementById('displayOrgNameForm')
const orgAddressForm = document.getElementById('displayOrgAddressForm')
const addOrgNote = document.getElementById('museumSearchTag')
const orgDetailsForm = document.getElementById('selectedOrgInfoForm')
const mapContainer = document.getElementById('mapContainer')
const mapSearch = document.querySelector('#searchMap')
const latitude = document.getElementById('userLat').innerText
const longitude = document.getElementById('userLon').innerText
const nearbyMap = document.getElementById('nearbyMap')

// Event Listeners
// document.addEventListener('DOMContentLoaded', loadNearby)
if (pickMuseumList) {
    pickMuseumList.addEventListener('click', displaySearch)
}
if (mapSearch) {
    mapSearch.addEventListener('click', showMapDetails)
}
if (nearbyMap) {
    document.addEventListener('DOMContentLoaded', showNearby)
}

// Display Organization Search or Update Display for Partner Museum
function displaySearch() {
    if (pickMuseumList.selectedIndex > 0) {
        if ('other' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgSearch.classList.remove('hidden')
            orgDetailsForm.classList.add('hidden')
            addOrgNote.classList.remove('hidden')
        } else if ('Cary Childrens Museum' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgNameForm.innerText = `Cary Children's Museum`;
            orgAddressForm.innerText = `100 N Main St, Cary NC 27516`
            document.getElementById('place_id').value = '01'
            partnerMuseumFormDisplay()
        } else if ('Museum Of Climate Sciences' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgNameForm.innerText = `Museum of Climate Sciences`;
            orgAddressForm.innerText = `500 Sunshine Ln, Raleigh, NC 27202`
            document.getElementById('place_id').value = '02'
            partnerMuseumFormDisplay()
        } else if ('City Of Oaks Historical Center' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgNameForm.innerText = `City of Oaks Historical Center`;
            orgAddressForm.innerText = `1587 Sir Walter Ln, Raleigh, NC 27601`
            document.getElementById('place_id').value = '03'
            partnerMuseumFormDisplay()
        } else if ('NC Farm Park and Zoo' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgNameForm.innerText = `North Carolina Farm Park & Zoo`;
            orgAddressForm.innerText = `186 Cattlebrush Rd. Durham, NC 27606`
            document.getElementById('place_id').value = '04'
            partnerMuseumFormDisplay()
        }
    }
}

// Display toggles for partner museums
function partnerMuseumFormDisplay() {
    addOrgNote.classList.add('hidden')
    mapContainer.classList.add('hidden')
    orgDetailsForm.classList.remove('hidden')
}

var map;
var service;
var infowindow;

// For Google Find Place API for grabbing business details
function showMapDetails() {
    mapContainer.classList.remove('hidden')
    orgDetailsForm.classList.remove('hidden')
    console.log('button clicked');

    var search = document.getElementById('orgNameInput').value;

    var request = {
        query: search,
        fields: ["name", "geometry", "place_id", "formatted_address"],
    };

    service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
            console.log(results);

            //Set Org Name & Details
            console.log(`orgName = ${results[0].name}`)
            orgNameForm.innerText = results[0].name;
            orgAddressForm.innerText = results[0].formatted_address;

            // store Place_Id for later searches in local storage
            var searchId = results[0].place_id;
            localStorage.setItem('organization', searchId);
            document.getElementById('place_id').value = searchId
            pickMuseumList.options[pickMuseumList.selectedIndex].value = results[0].name
            map.setCenter(results[0].geometry.location);
        }
    });
}

// For Nearby Museum Recommendations 
function showNearby() {
    console.log('this is working')
    console.log(`museum has been selected`)
    const location = new google.maps.LatLng(latitude, longitude);

    // Creates the map
    map = new google.maps.Map(document.getElementById('nearbyMap'), {
        center: location,
        zoom: 11
    });

    var request = {
        location: location,
        radius: 150000,
        keyword: 'museum'
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status !== "OK" || !results) return;

        console.log(results)
        addPlaces(results, map);
    });
}

function addPlaces(places, map) {
    const placesList = document.getElementById('placesList')

    places.forEach(place => {
        if (place.geometry && place.geometry.location) {
            // creating google map icon
            const image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            }

            // placing google maps icon
            new google.maps.Marker({
                map,
                icon: image,
                title: place.name,
                position: place.geometry.location,
            })

            // Create card for this place
            const div = document.createElement('div')
            div.className = 'card my-2 p-2'
            div.style = 'min-width: 300px;'

            const cardTop = document.createElement('div')
            cardTop.className = "card-top"

            const nameHeader = document.createElement('h4')
            nameHeader.className = "card-title"
            nameHeader.textContent = place.name

            cardTop.appendChild(nameHeader)
            div.appendChild(cardTop)

            placesList.appendChild(div)
            div.addEventListener('click', () => {
                map.setCenter(place.geometry.location)
            })
        }
    })
}

    // function callback(results, status) {
    //     if (status == google.maps.places.PlacesServiceStatus.OK) {
    //         for (var i = 0; i < results.length; i++) {
    //             createMarker(results[i]);
    //         }
    //     }
    // }

// Google Maps - Nearby Museums Recommendations
// function loadNearby() {
//     console.log('nearby museums now loading')

//     // let axios = require('axios')
//     let latitude = document.getElementById('userLatitude').innerText
//     let longitude = document.getElementById('userLongitude').innerText
//     let orgType = 'museum'
//     let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=${orgType}&key=***REMOVED***`

//     fetch(url)
//         .then(result => JSON.stringify(result))
//         .then((data => {
//             console.log(data)
//         }))
//         .catch((error => {
//             console.log(error)
//         }))
// }

// Google Map Map on Load Feature - not currently in use
// function initMap() {
//     var raleigh = new google.maps.LatLng(35.7796, 78.6382);

//     infowindow = new google.maps.InfoWindow();

//     map = new google.maps.Map(document.getElementById("map"), {
//         center: raleigh,
//         zoom: 15,
//     });

//     var request = {
//         query: "Museum of Natural Sciences",
//         fields: ["name", "geometry", "place_id", "formatted_address"],
//     };

//     console.log('request places')

//     service = new google.maps.places.PlacesService(map);

//     service.findPlaceFromQuery(request, function (results, status) {
//         if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//             for (var i = 0; i < results.length; i++) {
//                 createMarker(results[i]);
//                 console.log('marker created')
//             }
//             map.setCenter(results[0].geometry.location);
//             console.log('center set')
//         }
//     });
// }

// // Google maps - update marker when moved
// function createMarker(place) {
//     if (!place.geometry || !place.geometry.location)
//         return;
//     var marker = new google.maps.Marker({
//         map: map,
//         position: place.geometry.location,
//     });
//     google.maps.event.addListener(marker, "click", function () {
//         infowindow.setContent(place.name || "");
//         infowindow.open(map);
//     });
// }

// window.initMap = initMap