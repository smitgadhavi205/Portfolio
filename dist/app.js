'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const chart = document.querySelector('.contribution-chart');
chart.addEventListener('error', () => { chart.hidden = true; document.querySelector('.chart-fallback').hidden = false; });
const dateFormat = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });
async function loadActivity() {
  try {
    const response = await fetch('https://api.github.com/repos/utcsmith/boyzneed/commits?per_page=1', { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('GitHub unavailable');
    const commits = await response.json();
    if (!commits.length) return;
    const commit = commits[0];
    const link = document.getElementById('commit-link');
    link.href = commit.html_url;
    link.textContent = `boyzneed · ${commit.commit.message.split('\n')[0]}`;
    document.getElementById('commit-date').textContent = dateFormat.format(new Date(commit.commit.committer.date));
    document.getElementById('latest').hidden = false;
    document.getElementById('sync-status').textContent = 'Repository activity synced from GitHub';
  } catch { document.getElementById('sync-status').textContent = 'Explore contributions on GitHub ↗'; }
}
loadActivity();
