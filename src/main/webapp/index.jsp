<%-- 
    Document   : index
    Created on : Dec 15, 2013, 5:30:59 PM
    Author     : javier.solis.g
--%>
<%@page import="org.semanticwb.datamanager.*"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SWBForms...</title>
        <script src="/platform/js/eng.js" type="text/javascript"></script>
    </head>
    <body>
        <h1>SWBForms started...</h1>
        <script type="text/javascript">
            eng.initPlatform([]);
        </script>        
        <pre>
<%
    SWBScriptEngine eng=DataMgr.initPlatform(session);
    DataObject user=eng.getUser();    
%>        
        </pre>
    </body>
</html>
