CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    public_repos INT DEFAULT 0,
    company VARCHAR(255),
    location VARCHAR(255),
    top_language VARCHAR(100),
    total_stars INT DEFAULT 0,
    activity_score INT DEFAULT 0,
    account_created_at DATETIME,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE repo_insights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    repo_name VARCHAR(255) NOT NULL,
    language VARCHAR(100),
    stars INT DEFAULT 0,
    forks INT DEFAULT 0,
    is_forked BOOLEAN DEFAULT FALSE,
    description TEXT,
    last_updated DATETIME,
    FOREIGN KEY (profile_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE
);