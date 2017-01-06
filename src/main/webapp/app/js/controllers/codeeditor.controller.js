(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('CodeEditorCtrl', CodeEditorCtrl);

    CodeEditorCtrl.$inject = ['$scope', '$stateParams', '$ocLazyLoad', '$FileManager'];
    function CodeEditorCtrl($scope, $stateParams, $ocLazyLoad, $FileManager) {
      //console.log($stateParams);

      $scope.fileContent = 'var theVar = ""';
      $scope.fileName = $stateParams.id;
      $scope.editorOptions = {
        lineNumbers: true,
        smartIndent: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        continueComments: true,
        gutters: ["CodeMirror-lint-markers"],
        lint: true,
        mode: 'javascript'
      };

      $scope.save = function() {
        $FileManager.saveFile("test.js")
        .then(function(res) {
          console.log(res);
        });
      }
    };

})();
