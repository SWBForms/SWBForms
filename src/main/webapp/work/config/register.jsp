<%--
    Document   : register
    Created on : 26-ago-2015, 17:54:48
    Author     : javiersolis
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="org.semanticwb.datamanager.*"%><%
    String fullname=request.getParameter("fullname");
    String email=request.getParameter("email");
    String password=request.getParameter("password");
    String password2=request.getParameter("password2");
    if(email!=null && password!=null)
    {
        if(password.equals(password2))
        {
            SWBScriptEngine engine=DataMgr.initPlatform(session);
            SWBDataSource ds=engine.getDataSource("User");
            DataObject obj=new DataObject();
            obj.put("fullname", fullname);
            obj.put("email", email);
            obj.put("password", password);
            ds.addObj(obj);
            //engine.close();
            response.sendRedirect("/login");
            return;
        }
    }
%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="img/favicon.ico">

    <title>Register</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="app/lib/animate.css/animate.min.css">
    <style type="text/css">
      body{padding-top:50px;background-color:#eee}
      .form-signin{max-width:330px;padding:15px;margin:0 auto}
      .form-signin .form-control{position:relative;height:auto;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:10px;font-size:16px;margin-bottom:10px}
      .form-signin .form-control:focus{z-index:2}
    </style>
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container animated fadeInDown">
      <form class="form-signin" action="" method="post">
        <h2 class="form-signin-heading">Registro</h2>
        <input name="fullname" type="text" class="form-control" placeholder="Full name" required autofocus>
        <input name="email" type="email" class="form-control" placeholder="Email" required>
        <input name="password" type="password" class="form-control" placeholder="Password" required>
        <input name="password2" type="password" class="form-control" placeholder="Confirm password" required>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Registrarse</button>
        <p class="text-muted text-center"><small>¿Ya tiene una cuenta?</small></p>
        <a href="/login" class="btn btn-sm btn-block">iniciar sesi&oacute;n</a>
      </form>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  </body>
</html>
