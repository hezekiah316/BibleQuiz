   <div data-role="page" id="BQDB">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQDB_DataEntry_Title" data-theme="b">
         <h1 id="BQDB_DataEntry_app_name">BQ Database</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQDB_DataEntry_PageContent" data-role="content">

      <p class="redText centerAlign"><?=$sMessage?></p>

      <p class="greenText centerAlign">Use <code>Ctrl-Alt-T</code> to insert or <code>@T_</code> and 
         <code>@t_</code> to wrap the tetragrammaton.<br/>
         Use <code>@I_</code> and <code>@i_</code> to wrap <i>italicized</i> text.</p>
      <form id="BQDB_DataEntry_Form" method="POST" action="<?=$sBaseUrl?>index.php">
         <input type="hidden" name="action" value="save" />
         <div class="ui-field-contain">
            <label for="question">Question</label><input type="text" name="question" value="<?=$sQuestion?>" placeholder="Question" required autofocus /><br />
            <label for="answerA">Answer A</label><input type="text" name="answerA" value="<?=$sAnswerA?>" placeholder="Answer A" required /><br />
            <label for="answerB">Answer B</label><input type="text" name="answerB" value="<?=$sAnswerB?>" placeholder="Answer B" required /><br />
            <label for="answerC">Answer C</label><input type="text" name="answerC" value="<?=$sAnswerC?>" placeholder="Answer C" required /><br />
            <label for="answerD">Answer D</label><input type="text" name="answerD" value="<?=$sAnswerD?>" placeholder="Answer D" required /><br />
         </div>

         <div class="centerAlign">
            <fieldset data-role="controlgroup" data-type="horizontal">
               <legend>Correct Answer</legend>
               <label for="correctA">A</label><input type="radio" id="correctA" name="correct" value="A" <?=$sCorrectA?> />
               <label for="correctB">B</label><input type="radio" id="correctB" name="correct" value="B" <?=$sCorrectB?> />
               <label for="correctC">C</label><input type="radio" id="correctC" name="correct" value="C" <?=$sCorrectC?> />
               <label for="correctD">D</label><input type="radio" id="correctD" name="correct" value="D" <?=$sCorrectD?> />
            </fieldset>
         </div>      

         <div class="ui-field-contain">
            <label for="scripture">Scripture References</label>
            <input id="scripture" name="scripture" value="<?=$sScripture?>" required placeholder="Separate scripture references by ;" />
         </div>

         <div class="ui-field-contain">
            <label for="section">Section</label>
            <select name="section" id="section" required>
               <option value="T" accesskey="T" <?=$sSectionT?> >Pentateuch</option>
               <option value="H" accesskey="H" <?=$sSectionH?> >Historical Books</option>
               <option value="P" accesskey="P" <?=$sSectionP?> >Prophets</option>
               <option value="W" accesskey="W" <?=$sSectionW?> >Psalms and Wisdom Literature</option>
               <!-- <option value="D" accesskey="D" <?=$sSectionD?> >Deuterocanonicals / Apocrypha</option> -->
               <option value="G" accesskey="G" <?=$sSectionG?> >Gospels</option>
               <option value="A" accesskey="A" <?=$sSectionA?> >Acts and Pauline Writings</option>
               <option value="R" accesskey="R" <?=$sSectionR?> >Rest of the New Testament</option>
            </select>

            <label for="source">Source</label>
            <select name="source" id="source" data-native-menu="false" required >
               <option <?=$sSource_1988_BCE?> >1988_BCE</option>
               <option <?=$sSource_1989_BCE?> >1989_BCE</option>
               <option <?=$sSource_1990_BCE?> >1990_BCE</option>
               <option <?=$sSource_1991_BCE?> >1991_BCE</option>
               <option <?=$sSource_1992_BCE?> >1992_BCE</option>
               <option <?=$sSource_1993_BCE?> >1993_BCE</option>
               <option <?=$sSource_1994_BCE?> >1994_BCE</option>
               <option <?=$sSource_1995_BCE?> >1995_BCE</option>
               <option <?=$sSource_1996_BCE?> >1996_BCE</option>
               <option <?=$sSource_1997_BCE?> >1997_BCE</option>
               <option <?=$sSource_1998_BCE?> >1998_BCE</option>
               <option <?=$sSource_1999_BCE?> >1999_BCE</option>
               <option <?=$sSource_2000_BCE?> >2000_BCE</option>
               <option <?=$sSource_2001_BCE?> >2001_BCE</option>
               <option <?=$sSource_2002_BCE?> >2002_BCE</option>
               <option <?=$sSource_2003_BCE?> >2003_BCE</option>
               <option <?=$sSource_2004_BCE?> >2004_BCE</option>
               <option <?=$sSource_2005_BCE?> >2005_BCE</option>
               <option <?=$sSource_2006_BCE?> >2006_BCE</option>
               <option <?=$sSource_2007_BCE?> >2007_BCE</option>
               <option <?=$sSource_2008_BCE?> >2008_BCE</option>
               <option <?=$sSource_2009_BCE?> >2009_BCE</option>
               <option <?=$sSource_2010_BCE?> >2010_BCE</option>
               <option <?=$sSource_2011_BCE?> >2011_BCE</option>
               <option <?=$sSource_2012_BCE?> >2012_BCE</option>
               <option <?=$sSource_2013_BCE?> >2013_BCE</option>
               <option <?=$sSource_2014_BCE?> >2014_BCE</option>
            </select>
            <label for="index">Number</label>
            <input id="index" name="index" value="<?=$iIndex?>" type="number" min="1" max="100" required />
         </div>

         <div class="ui-field-contain centerAlign">
            <button type="submit" class="ui-btn ui-btn-inline">Save</button>
            <button type="reset"  class="ui-btn ui-btn-inline">Clear</button>
         </div>
      </form>

   </div><!-- data-role: content -->
