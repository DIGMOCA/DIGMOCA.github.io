const yearsList =
  document.getElementById("years-list");

const categoryNames = {
  douga: "DOUGA",
  illustration: "ILLUSTRATION",
  game: "GAME",
  manga: "MANGA",
  ongaku: "ONGAKU",
  "3dcg": "3DCG",
  animation: "ANIMATION"
};

if (yearsList) {

  const worksByYear = {};

  works.forEach(work => {

    const year =
      work.date.slice(0, 4);

    if (!worksByYear[year]) {
      worksByYear[year] = [];
    }

    worksByYear[year].push(work);

  });

  const years =
    Object.keys(worksByYear)
      .sort((a, b) => b - a);

  years.forEach(year => {

    const section =
      document.createElement("section");

    section.className = "years";

    const heading =
      document.createElement("h3");

    heading.textContent = year;

    section.appendChild(heading);

    const ul =
      document.createElement("ul");

    worksByYear[year]
      .sort((a, b) => {
        return new Date(b.date)
          - new Date(a.date);
      })
      .forEach(work => {

        const li =
          document.createElement("li");

        const link =
          document.createElement("a");

        link.href = work.page;
        link.textContent = work.title;

        const span =
          document.createElement("span");

        const categoryText =
          work.categories
            .map(category =>
              categoryNames[category] || category
            )
            .join(" / ");

        span.textContent =
          ` / ${work.date} / ${categoryText}`;

        li.appendChild(link);
        li.appendChild(span);

        ul.appendChild(li);

      });

    section.appendChild(ul);
    yearsList.appendChild(section);

  });

}
