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
                width: "100%",
                height: 320,
                showTabs:true,
                title:"Forma"
            }, <%=id%>,"Notas");
            
            form.submitButton.setTitle("Enviar");
            
            form.submitButton.click = function(p1)
            {                
                eng.submit(form, this, function()
                {
                    window.location = "notas.html";    
                });                
            };            
            
            form.buttons.addMember(isc.IButton.create(
            {
                title: "Regresar",
                padding: "10px",
                click: function(p1) {
                    window.location = "notas.html";
                    return false;
                }
            }));             
            
        </script>         
    </body>
</html>
