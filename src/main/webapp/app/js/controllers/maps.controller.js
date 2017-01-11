(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('MapsCtrl', MapsCtrl);

    MapsCtrl.$inject = ['$scope', '$http'];
    function MapsCtrl($scope, $http) {
      //Invoke dataviz functions here
      let mp = dataviz.mapsFactory.createMap("map1");

      $http({
        url: "/app/mockdata/geo/PM_15_municipio.geojson",
        method: "GET"
      }).then((res) => {
        console.log(res.data);
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
