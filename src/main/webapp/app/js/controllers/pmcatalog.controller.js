(function () {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PMCatalog', PMCatalog);

PMCatalog.$inject = ['$scope', '$Datasource', 'Upload', '$timeout'];
function PMCatalog($scope, $Datasource, Upload, $timeout) {
  $scope.dbPM = {NAME: "", DESCRIPTION: "", PICTURE: "", CVE_ENT: "", CVE_MUN: "", CVE_MTW: "", ACCEPTED: false};
  $scope.listPMCatalog = [];
  $scope.show = "all";

  $scope.listPM = function () {
    //$PMCatalogService.list('/servicespm?action=list')
    $Datasource.listObjects("MagicTown")
      .then((response) => {
        console.log(response);
        let pmc = [];
        if (response.data.data && response.data.data.length) {
          pmc = response.data.data;
          pmc.forEach((item) => {
            if (item.PICTURE) {
              item.PICTURE = "../images/pm/"+item._id.substring(item._id.lastIndexOf(":") + 1) + "/" + item.PICTURE;
            } else {
              item.PICTURE = "../app/img/no-imagen.jpg";
            }
          });

          $scope.listPMCatalog = pmc;
          console.log($scope.listPMCatalog);
        }
    });
  }

  $scope.formPM = function (file) {
    if (file != null || file != undefined) {
      $scope.dbPM.file = file;
      file.upload = Upload.upload({
        url: 'fileupload',
        data: $scope.dbPM,
      });

      file.upload.then((response) => {
        $timeout(function () {
          file.result = response.data;
          $scope.show = "all";
          $scope.listPM();
        });
      }, (response) => {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      }, (evt) => {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    } else {
      if ($scope.show == 'add') {
        $Datasource.addObject($scope.dbPM, 'MagicTown').then(() => {
        //$PMCatalogService.savePM('/servicespm?action=add', $scope.dbPM).then(function () {
          $scope.show = "all";
          $scope.listPM();
        });
      } else if ($scope.show == 'update') {
        $Datasource.addObject($scope.dbPM, 'MagicTown').then(() => {
        //$PMCatalogService.savePM('/servicespm?action=update', $scope.dbPM).then(function () {
          $scope.show = "all";
          $scope.listPM();
        });
      }
    }
  }

  $scope.configAdd = function () {
    $scope.dbPM = {NAME: "", DESCRIPTION: "", PICTURE: "", CVE_ENT: "", CVE_MUN: "", CVE_MTW: "", ACCEPTED: false};
    $scope.show = "add";
    $scope.picFile = null;
  }

  $scope.configUpdate = function (_id) {
    $Datasource.getObject(_id, 'MagicTown').then((response) => {
      let pm = response.data && response.data.length ? response.data[0] : {};
    //$PMCatalogService.getById('/servicespm?action=detail&_id=' + _id).then(function (pm) {
      $scope.dbPM._id = pm._id;
      $scope.dbPM.NAME = pm.NAME;
      $scope.dbPM.DESCRIPTION = pm.DESCRIPTION;
      $scope.picFile = null;
      if (pm.PICTURE) {
        $scope.picFile = "/images/pm/" + pm._id.substring(pm._id.lastIndexOf(":") + 1) + "/" + pm.imagen;
      }
      $scope.dbPM.CVE_ENT = pm.CVE_ENT;
      $scope.dbPM.CVE_MUN = pm.CVE_MUN;
      $scope.dbPM.CVE_MTW = pm.CVE_MTW;
      $scope.dbPM.ACCEPTED = pm.ACCEPTED;
      $scope.show = "update";
    });
  }

  $scope.deletePM = function (_id) {
    bootbox.confirm("<h3>Este pueblo mágico será eliminado permanentemente. \n ¿Deseas continuar?</h3>", function (result) {
      if (result) {
        $Datasource.removeObject(_id, 'MagicTown').then(() => {
        //$PMCatalogService.delete('/servicespm?action=delete&id=' + _id).then(function () {
          $scope.listPMCatalog.filter((elem, i) => {
            if (elem._id === _id) {
              $scope.listPMCatalog.splice(i, 1);
            }
          });
        });
      }
    });
  };

  $scope.cancel = function () {
    $scope.show = "all";
  }

  $scope.listPM();
}

})();
