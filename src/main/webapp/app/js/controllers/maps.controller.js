(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('MapsCtrl', MapsCtrl);

    MapsCtrl.$inject = ['$scope', '$http'];
    function MapsCtrl($scope, $http) {
      //Invoke dataviz functions here

      let request = $http({
        url: "/app/mockdata/geo/PM_15_municipio.geojson",
        method: "GET"
      }).then((res) => {
        console.log(res.data);
        let mp = dataviz.mapsFactory.createMap("map1");
        dataviz.mapsFactory.addGeoJSONLayer(mp, res.data);
      });

      //dataviz.mapsFactory.addGeoJSONLayer(mp, data);

      //console.log(dataviz.maps.createMap(););
    };
})();
