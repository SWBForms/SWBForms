(function () {
    'use strict';

    angular
            .module('FST2015PM.services')
            .service('$PMCatalogService', PMCatalogService);

    PMCatalogService.$inject = ['$http', '$q'];//,'$stateParams', '$scope'

    function PMCatalogService($http, $q) {//$stateParams, $scope
        this.list = function (url) {
            var deferred = $q.defer();
            $http.get(url).then(
                function (response) { // Success callback
                    deferred.resolve(response.data); // Resolve
                },
                function (response) { // Error callback
                    deferred.reject(response); // Reject
                }
            );
            return deferred.promise;
        };
    }
    ;

})();



 