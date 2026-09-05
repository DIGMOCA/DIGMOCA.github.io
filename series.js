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


  const ul =
    document.createElement("ul");


  worksBySeries[seriesName]
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

  seriesList.appendChild(section);

});
