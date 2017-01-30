eng.dataSources["PMCatalog"] = {
    scls: "PMCatalog",
    modelid: "PueblosMagicos",
    dataStore: "mongodb",
    displayField: "titulo",
    fields: [
        {name: "titulo", title: "Titulo", required: true, type: "string"},
        {name: "descripcion", title: "Descripción", type: "string"},
        {name: "imagen", title: "Imagen", type: "string"},
    ]
};
