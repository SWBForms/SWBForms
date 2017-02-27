(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('editDashboardCtrl', editDashboardCtrl)
    ;

  editDashboardCtrl.$inject = ["$scope", "$state","$stateParams","$Datasource"];
  function editDashboardCtrl($scope, $state, $stateParams, $Datasource) {

    $scope.dashboardName = "";
    let dashboardId = Date.now();

    let dashboardObject = {
      id: dashboardId,
      name: $scope.dashboardName,
      widgets: []
    }

    if ($stateParams.id) {
      $Datasource.getObject($stateParams.id,"Dashboard");
      if ($stateParams.mode) {
        
      };
      $scope.pageTitle = "Editar dashboard";
      $scope.dashboard = [];
      $scope.formVisible = true;
    } else {
      $scope.pageTitle = "Nuevo dashboard";
      $scope.formVisible = true;
      $scope.dashboard = dashboardObject;
    }

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
      let itemId = Date.now();
      $scope.dashboard.widgets.push({
        id: itemId,
        name: 'widget',
        content: '<div class="gridster-angular-content-item"></div>',
        sizeX: 1,
        sizeY: 1
      });
    };

    $scope.editWidget = function($event) {
      let widgetId = $event.target.name;

      var form = $(
        '<form id="widgetForm" action=""> \
        <div class="form-group"> \
          <label for="Name">Nombre: </label> \
          <input type="text" class="form-control" name="name" placeholder="nombre" /> \
        </div> \
        <div class="form-group"> \
          <label for="Ancho">Ancho: </label> \
          <input type="text" class="form-control" name="ancho" placeholder="3" /> \
        </div> \
        <div class="form-group"> \
        <label for="Alto">Alto: </label> \
          <input type="text" class="form-control" name="alto" placeholder="3" /> \
        </div> \
        <div class="form-group"> \
          <label for="Columna">Columna</label> \
          <input type="text" class="form-control" name="col" placeholder="1" /> \
        </div> \
        <div class="form-group"> \
          <label for="Renglon">Renglon</label> \
            <input type="text" class="form-control" name="row" placeholder="1" /> \
        </div> \
        </form>');

      bootbox.confirm(form, function(result) {
        if(result) {

          var data = {};

          $("#widgetForm input").each(function(index, value ) {
            data[$(value).attr('name')] = $(value).val();
          });

          $scope.$apply(function() {
            for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
              if($scope.dashboard.widgets[i].id == widgetId) {
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
    };

    $scope.save = function() {
      let dashboard = {};
      dashboard.name = $scope.dashboardName;
      let widgets = [];

      for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
          widgets.push(
            { "id": $scope.dashboard.widgets[i].id, "name": $scope.dashboard.widgets[i].name }
          );  
      }

      dashboard.widgets = widgets;
      $Datasource.addObject(dashboard, "Dashboard")
      .then(response => {
        $state.go('dashboard.dashboards', {});
      });
    }

    $scope.deleteWidget = function($event) {
      let widgetId = $event.target.name;
      for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
        if($scope.dashboard.widgets[i].id == widgetId) {
          $scope.dashboard.widgets.splice(i, 1);
        }
      }
    }

    $scope.clear = function() {
      $scope.dashboard.widgets = [];
    };
  };

})();
