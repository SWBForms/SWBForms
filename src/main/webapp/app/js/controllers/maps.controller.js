(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('MapsCtrl', MapsCtrl);

    MapsCtrl.$inject = ['$scope', '$http'];
    function MapsCtrl($scope, $http) {
      //LEAFLET
      let mochis = [25.793, -108.977];
      let df = [ 19.419444, -99.14555 ];

      let leaf = dataviz.mapsFactory.createMap("map1",ENGINE_LEAFLET_DUAL, df, 10);
      let mp2 = dataviz.mapsFactory.createMap("map3",ENGINE_LEAFLET_DUAL, df,5 );
      let googleMap = dataviz.mapsFactory.createMap("map", ENGINE_GOOGLEMAPS, df,10);
      let leaf2 = dataviz.mapsFactory.createMap("mapButt",ENGINE_LEAFLET, mochis, 10);

      dataviz.mapsFactory.addSimpleMarker(df, mp2);
      $http({
        url: "/app/mockdata/geo/PM_15_municipio.geojson",
        method: "GET"
      }).then((res) => {
      //  console.log(res.data);
        dataviz.mapsFactory.addGeoJSONLayer(leaf, res.data, ENGINE_LEAFLET);
        dataviz.mapsFactory.addGeoJSONLayer(googleMap, res.data, ENGINE_GOOGLEMAPS);
      });

      $http({
        url: "/app/mockdata/geo/PM_15_puntos_complem.geojson",
        method: "GET"
      }).then((res) => {
        dataviz.mapsFactory.addCircleMarker(mp2, res.data);
        dataviz.mapsFactory.addGeoJSONLayer(mp2, res.data,ENGINE_LEAFLET );
        dataviz.mapsFactory.addGeoJSONLayer(googleMap, res.data, ENGINE_GOOGLEMAPS);
      });

      $http({
        url: "/app/mockdata/geo/PM_15_puntos_complem.geojson",
        method: "GET"
      }).then((res) => {
        dataviz.mapsFactory.addMarker(leaf, res.data, ENGINE_LEAFLET);
      });

      //Google Maps
      /*
      Direction for google maps
      DRIVING
      BICYCLING
      TRANSIT
      WALKING
    */
    let cu = {lat: 19.3216466, lng: -99.202668};
    let ipnTurismo = {lat: 19.514384, lng: -99.140244};

    dataviz.mapsFactory.addRoute(googleMap, ipnTurismo, cu, 'DRIVING', ENGINE_GOOGLEMAPS);

    let market2 = {lat: 19.515260, lng: -99.142244};
    let market3 = {lat: 19.51136, lng: -99.13800};


    dataviz.mapsFactory.addRoute(googleMap, market2, 'Pabellón lindavista', ENGINE_GOOGLEMAPS);
    dataviz.mapsFactory.addRoute(googleMap, market3, 'Escuela nacional de turismo', ENGINE_GOOGLEMAPS);

    };
})();
