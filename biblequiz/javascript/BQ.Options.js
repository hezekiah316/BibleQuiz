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
   
   // private method
   Options.prototype._Save = function()
   {
      var oOptions = {
            M : this.bMode,
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
      
//      $("#BQ_Config_Questions").val(oOptions.iQuestions);
      $("body").one("pagecontainerchange", function(eEvent) {
         $("#BQ_Config_Questions").val(oOptions.iQuestions);
         $("#BQ_Config_Questions").slider().slider("refresh");
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
