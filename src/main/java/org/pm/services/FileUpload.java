/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.pm.services;

import java.io.*;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

@WebServlet(urlPatterns = {"/app/fileupload", "/app/fileupload/*"})
@MultipartConfig
public class FileUpload extends HttpServlet {

    private final String IMAGES_PATH = "/images/pm";


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //PrintWriter out = response.getWriter();
        HttpSession session = request.getSession();
        SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
        SWBDataSource ds = engine.getDataSource("PMCatalog");

        String _oldImage = "";
        String filename = "";
        String imagePath = "";
        String strParameter = request.getParameter("_id");
        DataObject pm = new DataObject();
        if (strParameter != null) {
            pm = saveData(request);
            pm.addParam("_id", strParameter);
            DataObject objOld = ds.fetchObjById(strParameter);
            if(objOld.getString("imagen") != null) {
                _oldImage = objOld.getString("imagen");
            }
        } else {
            DataObject data = saveData(request);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String date = sdf.format(new Date());
            data.addParam("fechaIncorporacion", date);
            pm = ds.addObj(data).getDataObject("response").getDataObject("data");
            strParameter = pm.getString("_id");

        }
        Part filePart = request.getPart("file");
        if (filePart != null && filePart.getSize() > 0) {
            filename = getFileName(filePart);
            filename = Normalizer.normalize(filename, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").replaceAll(" ", "_");
            imagePath = getImagePath(strParameter);
            inputStreamToFile(filePart.getInputStream(), request.getServletContext().getRealPath(imagePath), filename);
            pm.addParam("imagen", filename);
            if(_oldImage != "") {
                File oldImage = new File(request.getServletContext().getRealPath(imagePath) + "/" + _oldImage);
                oldImage.delete();
            }
        } else {
            System.out.println("error file");
        }
        ds.updateObj(pm);
    }

    private DataObject saveData(HttpServletRequest request) {
        DataObject pm = new DataObject();
        if (request.getParameter("nombre") != null && !request.getParameter("nombre").isEmpty()) {
            pm.addParam("nombre", request.getParameter("nombre"));
            if (request.getParameter("descripcion") != null && !request.getParameter("descripcion").isEmpty()) {
                pm.addParam("descripcion", request.getParameter("descripcion"));
            }
            if (request.getParameter("claveEstado") != null && !request.getParameter("claveEstado").isEmpty()) {
                pm.addParam("claveEstado", request.getParameter("claveEstado"));
            }
            if (request.getParameter("claveMunicipio") != null && !request.getParameter("claveMunicipio").isEmpty()) {
                pm.addParam("claveMunicipio", request.getParameter("claveMunicipio"));
            }
            if (request.getParameter("claveGeo") != null && !request.getParameter("claveGeo").isEmpty()) {
                pm.addParam("claveGeo", request.getParameter("claveGeo"));
            }
            if (request.getParameter("incorporado") != null && !request.getParameter("incorporado").isEmpty()) {
                pm.addParam("incorporado", Boolean.parseBoolean(request.getParameter("incorporado")));
            }

        }
        return pm;
    }

    private static String inputStreamToFile(InputStream is, String fileDir, String fileName) throws FileNotFoundException, IOException {
        String filepath = "";

        File dir = new File(fileDir);
        dir.mkdirs();
        File file = new File(fileDir, fileName);
        file.createNewFile();
        OutputStream os = new FileOutputStream(file);

        byte[] buffer = new byte[1024];
        int bytesRead;
        //read from is to buffer
        while ((bytesRead = is.read(buffer)) != -1) {
            os.write(buffer, 0, bytesRead);
        }

        filepath = file.getAbsolutePath();
        is.close();
        os.flush();
        os.close();
        return filepath;
    }

    private String getImagePath(String id) {
        StringBuffer path = new StringBuffer(IMAGES_PATH);
        if (id != null && !id.isEmpty() && id.lastIndexOf(":") > 0) {
            path.append("/");
            path.append(id.substring(id.lastIndexOf(":") + 1));

        }
        return path.toString();
    }

    private String getFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] tokens = contentDisp.split(";");
        for (String token : tokens) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf("=") + 2, token.length() - 1);
            }
        }
        return "";
    }

    private String getContentType(Part part) {
        String contentType = part.getHeader("content-type");
        return contentType;
    }
}
