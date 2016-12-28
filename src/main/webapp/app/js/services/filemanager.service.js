(function() {
  'use strict';

  angular
    .module('FST2015PM.services')
    .service('$FileManager', FileManager);

  FileManager.$inject = ['$http'];
  function FileManager($http) {
    var rootPath = "/app/js/datasources",
        gatewayPath = "/swbforms/jsp/fileManager.jsp",
        service = {};

    service.setConfig = setConfig;
    service.getFile = getFile;
    service.saveFile = saveFile;
    service.initFile = initFile;
    service.getFiles = getFiles;

    return service;

    function setConfig(conf) {
      rootPath = conf.rootPath || "/app/js/datasources";
      gatewayPath = conf.gatewayPath || "/swbforms/jsp/fileManager.jsp";
    };

    function getFile(filename) {
      if (filename === undefined) return;
      var theUrl = gatewayPath + "?file=" + filename;
      var request = $http({
        url: theUrl,
        method: "GET"
      });
      return request;
    };

    function saveFile(filename, filecontent) {
      if (filename === undefined) return;
      var theUrl = gatewayPath + "?file=" + filename;
      var request = $http({
        url: theUrl,
        method: "POST",
        data: filecontent
      });

      return request;
    };

    function initFile(filename, override) {
      if (filename === undefined) return;
      var ow = override || false,
          theUrl = gatewayPath + "?file=" + filename + "&override=" + ow;

      var request = $http({
        url: theUrl,
        method: "PUT"
      });

      return request;
    };

    function getFiles() {
      var theUrl = gatewayPath;
      var request = $http({
        url: theUrl,
        method: "GET"
      });

      return request;
    };

  };

})();
