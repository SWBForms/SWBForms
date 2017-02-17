(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('GridsterAngularCtrl', GridsterAngularCtrl)
    .directive('removable', function() {
      return {
        link: function(scope, element, attr, controller) {
          element.on('click', function() {
            let dashboardIndex = scope.selectedDashboardId;
            let itemId = $(element).attr('id');

            let widgets = scope.dashboards[dashboardIndex];
            for(var i=0 ; i < widgets.length; i++) {
              if(widgets[i].id == itemId)
                  widgets.splice(itemId);
            }

            scope.dashboards[dashboardIndex].widgets = widgets;
            scope.dashboard = dashboards[dashboardIndex];
          });
        }
      };
    });

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
            id: 1,
            col: 0,
            row: 0,
            sizeY: 4,
            sizeX: 1,
            content: '<div class="gridster-angular-content-item">Chars</div>'
          },
          {
            id: 2,
            col: 4,
            row: 0,
            sizeY: 2,
            sizeX: 1,
            content: '<div class="gridster-angular-content-item">Chars 2</div>'
          },
          {
            id: 3,
            col: 1,
            row: 1,
            sizeY: 2,
            sizeX: 3,
            content: '<div class="gridster-angular-content-item">Geo map</div>'
          },
          {
            id: 4,
            col: 1,
            row: 3,
            sizeY: 4,
            sizeX: 4,
            content: '<div class="gridster-angular-content-item">Item</div>'
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
      count = dashboard.widgets.length;
      itemId = count + 1;
      $scope.dashboard.widgets.push({
        id: itemId,
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
