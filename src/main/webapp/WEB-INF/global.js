//******* DataStores ***************
var DBModel = "FST2015PM";

eng.config={
    baseDatasource:"/WEB-INF/global.js",
    mail:{
        from:"xxx@gmail.com",
        fromName:"Name",
        host:"smtp.gmail.com",
        user:"email.gmail.com",
        passwd:"password",
        port:25,
        ssl:true,
        sslPort:465
    }
};

//******* DataStores ***************
eng.dataStores["mongodb"]={
    host:"localhost",
    port:27017,
    class: "org.semanticwb.datamanager.datastore.DataStoreMongo",
};
/*
eng.dataStores["ts_leveldb"]={
    path:"/data/leveldb",
    class: "org.semanticwb.datamanager.datastore.SemDataStore",
};
*/
//******* DataSorices ************
eng.dataSources["User"]={
    scls: "User",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "fullname",
    fields:[
        {name:"fullname",title:"Nombre",type:"string"},
        {name:"password",title:"Contraseña",type:"password"},
        {name:"email",title:"Correo electrónico",type:"string", validators: [{type:"isUnique"}]},
        {name: "roles", title: "Roles", stype: "select", multiple:true , dataSource:"Role"}
        //{name:"roles",title:"Roles",stype:"select", valueMap:{director:"Director",gerente:"Gerente",subgerente:"Subgerente"},multiple:true},
        //{name:"groups",title:"Grupos",stype:"select", valueMap:{infotec:"INFOTEC",dac:"DAC",gdnps:"GDNPS",dads:"DADS"},multiple:true},
    ],
};
eng.dataSources["Role"] = {
    scls: "Role",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "title",
    fields: [
        {name: "title", title: "Nombre", required: true, type: "string"},
        {name: "desription", title: "Descripción", required: true, type: "string"}
    ]
};

eng.dataSources["UserSession"]={
    scls: "UserSession",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "user",
    fields:[
        {name:"user",title:"Usuario",type:"string"},
        {name:"token",title:"Token",type:"string"},
        {name:"expiration",title:"Expiración",type:"long"}
        //{name:"roles",title:"Roles",stype:"select", valueMap:{director:"Director",gerente:"Gerente",subgerente:"Subgerente"},multiple:true},
        //{name:"groups",title:"Grupos",stype:"select", valueMap:{infotec:"INFOTEC",dac:"DAC",gdnps:"GDNPS",dads:"DADS"},multiple:true},
    ],
};

/******* DataProcessors ************/
eng.dataProcessors["UserProcessor"]={
    dataSources: ["User"],
    actions:["fetch","add","update"],
    request: function(request, dataSource, action)
    {
        if(request.data && request.data.password)
        {
            request.data.password=this.utils.encodeSHA(request.data.password);
        }
        return request;
    }
};

eng.routes["global"]={
    loginFallback: "login",
    routeList:[
        { routePath: "login", forwardTo: "/work/config/login.jsp", isRestricted: "false", zindex:1 },
        { routePath: "register", forwardTo: "/work/config/register.jsp", isRestricted: "false" },
        { routePath: "work", isRestricted: "true"},
        { routePath: "work/*", jspMapTo: "/work/jsp/", isRestricted: "true" },
        { routePath: "ds", forwardTo: "/platform/jsp/datasource.jsp", isRestricted: "true" },
    ],
};
