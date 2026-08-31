// ---------- Hero spotlight ----------
const hero = document.querySelector(".hero");
const heroSpotlights = document.querySelectorAll(".hero-photo-spotlight");
if (hero && heroSpotlights.length && window.matchMedia("(hover: hover)").matches) {
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    heroSpotlights.forEach((el) => {
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });
}

// ---------- Sobre photo carousel ----------
const sobreArt = document.getElementById("sobreArt");
if (sobreArt) {
  const slides = [...sobreArt.querySelectorAll(".sobre-art-slide")];
  const dotsWrap = sobreArt.querySelector(".sobre-art-dots");
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("is-active");
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  let current = 0;
  const goTo = (index) => {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = index;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoplay = null;
  const startAutoplay = () => {
    if (slides.length <= 1 || reduceMotion) return;
    autoplay = setInterval(() => goTo((current + 1) % slides.length), 4000);
  };
  const restartAutoplay = () => {
    if (autoplay) clearInterval(autoplay);
    startAutoplay();
  };
  startAutoplay();

  const prevBtn = document.getElementById("sobrePrevBtn");
  const nextBtn = document.getElementById("sobreNextBtn");
  prevBtn.addEventListener("click", () => {
    goTo((current - 1 + slides.length) % slides.length);
    restartAutoplay();
  });
  nextBtn.addEventListener("click", () => {
    goTo((current + 1) % slides.length);
    restartAutoplay();
  });
}

// ---------- Hero text scroll-away ----------
const heroInner = document.querySelector(".hero-inner");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
if (hero && heroInner && !reduceMotionQuery.matches) {
  let heroTicking = false;
  const updateHeroScrollFade = () => {
    heroTicking = false;
    const heroHeight = hero.offsetHeight;
    const scrolled = Math.min(Math.max(window.scrollY, 0), heroHeight);
    const progress = Math.min(scrolled / (heroHeight * 0.14), 1);
    heroInner.style.transform = `translateY(${progress * -140}px)`;
    heroInner.style.opacity = String(1 - progress);
    heroInner.style.pointerEvents = progress > 0.5 ? "none" : "auto";
  };
  window.addEventListener(
    "scroll",
    () => {
      if (heroTicking) return;
      heroTicking = true;
      requestAnimationFrame(updateHeroScrollFade);
    },
    { passive: true }
  );
  updateHeroScrollFade();
}

// ---------- Header scroll state ----------
const siteHeader = document.querySelector(".site-header");
const updateHeaderScrolled = () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 40);
};
window.addEventListener("scroll", updateHeaderScrolled, { passive: true });
updateHeaderScrolled();

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ---------- Cursor glow (pillar cards + CTA panel + Como funciona) ----------
document.querySelectorAll(".pillar-card, .cta-panel, #como-funciona").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  });
});

// ---------- CTA role toggle ----------
const roleToggle = document.getElementById("roleToggle");
const perfilInput = document.getElementById("perfilInput");
if (roleToggle && perfilInput) {
  roleToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".role-btn");
    if (!btn) return;
    roleToggle.querySelectorAll(".role-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    perfilInput.value = btn.dataset.role;
  });
}

// ---------- Mobile nav ----------
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ---------- Steps reveal animation ----------
const stepEls = document.querySelectorAll(".step");
const stepObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = [...stepEls].indexOf(entry.target);
      setTimeout(() => entry.target.classList.add("in-view"), index * 100);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);
stepEls.forEach((el) => stepObserver.observe(el));

// ---------- Influencers data ----------
// Fotos em assets/influencers/<slug>.png. Categoria/seguidores/instagram
// só aparecem no verso do card para quem já tem esse dado confirmado.
const INSTAGRAM_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>`;

const MEDIAKIT_BASE = "https://mediakit.curtahub.com.br/pt-BR";

const INFLUENCERS = [
  { name: "André Scardovelli", categoria: "Entretenimento", seguidores: "1,8M" },
  { name: "Brazil Calisthenics", categoria: "Fitness", seguidores: "2,0M", mediaKit: "brazilcalisthenics" },
  { name: "Bruna Louise", categoria: "Comédia", seguidores: "6,1M" },
  { name: "Bruna Simek", categoria: "Família", seguidores: "2,1M", mediaKit: "brunasimek" },
  { name: "Camila Pudim", categoria: "Beleza", seguidores: "7,5M" },
  { name: "Carol Bresolin", categoria: "Entretenimento", seguidores: "4,9M", mediaKit: "carolbresolin" },
  { name: "Coração de Mami", categoria: "Família", seguidores: "1,3M", mediaKit: "coracaodemami" },
  { name: "Coração de Papi", categoria: "Família", seguidores: "346,8K", mediaKit: "coracaodepapi" },
  { name: "Corbucci", categoria: "Gastronomia", seguidores: "2,1M", mediaKit: "corbucci" },
  { name: "Curta na Mídia", categoria: "Imprensa", isPress: true },
  { name: "Deive Leonardo", categoria: "Espiritualidade", seguidores: "16,6M" },
  { name: "Isabella Mayeski", categoria: "Fitness", seguidores: "1,4M", mediaKit: "isabellamayeski" },
  { name: "Jan", categoria: "Humor", seguidores: "2,2M", mediaKit: "jancarlo_" },
  { name: "Juju Teófilo", categoria: "Kids", seguidores: "4,8M" },
  { name: "Kerb", categoria: "Humor", seguidores: "463,6K", mediaKit: "kerbitos" },
  { name: "Larissa Oliveira", categoria: "Humor", seguidores: "9,6M", mediaKit: "laoliveiraso" },
  { name: "Laura Brito", categoria: "Moda", seguidores: "6,4M" },
  { name: "Laurinha", categoria: "Humor", seguidores: "3,5M", mediaKit: "laurinha" },
  { name: "Luis Felp", categoria: "Lifestyle", seguidores: "1,4M", mediaKit: "luisfelp" },
  { name: "Maicon Küster", categoria: "Humor", seguidores: "1,8M", mediaKit: "maiconkuster" },
  { name: "Marina Baldin", categoria: "Entretenimento", seguidores: "2,1M" },
  { name: "Matheus Alpes", categoria: "Família", seguidores: "2,2M", mediaKit: "matheusalpes" },
  { name: "Melhores do Mundo", categoria: "Comédia", seguidores: "625K" },
  { name: "Mia Carvalho", categoria: "Gaming", seguidores: "1,2M", mediaKit: "miacarvalho" },
  { name: "Rafael Gratta", categoria: "Saúde Mental", seguidores: "3,5M", mediaKit: "rafaelgratta" },
  { name: "Renato Albani", categoria: "Comédia", seguidores: "4,9M" },
  { name: "Simone Mendes", categoria: "Música", seguidores: "40M" },
  { name: "Spider Slack", categoria: "Entretenimento", seguidores: "3,7M", mediaKit: "spiderslack" },
  { name: "Thais Linares", categoria: "Entretenimento", seguidores: "7,5M", mediaKit: "thaislinares" },
  { name: "Tiago NFT", categoria: "Humor", seguidores: "1,8M", mediaKit: "tiagonft" },
  { name: "TinTim", categoria: "Autoconhecimento", seguidores: "741,4K", mediaKit: "tintimpedro" },
  { name: "Waguinho", categoria: "Humor", seguidores: "6,1M", mediaKit: "waguinho" },
  { name: "Whindersson Nunes", categoria: "Comédia", seguidores: "54,4M" },
  { name: "Yasmin Amorim", categoria: "Maquiagem", seguidores: "689K" },
  { name: "Zeka Ramos", categoria: "Fitness", seguidores: "2,6M", mediaKit: "zkramos" },
];

function followersValue(seguidores) {
  if (!seguidores) return -1;
  const match = seguidores.match(/^([\d.,]+)\s*(K|M)?$/i);
  if (!match) return -1;
  const num = parseFloat(match[1].replace(",", "."));
  const suffix = (match[2] || "").toUpperCase();
  if (suffix === "M") return num * 1_000_000;
  if (suffix === "K") return num * 1_000;
  return num;
}

INFLUENCERS.sort((a, b) => followersValue(b.seguidores) - followersValue(a.seguidores));

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function initials(name) {
  const words = name.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const carousel = document.getElementById("infCarousel");

carousel.innerHTML = INFLUENCERS.map((inf) => {
  const slug = slugify(inf.name);

  let backBody;
  if (inf.isPress) {
    backBody = `
      <p class="inf-back-tag">Grupo Curta Hub</p>
      <p class="inf-back-category">Reportagens e menções sobre a Curta na imprensa</p>
      <a class="inf-back-btn" href="https://curtahub.com.br/" target="_blank" rel="noopener">Ver Curta Hub</a>
    `;
  } else if (inf.seguidores) {
    backBody = `
      ${inf.categoria ? `<p class="inf-back-category">${inf.categoria}</p>` : ""}
      <div class="inf-back-metric">
        ${INSTAGRAM_ICON}
        <span class="inf-back-number">${inf.seguidores}</span>
      </div>
      <p class="inf-back-label">seguidores</p>
      <p class="inf-back-tag">Elenco MVMT</p>
      <a class="inf-back-btn" href="${inf.mediaKit ? `${MEDIAKIT_BASE}/${inf.mediaKit}` : MEDIAKIT_BASE}" target="_blank" rel="noopener">Ver Mídia Kit Completo</a>
    `;
  } else {
    backBody = `
      <p class="inf-back-tag">Elenco MVMT</p>
      <p class="inf-back-category">Métricas em atualização</p>
      <a class="inf-back-btn" href="${MEDIAKIT_BASE}" target="_blank" rel="noopener">Ver Mídia Kit Completo</a>
    `;
  }

  return `
    <div class="inf-card">
      <div class="inf-flip">
        <div class="inf-flip-inner">
          <div class="inf-face inf-face-front">
            <span class="inf-initials">${initials(inf.name)}</span>
            <img src="assets/influencers/${slug}.png" alt="${inf.name}"
                 loading="lazy" onerror="this.remove()">
            <div class="inf-face-overlay">
              <p class="inf-face-name">${inf.name}</p>
              ${inf.categoria ? `<p class="inf-face-category">${inf.categoria}</p>` : ""}
            </div>
          </div>
          <div class="inf-face inf-face-back">
            <p class="inf-back-name">${inf.name}</p>
            ${backBody}
          </div>
        </div>
      </div>
    </div>
  `;
}).join("");

if (window.matchMedia("(hover: none)").matches) {
  carousel.querySelectorAll(".inf-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("is-flipped"));
  });
}

const infCount = document.getElementById("infCount");
if (infCount) {
  const creatorCount = INFLUENCERS.filter((inf) => !inf.isPress).length;
  infCount.textContent = `${creatorCount} criadores no elenco`;
}

// ---------- Carousel arrows ----------
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function scrollByCards(direction) {
  const card = carousel.querySelector(".inf-card");
  if (!card) return;
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const cardWidth = card.getBoundingClientRect().width + 16; // gap
  const cardsPerStep = isMobile ? 1 : 3;
  carousel.scrollBy({ left: direction * cardWidth * cardsPerStep, behavior: "smooth" });
}

prevBtn.addEventListener("click", () => scrollByCards(-1));
nextBtn.addEventListener("click", () => scrollByCards(1));

// ---------- Contact form (front-end only) ----------
// Ligue este form a um backend/serviço de e-mail antes de publicar em produção.
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  formSuccess.hidden = false;
  contactForm.reset();
});
