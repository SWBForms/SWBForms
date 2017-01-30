(function () {
    'use strict';

    angular
            .module('FST2015PM.controllers')
            .controller('PMCatalog', PMCatalog);

    PMCatalog.$inject = ['$scope', '$PMCatalogService'];
    function PMCatalog($scope, $PMCatalogService) {
        $scope.listPMCatalog = [];

        $scope.listPM = function () {
            $PMCatalogService.list('/servicespm').then(function(pm){
                console.log("Ejecucion de datos: " + JSON.stringify(pm));
            });
        }

        $scope.listPM();

    }

})();
