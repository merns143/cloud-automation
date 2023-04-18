Cloud Automation
=======================

Cloudflare related automation tools

Installation
---------

```
git clone git@gitlab.com:donald3/cloud-automation.git

# Change directory
cd cloud-automation

# Install NPM dependencies
npm install

# Run NPM
node ./bin/www

The app will then be running on port 3000.
e.g. http://localhost:3000

# Deployment

Install heroku (If you already installed heroku, please skip this step)
`npm i -g heroku`

Login to heroku cli so that we can push the changes
`heroku login -i` - input email and password (found in lastpass)

Make sure that the project git heroku url is added on the remote. If not, do command below.
`git remote add heroku https://git.heroku.com/cloud-automation.git`

Commit your changes and push to heroku/production (but first push to our own repo)
`git push heroku master`

```

Cloud-automation Features
=======================
1. Home - Blank page, Button to down all domains in cloudflare 'EXPORT ALL DOMAINS'
2. Add Domain - Add multiple domains (separated by new line) to cloudflare
3. Add DNS - Add DNS records for a domain
    3a. Single - Add DNS records to a domain. Choose a specific domain in the dropdown and then add DNS names (separated by new line) and coresponding data
    3b. Multiple - Add multiple DNS records on a multiple domain. Add DNS record full name (e.g. {dns_name}.{domain}, separated by new line)
        - Note: You can add or input 'test.domain.com' and 'test2.domain2.com' at the same time
4. Add Group - Add multiple domains (separated by new line) to cloudflare and then you can add DNS records for each domain added
5. Uptime Check - Check list of domains if it is up or not.
    - Accepted status codes: 200, 301, 302, 404
6. Safebrowsing - Monitoring page for our safebrowsing service
    6a. Status  - Check for Available and Broken (down or flagged) domains in our safebrowsing database
                - Add replacement domains
                - View safebrowsing logs
                - Download domains in the database with broken flag
                - Restart Safebrowsing server
    6b. Credentials - Add or remove google safebowsing token
                    - Update Voluum access id and access key
7. Tracking Domains - Monitoring page for our tracking domains
    7a. Status  - Check for Ok and Broken (flagged) tracking domains in our tracking domain database
                - Add tracking domains
                - View safebrowsing logs
                - Download tracking domains in the database with broken flag
    7b. Credentials - Add or remove google safebowsing token
8. Domain Check - Check list of domains in a csv file for safebrowsing flagged
    - Noted: Make sure to follow the format same with the downloaded csv file in the link below
        - https://cloud-automation.herokuapp.com/api/domain-file-check/default-file
9. Domain Analytics - Check list of domains analytics data (all requests)
10. Geo - Get Language List from country name/code list
11. Disable SSL - Check or Disable cloudflare domains universal SSL
12. Speech to Text -  Transcribe Flac audio file into text
                   -  Text files are uploaded to FTP
13. App Search - Search Android and IOS apps base on the terms provided
               - Create CSV File with the apps information
               - CSV Files are uploaded to FTP
14. Keyword Watcher - Search every given keywords everyday at flippa.com
                    - Search results vary dependes on the Property Type selected per keyword
                    - Alert Message sent via Slack everytime there is a new id/link related to each keyword