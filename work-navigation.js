const navigation =
  document.getElementById("work-navigation");


// ==============================
// 現在の作品を取得
// ==============================

const currentFile =
  window.location.pathname
    .split("/")
    .pop();


// ==============================
// URLからシリーズ名を取得
// ==============================

const params =
  new URLSearchParams(
    window.location.search
  );

const currentSeries =
  params.get("series");


// ==============================
// 並び順を決定
// ==============================

let navigationWorks;


// SERIESから来た場合
if (currentSeries) {

  navigationWorks =
    works
      .filter(work => {

        return (
          Array.isArray(work.series) &&
          work.series.includes(currentSeries)
        );

      })
      .sort((a, b) => {

        return (
          new Date(b.date) -
          new Date(a.date)
        );

      });

}


// 通常の場合
else {

  navigationWorks =
    [...works]
      .sort((a, b) => {

        return (
          new Date(b.date) -
          new Date(a.date)
        );

      });

}


// ==============================
// 現在の作品位置を取得
// ==============================

const currentIndex =
  navigationWorks.findIndex(
    work => {
      return work.page.endsWith(
        currentFile
      );
    }
  );


// ==============================
// 前後ナビゲーション
// ==============================

if (currentIndex !== -1) {

  const previousWork =
    navigationWorks[
      currentIndex + 1
    ];

  const nextWork =
    navigationWorks[
      currentIndex - 1
    ];


  const previousURL =
    previousWork
      ? `../${previousWork.page}${
          currentSeries
            ? `?series=${encodeURIComponent(currentSeries)}`
            : ""
        }`
      : null;


  const nextURL =
    nextWork
      ? `../${nextWork.page}${
          currentSeries
            ? `?series=${encodeURIComponent(currentSeries)}`
            : ""
        }`
      : null;


const seriesHTML =
  currentSeries
    ? `
      <div class="work-nav-series">
        <a
          href="../series.html?series=${encodeURIComponent(currentSeries)}"
        >
          ${currentSeries}
        </a>
      </div>
    `
    : "";


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


  navigation.innerHTML = `
  
    ${seriesHTML}
  
    <nav class="work-navigation">
      ${nextHTML}
      ${previousHTML}
    </nav>
  
  `;
  
}
