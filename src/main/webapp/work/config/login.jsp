<%@page import="org.semanticwb.datamanager.*"%><%
String email=request.getParameter("email");
String password=request.getParameter("password");

if(email!=null && password!=null)
{
  SWBScriptEngine engine=DataMgr.initPlatform(session);
  SWBDataSource ds=engine.getDataSource("User");
  DataObject r=new DataObject();
  DataObject data=new DataObject();
  r.put("data", data);
  data.put("email", email);
  data.put("password", password);
  DataObject ret=ds.fetch(r);

  DataList rdata=ret.getDataObject("response").getDataList("data");

  if(!rdata.isEmpty())
  {
    session.setAttribute("_USER_", rdata.get(0));
    response.sendRedirect("/");
    return;
  }
}
%><!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="img/favicon.ico">

    <title>Login</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="css/animate.css">
    <style type="text/css">
      .table tbody{background-color:#fff}body{padding-top:50px;background-color:#eee}.main{padding:20px}@media (min-width: 768px){.main{padding-right:40px;padding-left:40px}}.main .page-header{margin-top:0}.placeholders{margin-bottom:30px;text-align:center}.placeholders h4{margin-bottom:0}.placeholder{margin-bottom:20px}.placeholder img{display:inline-block;border-radius:50%}.form-signin{max-width:330px;padding:15px;margin:0 auto}.form-signin .form-control{position:relative;height:auto;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:10px;font-size:16px;margin-bottom:10px}.form-signin .form-control:focus{z-index:2}.sub-header{padding-bottom:10px;border-bottom:1px solid #eee}
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
        <h2 class="form-signin-heading">Please log in</h2>
        <input name="email" type="email" class="form-control" placeholder="Email" required autofocus>
        <input name="password" type="password" class="form-control" placeholder="Password" required>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
        <p class="text-muted text-center"><small>Do not have an account?</small></p>
        <a href="/register" class="btn btn-sm btn-block">Create an account</a>
      </form>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  </body>
</html>
