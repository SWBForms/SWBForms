(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('editDashboardCtrl', editDashboardCtrl)
    ;

  editDashboardCtrl.$inject = ["$scope", "$state","$stateParams", "$Datasource"];
  function editDashboardCtrl($scope, $state, $stateParams, $Datasource) {

    let deletedWidgets = [];
    $scope.dashboardName = "";

    let newDashboard = {
      name: $scope.dashboardName,
      widgets: []
    }

    if ($stateParams.id && $stateParams.id.length) {
      $Datasource.getObject($stateParams.id, "Dashboard").then(
        dashboard => {
          $scope.dashboard = dashboard.data;
          $scope.dashboardName = dashboard.data.name;
          $scope.dashboard.name = $scope.dashboardName;
          $scope.dashboard.widgets = [];
          if (dashboard.data.widgets.name) {
            console.log(dashboard.data.widgets);
            $Datasource.getObject(dashboard.data.widgets._id).then(widget => {
              console.log(widget);
              $scope.dashboard.widgets.push(widget);
            }).catch(error => {
              console.log(error);
            });
          } else {
            for (var i = 0; i < dashboard.data.widgets.length; i++) {
              console.log(dashboard.data.widgets);
              $Datasource.getObject(dashboard.data.widgets[i]._id).then(widget => {
                $scope.dashboard.widgets.push(widget);
                console.log(widget);
              }).catch(error => {
                console.log(error);
              });
            };
          }
        }
      );

      $scope.pageTitle = "Editar dashboard";

    } else {
      $scope.pageTitle = "Nuevo dashboard";
      $scope.dashboard = newDashboard;
    }

    if ($stateParams.mode == "view") {

      $scope.gridsterOptions = {
        columns: 6,
        pushing: true,
        margins: [5, 5],
        mobileModeEnabled: true,
        draggable: false,
        resizable: false
      };

      $scope.formVisible = false;
      $scope.desactiveClass = "desactive-element";

    } else {

      $scope.gridsterOptions = {
        columns: 6,
        pushing: true,
        margins: [5, 5],
        mobileModeEnabled: true,
        draggable: {
          enabled: true,
          handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']
        },
        resizable: {
          enabled: true
        }
      };

      $scope.formVisible = true;
    }

    $scope.addWidget = function() {
      let itemId = Date.now();
      $scope.dashboard.widgets.push({
        _id: itemId,
        name: 'widget',
        content: '<div class="gridster-angular-content-item"></div>',
        sizeX: 1,
        sizeY: 1
      });
    };

    $scope.editWidget = function($event) {
      let widgetId = $event.target.id;
      $.get('templates/dashboard/widgetEditForm.html', function(data) {
        bootbox.confirm(data, function(result) {
          if(result) {

            var data = {};

            $("#widgetForm input").each(function(index, value ) {
              data[$(value).attr('name')] = $(value).val();
            });

            $scope.$apply(function() {
              for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
                if($scope.dashboard.widgets[i]._id == widgetId) {
                  if (data['name'].length) {
                    $scope.dashboard.widgets[i].name = data['name'];
                  };
                  if (data['ancho'].length && $.isNumeric(data['ancho'])) {
                    $scope.dashboard.widgets[i].sizeX = data['ancho'];
                  };
                  if (data['alto'].length && $.isNumeric(data['alto'])) {
                    $scope.dashboard.widgets[i].sizeY = data['alto'];
                  };
                  if (data['row'].length && $.isNumeric(data['row'])) {
                    $scope.dashboard.widgets[i].row = data['row'];
                  };
                  if (data['col'].length && $.isNumeric(data['col'])) {
                    $scope.dashboard.widgets[i].col = data['col'];
                  };
                }
              }
            });

          }
        });
      });
    };

    $scope.save = function() {
      let dashboard = {};
      dashboard.name = $scope.dashboardName;
      let widgets = {};

      for (var i = 0; i < deletedWidgets.length; i++) {
        $Datasource.removeObject(deletedWidgets[i]._id, "Widget")
        .catch(function(error) {
          console.log(error);
        });
      };

      for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
        $Datasource.getObject($scope.dashboard.widgets[i]._id, "Widget")
        .then(function(result) {
          console.log(result);
        })
        .catch(function(error){
          console.log(error);
        });
      };

      dashboard.widgets = widgets;
      if ($scope.dashboard._id) {
        $Datasource.updateObject(dashboard,"Dashboard").
        then(response => {
          $state.go('dashboard.dashboards',{})
        })
      } else {
        $Datasource.addObject(dashboard, "Dashboard")
        .then(response => {
          $state.go('dashboard.dashboards', {});
        });
      }
    }

    $scope.deleteWidget = function($event) {
      let widgetId = $event.target.id;
      for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
        if($scope.dashboard.widgets[i]._id == widgetId) {
          deletedWidgets.push(widgetId);
          $scope.dashboard.widgets.splice(i, 1);
        }
      }
    }

    $scope.clear = function() {

      $.each($scope.dashboard.widgets, function(index, value) {
        deletedWidgets.push(value._id);
      });

      $scope.dashboard.widgets = [];
    };
  };

})();
