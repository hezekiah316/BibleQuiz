<?php 
include_once "CBqMySql.php";
include_once "CDebug.php";
include_once "CSession.php";
include_once "CTemplate.php";


function ReadSessionField($sName, $sDefault = "")
{
   $sValue = (isset($_SESSION[$sName])) ? $_SESSION[$sName] : $sDefault;
   return $sValue;
} // ReadSessionField


function ReadRequestField($sName, $sDefault = "")
{
   $sValue = (isset($_REQUEST[$sName])) ? $_REQUEST[$sName] : $sDefault;
   return $sValue;
} // ReadRequestField


function Login()
{
   $Debug = new CDebug(false, "Login");

   $Session = new CSession();
   $Session->Reset();

   $Page = new CTemplate("login");
   $Page->Display();

} // Login


function MainMenu()
{
	$Debug = new CDebug(false, "MainMenu");
	
	$Page = new CTemplate("main-menu");
	$Page->Display();
	
} // MainMenu

function DataEntry(CBqMySql $Data = null)
{
   $Debug = new CDebug(false, "DataEntry");

   // Get values needed for loading form if they don't already exist
   if ($Data === null){
      $Data = new CBqMySql();
   } // if
   
   $Page = new CTemplate("data-entry");
   $Page->AddData($Data)->Display();

} // DataEntry

function Logout()
{
   $Debug = new CDebug(false, "Logout");

   $Session = new CSession();
   $Session->Reset();
   
   $Page = new CTemplate("logout");
   $Page->Display();

} // Logout


function Save()
{
   $Debug = new CDebug(false, "Save");

   $Data = new CBqMySql();
   
   $Data->sQuestion   = ReadRequestField("question");
   $Data->sAnswerA    = ReadRequestField("answerA");
   $Data->sAnswerB    = ReadRequestField("answerB");
   $Data->sAnswerC    = ReadRequestField("answerC");
   $Data->sAnswerD    = ReadRequestField("answerD");
   $Data->sCorrect    = ReadRequestField("correct");
   $Data->sScripture  = ReadRequestField("scripture");
   $Data->sSection    = ReadRequestField("section");
   $Data->sSource     = ReadRequestField("source");
   $Data->iIndex      = (int)ReadRequestField("index", 0);
 
   if ($Data->CheckInput() && $Data->WriteToDb()) { 
      
      // show blank form
      $sMessage = "Successfully saved " . $Data->GetSource();
      $Data->ClearData();
      
   } else {
   
      // redisplay form with data, indicating error condition
      $sMessage = "Error: {$Data->sError}";
      $Data->SetSelects();
      
   } // if

   $Data->sMessage = $sMessage;
   DataEntry($Data);
   
   return;
} // Save


function Export()
{
	$Debug = new CDebug(false, "Export");
	
	$Page = new CTemplate("export");
	$Page->Display();
	
} // Export


function Verify()
{
	$Debug = new CDebug(false, "Verify");
	
	$Page = new CTemplate("verify");
	$Page->Display();
	
} // Verify


function ViewStats()
{
	$Debug = new CDebug(false, "ViewStats");
	
	$Data = new CBqMySql();
	$Data->CalculateStats();
		
	$Page = new CTemplate("view-stats");
	$Page->AddData($Data)->Display();
	
} // ViewStats


function TestUnits()
{
	$Debug = new CDebug(false, "TestUnits");

	$Page = new CTemplate("test");
	$Page->AddData($Data)->Display();

} // ViewStats




/**
 * Presents an error message and terminates the script. 
 * Also writes a backtrace of function calls to the debug log.
 *
 * @param {string} errorMessage Error message to display
 * @return nothing
 */
function kill($sFile, $iLine, $sError, $errorMessage = "")
{
	$Debug = new CMobileDebug(false, "kill");

	if (func_num_args() > 1) {

		if (get_class($sError) === "mysqli") {
			$sMysqlError = $sError->error;
			$sError->close();
		} else {
			$sMysqlError = $sError;
		} // if

		if (!strlen($errorMessage)) {
			$errorMessage = "Error, query failed";
		} // if

		echo "{$errorMessage} ({$sFile}, {$iLine}): {$sMysqlError}";	// cf Web Database Application with PHP and MySQL, 2nd ed., p 416 ff.

	} else {
		$errorMessage = func_get_arg(0);
		echo $errorMessage;
	} // if

	// cf Web Database Application with PHP and MySQL, 2nd ed., p 416 ff.
	$trace = debug_backtrace();
	$calls = "\nBacktrace: ";
	for ($i = 0; $i < count($trace); $i++) {
		$callNumber = $i - 0;
		$calls .= "\n   {$callNumber}: {$trace[$i]["function"]} ";
		$calls .= "(called from line {$trace[$i]["line"]} in {$trace[$i]["file"]})";
	}
	$calls .= "\n";

	$Debug->Write($errorMessage);
	$Debug->Write($calls);

	$calls = nl2br($calls);
	echo $calls;

	CaptureRedirects();
} // kill
