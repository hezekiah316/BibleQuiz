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
         oStats.iBible    = oData.B; // whole Bible
         oStats.iOT       = oData.O; // Old Testament
         oStats.iTorah    = oData.T; // Torah
         oStats.iHistory  = oData.H; // History
         oStats.iProphets = oData.P; // Prophets
         oStats.iWritings = oData.W; // Writings
         oStats.iDeutero  = oData.D; // Deuterocanonicals
         oStats.iNT       = oData.N; // New Testament
         oStats.iGospels  = oData.G; // Gospels
         oStats.iActs     = oData.A; // Acts and Paul
         oStats.iRestNT   = oData.R; // Rest of the NT
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
