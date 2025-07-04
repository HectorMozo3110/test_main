
document.addEventListener("DOMContentLoaded", async () => {
  const githubOrg = "HectorMozo3110";
  const menu = document.getElementById("hamburger-menu");

  if (!menu) return;

  try {
    const repos = await fetch(`https://api.github.com/orgs/${githubOrg}/repos`).then(res => res.json());
    let html = "";

    for (const repo of repos) {
      const repoName = repo.name;
      const base = `https://raw.githubusercontent.com/${githubOrg}/${repoName}/main/paper/`;

      const infoURL = await checkFile(base + "project_info.md");
      const versionsURL = await checkFile(base + "versions.md");
      const publicationsURL = await checkFile(base + "publications.md");

      if (infoURL || versionsURL || publicationsURL) {
        html += `<div class="project-block"><strong>${repoName}</strong>`;

        if (infoURL)
          html += `<a href="/test_main/papers/viewer.html?repo=${repoName}">🧪 Project Info</a>`;

        if (versionsURL) {
          const versionLinks = await extractLinks(versionsURL);
          html += `<div class="submenu"><span>📦 Versions</span>`;
          versionLinks.forEach(link => {
            html += `<a href="${link.href}" target="_blank">↳ ${link.text}</a>`;
          });
          html += `</div>`;
        }

        if (publicationsURL) {
          const pubLinks = await extractLinks(publicationsURL);
          html += `<div class="submenu"><span>📄 Publications</span>`;
          pubLinks.forEach(link => {
            html += `<a href="${link.href}" target="_blank">↳ ${link.text}</a>`;
          });
          html += `</div>`;
        }

        html += `</div><hr/>`;
      }
    }

    menu.innerHTML = html || `<div style="padding:10px">No valid projects found.</div>`;
  } catch (err) {
    menu.innerHTML = `<div style="padding:10px">Error loading menu.</div>`;
    console.error("Hamburger menu error:", err);
  }

  // Utility to check file existence
  async function checkFile(url) {
    try {
      const res = await fetch(url);
      return res.ok ? url : null;
    } catch {
      return null;
    }
  }

  // Utility to extract markdown links from a file
  async function extractLinks(url) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const links = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        links.push({ text: match[1], href: match[2] });
      }
      return links;
    } catch {
      return [];
    }
  }

  // Toggle button
  window.toggleHamburgerMenu = function () {
    const menu = document.getElementById('hamburger-menu');
    if (menu) {
      menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    }
  };
});
