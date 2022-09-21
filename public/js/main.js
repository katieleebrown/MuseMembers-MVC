// const { deleteMembership } = require("../../controllers/membership")

// Variables
const deleteBtn = document.querySelectorAll('.del')
const orgSearch = document.getElementById('organizationSearch')
const pickMuseumList = document.getElementById('chooseMuseum')
const orgNameForm = document.getElementById('displayOrgNameForm')
const orgAddressForm = document.getElementById('displayOrgAddressForm')
const addOrgNote = document.getElementById('museumSearchTag')
const orgDetailsForm = document.getElementById('selectedOrgInfoForm')
const mapContainer = document.getElementById('mapContainer')
const mapSearch = document.querySelector('#searchMap')


// Event Listeners
Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteMembership)
})
pickMuseumList.addEventListener('click', displaySearch)
mapSearch.addEventListener('click', showMapDetails)

// Delete Membership Function
// async function deleteMembership() {
//     const MembershipId = this.parentNode.dataset.id
//     try {
//         const response = await fetch('membership/deleteMembership', {
//             method: 'delete',
//             headers: { 'Content-type': 'application/json' },
//             body: JSON.stringify({
//                 'membershipIdFromJSFile': MembershipId
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     } catch (err) {
//         console.log(err)
//     }
// }

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

// For Google Find Place API
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

// Google Map Map on Load Feature - not currently in use
function initMap() {
    console.log('map is loading');

    var raleigh = new google.maps.LatLng(35.7796, 78.6382);

    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById("map"), {
        center: raleigh,
        zoom: 15,
    });

    var request = {
        query: "Museum of Natural Sciences",
        fields: ["name", "geometry", "place_id", "formatted_address"],
    };

    console.log('request places')

    service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
                console.log('marker created')
            }
            map.setCenter(results[0].geometry.location);
            console.log('center set')
        }
    });
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location)
        return;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });
    google.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(place.name || "");
        infowindow.open(map);
    });
}

window.initMap = initMap;