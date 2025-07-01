// assets/publications.js

// Load and render papers using markdown-it with footnote support
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
    // Fetch all public repositories from the GitHub user
    const repoResponse = await fetch(`https://api.github.com/users/${USER_NAME}/repos`);
    const repos = await repoResponse.json();

    for (const repo of repos) {
      const repoName = repo.name;

      // Attempt to fetch the paper.md file from the /paper/ directory
      const paperUrl = `https://raw.githubusercontent.com/${USER_NAME}/${repoName}/main/paper/paper.md`;

      try {
        const paperRes = await fetch(paperUrl);
        if (!paperRes.ok) continue;

        let markdownText = await paperRes.text();

        // Rewrite relative image paths to absolute GitHub URLs
        markdownText = markdownText.replace(
          /!\[([^\]]*)\]\(([^)]+)\)/g,
          (match, alt, src) => {
            const fullUrl = `https://raw.githubusercontent.com/${USER_NAME}/${repoName}/main/paper/${src}`;
            return `![${alt}](${fullUrl})`;
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
          <hr/>
        `;

        papersContainer.appendChild(card);
      } catch (err) {
        console.warn(`Could not fetch paper for ${repoName}:`, err);
      }
    }
  } catch (err) {
    papersContainer.innerHTML = "<p>Error loading papers. Try again later.</p>";
    console.error(err);
  }
});
