package org.fst2015pm.swbforms.utils;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;

import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.Query;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.data.store.ContentFeatureCollection;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.geojson.feature.FeatureJSON;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

import com.vividsolutions.jts.geom.Geometry;

public class ShapeFileConverter {

	private static final String code = "EPSG:4326";

	public ShapeFileConverter() {}
	
	public SimpleFeatureCollection readShapefile(String usuShape) throws NoSuchAuthorityCodeException, FactoryException, TransformException {
		File fileShape = new File(usuShape);
		if (!fileShape.exists()){
			System.out.println("No se encontro el archivo");
			System.exit(0); 
		}
		try {	

			FileDataStore data = FileDataStoreFinder.getDataStore( fileShape );
			SimpleFeatureSource  sourceDBF = data.getFeatureSource();
			SimpleFeatureType schemaDBF = sourceDBF.getSchema();
			
			CoordinateReferenceSystem sourceCRS = schemaDBF.getCoordinateReferenceSystem();	
			CoordinateReferenceSystem targetCRS = CRS.decode(code);
			
			if (!(sourceCRS.equals(targetCRS))){
				System.out.println("Iniciando...");
			
				 MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, true);				
				 Query query = new Query(schemaDBF.getTypeName());
				 
				 /*
				  * Es importante identificar que sean diferentes, de lo contrarios transform no reflejara modificacion alguna
				  * puede tener las mismas coordenadas, sin que necesariamente este en EPSG:4326, se deberá extraer de nuevo el .shp del .zip
				  * */
				 //System.out.println(targetCRS+"\n \n");
				 //System.out.println(sourceCRS);
				 ContentFeatureCollection collectionDBF =  (ContentFeatureCollection) sourceDBF.getFeatures();
				
				 SimpleFeatureBuilder fb = new SimpleFeatureBuilder(schemaDBF);				
				 DefaultFeatureCollection CollectionDest = new DefaultFeatureCollection(null, schemaDBF);
			   
				try (SimpleFeatureIterator iterator = collectionDBF.features()) {
					
			        while (iterator.hasNext()) {
			            SimpleFeature feature = iterator.next();
			            
			            Geometry  sourceGeoDBF = (Geometry)feature.getDefaultGeometry();
						Geometry reprojectedGeometryDBF = JTS.transform(sourceGeoDBF,  transform);
						feature.setDefaultGeometry(reprojectedGeometryDBF);	
			            //System.out.println(feature.getValue());           	
			           
			            for (Property attribute : feature.getProperties()) {
			            	//System.out.println(attribute.getClass());
				            	if (attribute.getValue().getClass() == Double.class){				            			
				            		BigDecimal trans = new BigDecimal((Double)attribute.getValue());				            		
				            		fb.add(String.format("%.3f", trans));	
				            		System.out.println( String.format("%.3f", trans));
				            	}else if(attribute.getValue().getClass() == Integer.class){				            		
				            		fb.add(Integer.parseInt(attribute.getValue().toString()));
				            	}else{			            	
				            		fb.add(attribute.getValue().toString());
				            	}
				            }// for 	           
			            
			            SimpleFeature featureDest = fb.buildFeature(feature.getID());
			          //  featureDest.setAttribute("name", feature.getName());
			            CollectionDest.add(featureDest);	            

			        }//while			        
			       
			        SimpleFeatureCollection output  =  CollectionDest;			        
			        return output;
					}
				}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return null;
	}//readShapefile

	
	public void ShpToGeoJSON(String newName, String usuShape ) throws IOException, NoSuchAuthorityCodeException, FactoryException, TransformException{

			SimpleFeatureCollection featuresSHP = readShapefile(usuShape);
			if (featuresSHP == null){
				System.out.println("El archivo no se puede leer o se encuentra vacío");
				System.exit(0);
			}
			FeatureJSON io = new FeatureJSON();
			File f = new File(newName+".geojson");
			f.setWritable(true);
			io.writeFeatureCollection(featuresSHP, f);

			FeatureIterator<SimpleFeature> features = featuresSHP.features();
			while (features.hasNext()){
				SimpleFeature feature = features.next();
	            System.out.println(feature.getID() + ": ");
	          /* for (Property attribute : feature.getProperties()) {
	                System.out.println("\t"+attribute.getName()+":"+attribute.getValue() );
	            }*/
			}
	}//ShpToGeoJSON
}
