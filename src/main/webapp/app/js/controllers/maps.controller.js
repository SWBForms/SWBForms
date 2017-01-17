(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('MapsCtrl', MapsCtrl);

    MapsCtrl.$inject = ['$scope', '$http'];
    function MapsCtrl($scope, $http) {
      //Invoke dataviz functions here
      let mp = dataviz.mapsFactory.createMap("map1", ENGINE_LEAFLET);
      let googleMap = dataviz.mapsFactory.createMap("map1Google", ENGINE_GOOGLEMAPS);

      $http({
        url: "/app/mockdata/geo/PM_15_municipio.geojson",
        method: "GET"
      }).then((res) => {
        dataviz.mapsFactory.addGeoJSONLayer(mp, res.data, ENGINE_LEAFLET);
        dataviz.mapsFactory.addGeoJSONLayer(googleMap, res.data, ENGINE_GOOGLEMAPS);
      });

      $http({
        url: "/app/mockdata/geo/PM_15_puntos_complem.geojson",
        method: "GET"
      }).then((res) => {
        dataviz.mapsFactory.addGeoJSONLayer(mp, res.data);
        dataviz.mapsFactory.addGeoJSONLayer(googleMap, res.data, ENGINE_GOOGLEMAPS);
      });

      /*
        Direction for google maps
        DRIVING
        BICYCLING
        TRANSIT
        WALKING
      */

      var cu = {lat: 19.3216466, lng: -99.202668};
      var ipnTurismo = {lat: 19.514384, lng: -99.140244};

      dataviz.mapsFactory.addRoute(googleMap, ipnTurismo, cu, 'DRIVING', ENGINE_GOOGLEMAPS);

      var market2 = {lat: 19.515260, lng: -99.142244};
      var market3 = {lat: 19.51136, lng: -99.13800};

      dataviz.mapsFactory.addRoute(googleMap, market2, 'Pabellón lindavista', ENGINE_GOOGLEMAPS);
      dataviz.mapsFactory.addRoute(googleMap, market3, 'Escuela nacional de turismo', ENGINE_GOOGLEMAPS);

      //dataviz.mapsFactory.addGeoJSONLayer(mp, data);

      //console.log(dataviz.maps.createMap(););
    };
})();
