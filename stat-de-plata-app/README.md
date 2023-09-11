# test-app
## *Prerequisites*
* Make sure you have NodeJS globally installed, if not go to https://nodejs.org/en/download/ and download the latest version
* Install WINDOWS REDIS
  * Open this github link - https://github.com/zkteco-home/redis-windows/releases/tag/redis7.0.5
  * Download and run redis-server.exe
* Install PostgreSQL on local machine
  * Go to https://www.postgresql.org/download/windows/
  * Click on download the installer
  * Follow the default installation steps
  * Make sure to remember / note the master password
  * Leave the default 5432 port
* Install PGAdmin on local machine
  * Go to https://www.pgadmin.org/download/pgadmin-4-windows/
  * Download and install the lastest version of PGAdmin 4
  * Make sure to remember / note the credentials asked for authentication

## * Server setup *
* Setup .env file with following settings:
  ```
  PORT=8080
  NODE_ENV=dev
  DATABASE_URL=postgres://postgres:POSTGRES_PASSWORD@localhost:5432/persons
  RUN_CRON=true
  ```
* In .env file make sure to replace POSTGRESQL_PASSWORD with the password you set up on PostgreSQL installation
* Install globally nodemon
  * npm install nodemon@2.0.7 -g
* In the root folder
  * Execute the command npm install (all server dependencies should install successfully)
  * Execute the command nodemon
  * If everything is ok, you should see in the console the following message:
  ```javascript
    λ nodemon
    [nodemon] 2.0.7
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node ./server/app.js`
    Database connection successfully.
    Listening on port: 8080, env: dev
  ```

## *Client setup *
* Install angular cli globally
  * npm install -g @angular/cli
* Navigate to project/client
  * Execute the command npm install (all client dependencies should install successfully)
  * In the same client folder, execute the command npm start
  * If everything is ok, you should see in the console the following message:
  ```javascript
    λ npm start

    > test-app@0.0.0 start C:\Proiecte\test-app\client
    > ng serve

    √ Browser application bundle generation complete.

    Initial Chunk Files   | Names         |      Size
    vendor.js             | vendor        |   4.93 MB
    styles.css, styles.js | styles        | 401.44 kB
    polyfills.js          | polyfills     | 339.13 kB
    main.js               | main          |  63.41 kB
    runtime.js            | runtime       |   7.07 kB

                          | Initial Total |   5.72 MB

    Build at: 2021-11-05T12:55:50.984Z - Hash: 5286c543f6d25b2c - Time: 5989ms

    ** Angular Live Development Server is listening on localhost:3000, open your browser on http://localhost:3000/ **


    √ Compiled successfully.
  ```