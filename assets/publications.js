document.addEventListener("DOMContentLoaded", async () => {
  const githubUser = "HectorMozo3110";
  const menu = document.getElementById("hamburger-menu");

  if (!menu) return;

  try {
    const repos = await fetch(`https://api.github.com/users/${githubUser}/repos`).then(res => res.json());
    let html = "";

    for (const repo of repos) {
      const repoName = repo.name;
      const baseApi = `https://api.github.com/repos/${githubUser}/${repoName}/contents/paper/`;

      const infoURL = await getRawFromGitHub(baseApi + "project_info.md");
      const versionsURL = await getRawFromGitHub(baseApi + "versions.md");
      const publicationsURL = await getRawFromGitHub(baseApi + "publications.md");

      if (infoURL || versionsURL || publicationsURL) {
        console.log(`[${repoName}] project_info: ${!!infoURL}, versions: ${!!versionsURL}, publications: ${!!publicationsURL}`);
        html += `<div class="project-block"><strong>${repoName}</strong>`;

        // 🧪 Project Info
        if (infoURL) {
          html += `<a href="/test_main/papers/viewer.html?repo=${repoName}">🧪 Project Info</a>`;
        }

        // 📦 Versions
        if (versionsURL) {
          const versionLinks = await extractLinks(versionsURL);
          if (versionLinks.length > 0) {
            html += `<div class="submenu"><span>📦 Versions</span>`;
            versionLinks.forEach(link => {
              html += `<a href="${link.href}" target="_blank">↳ ${link.text}</a>`;
            });
            html += `</div>`;
          }
        }

        // 📄 Publications
        if (publicationsURL) {
          const pubLinks = await extractLinks(publicationsURL);
          if (pubLinks.length > 0) {
            html += `<div class="submenu"><span>📄 Publications</span>`;
            pubLinks.forEach(link => {
              html += `<a href="${link.href}" target="_blank">↳ ${link.text}</a>`;
            });
            html += `</div>`;
          }
        }

        html += `</div><hr/>`;
      }
    }

    menu.innerHTML = html || `<div style="padding:10px">No valid projects found.</div>`;
  } catch (err) {
    menu.innerHTML = `<div style="padding:10px">Error loading menu.</div>`;
    console.error("Hamburger menu error:", err);
  }

  // Get raw URL from GitHub API content endpoint
  async function getRawFromGitHub(apiUrl) {
    try {
      const res = await fetch(apiUrl, {
        headers: {
          Accept: "application/vnd.github.v3.raw"
          // Authorization: `token TU_TOKEN` // opcional, para privados
        }
      });
      return res.ok ? apiUrl : null;
    } catch {
      return null;
    }
  }

  // Extract [text](url) links from markdown content
  async function extractLinks(apiUrl) {
    try {
      const res = await fetch(apiUrl, {
        headers: {
          Accept: "application/vnd.github.v3.raw"
        }
      });
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

  // Toggle menu
  window.toggleHamburgerMenu = function () {
    const menu = document.getElementById('hamburger-menu');
    if (menu) {
      menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    }
  };
});
