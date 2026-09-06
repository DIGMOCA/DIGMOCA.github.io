const worksList =
  document.getElementById("works-list");

const filterButtons =
  document.querySelectorAll(".filter-button");


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
// URLからカテゴリ取得
// ========================================

const params =
  new URLSearchParams(
    window.location.search
  );


const requestedCategory =
  params.get("category");


const validCategories =
  Object.keys(categoryNames);


let currentFilter =
  requestedCategory &&
  validCategories.includes(
    requestedCategory
  )
    ? requestedCategory
    : "all";


// ========================================
// 作品表示
// ========================================

function renderWorks() {

  worksList.innerHTML = "";


  const sortedWorks =
    [...works].sort((a, b) => {

      return (
        new Date(b.date) -
        new Date(a.date)
      );

    });


  sortedWorks.forEach(work => {

    if (
      currentFilter !== "all" &&
      !work.categories.includes(
        currentFilter
      )
    ) {
      return;
    }


    const article =
      document.createElement("article");

    article.className = "work";


    const categoryText =
      work.categories
        .map(category =>
          categoryNames[category] ||
          category
        )
        .join(" / ");


    const workPage =
      getWorkPage(work);


    const workURL =
      currentFilter === "all"
        ? workPage
        : `${workPage}?category=${encodeURIComponent(currentFilter)}`;


    article.innerHTML = `

      <a href="${workURL}">
        <img
          src="${work.image}"
          alt="${work.title}"
          loading="lazy"
        >
      </a>

      <h3>
        <a href="${workURL}">
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


// ========================================
// フィルター
// ========================================

filterButtons.forEach(button => {

  const filter =
    button.dataset.filter;


  if (
    filter === currentFilter
  ) {

    button.classList.add(
      "active"
    );

  }
  else {

    button.classList.remove(
      "active"
    );

  }


  button.addEventListener(
    "click",
    () => {

      currentFilter =
        button.dataset.filter;


      filterButtons.forEach(btn => {

        btn.classList.remove(
          "active"
        );

      });


      button.classList.add(
        "active"
      );


      if (
        currentFilter === "all"
      ) {

        history.replaceState(
          null,
          "",
          "index.html"
        );

      }
      else {

        history.replaceState(
          null,
          "",
          `index.html?category=${encodeURIComponent(currentFilter)}`
        );

      }


      renderWorks();

    }
  );

});


renderWorks();
