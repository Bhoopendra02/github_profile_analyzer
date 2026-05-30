const db = require('../config/db');
const {
  fetchUserProfile,
  fetchUserRepos,
  calculateTopLanguage,
  calculateActivityScore
} = require('../services/github');


// POST /api/analyze/:username

async function analyzeProfile(req, res) {
  const { username } = req.params;

  try {
    
    const [githubProfile, repos] = await Promise.all([
      fetchUserProfile(username),  
      fetchUserRepos(username)     
    ]);


    const topLanguage    = calculateTopLanguage(repos);
    const activityScore  = calculateActivityScore(githubProfile, repos);
    const totalStars     = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    
    const [profileResult] = await db.execute(`
      INSERT INTO profiles
        (username, name, bio, avatar_url, followers, following,
         public_repos, company, location, top_language,
         total_stars, activity_score, account_created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        bio = VALUES(bio),
        followers = VALUES(followers),
        following = VALUES(following),
        public_repos = VALUES(public_repos),
        top_language = VALUES(top_language),
        total_stars = VALUES(total_stars),
        activity_score = VALUES(activity_score),
        analyzed_at = CURRENT_TIMESTAMP
    `, [
      githubProfile.login,
      githubProfile.name,
      githubProfile.bio,
      githubProfile.avatar_url,
      githubProfile.followers,
      githubProfile.following,
      githubProfile.public_repos,
      githubProfile.company,
      githubProfile.location,
      topLanguage,
      totalStars,
      activityScore,
      new Date(githubProfile.created_at)
    ]);

    
    let profileId;
    if (profileResult.insertId !== 0) {
      profileId = profileResult.insertId;  
    } else {
      
      const [rows] = await db.execute(
        'SELECT id FROM profiles WHERE username = ?', [username]
      );
      profileId = rows[0].id;
    }

    await db.execute(
      'DELETE FROM repo_insights WHERE profile_id = ?', [profileId]
    );

    
    const reposToStore = repos.filter(r => !r.fork || r.stargazers_count > 0);

    for (const repo of reposToStore) {
      await db.execute(`
        INSERT INTO repo_insights
          (profile_id, repo_name, language, stars, forks,
           is_forked, description, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        profileId,
        repo.name,
        repo.language,
        repo.stargazers_count,
        repo.forks_count,
        repo.fork,
        repo.description,
        new Date(repo.updated_at)
      ]);
    }

    
    return res.status(200).json({
      success: true,
      message: 'Profile analyzed and stored successfully',
      data: {
        username:       githubProfile.login,
        name:           githubProfile.name,
        bio:            githubProfile.bio,
        avatar_url:     githubProfile.avatar_url,
        followers:      githubProfile.followers,
        following:      githubProfile.following,
        public_repos:   githubProfile.public_repos,
        top_language:   topLanguage,
        total_stars:    totalStars,
        activity_score: Math.round(activityScore),
        location:       githubProfile.location,
        repos_stored:   reposToStore.length,
        analyzed_at:    new Date()
      }
    });

  } catch (error) {
   
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, error: error.message });
    }
   
    if (error.message.includes('rate limit')) {
      return res.status(429).json({ success: false, error: error.message });
    }
    
    console.error('analyzeProfile error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}



async function getAllProfiles(req, res) {
  try {
    const [profiles] = await db.execute(`
      SELECT
        id, username, name, avatar_url, followers,
        public_repos, top_language, total_stars,
        activity_score, location, analyzed_at
      FROM profiles
      ORDER BY activity_score DESC
    `);

    
    const summary = {
      total_profiles: profiles.length,
      most_followed:  profiles.reduce((a, b) => a.followers > b.followers ? a : b, {})?.username || null,
      most_stars:     profiles.reduce((a, b) => a.total_stars > b.total_stars ? a : b, {})?.username || null,
      top_languages:  [...new Set(profiles.map(p => p.top_language).filter(Boolean))]
    };

    return res.status(200).json({
      success: true,
      summary,
      data: profiles
    });

  } catch (error) {
    console.error('getAllProfiles error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}


async function getProfile(req, res) {
  const { username } = req.params;

  try {
    
    const [profiles] = await db.execute(
      'SELECT * FROM profiles WHERE username = ?', [username]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Profile '${username}' not found. Analyze it first via POST /api/analyze/${username}`
      });
    }

    const profile = profiles[0];

    const [repos] = await db.execute(
      'SELECT * FROM repo_insights WHERE profile_id = ? ORDER BY stars DESC',
      [profile.id]
    );

    return res.status(200).json({
      success: true,
      data: {
        ...profile,
        repositories: repos
      }
    });

  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}



async function deleteProfile(req, res) {
  const { username } = req.params;

  try {
    const [result] = await db.execute(
      'DELETE FROM profiles WHERE username = ?', [username]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: `Profile '${username}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Profile '${username}' deleted successfully`
    });

  } catch (error) {
    console.error('deleteProfile error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}


module.exports = {
  analyzeProfile,
  getAllProfiles,
  getProfile,
  deleteProfile
};