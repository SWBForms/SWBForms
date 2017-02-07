(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ["$scope", "$Datasource", "$timeout"];
    function UsersCtrl($scope, $Datasource, $timeout) {
      $scope.users = [];
      $scope.userData = {};

      //Ejemplos de uso del servicio para manejo de usuarios

      /*$Datasource.addObject({name:"Otro usuario", email:"otro@gmail.com", password:"1234"}, "User")
        .then((response) => {
          console.log(response);
      })
      /*$Datasource.updateObject({_id:"_suri:FST2015PM:User:589a5a1c77c81a106c3457b1", fullname:"Otro usuario"}, "User")
        .then((response) => {
          console.log(response);
      })
      $Datasource.removeObject("_suri:FST2015PM:User:589a5a1c77c81a106c3457b1", "User")
        .then((response) => {
          console.log(response);
        })*/

      $Datasource.listObjects("User")
        .then((res) => {
          if (res.data && res.data.data) {
            $scope.users = res.data.data;
          }
        });

      $scope.submitForm = function(form) {
        let pw1 = form.password.$modelValue;
        let pw2 = form.password2.$modelValue;

        if (form.$valid && pw1 === pw2) {
          //TODO: Agregar usuario
        }
      }
    };

})();
