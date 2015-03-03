   <div data-role="page" id="BQDB_Test">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQDB_Test_Title" data-theme="b">
         <h1 id="BQDB_Test_app_name">BQ Database</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQDB_Test_PageContent" data-role="content">

         <h2>Unit Testing</h2>
<!-- 
         <button onclick="BQ.UnitTesting.Test()" class="ui-btn ui-icon-action">Touch to begin testing...</button>
 -->
         <div id="qunit"></div>
   		<div id="qunit-fixture"></div>
         
<!-- 
         <script src="../biblequiz/jquery/qunit.js"></script>
 -->
 			<script>BQ.UnitTesting.Test();</script>

 
      </div><!-- data-role: content -->
