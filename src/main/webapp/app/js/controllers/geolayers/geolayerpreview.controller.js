(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("GeolayerPreviewCtrl", GeolayerPreviewCtrl);

    GeolayerPreviewCtrl.$inject = ["$Datasource", "$stateParams", "$state"];
    function GeolayerPreviewCtrl($Datasource, $stateParams, $state) {
      let cnt = this;
      cnt.layerData = {};

      if ($stateParams.id && $stateParams.id.length) {
        $Datasource.getObject($stateParams.id, "GeoLayer").then(layer => {
          cnt.layerData = layer.data;
        });
      }

    }

})()
