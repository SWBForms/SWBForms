package org.fst2015pm.swbforms.extractors;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Set;
import java.util.UUID;

import org.fst2015pm.swbforms.utils.FileUtils;
import org.semanticwb.datamanager.DataExtractor;
import org.semanticwb.datamanager.DataExtractorBase;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.script.ScriptObject;

import com.opencsv.CSVReader;

/**
 * CSV Extractor implementation.
 * @author Hasdai Pacheco
 *
 */
public class CSVExtractor implements DataExtractor {
	private boolean extracting;
	/**
	 * Constructor.
	 * Creates a new Instance of CSVExtractor.
	 */
	public CSVExtractor () {
		this.extracting = false;
	}
	
	@Override
	public void extract(DataExtractorBase base) throws IOException {
		if (this.extracting) return; //Prevent data overwrite
		
		this.extracting = true;
		// Get scriptObject configuration parameters
		ScriptObject extractorDef = base.getScriptObject();
		String fileUrl = extractorDef.getString("fileLocation"); //Local path or URL of remote file
		boolean zipped = Boolean.valueOf(extractorDef.getString("zipped")); //Zipped flag
		boolean remote = false;
		
		if (null == fileUrl || fileUrl.isEmpty()) {
			this.extracting = false;
			return;
		}
			
		//Get column mapping
		ScriptObject columnMapping = extractorDef.get("columnMapping");
		if (null != columnMapping) {
			Set<String> keys = columnMapping.keySet();
			for(String key: keys) {
				System.out.println("Column "+key+" maps to "+columnMapping.getString(key));
			}
		}
		
		//Prepare file system
		String destPath = DataMgr.getApplicationPath() + "tempDir/" + UUID.randomUUID();
		File destDir = new File(destPath);
		
		//Check if URL is provided
		URL url = null;
		try {
			url = new URL(fileUrl);
			remote = true;
		} catch (MalformedURLException muex) { }
		
		fileUrl = remote ? fileUrl : DataMgr.getApplicationPath() + fileUrl;
		
		//Get local or remote file, store in localPath
		if (remote) {
			destDir = new File(destPath,"tempFile");
			org.apache.commons.io.FileUtils.copyURLToFile(url, destDir);
			fileUrl = destPath + "/tempFile";
		}
		
		if (zipped) {
			String zipPath = extractorDef.getString("zipPath");
			if (null == zipPath || zipPath.isEmpty()) { //No relative path provided
				this.extracting = false;
				org.apache.commons.io.FileUtils.deleteQuietly(new File(destPath));
				return;
			}
			FileUtils.ZIP.extractAll(fileUrl, destPath);
			destPath += zipPath;
		}
		
		//Store data
		store(base, destPath);
		org.apache.commons.io.FileUtils.deleteQuietly(new File(destPath));
		this.extracting = false;
	}
	
	/**
	 * Stores extracted data to DataSource.
	 * @param base DataExtractor definition.
	 * @param csvPAth Path of CSV file to store.
	 */
	private void store(DataExtractorBase base, String csvPAth) {
		if (null == csvPAth) return; 
	
		CSVReader reader = null;
		try {
			// Read data and push it to DataSource
			reader = new CSVReader(new FileReader(csvPAth));
			String [] nextLine;
			String [] headers;
			boolean getHeader = false;
			while ((nextLine = reader.readNext()) != null) {
				for(String item : nextLine) {
					System.out.print(item+", "); 
				}
			}
		} catch (FileNotFoundException fnfe) {
			fnfe.printStackTrace();
		} catch (IOException ioex) {
			ioex.printStackTrace();
		} finally {
			if (null != reader) {
				try {
					reader.close();
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		}
	}

	@Override
	public void start(DataExtractorBase base) {
		try {
			extract(base);
		} catch (IOException ioex) {
			ioex.printStackTrace();
		}
	}

	@Override
	public void stop(DataExtractorBase base) {
		System.out.println("Stop");
		ScriptObject extractorDef = base.getScriptObject();
		System.out.println(extractorDef);
	}

}
