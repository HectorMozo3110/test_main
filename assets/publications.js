document.addEventListener("DOMContentLoaded", async () => {
  const menu = document.getElementById("hamburger-menu");

  if (!menu) return;

  try {
    const projects = await fetch("/assets/projects.json").then(res => res.json());
    let html = "";

    for (const project of projects) {
      const { name, folder } = project;

      const basePath = `/papers/${folder}/`;

      const infoURL = await checkFile(basePath + "project_info.md");
      const versionsURL = await checkFile(basePath + "versions.md");
      const publicationsURL = await checkFile(basePath + "publications.md");

      if (infoURL || versionsURL || publicationsURL) {
        html += `<div class="project-block"><strong>${name}</strong>`;

        // 🧪 Project Info
        if (infoURL) {
          html += `<a href="/test_main/papers/viewer.html?project=${folder}">🧪 Project Info</a>`;
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

  
  async function checkFile(url) {
    try {
      const res = await fetch(url);
      return res.ok ? url : null;
    } catch {
      return null;
    }
  }

  
  async function extractLinks(mdUrl) {
    try {
      const res = await fetch(mdUrl);
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


  window.toggleHamburgerMenu = function () {
    const menu = document.getElementById("hamburger-menu");
    if (menu) {
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
  };
});
