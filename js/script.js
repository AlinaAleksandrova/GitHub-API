async function getGitHubProfile() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter a GitHub username');
        return;
    }

    const userInfo = document.querySelector('.user-info');
    const repoList = document.querySelector('.repo-list');

    userInfo.innerHTML = 'Loading...';
    repoList.innerHTML = '';

    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('User not found');
        const userData = await userResponse.json();

        userInfo.innerHTML = `
            <h2>${userData.name || ''} (@${userData.login})</h2>
            <img src="${userData.avatar_url}" alt="${userData.name || ''}" width="150">
            <p>${userData.bio || 'No bio available'}</p>
            <p><strong>Public Repos:</strong> ${userData.public_repos}</p>
            <p><strong>Followers:</strong> ${userData.followers}</p>
            <p><strong>Following:</strong> ${userData.following}</p>
        `;

        const reposResponse = await fetch(userData.repos_url);
        if (!reposResponse.ok) throw new Error('Error fetching repositories');
        const reposData = await reposResponse.json();

        if (reposData.length === 0) {
            repoList.innerHTML = '<p>No repositories found</p>';
        } else {
            repoList.innerHTML = '<h3>Repositories:</h3>';
            reposData.forEach(repo => {
                repoList.innerHTML += `
                    <div class="repo">
                        <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                        <p>${repo.description || 'No description available'}</p>
                        <p><strong>Stars:</strong> ${repo.stargazers_count} | <strong>Forks:</strong> ${repo.forks_count}</p>
                    </div>
                `;
            });
        }
    } catch (error) {
        userInfo.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}