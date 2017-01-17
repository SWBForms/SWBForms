(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('MapsCtrl', MapsCtrl);

    MapsCtrl.$inject = ['$scope', '$http'];
    function MapsCtrl($scope, $http) {
      //Invoke dataviz functions here
      let mp = dataviz.mapsFactory.createMap("map1",ENGINE_LEAFLET );
      let mark1 = dataviz.mapsFactory.addMarker(mp, [25.789, -109.004]);
      let mark2 = dataviz.mapsFactory.addMarker(mp, [25.761, -108.967]);

      $http({
        url: "/app/mockdata/geo/PM_15_municipio.geojson",
        method: "GET"
      }).then((res) => {
        console.log(res.data);
        dataviz.mapsFactory.addGeoJSONLayer(mp, res.data);
      });

      $http({
        url: "/app/mockdata/geo/coordenadas.json",
        method: "GET"
      }).then((res) => {
        console.log(res.data);
        dataviz.mapsFactory.makePolygon(mp, res.data);
      });
      let popUp = dataviz.mapsFactory.addPopUp(mark1, "The most beautiful place in this town", true);
      let popUp2 = dataviz.mapsFactory.addPopUp(mark2, "adventure", false);
      let mark3 = dataviz.mapsFactory.addMarker(mp, [25.761, -110.967]);

      $http({
        url: "/app/mockdata/geo/PM_15_municipio.geojson",
        method: "GET"
      }).then((res) => {
      //  console.log(res.data);
        dataviz.mapsFactory.addGeoJSONLayer(mp, res.data);
      });

      $http({
        url: "/app/mockdata/geo/PM_15_puntos_complem.geojson",
        method: "GET"
      }).then((res) => {
        dataviz.mapsFactory.addGeoJSONLayer(mp, res.data);
      });

      //dataviz.mapsFactory.addGeoJSONLayer(mp, data);

      //console.log(dataviz.maps.createMap(););
    };
})();
