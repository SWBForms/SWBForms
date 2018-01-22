
eng.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};

eng.dataSources["Marcas"] = {
    scls: "Marcas",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "descripcion", title: "Descripción", type: "text"},
        {name: "foto", title: "Foto", stype: "file" },
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
        {name: "marcas", title: "Marcas", stype: "grid", dataSource:"Marcas"},
        {name: "foto", title: "Foto", stype: "file" },
    ]
};
