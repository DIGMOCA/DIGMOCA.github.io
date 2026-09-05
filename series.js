const seriesList =
  document.getElementById("series-list");

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

const seriesNames =
  Object.keys(worksBySeries)
    .sort((a, b) =>
      a.localeCompare(b, "ja")
    );

seriesNames.forEach(seriesName => {

  const section =
    document.createElement("section");

  section.className = "series";


  const heading =
    document.createElement("h3");

  heading.textContent = seriesName;

  section.appendChild(heading);


  const list =
    document.createElement("div");

  list.className = "series-works";


  worksBySeries[seriesName]
    .sort((a, b) => {
      return new Date(b.date)
        - new Date(a.date);
    })
    .forEach(work => {

      const item =
        document.createElement("article");

      item.className = "series-work";


      const categoryText =
        work.categories
          .map(category =>
            categoryNames[category] || category
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
