// Main entry point
function main() { 
  var data = Github.getData();
  Appender.append(data.items);
}
