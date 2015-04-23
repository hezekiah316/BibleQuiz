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
