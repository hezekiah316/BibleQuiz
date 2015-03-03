var BQ = {}; // the only global object

//Launch any start up functions as soon as the page loads
$(function() {
   BQ.DataEntry.LoadWhenReady();
   return;
});


BQ.DataEntry = (function()
{
   "use strict";
   
   var _ksDataEntryForm = "BQ_DataEntry_Form";
   var _ksTetra = "@T_Lord@t_ ";
   
   function _CaptureTetra(eKey)
   {
      var bIgnored = true;
      if ("t" === String.fromCharCode(eKey.which).toLowerCase() && eKey.ctrlKey && eKey.altKey) {
         var sValue = $(eKey.target).val();
         $(eKey.target).val(sValue + _ksTetra);
         eKey.preventDefault();
         bIgnored = false;
      } // if
      return bIgnored;
   } // _CaptureTetra
   
   // Captures Alt-T, return the encoded tetragrammaton
   function CaptureTetragrammaton()
   {
      var sEvent = "keydown.captureTetra, keypress.captureTetra";
      $(document).off(sEvent).on(sEvent, "#" + _ksDataEntryForm + " input[type='text']", _CaptureTetra);
      return;
   } // CaptureTetragrammaton
   
   function CloseSessionOnExit()
   {
      $(window).off("close.logout").on("close.logout", function () {
    	  $.post("index.php", {action:"logout"});
      });
      return;
   } // CloseSessionOnExit
   
   // Runs when the DOM is fully loaded
   function LoadWhenReady()
   {
      CloseSessionOnExit();
      CaptureTetragrammaton();
      return;
   } // LoadWhenReady

   function TestModule()
   {
      var eFixture = document.getElementById("qunit-fixture");
      
      var eForm = document.createElement("form");
      eForm.id = _ksDataEntryForm;

      var eInput = document.createElement("input");
      eInput.type = "text";
      eInput.id = "qunit_tetra";
      
      module("DataEntry", {
         setup : function() {
            eFixture.appendChild(eForm);
            eForm.appendChild(eInput);
         }, // setup
         teardown : function() {
            eFixture.removeChild(eForm);
         } // teardown
      });
      
      test("Capture Tetragrammaton", function() {
         var eEvent = $.Event("keydown");
         eEvent.which = "t".charCodeAt(0);
         eEvent.ctrlKey = true;
         eEvent.altKey = true;
         eEvent.target = eInput;
         $(document).trigger(eEvent);
         
         // verify expected behavior
         deepEqual(document.getElementById("qunit_tetra").value, _ksTetra, "inserted Tetragrammaton");
      });
      
      return;
   } // TestDataEntry
   

   // return module API
   return {
      LoadWhenReady : LoadWhenReady,
      TestModule    : TestModule
   };
})(); // BQ.DataEntry


BQ.UnitTesting = (function() 
{
   "use strict";
   
   // Test that I have set up unit testing correctly
   function TestQUnit()
   {
      module("testing");
      test("Testing QUnit setup in BQ", function() {
         var sHello = "Hello";
         equal(sHello, "Hello", "We expect the value to be Hello");
      }); // test

      return;
   } // TestQUnit
   
   
   function Test()
   {
      // needed to initialize system without refreshing the page
      QUnit.init();
      QUnit.start();
      
      TestQUnit();
      BQ.DataEntry.TestModule();

      return;
   } // Test

   
   // return module API
   return {
      Test : Test
   };
   
})(); // BQ.UnitTesting