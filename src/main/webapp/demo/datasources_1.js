

eng.dataSources["Marcas"] = {
    scls: "Marcas",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "descripcion", title: "Descripción", type: "text"},
    ]
};

eng.dataSources["Productos"] = {
    scls: "Productos",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "descripcion", title: "Descripción", type: "text"},
        {name: "precio", title: "Precio", type: "float"},
        {name: "iva", title: "IVA", type: "float"},
        {name: "existencia", title: "Existencia", type: "int"},
        {name: "marca", title: "Marca", stype: "select", dataSource:"Marcas"},
        {name: "foto", title: "Foto", stype: "file", },
    ]
};

eng.dataSources["Estados"] = {
    scls: "Estados",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Paises"},
    ]
};

eng.dataSources["Paises"] = {
    scls: "Paises",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "abre", title: "Abre", required: true, type: "string"},
    ]
};

eng.dataSources["Variables"] = {
    scls: "Variables",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "valor", title: "valor", required: true, type: "string"},
    ]
};