<%-- 
    Document   : pmCatalog
    Created on : 29/01/2017, 11:00:08 AM
    Author     : martha.jimenez
--%>
<%@page import="org.semanticwb.datamanager.DataObject"%>
<%@page import="org.semanticwb.datamanager.SWBDataSource"%>
<%@page import="org.semanticwb.datamanager.DataMgr"%>
<%@page import="org.semanticwb.datamanager.SWBScriptEngine"%>
<script src="/platform/js/eng.js" type="text/javascript"></script>

<%
    final DataObject user = (DataObject) session.getAttribute("_USER_");
    if (user != null) {
        SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
        //SWBScriptEngine eng = org.semanticwb.datamanager.DataMgr.getUserScriptEngine("/app/js/datasources/datasources.js", user, false);
        
        SWBDataSource ds = engine.getDataSource("PMCatalog");
        //SWBDataSource ds1 = eng.getDataSource("PMCatalog");
        
        //System.out.println("Ds1: " + ds1);
        DataObject dsFetch = ds.fetch();
        System.out.println("Ds: " + dsFetch.getDataObject("response"));
        out.println(dsFetch.getDataObject("response"));
    }
    //
    //
%>
