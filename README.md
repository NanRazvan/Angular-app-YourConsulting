# Angular-app-YourConsulting

## Project Description

This Angular project is designed to streamline the management of payment statements through a user-friendly interface. It consists of four primary components accessible via the header navigation menu:

### Components

#### 1. Expenses
   - Manage expense categories, including editing, deleting, and adding expenses.
   - Organize expenses hierarchically with the ability to filter by categories.
   - Supports real-time table refresh after expense modification.
   - Modal for adding expenses with mandatory fields.
   - Form validation and table filtering.

#### 2. Activities
   - Administer activities, including editing, deleting, and adding capabilities.
   - Maintain the hierarchical structure of activities with filtering options.
   - Prevent deletion of activities used in payment statements.

#### 3. Salary Configuration
   - Configure salary components and categories.
   - Validation and filtering of configurations.
   - Mandatory fields and real-time table refresh.

#### 4. Payment Statements
   - Efficiently handle payment statements grouped by month.
   - Calculate totals, save data, and prompt for data saving when changing activities.
   - Automatic data population from configurations.
   - Prevent storage of rows without sums.

## Backend

The backend supports CRUD (Create, Read, Update, Delete) operations for the following tables:

- **Outgoings**: Manage expenses.
- **Activity**: Manage activities.
- **SalaryConfig**: Configure salary components.
- **Salary** and **SalaryData**: Manage payment statements and related data. Deletion of a payment statement also removes corresponding data rows.

### Table Columns

- **Outgoings**: id_superior, name, paragraph, last_child.
- **Activity**: name, code, last_child.
- **SalaryConfig**: name, id_outgoing, normal, total, category.
- **Salary**: month, name, id_activity, obligation_date, advances_date, transfer_date, cash_date, contributions_date.
- **SalaryData**: id_salary, id_salary_config, total, clerk, contract, others.
