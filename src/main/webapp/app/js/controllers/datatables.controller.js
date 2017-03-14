(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('DataTablesCtrl', DataTablesCtrl);

    DataTablesCtrl.$inject = ['$scope', '$http'];
    function DataTablesCtrl($scope, $http) {
      //Invoke dataviz functions here
      let request = $http({
        url: "/app/mockdata/datatables.json",
        method: "GET"
      }).then((res) => {
        dataviz.dataTablesFactory.createDataTable("example", res.data);
      });
    };
})();
