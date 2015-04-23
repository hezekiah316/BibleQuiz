
   <div data-role="page" id="BQ_Stats">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQ_Stats_Title" data-theme="b">
         <h1 id="BQ_Stats_app_name">Bible Quiz | Stats</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQ_Stats_PageContent" data-role="content">
         <h2>Total Scores</h2>
         <p>
            You have played
            <span id="BQ_Stats_Total_Games" class="strongText">0</span>
            games so far. You have answered
            <span id="BQ_Stats_Total_Score" class="strongText">0</span>%
            of the questions correctly.
         </p>
         <table class="gameScores">
            <thead>
               <tr><th>Section</th><th>Right / Wrong</th></tr>
            </thead>
            <tbody>
               <tr><td>WHOLE BIBLE</td>                   <td id="BQ_Stats_Total_Bible"      >0 / 0</td></tr>
               <tr><td></td><td></td></tr>
               <tr><td>OLD TESTAMENT</td>                 <td id="BQ_Stats_Total_OT"         >0 / 0</td></tr>
               <tr><td>Pentateuch</td>                    <td id="BQ_Stats_Total_Pentateuch" >0 / 0</td></tr>
               <tr><td>Historical Books</td>              <td id="BQ_Stats_Total_History"    >0 / 0</td></tr>
               <tr><td>Prophets</td>                      <td id="BQ_Stats_Total_Prophets"   >0 / 0</td></tr>
               <tr><td>Psalms and Wisdom Literature</td>  <td id="BQ_Stats_Total_Psalms"     >0 / 0</td></tr>
               <tr><td>Deuterocanonicals / Apocrypha</td> <td id="BQ_Stats_Total_Apocrypha"  >0 / 0</td></tr>
               <tr><td></td><td></td></tr>
               <tr><td>NEW TESTAMENT</td>                 <td id="BQ_Stats_Total_NT"         >0 / 0</td></tr>
               <tr><td>Gospels</td>                       <td id="BQ_Stats_Total_Gospels"    >0 / 0</td></tr>
               <tr><td>Acts and Pauline Writings</td>     <td id="BQ_Stats_Total_Acts"       >0 / 0</td></tr>
               <tr><td>Rest of the New Testament</td>     <td id="BQ_Stats_Total_Rest"       >0 / 0</td></tr>
            </tbody>
         </table>
      </div><!-- data-role: content -->

      <div data-role="footer" data-position="fixed" data-id="nav" data-theme="b">
         <div data-role="navbar">
            <ul id="BQ_Stats_secondary">
               <li><a href="" class="noButtonBorder" data-rel="back" data-icon="back">Back</a></li>
            </ul>
          </div><!-- data-role: navbar -->
      </div><!-- data-role: footer -->

   </div><!-- data-role: page, id: BQ_Stats -->

   <!-- ======================================================================================= -->
