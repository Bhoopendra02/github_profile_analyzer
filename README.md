# GitHub Profile Analyzer API

## Project Overview

GitHub Profile Analyzer is a RESTful backend application built using Node.js, Express.js, MySQL, and the GitHub Public API.

The application fetches public GitHub profile information, analyzes repository statistics, generates useful developer insights, and stores the results in a MySQL database for future retrieval.

### Features

* Analyze any public GitHub profile using a username
* Fetch profile data from the GitHub API
* Store analyzed profile information in MySQL
* Calculate useful developer insights:

  * Followers Count
  * Following Count
  * Public Repository Count
  * Top Programming Language
  * Total Repository Stars
  * Activity Score
* Retrieve all analyzed profiles
* Retrieve a specific analyzed profile
* Delete analyzed profiles
* Store repository-level insights

---

## Tech Stack

* Node.js
* Express.js
* MySQL
* GitHub REST API
* Axios
* mysql2
* dotenv

---

## GitHub Repository

https://github.com/Bhoopendra02/github_profile_analyzer

---

## Live API URL

https://github-profile-analyzer-g3yk.onrender.com

---

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/Bhoopendra02/github_profile_analyzer.git
cd github_profile_analyzer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create MySQL Database

```sql
CREATE DATABASE github_analyzer;
```

### 4. Create Tables

Run the provided `schema.sql` file.

### 5. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=github_analyzer
```

### 6. Start Application

```bash
npm run dev
```

Server will start at:

```text
http://localhost:3000
```

---

## API Endpoints

### Analyze GitHub Profile

**POST**

```http
/api/analyze/:username
```

Example:

```http
POST /api/analyze/torvalds
```

---

### Get All Profiles

**GET**

```http
/api/profiles
```

Example:

```http
GET /api/profiles
```

---

### Get Single Profile

**GET**

```http
/api/profiles/:username
```

Example:

```http
GET /api/profiles/torvalds
```

---

### Delete Profile

**DELETE**

```http
/api/profiles/:username
```

Example:

```http
DELETE /api/profiles/torvalds
```

---

## Live API Examples

### Analyze Profile

```http
POST https://github-profile-analyzer-g3yk.onrender.com/api/analyze/torvalds
```

### Get All Profiles

```http
GET https://github-profile-analyzer-g3yk.onrender.com/api/profiles
```

### Get Single Profile

```http
GET https://github-profile-analyzer-g3yk.onrender.com/api/profiles/torvalds
```

### Delete Profile

```http
DELETE https://github-profile-analyzer-g3yk.onrender.com/api/profiles/torvalds
```

---

## Sample Response

```json
{
  "success": true,
  "message": "Profile analyzed and stored successfully",
  "data": {
    "username": "torvalds",
    "name": "Linus Torvalds",
    "followers": 236000,
    "public_repos": 8,
    "top_language": "C",
    "total_stars": 12345,
    "activity_score": 485000
  }
}
```

---

## Database Design

### profiles

Stores analyzed GitHub profile information.

Fields:

* id
* username
* name
* bio
* avatar_url
* followers
* following
* public_repos
* company
* location
* top_language
* total_stars
* activity_score
* account_created_at
* analyzed_at

### repo_insights

Stores repository-level insights.

Fields:

* id
* profile_id
* repo_name
* language
* stars
* forks
* is_forked
* description
* last_updated

---

## Tested Usernames

The following usernames were used during testing:

* torvalds
* Bhoopendra07

---

## Author

Bhoopendra Rajpoot
