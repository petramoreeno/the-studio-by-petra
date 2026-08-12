const $ = (selector) => document.querySelector(selector);

async function getJSON(paths) {
  const options = Array.isArray(paths) ? paths : [paths];

  for (const path of options) {
    try {
      const response = await fetch(path);

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Could not load ${path}`, error);
    }
  }

  throw new Error(`Could not load: ${options.join(", ")}`);
}

function setTheme(site) {
  const colors = site.colors || {};
  const fonts = site.fonts || {};
  const root = document.documentElement.style;

  root.setProperty("--cream", colors.cream || "#E6DDCF");
  root.setProperty("--mustard", colors.mustard || "#DDB982");
  root.setProperty("--burgundy", colors.burgundy || "#7A4C4D");
  root.setProperty("--white", colors.warmWhite || "#F7F3ED");
  root.setProperty("--blue", colors.blue || "#69A8DA");

  root.setProperty(
    "--display",
    `"${fonts.display || "Bodoni Moda"}"`
  );

  root.setProperty(
    "--body",
    `"${fonts.body || "Libre Baskerville"}"`
  );
}

function menu(siteTitle = "The Studio by Petra") {
  return `
    <div class="menu" id="menu">
      <div class="menu-top">
        <a class="brand" href="/">${siteTitle}</a>

        <button
          class="close"
          onclick="toggleMenu()"
          aria-label="Close menu"
        >
          ×
        </button>
      </div>

      <nav>
        <a href="/#home" onclick="toggleMenu()">Home</a>
        <a href="/#projects" onclick="toggleMenu()">Projects</a>
        <a href="/#about" onclick="toggleMenu()">About me</a>
        <a href="/#contact" onclick="toggleMenu()">Contact</a>
      </nav>
    </div>
  `;
}

window.toggleMenu = function () {
  const menuElement = $("#menu");

  if (menuElement) {
    menuElement.classList.toggle("open");
  }
};

async function loadProject(slug) {
  return getJSON([
    `/content/projects/${slug}.json`,
    `/the-studio-by-petra-editable-cms/content/projects/${slug}.json`
  ]);
}

async function loadProjects() {
  const slugs = [
    "freedom-the-label",
    "musa-beer-on-tiktok"
  ];

  const results = await Promise.allSettled(
    slugs.map((slug) => loadProject(slug))
  );

  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
}

async function loadSite() {
  return getJSON([
    "/content/site.json",
    "/the-studio-by-petra-editable-cms/content/site.json"
  ]);
}


/* =========================================
   CONTACT ICONS
   ========================================= */

function contactIcons(site) {
  const email =
    site.email || "petra.moreno8@gmail.com";

  const instagram =
    site.instagram ||
    "https://www.instagram.com/petramoreeno/";

  const linkedin =
    site.linkedin ||
    "https://www.linkedin.com/in/petra-moreno-33b009131/";

  return `
    <div
      class="contact-links"
      aria-label="Contact links"
    >

      <!-- EMAIL -->

      <a
        class="contact-icon"
        href="mailto:${email}"
        aria-label="Email Petra"
        title="Email"
      >

        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="1"
          ></rect>

          <path
            d="M4 7l8 6 8-6"
          ></path>
        </svg>

      </a>


      <!-- INSTAGRAM -->

      <a
        class="contact-icon"
        href="${instagram}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Petra on Instagram"
        title="Instagram"
      >

        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
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
            class="svg-fill"
            cx="17.4"
            cy="6.7"
            r="1"
          ></circle>
        </svg>

      </a>


      <!-- LINKEDIN -->

      <a
        class="contact-icon"
        href="${linkedin}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Petra on LinkedIn"
        title="LinkedIn"
      >

        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >

          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
          ></rect>

          <path
            d="M7.5 10v7"
          ></path>

          <path
            d="M7.5 7.4v.1"
          ></path>

          <path
            d="M11 10v7"
          ></path>

          <path
            d="M11 13
               c0-2
               1.1-3.2
               2.8-3.2
               1.8 0
               2.7 1.2
               2.7 3.2
               V17"
          ></path>

        </svg>

      </a>

    </div>
  `;
}


/* =========================================
   HOME PAGE
   ========================================= */

async function home() {
  const [site, projects] = await Promise.all([
    loadSite(),
    loadProjects()
  ]);

  setTheme(site);

  document.title =
    site.siteTitle || "The Studio by Petra";

  const featuredProjects = projects.filter(
    (project) => project.featured !== false
  );

  $("#app").innerHTML = `

    ${menu(site.siteTitle)}

    <!-- HERO -->

    <header
      class="hero"
      id="home"
    >

      <div
        class="hero-media"
        style="
          background-image:
          url('${site.images?.hero || ""}')
        "
      ></div>

      <div class="hero-shade"></div>

      <div class="topbar">

        <a
          class="brand"
          href="#home"
        >
          ${site.siteTitle || "The Studio by Petra"}
        </a>

        <button
          class="hamb"
          onclick="toggleMenu()"
          aria-label="Open menu"
        ></button>

      </div>


      <div class="hero-copy">

        <h1>
          ${site.heroTitle || "The studio."}
        </h1>

        <p>
          ${site.heroSubtitle || "by Petra"}
        </p>

      </div>

    </header>


    <!-- STATEMENT -->

    <section
      class="section mustard statement-section"
    >

      <div class="wrap center">

        <h2 class="statement">
          ${
            site.statement ||
            "We are all creatives, and this is."
          }
        </h2>

        <div class="services">
          ${
            site.services ||
            "Communication Strategy | Brand Identity | Social Media Management | Community Management"
          }
        </div>

      </div>

    </section>


    <!-- PROJECTS -->

    <section
      class="section cream"
      id="projects"
    >

      <div class="wrap">

        <div class="eyebrow">
          ${
            site.projectsHeading ||
            "CONCEPT PROJECTS"
          }
        </div>


        <div class="lead">
          ${site.projectsIntro || ""}
        </div>


        <div class="bodycopy">
          ${site.projectsBody || ""}
        </div>


        <div class="projects-grid">

          ${featuredProjects
            .map(
              (project) => `

                <a
                  class="project-card"
                  href="/?project=${project.slug}"
                  style="
                    background-image:
                    url('${project.cover || ""}')
                  "
                >

                  <div
                    class="project-card-overlay"
                  ></div>


                  <div class="label">

                    ${project.title}

                    <span class="category">
                      ${project.category || ""}
                    </span>

                  </div>

                </a>

              `
            )
            .join("")}

        </div>

      </div>

    </section>


    <!-- ABOUT -->

    <section
      class="section cream"
      id="about"
    >

      <div class="wrap">

        <div class="eyebrow">
          ${
            site.aboutHeading ||
            "ABOUT ME"
          }
        </div>


        <div class="lead">
          ${site.aboutLead || ""}
        </div>


        <div class="bodycopy">
          ${site.aboutBody || ""}
        </div>


        ${
          site.images?.about
            ? `
              <img
                class="about-img"
                src="${site.images.about}"
                alt="About Petra"
              >
            `
            : ""
        }

      </div>

    </section>


    <!-- CONTACT -->

    <section
      class="section mustard"
      id="contact"
    >

      <div class="wrap">

        <div class="eyebrow">
          ${
            site.contactHeading ||
            "CONTACT ME"
          }
        </div>


        <div class="lead">
          ${site.contactText || ""}
        </div>


        ${contactIcons(site)}


        ${
          site.images?.contact
            ? `
              <img
                class="contact-img"
                src="${site.images.contact}"
                alt="Contact"
              >
            `
            : ""
        }

      </div>

    </section>


    <!-- FOOTER -->

    <footer class="footer cream">

      <div class="wrap footer-row">

        <div class="footer-brand">

          <span class="footer-logo">
            The Studio
          </span>

          <span>
            by Petra
          </span>

        </div>


        <div>

          ${
            site.copyright ||
            "© 2026 Petra Moreno. All Rights Reserved."
          }

        </div>

      </div>

    </footer>
  `;
}


/* =========================================
   PROJECT PAGE
   ========================================= */

async function project(slug) {
  const [site, project] = await Promise.all([
    loadSite(),
    loadProject(slug)
  ]);

  setTheme(site);

  document.title =
    `${project.title} — ${
      site.siteTitle || "The Studio by Petra"
    }`;


  $("#app").innerHTML = `

    ${menu(site.siteTitle)}


    <!-- PROJECT TOP BAR -->

    <header class="case-topbar">

      <a
        class="brand"
        href="/"
      >
        ${site.siteTitle || "The Studio by Petra"}
      </a>


      <button
        class="hamb"
        onclick="toggleMenu()"
        aria-label="Open menu"
      ></button>

    </header>


    <!-- PROJECT CONTENT -->

    <main class="case-study">


      <!-- PROJECT HERO -->

      <section class="case-hero cream">

        <div class="wrap">

          <a
            class="back"
            href="/#projects"
          >
            ← Back to projects
          </a>


          <div class="case-category">
            ${project.category || ""}
          </div>


          <h1 class="case-title">
            ${project.title}
          </h1>


          <div class="case-intro">
            ${project.intro || ""}
          </div>


          ${
            project.cover
              ? `
                <img
                  class="case-cover"
                  src="${project.cover}"
                  alt="${project.title}"
                >
              `
              : ""
          }

        </div>

      </section>


      <!-- PROJECT SECTIONS -->

      ${(project.sections || [])
        .map(
          (section, index) => `

            <section
              class="
                case-section
                ${
                  index % 2 === 0
                    ? "cream"
                    : "mustard"
                }
              "
            >

              <div
                class="wrap case-section-inner"
              >

                <h2>
                  ${section.heading || ""}
                </h2>


                <div
                  class="bodycopy case-text"
                >
                  ${(section.text || "")
                    .replace(/\n/g, "<br>")}
                </div>


                ${
                  section.image
                    ? `
                      <img
                        class="case-section-image"
                        src="${section.image}"
                        alt="${
                          section.heading ||
                          project.title
                        }"
                      >
                    `
                    : ""
                }

              </div>

            </section>

          `
        )
        .join("")}

    </main>


    <!-- PROJECT FOOTER -->

    <footer class="footer cream">

      <div class="wrap footer-row">

        <div class="footer-brand">

          <span class="footer-logo">
            The Studio
          </span>

          <span>
            by Petra
          </span>

        </div>


        <a href="/#projects">
          Explore more projects →
        </a>

      </div>

    </footer>
  `;
}


/* =========================================
   START WEBSITE
   ========================================= */

async function start() {
  const query =
    new URLSearchParams(
      window.location.search
    );

  const slug =
    query.get("project");

  try {

    if (slug) {
      await project(slug);
    } else {
      await home();
    }

  } catch (error) {

    console.error(error);

    $("#app").innerHTML = `

      <div class="loading">

        Something went wrong loading
        The Studio by Petra.

      </div>

    `;
  }
}

start();
