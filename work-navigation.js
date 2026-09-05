const navigation =
  document.getElementById("work-navigation");


// ==============================
// 基本情報
// ==============================

const currentFile =
  window.location.pathname
    .split("/")
    .pop();


const params =
  new URLSearchParams(
    window.location.search
  );


const currentSeries =
  params.get("series");

const currentCategory =
  params.get("category");


// ==============================
// カテゴリ設定
// ==============================

const categoryNames = {
  video: "VIDEO",
  illustration: "ILLUSTRATION",
  game: "GAME",
  manga: "MANGA",
  music: "MUSIC",
  "3dcg": "3DCG",
  animation: "ANIMATION"
};


const categoryOrder = [
  "video",
  "illustration",
  "game",
  "manga",
  "music",
  "3dcg",
  "animation"
];


// ==============================
// 日付順
// ==============================

function sortByDate(workList) {

  return [...workList]
    .sort((a, b) => {

      return (
        new Date(b.date) -
        new Date(a.date)
      );

    });

}


// ==============================
// 前後の作品を決定
// ==============================

let previousWork = null;
let nextWork = null;

let previousContext = "";
let nextContext = "";

let contextHTML = "";


// ==================================================
// SERIESモード
// ==================================================

if (currentSeries) {

  const navigationWorks =
    sortByDate(
      works.filter(work => {

        return (
          Array.isArray(work.series) &&
          work.series.includes(currentSeries)
        );

      })
    );


  const currentIndex =
    navigationWorks.findIndex(
      work =>
        work.page.endsWith(currentFile)
    );


  if (currentIndex !== -1) {

    // 左側・新しい作品
    nextWork =
      navigationWorks[currentIndex - 1];

    // 右側・古い作品
    previousWork =
      navigationWorks[currentIndex + 1];

  }


  const encodedSeries =
    encodeURIComponent(currentSeries);


  previousContext =
    `?series=${encodedSeries}`;

  nextContext =
    `?series=${encodedSeries}`;


  contextHTML = `
    <div class="work-nav-series">
      <a
        href="../series.html?series=${encodedSeries}"
      >
        ${currentSeries}
      </a>
    </div>
  `;

}


// ==================================================
// WORKS・カテゴリモード
// ==================================================

else if (
  currentCategory &&
  categoryOrder.includes(currentCategory)
) {

  const currentCategoryIndex =
    categoryOrder.indexOf(
      currentCategory
    );


  const categoryWorks =
    sortByDate(
      works.filter(work =>
        work.categories.includes(
          currentCategory
        )
      )
    );


  const currentIndex =
    categoryWorks.findIndex(
      work =>
        work.page.endsWith(currentFile)
    );


  if (currentIndex !== -1) {

    // ----------------------------------
    // 左側「次の作品」＝同媒体の新しい作品
    // ----------------------------------

    nextWork =
      categoryWorks[currentIndex - 1];


    // 同媒体に新しい作品がない場合
    // 一つ前の媒体の「一番古い作品」へ
    if (!nextWork) {

      for (
        let i = currentCategoryIndex - 1;
        i >= 0;
        i--
      ) {

        const adjacentWorks =
          sortByDate(
            works.filter(work =>
              work.categories.includes(
                categoryOrder[i]
              )
            )
          );


        if (adjacentWorks.length > 0) {

          nextWork =
            adjacentWorks[
              adjacentWorks.length - 1
            ];

          nextContext =
            `?category=${encodeURIComponent(categoryOrder[i])}`;

          break;

        }

      }

    }


    // 同じ媒体内なら現在のcategoryを維持
    if (
      nextWork &&
      !nextContext
    ) {

      nextContext =
        `?category=${encodeURIComponent(currentCategory)}`;

    }


    // ----------------------------------
    // 右側「前の作品」＝同媒体の古い作品
    // ----------------------------------

    previousWork =
      categoryWorks[currentIndex + 1];


    // 同媒体に古い作品がない場合
    // 一つ後ろの媒体の「一番新しい作品」へ
    if (!previousWork) {

      for (
        let i = currentCategoryIndex + 1;
        i < categoryOrder.length;
        i++
      ) {

        const adjacentWorks =
          sortByDate(
            works.filter(work =>
              work.categories.includes(
                categoryOrder[i]
              )
            )
          );


        if (adjacentWorks.length > 0) {

          previousWork =
            adjacentWorks[0];

          previousContext =
            `?category=${encodeURIComponent(categoryOrder[i])}`;

          break;

        }

      }

    }


    // 同じ媒体内なら現在のcategoryを維持
    if (
      previousWork &&
      !previousContext
    ) {

      previousContext =
        `?category=${encodeURIComponent(currentCategory)}`;

    }

  }


  contextHTML = `
    <div class="work-nav-series">
      <a
        href="../index.html?category=${encodeURIComponent(currentCategory)}"
      >
        ${categoryNames[currentCategory]}
      </a>
    </div>
  `;

}


// ==================================================
// ALLモード
// ==================================================

else {

  const navigationWorks =
    sortByDate(works);


  const currentIndex =
    navigationWorks.findIndex(
      work =>
        work.page.endsWith(currentFile)
    );


  if (currentIndex !== -1) {

    // 左＝新しい
    nextWork =
      navigationWorks[currentIndex - 1];

    // 右＝古い
    previousWork =
      navigationWorks[currentIndex + 1];

  }

}


// ==============================
// URL生成
// ==============================

const nextURL =
  nextWork
    ? `../${nextWork.page}${nextContext}`
    : null;


const previousURL =
  previousWork
    ? `../${previousWork.page}${previousContext}`
    : null;


// ==============================
// HTML生成
// ==============================

const nextHTML =
  nextWork
    ? `
      <a
        class="work-nav-link work-nav-next"
        href="${nextURL}"
      >
        <span class="work-nav-label">
          次の作品 →
        </span>

        <span class="work-nav-title">
          ${nextWork.title}
        </span>
      </a>
    `
    : `<div></div>`;


const previousHTML =
  previousWork
    ? `
      <a
        class="work-nav-link work-nav-previous"
        href="${previousURL}"
      >
        <span class="work-nav-label">
          ← 前の作品
        </span>

        <span class="work-nav-title">
          ${previousWork.title}
        </span>
      </a>
    `
    : `<div></div>`;


// ==============================
// 表示
// ==============================

navigation.innerHTML = `

  ${contextHTML}

  <nav class="work-navigation">
    ${nextHTML}
    ${previousHTML}
  </nav>

`;
