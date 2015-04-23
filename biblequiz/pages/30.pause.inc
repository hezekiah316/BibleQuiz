
   <div data-role="page" id="BQ_Pause">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQ_Pause_Title" data-theme="b">
         <h1 id="BQ_Pause_app_name">Bible Quiz | Pause</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQ_Pause_PageContent" data-role="content">

         <p>You have paused your game. Here's how you are doing so far:</p>
         <table class="gameScores">
            <thead>
               <tr><th></th><th></th></tr>
            </thead>
            <tbody>
               <tr><td>Score</td>      <td id="BQ_Pause_Score"    >75%</td></tr>
               <tr><td>Correct</td>    <td id="BQ_Pause_Correct"  >12</td></tr>
               <tr><td>Incorrect</td>  <td id="BQ_Pause_Incorrect">4</td></tr>
               <tr><td>Remaining</td>  <td id="BQ_Pause_Remaining">84</td></tr>
               <tr><td>Time so far</td><td id="BQ_Pause_Time"     >2:51</td></tr>
            </tbody>
         </table>


      </div><!-- data-role: content -->

      <div id="BQ_Pause_Footer" data-role="footer" data-position="fixed" data-id="nav" data-theme="b">
         <div data-role="navbar">
            <ul id="BQ_Pause_secondary">
               <li><a id="BQ_Pause_ResumeGame" href="#BQ_Game"  data-role="button" data-icon="check">Resume Play</a></li>
               <li><a id="BQ_Pause_QuitGame"   href="#BQ_Start" data-role="button" data-icon="home">Quit Game</a></li>
            </ul>
          </div><!-- data-role: navbar -->
      </div><!-- data-role: footer -->

   </div><!-- data-role: page, id: BQ_Pause -->

   <!-- ======================================================================================= -->
