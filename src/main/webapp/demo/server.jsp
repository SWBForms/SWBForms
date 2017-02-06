<%-- 
    Document   : server
    Created on : 11-ene-2017, 16:53:33
    Author     : javiersolis
--%>

<%@page import="org.semanticwb.datamanager.SWBDataSource"%>
<%@page import="org.semanticwb.datamanager.DataObject"%>
<%@page import="org.semanticwb.datamanager.SWBScriptEngine"%>
<%@page import="org.semanticwb.datamanager.DataMgr"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>
<%
    SWBScriptEngine eng=DataMgr.initPlatform("/demo/datasources.js", session);
    //{data:{nombre:"notas"}}
    DataObject query=new DataObject();
    query.addSubObject("data").addParam("nombre", "notas");
    
    DataObject res=eng.getDataSource("Variables").fetch(query);
    DataObject obj=res.getDataObject("response")
                    .getDataList("data")
                    .getDataObject(0);
    
    int counter=Integer.parseInt(obj.getString("valor"))+1;    
    obj.put("valor", ""+counter);
    eng.getDataSource("Variables").updateObj(obj);
        
    out.print("respuesta:"+counter);
/*    
    SWBDataSource ds=eng.getDataSource("Variables");
    for(int x=0;x<100000;x++)
    {
        DataObject var=new DataObject()
            .addParam("nombre", "var"+x)
            .addParam("valor", ""+x);
        ds.addObj(var);
    }
//*/   
    eng.setContextData("cliente", "Javier");
    
%>        
    </body>
</html>
