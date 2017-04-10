package org.fst2015pm.swbforms.api.v1;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;
import java.util.logging.Logger;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.fst2015pm.swbforms.utils.FSTUtils;
import org.fst2015pm.swbforms.utils.ShapeFileConverter;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

@Path("/services")
public class GeolayerService {
	static Logger log = Logger.getLogger(GeolayerService.class.getName());
	SWBScriptEngine engine;
	@Context HttpServletRequest httpRequest;
	@Context ServletContext context;
	private final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	private final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";

	@GET
	@Path("/geoLayers")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listGeoLayers() {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		SWBDataSource ds = engine.getDataSource("GeoLayer");
		
		if (null != session.getAttribute("_USER_")) {
			if (null == ds) {
				return Response.status(500).build();
			}
			
			DataObject dsFetch = null;
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", new DataObject());
				dsFetch = ds.fetch(wrapper);
				
				if (null != dsFetch) {
					DataObject response = dsFetch.getDataObject("response");
					if (null != response) {
						DataList dlist = response.getDataList("data");
						if (!dlist.isEmpty()) {
							return Response.status(200).entity(dlist).build();
						} else {
							return Response.status(200).entity("[]").build();
						}
					}
				} else {
					return Response.status(500).build();
				}
			} catch (Exception ex) {
				ex.printStackTrace();
				return Response.status(500).build();
			}
		}
		
		return Response.status(401).build();
	}
	
	@POST
	@Path("/geoLayers")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addGeLayer(String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);

		if (null != session.getAttribute("_USER_")) {
			SWBDataSource ds = engine.getDataSource("GeoLayer");
			if (null == ds) return Response.status(400).build();
			
			JSONObject objData = null;
			try {
				objData = new JSONObject(content);
			} catch (JSONException jspex) {
				return Response.status(500).build();
			}
			
			if (null != objData) {
				objData.remove("_id");
				//Transform JSON to dataobject to avoid fail
				DataObject obj = (DataObject) DataObject.parseJSON(content);									
				DataObject objNew = ds.addObj(obj);
				DataObject response = objNew.getDataObject("response");

				//If object was inserted, download and store file
				if (null != response && 0 == response.getInt("status")) {
					DataObject dlist = response.getDataObject("data");
					String oId = dlist.getId();
					
					if (oId.lastIndexOf(":") > 0) {
			            oId = oId.substring(oId.lastIndexOf(":") + 1);
			         
						//Try to update resource
			            String ext = updateLayerResource(dlist); 
			            if (null != ext) {
			            	String requestUrl = httpRequest.getScheme() +
								"://" + httpRequest.getServerName() + 
								(80 == httpRequest.getServerPort() ? "" : ":" + httpRequest.getServerPort()) +
								"/public/geolayers/" + oId + ext;
			            	dlist.put("resourceURL", requestUrl);
			            	ds.updateObj(dlist);
			            }
			        }
				}
				return Response.status(200).entity(objNew.getDataObject("response")).build();
			}
		}

		return Response.status(403).entity(ERROR_FORBIDDEN).build();
	}
	
	@GET
	@Path("/geoLayers/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getGeoLayer(@PathParam("objId") String oId) throws IOException {
		HttpSession session = httpRequest.getSession();
		engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);

		if (null != session.getAttribute("_USER_")) {
			SWBDataSource ds = engine.getDataSource("GeoLayer");

			if (null == ds) return Response.status(400).build();
			DataObject dsFetch = ds.fetchObjById(oId);
			if (null == dsFetch)
				return Response.status(400).build();

			return Response.status(200).entity(dsFetch).build();
		}

		return Response.status(403).entity(ERROR_FORBIDDEN).build();
	}
	
	@PUT
	@Path("/geoLayers/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateDataSourceObject(@PathParam("objId") String oId, String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);

		if (null != session.getAttribute("_USER_")) {
			SWBDataSource ds = engine.getDataSource("GeoLayer");
            DataObject updateObj = null;
            
			if (null == ds) return Response.status(400).build();
			
			JSONObject objData = null;
			try {
				objData = new JSONObject(content);
			} catch (JSONException jspex) {
				return Response.status(500).build();
			}
			
			if (null != objData) {
				//Transform JSON to dataobject to avoid fail
				DataObject obj = (DataObject) DataObject.parseJSON(content);

				updateObj = ds.updateObj(obj);
				
				//Try to update resource
	            String ext = updateLayerResource(obj); 
	            if (null != ext) {
	            	String requestUrl = httpRequest.getScheme() +
						"://" + httpRequest.getServerName() + 
						(80 == httpRequest.getServerPort() ? "" : ":" + httpRequest.getServerPort()) +
						"/public/geolayers/" + oId + ext;
	            	obj.put("resourceURL", requestUrl);
	            	ds.updateObj(obj);
	            }
				
				return Response.status(200).entity(updateObj).build();
			}
		}

		return Response.status(403).entity(ERROR_FORBIDDEN).build();
	}

	@DELETE
	@Path("/geoLayers/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeDataSourceObject(@PathParam("objId") String oId) throws IOException {
		HttpSession session = httpRequest.getSession();
		engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);

		if (null != session.getAttribute("_USER_")) {
			SWBDataSource ds = engine.getDataSource("GeoLayer");

			if (null == ds) return Response.status(400).build();
			DataObject obj = ds.fetchObjById(oId);
			if (null == obj)
				return Response.status(400).build();
			DataObject ret = ds.removeObj(obj);

			return Response.status(200).entity(ret).build();
		}

		return Response.status(403).entity(ERROR_FORBIDDEN).build();
	}
	
	private String updateLayerResource(DataObject obj) throws IOException {
		String ret = null;
		String fileUrl = obj.getString("fileLocation");
		String oId = obj.getId();
		String layerType = obj.getString("type");
		boolean zipped = Boolean.valueOf(obj.getString("zipped"));
	
		String resourcePath = downloadResource(fileUrl, zipped);
		if (oId.lastIndexOf(":") > 0) {
            oId = oId.substring(oId.lastIndexOf(":") + 1);
        }
		
		if (null != resourcePath) {
			if (zipped) {
				String zipPath = obj.getString("zipPath");
				resourcePath += zipPath;
			}
		
			String newFileName = context.getRealPath("/") + "public/geolayers/" + oId;
			
			//Convert file if it is a shapefile
			if ("shapeFile".equals(layerType)) {
				ShapeFileConverter converter = new ShapeFileConverter();

				try {
					//System.out.println("must convert "+resourcePath+ (zipped ? "" : "/tempFile")+" to "+newFileName+".geojson");
					converter.ShpToGeoJSON(newFileName, resourcePath+ (zipped ? "" : "/tempFile"));
					ret = ".geojson";
				} catch (Exception ex) {
					ex.printStackTrace();
					return ret;
				}
			} else { //kml or geojson, just copy resource
				//Get file extension
				String ext = ".kml";
				if ("geoJSON".equals(layerType)) ext = ".geojson";
				ret = ext;
				//System.out.println("must copy "+resourcePath + (zipped ? "" : "/tempFile")+" to " + newFileName + ext);
				org.apache.commons.io.FileUtils.copyFile(new File(resourcePath+(zipped ? "" : "/tempFile")), new File(newFileName + ext));
			}
			org.apache.commons.io.FileUtils.deleteQuietly(new File(resourcePath));
			return ret;
		}
		return null;
	}
	
	private String downloadResource(String fileURL, boolean zipped) throws IOException {
		String fileUrl = fileURL;
		boolean remote = false;
		
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
			log.info("GeoLayerService :: Downloading resource "+ url +"...");
			destDir = new File(destPath,"tempFile");
			org.apache.commons.io.FileUtils.copyURLToFile(url, destDir, 5000, 5000);
			fileUrl = destPath + "/tempFile";
		}
		
		if (zipped) {
			log.info("GeoLayerService:: Inflating file...");
			FSTUtils.ZIP.extractAll(fileUrl, destPath);
		}
		//System.out.println("resource downloaded on "+destPath);
		return destPath;
	}
	
}
