   <div data-role="page" id="BQDB_MainMenu">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQDB_MainMenu_Title" data-theme="b">
         <h1 id="BQDB_MainMenu_app_name">BQ Database</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQDB_MainMenu_PageContent" data-role="content">

         <a href="<?=$sBaseUrl?>index.php?action=data-entry" class="ui-btn ui-btn-icon-right ui-icon-edit">Data Entry</a>
      
         <a href="<?=$sBaseUrl?>index.php?action=verify" class="ui-btn ui-btn-icon-right ui-icon-check">Data Verification</a>

         <a href="<?=$sBaseUrl?>index.php?action=export" class="ui-btn ui-btn-icon-right ui-icon-action">Data Export</a>

         <a href="<?=$sBaseUrl?>index.php?action=view-stats" class="ui-btn ui-btn-icon-right ui-icon-eye">View Statistics</a>
         
         <a href="<?=$sBaseUrl?>index.php?action=test" class="ui-btn ui-btn-icon-right ui-icon-star">Test Software</a>

      </div><!-- data-role: content -->

      <div data-role="footer" data-position="fixed" data-id="nav" data-theme="b">
         <div data-role="navbar">
            <ul id="BQDB_Logout">
               <li><a href="<?=$sBaseUrl?>index.php?action=logout" data-icon="delete">Exit</a></li>
            </ul>
          </div><!-- data-role: navbar -->
      </div><!-- data-role: footer -->

   </div><!-- data-role: page, id: BQDB_MainMenu -->

</body>
</html>
      