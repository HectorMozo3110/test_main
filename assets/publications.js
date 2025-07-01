// assets/publications.js

// Load marked.js for Markdown -> HTML conversion
document.addEventListener("DOMContentLoaded", async () => {
  const USER_NAME = "HectorMozo3110";
  const papersContainer = document.getElementById("papers");

  try {
    // Get all public repos from the user
    const repoResponse = await fetch(`https://api.github.com/users/${USER_NAME}/repos`);
    const repos = await repoResponse.json();

    for (const repo of repos) {
      const repoName = repo.name;

      // Try to fetch the paper.md file from each repo
      const paperUrl = `https://raw.githubusercontent.com/${USER_NAME}/${repoName}/main/paper/paper.md`;

      try {
        const paperRes = await fetch(paperUrl);
        if (!paperRes.ok) continue;

        const markdownText = await paperRes.text();
        const htmlContent = marked.parse(markdownText);

        const card = document.createElement("div");
        card.classList.add("paper-card");
        card.innerHTML = `
          <h2>${repoName}</h2>
          <div class="paper-content">${htmlContent}</div>
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
