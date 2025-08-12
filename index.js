import { db } from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";

let fullpageInstance = null;
const mobileBreakpoint = 768;

function handleFullPageLoad() {
  if (window.innerWidth > mobileBreakpoint) {
    if (!fullpageInstance) {
      let script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/4.0.10/fullpage.min.js";
      script.onload = () => {
        fullpageInstance = new fullpage("#fullpage", {
          anchors: ["home", "sobre", "contato", "footer"],
          navigation: true,
          navigationTooltips: ["Home", "Sobre", "Contato", "Footer"],
          scrollingSpeed: 1000,
          fitToSectionDelay: 1000,
          loopHorizontal: false,
          continuousVertical: true,
          scrollOverflow: false,
          recordHistory: true,
          controlArrows: true,
          lazyLoading: false,

          onLeave(origin, destination) {
            // Animar elementos que estão saindo
            if (origin.anchor === "home") {
              animateOut("#carouselExample", -innerWidth / 2);
              animateOut("#home-texto", innerWidth / 2);
            }
            if (origin.anchor === "sobre") {
              animateOut("#sobre-imagem", -innerWidth / 2);
              animateOut("#sobre-texto", innerWidth / 2);
            }

            // Animar elementos que estão entrando
            if (destination.anchor === "home") {
              animateIn("#carouselExample", -innerWidth / 2);
              animateIn("#home-texto", innerWidth / 2);
            }
            if (destination.anchor === "sobre") {
              animateIn("#sobre-imagem", -innerWidth / 2);
              animateIn("#sobre-texto", innerWidth / 2);
            }
          },
        });

        // Reanexa os eventos do menu
      };
      document.head.appendChild(script);
    }
  } else {
    if (fullpageInstance) {
      fullpageInstance.destroy("all");
      fullpageInstance = null;

      // Smooth scroll para mobile
      document
        .querySelectorAll('a[href*="#"]:not([href="#"])')
        .forEach((link) => {
          link.removeEventListener("click", smoothScrollHandler);
          link.addEventListener("click", smoothScrollHandler);
        });
    }
  }
}

// Helpers GSAP animados
function animateIn(selector, fromX = 100) {
  const el = document.querySelector(selector);
  if (el) {
    gsap.fromTo(
      el,
      { x: `${fromX}%`, opacity: 0 },
      { x: "0%", opacity: 1, duration: 1, ease: "power2.out" }
    );
  }
}

function animateOut(selector, toX = 100) {
  const el = document.querySelector(selector);
  if (el) {
    gsap.to(el, { x: `${toX}%`, opacity: 0, duration: 1, ease: "power2.in" });
  }
}

// Menu lateral
function navLinkHandler(e) {
  e.preventDefault();
  if (fullpageInstance) {
    const anchor = this.getAttribute("href").substring(1);
    fullpageInstance.silentMoveTo(anchor);
  }
  document.querySelector(".nav-screen").style.right = "-285px";
  document.body.style.right = "0";
}

function smoothScrollHandler(e) {
  const locationPath = location.pathname.replace(/^\//, "");
  const thisPath = this.pathname.replace(/^\//, "");
  if (locationPath === thisPath && location.hostname === this.hostname) {
    const target = document.querySelector(this.hash);
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset,
        behavior: "smooth",
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleFullPageLoad();

  // Função assíncrona para buscar os imóveis do Firestore
  async function carregarImoveisDoFirestore() {
    try {
      const imoveisCollection = collection(db, "imoveis");
      const imoveisSnapshot = await getDocs(imoveisCollection);
      const imoveis = imoveisSnapshot.docs.map((doc) => doc.data());

      const carousel = document.getElementById("carousel-content");
      if (!carousel) return;

      carousel.innerHTML = ""; // Limpa o carrossel antes de popular

      imoveis.forEach((imovel, i) => {
        const item = `
          <div class="carousel-item ${i === 0 ? "active" : ""}">
            <img src="public/images/${
              imovel.imagens[0]
            }" class="d-block" alt="${imovel.titulo}">
          </div>`;
        carousel.innerHTML += item;
      });
    } catch (error) {
      console.error("Erro ao buscar imóveis do Firestore:", error);
    }
  }

  carregarImoveisDoFirestore();
});

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleFullPageLoad, 200);
});
