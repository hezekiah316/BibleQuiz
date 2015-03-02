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
