<?php
class CTemplate
{
   private $_ksTemplateDir = "templates/";
   private $_ksHeader      = "templates/header.tpl";
   private $_ksFooter      = "templates/footer.tpl";
   private $_hPage         = "";
   private $_sTemplate     = "";
   
   function __construct($sTemplateName)
   {
      $this->_sTemplate = "{$this->_ksTemplateDir}{$sTemplateName}.tpl";
      
      $bUseHeader = ($sTemplateName !== "logout");
      $bUseFooter = ($sTemplateName !== "logout" && 
      		         $sTemplateName !== "login" && 
      		         $sTemplateName !== "main-menu");
      
      if ($bUseHeader) {
         $this->_hPage .= file_get_contents($this->_ksHeader);
      } // if

      $this->_hPage .= file_get_contents($this->_sTemplate);
      
      if ($bUseFooter) {
         $this->_hPage .= file_get_contents($this->_ksFooter);
      } // if
      
      if (isset($_SESSION["sBaseUrl"])) {
         $this->Substitute("sBaseUrl", $_SESSION["sBaseUrl"]);
      } // if
      
   } // constructor
   
   function __destruct()
   {
   } // destructor
   
   private function Substitute($sKey, $sValue)
   {
      $Debug = new CDebug(false, "Substitute");
      
      $sPattern = "<?=$". trim($sKey) . "?>";
      $Debug->Write("pattern -> {$sPattern}, replacement ->|{$sValue}|");
      $hResult = str_replace($sPattern, $sValue, $this->_hPage);
      if ($hResult !== false) {
         $this->_hPage = $hResult;
      } else {
         $Debug->Write("preg_replace failed");
      } // if
      return;
   } // Substitute
   
   public function AddData($Data, $sReplacement = "")
   {
      $Debug = new CDebug(false, "AddData");
      
      if (is_object($Data) || is_array($Data)) {
         foreach ($Data as $sKey => $sValue) {
            $Debug->Write("{$sKey} => {$sValue}");
            $this->Substitute($sKey, $sValue);
         } // foreach
      } else {
         $this->Substitute($Data, $Replacement);
      } // if
      return $this;
   } // AddData
   
   public function Display()
   {
      echo $this->_hPage;
      return;
   } // Display
} // CTemplate