
   <div data-role="page" id="BQ_Config">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQ_Config_Title" data-theme="b">
         <h1 id="BQ_Config_app_name">Bible Quiz | Options</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQ_Config_PageContent" data-role="content">

         <form name="BQ_Config_Form">

            <label for="BQ_Config_Questions"><h2>Questions to Include</h2></label>
            <input name="BQ_Config_Questions" id="BQ_Config_Questions" type="range" min="10" max="100" value="100"  data-highlight="true" data-theme="a" />

            <label for="BQ_Config_Mode"><h2>Game Mode</h2></label>
            <select name="BQ_Config_Mode" id="BQ_Config_Mode" data-role="slider" data-track-theme="a" data-theme="a">
               <option value="quiz" selected>Quiz</option>
               <option value="study">Study</option>
            </select>

            <h2>Sections to Include</h2>
            <div class="ui-grid-a">
                <div class="ui-block-a">
                   <fieldset data-role="controlgroup">
                       <legend>Old Testament:</legend>
                       <input type="checkbox" name="BQ_Config_Torah" id="BQ_Config_Torah" checked />
                       <label for="BQ_Config_Torah">Pentateuch</label>
                       <input type="checkbox" name="BQ_Config_History" id="BQ_Config_History" checked />
                       <label for="BQ_Config_History">Historical Books</label>
                       <input type="checkbox" name="BQ_Config_Prophets" id="BQ_Config_Prophets" checked />
                       <label for="BQ_Config_Prophets">Prophets</label>
                       <input type="checkbox" name="BQ_Config_Writings" id="BQ_Config_Writings" checked />
                       <label for="BQ_Config_Writings">Psalms and Wisdom Literature</label>
                       <input type="checkbox" name="BQ_Config_Deutero" id="BQ_Config_Deutero" checked />
                       <label for="BQ_Config_Deutero">Deuterocanonicals / Apocrypha</label>
                   </fieldset>
               </div>
                <div class="ui-block-b">
                   <fieldset data-role="controlgroup">
                       <legend>New Testament:</legend>
                       <input type="checkbox" name="BQ_Config_Gospels" id="BQ_Config_Gospels" checked />
                       <label for="BQ_Config_Gospels">Gospels</label>
                       <input type="checkbox" name="BQ_Config_Acts" id="BQ_Config_Acts" checked />
                       <label for="BQ_Config_Acts">Acts and Pauline Writings</label>
                       <input type="checkbox" name="BQ_Config_RestNT" id="BQ_Config_RestNT" checked />
                       <label for="BQ_Config_RestNT">Rest of the New Testament</label>
                   </fieldset>
                </div>
            </div><!-- grid-a -->

<!--
            <label for="BQ_Config_Bible"><h2>Preferred Bible translation</h2></label>
            <input type="text" name="BQ_Config_Bible" id="BQ_Config_Bible" value="NRSV" readonly />
 -->

         </form>
      </div><!-- data-role: content -->

      <div data-role="footer" data-position="fixed" data-id="nav" data-theme="b">
         <div data-role="navbar">
            <ul id="BQ_Config_secondary">
               <li><a href="" class="noButtonBorder" data-rel="back" data-icon="back">Back</a></li>
            </ul>
          </div><!-- data-role: navbar -->
      </div><!-- data-role: footer -->

   </div><!-- data-role: page, id: BQ_Config -->

   <!-- ======================================================================================= -->
