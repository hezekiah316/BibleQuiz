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
