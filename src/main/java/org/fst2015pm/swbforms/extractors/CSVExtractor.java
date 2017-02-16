package org.fst2015pm.swbforms.extractors;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;

import org.fst2015pm.swbforms.utils.FSTUtils;
import org.semanticwb.datamanager.DataExtractorBase;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.script.ScriptObject;

/**
 * CSV Extractor implementation.
 * @author Hasdai Pacheco
 *
 */
public class CSVExtractor extends PMExtractorBase {
	/**
	 * Constructor. Creates a new Instance of CSVExtractor.
	 */
	public CSVExtractor () {
		super();
	}
	
	@Override
	public void store(DataExtractorBase base, String filePAth) {
		HashMap<String, ScriptObject> colMapping = new HashMap<>();
		Properties props = new Properties();
		ScriptObject extractorDef = base.getScriptObject();
		String dbPath = filePAth.substring(0, filePAth.lastIndexOf("/"));
		String tblName = filePAth.substring(filePAth.lastIndexOf("/")+1, filePAth.length());
		String charset = extractorDef.getString("charset");
		if (null == charset || charset.isEmpty()) charset = "UTF-8";
		
		tblName = tblName.substring(0, tblName.lastIndexOf("."));
		props.put("charset", charset);
		
		//Get column mapping
		ScriptObject columnMapping = extractorDef.get("columns");
		if (null != columnMapping) {
			Iterator<ScriptObject> colMap = columnMapping.values().iterator();
			while (colMap.hasNext()) {
				ScriptObject col = colMap.next();
				if (null != col.getString("src")) {
					colMapping.put(col.getString("src"), col);
				}
			}
		}
		
		try {
			Class.forName("org.relique.jdbc.csv.CsvDriver");
		} catch (ClassNotFoundException cnfex) {
			cnfex.printStackTrace();
		}
		
		Connection conn = null;
		try {
			conn = DriverManager.getConnection("jdbc:relique:csv:" + dbPath, props);
		    Statement stmt = conn.createStatement();
		    ResultSet results = stmt.executeQuery("SELECT * FROM "+tblName);
		    
		    while(results.next()) {
		    	DataObject obj = new DataObject(); 
		    	for(String key : colMapping.keySet()) {
		    		ScriptObject entry = (ScriptObject) colMapping.get(key);
		    		String finalField = null != entry.getString("dest") ? entry.getString("dest") : key;
		    		String dataType = null != entry.getString("type") ? entry.getString("type") : "string";
		    		
		    		int colIdx = results.findColumn(key);
		    		Object val = FSTUtils.DATA.getTypedObject(results.getString(colIdx), dataType);
		    		//System.out.println("Key: "+key+", finalName: "+finalField+", colIndex: "+colIdx);
		    		if (null != val) {
		    			obj.put(finalField, val);
		    		}
		    	}
		    	base.getDataSource().addObj(obj);
		    }
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		} catch (IOException ioex) {
			ioex.printStackTrace();
		} finally {
			if (null != conn) {
				try {
					conn.close();
				} catch(SQLException sqex) { }
			}
		}
	}
}
