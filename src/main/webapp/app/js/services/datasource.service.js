(function() {
  'use strict';

  angular
    .module('FST2015PM.services')
    .service('$Datasource', DataSource);

  DataSource.$inject = ['$http'];
  function DataSource($http) {
    let service = {};

    service.listDatasources = listDatasources;
    service.listObjects = listObjects;
    //service.addObject = addObject;
    //service.updateObject = updateObject;
    //service.getObject = getObject;
    //service.removeObject = removeObject;

    return service;

    function listDatasources() {
      let theUrl = "/api/datasources"
      let request = $http({
        url: theUrl,
        method: "GET"
      });
      return request;
    };

    function listObjects(dsName) {
      let theUrl = `/api/datasources/${dsName}`;
      let request = $http({
        url: theUrl,
        method: "GET"
      });
      return request;
    };

  };

})();
