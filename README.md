# pull-from-github
a simple example to pull files from github using the npm module github-api

# to run the script
npm run start

# config file
A config file is required to initialize the Github client and send calls to the Github API. Create a config in the root directory

```
const CONFIG = {
  token: YOUR_GITHUB_TOKEN,
  repository: REPO_NAME,
  username: USER_NAME
}

module.exports = CONFIG
```
