# KPI Management System

*WIF2003 Web Programming Assignment Owned By T1G6*

## Project Introduction

Our project is a web-based application designed to streamline the process of setting, tracking, and evaluating Key Performance Indicators (KPIs) within an organization. The system enables both managers and employees to collaborate effectively, offering transparency and clarity in performance measurement.

### Key Features

- **User Authentication**: Secure login and registration

* **Dashboard**: Visual analytics for KPI scores and achievements
* **KPI Management (Manager)**: Create, assign, update, and verify KPIs
* **KPI Submission (Staff)**: Track progress and submit evidence
* **Profile Management**: Update user information, change passwords, and manage account settings
* **Report Generation**: View and download detailed KPI reports

## Commit Convention for Front-End Development

### Commit Format

```
<type>(<scope>): <subject>
```

#### Type

Use one of the following `type` values:

* `feat`: A new feature
* `fix`: A bug fix
* `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
* `refactor`: A code change that neither fixes a bug nor adds a feature
* `perf`: A code change that improves performance
* `docs`: Documentation changes only
* `test`: Adding or updating tests
* `chore`: Maintenance tasks (build process, dependency updates, etc)
* `revert`: Revert to a previous commit

#### Scope

Use one of the following as a `scope`:

* `dashboard`
* `login`
* `register`
* `profile`
* `kpi-management`
* `kpi-verification`
* `my-kpi`
* `report`
* `styleguide`
* `setup`(for config or environment setup)

#### Subject

* Use the imperative mood: "add", not "added" or "adds"
* No period at the end
* Keep it concise (under 72 characters)

#### Example

* Dashboard Page
  * `feat(dashboard): add new KPI chart`
  * `style(dashboard): adjust card design for mobile view`
  * `fix(dashboard): fix chart rendering issue in Firefox`
* Profile Page
  * `feat(profile): add profile update form`
  * `style(profile): adjust form spacing and input field size`
  * `fix(profile): fix password update function`



## Commit Convention for Back-End Development

### Commit Format

```
<type>(<scope>): <subject>                   
```

#### Type

Use one of the following `type` values:

* `feat`: A new feature
* `fix`: A bug fix
* `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
* `refactor`: A code change that neither fixes a bug nor adds a feature
* `perf`: A code change that improves performance
* `docs`: Documentation changes only
* `test`: Adding or updating tests
* `chore`: Maintenance tasks (build process, dependency updates, etc)
* `revert`: Revert to a previous commit

#### Scope

Use one of the following as a `scope`:

* `auth`: user registration, login, logout, and JWT authentication
* `user`: user profile management and role-based access logic
* `kpi`: create, read, update, delete operations for KPI management
* `submission`: progress update and evidence submission by staff
* `verification`: manager-side verification or rejection of submissions
* `notification`: generation and management of system notifications
* `report`: generation and export of KPI reports (PDF, Excel, etc.)
* `dashboard`: analytics APIs for progress charts and summary stats
* `middleware`: authentication middleware, error handlers, logging tools
* `config`: database connection, environment setup, or app config files

#### Subject

* Use the imperative mood: "add", not "added" or "adds"
* No period at the end
* Keep it concise (under 72 characters)

#### Example

* Config/Middleware
  * `chore(config): setup MongoDB connection and environment config`
  * `feat(middleware): add global error handler middleware`
* Notification
  * `feat(notification): auto-generate notification when KPI is assigned`
  * `fix(notification): fix isRead toggle logic`

