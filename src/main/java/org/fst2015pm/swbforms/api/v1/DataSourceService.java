package org.fst2015pm.swbforms.api.v1;

import java.io.IOException;
import java.util.Set;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Context;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 * REST service to manage datasources from inside app.
 **/
@Path("/datasources")
public class DataSourceService {
	SWBScriptEngine engine;
	
	@Context
	HttpServletRequest httpRequest;
	boolean checkSession = false;

	@GET
	@Produces("application/json")
	public Response getDataSourceList() throws IOException {
		HttpSession session = httpRequest.getSession();
		engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);

		if (null != session.getAttribute("_USER_")) {
			Set<String> dataSources = engine.getDataSourceNames();
			JSONArray ret;

			try {
				ret = new JSONArray();
				for (String name : dataSources) {
					ret.put(name);
				}
			} catch (JSONException jsex) {
				return Response.status(500).build();
			}

			return Response.status(200).entity(ret).build();
		}

		return Response.status(403).entity("forbidden").build();
	}

	@GET
	@Path("/{dsname}")
	@Produces("application/json")
	public Response getDataSource(@PathParam("dsname") String dataSourceId) throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);

			if (null == ds) return Response.status(400).build();
			DataObject dsFetch = ds.fetch();

			if (null != dsFetch) {
				return Response.status(200).entity(dsFetch.getDataObject("response")).build();
			} else {
				return Response.status(500).build();
			}
		}

		return Response.status(403).entity("forbidden").build();
	}

	@POST
	@Path("/{dsname}")
	@Produces("application/json")
	@Consumes("application/json")
	public Response addDataSourceObject(@PathParam("dsname") String dataSourceId, String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);
			if (null == ds) return Response.status(400).build();
			
			JSONObject objData;
			try {
				objData = new JSONObject(content);
			} catch (JSONException jspex) {
				return Response.status(500).build();
			}
			
			if (null != objData) {
				objData.remove("_id");
				DataObject obj = new DataObject();

				for (String key : objData.keySet()) {
					Object val = objData.get(key);
					obj.addParam(key, val);
				}

				if (validateObject(obj)) {
					ds.addObj(obj);
					return Response.status(200).build();
				} else {
					return Response.status(400).build();
				}
			}
		}

		return Response.status(403).entity("forbidden").build();
	}

	@GET
	@Path("/{dsname}/{objId}")
	@Produces("application/json")
	public Response getDataSourceObject(@PathParam("dsname") String dataSourceId, @PathParam("objId") String oId)
			throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);

			if (null == ds) return Response.status(400).build();
			DataObject dsFetch = ds.fetchObjById(oId);
			if (null == dsFetch)
				return Response.status(400).build();

			return Response.status(200).entity(dsFetch).build();
		}

		return Response.status(403).entity("forbidden").build();
	}

	@PUT
	@Path("/{dsname}/{objId}")
	@Produces("application/json")
	@Consumes("application/json")
	public Response updateDataSourceObject(@PathParam("dsname") String dataSourceId, @PathParam("objId") String oId,
			String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);
			if (null == ds) return Response.status(400).build();
			
			JSONObject objData;
			try {
				objData = new JSONObject(content);
			} catch (JSONException jspex) {
				return Response.status(500).build();
			}
			
			if (null != objData) {
				DataObject obj = new DataObject();

				for (String key : objData.keySet()) {
					Object val = objData.get(key);
					obj.addParam(key, val);
				}

				if (validateObject(obj)) {
					System.out.println(obj);
					ds.updateObj(obj);
				}
			}

			return Response.status(200).build();
		}

		return Response.status(403).entity("forbidden").build();
	}

	@DELETE
	@Path("/{dsname}/{objId}")
	@Produces("application/json")
	public Response removeDataSourceObject(@PathParam("dsname") String dataSourceId, @PathParam("objId") String oId)
			throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);

			if (null == ds) return Response.status(400).build();
			DataObject obj = ds.fetchObjById(oId);
			if (null == obj)
				return Response.status(400).build();
			DataObject ret = ds.removeObj(obj);

			return Response.status(200).entity(ret).build();
		}

		return Response.status(403).entity("forbidden").build();
	}

	private boolean validateObject(DataObject obj) {
		// TODO: validate object before insert
		return true;
	}
}
