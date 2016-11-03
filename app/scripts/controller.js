var $jsonFolder = $('#jsonFolder');
var $csvFolder = $('#csvFolder');

$('.icon-folder-open').on('click', function() {
  $jsonFolder.trigger('click');
});

$jsonFolder.on('click', function(e) {
  e.stopImmediatePropagation();
});

$('.icon-file-excel').on('click', function() {
  $csvFolder.trigger('click');
});

$csvFolder.on('click', function(e) {
  e.stopImmediatePropagation();
});
