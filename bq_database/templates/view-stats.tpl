   <div data-role="page" id="BQDB_ViewStats">

      <div data-role="header" data-position="fixed" data-id="nav" id="BQDB_ViewStats_Title" data-theme="b">
         <h1 id="BQDB_ViewStats_app_name">BQ Database</h1>
      </div><!-- data-role: header, id: title -->

      <div id="BQDB_ViewStats_PageContent" data-role="content">
         <div class="ui-grid-b gameScores-breakpoint">
            <table class="ui-block-a gameScores gameScores_left">
               <thead>
                  <tr><th>Section</th>                         <th>Created</th>                  <th>Verified</th></tr>
               </thead>
               <tbody>
                  <tr class="strongText"><td>OLD TESTAMENT</td><td><?=$iCreated_section_O?></td> <td><?=$iVerified_section_O?></td></tr>
                  <tr><td>Pentateuch</td>                      <td><?=$iCreated_section_T?></td> <td><?=$iVerified_section_T?></td></tr>
                  <tr><td>Historical Books</td>                <td><?=$iCreated_section_H?></td> <td><?=$iVerified_section_H?></td></tr>
                  <tr><td>Prophets</td>                        <td><?=$iCreated_section_P?></td> <td><?=$iVerified_section_P?></td></tr>
                  <tr><td>Psalms and Wisdom Literature</td>    <td><?=$iCreated_section_W?></td> <td><?=$iVerified_section_W?></td></tr>
                  <tr><td>Deuterocanonicals / Apocrypha</td>   <td><?=$iCreated_section_D?></td> <td><?=$iVerified_section_D?></td></tr>
               </tbody>
            </table>
   
            <table class="ui-block-b gameScores gameScores_center">
               <thead>
                  <tr><th>Section</th>                           <th>Created</th>                  <th>Verified</th></tr>
               </thead>
                  <tr class="strongText"><td>NEW TESTAMENT</td>  <td><?=$iCreated_section_N?></td> <td><?=$iVerified_section_N?></td></tr>
                  <tr><td>Gospels</td>                           <td><?=$iCreated_section_G?></td> <td><?=$iVerified_section_G?></td></tr>
                  <tr><td>Acts and Pauline Writings</td>         <td><?=$iCreated_section_A?></td> <td><?=$iVerified_section_A?></td></tr>
                  <tr><td>Rest of the New Testament</td>         <td><?=$iCreated_section_R?></td> <td><?=$iVerified_section_R?></td></tr>
                  <tr><td></td><td></td><td></td></tr>
                  <tr class="strongText"><td>TOTAL QUESTIONS</td><td><?=$iCreated_section_B?></td> <td><?=$iVerified_section_B?></td></tr>
               </tbody>
            </table>
   
            <table class="ui-block-c gameScores gameScores_right">
               <thead>
                  <tr><th>Source</th><th>Created</th><th>Verified</th></tr>
               </thead>
               <tbody>
                  <?=$hSources?>
               </tbody>
            </table>
         </div>
      </div><!-- data-role: content -->
