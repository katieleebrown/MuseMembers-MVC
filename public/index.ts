/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const button = document.querySelector('#searchMap')
button?.addEventListener('click', updateMap)

let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let infowindow: google.maps.InfoWindow;

function initMap(): void {
  console.log('map is loading')
  const raleigh = new google.maps.LatLng(35.7796, 78.6382);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: raleigh,
    zoom: 15,
  });

  const request = {
    query: "Museum of Natural Sciences",
    fields: ["name", "geometry", "place_id", "formatted_address"],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }

        map.setCenter(results[0].geometry!.location!);
      }
    }
  );
}

function createMarker(place: google.maps.places.PlaceResult) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

function updateMap() {
  console.log('button clicked')
  const search = (<HTMLInputElement>document.getElementById('orgNameInput')).value

  const request = {
    query: search,
    fields: ["name", "geometry", "place_id", "formatted_address"],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
        console.log(results)
        // Show display box
        const displayBox = document.querySelector('#orgInfoDisplay')
        displayBox?.classList.remove('hidden');
        displayBox?.classList.add('flexColumn')

        //Set Org Name & Details
        let orgName = document.querySelector('#orgName') as HTMLHeadingElement
        orgName.innerHTML = results[0].name

        let orgAddress = document.querySelector('#orgAddress') as HTMLParagraphElement
        orgAddress.innerHTML = results[0].formatted_address

        // store Place_Id for later searches in local storage
        let searchId = results[0].place_id
        localStorage.setItem('organization', searchId)

        map.setCenter(results[0].geometry!.location!);
      }
    }
  );
}

export { };