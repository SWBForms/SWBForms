let dataviz = window.dataviz || (function () {
  let mod = {version:"1.0.0"};
  
  mod.chartsFactory = new ChartsFactory();
  mod.mapsFactory = new MapsFactory();
  mod.dataTablesFactory = new DataTablesFactory();

  return mod;
})();
