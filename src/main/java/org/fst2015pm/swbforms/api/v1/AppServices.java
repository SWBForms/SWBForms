package org.fst2015pm.swbforms.api.v1;

import java.nio.charset.Charset;
import java.util.SortedMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.fst2015pm.swbforms.extractors.ExtractorManager;
import org.json.JSONArray;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.SWBScriptUtils;

/**
 * REST endpoint for app services
 * @author Hasdai Pacheco
 */
@Path("/services")
public class AppServices {
	SWBScriptEngine engine;
	SWBScriptUtils utils;
	ExtractorManager extractorManager = ExtractorManager.getInstance();
	@Context HttpServletRequest httpRequest;
	private final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	private final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";
	
	@GET
	@Path("/encoding")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAvailableCharsets() {
		HttpSession session = httpRequest.getSession();

		if (null != session.getAttribute("_USER_")) {
			SortedMap<String, Charset> map = Charset.availableCharsets();
			JSONArray ret = new JSONArray();
			for(String key : map.keySet()) {
				ret.put(key);
			}
			
			return Response.status(200).entity(ret.toString()).build();
		}
		
		return Response.status(401).build();
	}
}
