// Global constants
var SHEET_DATA = "Data";

var Appender = (function() {
  // Public members  
  var appender = {};
  appender.append = append;
  return appender;
  
  // Private members
  function append(items) {
    var values = buildTable(items);
    var sheet = getSheetReference();
    for (var i=0; i<values.length; i++) {
      sheet.appendRow(values[i]);
    }
  }
  
  // Returns a table based on the data specified
  function buildTable(items) {
    var values = [];
    var row = [];
    var timeStamp = getTimeStamp();
    for (var i=0; i<items.length; i++) {
      row = [];
      row.push(items[i].name);
      row.push(items[i].pr_count);
      row.push(Utilities.formatDate(new Date(), 'Etc/GMT', 'yyyy-MM-dd'));
      row.push(timeStamp);
      values.push(row);
    }
    return values;
  }
  
  // Returns a timestamp
  // e.g. 2018-09-12T12:00:00.000Z
  function getTimeStamp() {
    return Utilities.formatDate(new Date(), 'Etc/GMT', 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'')
  }
  
  // Returns a reference to the active sheet
  function getSheetReference() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    return spreadsheet.getSheetByName(SHEET_DATA);
  }
})()