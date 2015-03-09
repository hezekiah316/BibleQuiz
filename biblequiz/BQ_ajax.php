<?php
/**
 * Main PHP script called via Ajax by BQ.
 */
include_once "{$_SERVER["DOCUMENT_ROOT"]}/../php_classes/BQ_library.php";

try {
	$Debug = new CDebug(false, __FILE__);

	$Debug->PrintArray($_REQUEST, "REQUEST -> ");

	$sFunction = ReadRequestField("sFunction");
   if (strlen($sFunction) === 0) {
      throw new Exception("Access denied (" . __FILE__ . " at line " . __LINE__ . "). No function_name present.");
   } // if

   // call requested function
   $aData = $sFunction();
//    $Debug->PrintArray($aData, "data returned from function ->");

   $aData = AddError($aData);
//    $Debug->PrintArray($aData, "data with error code added ->");

} catch (Exception $e) {
   $Debug->Write("Caught exception: " . $e->getMessage());
   $aData = AddError($aData, 1, $e->getMessage());
} // try/catch

$Debug->PrintArray($aData, "returning data ->");
$sData = json_encode($aData);
$Debug->Write($sData);

$Debug->PrintArray($_SERVER, "SERVER -> ");


echo $sData;
return;

///////////////////////////////////////////

function AddError($aData, $iCode = 0, $sMessage = "")
{
	if (!isset($aData["Error"])) {
	   $aData["Error"] = array();
	   $aData["Error"]["iCode"]    = $iCode;
	   $aData["Error"]["sMessage"] = $sMessage;
	} // if
   return $aData;
} // AddError

function GetSize()
{
	$Debug = new CDebug(false, "GetNewVersion");

	$iBrowserVersion = (int)ReadRequestField("iCurrent");
	$Debug->Write("current version in browser -> {$iBrowserVersion}");

	$aData = array();

	// Get current version from MySQL
	$Db = new CBqMySql();
	if ($Db->iError != 0) {
		AddError($aData, $Db->iError, $Db->sError);
	} else {

		$iBqVersion = $Db->GetDatabaseVersion();

		$Debug->Write("Formatting data ...");
		$aData["Version"] = array();
		$aData["Version"]["iBrowser"]  = $iBrowserVersion;
		$aData["Version"]["iDatabase"] = $iBqVersion;

		// if current version > browser version, add database data
		$aTempData = array();
// 		if ($iBqVersion > $iBrowserVersion) {
			$aTempData["Statistics"] = $Db->GetDatabaseStatistics();
			$aTempData["Data"]       = $Db->GetDatabaseData(); // to get only new items, use ($iBrowserVersion);
// 		} // if
		$jsonData = json_encode($aTempData);
		$aData["Version"]["iSize"] = (int)(strlen($jsonData) / 1024) + 1;

	} // if

	$Debug->PrintArray($aData, "returning data from function -> ");

	return $aData;
} // GetNewVersion

function GetNewVersion()
{
   $Debug = new CDebug(false, "GetNewVersion");

   $iBrowserVersion = ReadRequestField("iCurrent");
   $Debug->Write("current version in browser -> {$iBrowserVersion}");

   $aData = array();

   // Get current version from MySQL
   $Db = new CBqMySql();
   if ($Db->iError != 0) {
   	AddError($aData, $Db->iError, $Db->sError);
   } else {

	   $iBqVersion = $Db->GetDatabaseVersion();

	   $Debug->Write("Formatting data ...");
	   $aData["Version"] = array();
	   $aData["Version"]["iBrowser"]  = $iBrowserVersion;
	   $aData["Version"]["iDatabase"] = $iBqVersion;

	   // if current version > browser version, add database data
	   if ($iBqVersion > $iBrowserVersion) {
	      $aData["Statistics"] = $Db->GetDatabaseStatistics();
	      $aData["Data"]       = $Db->GetDatabaseData($iBrowserVersion);
	   } // if

   } // if

   $Debug->PrintArray($aData, "returning data from function -> ");

   return $aData;
} // GetNewVersion

