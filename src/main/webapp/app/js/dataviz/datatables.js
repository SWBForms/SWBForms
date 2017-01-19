/** Class to encapsulate data tables creation */
class DataTablesFactory {
  constructor() { }

  //TODO: Place specific code from here
  createDataTable(container, data, engine, options) {
    //Sample code
    $('#'+container).DataTable( {
        data: data
    } );
  }

  alinearColumna(container, data, alinear )
  $('#'+container).grid({
    dataSource: data
    columns: [ align: 'center'  ]
});

}
