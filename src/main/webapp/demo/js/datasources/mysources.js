(function(eng) {
  'use strict';

  if (!eng) return;
  var counter = 0; //Counter for ticket serial

  /**
  * Datasource to manage clients.
  */
  eng.dataSources["Customer"] = {
    scls: "Customer",
    modelid: "SWBF2",
    dataStore: "mongodb",
    displayField: "nombre",
    fields: [
      { name: "name", title: "Name", required: true, type: "string"},
      { name: "email", title: "e-mail", required: true, type: "string",
        validators:[
          { stype:"email" } //Adds email validation
        ]
      },
      { name: "birthDate", title: "Birth date", type: "date" },
      { name: "address", title: "Address", type: "text" },
      { name: "phone", title: "Phone", type: "string" },
      { name: "ssn", title: "SSN", required: false, type: "string" },
      { name: "gender", title: "Gender", stype: "select",
          valueMap: { male: "Male", female: "Female" } //Adds an in place catalog
      }
    ]
  };

  /**
  * Datasource to manage tickets.
  */
  eng.dataSources["Ticket"] = {
    scls: "Ticket",
    modelid: "SWBF2",
    dataStore: "mongodb",
    displayField: "serial",
    fields: [
      { name: "serial", title: "Serial", required: false, type: "string", canEdit:false },
      { name: "date", title: "Issue date", required: true, type: "date" },
      { name: "customer", title: "Customer", required: true, stype: "select", dataSource: "Customer" },
      { name: "productos", title: "Productos", stype: "grid", dataSource: "TicketDetail" },
      { name: "subtotal", title: "Subtotal", type: "float", format: "$,##0.00" },
      { name: "total", title: "Total", format: "$,##0.00", type: "float" }
    ]
  };

  /**
  * Datasource to manage products.
  */
  eng.dataSources["Product"] = {
    scls: "Product",
    modelid: "SWBF2",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
      { name: "name", title: "Name", required: true, type: "string" },
      { name: "description", title: "Description", type: "text" },
      { name: "price", title: "Price", type: "float" },
      { name: "vat", title: "VAT", type: "float" },
      { name: "existence", title: "Existence", type: "int" },
      { name: "brand", title: "Brand", stype: "select", dataSource: "Brand" }
    ]
  };

  /**
  * Datasource to manage brands.
  */
  eng.dataSources["Brand"] = {
    scls: "Brand",
    modelid: "SWBF2",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
      { name: "name", title: "Name", required: true, type: "string" },
      { name: "description", title: "Description", type: "text" }
    ]
  };

  /**
  * Datasource to manage Note detail
  */
  eng.dataSources["TicketDetail"] = {
    scls: "TicketDetail",
    modelid: "SWBF2",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
      { name: "product", title: "Product", required: true, stype: "select", dataSource: "Product" },
      { name: "qty", title: "Quantity", type: "int" },
      { name: "price", title: "Price", type: "float" },
      { name: "subtotal", title: "Subtotal", canEdit:false,
          type: "float",
          format:"$,##0.00",
          formula: { text: "price * qty" }
      },
      { name: "vat", title: "VAT", type: "float",
          format:"$,##0.00",
      },
      { name: "total", title: "Total", canEdit:false, type: "float",
          format:"$,##0.00",
          formula: { text: "(vat * subtotal) + subtotal" }
      }
    ]
  };

  /**
  * Data processor to add note number.
  */
  eng.dataProcessors["TicketProcessor"] = {
    dataSources: ["Ticket"],
    actions: ["add"],
    request: function(request, dataSource, action) {
      request.data.serial = "2016_" + counter;
      counter++;
      return request;
    },
    response_: function(response, dataSource, action) {
      return response;
    }
  };

  //Email validator
  eng.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"Please provide a valid email"};;

})(eng);
