
eng.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};

var sec={
    roles:["director","gerente"],
    groups:["dads"],
    users:[{email:"softjei2@gmail.com"}]
};

eng.dataSources["Clientes"] = {
    scls: "Clientes",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "email", title: "Correo Electrónico", required: true, type: "string", validators:[{stype:"email"}]},
        {name: "nacimiento", title: "Fecha nacimiento", type: "date"},
        {name: "direccion", title: "Dirección", type: "text"},
        {name: "telefono", title: "Telefono", type: "string",},
        {name: "rfc", title: "RFC", required: false, type: "string"},
        {name: "sexo", title: "Sexo", stype: "select", 
            valueMap:{male:"Hombre",female:"Mujer"}},
    ],
    security:{
        fetch_:{
            roles:["director","gerente"],
            groups:["dac","dads"],
            users:[{sex:"male"}]    //OR
        },
        add_:{
            roles:["director","gerente"],
            groups:["dac","dads"],
            users:[{email:"softjei@gmail.com"}]    //OR
        },
        remove:{
            roles:["director"],
        },
        update:{
            roles:["director"],
            groups_:["dads"],
            users_:[{email:"softjei2@gmail.com"}]
        }        
    }    
};

eng.dataSources["Notas"] = {
    scls: "Notas",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "folio",
    fields: [
        {name: "folio", title: "Folio", canEdit:false, required: false, type: "string"},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "cliente", title: "Cliente", stype: "select", multiple:true, dataSource:"Clientes"},
        {name: "productos", title: "Productos", stype: "grid", 
            showGridSummary:true,
            dataSource:"DetalleNota"
        },        
        {name: "subtotal", title: "Subtotal", type: "float", format:"$,##0.00"},
        {name: "iva", title: "Total IVA", format:"$,##0.00", type: "float",
            formula: { text: "total-subtotal" },
            validators_:[{
                type:"serverCustom",                                    //serverCustom del lado del servidor
                serverCondition:function(name,value,request){                    
                    return value>0;
                },
                errorMessage:"Error iva debe de ser mayor que 0"
            }]            
        },
        {name: "total", title: "Total", format:"$,##0.00", type: "float"},
    ],
    links:[
        {name: "direccion", title: "Direccion de Envio", stype: "tab", dataSource:"Direcciones"}
    ]
};


//dataProcessor
eng.dataProcessors["NotasProcessor"] = {
    dataSources: ["Notas"],
    actions:["add"],
    request: function(request, dataSource, action)
    {
        var Counter = Java.type('demo.Counter');        
        
        /*
        var obj=this.getDataSource("Variables").fetch({data:{nombre:"notas"}}).response.data[0];
        var n=parseInt(obj.valor)+1;
        obj.valor=""+n;
        this.getDataSource("Variables").updateObj(obj);
        */
       
        request.data.folio="2017_"+Counter.count(this); 
        
        print(this.getContextData("cliente"));
        this.setContextData("folio",request.data.folio);
        
        return request;
    },
    response_: function(response, dataSource, action)
    {
        //response.data.folio+="Hola";
        return response;
    }
};


eng.dataSources["DetalleNota"] = {
    scls: "DetalleNota",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "producto", title: "Producto", 
            required: true, 
            stype: "select", 
            dataSource:"Productos",
            changed:function(form,item,value){
                //console.log(form,item,value);
                var record=item.getSelectedRecord(); 
                //console.log(record); 
                if(record) 
                {
                    form.setValue('precio', record.precio);
                    form.setValue('iva', record.iva);
                    form.setValue('cantidad', 1);
                    form.focusInItem("cantidad");
                }
            }
        },
        {name: "cantidad", title: "Cantidad", type: "int"},
        {name: "precio", title: "Precio", showGridSummary:false, type: "float"},
        {name: "subtotal", title: "Subtotal", canEdit:false, 
            type: "float", 
            format:"$,##0.00", 
            formula: { text: "precio*cantidad" },
            getGridSummary:function (records, summaryField) {
                var ret=0;
                //for (var i = 0; i < records.length; i++) {
                //    ret+=records[i].subtotal;
                //}
                if(form)
                {
                    var g=form.getField("productos").grid;
                    var i=0;
                    var d=g.getEditedRecord(i).subtotal;                    
                    while(d!==undefined)
                    {              
                        ret+=d;
                        i++;
                        d=g.getEditedRecord(i).subtotal;
                    }                                        
                    form.setValue("subtotal",ret);
                }
                return ret;
            },             
        },
        {name: "iva", title: "IVA", showGridSummary:false, 
            canEdit:false, 
            type: "float", 
            format:"$,##0.00", 
        },
        {name: "total", title: "Total", canEdit:false, type: "float", 
            format:"$,##0.00", 
            formula: { text: "(iva*precio*cantidad)+precio*cantidad" },
            getGridSummary:function (records, summaryField) {
                var ret=0;
                if(form)
                {
                    var g=form.getField("productos").grid;
                    var i=0;
                    var d=g.getEditedRecord(i).total;                    
                    while(d!==undefined)
                    {              
                        ret+=d;
                        i++;
                        d=g.getEditedRecord(i).total;
                    }                                        
                    form.setValue("total",ret);
                }
                return ret;
            },             
        },
    ]
};

eng.dataSources["Direcciones"] = {
    scls: "Direcciones",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "calle",
    fields: [
        {name: "calle", title: "Calle", required: true, type: "string"},
        {name: "colonia", title: "Colonia", required: true, type: "string"},
        {name: "delegacion", title: "Delegacion/Municipio", type: "text"},
        {name: "pais", title: "Pais", stype: "select", dataSource:"Paises", changed:"form.clearValue('estado');", dependentSelect_:"estado"},
        {name: "estado", title: "Estado", stype: "select", dataSource:"Estados", getPickListFilterCriteria : function () {
            var pais = this.form.getValue("pais");
            return {pais:pais};
         }},
        {name: "cp", title: "Codigo Postal", type: "int"},
    ]
};