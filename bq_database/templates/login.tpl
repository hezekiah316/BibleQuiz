   <div data-role="page" id="BQDB_Login">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQDB_Login_Title" data-theme="b">
         <h1 id="BQDB_Login_app_name">BQ Database</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQDB_Login_PageContent" data-role="content">
         <div class="centerAlign">
            <form id="BQDB_Login_Form" name="BQDB_Login_Form" action="<?=$sBaseUrl?>index.php" method="post">
               <label for="hezekiah316">Please enter your password</label>
               <input id="hezekiah316" name="hezekiah316" type="password" autofocus />
               <button type="submit" />Login</button>
            </form>
         </div>
      </div><!-- data-role: content -->

      <div data-role="footer" data-position="fixed" data-id="nav" data-theme="b">
         <div data-role="navbar">
            <ul id="BQDB_Logout">
               <li><a href="" data-rel="back" data-icon="back">Home Page</a></li>
            </ul>
          </div><!-- data-role: navbar -->
      </div><!-- data-role: footer -->

   </div><!-- data-role: page, id: BQDB_MainMenu -->

</body>
</html>
      