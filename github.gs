var Github = (function() {
  // Public members  
  var github = {};
  github.getData = getData;
  return github;
  
  // Private members
  function getData() {
    var items = [];
    var count = 0;
    var prCount = 0;
    
    var cursor = '';
    var iteration = 0;
    var result = '';
    var repos = 0;
    
    while(true) {
      iteration++;
      result = executeQuery(getQuery(100, cursor));
      repos = result.data.organization.repositories.edges;
      
      if (repos.length == 0) {
        break;
      }

      for(var i=0; i<repos.length; i++) {
        count++;
        prCount += repos[i].node.pullRequests.totalCount;
        cursor = repos[i].cursor;
        items.push(buildTuple(repos[i]));
      }
    }

    items.sort(function(x, y) {
      var x = x.pr_count;
      var y = y.pr_count;
      return x == y ? 0 : x < y ? 1 : -1;
    }); 
    
    return {
      count: count,
      pr_count: prCount,
      items: items
    };
  }

  // Returns an object with the fields in item we are interested in
  function buildTuple(item) {
    var hasNodes = item.node.pullRequests.nodes.length > 0;
    return {
      name: item.node.name,
      pr_count: item.node.pullRequests.totalCount,
      oldest_pr: {
        number: (hasNodes) ? item.node.pullRequests.nodes[0].number : '',
        title: (hasNodes) ? item.node.pullRequests.nodes[0].title : '',
        createdAt: (hasNodes) ? item.node.pullRequests.nodes[0].createdAt : ''
      }
    };
  }
  
  // Calls the API and returns the result
  function executeQuery(query) {
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + Config.github.token
      }
    }; 
    options.payload = query;
    var response = UrlFetchApp.fetch(Config.github.url, options);
    var json = response.getContentText();
    return JSON.parse(json);
  }
  
  // Constructs the graphql query
  function getQuery(numItems, cursor) {
    var template = getBaseQuery();
    var first = 'first: ' + numItems;
    var after = (cursor !== '') ? ', after: "' + cursor + '"' : '';
    template = template.replace('first: 100', first + after);
    return JSON.stringify({ query: template });
  }
  
  // Returns the base graphql query for Github
  function getBaseQuery() {
    return "{\
      organization(login: lessonnine) {\
        repositories(first: 100, orderBy: {field: NAME, direction: ASC}) {\
          edges {\
            cursor\
              node {\
                name\
                pullRequests(states: OPEN, first: 1, orderBy: {field: CREATED_AT, direction: ASC}) {\
                  totalCount\
                  nodes {\
                    number\
                    title\
                    createdAt\
                    author {\
                      login\
                    }\
                  }\
                }\
              }\
            }\
          }\
        }\
      }";
  }
})()