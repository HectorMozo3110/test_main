// =============================================
// 🧠 LOAD AND RENDER PAPERS FROM paper.md
// =============================================
document.addEventListener("DOMContentLoaded", async () => {
  const USER_NAME = "HectorMozo3110";
  const papersContainer = document.getElementById("papers");

  // Initialize markdown-it with footnote and HTML support
  const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true
  }).use(window.markdownitFootnote);

  try {
    const repoResponse = await fetch(`https://api.github.com/users/${USER_NAME}/repos`);
    const repos = await repoResponse.json();

    for (const repo of repos) {
      const repoName = repo.name;
      const paperUrl = `https://raw.githubusercontent.com/${USER_NAME}/${repoName}/main/paper/paper.md`;

      try {
        const paperRes = await fetch(paperUrl);
        if (!paperRes.ok) continue;

        let markdownText = await paperRes.text();

        // Replace relative image paths with absolute GitHub URLs and apply width if defined
        markdownText = markdownText.replace(
          /!\[([^\]]*)\]\(([^)]+)\)(\{[^}]+\})?/g,
          (match, alt, src, attrs) => {
            const fullUrl = `https://raw.githubusercontent.com/${USER_NAME}/${repoName}/main/paper/${src}`;
            let style = '';
            if (attrs && attrs.includes("width=")) {
              const width = attrs.match(/width=([0-9]+%?)/)?.[1];
              if (width) {
                style = ` style="max-width:${width}; height:auto;"`;
              }
            }
            return `<img alt="${alt}" src="${fullUrl}"${style} />`;
          }
        );

        const htmlContent = md.render(markdownText);

        const card = document.createElement("div");
        card.classList.add("paper-card");
        card.innerHTML = `
          <h2>${repoName}</h2>
          <div class="paper-content">
            ${htmlContent}
          </div>
          <p>
            <a class="read-more-link" href="/test_main/papers/viewer.html?repo=${repoName}">
              Read Full Paper →
            </a>
          </p>
          <hr/>
        `;

        papersContainer.appendChild(card);

        // Trigger KaTeX rendering for math formulas
        renderMathInElement(card, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ]
        });
      } catch (err) {
        console.warn(`Could not fetch paper for ${repoName}:`, err);
      }
    }
  } catch (err) {
    if (papersContainer)
      papersContainer.innerHTML = "<p>Error loading papers. Please try again later.</p>";
    console.error(err);
  }

  // =============================================
  // 🍔 HAMBURGER MENU: LOAD PROJECTS FROM ORG
  // =============================================

  const githubOrg = "Neureonmindflux-Research-Lab";
  const menu = document.getElementById('hamburger-menu');

  if (menu) {
    try {
      const repos = await fetch(`https://api.github.com/orgs/${githubOrg}/repos`)
        .then(res => res.json());

      let html = "";

      for (const repo of repos) {
        const repoName = repo.name;
        const basePath = `https://raw.githubusercontent.com/${githubOrg}/${repoName}/main/paper/`;

        const infoURL = await checkFile(basePath + "project_info.md");
        const versionsURL = await checkFile(basePath + "versions.md");
        const publicationsURL = await checkFile(basePath + "publications.md");

        if (infoURL || versionsURL || publicationsURL) {
          html += `<strong style="display:block; padding:8px; background:#eee;">${repoName}</strong>`;
          if (infoURL)
            html += `<a href="#" onclick="loadMarkdown('${infoURL}'); return false;">🧪 Project Info</a>`;
          if (versionsURL)
            html += `<a href="${versionsURL}" target="_blank">📦 Versions</a>`;
          if (publicationsURL)
            html += `<a href="${publicationsURL}" target="_blank">📄 Publications</a>`;
        }
      }

      menu.innerHTML = html || `<div style="padding:10px">No valid projects found.</div>`;
    } catch (err) {
      menu.innerHTML = `<div style="padding:10px">Error loading menu.</div>`;
      console.error("Hamburger menu error:", err);
    }
  }

  // Utility: check if a file exists
  async function checkFile(url) {
    try {
      const res = await fetch(url);
      return res.ok ? url : null;
    } catch {
      return null;
    }
  }

  // Load and render markdown content in the same page
  window.loadMarkdown = async function(url) {
    const res = await fetch(url);
    const mdText = await res.text();
    const container = document.getElementById("content-area");
    if (container) container.innerHTML = window.marked.parse(mdText);
  };

  // Toggle menu visibility
  window.toggleHamburgerMenu = function () {
    const menu = document.getElementById('hamburger-menu');
    if (!menu) return;
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  };
});
