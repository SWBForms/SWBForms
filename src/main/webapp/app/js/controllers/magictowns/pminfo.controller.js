(function () {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PMInformation', PMInformation);

  PMInformation.$inject = ["$Datasource", "$stateParams", "$state"];
  function PMInformation($Datasource, $stateParams, $state) {
    let cnt = this;
    cnt.pmData = {};
    console.log("Injected controller");

    if ($stateParams.id && $stateParams.id.length) {
      console.log($stateParams.id);
      $Datasource.getObject($stateParams.id, "MagicTown").then(mtown => {
        cnt.pmData = mtown.data;
        cnt.pmData.atractives = cnt.pmData.atractives.replace(/(?:\r\n|\r|\n)/g, '<br />');
        cnt.pmData.festivities = cnt.pmData.festivities.replace(/(?:\r\n|\r|\n)/g, '<br />');
      });
    }
  };

})();
