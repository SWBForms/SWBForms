(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ["$scope", "$Datasource", "$timeout", "$stateParams", "$state"];
    function UsersCtrl($scope, $Datasource, $timeout, $stateParams, $state) {
      $scope.users = [];
      $scope.userData = {};
      $scope.password1 = "";
      $scope.password2 = "";
      $scope.idEdit = "";

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
     $scope.onload = function () {
         if($stateParams.id == undefined || $stateParams.id == null) {
            $scope.listUsers();
         } else {
             $scope.configEdit($stateParams.id);
         }
     }
     
     $scope.listUsers = function(){
         $Datasource.listObjects("User")
        .then((res) => {
          if (res.data && res.data.data) {
            $scope.users = res.data.data;
          }
        });
     }
     
     $scope.configEdit = function(id) {
          $Datasource.getObject(id, "User").then(user => {
              $scope.idEdit = id;
              $scope.userData = user.data;
          });
      }
      
      $scope.isPasswordEqual = function () {
        if ($scope.password1 == $scope.password2) {
            $scope.passwordEqual = true;
        } else {
            $scope.passwordEqual = false;
        }

     }

      $scope.submitForm = function(form) {
        let pw1 = form.password.$modelValue;
        let pw2 = form.password2.$modelValue;

        if (form.$valid && pw1 === pw2 && $scope.isEdit == "") {
          //TODO: Agregar usuario
          $scope.userData.password = pw1;
          $Datasource.addObject($scope.userData, "User")
            .then(response => {
                 $scope.listUsers();
                 $state.go('admin.users', {})
            })
        } else if($scope.isEdit != "") {
            $scope.userData._id = $scope.idEdit;
            $Datasource.updateObject($scope.userData, "User")
           .then((response) => {
               $scope.listUsers();
               $state.go('admin.users', {});
               $scope.userData = {};
            
           })
        }
      }
      
      $scope.deleteUsr = function (_id) {
          bootbox.confirm("<h3>Este usuario será eliminado permanentemente. \n ¿Deseas continuar?</h3>", function (result) {
            if (result) {
               $Datasource.removeObject(_id, "User")
                .then((response) => {
                  $scope.users.filter(function (elem, i) {
                  if (elem._id === _id) {
                    $scope.users.splice(i, 1);
                  }
                });
                })
            }
          });
        };
      
      $scope.onload();
    };
     

})();
