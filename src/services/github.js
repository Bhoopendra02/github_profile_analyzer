const axios = require('axios');
require('dotenv').config();

const HEADER = {};

const GITHUB_BASE = 'https://api.github.com';

async function fetchUserProfile(username) {
    try{
        const response = await axios.get(
            `${GITHUB_BASE}/users/${username}`, 
                {headers: HEADER}
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error(`Github user '${username}' not found`);
        }

        if (error.response?.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        throw new Error(`Github API error: ${error.message}`);
    }      
}

async function fetchUserRepos(username) {
    try {
        const response = await axios.get(
            `${GITHUB_BASE}/users/${username}/repos`,
            {
                headers: HEADER,
                params: {
                    per_page: 100,
                    sort: 'updated',
                    type: 'public'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error(`Repo not found for '${username}' `);
            }
            throw new Error(`Github API error: ${error.message}`);
    }
}

function calculateTopLanguage(repos) {
    const langCount = {};

    repos.forEach(repo => {
        if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
    });

    if (Object.keys(langCount).length === 0) return null;

    return Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])[0][0];
}

function calculateActivityScore(profileData, repos) {
    const stars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    return(
        (stars * 2) +
        (profileData.public_repos * 1) + 
        (profileData.followers * 1.5)
    )
}

module.exports = {
    fetchUserProfile,
    fetchUserRepos,
    calculateTopLanguage,
    calculateActivityScore
}