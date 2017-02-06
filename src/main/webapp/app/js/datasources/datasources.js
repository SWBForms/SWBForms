var DBModel = "FST2015PM";

eng.dataSources["PMCatalog"] = {
    scls: "PMCatalog",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "titulo",
    fields: [
        {name:"claveEstado", title:"Clave de Estado", type:"string", required: true},
        {name:"claveMunicipio", title:"Clave de Municipio", type:"string", required: true},
        {name:"claveGeo", title:"Clave Geo", type:"string", required: true},
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "descripcion", title: "Descripción", type: "string"},
        {name:"incorporado", title:"Incorporado", type:"boolean"},
        {name:"fechaIncorporacion", title:"Fecha de incorporación", type: "date"},
        {name: "imagen", title: "Imagen", type: "string"}
    ]
};
eng.dataSources["Estado"] = {
    scls: "Estado",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Estado", required: true, type: "string"},
        {name: "clave", title: "Clave", required: true, type: "string"},
        {name: "abreviatura", title: "Nombre abreviatura", required: false, type: "string"}
    ]
};
eng.dataSources["Municipio"] = {
    scls: "Municipio",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Municipio", required: true, type: "string"},
        {name: "clave", title: "Clave", required: true, type: "string"},
        {name: "estado", title: "Estado", required: true, stype: "select", dataSource:"Estado"}
    ]
};
eng.dataSources["Geo"] = {
    scls: "Geo",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Geo", required: true, type: "string"},
        {name: "clave", title: "Clave", required: true, type: "string"},
        {name: "ambito", title: "Ambito", required: false, type: "string"}
    ]
};

eng.dataSources["Role"] = {
    scls: "Role",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "title",
    fields: [
        {name: "title", title: "Nombre", required: true, type: "string"}
    ]
};

eng.dataSources["DSEndpoint"] = {
    scls: "DSEndpoint",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "nombre",
    fields: [
        {name: "name", title: "Nombre", required: true, type: "string"},
        {name:"public", title:"Público", type:"boolean", required: true}
    ]
};
