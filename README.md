# Employee Management App

Simple employee management system built with Lit web components

## What it does?

manages employee records - you can add, edit, delete and search through employees. has both table and grid views, pagination, filters etc.

## Techs

- Lit 3.2.0 - web components library
- Vaadin Router - for routing between pages
- vanilla js
- localStorage - persistance
- iconify - for icons (lucide)

## setup

first install dependencies:

```bash
npm install
```

then start dev server:

```bash
npm run serve
```

Open http://localhost:8000

## Features

### Employee Management

- add new employees with all details
- edit existing employee info
- delete employees (with confirmation)
- form validation for emails, phone numbers etc

### Search and Filters

- search by name, email or phone
- filter by department (Analytics, Tech)
- filter by position (Junior, Medior, Senior)
- can use multiple filters at once

### Views

- table view - classic spreadsheet style
- grid view - card based layout
- both responsive for mobile

### Other Features

- pagination (10, 25, 50 items per page)
- language switch (Turkish/English)
- bulk operations (select multiple, delete all)
- seed data button to populate with test data

## Project Structure

```
src/
  components/
    app-container.js       - main app shell
    nav-menu.js           - navigation bar
    employee-list.js      - list/grid view
    employee-form.js      - add/edit form
    confirm-dialog.js     - confirmation popup
    pagination-controls.js - pagination component
  store/
    employee-store.js     - data management & localStorage
  i18n/
    translations.js       - turkish/english texts
  utils/
    validators.js         - email, phone validation
    date-formatter.js     - date formatting helper
    seed-data.js         - test data generator
    icons.js             - icon mappings
```

## How it Works

data is stored in browser's localStorage, so it persists between sessions. when you first load the app, you can click "seed data" to populate it with some test employees.

routing handles navigation between list view (/), add form (/add), and edit form (/edit/:id).

language preference is also saved to localStorage, so if you switch to turkish it stays turkish next time you visit.
