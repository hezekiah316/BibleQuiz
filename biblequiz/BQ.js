/**
 * @fileOverview Provides a global BQ namespace, as well as variables for use throughout BQ.<br />
 * @author JJF (2/12/2013)
 */

if (BQ === undefined) {
   /**
    * BQ is the only variable defined by Bible Quiz in the global namespace.
    * All functions, methods, variables, properties, objects, etc. are members 
    * of this one global variable.
    * 
    * @namespace
    */
   var BQ = {}; /* exported BQ */
} // if

/**
 * Loads and runs all startup functions once the DOM has finished loading
 */
$(document).ready(function LoadWhenDomIsReady()
{
   "use strict";
   
   BQ.AppCache.Check();
   BQ.Database.OnStartup();
   BQ.Events.LoadWhenReady();
}); // LoadWhenDomIsReady

/**
 * BQ.Globals provides a namespace for all constants and variables used throughout BQ.<br />
 * <br />
 * <br />
 * Defined BQ.Globals constants:<br />
 * <br />
 *    Helpful URLs: 
 *    <ul>
 *       <li>BQ_WEBSITE is the name of the website running BQ -> e.g. http://www.hezekiah316.com/biblequiz</li>
 *       <li>BQ_INDEX is the name of the main PHP file -> e.g. http://www.hezekiah316.com/biblequiz/index.html</li>
 *       <li>BQ_PATH is the path on the host where BQ is running; useful especially for creating a testing environment -> e.g. /biblequiz</li>
 *       <li>BQ_AJAX is the path of the main Ajax PHP script -> e.g. bq_ajax.php
 *    </ul>
 * 
 *    CSS entities:
 *    <ul>
 *       <li>sHiddenClass is the name of the CSS class used for hiding items not in use</li>
 *    </ul>
 *
 * @namespace
 * 
 * @author JJF (2/12/2014)
 */

BQ.Globals = (function namespace_Globals() 
{
   "use strict";

   // path names for use in BQ
   var BQ_PATH    = location.pathname.slice(0, location.pathname.lastIndexOf("/"));
   var BQ_WEBSITE = location.protocol + "//" + location.hostname + BQ_PATH;
   var BQ_INDEX   = BQ_WEBSITE + "/index.html";
   var BQ_AJAX    = BQ_WEBSITE + "/BQ_ajax.php";

   // set global options for Ajax calls
   $.ajaxSetup({
         url:  BQ_AJAX,
         type: "POST",
         cache: false  // forces a fresh call to server, without caching; 
                       // not needed with POST but included just in case
   });
   
   return {
      // path names for use in BQ
      BQ_PATH     : BQ_PATH,
      BQ_WEBSITE  : BQ_WEBSITE,
      BQ_INDEX    : BQ_INDEX,
      BQ_AJAX     : BQ_AJAX,
      
      // CSS entities
      sHiddenClass : "keepHidden"

   }; // export
   
}()); // namespace

Object.seal(BQ.Globals);


/**/
/**
 * Functions for updating the application cache.
 * 
 * This library includes the following public API:
 * 
 *    -> Check sets up event listeners to test whether the device's application 
 *       storage cache needs updating, and to perform the update or issue error 
 *       messages, as appropriate
 * 
 * @author JJF (2/5/2013)
 * 
 * @notes
 *    1. This whole module should be moved into a separate Worker thread.
 */
/* global BQ:true */
BQ.AppCache = {};

(function namespace_AppCache() {
   "use strict";
   
   // check for a new cache every ten seconds while testing, unless an error occurs
   var _bKeepChecking = true; // set to false when this goes live
   var _bDebugOn = true;
   
   var _cache = (window.hasOwnProperty("applicationCache")) ? window.applicationCache : null;
   var _iIntervalId = null;
   
   /**
    * Loads new cache files and reloads the page whenever a new version of the cache manifest 
    * is available on the server and the browser has finished updating the files in the 
    * application storage, thus presenting the user with the freshest update.
    * 
    * @param {none}
    * @returns {none}
    * @author JJF (6/28/14)
    * 
    * @notes
    *    1. window.applicationCache.swapCache() has already happened by the time 
    *       the "updateready" event is fired; c.f. 
    *       https://developer.mozilla.org/en-US/docs/HTML/Using_the_application_cache#Testing_for_updates_to_the_cache_manifest
    */
   function WebAppUpdateReady(eEvent) 
   {  
      _cache.onupdateready = null;
      location.replace(BQ.Globals.BQ_INDEX);
      return;
   } // WebAppUpdateReady

   
   /**
    * Notifies the user when BQ is unable to update the AppCache
    * 
    * @param eEvent {Event}
    * @returns {none}
    * @author JJF (7/31/2012)
    * 
    * @notes
    *    1. c.f. http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html for HTTP status codes. Some common codes:
    *    
    *    Informational 1xx -> This class of status code indicates a provisional response, 
    *    consisting only of the Status-Line and optional headers, and is terminated by an empty line. 
    *    
    *    Successful 2xx -> This class of status code indicates that the client's request was successfully received, 
    *    understood, and accepted.
    *    
    *       200 OK -> The request has succeeded.
    *    
    *    Redirection 3xx -> This class of status code indicates that further action needs to be taken 
    *    by the user agent in order to fulfill the request. 
    *    
    *       304 Not Modified -> If the client has performed a conditional GET request and access is allowed, 
    *       but the document has not been modified, the server SHOULD respond with this status code.
    *       
    *    Client Error 4xx -> The 4xx class of status code is intended for cases in which the client seems to have erred. 
    *    
    *       404 Not Found -> The server has not found anything matching the Request-URI.
    *    
    *       410 Gone -> The requested resource is no longer available at the server and no forwarding address is known. 
    *    
    *    Server Error 5xx -> Response status codes beginning with the digit "5" indicate cases in which the server is aware 
    *    that it has erred or is incapable of performing the request. 
    *    
    */
   function WebAppUpdateError(eEvent) 
   {  
      // alert("An error occurred while attempting to update the AppCache: " + eEvent.message);
      clearInterval(_iIntervalId);
      _cache.onerror       = null;
      _cache.onupdateready = null;  
      return;
   } // WebAppUpdateError


   /**
    * Sets up event listeners to test whether the device's application storage cache needs updating,
    * and to perform the update or issue error messages, as appropriate
    * 
    *  @param {none}
    *  @returns {none}
    *  
    *  @author JJF (7/31/2012)
    */
   function Check()
   {
      if (_cache !== null) {
         
         if (_cache.status === _cache.UPDATEREADY) {  
            WebAppUpdateReady();  
         } else if (_cache.status !== _cache.UNCACHED) {
            _cache.onerror       = WebAppUpdateError;
            _cache.onupdateready = WebAppUpdateReady;  
         } // if
      
         if (_bKeepChecking && _cache.status !== _cache.ERROR && _cache.status !== _cache.UPDATEREADY) {
            // check for a new cache every ten seconds in the testing environment, unless an error occurs
            _iIntervalId = setInterval(function() {
               try {
                  if (_cache.status !== _cache.DOWNLOADING) {
                     _cache.update();
                     if (_cache.status === _cache.ERROR) {
                        throw new Error("");
                     } // if
                  } // if
               } catch (eError) {
                  clearInterval(_iIntervalId);
                  _cache.onerror       = null;
                  _cache.onupdateready = null;  
               } // try
            }, 10 * 1000); 
         } // if
         
      } // if
      
      return;
   } // Check

   // export public API for CCS.AppCache module
   BQ.AppCache.Check = Check;

   Object.seal(BQ.AppCache);
   return;
}()); // namespace


/**/
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
/**
 * Functions for capturing and handling events.
 * 
 * @author JJF (2/7/2015)
 */
/* global BQ:true */
BQ.Events = {};

(function namespace_Events() {
   "use strict";
   
   function LoadWhenReady()
   {
      var sEvents = "click.anchor";
      $(document).off(sEvents).on(sEvents, "a", function(eEvent) {
         return HandleEvent(this, eEvent);
      }); // click 
      
      sEvents = "change.options";
      $(document).off(sEvents).on(sEvents, "#BQ_Config_PageContent input, #BQ_Config_PageContent select", function(eEvent) {
         var oOptions = new BQ.Options.Get();
         return HandleEvent(this, eEvent, oOptions);
      }); // change
      
     sEvents = "pagecontainerload, pagecontainerchange";
     $(":mobile-pagecontainer").off(sEvents).on(sEvents, function(eEvent) {
        var eThis = $(this).pagecontainer("getActivePage").get(0);
        return HandleEvent(eThis, eEvent);
     }); // pagecontainerload
     
     sEvents = "click.scripture";
     $(document).off(sEvents).on(sEvents, "#BQ_Game_BibleRefs > li > a", function(eEvent) {
        var eThis = $(this);
        eThis.id = "BQ_Game_BibleRefs";
        return HandleEvent(eThis, eEvent);
     }); // click
     
   } // LoadWhenReady

   function HandleEvent(eThis, eEvent, Options)
   {
      Options = Options || {};
      
      var bContinue = true;
      
      var sId = eThis.id || "";
      
      switch (sId) {
         case "": break;
         case "BQ_Start_NewGame"      : BQ.Game.InitializeQuiz();                   break;
         case "BQ_Start_Config"       : BQ.Options.Display();                       break;
         case "BQ_Game"               : BQ.Game.DisplayNextQuestion();              break;
         
         case "BQ_Game_FinalAnswer"   : bContinue = HandleFinalAnswerButton(eThis); break;
         case "BQ_Game_PauseGame"     : BQ.Game.PauseGame();                        break;
         case "BQ_Game_BibleRefs"     : BQ.Game.InsertScripture(eThis);             break;
         case "BQ_Pause_QuitGame"     : BQ.Game.QuitGame();                         break;
         case "BQ_Pause_ResumeGame"   : BQ.Game.ResumeGame();                       break;
         
         case "BQ_Config_Questions"   : Options.Questions(eThis.value);        break;
         case "BQ_Config_Mode"        : Options.Mode(eThis.value);             break;
         case "BQ_Config_Time"        : Options.Time(eThis.value);             break;
         case "BQ_Config_Torah"       : Options.Torah(eThis.checked);          break;
         case "BQ_Config_History"     : Options.History(eThis.checked);        break;
         case "BQ_Config_Prophets"    : Options.Prophets(eThis.checked);       break;
         case "BQ_Config_Writings"    : Options.Writings(eThis.checked);       break;
         case "BQ_Config_Deutero"     : Options.Deutero(eThis.checked);        break;
         case "BQ_Config_Gospels"     : Options.Gospels(eThis.checked);        break;
         case "BQ_Config_Acts"        : Options.Acts(eThis.checked);           break;
         case "BQ_Config_Rest"        : Options.RestNT(eThis.checked);         break;
         case "BQ_Config_Bible"       : Options.Bible(eThis.value);            break;

         
         
         
         
         
         
         
         default: break;
      } // switch
      return bContinue;
   } // HandleEvent
   
   function HandleFinalAnswerButton(eThis)
   {
      var bContinue = false;
      
      // This function gets called in two situations:
      var sButtonText = $(eThis).text();
      
      if (sButtonText === "Final Answer") {
         // 1. User presses the button marked "Final Answer"
         bContinue = BQ.Game.FinalAnswer();
      } else if (sButtonText === "Next Question") {
         // 2. User presses the button marked "Next Question"
         BQ.Game.DisplayNextQuestion();
         $(eThis).removeClass("ui-btn-active");
      } // if
      
      return bContinue;
   } // HandleFinalAnswerButton
   
   
   
   // export public API for CCS.Events module
   BQ.Events.LoadWhenReady = LoadWhenReady;

   Object.seal(BQ.Events);
   return;
}()); // namespace


/**/
/**
 * @fileOverview Provides functions for managing the current game.
 * 
 * @author JJF (2/18/15)
 * 
 * @note
 *    1. c.f. http://www.pcusa.org/site_media/media/uploads/prep4min/pdfs/exam_handbook_2014_rel_2.pdf
 *    
 *    2. The guidelines for the test approved by the General Assembly require 
 *       that it reflect the overall content of the Scriptures. To achieve that 
 *       balance, the 100 questions on the exam are distributed across seven 
 *       canonical divisions of the Protestant Bible. The breakdown goes like this:
 *       -> Pentateuch (Genesis through Deuteronomy): 17 questions
 *       -> Historical Books (Joshua through Esther): 13 questions
 *       -> Psalms and Wisdom Literature (Job through Song of Solomon): 10 questions
 *       -> Prophets (Isaiah through Malachi): 17 questions
 *       -> Gospels (Matthew through John): 18 questions
 *       -> Acts and Pauline Letters (Acts through Philemon): 15 questions
 *       -> Rest of the New Testament (Hebrews through Revelation): 10 questions
 *    
 *     3. To accommodate including books of tyhe Deuterocanonicals/Apocrypha in
 *        this exam, I use the following weights of sections:
 *        -> T: 17 (Torah/Pentateuch)
 *        -> H: 13 (Historical Books)
 *        -> W: 10 (Psalms and Wisdom Literature)
 *        -> P: 17 (Prophets)
 *        -> D:  7 (Deuterocanonicals/Apocrypha)
 *        -> G: 18 (Gospels)
 *        -> A: 15 (Acts and Pauline Letters)
 *        -> R: 10 (Rest of the New Testament)
 *        If one or more sections are not included, the above weights are
 *        adjusted accordingly. If extra questions are needed to attain the 
 *        correct number of questions, they are chosen arbitrarily from among
 *        the selected sections. Thus,
 *        
 *        Let Q = Qt + Qh + ... + Qr + Qx -> total questions desired for this 
 *        exam, where Qx represents the number of random questions needed to
 *        fill out the desired number of questions for a given quiz
 *        
 *        Let N = Nt + Nh + ... + Nr -> total percentage of the desired sections 
 *        from the table above; e.g. if one only wanted to do a quiz based on 
 *        the New Testament, N = Ng + Na + Nr = 17 + 14 + 9 = 40
 *        
 *        Then Qs = Q * Ns \ N -> the total number of questions for a given 
 *        section equals the total number of questions desired times the ratio 
 *        of the percentage for that section to the total percentage.
 *        
 *        As a concrete example, if the user wants a 50 question quiz on the 
 *        New Testament, then
 *        
 *        Qg = Q * Ng \ N 
 *           = 50 * 17 \ 40 
 *           = 21 questions from the Gospels
 *           
 *        Qa = Q * Na \ N 
 *           = 50 * 14 \ 40 
 *           = 17 questions from Acts and the Pauline Letters
 *           
 *        Qr = Q * Nr \ N 
 *           = 50 *  9 \ 40 
 *           = 11 questions from the Rest of the New Testament
 *           
 *        Qx = Q - Qg - Qa - Qr 
 *           = 50 - 21 - 17 - 11 
 *           = 1 question, chosen at random from the three sections G, A, R
 *     
 *     4. Users can play this game in one of two modes: Quiz or Study. Study 
 *        mode only includes questions from the PCUSA ordination exams and, by 
 *        definition, no questions from the Deuterocanonicals / Apocrypha.
 */
/* global BQ:true */
BQ.Game = {};

(function namespace_Game() {
   "use strict";

   var CSection = function(sSection, iWeight, iAvailable) // constructor
   {
      sSection   = sSection   || "";
      iWeight    = iWeight    || 0;
      iAvailable = iAvailable || 0;
      
      this.section      = sSection;
      this.total        = 0;
      this.right        = 0;
      this.wrong        = 0;
      this.available    = iAvailable;
      this.desired      = 0;
      this.include_this = true;
      this.weight       = iWeight; 
      this.questions    = [];
   }; // CSection constructor

   CSection.prototype.calculateNumberOfQuestions = function(iTotalAvailable, iTotalQuestions)
   {
      if (this.include_this) {
         this.total = Math.min(Math.max(parseInt((iTotalQuestions * this.weight / iTotalAvailable), 10), 1), this.available);
      } else {
         this.total = 0;
      } // if
      return this.total;
   }; // CalculateNumberOfQuestions
   
   CSection.prototype.include = function(bInclude)
   {
      this.include_this = !!bInclude;
      this.desired      = this.weight * this.include_this;
      return this.desired;
   }; // include

   CSection.prototype.addExtra = function(bAllowRandom)
   {
      var bAddExtra = ((bAllowRandom || this.include_this) && (this.total < this.available));
      if (bAddExtra) {
         this.total++;
      } // if
      return bAddExtra;
   }; // AddExtra
   
   CSection.prototype.loadQuestions = function()
   {
      BQ.Database.LoadQuestions(this.section, this.total);
      return;
   }; // LoadQuestions

   
   var koWeights = Object.freeze({
      iTorah    : 17,
      iHistory  : 13,
      iWritings : 10,
      iProphets : 17,
      iDeutero  :  7,
      iGospels  : 18,
      iActs     : 15,
      iRestNT   : 10
   }); // kiWeights
   
   var CGame = function(oOptions, oStats) // constructor
   {
      // Initialize public members
      this.bMode            = true;   // bMode: true -> Quiz, false -> Study
      this.iQuestions       = 100;    // number of questions to include
      this.iTime            = 30;     // maximum time (in seconds) in which to answer a given question
      this.sBible           = "NRSV"; // Preferred Bible version for Scripture references
      this.aoQuiz           = [];
      this.iCurrentQuestion = -1;
      
      // Seal objects so they don't have properties added or removed by mistake
      this.oTorah    = Object.seal(new CSection("Torah",    koWeights.iTorah,    oStats.T));
      this.oHistory  = Object.seal(new CSection("History",  koWeights.iHistory,  oStats.H));
      this.oWritings = Object.seal(new CSection("Writings", koWeights.iWritings, oStats.W));
      this.oProphets = Object.seal(new CSection("Prophets", koWeights.iProphets, oStats.P));
      this.oDeutero  = Object.seal(new CSection("Deutero",  koWeights.iDeutero,  oStats.D));
      this.oGospels  = Object.seal(new CSection("Gospels",  koWeights.iGospels,  oStats.G));
      this.oActs     = Object.seal(new CSection("Acts",     koWeights.iActs,     oStats.A));
      this.oRestNT   = Object.seal(new CSection("RestNT",   koWeights.iRestNT,   oStats.R));
      
      
      // Get currently saved options
      this.bMode      = oOptions.bMode;
      this.iQuestions = oOptions.iQuestions;
      this.iTime      = oOptions.iTime;
      this.sBible     = oOptions.sBible;
      
      // Calculate total weight
      var iTotalAvailable = 0;
      iTotalAvailable += this.oTorah.include(   oOptions.bTorah);
      iTotalAvailable += this.oHistory.include( oOptions.bHistory);
      iTotalAvailable += this.oWritings.include(oOptions.bWritings);
      iTotalAvailable += this.oProphets.include(oOptions.bProphets);
      iTotalAvailable += this.oDeutero.include( oOptions.bDeutero);
      iTotalAvailable += this.oGospels.include( oOptions.bGospels);
      iTotalAvailable += this.oActs.include(    oOptions.bActs);
      iTotalAvailable += this.oRestNT.include(  oOptions.bRestNT);

      // Calculate number of questions for each area
      var iTotalQuestions = 0;
      iTotalQuestions += this.oTorah.calculateNumberOfQuestions(   iTotalAvailable, this.iQuestions);
      iTotalQuestions += this.oHistory.calculateNumberOfQuestions( iTotalAvailable, this.iQuestions);
      iTotalQuestions += this.oWritings.calculateNumberOfQuestions(iTotalAvailable, this.iQuestions);
      iTotalQuestions += this.oProphets.calculateNumberOfQuestions(iTotalAvailable, this.iQuestions);
      iTotalQuestions += this.oDeutero.calculateNumberOfQuestions( iTotalAvailable, this.iQuestions);
      iTotalQuestions += this.oGospels.calculateNumberOfQuestions( iTotalAvailable, this.iQuestions);
      iTotalQuestions += this.oActs.calculateNumberOfQuestions(    iTotalAvailable, this.iQuestions);
      iTotalQuestions += this.oRestNT.calculateNumberOfQuestions(  iTotalAvailable, this.iQuestions);

      // Calculate arrays of question numbers
      var bAllowRandom = (iTotalQuestions === 0);
      var iRandom = this.iQuestions - iTotalQuestions;
      while (iRandom > 0) {
         var iUseSection = Math.floor(Math.random() * 8);
         switch (iUseSection) {
            case 0: iRandom -= this.oTorah.addExtra(bAllowRandom);    break;
            case 1: iRandom -= this.oHistory.addExtra(bAllowRandom);  break;
            case 2: iRandom -= this.oWritings.addExtra(bAllowRandom); break;
            case 3: iRandom -= this.oProphets.addExtra(bAllowRandom); break;
            case 4: iRandom -= this.oDeutero.addExtra(bAllowRandom);  break;
            case 5: iRandom -= this.oGospels.addExtra(bAllowRandom);  break;
            case 6: iRandom -= this.oActs.addExtra(bAllowRandom);     break;
            case 7: iRandom -= this.oRestNT.addExtra(bAllowRandom);   break;
            default: break;
         }// switch
      } // while

      this.oTorah.loadQuestions();
      this.oHistory.loadQuestions();
      this.oWritings.loadQuestions();
      this.oProphets.loadQuestions();
      this.oDeutero.loadQuestions();
      this.oGospels.loadQuestions();
      this.oActs.loadQuestions();
      this.oRestNT.loadQuestions();
   }; // constructor
   
   CGame.prototype.nextQuestion = function()
   {
      var oNext = null;
      
      if (!this.isDone()) {
         this.iCurrentQuestion++;
         oNext = this.aoQuiz[this.iCurrentQuestion];
      } // if

      return oNext;
   }; // nextQuestion

   CGame.prototype.isDone = function() {
      return (this.iCurrentQuestion >= this.iQuestions);   
   }; // isDone
   
   var ThisGame = null; // The current game
   
   function initializeQuiz()
   {
      var oOptions = BQ.Options.Get();
      var oStats   = BQ.Stats.Get();
      ThisGame = new CGame(oOptions, oStats);
      
      var iIntervalId = setInterval(function() {
         if (BQ.Database.IsLoaded()) {
            clearInterval(iIntervalId);
            ThisGame.aoQuiz = [].concat(BQ.Database.GetQuestions());
         } // if
      }, 10); // setInterval
      
      return;
   } // initializeQuiz
   
   
   function getNextQuestion()
   {
      if (ThisGame === null) {
         initializeQuiz();
      } // if
      
      return ThisGame.nextQuestion();
   } // getNextQuestion

   function formatText(sText)
   {
      sText = sText.replace(/@T_(\w*)@t_/g, "<span class=\"tetragrammaton\">$1</span>");
      sText = sText.replace(/\\\"/g, "\"");
      sText = sText.replace(/\\\'/g, "'");
      sText = sText.replace(/@I_/g,  "<em>");
      sText = sText.replace(/@i_/g,  "</em>");
      
      return sText;
   } // formatText
  
   var CTimer = function(Game, Question)
   {
      this._sMemoryLocation = "BQ_Timer";
      
      if (typeof Game !== "undefined" && typeof Question !== "undefined") {
         this.bMode       = (Game !== null) ? Game.bMode : false;
         this.iTime       = (Game !== null && Game.bMode) ? parseInt(Game.iTime, 10) : 0;
         this.iIntervalId = null;
         this.iIndex      = (Game !== null) ? Game.iCurrentQuestion : -1;
         this.Question    = (Question !== null) ? $.extend(true, {}, Question) : {};
      } else {
         var jsonData = window.sessionStorage.getItem(this._sMemoryLocation);
         if (jsonData !== null) {
            var StoredTimer  = JSON.parse(jsonData);
            
            this.bMode       = StoredTimer.bMode;
            this.iTime       = StoredTimer.iTime;
            this.iIntervalId = StoredTimer.iIntervalId;
            this.iIndex      = StoredTimer.iIndex;
            this.Question    = StoredTimer.Question;
         } // if
      } // if
      
   }; // CTimer
   
   CTimer.prototype.pause = function()
   {
      // var TimerToStore = {
         // TimerToStore.bMode       = this.bMode;
         // TimerToStore.iTime       = this.iTime;
         // TimerToStore.iIntervalId = this.iIntervalId;
         // TimerToStore.iIndex      = this.iIndex;
         // TimerToStore.Question    = this.Question;
      // }; // TimerToStore
//       
      var jsonData = JSON.stringify(this);
      window.sessionStorage.setItem(this._sMemoryLocation, jsonData);
      return this;
   }; // pause
   
   CTimer.prototype.clear = function()
   {
      clearInterval(this.iIntervalId);
      this.iIntervalId = null;
      return this;
   }; // clear
   
   var CurrentTimer = null;
   
/*
 * Questions contain the following fields: 
 *
 * id            : 0,   // always nonnegative
 * section       : "",  // one of "T", "H", "P", "W", "D", "G", "A", "R"
 * source        : "",  // where the question came from
 * source_index  : 0,   // index in the source document (e.g. question number in Bible Content Quiz)
 * question      : "",
 * answerA       : "",
 * answerB       : "",
 * answerC       : "",
 * answerD       : "",
 * correct       : "",  // one of "A", "B", "C", "D"
 * scripture     : []   // an array of Scripture references (as JSON?)
 */
   function insertScripture(eThis)
   {
      var sReference = eThis.text();
      $.post(getScripture(sReference), function(hResponse) {
         $(eThis).empty().append(hResponse);
      }); // post
   } // isertScripture
   
   function getScripture(sScripture)
   {
      var _ksApiKey = "66720193b8a59a0fbcaf0bb57855b8b6";
      var _ksBiblia = "https://api.biblia.com/v1/bible/content/LEB.html";
      var sPassage  = "?passage=" + sScripture;
      var sStyle    = "&style=fullyFormatted&redLetter=false&citation=true";
      var sCallback = "&callback=insertScripture";
      var sKey      = "&key=" + _ksApiKey;
      var sHref     = _ksBiblia + sPassage + sStyle + sCallback + sKey;
      return sHref;
   } // getScripture
         
   function makeScriptureRef(sScripture)
   {
      var sRef = "<li><a>" + sScripture + "</a></li>";
      
      return sRef; 
   } // makeScriptureRef
   
   function modifyGamePage(bDisable, bCorrectAnswer, bEnableMoreInfo)
   {
      bCorrectAnswer  = !!bCorrectAnswer;
      bEnableMoreInfo = !!bEnableMoreInfo;
      
      var jButton   = $("#BQ_Game_FinalAnswer");
      var jRadio    = $("input[type='radio'][name='answer']");
      var sStatus   = "runningOutOfTime nearlyOutOfTime correctAnswer incorrectAnswer";
      var sDelete   = "ui-icon-delete";
      var sCheck    = "ui-icon-check";
      var sText     = (ThisGame.isDone()) ? "Final Score" : "Next Question";
      var jMoreInfo = $("#BQ_Game_MoreInfoDiv");
      var sHidden   = "keepHidden";
            
      if (bCorrectAnswer) {
         // Right answer
         jButton.removeClass(sStatus)
                .addClass("correctAnswer")
                .removeClass(sDelete)
                .addClass(sCheck)
                .text(sText);
         
         // Disable radio buttons
         jRadio.prop("disabled", true);
         
      } else if (bDisable) {
         // Wrong answer or no answer
         jButton.removeClass(sStatus)
                .addClass("incorrectAnswer")
                .removeClass(sCheck)
                .addClass(sDelete)
                .text(sText);

         // Show correct answer
         var sCorrectAnswer = "BQ_Game_answer" + $("#BQ_Game_correctAnswer").val();
         $("label[for='" + sCorrectAnswer + "']").addClass("highlightCorrectAnswer");
         
         // Disable radio buttons
         jRadio.prop("disabled", true);

      } else {
         // Restore navbar button
         jButton.removeClass(sStatus)
                .removeClass("ui-icon-delete ui-icon-active")
                .addClass("ui-icon-check")
                .text("Final Answer");
                
         // Remove highlighting from correct answer to previous question
         $("label[for^='BQ_Game_answer']").removeClass("highlightCorrectAnswer");
      
         // Enable radio buttons
         jRadio.prop("checked", false).prop("disabled", false).checkboxradio("refresh");
                  
      } // if
      
      // Turn the More Info dialog box on (study mode) or off (quiz mode) when disabling page
      if (bEnableMoreInfo) {
         jMoreInfo.removeClass(sHidden);
      } else {
         jMoreInfo.collapsible( "collapse" ).addClass(sHidden);
      } // if
      
      return;      
   } // modifyGamePage
   
   function _displayNextQuestion(Timer)
   {
      // Reset page components
      modifyGamePage(false);
      
      
      // Add question, possible answers
      $("#BQ_Game_question").html(formatText(Timer.Question.question));
 
      $("label[for='BQ_Game_answerA']").html(formatText(Timer.Question.answerA));
      $("label[for='BQ_Game_answerB']").html(formatText(Timer.Question.answerB));
      $("label[for='BQ_Game_answerC']").html(formatText(Timer.Question.answerC));
      $("label[for='BQ_Game_answerD']").html(formatText(Timer.Question.answerD));

      // Add information to dialog box
      $("#BQ_Game_BibleRefs").empty();
      var asScriptures = JSON.parse(Timer.Question.scripture);
      asScriptures.forEach(function(sScripture) {
         $("#BQ_Game_BibleRefs").append(makeScriptureRef(sScripture));
      }); // foreach
      var sSource = Timer.Question.source.replace("_BCE", " Bible Content Exam") + ", #" + Timer.Question.source_index;
      $("#BQ_Game_Source").html(sSource);
      $("#BQ_Game_DbIndex").text(Timer.Question.id);
      $("#BQ_Game_correctAnswer").val(Timer.Question.correct);

      // display timer
      if (ThisGame.bMode && Timer.iTime > 0) {
          
         var jButton = $("#BQ_Game_FinalAnswer");

         Timer.iIntervalId = setInterval(function() {
   
            switch (Timer.iTime) {
               case 10: jButton.addClass("runningOutOfTime"); break;
               case  5: jButton.removeClass("runningOutOfTime").addClass("nearlyOutOfTime"); break;
               case  0: 
                  jButton.removeClass("nearlyOutOfTime").addClass("incorrectAnswer"); 
                  modifyGamePage(true, false, !Timer.bMode);
                  Timer.clear();
                  break;
               default: break;
            } // switch
   
            if (Timer.iTime > 0) {
               Timer.iTime--;
            } // if
         }, 1000);
      } // if

      
      return;
   } // _displayNextQuestion

   function displayNextQuestion()
   {
      var iQuit = Date.now() + 30000; // quit trying after 30 seconds
      
      var iIntervalId = setInterval(function() {
         
         var oNext = getNextQuestion();
   
         if (oNext !== null && oNext !== undefined) {
         
            clearInterval(iIntervalId);
            
            var sMode = (ThisGame.bMode) ? "Game" : "Study";
            $("#BQ_Game_app_name").text("Bible Quiz | " + sMode);
            
            // Turn the More Info dialog box on (study mode) or off (quiz mode)
            $("#BQ_Game_MoreInfo").addClass("ui-state-disabled");

            // Start timer for this question
            CurrentTimer = new CTimer(ThisGame, oNext);

            // Display the question
            _displayNextQuestion(CurrentTimer);
      
         } else if (Date.now() > iQuit) {
            
            clearInterval(iIntervalId);
            $(":mobile-pagecontainer").pagecontainer("change", $("#BQ_Start"));
            
         } // if
         
      }, 10);
      
      return true;
   } // displayNextQuestion
   
   function finalAnswer() 
   {
      // This function gets called in two situations:
      // 1. User presses the button marked "Final Answer"
      // 2. User presses the button marked "Next Question"
      
      
      // Make sure an answer is checked
      var jAnswered = $("input[type='radio'][name='answer']:checked");
      var bAnswered = (jAnswered.length > 0);
      
      if (bAnswered) {
         
         // Stop timer
         CurrentTimer.pause().clear();
         
         // Check answer
         var sCorrectAnswer = $("#BQ_Game_correctAnswer").val();
         var sPlayerAnswer  = jAnswered.val();
         var bCorrect = (sCorrectAnswer === sPlayerAnswer);
         
         // Disable radio buttons
         modifyGamePage(true, bCorrect, !CurrentTimer.bMode);
         
         // Store result for game statistics
         
      } // if
      
      // if bAnswered is false, tell caller not to bubble event
      return bAnswered;
   } // finalAnswer
   
   function pauseGame() 
   {
      // store current game and timer
      CurrentTimer.store();
   } // PauseGame
   
   function quitGame() 
   {
      // erase any stored game and timer
   } // QuitGame
   
   function resumeGame() 
   {
      // retrieve stored game and timer
      CurrentTimer = new CTimer();
      _displayNextQuestion(CurrentTimer);
      
      // if no game and timer have been stored, start a new game
      // displayNextQuestion();
      
   } // resumeGame



   // export public API for CCS.Game module
   BQ.Game.DisplayNextQuestion = displayNextQuestion;
   BQ.Game.FinalAnswer         = finalAnswer;
   BQ.Game.InitializeQuiz      = initializeQuiz;
   BQ.Game.InsertScripture     = insertScripture;
   BQ.Game.PauseGame           = pauseGame;
   BQ.Game.QuitGame            = quitGame;
   BQ.Game.ResumeGame          = resumeGame;

   Object.seal(BQ.Game);
   return;
}()); // namespace


/**/
/**
 * Functions for getting and setting quiz options.
 * 
 * @author JJF (2/8/2015)
 */
/* global BQ:true */
BQ.Options = {};

(function namespace_Options() {
   "use strict";

   // private member
   var _ksOptionsName = "BQ_options";

   var Options = function() // constructor
   {
      
      var _koDefaultOptions = Object.freeze({
         M : true, // bMode: true -> Quiz, false -> Study
                   // n.b. Study mode only includes questions from the PCUSA 
                   // ordination exams and, by definition, no questions from the
                   // Deuterocanonicals / Apocrypha.
         L : 30,   // time (in seconds) in which to answer a question (15 <= t <= 120) [L -> length of time]
         Q : 100,  // number of questions to include
         T : true, // Torah
         H : true, // Historical Books
         P : true, // Prophets
         W : true, // Writing
         D : true, // Deuterocanonicals / Apocrypha
         G : true, // Gospels
         A : true, // Acts & Pauline writings
         R : true,  // Rest of the New Testament
         B : "NRSV" // Preferred Bible version for Scripture references
      }); // _koDefaultOptions

      // Get currently saved options
      var oOptions = window.localStorage.getItem(_ksOptionsName);
      oOptions = JSON.parse(oOptions) || _koDefaultOptions;
      oOptions = $.extend({}, _koDefaultOptions, oOptions);

      // public members
      this.bMode      = oOptions.M;
      this.iQuestions = oOptions.Q;
      this.iTime      = oOptions.L;
      this.bTorah     = oOptions.T;
      this.bHistory   = oOptions.H;
      this.bProphets  = oOptions.P;
      this.bWritings  = oOptions.W;
      this.bDeutero   = oOptions.D;
      this.bGospels   = oOptions.G;
      this.bActs      = oOptions.A;
      this.bRestNT    = oOptions.R;
      this.sBible     = oOptions.B;

      return;
   }; // constructor

   Options.prototype.Mode      = function(sMode)      {this.bMode      = (sMode === "quiz"); this._Save();};
   Options.prototype.Torah     = function(bTorah)     {this.bTorah     = bTorah;     this._Save();}; 
   Options.prototype.History   = function(bHistory)   {this.bHistory   = bHistory;   this._Save();}; 
   Options.prototype.Prophets  = function(bProphets)  {this.bProphets  = bProphets;  this._Save();}; 
   Options.prototype.Writings  = function(bWritings)  {this.bWritings  = bWritings;  this._Save();}; 
   Options.prototype.Deutero   = function(bDeutero)   {this.bDeutero   = bDeutero;   this._Save();}; 
   Options.prototype.Gospels   = function(bGospels)   {this.bGospels   = bGospels;   this._Save();}; 
   Options.prototype.Acts      = function(bActs)      {this.bActs      = bActs;      this._Save();}; 
   Options.prototype.RestNT    = function(bRestNT)    {this.bRestNT    = bRestNT;    this._Save();}; 

   Options.prototype.Bible     = function(sBible)     {
      this.sBible = encodeURIComponent(sBible.toUpperCase()); 
      this._Save();
   }; 
   Options.prototype.Questions = function(sQuestions) {
      var iQuestions  = parseInt(sQuestions, 10);
      iQuestions = Math.min(Math.max(iQuestions, 10), 100); // keep iQuestions in the range [10, 100]
      this.iQuestions = iQuestions;
      this._Save();
   }; 
   Options.prototype.Time = function(sTime) {
      var iTime  = parseInt(sTime, 10);
      iTime = Math.min(Math.max(iTime, 15), 120); // keep iTime in the range [15, 120]
      this.iTime = iTime;
      this._Save();
   }; 
   
   // private method
   Options.prototype._Save = function()
   {
      var oOptions = {
            M : this.bMode,
            L : this.iTime,
            Q : this.iQuestions,
            T : this.bTorah,
            H : this.bHistory,
            P : this.bProphets,
            W : this.bWritings,
            D : this.bDeutero,
            G : this.bGospels,
            A : this.bActs,
            R : this.bRestNT,
            B : this.sBible
      }; // oOptions
      
      var jsonData = JSON.stringify(oOptions);
      window.localStorage.setItem(_ksOptionsName, jsonData);

      return;
   }; // _Save
   

   function Get()
   {
      var oOptions = new Options();
      return oOptions;
   } // Get

   function Display()
   {
      var oOptions = new Options();
      
      $("body").one("pagecontainerchange", function(eEvent) {
         $("#BQ_Config_Questions").val(oOptions.iQuestions);
         $("#BQ_Config_Questions").slider().slider("refresh");
         $("#BQ_Config_Time").val(oOptions.iTime);
         $("#BQ_Config_Time").slider().slider("refresh");
      }); // pagecontainerchange

      $("#BQ_Config_Mode").val(((oOptions.bMode) ? "quiz" : "study"));

      $("#BQ_Config_Torah").prop("checked", oOptions.bTorah);
      $("#BQ_Config_History").prop("checked", oOptions.bHistory);
      $("#BQ_Config_Prophets").prop("checked", oOptions.bProphets);
      $("#BQ_Config_Writings").prop("checked", oOptions.bWritings);
      $("#BQ_Config_Deutero").prop("checked", oOptions.bDeutero);
      $("#BQ_Config_Gospels").prop("checked", oOptions.bGospels);
      $("#BQ_Config_Acts").prop("checked", oOptions.bActs);
      $("#BQ_Config_RestNT").prop("checked", oOptions.bRestNT);

      $("#BQ_Config_Bible").val(oOptions.sBible);

   }
   
   // export public API for CCS.Options module
   BQ.Options.Display = Display;
   BQ.Options.Get = Get;

   Object.seal(BQ.Options);
   return;
}()); // namespace


/**/
/**
 * Functions for getting and setting quiz statistics.
 * 
 * @author JJF (2/22/2015)
 */
/* global BQ:true */
BQ.Stats = {};

(function namespace_Stats() {
   "use strict";

   var _Statistics   = "BQ_DB_Statistics";
   var _PlayerStats  = "BQ_DB_PlayerStats";
   
   var _koStatsDefaults = Object.freeze({
      B : 0, // whole Bible
      O : 0, // Old Testament
      T : 0, // Torah
      H : 0, // History
      P : 0, // Prophets
      W : 0, // Writings
      D : 0, // Deuterocanonicals
      N : 0, // New Testament
      G : 0, // Gospels
      A : 0, // Acts and Paul
      R : 0  // Rest of the NT
   }); // _koStatsDefaults
   
   /**
    * Gets the statistics of the database items for export
    * 
    * @param {none}
    * @return {object}
    */
   function Get()
   {
      var oData = {};
      var oStats = {};
      
      try {
         var jsonData = window.localStorage.getItem(_Statistics);
         oData = $.extend({}, _koStatsDefaults, JSON.parse(jsonData));
      } catch(e) {
         oData = _koStatsDefaults;
      } finally {
         oStats.B = oData.B; // whole Bible
         oStats.O = oData.O; // Old Testament
         oStats.T = oData.T; // Torah
         oStats.H = oData.H; // History
         oStats.P = oData.P; // Prophets
         oStats.W = oData.W; // Writings
         oStats.D = oData.D; // Deuterocanonicals
         oStats.N = oData.N; // New Testament
         oStats.G = oData.G; // Gospels
         oStats.A = oData.A; // Acts and Paul
         oStats.R = oData.R; // Rest of the NT
      } // try
            
      return Object.freeze(oStats);
   } // Get
   
   function Save(oStats)
   {
      oStats = $.extend(true, {}, _koStatsDefaults, oStats);
      var jsonData = JSON.stringify(oStats);
      window.localStorage.setItem(_Statistics, jsonData);
      
      AddStatsToApp();
   } // Save
   
   function AddStatsToApp()
   {
      // Add database stats
      var oStats = Get();

      $("#BQ_About_TotalQuestions").text(oStats.B);
      $("#BQ_About_OT"            ).text(oStats.O);
      $("#BQ_About_Pentateuch"    ).text(oStats.T);
      $("#BQ_About_History"       ).text(oStats.H);
      $("#BQ_About_Prophets"      ).text(oStats.P);
      $("#BQ_About_Psalms"        ).text(oStats.W);
      $("#BQ_About_Apocrypha"     ).text(oStats.D);
      $("#BQ_About_NT"            ).text(oStats.N);
      $("#BQ_About_Gospels"       ).text(oStats.G);
      $("#BQ_About_Acts"          ).text(oStats.A);
      $("#BQ_About_Rest"          ).text(oStats.R);
         
      return;
   } // AddStatsToApp
   
   var _oPlayerDefaults = Object.seal({
      Q : 0, // number of quiz games played
      S : 0, // score, as a percentage of correct answers
      B : {r : 0, w : 0}, // whole Bible: number right, number wrong
      O : {r : 0, w : 0}, // Old Testament: number right, number wrong
      T : {r : 0, w : 0}, // Torah: number right, number wrong
      H : {r : 0, w : 0}, // History: number right, number wrong
      P : {r : 0, w : 0}, // Prophets: number right, number wrong
      W : {r : 0, w : 0}, // Writings: number right, number wrong
      D : {r : 0, w : 0}, // Deuterocanonicals: number right, number wrong
      N : {r : 0, w : 0}, // New Testament: number right, number wrong
      G : {r : 0, w : 0}, // Gospels: number right, number wrong
      A : {r : 0, w : 0}, // Acts and Paul: number right, number wrong
      R : {r : 0, w : 0}  // Rest of the NT: number right, number wrong
   }); // _oPlayerDefaults
      

   function SavePlayerStats(oPlayerStats)
   {
      oPlayerStats = $.extend(true, {}, _oPlayerDefaults, oPlayerStats);
      var jsonData = JSON.stringify(oPlayerStats);
      window.localStorage.setItem(_PlayerStats, jsonData);
   } // SavePlayerStats
   

   function AddPlayerStatsToApp()
   {
      // Add player stats
      var jsonPlayer = window.localStorage.getItem(_PlayerStats);
      if (jsonPlayer !== null) {
         var oPlayer = JSON.parse(jsonPlayer);
         oPlayer = $.extend(true, {}, _oPlayerDefaults, oPlayer);
         
         $("BQ_Stats_Total_Games"      ).text(oPlayer.Q);
         $("BQ_Stats_Total_Score"      ).text(oPlayer.S);
         $("BQ_Stats_Total_Bible"      ).text(oPlayer.B.r + "/" + oPlayer.B.w);
         $("BQ_Stats_Total_OT"         ).text(oPlayer.O.r + "/" + oPlayer.O.w);
         $("BQ_Stats_Total_Pentateuch" ).text(oPlayer.T.r + "/" + oPlayer.T.w);
         $("BQ_Stats_Total_History"    ).text(oPlayer.H.r + "/" + oPlayer.H.w);
         $("BQ_Stats_Total_Prophets"   ).text(oPlayer.P.r + "/" + oPlayer.P.w);
         $("BQ_Stats_Total_Psalms"     ).text(oPlayer.W.r + "/" + oPlayer.W.w);
         $("BQ_Stats_Total_Apocrypha"  ).text(oPlayer.D.r + "/" + oPlayer.D.w);
         $("BQ_Stats_Total_NT"         ).text(oPlayer.N.r + "/" + oPlayer.N.w);
         $("BQ_Stats_Total_Gospels"    ).text(oPlayer.G.r + "/" + oPlayer.G.w);
         $("BQ_Stats_Total_Acts"       ).text(oPlayer.A.r + "/" + oPlayer.A.w);
         $("BQ_Stats_Total_Rest"       ).text(oPlayer.R.r + "/" + oPlayer.R.w);

      } // if
      
   } // AddPlayerStatsToApp


   // export public API for CCS.Stats module
   BQ.Stats.AddStatsToApp = AddStatsToApp;
   BQ.Stats.Get           = Get;
   BQ.Stats.Save          = Save;
   
   Object.seal(BQ.Stats);
   return;
}()); // namespace


/**/

/* global BQ:true */
BQ.sLibraryVersion="2015.04.22.20.17.41";
/**/
