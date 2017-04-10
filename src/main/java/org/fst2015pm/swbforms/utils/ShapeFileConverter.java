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
	public void ShpToGeoJSONCRS(String newName, String usuShape ) throws IOException, NoSuchAuthorityCodeException, FactoryException, TransformException{
			SimpleFeatureCollection featuresSHP = readShapefile(usuShape);	
			
			if (featuresSHP == null){
				System.out.println("El archivo no se puede leer o se encuentra vacio");
			}			
			
			JSONObject featureCollection = new JSONObject();			
			
			JSONObject properties = new JSONObject();
			properties.put("name", code);
			JSONObject crs = new JSONObject();
			crs.put("type", "name");
			crs.put("properties", properties);
			JSONArray inFeature = new JSONArray();		

			SimpleFeatureIterator iterator = featuresSHP.features();
			
			while(iterator.hasNext()){
				Integer i=0;
				JSONObject actObject = new JSONObject();			
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
						
						JSONArray coorClosePoly = new JSONArray();
						//hacer validaciones para los distitntos tipos de geometrias
						for (i=0; i<sourceGeo.getCoordinates().length; i++){
							Coordinate coor = arrCoord[i];
							if (i==0){
								Coordinate coorClose = arrCoord[0];
								coorClosePoly.put(coor.x);
								coorClosePoly.put(coor.y);
							}
							//se contempla que se trabajara con mapas 2d
							JSONArray coorByProp = new JSONArray();
							coorByProp.put(coor.x);
							coorByProp.put(coor.y);
							
							detCoor.put(coorByProp);						
						}		
						detCoor.put(coorClosePoly);
						arrCoor.put(detCoor);						
					}else{						
						if (attribute.getValue().getClass() == Double.class){
							Double trans = (Double)attribute.getValue();
		            		DecimalFormat num = new DecimalFormat("###.00");				            	
		            		prop.put(attribute.getName().toString(),num.format(trans));							
						}else{
							prop.put(attribute.getName().toString(), attribute.getValue());							
						}
					}					
									
				}//for properties
			
				geo.put("coordinates", arrCoor);
				actObject.put("geometry", geo);	
				
				actObject.put("properties", prop);
				actObject.put("type", "Feature");
				actObject.put("id", actual.getID());
				inFeature.put(actObject);
				
			}//while
			System.out.println(inFeature.length());
			featureCollection.put("type", featuresSHP.getID());	
			featureCollection.put("crs", crs);
			featureCollection.put("features", inFeature);

			FileWriter fileDest = new FileWriter(newName+".geojson");
			fileDest.write(featureCollection.toString());
			fileDest.close();
			
	}//ShpToGeoJSONCRS

	public void ShpToGeoJSON(String newName, String usuShape ) throws IOException, NoSuchAuthorityCodeException, FactoryException, TransformException{

		SimpleFeatureCollection featuresSHP = readShapefile(usuShape);
		FeatureJSON io = new FeatureJSON();
		File f = new File(newName+".geojson");
		f.setWritable(true);
		io.writeFeatureCollection(featuresSHP, f);
	

	}

}