(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('GridsterAngularCtrl', GridsterAngularCtrl);

  GridsterAngularCtrl.$inject = ["$scope", "$timeout", "$uibModal"];
  function GridsterAngularCtrl($scope, $timeout, $uibModal) {

    let dashboardObject = {
      id: "2",
      name: "dashboard 2",
      widgets: [{
          id: 1,
          col: 0,
          row: 0,
          sizeY: 1,
          sizeX: 1,
          content: '<div class="gridster-angular-content-item">Mapa</div>'
        },
        {
          id: 2,
          col: 2,
          row: 1,
          sizeY: 1,
          sizeX: 1,
          content: '<div class="gridster-angular-content-item">Data tables</div>'
        }
      ]
    };

    $scope.dashboards = {
      '1': {
        id: '1',
        name: 'dashboard 1',
        widgets: [{
            col: 0,
            row: 0,
            sizeY: 1,
            sizeX: 1,
            content: '<div class="gridster-angular-content-item">Chars</div>'
          },
          {
            col: 2,
            row: 1,
            sizeY: 1,
            sizeX: 1,
            content: '<div class="gridster-angular-content-item">Geo map</div>'
          }
        ]
      },
      '2': dashboardObject
    };

    $scope.gridsterOptions = {
      columns: 6,
      pushing: true,
      margins: [5, 5],
      mobileModeEnabled: true,
      draggable: {
        enabled: true,
        handle: 'h3'
      }
    };

    $scope.addWidget = function() {
      $scope.dashboard.widgets.push({
        content: '<div class="gridster-angular-content-item">Other Widget</div>',
        sizeX: 1,
        sizeY: 1
      });
    };

    $scope.clear = function() {
      $scope.dashboard.widgets = [];
    };

    /*Print the current dashboard*/
    $scope.$watch('selectedDashboardId', function(newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.dashboard = $scope.dashboards[newVal];
      } else {
        $scope.dashboard = $scope.dashboards[1];
      }
    });
    // init dashboard
    $scope.selectedDashboardId = '1';

  };

})();
