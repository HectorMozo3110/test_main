document.addEventListener("DOMContentLoaded", async () => {
  const githubUser = "HectorMozo3110";
  const menu = document.getElementById("hamburger-menu");

  if (!menu) return;

  try {
    const repos = await fetch(`https://api.github.com/users/${githubUser}/repos`).then(res => res.json());
    let html = "";

    for (const repo of repos) {
      const repoName = repo.name;

      const infoURL = await getDownloadURL(githubUser, repoName, "project_info.md");
      const versionsURL = await getDownloadURL(githubUser, repoName, "versions.md");
      const publicationsURL = await getDownloadURL(githubUser, repoName, "publications.md");

      if (infoURL || versionsURL || publicationsURL) {
        console.log(`[${repoName}] ✅ Files found:`, {
          info: !!infoURL,
          versions: !!versionsURL,
          publications: !!publicationsURL
        });

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
    console.error("Hamburger menu error:", err);
    menu.innerHTML = `<div style="padding:10px">Error loading menu.</div>`;
  }

  // ✅ Get the download URL from GitHub API (not raw.github)
  async function getDownloadURL(user, repo, file) {
    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/paper/${file}`;
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) return null;
      const json = await res.json();
      return json.download_url || null;
    } catch {
      return null;
    }
  }

  // ✅ Extract links from markdown via direct content
  async function extractLinks(downloadUrl) {
    try {
      const res = await fetch(downloadUrl);
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

  // ✅ Toggle visibility of the menu
  window.toggleHamburgerMenu = function () {
    const menu = document.getElementById("hamburger-menu");
    if (menu) {
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
  };
});
