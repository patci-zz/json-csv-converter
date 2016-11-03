'use strict';
const fs = require('fs');
const path = require('path');
const converter = require('json-2-csv');

var $resultNumber = $('#resultsInput');
var $beginConversionButton = $('#beginConversionButton');

var options = {
  KEYS: ['Query', 'Rank', 'ResultType', 'Url'],
  PREPEND_HEADER: true,
  CHECK_SCHEMA_DIFFERENCES: false
};

var userDefaults = {
  resultNumber: 10,
  readPath: null,
  writePath: null,
  firstFile: true
}

function isJson(file) {
  return path.extname(file) == '.json';
};

$beginConversionButton.on('click', function() {
  if(!$jsonFolder.val() || !$csvFolder.val()) {
    alert('Please ensure proper selection of both "read" AND "write" directories');
    return;
  };
  prepConvert();
});

function prepConvert() {
  userDefaults.readPath = $jsonFolder.val() + '/';
  userDefaults.writePath = $csvFolder.val() || csvName;
  userDefaults.resultNumber = $resultNumber.val() || userDefaults.resultNumber;
  $resultNumber.text(userDefaults.resultNumber.toString());
  if(userDefaults.writePath.charAt(userDefaults.writePath.length - 4) != '.') userDefaults.writePath += '.csv';
  $beginConversionButton.text('Processing JSON ...');
  startConversion();
}

function startConversion() {
  fs.readdir(userDefaults.readPath, readDirCallback);
};

function readDirCallback (err, userFiles) {
  if (err) throw err;
  // Only grab .json extension
  let jsonFiles = userFiles.filter(isJson);
  // Check to confirm JSON files are present in the directory
  if (jsonFiles) {
    jsonFiles.forEach(readConvertWrite);
  } else {
      $beginConversionButton.text('This JSON folder has no JSON files');
      return;
    }
  $beginConversionButton.text('Processed ' + jsonFiles.length + ' files');
};

function readConvertWrite (element, index, array) {
  // The 'query' is based on filename and is not currently present:
  let query = element.slice(0,-5).split(/\s*-/).join('');
  let resultsPerJson = JSON.parse(fs.readFileSync(userDefaults.readPath + element, 'utf8')).Response.Result;
  // Keep results per query limited to user's preference:
  if (resultsPerJson.length >= userDefaults.resultNumber) resultsPerJson.length = userDefaults.resultNumber;
  resultsPerJson.forEach(function(element, index, array) {
    // Attach the new Query column to each result:
    array[index].Query = query;
  });
  if (index > 0) userDefaults.firstFile = false;
  converter.json2csv(resultsPerJson, json2csvCallback, options);
};

function json2csvCallback(err, csv) {
  if (err) throw err;
  fs.appendFile(userDefaults.writePath, csv, function (err) {
    if (err) throw err;
  });
  userDefaults.firstFile ? options.PREPEND_HEADER = true : options.PREPEND_HEADER = false;
};
