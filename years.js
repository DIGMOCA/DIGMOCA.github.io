const yearsList =
  document.getElementById(
    "years-list"
  );

const yearFilters =
  document.getElementById(
    "year-filters"
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
// 年代ごとに分類
// ========================================

const worksByYear = {};


works.forEach(work => {

  if (!work.date) return;


  const year =
    work.date.slice(
      0,
      4
    );


  if (
    !worksByYear[year]
  ) {

    worksByYear[year] = [];

  }


  worksByYear[
    year
  ].push(work);

});


const years =
  Object.keys(
    worksByYear
  )
  .sort(
    (a, b) =>
      Number(b) -
      Number(a)
  );


let currentYear =
  "all";


// ========================================
// 年代フィルター
// ========================================

function createYearFilters() {

  yearFilters.innerHTML = "";


  const allButton =
    document.createElement(
      "button"
    );


  allButton.className =
    "year-filter-button active";


  allButton.textContent =
    "ALL";


  allButton.dataset.year =
    "all";


  yearFilters.appendChild(
    allButton
  );


  years.forEach(year => {

    const button =
      document.createElement(
        "button"
      );


    button.className =
      "year-filter-button";


    button.textContent =
      year;


    button.dataset.year =
      year;


    yearFilters.appendChild(
      button
    );

  });


  const buttons =
    document.querySelectorAll(
      ".year-filter-button"
    );


  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        currentYear =
          button.dataset.year;


        buttons.forEach(btn => {

          btn.classList.remove(
            "active"
          );

        });


        button.classList.add(
          "active"
        );


        renderYears();

      }
    );

  });

}


// ========================================
// 年代表示
// ========================================

function renderYears() {

  yearsList.innerHTML = "";


  years.forEach(year => {

    if (
      currentYear !== "all" &&
      currentYear !== year
    ) {
      return;
    }


    const section =
      document.createElement(
        "section"
      );


    section.className =
      "year";


    const heading =
      document.createElement(
        "h3"
      );


    heading.textContent =
      year;


    section.appendChild(
      heading
    );


    const list =
      document.createElement(
        "div"
      );


    list.className =
      "year-works";


    const sortedWorks =
      [
        ...worksByYear[
          year
        ]
      ]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );


    sortedWorks.forEach(work => {

      const item =
        document.createElement(
          "article"
        );


      item.className =
        "year-work";


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


      item.innerHTML = `

        <a
          class="year-thumbnail"
          href="${workPage}"
        >
          <img
            src="${work.image}"
            alt="${work.title}"
            loading="lazy"
          >
        </a>

        <div
          class="year-work-info"
        >

          <h4>
            <a href="${workPage}">
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

    });


    section.appendChild(
      list
    );


    yearsList.appendChild(
      section
    );

  });

}


createYearFilters();
renderYears();
