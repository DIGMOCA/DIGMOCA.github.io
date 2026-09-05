const seriesList =
  document.getElementById("series-list");

const seriesFilters =
  document.getElementById("series-filters");

const categoryNames = {
  video: "VIDEO",
  illustration: "ILLUSTRATION",
  game: "GAME",
  manga: "MANGA",
  music: "MUSIC",
  "3dcg": "3DCG",
  animation: "ANIMATION"
};


const worksBySeries = {};

works.forEach(work => {

  if (!work.series || work.series.length === 0) {
    return;
  }

  work.series.forEach(seriesName => {

    if (!worksBySeries[seriesName]) {
      worksBySeries[seriesName] = [];
    }

    worksBySeries[seriesName].push(work);

  });

});


const seriesOrderMap = {};

seriesData.forEach(series => {
  seriesOrderMap[series.name] = series.order;
});


const seriesNames =
  Object.keys(worksBySeries)
    .sort((a, b) => {

      const orderA =
        seriesOrderMap[a] ?? 9999;

      const orderB =
        seriesOrderMap[b] ?? 9999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return a.localeCompare(b, "ja");

    });


let currentSeries = "all";


function createFilters() {

  seriesFilters.innerHTML = "";


  const allButton =
    document.createElement("button");

  allButton.className =
    "series-filter-button active";

  allButton.textContent = "ALL";

  allButton.dataset.series = "all";

  seriesFilters.appendChild(allButton);


  seriesNames.forEach(seriesName => {

    const button =
      document.createElement("button");

    button.className =
      "series-filter-button";

    button.textContent =
      seriesName;

    button.dataset.series =
      seriesName;

    seriesFilters.appendChild(button);

  });


  const buttons =
    document.querySelectorAll(
      ".series-filter-button"
    );


  buttons.forEach(button => {

    button.addEventListener("click", () => {

      currentSeries =
        button.dataset.series;


      buttons.forEach(btn => {
        btn.classList.remove("active");
      });


      button.classList.add("active");


      renderSeries();

    });

  });

}


function renderSeries() {

  seriesList.innerHTML = "";


  seriesNames.forEach(seriesName => {

    if (
      currentSeries !== "all" &&
      currentSeries !== seriesName
    ) {
      return;
    }


    const section =
      document.createElement("section");

    section.className = "series";


    const heading =
      document.createElement("h3");

    heading.textContent =
      seriesName;

    section.appendChild(heading);


    const list =
      document.createElement("div");

    list.className =
      "series-works";


    worksBySeries[seriesName]
      .sort((a, b) => {
        return new Date(b.date)
          - new Date(a.date);
      })
      .forEach(work => {

        const item =
          document.createElement("article");

        item.className =
          "series-work";


        const categoryText =
          work.categories
            .map(category =>
              categoryNames[category] ||
              category
            )
            .join(" / ");


        item.innerHTML = `

          <a
            class="series-thumbnail"
            href="${work.page}"
          >
            <img
              src="${work.image}"
              alt="${work.title}"
              loading="lazy"
            >
          </a>

          <div class="series-work-info">

            <h4>
              <a href="${work.page}">
                ${work.title}
              </a>
            </h4>

            <p>
              ${work.date} / ${categoryText}
            </p>

          </div>

        `;


        list.appendChild(item);

      });


    section.appendChild(list);

    seriesList.appendChild(section);

  });

}


createFilters();

renderSeries();
