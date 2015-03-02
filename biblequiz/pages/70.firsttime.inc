
   <div data-role="page" id="BQ_FirstTime">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQ_FirstTime_Title" data-theme="b">
         <h1 id="BQ_FirstTime_app_name">Bible Quiz</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQ_FirstTime_PageContent" data-role="content">

         <h2><img src="images/BQ-32.png" class="paddingRight" />Welcome to Bible Quiz!</h2>

         <p>
            Welcome to Bible Quiz, a fun way to grow in your knowledge of the
            Bible&#8217;s contents. In order to play, this game needs to install
            its database in your browser. The total size of the database
            is approximately <span class="download_size"></span>. This may take
            a few moments to download, depending on your connection speed.
         </p>
         <div class="centerAlign">
            <button id="BQ_FirstTime_Install" type="button" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-check centerAlign" onclick="BQ.Database.Download()">Install</button>
         </div>
         <p>
            Note: This website receives no personally identifiable
		      information about you, nor does it track you in any way, nor
		      does it display advertisements.
         </p>

         <form class="full-width-slider">
            <label for="BQ_FirstTime_slider" class="ui-hidden-accessible">Slider:</label>
            <input type="range" name="BQ_FirstTime_slider" id="BQ_FirstTime_slider" min="0" max="100" value="0" data-mini="true" data-highlight="true" disabled="disabled" />
         </form>


      </div><!-- data-role: content -->

      <div data-role="footer" data-position="fixed" data-id="nav" data-theme="b">
         <div data-role="navbar">
            <ul id="BQ_FirstTime_secondary">
<!--
               <li><a id="BQ_FirstTime_refresh_button" onclick="location.reload()" class="noButtonBorder ui-state-disabled" data-role="button" data-icon="refresh">Retry</a></li>
 -->
                <li><a href="#BQ_About" class="noButtonBorder" data-role="button" data-icon="info">More Info</a></li>
            </ul>
          </div><!-- data-role: navbar -->
      </div><!-- data-role: footer -->

      <div id="BQ_FirstTime_error_message" data-role="popup" data-overlay-theme="a" data-theme="a">
         <div data-role="header" data-theme="a">
            <h1>Error</h1>
         </div>
         <p class="redText paddingVertical">
            Unable to download the Bible Quiz database.
            Please make sure you are online, then try again.
         </p>
      </div>

      <div id="BQ_FirstTime_CancelInstallation" data-role="popup" data-overlay-theme="a" data-theme="a">
         <div data-role="header" data-theme="a">
            <h1>Cancel</h1>
         </div>
         <p class="paddingVertical">Thank you for visiting Bible Quiz.</p>
      </div>
   </div><!-- data-role: page, id: BQ_FirstTime -->

   <!-- ======================================================================================= -->
