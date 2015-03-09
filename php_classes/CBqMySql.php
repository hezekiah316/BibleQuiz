<?php
class CBqMySql
{
	public $iId             = 0;  // not included in hash
   public $sQuestion       = "";
   public $sAnswerA        = "";
   public $sAnswerB        = "";
   public $sAnswerC        = "";
   public $sAnswerD        = "";
   public $sCorrect        = "";
   public $sSection        = "";
   public $sScripture      = ""; // not included in hash
   public $sSource         = ""; // not included in hash
   public $iIndex          = 0;  // not included in hash

   private $_iCreated      = 0;
   private $_iVerified     = 0;
   private $_sSha1Hash     = ""; // not included in hash
   private $_jsScripture   = ""; // Scripture references in array, as JSON
   private $_sSource       = ""; // not stored in database

   public $iError          = 0;  // error code to return to the user
   public $sError          = ""; // error message to return to the user

   private $_Db;
   private $_ksHost        = NULL; // "localhost"; //mysql4.000webhost.com";
   private $_ksUsername    = "";
   private $_ksPassword    = "";
   private $_ksDatabase    = "";
   private $_ksTable       = "BQ";
   private $_ksStats       = "stats";

   private $_ksCorrectEnum = array("A", "B", "C", "D");
   private $_ksSectionEnum = array("T", "H", "P", "W", "D", "G", "A", "R");

   // field for form creation
   public $sCorrectA   = "";
   public $sCorrectB   = "";
   public $sCorrectC   = "";
   public $sCorrectD   = "";

   public $sSectionT   = "";
   public $sSectionH   = "";
   public $sSectionP   = "";
   public $sSectionW   = "";
   public $sSectionD   = "";
   public $sSectionG   = "";
   public $sSectionA   = "";
   public $sSectionR   = "";

   public $sSource_1988_BCE = "";
   public $sSource_1989_BCE = "";
   public $sSource_1990_BCE = "";
   public $sSource_1991_BCE = "";
   public $sSource_1992_BCE = "";
   public $sSource_1993_BCE = "";
   public $sSource_1994_BCE = "";
   public $sSource_1995_BCE = "";
   public $sSource_1996_BCE = "";
   public $sSource_1997_BCE = "";
   public $sSource_1998_BCE = "";
   public $sSource_1999_BCE = "";
   public $sSource_2000_BCE = "";
   public $sSource_2001_BCE = "";
   public $sSource_2002_BCE = "";
   public $sSource_2003_BCE = "";
   public $sSource_2004_BCE = "";
   public $sSource_2005_BCE = "";
   public $sSource_2006_BCE = "";
   public $sSource_2007_BCE = "";
   public $sSource_2008_BCE = "";
   public $sSource_2009_BCE = "";
   public $sSource_2010_BCE = "";
   public $sSource_2011_BCE = "";
   public $sSource_2012_BCE = "";
   public $sSource_2013_BCE = "";
   public $sSource_2014_BCE = "";

   public $sMessage = ""; // message to display to user indicating success or failure


   // fields for displaying statistics
   public $iCreated_section_O   = 0; // Old Testament
   public $iCreated_section_T   = 0;
   public $iCreated_section_H   = 0;
   public $iCreated_section_P   = 0;
   public $iCreated_section_W   = 0;
   public $iCreated_section_D   = 0;
   public $iCreated_section_N   = 0; // New Testament
   public $iCreated_section_G   = 0;
   public $iCreated_section_A   = 0;
   public $iCreated_section_R   = 0;
   public $iCreated_section_B   = 0; // whole Bible

   public $iVerified_section_O  = 0; // Old Testament
   public $iVerified_section_T  = 0;
   public $iVerified_section_H  = 0;
   public $iVerified_section_P  = 0;
   public $iVerified_section_W  = 0;
   public $iVerified_section_D  = 0;
   public $iVerified_section_N  = 0; // New Testament
   public $iVerified_section_G  = 0;
   public $iVerified_section_A  = 0;
   public $iVerified_section_R  = 0;
   public $iVerified_section_B  = 0; // whole Bible

   public $iCreated_source_1988_BCE = 0;
   public $iCreated_source_1989_BCE = 0;
   public $iCreated_source_1990_BCE = 0;
   public $iCreated_source_1991_BCE = 0;
   public $iCreated_source_1992_BCE = 0;
   public $iCreated_source_1993_BCE = 0;
   public $iCreated_source_1994_BCE = 0;
   public $iCreated_source_1995_BCE = 0;
   public $iCreated_source_1996_BCE = 0;
   public $iCreated_source_1997_BCE = 0;
   public $iCreated_source_1998_BCE = 0;
   public $iCreated_source_1999_BCE = 0;
   public $iCreated_source_2000_BCE = 0;
   public $iCreated_source_2001_BCE = 0;
   public $iCreated_source_2002_BCE = 0;
   public $iCreated_source_2003_BCE = 0;
   public $iCreated_source_2004_BCE = 0;
   public $iCreated_source_2005_BCE = 0;
   public $iCreated_source_2006_BCE = 0;
   public $iCreated_source_2007_BCE = 0;
   public $iCreated_source_2008_BCE = 0;
   public $iCreated_source_2009_BCE = 0;
   public $iCreated_source_2010_BCE = 0;
   public $iCreated_source_2011_BCE = 0;
   public $iCreated_source_2012_BCE = 0;
   public $iCreated_source_2013_BCE = 0;
   public $iCreated_source_2014_BCE = 0;

   public $iVerified_source_1988_BCE = 0;
   public $iVerified_source_1989_BCE = 0;
   public $iVerified_source_1990_BCE = 0;
   public $iVerified_source_1991_BCE = 0;
   public $iVerified_source_1992_BCE = 0;
   public $iVerified_source_1993_BCE = 0;
   public $iVerified_source_1994_BCE = 0;
   public $iVerified_source_1995_BCE = 0;
   public $iVerified_source_1996_BCE = 0;
   public $iVerified_source_1997_BCE = 0;
   public $iVerified_source_1998_BCE = 0;
   public $iVerified_source_1999_BCE = 0;
   public $iVerified_source_2000_BCE = 0;
   public $iVerified_source_2001_BCE = 0;
   public $iVerified_source_2002_BCE = 0;
   public $iVerified_source_2003_BCE = 0;
   public $iVerified_source_2004_BCE = 0;
   public $iVerified_source_2005_BCE = 0;
   public $iVerified_source_2006_BCE = 0;
   public $iVerified_source_2007_BCE = 0;
   public $iVerified_source_2008_BCE = 0;
   public $iVerified_source_2009_BCE = 0;
   public $iVerified_source_2010_BCE = 0;
   public $iVerified_source_2011_BCE = 0;
   public $iVerified_source_2012_BCE = 0;
   public $iVerified_source_2013_BCE = 0;
   public $iVerified_source_2014_BCE = 0;

   public $hSources = ""; // formatted sources for display in view-stats

   public function __construct()
   {
   	$Debug = new CDebug(false, "CBqMySql constructor");

  	   $ini_file = parse_ini_file("{$_SERVER["DOCUMENT_ROOT"]}/../.private/BQ.ini", true);
      $this->_ksUsername = $ini_file["CBqMySql"]["username"];
      $this->_ksPassword = $ini_file["CBqMySql"]["password"];
      $this->_ksDatabase = $ini_file["CBqMySql"]["database"];

      $Debug->PrintArray($ini_file);

      $this->_Db = $this->OpenBqDatabase();
   } // constructor

   public function __destruct()
   {
       if (isset($this->_Db->thread_id)){
          $this->_Db->close();
       } // if
   } // destructor

   private function OpenBqDatabase()
   {
      $Debug = new CDebug(false, "OpenBqDatabase");

//       $this->_ksHost = ini_get("mysqli.default_host");
      $Db = new mysqli($this->_ksHost, $this->_ksUsername, $this->_ksPassword, $this->_ksDatabase);

      // $connect_error was broken until PHP 5.2.9 and 5.3.0.
      if ($Db->connect_error) {
      	 $this->iError = $Db->connect_errno;
         $this->sError = "MySQL Connect Error ({$Db->connect_errno}) -> {$Db->connect_error}";
         $Debug->Write($this->sError);
      } // if
      return $Db;
   } // OpenBqDatabase

   public function CheckInput()
   {
      $Debug = new CDebug(false, "CheckInput");

      $bOkay = false;

      if (strlen($this->sQuestion) === 0) {
         $this->sError = "Missing a question.";
      } else if (strlen($this->sAnswerA) === 0) {
         $this->sError = "Missing answer A.";
      } else if (strlen($this->sAnswerB) === 0) {
         $this->sError = "Missing answer B.";
      } else if (strlen($this->sAnswerC) === 0) {
         $this->sError = "Missing answer C.";
      } else if (strlen($this->sAnswerD) === 0) {
         $this->sError = "Missing answer D.";
      } else if (!in_array($this->sCorrect, $this->_ksCorrectEnum)) {
         $this->sError = "Please select the correct answer.";
      } else if (!in_array($this->sSection, $this->_ksSectionEnum)) {
         $this->sError = "Please specify the section of the Bible for this question.";
      } else if (strlen($this->sScripture) === 0) {
         $this->sError = "Please specify at least one Scripture reference for this question.";
      } else if (strlen($this->sSource) === 0) {
         $this->sError = "Please identify the source of this question.";
      } else {
         $this->sError = "";
         $bOkay  = true;
         $this->ManipulateReferences();
         $this->CreateSource();
      } // if

      return $bOkay;
   } // CheckInput

   public function WriteToDb()
   {
      $Debug = new CDebug(false, "WriteToDb");

      $bSuccess = false;
      $this->sError = "An unknown error occurred when attempting to save this data to the database.";

      $this->_iCreated  = time();
      $this->_iVerified = 0;
      $this->CreateHash();

      $query = <<<EOT
            INSERT INTO {$this->_ksTable} SET
                  section       = ?,
                  source        = ?,
                  source_index  = ?,
                  question      = ?,
                  answerA       = ?,
                  answerB       = ?,
                  answerC       = ?,
                  answerD       = ?,
                  correct       = ?,
                  scripture     = ?,
                  time_created  = ?,
                  time_verified = ?,
                  hash          = ?
EOT;
      $Debug->Write($query);
      if ($stmt = $this->_Db->prepare($query)) { // assignment
         $Debug->Write("Binding parameters:\n" .
                  "section -> {$this->sSection}\n" .
                  "source -> {$this->sSource}\n" .
                  "source_index -> {$this->iIndex}\n" .
                  "question -> {$this->sQuestion}\n" .
                  "answerA -> {$this->sAnswerA}\n" .
                  "answerB -> {$this->sAnswerB}\n" .
                  "answerC -> {$this->sAnswerC}\n" .
                  "answerD -> {$this->sAnswerD}\n" .
                  "correct -> {$this->sCorrect}\n" .
                  "scripture -> {$this->_jsScripture}\n" .
                  "time_created -> {$this->_iCreated}\n" .
                  "time_verified -> {$this->_iVerified}\n" .
                  "hash -> {$this->_sSha1Hash}"
         );
         if ($stmt->bind_param("ssisssssssiis",
                  $this->sSection,
                  $this->sSource,
                  $this->iIndex,
                  $this->sQuestion,
                  $this->sAnswerA,
                  $this->sAnswerB,
                  $this->sAnswerC,
                  $this->sAnswerD,
                  $this->sCorrect,
                  $this->_jsScripture,
                  $this->_iCreated,
                  $this->_iVerified,
                  $this->_sSha1Hash
         )) {
            if ($stmt->execute()) {
               $stmt->store_result();
               $bSuccess = ($stmt->affected_rows > 0);
               $Debug->Write("Inserted {$stmt->affected_rows} row(s)");
            } // if
         } // if
         $this->sError = (strlen($stmt->error) > 0) ? $stmt->error :
                         (strlen($this->_Db->error) > 0) ? $this->_Db->error :
                         "Affected rows -> {$stmt->affected_rows}";
         $stmt->close();
      } else {
         $this->sError = "Prepare failed! ({$this->_Db->errno}) -> {$this->_Db->error}";
      } // if

      if ($bSuccess) {
         $this->CalculateStats();
      } else {
         $Debug->Write($this->sError);
      } // if

      return $bSuccess;
   } // WriteToDb

   private function CreateHash()
   {
      $Debug = new CDebug(false, "CreateHash");

      $sBeforeHash =
            $this->sQuestion  .
            $this->sAnswerA   .
            $this->sAnswerB   .
            $this->sAnswerC   .
            $this->sAnswerD   .
            $this->sCorrect   .
            $this->sSection   .
            $this->sSource    .
            $this->_iCreated  .
            $this->_iVerified .
            $this->_jsScripture;
      $this->_sSha1Hash = sha1($sBeforeHash);
      return;
   } // CreateHash

   private function CreateSource()
   {
      $Debug = new CDebug(false, "CreateSource");

      $this->_sSource = $this->sSource . ":" . $this->iIndex;
      return;
   } // CreateSource

   public function GetSource()
   {
      return $this->_sSource;
   } // GetSource

   private function ManipulateReferences()
   {
      $Debug = new CDebug(false, "ManipulateReferences");

      $asRefs = explode(";", $this->sScripture);
      foreach ($asRefs as &$sRef) {
         $sRef = trim($sRef);
      } // foreach
      $this->_jsScripture = json_encode($asRefs);
      return;
   } // ManipulateReferences

   public function ClearData()
   {
      // values to retain for next screen
      $sSection = $this->sSection;
      $sSource  = $this->sSource;
      $iIndex   = $this->iIndex++;

      // reset all values to class defaults
      $aDefaults = get_class_vars(CBqMySql);
      foreach ($aDefaults as $sKey => $Value) {
         $this->$sKey = $Value;
      } // foreach

      // restore selected values
      $this->sSection = $sSection;
      $this->sSource  = $sSource;
      $this->iIndex   = $iIndex;

      $this->SetSelects();

      return;
   } // ClearData

   public function SetSelects()
   {
      $sName = "sCorrect{$this->sCorrect}";
      $this->$sName = "checked";

      $sName = "sSection{$this->sSection}";
      $this->$sName = "selected";

      $sName = "sSource_{$this->sSource}";
      $this->$sName = "selected";

      return;
   } // SetSelects

   private function CalculateDistinctValues($sColumn)
   {
      $Debug = new CDebug(false, "CalculateDistinctValues");

      // Open a new handle to the database
      $Db1 = $this->OpenBqDatabase();

      // Find all distinct values in a given column
      $query = "SELECT DISTINCT {$sColumn} FROM {$this->_ksTable}";
      $Debug->Write($query);
      if ($stmt1 = $Db1->prepare($query)) { // assignment
         $stmt1->execute();
         $stmt1->store_result();
         $stmt1->bind_result($sValue);
         while ($stmt1->fetch()) {
            $Debug->Write("Found -> {$sValue}");

            // Find how many items exist for each distinct value
            $Db2 = $this->OpenBqDatabase();
            $query2 = "SELECT COUNT({$sColumn}) FROM {$this->_ksTable} WHERE {$sColumn}=?";
            $Debug->Write($query2);
            if ($stmt2 = $Db2->prepare($query2)) { // assignment
               $stmt2->bind_param("s", $sValue);
               $stmt2->execute();
               $stmt2->store_result();
               $stmt2->bind_result($iCreated);
               $stmt2->fetch();
               $stmt2->close();
            } // if
            $Db2->close();
            $sFieldname = "iCreated_{$sColumn}_{$sValue}";
            $this->$sFieldname = $iCreated;
            $Debug->Write("Created {$sFieldname} -> {$iCreated}");

            // Find how many items have been verified for each distinct value
            $Db3 = $this->OpenBqDatabase();
            $query3 = "SELECT COUNT({$sColumn}) FROM {$this->_ksTable} WHERE {$sColumn}=? AND time_verified>0";
            $Debug->Write($query3);
            if ($stmt3 = $Db3->prepare($query3)) { // assignment
               $stmt3->bind_param("s", $sValue);
               $stmt3->execute();
               $stmt3->store_result();
               $stmt3->bind_result($iVerified);
               $stmt3->fetch();
               $stmt3->close();
            } // if
            $Db3->close();
            $sFieldname = "iVerified_{$sColumn}_{$sValue}";
            $this->$sFieldname = $iVerified;
            $Debug->Write("Verified {$sFieldname} -> {$iVerified}");

            // Record this information in the statistics table
            $Db4 = $this->OpenBqDatabase();
            $query4 = <<<EOT
                  INSERT INTO {$this->_ksStats} SET
                        field    = ?,
                        created  = ?,
                        verified = ?
EOT;
            $Debug->Write($query4);
            if ($stmt4 = $Db4->prepare($query4)) { // assignment
               $Debug->Write("INSERT INTO {$this->_ksStats} SET field={$sValue}, created={$iCreated}, verified={$iVerified}");

               $stmt4->bind_param("sii", $sValue, $iCreated, $iVerified);
               $stmt4->execute();
               $stmt4->close();
            } // if
            $Db4->close();
         } // while
      } // if

      $Db1->close();
      return;
   } // CalculateDistinctValues

   function CalculateAggregateStats()
   {
      $Debug = new CDebug(false, "CalculateAggregateStats");

      $this->iCreated_section_O = array_sum(array(
            $this->iCreated_section_T,
            $this->iCreated_section_H,
            $this->iCreated_section_P,
            $this->iCreated_section_W,
            $this->iCreated_section_D
      ));

      $this->iCreated_section_N = array_sum(array(
            $this->iCreated_section_G,
            $this->iCreated_section_A,
            $this->iCreated_section_R
      ));

      $this->iVerified_section_O = array_sum(array(
            $this->iVerified_section_T,
            $this->iVerified_section_H,
            $this->iVerified_section_P,
            $this->iVerified_section_W,
            $this->iVerified_section_D
      ));

      $this->iVerified_section_N = array_sum(array(
            $this->iVerified_section_G,
            $this->iVerified_section_A,
            $this->iVerified_section_R
      ));

      $this->iCreated_section_B  = $this->iCreated_section_O  + $this->iCreated_section_N;
      $this->iVerified_section_B = $this->iVerified_section_O + $this->iVerified_section_N;


      // Record this information in the statistics table
      $Db = $this->OpenBqDatabase();
      $query = <<<EOT
            INSERT INTO {$this->_ksStats} SET
                 field    = ?,
                 created  = ?,
                 verified = ?
EOT;
      $Debug->Write($query);
       if ($stmt = $Db->prepare($query)) { // assignment
          $sField = "O";
          $stmt->bind_param("sii", $sField, $this->iCreated_section_O, $this->iVerified_section_O);
          $stmt->execute();

          $sField = "N";
          $stmt->bind_param("sii", $sField, $this->iCreated_section_N, $this->iVerified_section_N);
          $stmt->execute();

          $sField = "B";
          $stmt->bind_param("sii", $sField, $this->iCreated_section_B, $this->iVerified_section_B);
          $stmt->execute();

          $stmt->close();
       } // if
      $Db->close();

      return;
   } // CalculateAggregateStats

   private function ClearStatsTable()
   {
      $Debug = new CDebug(false, "ClearStatsTable");

      // Record this information in the statistics table
      $Db = $this->OpenBqDatabase();
      $query = "DELETE FROM {$this->_ksStats} WHERE field!='BQ_database_version'";
      $Debug->Write($query);
      if ($stmt = $Db->prepare($query)) { // assignment
         $stmt->execute();
         $stmt->close();
      } // if
      $Db->close();
      return;
   } // ClearStatsTable

   private function GetFormattedSourcesTable()
   {
      $Debug = new CDebug(false, "GetFormattedSourcesTable");

      $query = "SELECT field, created, verified FROM {$this->_ksStats} WHERE CHAR_LENGTH(field) > 1";
      if ($stmt = $this->_Db->prepare($query)) { // assignment
         $stmt->execute();
         $stmt->store_result();
         $stmt->bind_result($sField, $iCreated, $iVerified);
         while ($stmt->fetch()) {
            $hNewRow = "<tr><td>{$sField}</td><td>{$iCreated}</td><td>{$iVerified}</td></tr>";
            $Debug->Write($hNewRow);
            $this->hSources .= $hNewRow;
         } // while
         $stmt->close();
      } // if

      return;
   } // GetFormattedSourcesTable

   private function UpdateVersion()
   {
      $Debug = new CDebug(false, "UpdateVersion");

      $query = "UPDATE {$this->_ksStats} SET created=created+1 WHERE field='BQ_database_version'";
      if ($stmt = $this->_Db->prepare($query)) { // assignment
         $stmt->execute();
         $stmt->close();
         $Debug->Write("Executing query -> {$query}, affected rows -> {$stmt->affected_rows()}");
      } // if

      return;
   } // UpdateVersion

   public function CalculateStats()
   {
      // three columns: field, created, verified
      $this->ClearStatsTable();

      // count by source
      $this->CalculateDistinctValues("section");

      // count by section
      $this->CalculateDistinctValues("source");

      // add some aggregate stats
      $this->CalculateAggregateStats();

      // prepare sources for display in view-stats page
      $this->GetFormattedSourcesTable();

      // update the BQ database version number
      $this->UpdateVersion();

      return;
   } // CalculateStats

   public function GetDatabaseVersion()
   {
      $Debug = new CDebug(false, "GetDatabaseVersion");

      $iVersion = 0;

      $query = "SELECT created FROM {$this->_ksStats} WHERE field='BQ_database_version'";
      $Debug->Write($query);
      if ($stmt = $this->_Db->prepare($query)) { // assignment
         $stmt->execute();
         $stmt->store_result();
         $stmt->bind_result($iVersion);
         $stmt->fetch();
         $stmt->close();
      } // if

      $Debug->Write("current database version -> {$iVersion}");

      return $iVersion;
   } // GetDatabaseVersion

   public function GetDatabaseStatistics()
   {
      $Debug = new CDebug(false, "GetDatabaseStatistics");

      $aStats = array();

      $query = "SELECT field, created, verified FROM {$this->_ksStats}";
      if ($stmt = $this->_Db->prepare($query)) { // assignment
         $stmt->execute();
         $stmt->store_result();
         $stmt->bind_result($sField, $iCreated, $iVerified);
         while ($stmt->fetch()) {
            $Debug->Write("field -> {$sField}, created -> {$iCreated}, verified -> {$iVerified}");
            $aStats[$sField] = $iCreated; // change this to $iVerified in the future
         } // while
         $stmt->close();
      } // if

      $Debug->PrintArray($aStats, "current database statistics -> ");

      return $aStats;
   } // GetDatabaseStatistics

   public function GetDatabaseData($iOldVersion = -1)
   {
      $Debug = new CDebug(false, "GetDatabaseData");

      $aData = array();

      $query = <<<EOT
         SELECT
            id,
      		section,
      		source,
      		source_index,
      		question,
      		answerA,
      		answerB,
      		answerC,
      		answerD,
      		correct,
      		scripture
         FROM {$this->_ksTable} WHERE id > ?
EOT;
      if ($stmt = $this->_Db->prepare($query)) { // assignment
         $stmt->bind_param("i", $iOldVersion);
         $stmt->execute();
         $stmt->store_result();
         $stmt->bind_result(
         		$iId,
         		$cSection,
         		$sSource,
         		$iSource_index,
         		$sQuestion,
         		$sAnswerA,
         		$sAnswerB,
         		$sAnswerC,
         		$sAnswerD,
         		$cCorrect,
         		$sScripture
         );
         while ($stmt->fetch()) {
         	$aData[$iId]["id"]           = $iId;
         	$aData[$iId]["section"]      = $cSection;
         	$aData[$iId]["source"]       = $sSource;
         	$aData[$iId]["source_index"] = $iSource_index;
         	$aData[$iId]["question"]     = $sQuestion;
         	$aData[$iId]["answerA"]      = $sAnswerA;
         	$aData[$iId]["answerB"]      = $sAnswerB;
         	$aData[$iId]["answerC"]      = $sAnswerC;
         	$aData[$iId]["answerD"]      = $sAnswerD;
         	$aData[$iId]["correct"]      = $cCorrect;
         	$aData[$iId]["scripture"]    = $sScripture;
         } // while
         $stmt->close();
      } // if

      $Debug->PrintArray($aData, "current database data -> ");

      return $aData;
   } // GetDatabaseData

} // CBqMySql
