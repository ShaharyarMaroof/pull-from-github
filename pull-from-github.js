const Github = require("github-api");
const fetch = require("node-fetch")
const CONFIG = require('./config');

/* 
  Initialize the Github client using the personal access token
*/
const gh = new Github({
  token: CONFIG.token
})

/**
 * Fetch the required repository for the username 
 *
 * @param {string} userName
 * @param {string} repoName
 * @returns
 */
const getRepo = async (userName, repoName) => {
  console.log('repo fetched')
  const repo = await gh.getRepo(userName, repoName)
  return repo
}

/**
 * calls the repository.getContents method to fetch the content for the paths provided
 *
 * @param {RepositoryObject} repo
 * @param {Object} config
 */
const getContentsFromRepo = async (repo, config) => {
  const {
    ref = 'master',
    path = '',
    raw = true,
    callback = (err, response) => { console.log("default cb response: ", response) }
  } = config

  repo.getContents(ref, path, raw, callback)
}

/**
 * Callback function to download the file from github
 *
 * @returns
 */
const downloadContentFromPath = () => {
  const headers = {
    Authorization: `token ${CONFIG.token}`
  }

  return async (err, response) => {
    if (err || !response) return
    console.log('response\n', response)

    console.log('<----->')
    console.log('<----->')
    console.log('<----->')
    console.log('<----->')

    fetch(response['download_url'], { headers })
      .then(async res => {
        console.log('fetch response', await res.text())
      })
      .catch(err => { throw new Error(err) })
  }
}

/* 
  - collection of the path names to fetch from the repo
  e.g. {
    "folderName": "path/on/github" 
  }
*/
const DIR_LIST = {
  appFile: "src/App.test.js"
}

const fetchFilesFromRepo = async () => {
  if (!CONFIG) throw new Error("No configuration file found.")

  const repo = await getRepo(CONFIG.username, CONFIG.repository)

  for (key in DIR_LIST) {
    console.log('folder key', key)
    console.log('path', DIR_LIST[key])
    console.log('-----')

    const config = {
      ref: 'master',
      path: DIR_LIST[key],
      raw: false,
      callback: downloadContentFromPath()
    }
    getContentsFromRepo(repo, config)
  }

}

fetchFilesFromRepo()