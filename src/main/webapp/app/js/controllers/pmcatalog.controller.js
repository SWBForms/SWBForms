(function () {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PMCatalog', PMCatalog);

PMCatalog.$inject = ['$scope', '$Datasource', 'Upload', '$timeout'];
function PMCatalog($scope, $Datasource, Upload, $timeout) {
  let municipalities = [];
  let localities = [];

  $scope.selectedState = {};
  $scope.selectedMuni = {};
  $scope.selectedLoc = {};
  $scope.dbPM = {NAME: "", DESCRIPTION: "", PICTURE: "", CVE_ENT: "", CVE_MUN: "", CVE_MTW: "", ACCEPTED: false};
  $scope.listPMCatalog = [];
  $scope.stateList = [];
  $scope.muniList = [];
  $scope.locList = [];
  $scope.show = "all";

  $Datasource.listObjects("State")
  .then((response) => {
    if (response.data.data && response.data.data.length) {
      $scope.stateList = _.sortBy(response.data.data, (item) => {
        return item.NOM_ENT;
      });
    }
  });

  $Datasource.listObjects("Municipality")
  .then((response) => {
    if (response.data.data && response.data.data.length) {
      municipalities = response.data.data;
    }
  });

  $Datasource.listObjects("Locality")
  .then((response) => {
    if (response.data.data && response.data.data.length) {
      localities = response.data.data;
    }
  });

  $scope.listPM = function () {
    //$PMCatalogService.list('/servicespm?action=list')
    $Datasource.listObjects("MagicTown")
    .then((response) => {
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
        $scope.listPMCatalog = pm;
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

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
          $scope.show = "all";
          $scope.listPM();
        });
      }, function (response) {
        if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    } else {
      if ($scope.show == 'add') {
        $PMCatalogService.savePM('/servicespm?action=add', $scope.dbPM).then(function () {
          $scope.show = "all";
          $scope.listPM();
        });
      } else if ($scope.show == 'update') {
        $PMCatalogService.savePM('/servicespm?action=update', $scope.dbPM).then(function () {
          $scope.show = "all";
          $scope.listPM();
        });
      }
    }
  };

  $scope.configAdd = function () {
    $scope.dbPM = {nombre: "", descripcion: "", imagen: "", claveEstado: "", claveMunicipio: "", claveGeo: "", incorporado: false};
    $scope.show = "add";
    $scope.picFile = null;
  }

  $scope.configUpdate = function (_id) {
    $PMCatalogService.getById('/servicespm?action=detail&_id=' + _id).then(function (pm) {
      $scope.dbPM._id = pm._id;
      $scope.dbPM.nombre = pm.nombre;
      $scope.dbPM.descripcion = pm.descripcion;
      $scope.picFile = null;
      if (pm.imagen) {
        $scope.picFile = "/images/pm/" + pm._id.substring(pm._id.lastIndexOf(":") + 1) + "/" + pm.imagen;
      }
      $scope.dbPM.claveEstado = pm.claveEstado;
      $scope.dbPM.claveMunicipio = pm.claveMunicipio;
      $scope.dbPM.claveGeo = pm.claveGeo;
      $scope.dbPM.incorporado = pm.incorporado;
      $scope.show = "update";
    });
  }

  $scope.deletePM = function (_id) {
    bootbox.confirm("<h3>Este pueblo mágico será eliminado permanentemente. \n ¿Deseas continuar?</h3>", function (result) {
      if (result) {
        $PMCatalogService.delete('/servicespm?action=delete&id=' + _id).then(function () {
          $scope.listPMCatalog.filter(function (elem, i) {
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

  $scope.updateMuniList = function() {
    $scope.selectedMuni = {};
    $scope.selectedLoc = {};
    if ($scope.selectedState) {
      $scope.muniList = _.filter(municipalities, (item) => {
        return item.CVE_ENT == $scope.selectedState.CVE_ENT;
      });
    } else {
      $scope.muniList = [];
    }
  };

  $scope.updateLocList = function() {
    $scope.selectedLoc = {};
    if ($scope.selectedMuni) {
      $scope.locList = _.filter(localities, (item) => {
        return item.CVE_MUN == $scope.selectedMuni.CVE_MUN;
      });
    } else {
      $scope.locList = [];
    }
  };

  $scope.listPM();
}

})();
