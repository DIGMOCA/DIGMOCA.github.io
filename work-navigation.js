const navigation =
  document.getElementById(
    "work-navigation"
  );


// ========================================
// idから作品ページを生成
// ========================================

function getWorkPage(work) {

  return `works/${work.id}.html`;

}


// ========================================
// 現在の作品
// ========================================

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


// ========================================
// カテゴリ
// ========================================

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


// ========================================
// 日付順
// 新しい → 古い
// ========================================

function sortByDate(
  workList
) {

  return [
    ...workList
  ]
  .sort(
    (a, b) =>
      new Date(b.date) -
      new Date(a.date)
  );

}


// ========================================
// 現在作品判定
// ========================================

function isCurrentWork(
  work
) {

  return getWorkPage(work)
    .endsWith(
      currentFile
    );

}


// ========================================
// ナビゲーション
// ========================================

let previousWork = null;
let nextWork = null;

let previousContext = "";
let nextContext = "";

let contextHTML = "";


// ==================================================
// SERIES
// ==================================================

if (currentSeries) {

  const navigationWorks =
    sortByDate(
      works.filter(work => {

        // 未分類
        if (
          currentSeries ===
          "未分類"
        ) {

          return (
            !Array.isArray(
              work.series
            ) ||
            work.series.length === 0 ||
            work.series.every(
              seriesName =>
                !seriesName
            )
          );

        }


        return (
          Array.isArray(
            work.series
          ) &&
          work.series.includes(
            currentSeries
          )
        );

      })
    );


  const currentIndex =
    navigationWorks.findIndex(
      isCurrentWork
    );


  if (
    currentIndex !== -1
  ) {

    // 左
    // より新しい作品
    nextWork =
      navigationWorks[
        currentIndex - 1
      ];


    // 右
    // より古い作品
    previousWork =
      navigationWorks[
        currentIndex + 1
      ];

  }


  const encodedSeries =
    encodeURIComponent(
      currentSeries
    );


  previousContext =
    `?series=${encodedSeries}`;


  nextContext =
    `?series=${encodedSeries}`;


  contextHTML = `
    <div
      class="work-nav-context"
    >
      <a
        href="../series.html?series=${encodedSeries}"
      >
        ${currentSeries}
      </a>
    </div>
  `;

}


// ==================================================
// WORKS カテゴリ
// ==================================================

else if (
  currentCategory &&
  categoryOrder.includes(
    currentCategory
  )
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
      isCurrentWork
    );


  if (
    currentIndex !== -1
  ) {


    // ====================================
    // 左：次の作品
    // 同媒体のより新しい作品
    // ====================================

    nextWork =
      categoryWorks[
        currentIndex - 1
      ];


    // 同媒体の一番新しい作品なら
    // 前の媒体の一番古い作品へ
    if (!nextWork) {

      for (
        let i =
          currentCategoryIndex - 1;

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


        if (
          adjacentWorks.length > 0
        ) {

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


    if (
      nextWork &&
      !nextContext
    ) {

      nextContext =
        `?category=${encodeURIComponent(currentCategory)}`;

    }


    // ====================================
    // 右：前の作品
    // 同媒体のより古い作品
    // ====================================

    previousWork =
      categoryWorks[
        currentIndex + 1
      ];


    // 同媒体の一番古い作品なら
    // 次の媒体の一番新しい作品へ
    if (!previousWork) {

      for (
        let i =
          currentCategoryIndex + 1;

        i <
          categoryOrder.length;

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


        if (
          adjacentWorks.length > 0
        ) {

          previousWork =
            adjacentWorks[0];


          previousContext =
            `?category=${encodeURIComponent(categoryOrder[i])}`;


          break;

        }

      }

    }


    if (
      previousWork &&
      !previousContext
    ) {

      previousContext =
        `?category=${encodeURIComponent(currentCategory)}`;

    }

  }


  contextHTML = `
    <div
      class="work-nav-context"
    >
      <a
        href="../index.html?category=${encodeURIComponent(currentCategory)}"
      >
        ${categoryNames[currentCategory]}
      </a>
    </div>
  `;

}


// ==================================================
// ALL
// ==================================================

else {

  const navigationWorks =
    sortByDate(
      works
    );


  const currentIndex =
    navigationWorks.findIndex(
      isCurrentWork
    );


  if (
    currentIndex !== -1
  ) {

    // 左＝より新しい
    nextWork =
      navigationWorks[
        currentIndex - 1
      ];


    // 右＝より古い
    previousWork =
      navigationWorks[
        currentIndex + 1
      ];

  }

}


// ========================================
// URL
// ========================================

const nextURL =
  nextWork
    ? `../${getWorkPage(nextWork)}${nextContext}`
    : null;


const previousURL =
  previousWork
    ? `../${getWorkPage(previousWork)}${previousContext}`
    : null;


// ========================================
// HTML
// ========================================

const nextHTML =
  nextWork
    ? `
      <a
        class="work-nav-link work-nav-next"
        href="${nextURL}"
      >
        <span
          class="work-nav-label"
        >
          ← 次の作品
        </span>

        <span
          class="work-nav-title"
        >
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
        <span
          class="work-nav-label"
        >
          前の作品 →
        </span>

        <span
          class="work-nav-title"
        >
          ${previousWork.title}
        </span>
      </a>
    `
    : `<div></div>`;


// ========================================
// 表示
// ========================================

navigation.innerHTML = `

  ${contextHTML}

  <nav
    class="work-navigation"
  >
    ${nextHTML}
    ${previousHTML}
  </nav>

`;
