/* =========================================================
   THE STUDIO BY PETRA
   app.js
========================================================= */


/* =========================================================
   HELPERS
========================================================= */

async function getJSON(paths) {
  for (const path of paths) {
    try {
      const response = await fetch(path);

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Could not load ${path}`, error);
    }
  }

  return null;
}


function escapeHTML(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function formatText(text = "") {
  if (!text) return "";

  return escapeHTML(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
}


function paragraphText(text = "") {
  if (!text) return "";

  return `<p>${formatText(text)}</p>`;
}


/* =========================================================
   THEME
========================================================= */

function setTheme(site) {
  if (!site) return;

  const root = document.documentElement;

  if (site.colors) {
    if (site.colors.cream) {
      root.style.setProperty("--cream", site.colors.cream);
    }

    if (site.colors.mustard) {
      root.style.setProperty("--mustard", site.colors.mustard);
    }

    if (site.colors.burgundy) {
      root.style.setProperty("--burgundy", site.colors.burgundy);
    }

    if (site.colors.warmWhite) {
      root.style.setProperty("--white", site.colors.warmWhite);
    }

    if (site.colors.blue) {
      root.style.setProperty("--blue", site.colors.blue);
    }
  }

  if (site.fonts) {
    if (site.fonts.display) {
      root.style.setProperty(
        "--display-font",
        `"${site.fonts.display}", Georgia, serif`
      );
    }

    if (site.fonts.body) {
      root.style.setProperty(
        "--body-font",
        `"${site.fonts.body}", Georgia, serif`
      );
    }
  }
}


/* =========================================================
   MENU
========================================================= */

function menu(siteTitle = "The Studio by Petra") {
  return `
    <button
      class="menu-button"
      id="menuButton"
      aria-label="Open menu"
      aria-expanded="false"
    >
      Menu
    </button>

    <div
      class="menu-overlay"
      id="menuOverlay"
      aria-hidden="true"
    >
      <div class="menu-inner">

        <div class="menu-top">
          <a class="menu-brand" href="/">
            ${escapeHTML(siteTitle)}
          </a>

          <button
            class="menu-close"
            id="menuClose"
            aria-label="Close menu"
          >
            Close
          </button>
        </div>

        <nav class="menu-nav">

          <a href="/#projects">
            Work
          </a>

          <a href="/#about">
            About
          </a>

          <a href="/#contact">
            Contact
          </a>

        </nav>

      </div>
    </div>
  `;
}


function activateMenu() {
  const button = document.getElementById("menuButton");
  const close = document.getElementById("menuClose");
  const overlay = document.getElementById("menuOverlay");

  if (!button || !close || !overlay) return;

  function openMenu() {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");
  }

  button.addEventListener("click", openMenu);
  close.addEventListener("click", closeMenu);

  overlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}


/* =========================================================
   DATA
========================================================= */

async function loadSite() {
  return await getJSON([
    "/content/site.json",
    "/the-studio-by-petra-editable-cms/content/site.json"
  ]);
}


async function loadProject(slug) {
  return await getJSON([
    `/content/projects/${slug}.json`,
    `/the-studio-by-petra-editable-cms/content/projects/${slug}.json`
  ]);
}


/*
  For now these are the projects displayed on the homepage.

  Later we can make this automatic so you never need
  to touch app.js when adding a new project.
*/

async function loadProjects() {
  const slugs = [
    "freedom-the-label",
    "musa-beer-on-tiktok"
  ];

  const projects = await Promise.all(
    slugs.map((slug) => loadProject(slug))
  );

  return projects.filter(Boolean);
}


/* =========================================================
   CONTACT ICONS
========================================================= */

function contactIcons(site = {}) {
  const email =
    site.email ||
    "petra.moreno8@gmail.com";

  const instagram =
    site.instagram ||
    "https://www.instagram.com/petramoreeno/";

  const linkedin =
    site.linkedin ||
    "https://www.linkedin.com/in/petra-moreno-33b009131/";

  return `
    <div class="contact-icons">

      <a
        href="mailto:${escapeHTML(email)}"
        aria-label="Email Petra"
        title="Email"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="1"
          ></rect>

          <path d="M3 7l9 6 9-6"></path>
        </svg>
      </a>


      <a
        href="${escapeHTML(instagram)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        title="Instagram"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">

          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
          ></rect>

          <circle
            cx="12"
            cy="12"
            r="4"
          ></circle>

          <circle
            class="fill"
            cx="17.4"
            cy="6.6"
            r="1"
          ></circle>

        </svg>
      </a>


      <a
        href="${escapeHTML(linkedin)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">

          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="1"
          ></rect>

          <circle
            class="fill"
            cx="7.3"
            cy="8"
            r="1.2"
          ></circle>

          <path d="M7.3 10.5v6.3"></path>

          <path d="M11 10.5v6.3"></path>

          <path
            d="
              M11 13.3
              c0-1.7
              1.1-3
              2.8-3
              1.8 0
              2.9 1.2
              2.9 3.2
              v3.3
            "
          ></path>

        </svg>
      </a>

    </div>
  `;
}


/* =========================================================
   PROJECT SECTION RENDERERS
========================================================= */


/* ---------------------------------------------------------
   TEXT
--------------------------------------------------------- */

function renderTextSection(section) {
  return `
    <section class="case-section case-text">

      <div class="case-narrow">

        ${
          section.heading
            ? `<h2>${escapeHTML(section.heading)}</h2>`
            : ""
        }

        <div class="case-copy">
          ${paragraphText(section.text)}
        </div>

      </div>

    </section>
  `;
}


/* ---------------------------------------------------------
   TEXT + IMAGE
--------------------------------------------------------- */

function renderTextImageSection(section) {
  const hasImage = Boolean(section.image);

  if (!hasImage) {
    return renderTextSection(section);
  }

  const imagePosition =
    section.imagePosition === "left"
      ? "image-left"
      : "image-right";

  return `
    <section
      class="case-section case-text-image ${imagePosition}"
    >

      <div class="case-text-image-grid">

        <div class="case-text-block">

          ${
            section.heading
              ? `<h2>${escapeHTML(section.heading)}</h2>`
              : ""
          }

          <div class="case-copy">
            ${paragraphText(section.text)}
          </div>

        </div>


        <div class="case-image-block">

          <img
            src="${escapeHTML(section.image)}"
            alt="${escapeHTML(section.heading || "")}"
            loading="lazy"
          >

        </div>

      </div>

    </section>
  `;
}


/* ---------------------------------------------------------
   FULL IMAGE
--------------------------------------------------------- */

function renderFullImageSection(section) {
  if (!section.image) return "";

  return `
    <section class="case-section case-full-image">

      <figure>

        <img
          src="${escapeHTML(section.image)}"
          alt="${escapeHTML(section.caption || "")}"
          loading="lazy"
        >

        ${
          section.caption
            ? `
              <figcaption>
                ${escapeHTML(section.caption)}
              </figcaption>
            `
            : ""
        }

      </figure>

    </section>
  `;
}


/* ---------------------------------------------------------
   TWO COLUMNS
--------------------------------------------------------- */

function renderColumn(column = {}) {
  if (
    !column.title &&
    !column.text &&
    !column.image
  ) {
    return "";
  }

  return `
    <article class="case-column">

      ${
        column.image
          ? `
            <img
              class="case-column-image"
              src="${escapeHTML(column.image)}"
              alt="${escapeHTML(column.title || "")}"
              loading="lazy"
            >
          `
          : ""
      }

      ${
        column.title
          ? `
            <h3>
              ${escapeHTML(column.title)}
            </h3>
          `
          : ""
      }

      ${
        column.text
          ? `
            <div class="case-copy">
              ${paragraphText(column.text)}
            </div>
          `
          : ""
      }

    </article>
  `;
}


function renderTwoColumnsSection(section) {
  return `
    <section class="case-section case-two-columns">

      ${
        section.heading
          ? `
            <div class="case-section-heading">
              <h2>
                ${escapeHTML(section.heading)}
              </h2>
            </div>
          `
          : ""
      }

      <div class="case-two-columns-grid">

        ${renderColumn(section.left)}

        ${renderColumn(section.right)}

      </div>

    </section>
  `;
}


/* ---------------------------------------------------------
   CARDS
--------------------------------------------------------- */

function renderCardsSection(section) {
  const items =
    Array.isArray(section.items)
      ? section.items
      : [];

  if (!items.length) return "";

  return `
    <section class="case-section case-cards">

      <div class="case-section-intro">

        ${
          section.heading
            ? `
              <h2>
                ${escapeHTML(section.heading)}
              </h2>
            `
            : ""
        }

        ${
          section.text
            ? `
              <div class="case-copy">
                ${paragraphText(section.text)}
              </div>
            `
            : ""
        }

      </div>


      <div class="case-card-grid">

        ${items.map((item, index) => `
          <article class="case-card">

            ${
              item.image
                ? `
                  <div class="case-card-image">

                    <img
                      src="${escapeHTML(item.image)}"
                      alt="${escapeHTML(item.title || "")}"
                      loading="lazy"
                    >

                  </div>
                `
                : `
                  <div class="case-card-number">
                    ${String(index + 1).padStart(2, "0")}
                  </div>
                `
            }

            ${
              item.title
                ? `
                  <h3>
                    ${escapeHTML(item.title)}
                  </h3>
                `
                : ""
            }

            ${
              item.text
                ? `
                  <div class="case-card-copy">
                    ${paragraphText(item.text)}
                  </div>
                `
                : ""
            }

          </article>
        `).join("")}

      </div>

    </section>
  `;
}


/* ---------------------------------------------------------
   GALLERY
--------------------------------------------------------- */

function renderGallerySection(section) {
  const images =
    Array.isArray(section.images)
      ? section.images
      : [];

  if (!images.length) return "";

  return `
    <section class="case-section case-gallery">

      ${
        section.heading || section.text
          ? `
            <div class="case-section-intro">

              ${
                section.heading
                  ? `
                    <h2>
                      ${escapeHTML(section.heading)}
                    </h2>
                  `
                  : ""
              }

              ${
                section.text
                  ? `
                    <div class="case-copy">
                      ${paragraphText(section.text)}
                    </div>
                  `
                  : ""
              }

            </div>
          `
          : ""
      }


      <div class="case-gallery-grid">

        ${images.map((item) => `
          <figure class="case-gallery-item">

            <img
              src="${escapeHTML(item.image)}"
              alt="${escapeHTML(item.caption || "")}"
              loading="lazy"
            >

            ${
              item.caption
                ? `
                  <figcaption>
                    ${escapeHTML(item.caption)}
                  </figcaption>
                `
                : ""
            }

          </figure>
        `).join("")}

      </div>

    </section>
  `;
}


/* ---------------------------------------------------------
   FEATURE
--------------------------------------------------------- */

function renderFeatureSection(section) {
  return `
    <section class="case-section case-feature">

      <div class="case-feature-inner">

        <div class="case-feature-content">

          ${
            section.eyebrow
              ? `
                <div class="case-feature-eyebrow">
                  ${escapeHTML(section.eyebrow)}
                </div>
              `
              : ""
          }

          ${
            section.heading
              ? `
                <h2>
                  ${escapeHTML(section.heading)}
                </h2>
              `
              : ""
          }

          ${
            section.text
              ? `
                <div class="case-feature-copy">
                  ${paragraphText(section.text)}
                </div>
              `
              : ""
          }

        </div>


        ${
          section.image
            ? `
              <div class="case-feature-image">

                <img
                  src="${escapeHTML(section.image)}"
                  alt="${escapeHTML(section.heading || "")}"
                  loading="lazy"
                >

              </div>
            `
            : ""
        }

      </div>

    </section>
  `;
}


/* =========================================================
   LEGACY PROJECT SECTIONS

   This keeps Freedom and older content working.

   Old sections only had:
   heading
   text
   image
========================================================= */

function renderLegacySection(section) {
  if (section.image) {
    return renderTextImageSection({
      ...section,
      imagePosition: "right"
    });
  }

  return renderTextSection(section);
}


/* =========================================================
   SECTION CONTROLLER
========================================================= */

function renderSection(section) {
  if (!section) return "";

  /*
    Decap list "types" normally saves the selected
    type in the `type` property.

    Depending on configuration/version it may also
    use `name`.

    We support both.
  */

  const type =
    section.type ||
    section.name ||
    "";


  switch (type) {

    case "text":
      return renderTextSection(section);


    case "text_image":
      return renderTextImageSection(section);


    case "full_image":
      return renderFullImageSection(section);


    case "two_columns":
      return renderTwoColumnsSection(section);


    case "cards":
      return renderCardsSection(section);


    case "gallery":
      return renderGallerySection(section);


    case "feature":
      return renderFeatureSection(section);


    default:
      return renderLegacySection(section);

  }
}


/* =========================================================
   HOME
========================================================= */

async function home() {
  const app = document.getElementById("app");

  const site = await loadSite();
  const projects = await loadProjects();

  if (!site) {
    app.innerHTML = `
      <div class="loading">
        Could not load the website.
      </div>
    `;

    return;
  }

  setTheme(site);


  const heroImage =
    site.images?.hero ||
    site.hero ||
    "";


  const aboutImage =
    site.images?.about ||
    "";


  const contactImage =
    site.images?.contact ||
    "";


  app.innerHTML = `

    ${menu(site.siteTitle)}


    <header
      class="hero"
      ${
        heroImage
          ? `
            style="
              background-image:
                linear-gradient(
                  rgba(0,0,0,0.10),
                  rgba(0,0,0,0.10)
                ),
                url('${escapeHTML(heroImage)}');
            "
          `
          : ""
      }
    >

      <div class="hero-overlay"></div>

      <div class="wrap hero-inner">

        <div class="hero-brand">
          ${escapeHTML(site.siteTitle || "")}
        </div>

        <div class="hero-copy">

          <h1>
            ${escapeHTML(site.heroTitle || "")}
          </h1>

          ${
            site.heroSubtitle
              ? `
                <p>
                  ${escapeHTML(site.heroSubtitle)}
                </p>
              `
              : ""
          }

        </div>

      </div>

    </header>


    <section class="statement">

      <div class="wrap statement-inner">

        <h2>
          ${escapeHTML(site.statement || "")}
        </h2>

        ${
          site.services
            ? `
              <div class="statement-services">
                ${paragraphText(site.services)}
              </div>
            `
            : ""
        }

      </div>

    </section>


    <section
      class="projects"
      id="projects"
    >

      <div class="wrap">

        <div class="section-heading">

          <h2>
            ${escapeHTML(site.projectsHeading || "Selected Work")}
          </h2>

          ${
            site.projectsIntro
              ? `
                <p class="projects-intro">
                  ${escapeHTML(site.projectsIntro)}
                </p>
              `
              : ""
          }

          ${
            site.projectsBody
              ? `
                <div class="projects-body">
                  ${paragraphText(site.projectsBody)}
                </div>
              `
              : ""
          }

        </div>


        <div class="projects-grid">

          ${projects
            .filter((project) => project.featured !== false)
            .map((project) => `
              <article class="project-card">

                <a
                  href="/?project=${encodeURIComponent(project.slug)}"
                  class="project-card-link"
                >

                  <div class="project-image">

                    ${
                      project.cover
                        ? `
                          <img
                            src="${escapeHTML(project.cover)}"
                            alt="${escapeHTML(project.title)}"
                            loading="lazy"
                          >
                        `
                        : ""
                    }

                  </div>


                  <div class="project-info">

                    <div>

                      <h3>
                        ${escapeHTML(project.title)}
                      </h3>

                      ${
                        project.category
                          ? `
                            <p>
                              ${escapeHTML(project.category)}
                            </p>
                          `
                          : ""
                      }

                    </div>


                    <span
                      class="project-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>

                  </div>

                </a>

              </article>
            `)
            .join("")}

        </div>

      </div>

    </section>


    <section
      class="about"
      id="about"
    >

      <div class="wrap about-grid">

        <div class="about-copy">

          <div class="section-label">
            ${escapeHTML(site.aboutHeading || "About")}
          </div>

          ${
            site.aboutLead
              ? `
                <h2>
                  ${escapeHTML(site.aboutLead)}
                </h2>
              `
              : ""
          }

          ${
            site.aboutBody
              ? `
                <div class="about-body">
                  ${paragraphText(site.aboutBody)}
                </div>
              `
              : ""
          }

        </div>


        ${
          aboutImage
            ? `
              <div class="about-image">

                <img
                  src="${escapeHTML(aboutImage)}"
                  alt="Petra"
                  loading="lazy"
                >

              </div>
            `
            : ""
        }

      </div>

    </section>


    <section
      class="contact"
      id="contact"
    >

      <div class="wrap">

        <div class="contact-copy">

          <div class="section-label">
            ${escapeHTML(site.contactHeading || "Contact")}
          </div>

          ${
            site.contactText
              ? `
                <h2>
                  ${escapeHTML(site.contactText)}
                </h2>
              `
              : ""
          }

          ${contactIcons(site)}

        </div>


        ${
          contactImage
            ? `
              <img
                class="contact-img"
                src="${escapeHTML(contactImage)}"
                alt=""
                loading="lazy"
              >
            `
            : ""
        }

      </div>

    </section>


    <footer class="footer">

      <div class="wrap footer-inner">

        <div>
          ${escapeHTML(site.siteTitle || "The Studio by Petra")}
        </div>

        <div>
          ${escapeHTML(site.copyright || "")}
        </div>

      </div>

    </footer>
  `;


  activateMenu();
}


/* =========================================================
   PROJECT PAGE
========================================================= */

async function project(slug) {
  const app = document.getElementById("app");

  const [site, projectData] =
    await Promise.all([
      loadSite(),
      loadProject(slug)
    ]);


  if (!projectData) {
    app.innerHTML = `
      <main class="project-not-found">

        <div class="wrap">

          <h1>
            Project not found.
          </h1>

          <a href="/">
            Back to The Studio
          </a>

        </div>

      </main>
    `;

    return;
  }


  if (site) {
    setTheme(site);
  }


  const sections =
    Array.isArray(projectData.sections)
      ? projectData.sections
      : [];


  app.innerHTML = `

    ${menu(site?.siteTitle || "The Studio by Petra")}


    <main class="case-study">


      <header class="case-hero">

        <div class="wrap">

          <a
            class="case-back"
            href="/#projects"
          >
            ← Back to work
          </a>


          ${
            projectData.category
              ? `
                <div class="case-category">
                  ${escapeHTML(projectData.category)}
                </div>
              `
              : ""
          }


          <h1>
            ${escapeHTML(projectData.title || "")}
          </h1>


          ${
            projectData.intro
              ? `
                <div class="case-intro">
                  ${paragraphText(projectData.intro)}
                </div>
              `
              : ""
          }

        </div>

      </header>


      ${
        projectData.cover
          ? `
            <section class="case-cover">

              <img
                src="${escapeHTML(projectData.cover)}"
                alt="${escapeHTML(projectData.title || "")}"
              >

            </section>
          `
          : ""
      }


      <div class="case-content">

        ${sections
          .map((section) => renderSection(section))
          .join("")}

      </div>


      <section class="case-end">

        <div class="wrap">

          <a
            href="/#projects"
            class="case-end-link"
          >
            Back to selected work
            <span>↗</span>
          </a>

        </div>

      </section>


    </main>


    <footer class="footer">

      <div class="wrap footer-inner">

        <div>
          ${escapeHTML(
            site?.siteTitle ||
            "The Studio by Petra"
          )}
        </div>

        <div>
          ${escapeHTML(
            site?.copyright ||
            "© 2026 Petra Moreno"
          )}
        </div>

      </div>

    </footer>
  `;


  activateMenu();

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
}


/* =========================================================
   ROUTER
========================================================= */

async function start() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const projectSlug =
    params.get("project");


  if (projectSlug) {
    await project(projectSlug);
  } else {
    await home();
  }
}


start();
