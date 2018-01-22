<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<%
    String id=request.getParameter("id");  
    if(id!=null)id="\""+id+"\"";
%>
<html>
    <head>
        <title>Nota</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="/platform/js/eng.js" type="text/javascript"></script>
    </head>
    <body>
        <div>Nota</div>
        <script type="text/javascript">
            eng.initPlatform("datasources.js",false);
            
            var form=eng.createForm({
                width: "90%",                
                height: 380,
                showTabs:false,
                title:"Forma",
                onLoad:function(f){
                    //alert(f.getValue("nombre"));
                }                
            }, <%=id%>,"Productos");
            
            form.submitButton.setTitle("Enviar");
            /*
            form.submitButton.click = function(p1)
            {                
                eng.submit(form, this, function()
                {
                    window.location = "files.html";    
                });                
            };  
            */
            
            form.buttons.addMember(isc.IButton.create(
            {
                title: "Regresar",
                padding: "10px",
                click: function(p1) {
                    window.location = "files.html";
                    return false;
                }
            }));             
            
            form.layout.members.reverse();
            
        </script>         
    </body>
</html>
