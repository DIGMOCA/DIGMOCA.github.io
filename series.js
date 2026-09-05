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


// ==============================
// 作品をシリーズごとに分類
// ==============================

const worksBySeries = {};

works.forEach(work => {

  // series が存在しない、または空配列なら
  // 自動的に「未分類」へ入れる
  if (
    !Array.isArray(work.series) ||
    work.series.length === 0
  ) {

    if (!worksBySeries["未分類"]) {
      worksBySeries["未分類"] = [];
    }

    worksBySeries["未分類"].push(work);

    return;
  }


  // 通常のシリーズ作品
  work.series.forEach(seriesName => {

    if (!seriesName) {
      return;
    }

    if (!worksBySeries[seriesName]) {
      worksBySeries[seriesName] = [];
    }

    worksBySeries[seriesName].push(work);

  });

});


// ==============================
// シリーズの表示順
// ==============================

const seriesOrderMap = {};

seriesData.forEach(series => {

  seriesOrderMap[series.name] =
    Number(series.order);

});


const seriesNames =
  Object.keys(worksBySeries);


seriesNames.sort((a, b) => {

  const hasA =
    Object.prototype.hasOwnProperty.call(
      seriesOrderMap,
      a
    );

  const hasB =
    Object.prototype.hasOwnProperty.call(
      seriesOrderMap,
      b
    );


  if (hasA && hasB) {

    const difference =
      seriesOrderMap[a] -
      seriesOrderMap[b];

    if (difference !== 0) {
      return difference;
    }

    return a.localeCompare(b, "ja");

  }


  if (hasA) {
    return -1;
  }


  if (hasB) {
    return 1;
  }


  return a.localeCompare(b, "ja");

});


let currentSeries = "all";


// ==============================
// フィルター作成
// ==============================

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

    button.addEventListener(
      "click",
      () => {

        currentSeries =
          button.dataset.series;


        buttons.forEach(btn => {
          btn.classList.remove("active");
        });


        button.classList.add("active");

        renderSeries();

      }
    );

  });

}


// ==============================
// シリーズ一覧表示
// ==============================

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


    // 「未分類」であることを
    // 閲覧者に明示する説明文
    if (seriesName === "未分類") {

      const note =
        document.createElement("p");

      note.className =
        "series-unclassified-note";

      note.textContent =
        "特定のシリーズに属していない作品です。";

      section.appendChild(note);

    }


    const list =
      document.createElement("div");

    list.className =
      "series-works";


    const sortedWorks =
      [...worksBySeries[seriesName]]
        .sort((a, b) => {

          return (
            new Date(b.date) -
            new Date(a.date)
          );

        });


    sortedWorks.forEach(work => {

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


// ==============================
// 初期表示
// ==============================

createFilters();
renderSeries();
