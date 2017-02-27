(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("DashboardListCtrl", DashboardListCtrl);

  DashboardListCtrl.$inject = ["$Datasource", "$stateParams", "$state"];
  function DashboardListCtrl($Datasource, $stateParams, $state) {
    let context = this;
    context.formTitle = "Agregar Dashboard";
    context.dashboardList = [];
    context.dashboardData = {};

    if($stateParams.id && $stateParams.id.length) {
      context.formTitle = "Editar Dashboard";
      $Datasource.getObject($stateParams.id, "Dashboard").then(
        dashboard => { context.dashboardData = dashboard.data; }
      );
    }

    $Datasource.listDatasources()
    .then(res => {
      if (res.data && res.data.length) {
        $Datasource.listObjects("Dashboard").then(res => {
          context.dashboardList = res.data.data;
        });
      }
    });

    context.submitForm = function(form) {
      if (form.$valid) {
        if (!context.dashboardData._id) {
          $Datasource.addObject(context.dashboardData, "Dashboard")
          .then(response => {
            $state.go('dashboard.addDashboard', {});
          })
        } else {
          $Datasource.updateObject(context.dashboardData, "Dashboard")
          .then(response => {
            $state.go('dashboard.editDashboard', {});
          })
        }
      }
    };

  }

})();
