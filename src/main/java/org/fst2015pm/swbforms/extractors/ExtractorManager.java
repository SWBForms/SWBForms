package org.fst2015pm.swbforms.extractors;

import org.semanticwb.datamanager.DataObject;

/**
 * Manages extractor instances
 * @author Hasdai Pacheco
 */
public class ExtractorManager {
	
	/**
	 * Initializes extractor manager
	 */
	public void init() {
		
	}
	
	/**
	 * Loads an extractor from its configuration object
	 * @param extractorConfig
	 */
	public void loadExtractor(DataObject extractorConfig) {
		
	}
	
	/**
	 * Gets current status of a particular extractor
	 * @return
	 */
	public String getStatus(String extractorId) {
		throw new UnsupportedOperationException();
	}
	
	/**
	 * Calls start method on a particular extractor
	 * @param extractorId
	 * @return
	 */
	public boolean startExtractor(String extractorId) {
		throw new UnsupportedOperationException();
	}
	
	/**
	 * Calls stop method on a particular extractor
	 * @param extractorId
	 * @return
	 */
	public boolean stopExtractor(String extractorId) {
		throw new UnsupportedOperationException();
	}
}
