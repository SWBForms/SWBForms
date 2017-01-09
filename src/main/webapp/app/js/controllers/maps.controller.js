(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('MapsCtrl', MapsCtrl);

    MapsCtrl.$inject = ['$scope', '$http'];
    function MapsCtrl($scope, $FileManager) {
      //Invoke dataviz functions here
      dataviz.mapsFactory.createMap("map1");
      //console.log(dataviz.maps.createMap(););
    };
})();
