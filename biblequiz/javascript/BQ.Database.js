/**
 * @fileOverview Provides functions for creating and querying the local
 * database containing the quiz data.<br />
 * 
 * @author JJF (2/12/14)
 */


/**
 * BQ.Database Provides a functions for creating and querying the local
 * database containing the quiz data.<br />
 * <br />
 * <br />
 * @namespace
 * 
 * @author JJF (6/22/2014)
 */
/* global BQ:true */
BQ.Database = (function namespace_Database() 
{
   "use strict";

   /**
    * DbVersion is the highest question number in the database stored in the 
    * browser. This value is then compared to the database on the server. If 
    * there are more questions available on the server than in the device, then
    * the additional questions are downloaded.
    * 
    * Note: This is distinct from the version of the IndexedDB database.
    */
   var DbVersion = Object.seal({
   
      // private
      _ksBqDbVersion : "BQ_DB_Version",
   
      get current() {
         return parseInt(window.localStorage.getItem(this._ksBqDbVersion), 10) || null;
      }, // get
   
      set current(iNew) {
         if (Number.isInteger(iNew) && iNew > -1) { //0) { changed to -1 for testing only
            window.localStorage.setItem(this._ksBqDbVersion, iNew);
         } // if
         return;
      } // set
      
   }); // DbVersion


   var DbSize = Object.seal({
      
      // private
      _ksBqDbSize : "BQ_DB_Size", // localStorage entry with size of database
   
      get kbytes() {
         return parseInt(window.localStorage.getItem(this._ksBqDbSize), 10) || null;
      }, // get
      
      set kbytes(iSize) {
         if (Number.isInteger(iSize) && iSize > 0) {
            window.localStorage.setItem(this._ksBqDbSize, iSize);
         } // if
         return;
      } // set
   
   }); // DbSize
   
   function StartSpinner()
   {
      $("#BQ_FirstTime_Install").addClass("ui-state-disabled");
      $.mobile.loading("show", {
         text: "",
         textVisible: false,
         theme: "a",
         textonly: false,
         html: ""
      });
   } // StartSpinner
   
   function StopSpinner()
   {
      $.mobile.loading( "hide" );
      $("#BQ_FirstTime_Install").removeClass("ui-state-disabled");
   } // StopSpinner

   var DB_info = Object.freeze({
      version: 1,
      name:    "BQ_DB",
      store:   "BQ_Questions",
      key:     "id",
      index:   "section"
   });

   var _db = null; // indexeddb used throughout Bible Quiz.
   
   // Some browsers still use prefixes for implementing window.indexedDB
   window.indexedDB      = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
   window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
   window.IDBKeyRange    = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

   var _koQuestionDefaults = Object.freeze({
         id            : 0, // always nonnegative
         section       : "", // one of "T", "H", "P", "W", "D", "G", "A", "R"
         source        : "",  // where the question came from
         source_index  : 0, // index in the source document (e.g. question number in Bible Content Quiz)
         question      : "",
         answerA       : "",
         answerB       : "",
         answerC       : "",
         answerD       : "",
         correct       : "", // one of "A", "B", "C", "D"
         scripture     : [] // an array of Scripture references (as JSON?)
   }); // _koQuestionDefaults


   function OpenDatabase(fCallback, oCallbackOptions)
   {
      if (_db === null) {
               
         var idbRequest = window.indexedDB.open(DB_info.name, DB_info.version);
         
         idbRequest.onsuccess = function(eEvent) {
            _db = eEvent.target.result;
            _db.onerror = function(eEvent) {
               alert("Database error: " + eEvent.target.errorCode);
            }; // onerror
            fCallback(oCallbackOptions);
         }; // onsuccess
         
         idbRequest.onerror = function(eEvent) {
            alert("Unable to open database: " + idbRequest.errorCode);
         }; // onerror
         
         idbRequest.onupgradeneeded = function(eEvent) {
            _db = eEvent.target.result;
            
            // Create an object store and an index
            var idbObjectStore = _db.createObjectStore(DB_info.store, {keyPath: DB_info.key});
            idbObjectStore.createIndex(DB_info.index, DB_info.index, {unique: false});
            
         }; // onupgradeneeded
         
      } else {
         
         fCallback(oCallbackOptions);
         
      } // if
      
      return;
   } // OpenDatabase

   function GetObjectStore(bWrite)
   {
      bWrite = !!bWrite;
      var sMode = (bWrite) ? "readwrite" : "readonly";
      var trans = _db.transaction(DB_info.store, sMode).objectStore(DB_info.store);
      return trans; //.objectStore(DB_info.store);
   } // GetObjectStore
   
   function _SaveData(oOptions)
   {
      var idbObjectStore = GetObjectStore(true);

      // Add data to database
      for (var i = 0; i < oOptions.oData.length; i++) {
         idbObjectStore.delete(oOptions.oData[i].id);
         idbObjectStore.add(oOptions.oData[i]);
      } // for   
      
      
      // Save some statistics
      BQ.Stats.Save(oOptions.oStatistics);
      DbVersion.current = oOptions.iVersion;

      return;            
   } // _SaveData  
   
   /**
    * @note
    *    1. c.f. https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
    */
   function SaveData(iVersion, oData, oStatistics)
   {
      // Normalize the data
      var aData = [];
      var aKeys = Object.keys(oData);
      for (var i in aKeys) {
         var ThisQuestion = $.extend(true, {}, _koQuestionDefaults, oData[i]);
         if (ThisQuestion.question.length > 0) {
            aData.push(ThisQuestion);
         } // if
      } // for

      var oOptions = {
         iVersion    : iVersion,
         oData       : aData,
         oStatistics : oStatistics
      };
      
      OpenDatabase(_SaveData, oOptions); 
            
   } // SaveData
   
   function InstallUpdate(jsonData, sStatus, jqXhr)
   {
      // Get version of data returned from Ajax call
      var iVersion = DbVersion.current;

      try {
         var oData = JSON.parse(jsonData);
         
         if (iVersion === null || oData.Version.iDatabase > iVersion) {
            iVersion = oData.Version.iDatabase;
            
            SaveData(iVersion, oData.Data, oData.Statistics);
            
         } // if
         
      } catch(e) {
         alert("Failed to install update -> " + e.message);
      } // try
      
      if (iVersion !== null) {
         // Add saved stats to correct pages
         BQ.Stats.AddStatsToApp();
         
         // Change displayed page to home page
         $(":mobile-pagecontainer").pagecontainer("change", "#BQ_Start");
      } // if
      
      StopSpinner();
      return;
   } // InstallUpdate
   
   /**
    *  Displays a message when the browser doesn't already have the BQ database 
    *  installed and the attempt to download the BQ database has failed.
    *  
    *  @param {none}
    *  @returns {none}
    *  
    *  @author JJF (7/10/14)
    */
   function UpdateFailed(jqXhr, sStatus, sErrorThrown)
   {
      StopSpinner();
      if (DbVersion.current === null) {
         $("#BQ_FirstTime_error_message").popup("enable").popup("open");
         $("#BQ_FirstTime_refresh_button").removeClass("ui-state-disabled");
      } // if
      return;
   } // UpdateFailed
   
   /**
    *  Displays a message when the browser doesn't already have the BQ database installed
    *  while the browser downloads it.
    *  
    *  @param {none}
    *  @returns {none}
    *  
    *  @author JJF (7/10/14)
    */
   function DisplayNoVersion()
   {
      $(":mobile-pagecontainer").pagecontainer("change", "#BQ_FirstTime");
      return;
   } // DisplayNoVersion

   /**
    * Initiates a download of a new version of the BQ database
    * 
    * @param {none}
    * @returns {none}
    * 
    * @author JJF (1/30/15)
    */
   function Download()
   {
      StartSpinner();
      
      var oOptions = {
            sFunction : "GetNewVersion",
            iCurrent  : DbVersion.current
      };
      $.ajax({data: oOptions}).done(InstallUpdate).fail(UpdateFailed);
      
      return;
   } // Download


   /**
    * Gets a new version of the BQ database if the user has previously installed
    * it, or asks the user's permission to install if not prebiously installed
    * 
    * @param {none}
    * @returns {none}
    * 
    * @author JJF (1/30/15)
    */
   function GetNewVersion()
   {
      // For testing only: clear out database
      // var idbDeleteRequest = window.indexedDB.deleteDatabase(DB_info.name);
      // idbDeleteRequest.onsuccess = function(eEvent) { 

         // DbVersion.current = 0;
         
         var iVersion = DbVersion.current;
   
         var oOptions = {
               sFunction : "GetSize",
               iCurrent  : iVersion
         };
         $.ajax({data: oOptions}).done(function(jsonData) {
            var oData = JSON.parse(jsonData);
            var iSize = DbSize.kbytes = oData.Version.iSize;
            $(".download_size").text(iSize + "kb");
            
            if (iVersion === null) {
               DisplayNoVersion();
            } else {
               Download();
            } // if
   
         }).fail(function() {
            var iSize = DbSize.kbytes;
            $(".download_size").text(iSize + "kb");
         }); // ajax
         
      // }; // onsuccess
      return;
   } // GetNewVersion

   // c.f. http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   function Shuffle(aArray) 
   {
      if (Array.isArray(aArray)) {
         var i = aArray.length, temp, j ;
   
         // While there remain elements to shuffle...
         while (i > 0) {
   
           // Pick a remaining element...
           j = i * Math.random() | 0; // coerce data to int, AKA Math.floor(Math.random() * i);
           i--;
   
           // And swap it with the current element.
           temp    = aArray[i];
           aArray[i] = aArray[j];
           aArray[j] = temp;
         } // while
      } else {
         aArray = [];
      } // if
      return aArray;
   } // Shuffle
   
   
   // keeps track of loading state: 
   //    undefined -> not yet specified
   //    false -> data is currently being loaded
   //    true  -> data is done loading
   var oLoaded = Object.seal({
      T: {loaded: undefined, questions: []},
      H: {loaded: undefined, questions: []},
      W: {loaded: undefined, questions: []},
      P: {loaded: undefined, questions: []},
      D: {loaded: undefined, questions: []},
      G: {loaded: undefined, questions: []},
      A: {loaded: undefined, questions: []},
      R: {loaded: undefined, questions: []}
   }); // oLoaded
   
   function _LoadQuestions(oOptions)
   {
      oLoaded[oOptions.section].loaded = (oOptions.number === 0);

      if (oOptions.number > 0) { 

         var aoSection = [];
   
         var idbObjectStore   = GetObjectStore(false);
         var idbKeyRangeValue = window.IDBKeyRange.only(oOptions.section);
         
         idbObjectStore.index(DB_info.index).openCursor(idbKeyRangeValue).onsuccess = function(eEvent) 
         {
            var idbCursor = eEvent.target.result;
            if (idbCursor) {
               var oQuestion = idbCursor.value;
               aoSection.push(idbCursor.value);
               idbCursor.continue();
            } else {
               // All done loading data; now process it
               aoSection = Shuffle(aoSection);
               oLoaded[oOptions.section].questions = aoSection.slice(0, oOptions.number);
               oLoaded[oOptions.section].loaded    = true;
            } // if
         }; // onsuccess

      } // if
            
      return;
   } // _LoadQuestions
   
   /**
    * Loads questions for a given section into the array of game questions
    * 
    * @param sSection {string} section to get array for
    * @param iNumber {int} desired number of questions for this section
    * @return {$.Deferred} A deferred object  
    * 
    * @author JJF (2/18/15)
    */
   function LoadQuestions(sSection, iNumber)
   {
      sSection = (sSection || "").slice(0, 1).toUpperCase();
      iNumber  = parseInt(iNumber, 10) || 0;

      var oOptions = {section: sSection, number: iNumber};
      
      if (_db !== null) {
         
         _LoadQuestions(oOptions);
         
      } else {

         OpenDatabase(_LoadQuestions, oOptions);
         
      } // if
      
      return;
   } //LoadQuestions
   
   function IsLoaded()
   {
      return (
            oLoaded.T.loaded &&
            oLoaded.H.loaded &&
            oLoaded.W.loaded &&
            oLoaded.P.loaded &&
            oLoaded.D.loaded &&
            oLoaded.G.loaded &&
            oLoaded.A.loaded &&
            oLoaded.R.loaded
      );
   } // IsLoaded
   
   function GetQuestions()
   {
      var aoQuestions = null;
      // Return results from loading questions into array of objects
      if (IsLoaded()) {
         aoQuestions = [].concat(
            oLoaded.T.questions,
            oLoaded.H.questions,
            oLoaded.W.questions,
            oLoaded.P.questions,
            oLoaded.D.questions,
            oLoaded.G.questions,
            oLoaded.A.questions,
            oLoaded.R.questions
         );
      } // if
      return aoQuestions;
   } // GetQuestions
   
   function OnStartup()
   {
      GetNewVersion();
      return;
   } // OnStartup

   return {
      Download      : Download,
      GetQuestions  : GetQuestions,
      IsLoaded      : IsLoaded,
      LoadQuestions : LoadQuestions,
	   OnStartup     : OnStartup
   }; // export
   
}()); // namespace

Object.seal(BQ.Database);


/**/
