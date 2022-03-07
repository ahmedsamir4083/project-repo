
var loadFile = function (event) {
  var outputimage = document.getElementById('outputimage');
  outputimage.src = URL.createObjectURL(event.target.files[0]);
  outputimage.onload = function () {
    URL.revokeObjectURL(outputimage.src)
  }
};