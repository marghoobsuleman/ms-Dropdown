<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Samples</title>
<link rel="stylesheet" href="css/sample.css" />
<script src="../js/jquery/jquery-1.9.0.min.js"></script>
<!-- <msdropdown> -->
<link rel="stylesheet" type="text/css" href="../css/msdropdown/dd.css" />
<script src="../js/msdropdown/jquery.dd.min.js"></script>
<!-- </msdropdown> -->
</head>
<body>
<table width="100%" border="0" cellspacing="1" cellpadding="5" class="topmenu">
  <tr>
    <td colspan="8"><h1>Javascript image dropdown <span id="ver"></span> <a title="Download" href="http://www.marghoobsuleman.com/jquery-image-dropdown" class="small">Download</a></h1></td>
  </tr>
  <tr>
    <td><a href="index.html">Normal</a></td>
    <td><a href="byjson.html">By Json Data</a></td>
    <td><a href="multiple-skin.html">Multiple Skin</a></td>
    <td><a href="css-sprite.html">CSS Sprite</a></td>
    <td><a href="object-oriented-approach.html">Object Oriented Approach</a></td>
    <td><a href="use-checkbox.html">Use Checkbox</a></td>
    <td><a href="mouse-events.html">Mouse Events</a></td>
    <td><a href="help.html">Documentation</a></td>
  </tr>
</table>
<form action="submitdata.php" method="post" enctype="multipart/form-data" name="frmdata">
<table width="100%" border="0" cellspacing="1" cellpadding="5" class="tblWhite">
  <tr>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td valign="top">
    <?php
echo "<pre>";
print_r($_POST);
echo "</pre>";
?>
    </td>
  </tr>
  <tr>
    <td valign="top">&nbsp;</td>
  </tr>
  <tr>
    <td valign="top">&nbsp;</td>
  </tr>
</table>
</form>
<p>&nbsp;</p>

<script>
$(document).ready(function(e) {
	$("#payments").msDropdown({visibleRows:4});
	$("#tech").msDropdown();//{animStyle:'none'} /{animStyle:'slideDown'} {animStyle:'show'}
	//no use
	$("#ver").html(msBeautify.version.msDropdown);
});
</script>

</body>
</html>
