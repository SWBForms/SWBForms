(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ExtractorEditCtrl", ExtractorEditCtrl);

  ExtractorEditCtrl.$inject = ["$Datasource", "$stateParams", "$state", "$Extractor"];
  function ExtractorEditCtrl($Datasource, $stateParams, $state, $Extractor) {
    let cnt = this;
    cnt.formTitle = "Agregar extractor";
    cnt.extractorData = {};
    cnt.dsList = [];

    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar extractor";
      $Datasource.getObject($stateParams.id, "Extractor").then(ds => {
        cnt.extractorData = ds.data;
      });
    }

    $Datasource.listDatasources()
    .then(res => {
      if (res.data && res.data.length) {
        cnt.dsList = res.data;
        cnt.dsList.forEach(item => { item.id = item.name});

        $Datasource.listObjects("Extractor").then(res => {
          if(res.data.data && res.data.data.length) {
            res.data.data.forEach(item => {
              if (item._id !== cnt.extractorData._id) {
                let idx = cnt.dsList.map(item => { return item.name; }).indexOf(item.dataSource);
                if (idx > -1) {
                  cnt.dsList.splice(idx, 1);
                }
              }
            });
          }
        });
      }
    });

    cnt.submitForm = function(form) {
      if (form.$valid) {
        if (!cnt.extractorData._id) {
          $Datasource.addObject(cnt.extractorData, "Extractor")
          .then(response => {
            if (response.data && response.data.id) {
              $Extractor.loadExtractor(cnt.extractorData._id);
            }
            $state.go('admin.extractors', {});
          })
        } else {
          $Datasource.updateObject(cnt.extractorData, "Extractor")
          .then(response => {
            $Extractor.loadExtractor(cnt.extractorData._id);
            $state.go('admin.extractors', {});
          })
        }
      }
    };
  }

})();
