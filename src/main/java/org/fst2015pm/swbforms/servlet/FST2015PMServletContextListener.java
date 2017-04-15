package org.fst2015pm.swbforms.servlet;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.logging.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.io.FileUtils;
import org.fst2015pm.swbforms.extractors.ExtractorManager;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.script.ScriptObject;

public class FST2015PMServletContextListener implements ServletContextListener {
	static Logger log = Logger.getLogger(FST2015PMServletContextListener.class.getName());
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		log.info("Starting FST2015PM Platform...");
        DataMgr.createInstance(sce.getServletContext().getRealPath("/"));
        log.info("DataMgr started");

        log.info("Starting SWBScriptEngine...");
        SWBScriptEngine engine = DataMgr.getUserScriptEngine("/WEB-INF/global.js", (DataObject)null, false);
        log.info("SWBScriptEngine Started");

        ScriptObject config = engine.getScriptObject().get("config");
        if (config != null) {
            String base = config.getString("baseDatasource");
            if (base != null) {
                DataMgr.getBaseInstance().setBaseDatasourse(base);
            }
        }
        
        checkDefaultAccessCredentials(engine, sce);
        
		ExtractorManager i = ExtractorManager.getInstance();
		i.init();

	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {

	}
	
	private void checkDefaultAccessCredentials(SWBScriptEngine eng, ServletContextEvent sce) {
		File f = new File(sce.getServletContext().getRealPath("/")+"WEB-INF/deployInfo");
		if (!f.exists()) {
			log.info("Creating default admin user...");
			//Create admin role and admin user
	        SWBDataSource roleDS = eng.getDataSource("Role");
	        SWBDataSource userDS = eng.getDataSource("User");
	        
	        DataObject queryObj = new DataObject();
	        queryObj.put("title", "Admin");
	        
	        try {
	        	DataObject response = roleDS.fetch(new DataObject().addParam("data", queryObj));
	        	DataList data = response.getDataList("data");
	        	if (null == data || data.isEmpty()) {
	        		DataObject adminRole = new DataObject();
	        		adminRole.put("title", "Admin");
	        		adminRole.put("description", "Admin Role");
	        		response = roleDS.addObj(adminRole);
	        	}
	        	
	        	if (null != response.getDataObject("response").getDataObject("data")) {
	        		String roleId = response.getDataObject("response").getDataObject("data").getId();
	        		
	        		queryObj = new DataObject();
			        queryObj.put("isAdmin", true);
			        
			        response = userDS.fetch(new DataObject().addParam("data", queryObj));
			        data = response.getDataList("data");
			        
			        if (null == data || data.isEmpty()) {
			        	DataObject userObj = new DataObject();
			        	userObj .put("fullname", "Admin");
			        	userObj .put("email", "admin@fst2015pm.mx");
			        	userObj .put("password", "admin");
			        	userObj .put("isAdmin", true);
			        	DataList rList = new DataList();
			        	rList.add(roleId);
			        	userObj .put("roles", rList);
			        	response = userDS.addObj(userObj);
			        }
			        
		        	FileUtils.writeStringToFile(f, String.valueOf(new Date().toString()), "UTF-8");
	        	}
	        } catch (IOException ioex) {
	        	
	        }
		}
	}

}
