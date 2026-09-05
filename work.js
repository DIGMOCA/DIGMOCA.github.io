const works = [

  {
    title: "【無色透名美術館】ひ　い　　て　　　い　　　　く　　　　　　。",
    date: "2026-07-23",
    categories: ["illustration"],
    image: "images/musyokutoumei3_5.jpg",
    page: "works/musyokutoumei3_5.html"
  }

];

let currentFilter = "all";

const worksList =
  document.getElementById("works-list");

const filterButtons =
  document.querySelectorAll(".filter-button");


function renderWorks() {

  worksList.innerHTML = "";

  const sortedWorks = [...works].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
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
        .map(category => {

          const names = {
            douga: "DOUGA",
            illustration: "ILLUSTRATION",
            game: "GAME",
            manga: "MANGA",
            ongaku: "ONGAKU",
            "3dcg": "3DCG",
            animation: "ANIMATION"
          };

          return names[category];

        })
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
