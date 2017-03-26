package org.fst2015pm.swbforms.utils;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DecimalFormat;

import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.data.store.ContentFeatureCollection;
import org.geotools.factory.Hints;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.geojson.feature.FeatureJSON;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.geotools.referencing.ReferencingFactoryFinder;
import org.json.JSONArray;
import org.json.JSONObject;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.crs.CRSAuthorityFactory;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;

public class ShapeFileConverter {

	private static final String code = "EPSG:4326";

	public ShapeFileConverter() {}
	
	public CoordinateReferenceSystem validCRS() throws NoSuchAuthorityCodeException, FactoryException{
		System.setProperty("org.geotools.referencing.forceXY", "true");
		Hints hints = new Hints(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE);
		CRSAuthorityFactory factory = ReferencingFactoryFinder.getCRSAuthorityFactory("EPSG", hints);
		CoordinateReferenceSystem targetCRS = factory.createCoordinateReferenceSystem(code);
		return targetCRS;
	}
	
	public SimpleFeatureCollection readShapefile(String Shapefile) throws NoSuchAuthorityCodeException, FactoryException, TransformException {
		File fileShape = new File(Shapefile);
			
		if (!fileShape.exists()){
			System.out.println("No se encontro el archivo");
			System.exit(0); 
		}
		try {	
			
			CoordinateReferenceSystem targetCRS = validCRS();			
			FileDataStore data = FileDataStoreFinder.getDataStore( fileShape );
			SimpleFeatureSource  sourceDBF = data.getFeatureSource();
			SimpleFeatureType schemaDBF = sourceDBF.getSchema();	
			CoordinateReferenceSystem sourceCRS = schemaDBF.getCoordinateReferenceSystem();				
						
			if (!(sourceCRS.equals(targetCRS))){
				System.out.println("Iniciando...");
			
				 MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, true);				
									 
				 SimpleFeatureBuilder fb = new SimpleFeatureBuilder(schemaDBF);					 				 
				 DefaultFeatureCollection CollectionDest = new DefaultFeatureCollection(null, schemaDBF);
				 
				 ContentFeatureCollection collectionDBF =  (ContentFeatureCollection) sourceDBF.getFeatures();					 
				try (SimpleFeatureIterator iterator = collectionDBF.features()) {
					
					
			        while (iterator.hasNext()) {
			            SimpleFeature feature = iterator.next();
			            
			            Geometry  sourceGeoDBF = (Geometry)feature.getDefaultGeometry();
						Geometry reprojectedGeometryDBF = JTS.transform(sourceGeoDBF,  transform);
						feature.setDefaultGeometry(reprojectedGeometryDBF);		        	
			           
			            for (Property attribute : feature.getProperties()) {
			            	
				            	if (attribute.getValue().getClass() == Double.class){				            			
				            		Double trans = (Double)attribute.getValue();
				            		DecimalFormat num = new DecimalFormat("###.00");				            	
				            		fb.add(num.format(trans));	
				            		
				            	}else if(attribute.getValue().getClass() == Integer.class){				            		
				            		fb.add(Integer.parseInt(attribute.getValue().toString()));
				            	}else{			            	
				            		fb.add(attribute.getValue().toString());
				            	}
				            }// for 	           
			            
			            SimpleFeature featureDest = fb.buildFeature(feature.getID());			          
			            CollectionDest.add(featureDest);
			            
			        }//while			        
			        
			        SimpleFeatureCollection output  =  CollectionDest;				       
			        iterator.close();
			        return output;
					}				
				}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		return null;
	}//readShapefile

	/**
	 * buscar la forma de generalizar la funcion
	 * @param newName ruta y nombre de donde se guardara el geojson
	 * @param usuShape	ubicacion del archivo shape a convertir
	 */
	public void ShpToGeoJSON(String newName, String usuShape ) throws IOException, NoSuchAuthorityCodeException, FactoryException, TransformException{
			SimpleFeatureCollection featuresSHP = readShapefile(usuShape);	
			
			if (featuresSHP == null){
				System.out.println("El archivo no se puede leer o se encuentra vacio");
				System.exit(0);
			}			
			
			JSONObject featureCollection = new JSONObject();			
			
			JSONObject properties = new JSONObject();
			properties.put("name", code);
			JSONObject crs = new JSONObject();
			crs.put("type", "name");
			crs.put("properties", properties);
			
			
			JSONObject actObject = new JSONObject();
			JSONArray inFeature = new JSONArray();			
			
			SimpleFeatureIterator iterator = featuresSHP.features();
			
			while(iterator.hasNext()){
				Integer i=0;
				SimpleFeature actual = iterator.next();
				JSONObject geo = new JSONObject();
				JSONObject prop = new JSONObject();
				JSONArray arrCoor = new JSONArray();				
				JSONArray detCoor = new JSONArray();
				for (Property attribute : actual.getProperties()){					
					
					if(attribute.getName().toString() ==  "the_geom" ){			
						geo.put("type", attribute.getType().getName().toString());
						
						Geometry  sourceGeo = (Geometry)actual.getDefaultGeometry();
						Coordinate[] arrCoord = sourceGeo.getCoordinates();
						for (i=0; i<sourceGeo.getCoordinates().length; i++){
							Coordinate coor = arrCoord[i];
							//se contempla que se trabajara con mapas 2d
							double[] coorByProp = new double[2];
							coorByProp[0]= coor.x;
							coorByProp[1]= coor.y;
							detCoor.put(coorByProp);
							
						}		
						
						arrCoor.put(detCoor);
						geo.put("coordinates", arrCoor);
						actObject.put("geometry", geo);
					}else{
						
						if (attribute.getValue().getClass() == Double.class){
							Double trans = (Double)attribute.getValue();
		            		DecimalFormat num = new DecimalFormat("###.00");				            	
		            		prop.put(attribute.getName().toString(),num.format(trans));
							
						}else{
							prop.put(attribute.getName().toString(), attribute.getValue());
							actObject.put("properties", prop);
						}
					}
					
				}
				prop.put("id", actual.getID());		
				actObject.put("type", "Feature");
				inFeature.put(actObject);
			}
			
			featureCollection.put("features", inFeature);
			featureCollection.put("crs", crs);
			featureCollection.put("type", featuresSHP.getID());
			FileWriter fileDest = new FileWriter(newName+".geojson");
			fileDest.write(featureCollection.toString());
			fileDest.close();
	}//ShpToGeoJSON

}