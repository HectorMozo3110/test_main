// Load and render papers using markdown-it with KaTeX, footnotes, and dynamic images
document.addEventListener("DOMContentLoaded", async () => {
  const papersContainer = document.getElementById("papers");

  // Dynamically compute base path from current URL
  const BASE_PATH = window.location.pathname.split("/").slice(0, 2).join("");
  const configPath = `${BASE_PATH}/assets/settings.json`;

  // Load GitHub username from external settings.json
  const config = await fetch(configPath).then(res => res.json());
  const USER_NAME = config.github_username;

  // Initialize markdown-it with footnotes and HTML support
  const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true
  }).use(window.markdownitFootnote);

  try {
    // Fetch all public repositories from the GitHub user
    const repoResponse = await fetch(`https://api.github.com/users/${USER_NAME}/repos`);
    const repos = await repoResponse.json();

    for (const repo of repos) {
      const repoName = repo.name;
      const paperUrl = `https://raw.githubusercontent.com/${USER_NAME}/${repoName}/main/paper/paper.md`;

      try {
        const paperRes = await fetch(paperUrl);
        if (!paperRes.ok) continue;

        let markdownText = await paperRes.text();

        // Replace relative image paths with full GitHub URLs and apply image width if defined
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

        // Create a container card for the paper
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
    papersContainer.innerHTML = "<p>Error loading papers. Try again later.</p>";
    console.error(err);
  }
});
