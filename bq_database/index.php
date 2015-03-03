<?php
session_start();

include_once "/php_classes/BQ_library.php";

$Debug = new CDebug(true, __FILE__);

unset($_SESSION["sBaseUrl"]);
if (!isset($_SESSION["sBaseUrl"])) {
   $sProtocol = (isset($_SERVER["HTTP_SCHEME"]) && strlen($_SERVER["HTTP_SCHEME"]) > 0) ? "{$_SERVER["HTTP_SCHEME"]}" : "http";
   $sSite = $_SERVER["HTTP_HOST"];
   $sPath = str_replace("index.php", "", $_SERVER["PHP_SELF"]);
   $_SESSION["sBaseUrl"] = "{$sProtocol}://{$sSite}{$sPath}";
} // if
$Debug->Write("base URL -> {$_SESSION["sBaseUrl"]}");

$sAction = ReadRequestField("action");

$Session = new CSession();
if (!$Session->Check()) {
   $sInput = $Session->GetRequest();
   if (!$Session->Set($sInput)) {
      $sAction = "login";
   } // if
} // if


switch ($sAction) {
   case "data-entry" : DataEntry();  break;
   case "export"     : Export();     break;
   case "login"      : Login();      break;
   case "logout"     : Logout();     break;
   case "main-menu"  : MainMenu();   break;
   case "save"       : Save();       break;
   case "test"       : TestUnits();  break;
   case "verify"     : Verify();     break;
   case "view-stats" : ViewStats();  break;
   default           : MainMenu();   break;
} // if

exit;