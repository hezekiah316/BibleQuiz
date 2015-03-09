
   <div data-role="page" id="BQ_About">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQ_About_Title" data-theme="b">
         <h1 id="BQ_About_app_name">Bible Quiz | About</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQ_About_PageContent" data-role="content">
         <div data-role="collapsible-set" data-theme="a" data-content-theme="a">

             <div data-role="collapsible" data-theme="a" data-inset="false">
               <h2>Installation</h2>
               <p>
		            Bible Quiz needs to store its database in your browser's
		            permanent memory. This database contains questions and
		            answers along with associated  biblical references and
		            source information. The total size of the database is
		            approximately <span class="download_size"></span>. It may take
		            a few moments to download and install.
		         </p>
		         <p>
		            As the number of questions available on the Bible Quiz website
		            grows, updates to the database on your browser will be
		            downloaded to your browser "behind the scenes", so that you
		            can keep playing without interruption.
		         </p>
		         <p>
		            Note: This website receives no personally identifiable
		            information about you, nor does it track you in any way, nor
		            does it display advertisements.
            </div>

            <div data-role="collapsible" data-theme="a" data-inset="false">
               <h2>How to Play</h2>
               <p>From the Home page, press Start. You will jump right into a new game. When the game screen appears,
                  you will see the Bible trivia question at the top of the page in blue. Below it you will
                  see four possible answers. Press the button you think contains the right answer. The game
                  will let you know if you got it right or not.</p>
               <p>You can pause the game at any time. When you do, you will see your stats for the game so far.
                  You may, at this point, either quit the game or return to play.</p>
               <p>When you finish the game, you will be brought to a summary page, where you will see your stats
                  for the current game.</p>
               <p>You also have some configuration options available on the Config page:</p>
               <ul>
                  <li><b>Sections of the Bible to include</b>. You can choose one or more of the following
                     sections (the default is all sections):
                     <ul>
                        <li>Pentateuch</li>
                        <li>Historical Books</li>
                          <li>Prophets</li>
                          <li>Psalms and Wisdom Literature</li>
                          <li>Deuterocanonicals / Apocrypha</li>
                          <li>Gospels</li>
                          <li>Acts and Pauline Writings</li>
                          <li>Rest of the New Testament</li>
                     </ul>
                  </li>
                  <li><b>Game mode</b>. You have two choices: quiz mode (the default), or study mode.
                     <ul>
                        <li><b>Quiz Mode</b>: you have up to 30 seconds to answer each question.
                           When you choose your answer, the game will let you know if you are right,
                           and if not it will show you the correct answer. After 10 seconds,
                           the next question will appear.</li>
                        <li><b>Study Mode</b>: you can take as much time as you like to answer
                           each question. Once you answer, the game will let you know if your answer
                           is correct or not. It will also show you the relevant Scripture reference(s)
                           for the correct answer. You can click on the answer to see the verse if you
                           want to. When you are ready, the game will continue. (Note that in this mode,
                           all questions will come from prior versions of the Bible Content Exams
                           published by the Presbyterian Church (U.S.A.).)</li>
                     </ul>
                  </li>
                  <li><b>Number of questions</b>. Each game can have from 1 to 100 questions. (The default is 100.)</li>
               </ul>
               <p>If you are using a mobile device, consider adding an icon to your home screen.
                  Then you can play the game in full screen mode.</p>
               <p><i>Note</i>: Since this game resides entirely in your browser's permanent memory,
                  you can play this game even when you are not connected to the Internet.</p>
            </div>

            <div data-role="collapsible" data-theme="a" data-inset="false">
               <h2>Sources</h2>
               <p>Many of the questions and answers in this quiz come from the Bible Content Exam, published
                  annually by the <a href="http://www.pcusa.org">Presbyterian Church (U.S.A.)</a>.</p>
               <p>The software and formatting used on this site are copyright 2015 by Jeff Falter. All rights reserved.</p>
               <p>Special thanks to Savannah Williams for designing the custom icons used on this site.</p>
               <p>The Bible reference links are from <a href="http://www.biblia.com/bible/nrsv/isaiah43.1-3a">Biblia.com</a>,
                  a service of <a href="http://www.logos.com">Logos Bible Software</a>.</p>
               <p>The Scripture quotations contained herein are from the New Revised Standard Version Bible,
                  copyright 1989, by the Division of Christian Education of the National Council of the
                  Churches of Christ in the U.S.A. Used by permission. All rights reserved. (The common
                  abbreviation for this version is NRSV.)</p>
               <p>Currently, the Bible Quiz database contains <span id="BQ_About_TotalQuestions"></span> questions.</p>
		         <table class="gameScores">
		            <thead>
		               <tr><th>Section</th><th>Questions</th></tr>
		            </thead>
		            <tbody>
		               <tr><td>OLD TESTAMENT</td>                 <td id="BQ_About_OT"         >0</td></tr>
		               <tr><td>Pentateuch</td>                    <td id="BQ_About_Pentateuch" >0</td></tr>
		               <tr><td>Historical Books</td>              <td id="BQ_About_History"    >0</td></tr>
		               <tr><td>Prophets</td>                      <td id="BQ_About_Prophets"   >0</td></tr>
		               <tr><td>Psalms and Wisdom Literature</td>  <td id="BQ_About_Psalms"     >0</td></tr>
		               <tr><td>Deuterocanonicals / Apocrypha</td> <td id="BQ_About_Apocrypha"  >0</td></tr>
		               <tr><td></td><td></td></tr>
		               <tr><td>NEW TESTAMENT</td>                 <td id="BQ_About_NT"         >0</td></tr>
		               <tr><td>Gospels</td>                       <td id="BQ_About_Gospels"    >0</td></tr>
		               <tr><td>Acts and Pauline Writings</td>     <td id="BQ_About_Acts"       >0</td></tr>
		               <tr><td>Rest of the New Testament</td>     <td id="BQ_About_Rest"       >0</td></tr>
		            </tbody>
		         </table>
            </div>

            <div data-role="collapsible" data-theme="a" data-inset="false">
               <h2>Feeback</h2>
               <p>Your feedback is important! Feedback, corrections, questions, comments?
                  Send e-mail to <a href="mailto:developer@hezekiah316.com">Jeff</a>.</p>
            </div>

            <div data-role="collapsible" data-theme="a" data-inset="false">
               <h2>About the Author</h2>
               <h3>Occupation(s)</h3>
               <p>My name is Jeff Falter. I am an ordained minister in the Presbyterian Church (U.S.A.),
                a member of the <a href="www.pbygenval.org">Presbytery of Genessee Valley</a>.
                I have served churches in</p>
               <ul>
                  <li>Tenino, Washington</li>
                  <li>Marlinton, West Virginia</li>
                  <li>Asheboro, North Carolina</li>
                  <li>Cullman, Alabama</li>
                  <li>Elkins, West Virginia</li>
                  <li>Dundee, New York</li>
               </ul>
               <p>I have also served as a college chaplain in Keuka Park, New York.</p>
               <p>I am currently working for <a href="http://www.medent.com">Community Computer Service</a>
                  as a computer programmer. Prior to attending seminary, I also worked as a
                  software engineer and an electronic engineer.</p>
               <h3>Education:</h3>
               <ul>
                  <li>Master of Divinity, Union Presbyterian Theological Seminary</li>
                  <li>Bachelor of Science in Mathematics, George Mason University</li>
                  <li>High School Diploma, Gar-Field Senior High School, Dale City, Virginia</li>
               </ul>
               <h3>Additional</h3>
               <p>You can view some of my theological reflections on <a href="http://jefffalter.wordpress.com">WordPress</a>.</p>
            </div>
         </div>
      </div><!-- data-role: content -->

      <div data-role="footer" data-position="fixed" data-id="nav" data-theme="b">
         <div data-role="navbar">
            <ul id="BQ_About_secondary">
               <li><a href="" class="noButtonBorder" data-rel="back" data-icon="back">Back</a></li>
            </ul>
          </div><!-- data-role: navbar -->
      </div><!-- data-role: footer -->

   </div><!-- data-role: page, id: BQ_About -->

   <!-- ======================================================================================= -->
