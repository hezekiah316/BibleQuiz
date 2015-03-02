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
      
//      sEvents = "pagecontainerload";
//      $(":mobile-pagecontainer")/*.off(sEvents)*/.on(sEvents, function(eEvent) {
//         return HandleEvent(this, eEvent);
//      });
   } // LoadWhenReady

   function HandleEvent(eThis, eEvent, oOptions)
   {
      oOptions = oOptions || {};
      
      var bContinue = true;
      
      var sId = eThis.id || "";
      switch (sId) {
         case "": break;
         case "BQ_Start_NewGame"      : BQ.Game.InitializeQuiz();          break;
         case "BQ_Start_Config"       : BQ.Options.Display();              break;
         case "BQ_Config_Questions"   : oOptions.Questions(eThis.value);   break;
         case "BQ_Config_Mode"        : oOptions.Mode(eThis.value);        break;
         case "BQ_Config_Torah"       : oOptions.Torah(eThis.checked);     break;
         case "BQ_Config_History"     : oOptions.History(eThis.checked);   break;
         case "BQ_Config_Prophets"    : oOptions.Prophets(eThis.checked);  break;
         case "BQ_Config_Writings"    : oOptions.Writings(eThis.checked);  break;
         case "BQ_Config_Deutero"     : oOptions.Deutero(eThis.checked);   break;
         case "BQ_Config_Gospels"     : oOptions.Gospels(eThis.checked);   break;
         case "BQ_Config_Acts"        : oOptions.Acts(eThis.checked);      break;
         case "BQ_Config_Rest"        : oOptions.RestNT(eThis.checked);    break;
         case "BQ_Config_Bible"       : oOptions.Bible(eThis.value);       break;

         
         
         
         
         
         
         
         default: break;
      } // switch
      return bContinue;
   } // HandleEvent
   
   
   // export public API for CCS.Events module
   BQ.Events.LoadWhenReady = LoadWhenReady;

   Object.seal(BQ.Events);
   return;
}()); // namespace


/**/
