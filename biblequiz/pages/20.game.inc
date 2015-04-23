
   <div data-role="page" id="BQ_Game">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQ_Game_Title" data-theme="b">
         <h1 id="BQ_Game_app_name">Bible Quiz | Play</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQ_Game_PageContent" data-role="content">

         <fieldset id="BQ_Game_ControlGroup" data-role="controlgroup">
         
	         <legend id="BQ_Game_question" class="blueText"></legend>
	
	         <input type="radio" name="answer" id="BQ_Game_answerA" value="A" data-theme="a" />
	         <label for="BQ_Game_answerA"></label>

	         <input type="radio" name="answer" id="BQ_Game_answerB" value="B" data-theme="a" />
	         <label for="BQ_Game_answerB"></label>
	
            <input type="radio" name="answer" id="BQ_Game_answerC" value="C" data-theme="a" />
	         <label for="BQ_Game_answerC"></label>
	            
            <input type="radio" name="answer" id="BQ_Game_answerD" value="D" data-theme="a" />
	         <label for="BQ_Game_answerD"></label>

         </fieldset>
         <br />
         <br />
         <div id="BQ_Game_MoreInfoDiv" data-role="collapsible" data-theme="a" data-content-theme="a" data-mini="true" class="keepHidden">
            <h2>More Info</h2>
            <p>Scripture:</p>
            <ul id="BQ_Game_BibleRefs">
            </ul>
            <p class="smallText">BQ Question #<span id="BQ_Game_DbIndex"></span></p>
            <p class="smallText">Source: <span id="BQ_Game_Source"></span></p>
            <input type="hidden" id="BQ_Game_correctAnswer" value="" />
         </div>

      </div><!-- data-role: content -->

      <div id="BQ_footer" data-role="footer" data-position="fixed" data-id="nav" data-theme="b">
         <div data-role="navbar">
            <ul id="BQ_Game_secondary">
               <li><a id="BQ_Game_FinalAnswer" data-icon="check">Final Answer</a></li>
               <li><a id="BQ_Game_PauseGame" href="#BQ_Pause" data-icon="clock">Pause</a></li>
            </ul>
          </div><!-- data-role: navbar -->
      </div><!-- data-role: footer -->

   </div><!-- data-role: page, id: BQ_Game -->

   <!-- ======================================================================================= -->
