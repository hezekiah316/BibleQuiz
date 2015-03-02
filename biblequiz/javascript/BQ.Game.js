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
      
      this.section    = sSection;
      this.total      = 0;
      this.right      = 0;
      this.wrong      = 0;
      this.available  = iAvailable;
      this.desired    = 0;
      this.include    = true;
      this.weight     = iWeight; 
      this.questions  = [];
   }; // CSection constructor

   CSection.prototype.CalculateNumberOfQuestions = function(iTotalDesired, iTotalQuestions)
   {
      if (this.include) {
         this.total = Math.min(Math.max(parseInt((iTotalQuestions * this.weight / iTotalDesired), 10), 1), this.available);
      } else {
         this.total = 0;
      } // if
      return this.total;
   }; // CalculateNumberOfQuestions
   
   CSection.prototype.Include = function(bInclude)
   {
      this.include = !!bInclude;
      this.desired = this.weight * this.include;
      return this.desired;
   }; // Include

   CSection.prototype.AddExtra = function()
   {
      var bAddExtra = (this.include && (this.total < this.available));
      if (bAddExtra) {
         this.total++;
      } // if
      return bAddExtra;
   }; // AddExtra
   
   CSection.prototype.LoadQuestions = function()
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
   
   var CGame = function(oSections, oStats) // constructor
   {
      // Initialize public members
      this.bMode            = true;   // bMode: true -> Quiz, false -> Study
      this.iQuestions       = 100;    // number of questions to include
      this.sBible           = "NRSV"; // Preferred Bible version for Scripture references
      this.aoQuiz           = [];
      this.iCurrentQuestion = -1;
      
      // Seal objects so they don't have properties added or removed by mistake
      this.oTorah    = Object.seal(new CSection("Torah",    koWeights.iTorah,    oStats.iTorah));
      this.oHistory  = Object.seal(new CSection("History",  koWeights.iHistory,  oStats.iHistory));
      this.oWritings = Object.seal(new CSection("Writings", koWeights.iWritings, oStats.iWritings));
      this.oProphets = Object.seal(new CSection("Prophets", koWeights.iProphets, oStats.iProphets));
      this.oDeutero  = Object.seal(new CSection("Deutero",  koWeights.iDeutero,  oStats.iDeutero));
      this.oGospels  = Object.seal(new CSection("Gospels",  koWeights.iGospels,  oStats.iGospels));
      this.oActs     = Object.seal(new CSection("Acts",     koWeights.iActs,     oStats.iActs));
      this.oRestNT   = Object.seal(new CSection("RestNT",   koWeights.iRestNT,   oStats.iRestNT));
      
      // Object.seal(this.oTorah);
      // Object.seal(this.oHistory);
      // Object.seal(this.oWritings);
      // Object.seal(this.oProphets);
      // Object.seal(this.oDeutero);
      // Object.seal(this.oGospels);
      // Object.seal(this.oActs);
      // Object.seal(this.oRestNT);

      
      // Get currently saved options
      this.bMode      = oSections.bMode;
      this.iQuestions = oSections.iQuestions;
      this.sBible     = oSections.sBible;
      
      // Calculate total weight
      var iTotalDesired = 0;
      iTotalDesired += this.oTorah.Include(   oSections.bTorah);
      iTotalDesired += this.oHistory.Include( oSections.bHistory);
      iTotalDesired += this.oWritings.Include(oSections.bWritings);
      iTotalDesired += this.oProphets.Include(oSections.bProphets);
      iTotalDesired += this.oDeutero.Include( oSections.bDeutero);
      iTotalDesired += this.oGospels.Include( oSections.bGospels);
      iTotalDesired += this.oActs.Include(    oSections.bActs);
      iTotalDesired += this.oRestNT.Include(  oSections.bRestNT);

      // Calculate number of questions for each area
      var iTotalQuestions = 0;
      iTotalQuestions += this.oTorah.CalculateNumberOfQuestions(   iTotalDesired, this.iQuestions);
      iTotalQuestions += this.oHistory.CalculateNumberOfQuestions( iTotalDesired, this.iQuestions);
      iTotalQuestions += this.oWritings.CalculateNumberOfQuestions(iTotalDesired, this.iQuestions);
      iTotalQuestions += this.oProphets.CalculateNumberOfQuestions(iTotalDesired, this.iQuestions);
      iTotalQuestions += this.oDeutero.CalculateNumberOfQuestions( iTotalDesired, this.iQuestions);
      iTotalQuestions += this.oGospels.CalculateNumberOfQuestions( iTotalDesired, this.iQuestions);
      iTotalQuestions += this.oActs.CalculateNumberOfQuestions(    iTotalDesired, this.iQuestions);
      iTotalQuestions += this.oRestNT.CalculateNumberOfQuestions(  iTotalDesired, this.iQuestions);

      // Calculate arrays of question numbers
      var iRandom = this.iQuestions - iTotalQuestions;
      while (iRandom > 0) {
         var iUseSection = Math.floor(Math.random() * 8);
         switch (iUseSection) {
            case 0: iRandom -= this.oTorah.AddExtra();    break;
            case 1: iRandom -= this.oHistory.AddExtra();  break;
            case 2: iRandom -= this.oWritings.AddExtra(); break;
            case 3: iRandom -= this.oProphets.AddExtra(); break;
            case 4: iRandom -= this.oDeutero.AddExtra();  break;
            case 5: iRandom -= this.oGospels.AddExtra();  break;
            case 6: iRandom -= this.oActs.AddExtra();     break;
            case 7: iRandom -= this.oRestNT.AddExtra();   break;
            default: break;
         }// switch
      } // while

      this.oTorah.LoadQuestions();
      this.oHistory.LoadQuestions();
      this.oWritings.LoadQuestions();
      this.oProphets.LoadQuestions();
      this.oDeutero.LoadQuestions();
      this.oGospels.LoadQuestions();
      this.oActs.LoadQuestions();
      this.oRestNT.LoadQuestions();
      
      var iIntervalId = setInterval(function() {
         if (BQ.Database.IsLoaded()) {
            clearInterval(iIntervalId);
            this.aoQuiz = BQ.Database.GetQuestions();
         } // if
      }); // setInterval
      
   }; // constructor
   
   CGame.prototype.NextQuestion = function()
   {
      var iNext = null;
      
      if (this.iCurrentQuestion < this.iQuestions) {
         this.iCurrentQuestion++;
         iNext = this.aoQuiz[this.iCurrentQuestion];
      } // if

      return iNext;
   }; // NextQuestion

   var ThisGame = null; // The current game
   
   function InitializeQuiz()
   {
      var oOptions = BQ.Options.Get();
      var oStats   = BQ.Stats.Get();
      ThisGame = new CGame(oOptions, oStats);
      return;
   } // InitializeQuiz
   
   
   function GetNextQuestion()
   {
      if (ThisGame === null) {
         InitializeQuiz();
      } // if
      
      return ThisGame.NextQuestion();
   } // GetNextQuestion

   
   
   // export public API for CCS.Game module
   BQ.Game.GetNextQuestion = GetNextQuestion;
   BQ.Game.InitializeQuiz  = InitializeQuiz;

   Object.seal(BQ.Game);
   return;
}()); // namespace


/**/
