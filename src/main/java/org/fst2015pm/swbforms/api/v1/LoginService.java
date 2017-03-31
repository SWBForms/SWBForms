package org.fst2015pm.swbforms.api.v1;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import org.fst2015pm.swbforms.api.v1.PMCredentialsManager;

import org.apache.commons.io.IOUtils;
import org.fst2015pm.swbforms.utils.FSTUtils;
import org.fst2015pm.swbforms.utils.SimpleMailSender;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.script.ScriptObject;

@Path("/services")
public class LoginService {
	SWBScriptEngine engine;
	
	@Context HttpServletRequest httpRequest;
	boolean useCookies = false;
	int expireMinutes = 30;
	final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";
	SWBDataSource userDataSource = null;
	SWBDataSource userSessionDataSource = null;
	SWBDataSource apiKeyDataSource = null;
	SWBDataSource resetTokens = null;
	PMCredentialsManager mgr;
	
	/**
	 * Constructor. Creates and initializes a new instance of LoginService.
	 */
	public LoginService() {
		//Get user credentials related datasources
		engine = DataMgr.initPlatform(null);
		userDataSource = engine.getDataSource("User");
		userSessionDataSource = engine.getDataSource("UserSession");
		apiKeyDataSource = engine.getDataSource("APIKey");
		resetTokens = engine.getDataSource("ResetPasswordToken");
		
		//Get configuration parameters
		engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", null);
		ScriptObject so = engine.getScriptObject();
		if (null != so && null != so.get("userSessionConfig")) {
			expireMinutes = so.get("userSessionConfig").getInt("sessTime");
		}
		
		//Create credentials manager
		mgr = new PMCredentialsManager();
	}
	
	
	/**
	 * Creates a session token for a user
	 * @param content request body
	 * @return Status code 200 with user data in request body on success
	 * @throws IOException
	 */
	@Path("/login")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response loginUser(@Context HttpHeaders headers, String content) throws IOException {
		//Check credentials
		if (!mgr.validateCredentials(httpRequest, useCookies)) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		if (null != content && !content.isEmpty()) {
			//Get request body and fail on parse
			JSONObject objData = null;
			try {
				objData = new JSONObject(content);
			} catch (JSONException jspex) {
				return Response.status(400).entity(ERROR_BADREQUEST).build();
			}
			
			//Update session object
			DataObject res = mgr.updateUserSession(objData.optString("email"), objData.optString("password"), expireMinutes);
			if (null == res) {
				return Response.status(401).entity(res).build();
			}
			return Response.status(200).entity(res).build();
		} else {
			return Response.status(400).entity(ERROR_BADREQUEST).build();
		}
				
		
		/*if (useCookies) {
			return Response.status(200).entity(res).cookie(new NewCookie("APPSESSIONID", token, null, null, null, (60 * expireMinutes), false, true)).build();
		} else {
			ret = Response.status(200).entity(res).build();
		}*/
	
	}
	
	/**
	 * Destroys a user session
	 * @return Status code 200 on success
	 * @throws IOException
	 */
	@POST
	@Path("/logout")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response logoutUser(@Context HttpHeaders headers) throws IOException {
		
		//Check auth headers
		String authorization = mgr.getAuthCredentials(httpRequest, useCookies);
		if (null == authorization || authorization.isEmpty()) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		//Check API Key
		String [] parts = authorization.split(":");
		if (parts.length != 2 || !mgr.isAPIKeyValid(parts[0])) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
				
		//Find user session
		DataObject sess = mgr.getUserSessionObjectByToken(parts[1]);
		
		//Remove session
		if (null != sess) {
			userSessionDataSource.removeObj(sess);
		} else {
			return Response.status(400).entity(ERROR_BADREQUEST).build();
		}
		
		if (useCookies) {
			return Response.status(200).cookie(new NewCookie("APPSESSIONID", null, null, null, null, 0, false, true)).build();
		} else {
			return Response.status(200).build();
		}
	}
	
	/**
	 * Resets user password
	 * @return Status code 200 on success
	 * @throws IOException
	 */
	@POST
	@Path("/resetpassword")
	@Produces(MediaType.APPLICATION_JSON)
	public Response resetUserPassword(@Context HttpHeaders headers, @Context ServletContext context) throws IOException {
		boolean create = false;
		
		//Check auth headers
		String authorization = mgr.getAuthCredentials(httpRequest, useCookies);
		if (null == authorization || authorization.isEmpty()) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		//Check API Key
		String [] parts = authorization.split(":");
		if (parts.length != 2 || !mgr.isAPIKeyValid(parts[0])) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		//Get session object
		DataObject sess = mgr.getUserSessionObjectByToken(parts[1]);
		
		if (mgr.isSessionActive(sess)) {
			//Find user and get email
			String userID = sess.getString("user");
			DataObject user = userDataSource.fetchObjById(userID);
			String email = user.getString("email");
	
			//Check if previous token exists
			DataObject queryObj = new DataObject();
			queryObj.put("user", userID);
			
			DataObject dsFetch = null;
			if (null != resetTokens) {
				try {
					DataObject wrapper = new DataObject();
					wrapper.put("data", queryObj);
					dsFetch = resetTokens.fetch(wrapper);
				} catch (IOException ioex) {
					ioex.printStackTrace();
				}
			}
			
			//Add token to datasource with expiration of 1 day
			if (null == dsFetch || null != dsFetch.getDataObject("response")) {
				dsFetch = new DataObject();
				dsFetch.put("user", userID);
				create = true;
			} else {
				dsFetch = dsFetch.getDataObject("response");
			}
			
			String resetToken = UUID.randomUUID().toString().replace("-", "");
			dsFetch.put("token", resetToken);
			dsFetch.put("expiration", new Date().getTime() + (1000 * 60 * 60 * 24));
			
			if (create) {
				resetTokens.addObj(dsFetch);
			} else {
				resetTokens.updateObj(dsFetch);
			}
			
			//Send mail with reset link
			String template = null;
			FileInputStream inputStream = new FileInputStream(context.getRealPath("/")+"work/config/resetPasswordMailTemplate.html");
			try {
			    template = IOUtils.toString(inputStream, "UTF-8");
			} finally {
			    inputStream.close();
			}
			
			if (null != template) {
				template = template.replace("___RESETTOKEN___", resetToken);
				SimpleMailSender.getInstance().sendHTMLMail("no-reply@miit.mx", email, "Solicitud de cambio de contraseña", template);
			}
			
			//Invalidate current session
			userSessionDataSource.removeObj(sess);
		} else {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/apikey")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addApiKey(String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		DataObject res = new DataObject();
		Response ret;
		
		if (null == session.getAttribute("_USER_")) {
			ret = Response.status(403).build();
		} else {
			//Get request body
			DataObject objData = null;
			try {
				JSONObject payload = new JSONObject(content);
				objData = new DataObject();
				
				if (!payload.optString("appName").isEmpty()) {
					objData.put("appName", payload.getString("appName"));
					//objData.put("enabled", payload.optBoolean("enabled"));
				}
			} catch (JSONException jspex) {
				ret = Response.status(400).entity(ERROR_BADREQUEST).build();
			}
			
			if (null == objData) {
				ret = Response.status(400).entity(ERROR_BADREQUEST).build();
			} else {
				//Generate app Key and Secret
				String apiKey = FSTUtils.API.generateAPIKey();
				String apiSecret = FSTUtils.API.generateAPIKey();
				 
				objData.put("appKey", apiKey);
				objData.put("appSecret", apiSecret);
				
				//Add api key object
				apiKeyDataSource.addObj(objData);//TODO: Check errors from SWBForms API
				
				//Build response
				res.put("key", apiKey);
				res.put("secret", apiSecret);
				ret = Response.status(200).entity(res).build();
			}
		}
		
		return ret;
	}	
}
