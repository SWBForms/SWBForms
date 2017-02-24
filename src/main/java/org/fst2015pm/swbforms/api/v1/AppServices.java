package org.fst2015pm.swbforms.api.v1;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.NewCookie;
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
	private boolean useCookies = false;
	
	/**
	 * Creates a session token for a user
	 * @param content request body
	 * @return Status code 200 with user data in request body on success
	 * @throws IOException
	 */
	@POST
	@Path("/login")
	@Consumes("application/json")
	@Produces("application/json")
	public Response loginUser(String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		DataObject res = new DataObject();
		boolean create = false;
		Response ret;
		
		//Init platform with global configuration
		engine = DataMgr.initPlatform(session);
		
		//Get request body
		JSONObject objData;
		try {
			objData = new JSONObject(content);
		} catch (JSONException jspex) {
			ret = Response.status(400).entity("Malformed request body").build();
			return ret;
		}
		
		//Find user in User datasource
		DataObject user = findUser(engine.getDataSource("User"), objData.optString("email"), objData.optString("password")); 
		if (null == user) {
			//res.put("msg", "Bad credentials");
			ret = Response.status(403).entity("Bad credentials").build();
			return ret;
		}
		
		//Find user session
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
		
		//Update session object
		if (create) {
			ds.addObj(sessData);
		} else {
			ds.updateObj(sessData);
		}
		
		//Build response
		DataObject respSessData = new DataObject();
		respSessData.put("sessionId", "APPSESSIONID");
		respSessData.put("value", token);
		
		DataObject respUserData = new DataObject();
		respUserData.put("fullname", user.getString("fullname"));
		respUserData.put("email", user.getString("email"));
		
		res.put("user", respUserData);
		res.put("session", respSessData);
		
		if (useCookies) {
			ret = Response.status(200).entity(res).cookie(new NewCookie("APPSESSIONID", token, null, null, null, (60 * expireMinutes), false, true)).build();
		} else {
			ret = Response.status(200).entity(res).build();
		}
		
		return ret;
	}
	
	/**
	 * Destroys a user session
	 * @return Status code 200 on success
	 * @throws IOException
	 */
	@POST
	@Path("/logout")
	@Consumes("application/json")
	@Produces("application/json")
	public Response logoutUser(@Context HttpHeaders headers) throws IOException {
		HttpSession session = httpRequest.getSession();
		DataObject res = new DataObject();
		
		String authorization = getAuthCredentials(httpRequest, useCookies);
		if (null == authorization || authorization.isEmpty()) {
			res.put("msg", "Unauthorized");
			return Response.status(401).entity(res).build();
		}
		
		//authorization = authorization.replace("Token token=", "");
		engine = DataMgr.initPlatform(session);
		
		SWBDataSource ds = engine.getDataSource("UserSession");
		DataObject sess = getUserSessionObjectByToken(ds, authorization);
		
		if (null != sess) {
			ds.removeObj(sess);
		} else {
			res.put("msg", "Bad request");
			return Response.status(400).entity(res).build();
		}
		
		if (useCookies) {
			return Response.status(200).cookie(new NewCookie("APPSESSIONID", null, null, null, null, 0, false, true)).build();
		} else {
			return Response.status(200).build();
		}
	}
	
	/**
	 * Gets user session token from authorization headers or session cookie
	 * @param request Request object
	 * @param checkCookies whether to check session cookie
	 * @return
	 */
	private String getAuthCredentials(HttpServletRequest request, boolean checkCookies) {
		//Find session token in authorization headers
		String ret = request.getHeader("authorization"); 
		if (null != ret) {
			ret = ret.replace("Token token=", "");
		} else if (checkCookies && null != request.getCookies()) {
			Cookie cookies [] = request.getCookies();
			for (Cookie c : cookies) {
				if ("APPSESSIONID".equals(c.getName()) && !c.getValue().isEmpty()) {
					//TODO: check cookie maxAge or check session expiration time to invalid cookie
					ret = c.getValue();
				}
			}
		}
		
		return ret;
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
