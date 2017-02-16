(function() {
  'use strict';

  angular
  .module('FST2015PM.controllers')
  .controller('UsersCtrl', UsersCtrl);

  UsersCtrl.$inject = ["$scope", "$Datasource", "$timeout", "$stateParams", "$state", "$q"];
  function UsersCtrl($scope, $Datasource, $timeout, $stateParams, $state, $q) {
    $scope.users = [];
    $scope.userData = {};
    $scope.password1 = "";
    $scope.password2 = "";
    $scope.idEdit = "";
    $scope.usrData = {};
    $scope.usrData.userRole = [];
    $scope.roleList = [];

    $scope.onload = function () {
      $scope.userData = {};
      $scope.usrData.userRole = [];

      if(($stateParams.id == undefined || $stateParams.id == null) && $stateParams.action == null) {
        $scope.listUsers();
      } else if($stateParams.action == "add"){
        $scope.onLoadRoles();
      } else {
        $scope.configEdit($stateParams.id);
        $scope.onLoadRoles();
      }

    }

    $scope.onLoadRoles = function() {
      $Datasource.listObjects("Role")
      .then((res) => {
        if (res.data && res.data.data) {
          $scope.roleList = res.data.data;
        }
      });
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
        $Datasource.listObjects("UserRole", [{name:"user", value:$scope.userData._id}])
        .then((response) => {
          if(response.data && response.data.length) {
            $scope.getRoleUsr(response.data);
          }
        })
      });

    }

    $scope.getRoleUsr = function (listUsrRole) {
      var deferred = $q.defer();
      var deferreds = [];
      listUsrRole.forEach(function(userRol) {
        var obj = $Datasource.getObject(userRol.role, "Role").then(role => {
          $scope.usrData.userRole.push(role.data._id);
        });
        deferreds.push(obj);
      });
      $q.all(deferreds).then(function() {
        deferred.resolve(true);
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
      var deferred = $q.defer();


      if (form.$valid && pw1 === pw2 && $scope.idEdit == "") {
        var deferreds = [];
        $scope.userData.password = pw1;
        $Datasource.addObject($scope.userData, "User")
        .then(response => {
          $scope.saveRoles(response.data.response.data).then((result) => {
            $scope.listUsers();
            $state.go('admin.users', {})
          })
        })
      } else if($scope.idEdit != "") {
        $scope.userData._id = $scope.idEdit;
        $Datasource.updateObject($scope.userData, "User")
        .then((response) => {
          $scope.saveRoles(response.data.response.data).then((result)=>{
            $scope.listUsers();
            $state.go('admin.users', {})
          })
        })
      }
    }

    $scope.saveRoles = function(userData) {
      var deferred = $q.defer();
      //$Datasource.getListObjByProp(userData._id, "user" ,"UserRole")
      $Datasource.listObjects("UserRole", [{name:"user", value:userData._id}])
      .then((response) => {
        var deferreds = [];
        var deferreds2 = [];
        if(response.data && response.data.length) {
          response.data.forEach(function(userRol) {
            var removeObj = $Datasource.removeObject(userRol._id, "UserRole");
            deferreds2.push(removeObj);
          })
        }
        $scope.usrData.userRole.forEach(function (role) {
          var newRelationship = {
            user: userData._id,
            role: role
          };
          var oneRelationship = $Datasource.addObject(newRelationship, "UserRole")
          deferreds.push(oneRelationship);
        })
        $q.all(deferreds, deferreds2).then(function() {
          deferred.resolve(true);
        });
      })
      return deferred.promise;
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
          $Datasource.listObjects("UserRole", [{name:"user", value:_id}])
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
