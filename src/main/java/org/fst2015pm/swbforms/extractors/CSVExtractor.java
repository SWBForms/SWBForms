package org.fst2015pm.swbforms.extractors;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
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
	
	/**
	 * Constructor.
	 * Creates a new Instance of CSVExtractor.
	 */
	public CSVExtractor () {}
	
	@Override
	public void extract(DataExtractorBase base) throws IOException {
		// Get CSVFile or URL from scriptObject
		ScriptObject extractorDef = base.getScriptObject();
		String filePath = extractorDef.getString("filePath");
		String fileUrl = extractorDef.getString("fileUrl");
		boolean zipped = Boolean.valueOf(extractorDef.getString("zipped"));
		
		ScriptObject columnMapping = extractorDef.get("columnMapping");
		if (null != columnMapping) {
			Set<String> keys = columnMapping.keySet();
			for(String key: keys) {
				System.out.println("Column "+key+" maps to "+columnMapping.getString(key));
			}
		}
		
		if (zipped) {
			String zipPath = extractorDef.getString("zipPath");
			String tempPath = DataMgr.getApplicationPath() + "tempDir/" + UUID.randomUUID(); 
			File tmpDir = new File(tempPath);
			if (!tmpDir.exists()) {
				tmpDir.mkdirs();
			}
			FileUtils.extractAll(DataMgr.getApplicationPath() + filePath, tempPath);
			store(base, tempPath + zipPath);
			removeFiles(tmpDir);
		}
			
	}
	
	/**
	 * Removes file or folder from fileSystem.
	 * @param fileOrFolder File object to remove.
	 */
	private void removeFiles(File fileOrFolder) {
		if (fileOrFolder.isDirectory()) {
			File[] contents = fileOrFolder.listFiles();
		    if (contents != null) {
		        for (File f : contents) {
		        	removeFiles(f);
		        }
		    }
		}
		fileOrFolder.delete();
	}
	
	/**
	 * Stores extracted data to DataSource.
	 * @param base DataExtractor definition.
	 * @param csvPAth Path of CSV file to store.
	 */
	private void store(DataExtractorBase base, String csvPAth) {
		if (null == csvPAth) return; 
		System.out.println("Reading file "+csvPAth);
	
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
		// TODO Auto-generated method stub
		System.out.println("start");
		try {
			extract(base);
		} catch (IOException ioex) {
			ioex.printStackTrace();
		}
		//ScriptObject extractorDef = base.getScriptObject();
		//System.out.println(extractorDef.getString("dataSource"));
	}

	@Override
	public void stop(DataExtractorBase base) {
		// TODO Auto-generated method stub
		System.out.println("Stop");
		ScriptObject extractorDef = base.getScriptObject();
		System.out.println(extractorDef);
	}

}
