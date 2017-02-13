package org.fst2015pm.swbforms.extractors;

import org.semanticwb.datamanager.DataExtractor;
import org.semanticwb.datamanager.DataExtractorBase;

/**
 * Interface that defines store method for extractors.
 * @author Hasdai Pacheco
 *
 */
public interface PMExtractor extends DataExtractor {
	/**
	 * Stores data from file to DataSorce.
	 * @param base DataExtractor definition.
	 * @param filePath Path to data file.
	 */
	abstract void store(DataExtractorBase base, String filePath);
}