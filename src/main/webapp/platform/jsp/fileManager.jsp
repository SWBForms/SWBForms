<%@page import="java.io.File"%><%@page import="java.io.FileOutputStream"%><%@page import="java.io.BufferedReader"%><%@page import="java.io.IOException"%><%@page import="java.util.Scanner"%><%!
private String readFile(String fileName) throws IOException {
  File file = new File(fileName);
  StringBuilder fileContents = new StringBuilder();
  Scanner scanner = new Scanner(file, "UTF-8");
  String lineSeparator = System.getProperty("line.separator");

  try {
    while(scanner.hasNextLine()) {
      String ln = scanner.nextLine();
      fileContents.append(ln + lineSeparator);
    }
    return fileContents.toString();
  } finally {
    scanner.close();
  }
}
%><%!
private String readPayload(BufferedReader reader) throws IOException {
  String line;
  StringBuilder buffer = new StringBuilder();
  while ((line = reader.readLine()) != null) {
      buffer.append(line.replaceAll("\\\\n", "\n"));
  }

  return buffer.toString();
}
%><%
String method = request.getMethod();
String dir = config.getServletContext().getRealPath("/");
String datasourcesDir = "app/js/datasources";
String validExts = ".js";
String fileName = request.getParameter("file");
boolean restrictFiles = true;

//System.out.println("request method: "+method);
//System.out.println("Root dir: "+dir);
//System.out.println("Full dir: "+dir+"/"+datasourcesDir);
//System.out.println("fileName:" +fileName);

if ("POST".equalsIgnoreCase(method)) {
  FileOutputStream fous = null;

  try {
    String payload = readPayload(request.getReader());
    //System.out.println("------payload-----");
    //System.out.println(payload);
    File f = new File(dir+"/"+datasourcesDir+"/"+fileName);
    fous = new FileOutputStream(f, false);
    byte[] fBytes = payload.getBytes("UTF-8");
    fous.write(fBytes);
  } catch (IOException ioex) {

  } finally {
    if (null != fous) {
      fous.close();
    }
  }
} else if ("GET".equalsIgnoreCase(method)) {
    if (null == fileName || fileName.isEmpty()) {
        StringBuilder ret = new StringBuilder();
        ret.append("[");
        File rootDir = new File(dir+"/"+datasourcesDir);
        if (!rootDir.exists()) rootDir.mkdirs();

        File [] files = rootDir.listFiles();
        if (files.length > 0) {
            for (int i = 0; i < files.length; i++) {
                File f = files[i];
                String fName = f.getName();
                if (!f.isDirectory()) {
                    if (restrictFiles) {
                        String ext = fName.substring(fName.lastIndexOf("."), fName.length());
                        if (validExts.contains(ext)) {
                            ret.append("\"").append(f.getName()).append("\"");
                            if (i < files.length - 1) {
                                ret.append(",");
                            }
                        }
                    } else {
                        ret.append("\"").append(f.getName()).append("\"");
                        if (i < files.length - 1) {
                            ret.append(",");
                        }
                    }
                }
            }
        }

        ret.append("]");
        out.print(ret.toString());
    } else {
      try {
        String fContents = readFile(dir+"/"+datasourcesDir+"/"+fileName);
        //System.out.print(fContents);
        out.print(fContents);
      } catch (IOException ioex) {

      }
    }

} else if ("PUT".equalsIgnoreCase(method)) {
    System.out.println("Should manage put");
}
%>
