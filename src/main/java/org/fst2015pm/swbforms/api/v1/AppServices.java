package org.fst2015pm.swbforms.api.v1;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.DataUtils;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 * REST endpoint for app services
 * @author Hasdai Pacheco
 *
 */
@Path("/services")
public class AppServices {
	private int expireMinutes = 30;
	SWBScriptEngine engine;
	@Context HttpServletRequest httpRequest;
	
	/**
	 * Creates a session token for a user
	 * @param content request body
	 * @return Status code 200 with user data in request body on success
	 * @throws IOException
	 */
	@POST
	@Path("/login")
	@Produces("application/json")
	public Response loginUser(String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		DataObject res = new DataObject();
		engine = DataMgr.initPlatform(session);
		boolean create = false;
				
		JSONObject objData;
		try {
			objData = new JSONObject(content);
		} catch (JSONException jspex) {
			return Response.status(500).build();
		}
		
		//Find user in User datasource
		DataObject user = findUser(engine.getDataSource("User"), objData.optString("email"), objData.optString("password")); 
		if (null == user) {
			res.put("msg", "Bad credentials");
			return Response.status(403).entity(res).build();
		}
		
		SWBDataSource ds = engine.getDataSource("UserSession");
		String token = UUID.randomUUID().toString();
		
		String userId = user.getId();
		DataObject sessData = getUserSessionObject(ds, userId); 
		if (null == sessData) {
			create = true;
			sessData = new DataObject();
			sessData.put("user", userId);
		}
		sessData.put("token", token);
		sessData.put("expiration", new Date().getTime() + (1000 * 60 * expireMinutes));
		
		if (create) {
			ds.addObj(sessData);
		} else {
			ds.updateObj(sessData);
		}
		
		res.put("fullname", user.getString("fullname"));
		res.put("email", user.getString("email"));
		res.put("token", token);
		return Response.status(200).entity(res).build();
	}
	
	/**
	 * Destroys a user session
	 * @return Status code 200 on success
	 * @throws IOException
	 */
	@POST
	@Path("/logout")
	@Produces("application/json")
	public Response logoutUser(@Context HttpHeaders headers) throws IOException {
		HttpSession session = httpRequest.getSession();
		DataObject res = new DataObject();
		String authorization = headers.getRequestHeader("Authorization").get(0);
		if (null == authorization || authorization.isEmpty()) {
			res.put("msg", "Unauthorized");
			return Response.status(401).entity(res).build();
		}
		
		authorization = authorization.replace("Token token=", "");
		engine = DataMgr.initPlatform(session);
		
		SWBDataSource ds = engine.getDataSource("UserSession");
		DataObject sess = getUserSessionObjectByToken(ds, authorization);
		
		if (null != sess) {
			ds.removeObj(sess);
		} else {
			res.put("msg", "Bad request");
			return Response.status(400).entity(res).build();
		}
		
		return Response.status(200).build();
	}
	
	/**
	 * Gets user session object by provided token
	 * @param sesDS UserSession DataSource
	 * @param token User token
	 * @return User session object matching provided token or null
	 */
	private DataObject getUserSessionObjectByToken(SWBDataSource sesDS, String token) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("token", token);
		
		DataObject dsFetch = null;
		if (null != sesDS) {
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = sesDS.fetch(wrapper);
			} catch (IOException ioex) {
				ioex.printStackTrace();
			}
		}
		
		if (null != dsFetch) {
			DataObject response = dsFetch.getDataObject("response");
			if (null != response) {
				DataList dlist = response.getDataList("data");
				if (!dlist.isEmpty()) {
					ret = dlist.getDataObject(0);
				}
			}
		}
		
		return ret;
	}
	
	/**
	 * Gets user session object by provided userId
	 * @param sesDS UserSession DataSource
	 * @param userId User ID
	 * @return User session object matching provided ID or null
	 */
	private DataObject getUserSessionObject(SWBDataSource sesDS, String userId) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("user", userId);
		
		DataObject dsFetch = null;
		if (null != sesDS) {
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = sesDS.fetch(wrapper);
			} catch (IOException ioex) {
				ioex.printStackTrace();
			}
		}
		
		if (null != dsFetch) {
			DataObject response = dsFetch.getDataObject("response");
			if (null != response) {
				DataList dlist = response.getDataList("data");
				if (!dlist.isEmpty()) {
					ret = dlist.getDataObject(0);
				}
			}
		}
		
		return ret;
	}
	
	/**
	 * Gets user object by provided email and password
	 * @param sesDS User DataSource
	 * @param email User email
	 * @param password User password
	 * @return User object matching provided data or null
	 */
	private DataObject findUser(SWBDataSource userDS, String email, String password) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("email", email);
		queryObj.put("password", DataUtils.encodeSHA(password));
		
		DataObject dsFetch = null;
		if (null != userDS) {
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = userDS.fetch(wrapper);
			} catch (IOException ioex) {
				ioex.printStackTrace();
			}
		}
		
		if (null != dsFetch) {
			DataObject response = dsFetch.getDataObject("response");
			if (null != response) {
				DataList dlist = response.getDataList("data");
				if (!dlist.isEmpty()) {
					ret = dlist.getDataObject(0);
				}
			}
		}
		
		return ret;
	}
}
