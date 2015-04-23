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
