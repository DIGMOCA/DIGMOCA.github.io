const header = document.getElementById("site-header");

const isWorkPage =
  window.location.pathname.includes("/works/");

const basePath =
  isWorkPage ? "../" : "";

header.innerHTML = `
  <header>

    <h1>
      DIGMOCA ARCHIVE
    </h1>

    <nav>
      <a href="${basePath}index.html">WORKS</a>
      <a href="${basePath}years.html">YEARS</a>
      <a href="${basePath}series.html">SERIES</a>
      <a href="${basePath}about.html">ABOUT</a>
      <a href="https://lit.link/digmoca">SNS</a>
    </nav>

  </header>
`;
