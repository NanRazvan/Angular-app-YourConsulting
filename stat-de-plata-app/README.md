# Payment-Statements-app
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
  DATABASE_URL=postgres://postgres:POSTGRES_PASSWORD@localhost:5432/stat-de-plata-db
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

 ## *Componets: *

1. **Expenses**:
   - Displays a table with columns: Superior, Name, Paragraph, Last Level.
   - Provides icons for editing and deleting expenses.
   - Allows modification of expenses in a modal.
   - Supports real-time table refresh after an expense is deleted.
   - Opens a modal for adding expenses with fields: Superior (integer), Name (string, max length 255), Paragraph (string, max length 20), Last Level (boolean).
   - Implements form validation for mandatory fields (Name and Paragraph).
   - Saves expenses to the database on "Add" and refreshes the table.
   - Supports table filtering with data preservation.
   - Enables selection of a superior expense ID from a dropdown.

2. **Activities**:
   - Displays a table with columns: Name, Code, Last Level.
   - Provides icons for editing and deleting activities.
   - Allows modification of activities in a modal.
   - Supports real-time table refresh after an activity is deleted.
   - Opens a modal for adding activities with fields: Superior (integer), Name (string, max length 255), Code (string, max length 20), Last Level (boolean).
   - Implements form validation for mandatory fields (Name and Code).
   - Saves activities to the database on "Add" and refreshes the table.
   - Supports table filtering with data preservation.
   - Enables selection of a superior activity ID from a dropdown.
   - Prevents deletion of activities used in payment statements.

3. **Salary Configuration**:
   - Displays a table with columns: Name, Economic Classification (Expense), Normal SDP, Total, Category (array).
   - Provides icons for editing and deleting configurations.
   - Allows modification of configurations in a modal.
   - Supports real-time table refresh after a configuration is deleted.
   - Opens a modal for adding configurations with fields: Name (max length 255), Economic Classification (integer, max length 255), Normal SDP (boolean), Total (boolean), Category (mandatory array).
   - Implements form validation for mandatory fields (Name and Category).
   - Saves configurations to the database on "Add" and refreshes the table.
   - Supports table filtering with data preservation.

4. **Payment Statements**:
   - Displays a table with columns: Month, Payment Statement Name, Activity, Obligation Date, Advances Date, Transfer Date, Cash Date, Contributions Date.
   - Provides icons for editing and deleting payment statements.
   - Allows modification of payment statements in a modal.
   - Supports real-time table refresh after a payment statement is deleted.
   - Groups payment statements by month.
   - Implements validation to disallow negative values.
   - Calculates horizontal and vertical totals based on category.
   - Prompts for data saving when changing activities.
   - Utilizes two tables (Salary and SalaryData) to store data.
   - Automatic population of sums in SalaryData from configurations.
   - Prevents database storage of rows without sums.

## Backend

The backend supports CRUD (Create, Read, Update, Delete) operations for the following tables:

- **Outgoings**: Expenses management.
- **Activity**: Activities management.
- **SalaryConfig**: Salary configuration management.
- **Salary** and **SalaryData**: Payment statement and related data.
- Deletion of a payment statement (Salary) also deletes its corresponding data rows (SalaryData).

### Table Columns

- **Outgoings**: id_superior, name, paragraph, last_child.
- **Activity**: name, code, last_child.
- **SalaryConfig**: name, id_outgoing, normal, total, category.
- **Salary**: month, name, id_activity, obligation_date, advances_date, transfer_date, cash_date, contributions_date.
- **SalaryData**: id_salary, id_salary_config, total, clerk, contract, others.
