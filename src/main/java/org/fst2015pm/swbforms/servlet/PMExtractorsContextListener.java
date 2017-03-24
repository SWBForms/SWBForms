package org.fst2015pm.swbforms.servlet;

import java.util.logging.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.fst2015pm.swbforms.extractors.ExtractorManager;

public class PMExtractorsContextListener implements ServletContextListener {
	static Logger log = Logger.getLogger(PMExtractorsContextListener.class.getName());
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		log.info("Starting PM extractor manager");
		ExtractorManager i = ExtractorManager.getInstance();
		i.init();
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
	}

}
