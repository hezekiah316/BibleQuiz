<?php
class CDebug
{
   private $_ksDebugLogFile = "/home/a8990680/logs/BQ_debug.log";
   private $_kiIndentIncrease = +1;
   private $_kiIndentNoChange = 0;
   private $_kiIndentDecrease = -1;
   
   static private $_iIndent = 0; // number of tabs by which to indent each line
   private $_ksTab = "   ";
   
   private $_bDebug    = false;
   private $_sFunction = "";
   
   function __construct($bDebug, $sFunction)
   {
      $this->_bDebug = $bDebug;
      $this->_sFunction = $sFunction;
      if (self::$_iIndent < 0) {
         self::$_iIndent = 0;
      } // if
      
      if ($this->_bDebug) {
         $this->_Write($this->_kiIndentIncrease, "Entering {$this->_sFunction}");
      } // if
   } // constructor
   
   function __destruct()
   {
      if ($this->_bDebug) {
         $this->_Write($this->_kiIndentDecrease, "Leaving {$this->_sFunction}");
      } // if
   } // destructor
   
   public function Write($sOutput)
   {
      if ($this->_bDebug) {
         $this->_Write($this->_kiIndentNoChange, $sOutput);
      } // if
      return;
   } // Write
   
   public function PrintArray($aArray, $sLabel = "")
   {
      if ($this->_bDebug) {
         $sArray = print_r($aArray, true);
         $this->_Write($this->_kiIndentNoChange, $sLabel . $sArray);
      } // if
      return;
   } // PrintArray
   
   private function _Write($iIndent, $sOutput)
   {
      if ($this->_bDebug) {
         if ($iIndent < 0 && self::$_iIndent > 0) {
            self::$_iIndent--;
         } // if
         
         for ($i = 0; $i < self::$_iIndent; $i++) {
            $sOutput = $this->_ksTab . $sOutput;
         } // for
         
         $sOutput .= "\n";
          
         file_put_contents($this->_ksDebugLogFile, $sOutput, FILE_APPEND);
         
         if ($iIndent > 0) {
            self::$_iIndent++;
         } // if
      } // if
      return;
   } // _Write
} // CDebug