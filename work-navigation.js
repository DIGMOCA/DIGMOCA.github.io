const navigation =
  document.getElementById("work-navigation");


// 現在開いている作品ページのファイル名を取得
const currentFile =
  window.location.pathname
    .split("/")
    .pop();


// works-data.js の作品を日付順に並べる
const sortedWorks =
  [...works].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });


// 現在の作品を探す
const currentIndex =
  sortedWorks.findIndex(work => {
    return work.page.endsWith(currentFile);
  });


if (currentIndex !== -1) {

  const previousWork =
    sortedWorks[currentIndex + 1];

  const nextWork =
    sortedWorks[currentIndex - 1];


  const previousHTML =
    previousWork
      ? `
        <a
          class="work-nav-link work-nav-previous"
          href="../${previousWork.page}"
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
          href="../${nextWork.page}"
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
    <nav class="work-navigation">
      ${previousHTML}
      ${nextHTML}
    </nav>
  `;

}
