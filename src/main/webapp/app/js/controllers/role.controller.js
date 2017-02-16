(function() {
  'use strict';

  angular
  .module('FST2015PM.controllers')
  .controller('RolesCtrl', RolesCtrl);

  RolesCtrl.$inject = ["$scope", "$Datasource", "$timeout", "$stateParams", "$state"];
  function RolesCtrl($scope, $Datasource, $timeout, $stateParams, $state) {
    $scope.roles = [];
    $scope.roleData = {};
    $scope.idEdit = "";

    $scope.onload = function () {
      if(($stateParams.id == undefined || $stateParams.id == null) && $stateParams.action == null) {
        $scope.listRole();
      } else if($stateParams.id != null && $stateParams.id != ""){
        $scope.configEdit($stateParams.id);
      }
    }

    $scope.listRole = function(){
      $Datasource.listObjects("Role")
      .then((res) => {
        if (res.data && res.data.data) {
          $scope.roles = res.data.data;
        }
      });
    }

    $scope.configEdit = function(id) {
      $Datasource.getObject(id, "Role").then(role => {
        $scope.idEdit = id;
        $scope.roleData = role.data;
      });
    }

    /*$timeout(function() {
    $("#usersTable").DataTable({});
  });*/

  $scope.submitForm = function(form) {
    if (form.$valid && $scope.idEdit == "") {
      $Datasource.addObject($scope.roleData, "Role")
      .then(response => {
        $scope.listRole();
        $state.go('admin.roles', {})
      })
    } else if(form.$valid && $scope.idEdit != ""){
      $scope.roleData._id = $scope.idEdit;
      $Datasource.updateObject($scope.roleData, "Role")
      .then((response) => {
        $scope.listRole();
        $state.go('admin.roles', {});
        $scope.roleData = {};

      })
    }
  }

  $scope.deleteRole = function (_id) {
    bootbox.confirm("<h3>Este rol será eliminado permanentemente. \n ¿Deseas continuar?</h3>", function (result) {
      if (result) {
        $Datasource.removeObject(_id, "Role")
        .then((response) => {
          $scope.roles.filter(function (elem, i) {
            if (elem._id === _id) {
              $scope.roles.splice(i, 1);
            }
          });
        })
        //$Datasource.getListObjByProp(_id, "role" ,"UserRole")
        $Datasource.listObjects("UserRole", [{name:"role", value:_id}])
        .then((response) => {
          if(response.data && response.data.length) {
            response.data.forEach(function(userRol) {
              $Datasource.removeObject(userRol._id, "UserRole");
            })
          }
        })
      }
    });
  };

  $scope.onload();
};

})();
