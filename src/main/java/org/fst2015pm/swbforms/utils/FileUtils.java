package org.fst2015pm.swbforms.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Class to group utilities related to File Management
 * @author Hasdai Pacheco
 *
 */
public class FileUtils {
	/** Buffer size */
	static int BUFFER = 2048;
	
	public static class ZIP {
		/**
		 * Extracts a ZIP file to a destination directory.
		 * @param source Path for the source ZIP file.
		 * @param dest Path of target directory.
		 */
		public static void extractAll(String source, String dest) {
			ZipFile zip = null;
			
			try {
				File file = new File(source);
		        zip = new ZipFile(file);
		        
		        String destPath = dest;
		        new File(destPath).mkdir();
		        
		        Enumeration<? extends ZipEntry> zipEntries = zip.entries();
		        while (zipEntries.hasMoreElements()) {
		            ZipEntry entry = (ZipEntry) zipEntries.nextElement();
		            String current = entry.getName();

		            File destFile = new File(destPath, current);
		            File destinationParent = destFile.getParentFile();
		            destinationParent.mkdirs();

		            if (!entry.isDirectory()) {
		            	int chunk;
		                byte data[] = new byte[BUFFER];
		                BufferedInputStream is = new BufferedInputStream(zip.getInputStream(entry));
		                FileOutputStream fos = new FileOutputStream(destFile);
		                BufferedOutputStream target = new BufferedOutputStream(fos, BUFFER);

		                while ((chunk = is.read(data, 0, BUFFER)) != -1) {
		                    target.write(data, 0, chunk);
		                }
		                
		                target.flush();
		                target.close();
		                is.close();
		            }
		        }
		    } catch (Exception e)  {
		        e.printStackTrace();
		    }
		}
	}
}
