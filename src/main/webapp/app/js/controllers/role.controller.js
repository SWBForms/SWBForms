(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('RolesCtrl', RolesCtrl);

    RolesCtrl.$inject = ["$scope", "$Datasource", "$timeout"];
    function RolesCtrl($scope, $Datasource, $timeout) {
      $scope.roles = [];
      $scope.roleData = {};

      $Datasource.listObjects("Role")
        .then((res) => {
          console.log(res);
          /*if (res.data && res.data.data) {
            $scope.users = res.data.data;
          }*/
        });

        /*$timeout(function() {
          $("#usersTable").DataTable({});
        });*/

      $scope.submitForm = function(form) {
        if (form.$valid) {
          //TODO: Agregar usuario
        }
      }
    };

})();
