<?php
class CSession
{
   private $_ks_BQ_Admin_Password;
   private $_ks_BQ_Session = "hezekiah316";

   function __construct()
   {
   	$Debug = new CDebug(false, "CSession constructor");

   	$ini_file = parse_ini_file("{$_SERVER["DOCUMENT_ROOT"]}/../.private/BQ.ini", true);
	   $this->_ks_BQ_Admin_Password = $ini_file["CSession"]["password"];

	   $Debug->PrintArray($ini_file);

      if (!isset($_SESSION[$this->_ks_BQ_Session])) {
         $_SESSION[$this->_ks_BQ_Session] = "";
      } // if
   } // constructor

   public function Set($sPassword)
   {
      $bSuccess = false;
      if ($sPassword === $this->_ks_BQ_Admin_Password) {
         $sSha1 = sha1($sPassword);
         $_SESSION[$this->_ks_BQ_Session] = $sSha1;
         $bSuccess = true;
      } // if
      return $bSuccess;
   } // Set

   public function GetRequest()
   {
      return (isset($_REQUEST[$this->_ks_BQ_Session])) ? $_REQUEST[$this->_ks_BQ_Session] : "";
   } // GetRequest

   public function Check()
   {
      return ($_SESSION[$this->_ks_BQ_Session] === sha1($this->_ks_BQ_Admin_Password));
   } // Check

   public function Reset()
   {
      $_SESSION[$this->_ks_BQ_Session] = "";
   }
} // CSession
