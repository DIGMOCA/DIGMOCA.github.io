const seriesList =
  document.getElementById(
    "series-list"
  );

const seriesFilters =
  document.getElementById(
    "series-filters"
  );


const categoryNames = {
  video: "VIDEO",
  illustration: "ILLUSTRATION",
  game: "GAME",
  manga: "MANGA",
  music: "MUSIC",
  "3dcg": "3DCG",
  animation: "ANIMATION"
};


// ========================================
// idから作品ページを生成
// ========================================

function getWorkPage(work) {

  return `works/${work.id}.html`;

}


// ========================================
// シリーズごとに分類
// ========================================

const worksBySeries = {};


works.forEach(work => {

  if (
    !Array.isArray(work.series) ||
    work.series.length === 0 ||
    work.series.every(
      seriesName => !seriesName
    )
  ) {

    if (
      !worksBySeries["未分類"]
    ) {

      worksBySeries["未分類"] = [];

    }


    worksBySeries[
      "未分類"
    ].push(work);

    return;

  }


  work.series.forEach(
    seriesName => {

      if (!seriesName) return;


      if (
        !worksBySeries[
          seriesName
        ]
      ) {

        worksBySeries[
          seriesName
        ] = [];

      }


      worksBySeries[
        seriesName
      ].push(work);

    }
  );

});


// ========================================
// シリーズ順
// ========================================

const seriesOrderMap = {};


seriesData.forEach(series => {

  seriesOrderMap[
    series.name
  ] =
    Number(series.order);

});


const seriesNames =
  Object.keys(
    worksBySeries
  );


seriesNames.sort(
  (a, b) => {

    const hasA =
      Object.prototype
        .hasOwnProperty.call(
          seriesOrderMap,
          a
        );

    const hasB =
      Object.prototype
        .hasOwnProperty.call(
          seriesOrderMap,
          b
        );


    if (
      hasA &&
      hasB
    ) {

      const difference =
        seriesOrderMap[a] -
        seriesOrderMap[b];


      if (
        difference !== 0
      ) {

        return difference;

      }


      return a.localeCompare(
        b,
        "ja"
      );

    }


    if (hasA) return -1;

    if (hasB) return 1;


    return a.localeCompare(
      b,
      "ja"
    );

  }
);


// ========================================
// URLからシリーズ取得
// ========================================

const params =
  new URLSearchParams(
    window.location.search
  );


const requestedSeries =
  params.get("series");


let currentSeries =
  requestedSeries &&
  seriesNames.includes(
    requestedSeries
  )
    ? requestedSeries
    : "all";


// ========================================
// フィルター作成
// ========================================

function createFilters() {

  seriesFilters.innerHTML = "";


  const allButton =
    document.createElement(
      "button"
    );


  allButton.className =
    currentSeries === "all"
      ? "series-filter-button active"
      : "series-filter-button";


  allButton.textContent =
    "ALL";


  allButton.dataset.series =
    "all";


  seriesFilters.appendChild(
    allButton
  );


  seriesNames.forEach(
    seriesName => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        currentSeries === seriesName
          ? "series-filter-button active"
          : "series-filter-button";


      button.textContent =
        seriesName;


      button.dataset.series =
        seriesName;


      seriesFilters.appendChild(
        button
      );

    }
  );


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

          btn.classList.remove(
            "active"
          );

        });


        button.classList.add(
          "active"
        );


        if (
          currentSeries === "all"
        ) {

          history.replaceState(
            null,
            "",
            "series.html"
          );

        }
        else {

          history.replaceState(
            null,
            "",
            `series.html?series=${encodeURIComponent(currentSeries)}`
          );

        }


        renderSeries();

      }
    );

  });

}


// ========================================
// シリーズ表示
// ========================================

function renderSeries() {

  seriesList.innerHTML = "";


  seriesNames.forEach(
    seriesName => {

      if (
        currentSeries !== "all" &&
        currentSeries !== seriesName
      ) {
        return;
      }


      const section =
        document.createElement(
          "section"
        );


      section.className =
        "series";


      const heading =
        document.createElement(
          "h3"
        );


      heading.textContent =
        seriesName;


      section.appendChild(
        heading
      );


      const list =
        document.createElement(
          "div"
        );


      list.className =
        "series-works";


      const sortedWorks =
        [
          ...worksBySeries[
            seriesName
          ]
        ]
        .sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );


      sortedWorks.forEach(
        work => {

          const item =
            document.createElement(
              "article"
            );


          item.className =
            "series-work";


          const categoryText =
            work.categories
              .map(category =>
                categoryNames[
                  category
                ] ||
                category
              )
              .join(" / ");


          const workPage =
            getWorkPage(work);


          const workURL =
            `${workPage}?series=${encodeURIComponent(seriesName)}`;


          item.innerHTML = `

            <a
              class="series-thumbnail"
              href="${workURL}"
            >
              <img
                src="${work.image}"
                alt="${work.title}"
                loading="lazy"
              >
            </a>

            <div
              class="series-work-info"
            >

              <h4>
                <a href="${workURL}">
                  ${work.title}
                </a>
              </h4>

              <p>
                ${work.date} / ${categoryText}
              </p>

            </div>

          `;


          list.appendChild(
            item
          );

        }
      );


      section.appendChild(
        list
      );


      seriesList.appendChild(
        section
      );

    }
  );

}


createFilters();
renderSeries();
