(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('SideNavCtrl', SideNavCtrl);

    SideNavCtrl.$inject = ["$scope", "menuItems", "$state", "$timeout"];
    function SideNavCtrl($scope, menuItems, $state, $timeout) {
      $scope.menuItems = menuItems;
      $scope.$state = $state;

      $scope.click = function(item) {
        if (!item.menuItems && item.stateLink) {
          $state.go(item.stateLink);
        }
      };

      $timeout(function() {
        $("#side-menu").metisMenu({preventDefault:false});
      });
    };

})();
