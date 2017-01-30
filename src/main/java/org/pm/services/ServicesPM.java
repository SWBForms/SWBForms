package org.pm.services;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 *
 * @author martha.jimenez
 */
@WebServlet(urlPatterns = {"/servicespm", "/servicespm/*"})
public class ServicesPM extends HttpServlet{
    
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession();
        SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
        PrintWriter out = resp.getWriter();
        resp.setContentType("application/json");
        SWBDataSource ds = engine.getDataSource("PMCatalog");
        DataObject dsFetch = ds.fetch();
        out.print(dsFetch.getDataObject("response"));

    }
}

