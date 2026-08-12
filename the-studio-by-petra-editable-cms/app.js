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
    `"${fonts.display || "DM Serif Display"}"`
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
        <button class="close" onclick="toggleMenu()" aria-label="Close menu">
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

async function home() {
  const [site, projects] = await Promise.all([
    loadSite(),
    loadProjects()
  ]);

  setTheme(site);
  document.title = site.siteTitle || "The Studio by Petra";

  const featuredProjects = projects.filter(
    (project) => project.featured !== false
  );

  $("#app").innerHTML = `
    ${menu(site.siteTitle)}

    <header class="hero" id="home">
      <div
        class="hero-media"
        style="background-image: url('${site.images?.hero || ""}')"
      ></div>

      <div class="hero-shade"></div>

      <div class="topbar">
        <a class="brand" href="#home">
          ${site.siteTitle || "The Studio by Petra"}
        </a>

        <button
          class="hamb"
          onclick="toggleMenu()"
          aria-label="Open menu"
        ></button>
      </div>

      <div class="hero-copy">
        <h1>${site.heroTitle || "The studio."}</h1>
        <p>${site.heroSubtitle || "by Petra"}</p>
      </div>
    </header>

    <section class="section mustard statement-section">
      <div class="wrap center">
        <h2 class="statement">
          ${site.statement || "We are all creatives, and this is."}
        </h2>

        <div class="services">
          ${
            site.services ||
            "Communication Strategy | Brand Identity | Social Media Management | Community Management"
          }
        </div>
      </div>
    </section>

    <section class="section cream" id="projects">
      <div class="wrap">
        <div class="eyebrow">
          ${site.projectsHeading || "CONCEPT PROJECTS"}
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
                  style="background-image: url('${project.cover || ""}')"
                >
                  <div class="project-card-overlay"></div>

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

    <section class="section cream" id="about">
      <div class="wrap">
        <div class="eyebrow">
          ${site.aboutHeading || "ABOUT ME"}
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

    <section class="section mustard" id="contact">
      <div class="wrap">
        <div class="eyebrow">
          ${site.contactHeading || "CONTACT ME"}
        </div>

        <div class="lead">
          ${site.contactText || ""}
        </div>

        <div class="contact-links">
          ${
            site.email
              ? `<a class="pill" href="mailto:${site.email}">Email</a>`
              : ""
          }

          ${
            site.instagram
              ? `<a class="pill" href="${site.instagram}" target="_blank">Instagram</a>`
              : ""
          }

          ${
            site.linkedin
              ? `<a class="pill" href="${site.linkedin}" target="_blank">LinkedIn</a>`
              : ""
          }
        </div>

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

    <footer class="footer cream">
      <div class="wrap footer-row">
        <div class="footer-brand">
          <span class="footer-logo">The Studio</span>
          <span>by Petra</span>
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

async function project(slug) {
  const [site, project] = await Promise.all([
    loadSite(),
    loadProject(slug)
  ]);

  setTheme(site);

  document.title = `${project.title} — ${
    site.siteTitle || "The Studio by Petra"
  }`;

  $("#app").innerHTML = `
    ${menu(site.siteTitle)}

    <header class="case-topbar">
      <a class="brand" href="/">
        ${site.siteTitle || "The Studio by Petra"}
      </a>

      <button
        class="hamb"
        onclick="toggleMenu()"
        aria-label="Open menu"
      ></button>
    </header>

    <main class="case-study">
      <section class="case-hero cream">
        <div class="wrap">

          <a class="back" href="/#projects">
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

      ${(project.sections || [])
        .map(
          (section, index) => `
            <section
              class="case-section ${
                index % 2 === 0 ? "cream" : "mustard"
              }"
            >
              <div class="wrap case-section-inner">

                <h2>
                  ${section.heading || ""}
                </h2>

                <div class="bodycopy case-text">
                  ${(section.text || "").replace(/\n/g, "<br>")}
                </div>

                ${
                  section.image
                    ? `
                      <img
                        class="case-section-image"
                        src="${section.image}"
                        alt="${section.heading || project.title}"
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

    <footer class="footer cream">
      <div class="wrap footer-row">
        <div class="footer-brand">
          <span class="footer-logo">The Studio</span>
          <span>by Petra</span>
        </div>

        <a href="/#projects">
          Explore more projects →
        </a>
      </div>
    </footer>
  `;
}

async function start() {
  const query = new URLSearchParams(window.location.search);
  const slug = query.get("project");

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
        Something went wrong loading The Studio by Petra.
      </div>
    `;
  }
}

start();
