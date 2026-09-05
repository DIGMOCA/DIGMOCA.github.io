let currentFilter = "all";

const worksList =
  document.getElementById("works-list");

const filterButtons =
  document.querySelectorAll(".filter-button");

const categoryNames = {
  douga: "DOUGA",
  illustration: "ILLUSTRATION",
  game: "GAME",
  manga: "MANGA",
  ongaku: "ONGAKU",
  "3dcg": "3DCG",
  animation: "ANIMATION"
};

function renderWorks() {

  if (!worksList) {
    return;
  }

  worksList.innerHTML = "";

  const sortedWorks =
    [...works].sort((a, b) => {
      return new Date(b.date)
        - new Date(a.date);
    });

  sortedWorks.forEach(work => {

    if (
      currentFilter !== "all" &&
      !work.categories.includes(currentFilter)
    ) {
      return;
    }

    const article =
      document.createElement("article");

    article.className = "work";

    const categoryText =
      work.categories
        .map(category => categoryNames[category] || category)
        .join(" / ");

    article.innerHTML = `
      <a href="${work.page}">
        <img
          src="${work.image}"
          alt="${work.title}"
          loading="lazy"
        >
      </a>

      <h3>
        <a href="${work.page}">
          ${work.title}
        </a>
      </h3>

      <p>
        ${work.date} / ${categoryText}
      </p>
    `;

    worksList.appendChild(article);

  });

}

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    currentFilter =
      button.dataset.filter;

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderWorks();

  });

});

renderWorks();
