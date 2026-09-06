const fs = require("fs");
const path = require("path");
const vm = require("vm");


// ========================================
// 基本設定
// ========================================

const ROOT = __dirname;

const OUTPUT =
  path.join(ROOT, "_site");

const BASE_URL =
  "https://digmoca.github.io/";


// ========================================
// カテゴリ名
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


// ========================================
// idから作品ページを生成
// ========================================

function getWorkPage(work) {

  return `works/${work.id}.html`;

}


// ========================================
// HTMLエスケープ
// ========================================

function escapeHTML(value = "") {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

}


// ========================================
// works-data.jsを読み込む
// ========================================

function loadWorks() {

  const dataPath =
    path.join(
      ROOT,
      "works-data.js"
    );

  const source =
    fs.readFileSync(
      dataPath,
      "utf8"
    );

  const sandbox = {};

  vm.createContext(sandbox);

  const works =
    vm.runInContext(
      `${source}\nworks;`,
      sandbox
    );

  if (!Array.isArray(works)) {

    throw new Error(
      "works-data.js の works が読み込めませんでした。"
    );

  }

  return works;

}


// ========================================
// 相対URL生成
// ========================================

function relativeURL(
  pagePath,
  targetPath
) {

  return path.posix.relative(
    path.posix.dirname(pagePath),
    targetPath
  );

}


// ========================================
// 絶対URL生成
// ========================================

function absoluteURL(
  targetPath
) {

  return new URL(
    targetPath,
    BASE_URL
  ).href;

}


// ========================================
// 作品コンテンツ生成
// ========================================

function renderContent(work) {

  const workPage =
    getWorkPage(work);


  let contents =
    Array.isArray(work.content)
      ? work.content
      : [];


  // contentがない場合は
  // imageを作品画像として自動表示
  if (
    contents.length === 0 &&
    work.image
  ) {

    contents = [
      {
        type: "image",
        src: work.image,
        alt: work.title
      }
    ];

  }


  return contents
    .map(item => {


      // ------------------------
      // IMAGE
      // ------------------------

      if (
        item.type === "image"
      ) {

        const src =
          relativeURL(
            workPage,
            item.src
          );

        const alt =
          item.alt ||
          work.title;

        return `
          <img
            class="work-detail-image"
            src="${escapeHTML(src)}"
            alt="${escapeHTML(alt)}"
            loading="lazy"
          >
        `;

      }


      // ------------------------
      // YOUTUBE
      // ------------------------

      if (
        item.type === "youtube"
      ) {

        return `
          <div class="video-embed">
            <iframe
              src="https://www.youtube.com/embed/${escapeHTML(item.id)}"
              title="${escapeHTML(work.title)}"
              loading="lazy"
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
                web-share
              "
              allowfullscreen
            ></iframe>
          </div>
        `;

      }


      // ------------------------
      // TIKTOK
      // ------------------------

      if (
        item.type === "tiktok"
      ) {

        return `
          <div class="tiktok-player">
            <iframe
              src="https://www.tiktok.com/player/v1/${escapeHTML(item.id)}"
              allow="fullscreen"
              title="${escapeHTML(work.title)}"
            ></iframe>
          </div>
        `;

      }


      // ------------------------
      // VIDEO
      // ------------------------

      if (
        item.type === "video"
      ) {

        const src =
          relativeURL(
            workPage,
            item.src
          );

        return `
          <video
            class="work-video"
            controls
            playsinline
            preload="metadata"
          >
            <source
              src="${escapeHTML(src)}"
              type="video/mp4"
            >
            お使いのブラウザは動画再生に対応していません。
          </video>
        `;

      }


      // ------------------------
      // AUDIO
      // ------------------------

      if (
        item.type === "audio"
      ) {

        const src =
          relativeURL(
            workPage,
            item.src
          );

        return `
          <audio
            class="work-audio"
            controls
            preload="metadata"
          >
            <source
              src="${escapeHTML(src)}"
            >
          </audio>
        `;

      }


      // ------------------------
      // TEXT
      // ------------------------

      if (
        item.type === "text"
      ) {

        return `
          <p class="work-text">
            ${escapeHTML(item.text)}
          </p>
        `;

      }


      // ------------------------
      // TEXT + LINK
      // ------------------------

      if (
        item.type === "text-link"
      ) {

        return `
          <p class="work-text">
            ${escapeHTML(item.before || "")}<a
              href="${escapeHTML(item.url)}"
              target="_blank"
              rel="noopener noreferrer"
            >${escapeHTML(item.label)}</a>${escapeHTML(item.after || "")}
          </p>
        `;

      }


      // ------------------------
      // LINK
      // ------------------------

      if (
        item.type === "link"
      ) {

        return `
          <p class="work-external-link">
            <a
              href="${escapeHTML(item.url)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${escapeHTML(item.label)}
            </a>
          </p>
        `;

      }


      // ------------------------
      // 特殊HTML
      // ------------------------

      if (
        item.type === "html"
      ) {

        return item.html || "";

      }


      return "";

    })
    .join("\n");

}


// ========================================
// 作品HTML生成
// ========================================

function renderWorkPage(work) {

  const workPage =
    getWorkPage(work);


  const title =
    escapeHTML(work.title);


  const description =
    escapeHTML(
      work.description ||
      "DIGMOCA ARCHIVE"
    );


  const categoryText =
    (work.categories || [])
      .map(category =>
        categoryNames[category] ||
        category
      )
      .join(" / ");


  const canonicalURL =
    absoluteURL(
      workPage
    );


  const ogImage =
    work.ogImage ||
    work.image;


  const ogImageHTML =
    ogImage
      ? `
  <meta
    property="og:image"
    content="${escapeHTML(
      absoluteURL(ogImage)
    )}"
  >`
      : "";


  const stylesheet =
    relativeURL(
      workPage,
      "style.css"
    );


  const headerScript =
    relativeURL(
      workPage,
      "header.js"
    );


  const dataScript =
    relativeURL(
      workPage,
      "works-data.js"
    );


  const navigationScript =
    relativeURL(
      workPage,
      "work-navigation.js"
    );


  const footerScript =
    relativeURL(
      workPage,
      "footer.js"
    );

    const analyticsScript =
    relativeURL(
      workPage,
      "analytics.js"
    );


  const content =
    renderContent(work);


  return `<!DOCTYPE html>
<html lang="ja">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>${title} | DIGMOCA ARCHIVE</title>

  <meta
    name="description"
    content="${description}"
  >

  <link
    rel="canonical"
    href="${escapeHTML(canonicalURL)}"
  >

  <meta
    property="og:title"
    content="${title}"
  >

  <meta
    property="og:description"
    content="${description}"
  >

  <meta
    property="og:url"
    content="${escapeHTML(canonicalURL)}"
  >

  <meta
    property="og:type"
    content="article"
  >

  <meta
    property="og:site_name"
    content="DIGMOCA ARCHIVE"
  >

  <meta
    property="og:locale"
    content="ja_JP"
  >
${ogImageHTML}

  <meta
    name="twitter:card"
    content="summary_large_image"
  >

  <link
    rel="stylesheet"
    href="${escapeHTML(stylesheet)}"
  >

</head>

<body>

  <div id="site-header"></div>

  <main>

    <article class="work-detail">

      <h2>${title}</h2>

      <p class="work-detail-meta">
        ${escapeHTML(work.date)}
        /
        ${escapeHTML(categoryText)}
      </p>

      <div class="work-content">

        ${content}

      </div>

    </article>

    <div id="work-navigation"></div>

  </main>

  <div id="site-footer"></div>


  <script src="${escapeHTML(headerScript)}"></script>
  <script src="${escapeHTML(dataScript)}"></script>
  <script src="${escapeHTML(navigationScript)}"></script>
  <script src="${escapeHTML(footerScript)}"></script>
  <script src="${escapeHTML(analyticsScript)}"></script>

</body>

</html>
`;

}


// ========================================
// 通常ファイルコピー
// ========================================

function copySiteFiles() {

  const exclude =
    new Set([
      ".git",
      ".github",
      "_site",
      "works",
      "node_modules",
      "build-site.js",
      "README.md"
    ]);


  const entries =
    fs.readdirSync(
      ROOT,
      {
        withFileTypes: true
      }
    );


  entries.forEach(entry => {

    if (
      exclude.has(entry.name)
    ) {
      return;
    }


    const source =
      path.join(
        ROOT,
        entry.name
      );


    const destination =
      path.join(
        OUTPUT,
        entry.name
      );


    fs.cpSync(
      source,
      destination,
      {
        recursive: true
      }
    );

  });

}


// ========================================
// ビルド
// ========================================

function build() {

  console.log(
    "DIGMOCA ARCHIVE build start"
  );


  fs.rmSync(
    OUTPUT,
    {
      recursive: true,
      force: true
    }
  );


  fs.mkdirSync(
    OUTPUT,
    {
      recursive: true
    }
  );


  copySiteFiles();


  const works =
    loadWorks();


  works.forEach(work => {

    if (
      !work.id ||
      !work.title
    ) {

      throw new Error(
        "id / title が不足している作品があります。"
      );

    }


    const workPage =
      getWorkPage(work);


    const outputPath =
      path.join(
        OUTPUT,
        ...workPage.split("/")
      );


    fs.mkdirSync(
      path.dirname(outputPath),
      {
        recursive: true
      }
    );


    fs.writeFileSync(
      outputPath,
      renderWorkPage(work),
      "utf8"
    );


    console.log(
      `generated: ${workPage}`
    );

  });


  fs.writeFileSync(
    path.join(
      OUTPUT,
      ".nojekyll"
    ),
    "",
    "utf8"
  );


  console.log(
    `${works.length} work pages generated.`
  );


  console.log(
    "DIGMOCA ARCHIVE build complete"
  );

}


build();
