/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck TODO remove when fixed

import { Loader } from '@googlemaps/js-api-loader';

async function initMap() {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['places'],
  });
  const google = await loader.load();
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 8,
      center: { lat: 6.537216, lng: 3.3521664 },
    }
  );
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  (document.getElementById('floating-form') as HTMLElement).addEventListener(
    'submit',
    () => geocodeLatLng(geocoder, map, infowindow)
  );
}

function geocodeLatLng(
  geocoder: google.maps.Geocoder,
  map: google.maps.Map,
  infowindow: google.maps.InfoWindow
) {
  const input = (document.getElementById('latlng') as HTMLInputElement).value;
  const latlngStr = input.split(',', 2);
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1]),
  };

  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      if (response.results[0]) {
        map.setZoom(11);

        const marker = new google.maps.Marker({
          position: latlng,
          map: map,
        });

        infowindow.setContent(response.results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    })
    .catch((e) => alert('Geocoder failed due to: ' + e));
}

initMap();
