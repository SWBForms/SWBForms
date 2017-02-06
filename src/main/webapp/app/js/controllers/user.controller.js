(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ["$scope", "$Datasource", "$timeout"];
    function UsersCtrl($scope, $Datasource, $timeout) {
      $scope.users = [];
      $scope.userData = {};

      $Datasource.listObjects("User")
        .then((res) => {
          if (res.data && res.data.data) {
            $scope.users = res.data.data;
          }
        });

        /*$timeout(function() {
          $("#usersTable").DataTable({});
        });*/

      $scope.submitForm = function(form) {
        let pw1 = form.password.$modelValue;
        let pw2 = form.password2.$modelValue;

        if (form.$valid && pw1 === pw2) {
          //TODO: Agregar usuario
        }
      }
    };

})();
