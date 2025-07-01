// Load and render papers using markdown-it with KaTeX, footnotes, and dynamic images
document.addEventListener("DOMContentLoaded", async () => {
  const papersContainer = document.getElementById("papers");

  // Load GitHub username and base path from external JSON configuration
  const config = await fetch("/assets/settings.json").then(res => res.json());
  const USER_NAME = config.github_username;
  const BASE_PATH = config.base_path || "";  // Optional if site is root-based

  // Initialize markdown-it with footnotes and HTML rendering enabled
  const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true
  }).use(window.markdownitFootnote);

  try {
    // Get all public repositories from GitHub user
    const repoResponse = await fetch(`https://api.github.com/users/${USER_NAME}/repos`);
    const repos = await repoResponse.json();

    for (const repo of repos) {
      const repoName = repo.name;
      const paperUrl = `https://raw.githubusercontent.com/${USER_NAME}/${repoName}/main/paper/paper.md`;

      try {
        const paperRes = await fetch(paperUrl);
        if (!paperRes.ok) continue;

        let markdownText = await paperRes.text();

        // Replace relative image links with full GitHub raw URLs
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

        // Create a visual card for each paper
        const card = document.createElement("div");
        card.classList.add("paper-card");
        card.innerHTML = `
          <h2>${repoName}</h2>
          <div class="paper-content">
            ${htmlContent}
          </div>
          <p>
            <a class="read-more-link" href="${BASE_PATH}/papers/viewer.html?repo=${repoName}">
              Read Full Paper →
            </a>
          </p>
          <hr/>
        `;

        papersContainer.appendChild(card);

        // Render math formulas with KaTeX
        renderMathInElement(card, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ]
        });

      } catch (err) {
        console.warn(`Could not load paper from ${repoName}:`, err);
      }
    }
  } catch (err) {
    papersContainer.innerHTML = "<p>Error loading papers. Try again later.</p>";
    console.error(err);
  }
});
