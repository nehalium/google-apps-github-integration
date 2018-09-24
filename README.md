# google-apps-github-integration
Google Apps script to pull data from Github

## Installation ##
1. Pull files from repo
1. Create a file called config.gs with the following contents:

```
var Config = {
  github: {
    url: 'https://api.github.com/graphql',
    token: 'ADD API TOKEN HERE'
  }
};
```
