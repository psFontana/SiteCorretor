let fullpageInstance = null;
const mobileBreakpoint = 768;

function handleFullPageLoad() {
  if (window.innerWidth > mobileBreakpoint) {
    if (!fullpageInstance) {
      let fullpageScript = document.createElement("script");
      fullpageScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/4.0.14/fullpage.min.js";
      fullpageScript.onload = function () {
        fullpageInstance = new fullpage("#fullpage", {
          anchors: ["home", "about-us", "contact", "footer"],
          navigation: true,
          navigationTooltips: ["Home", "About Us", "Contact", "Footer"],
          scrollingSpeed: "486",
          fitToSectionDelay: "600",
          loopHorizontal: false,
          continuousVertical: true,
          scrollOverflow: false,
          recordHistory: false,
          controlArrows: false,
          lazyLoading: false,
          afterLoad: function (origin, destination, direction) {
            if (destination.index === 0) {
              $(".header-links i").css("color", "white");
            } else {
              $(".header-links i").css("color", "black");
            }
          },
        });

        $(".nav-links a")
          .off("click")
          .on("click", function (e) {
            e.preventDefault();
            if (fullpageInstance) {
              const anchor = $(this).attr("href").substring(1);
              fullpageInstance.silentMoveTo(anchor);
            }
            $(".nav-screen").css("right", "-285px");
            $("body").css("right", "0");
          });
      };
      document.head.appendChild(fullpageScript);
    }
  } else {
    if (fullpageInstance) {
      fullpageInstance.destroy("all");
      fullpageInstance = null;

      $('a[href*="#"]')
        .not('[href="#"]')
        .off("click")
        .on("click", function (e) {
          if (
            location.pathname.replace(/^\//, "") ===
              this.pathname.replace(/^\//, "") &&
            location.hostname === this.hostname
          ) {
            var target = $(this.hash);
            target = target.length
              ? target
              : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
              $("html, body").animate({ scrollTop: target.offset().top }, 700);
              return false;
            }
          }
        });
    }
  }
}

handleFullPageLoad();

let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleFullPageLoad, 200);
});

$(document).ready(function () {
  fetch("imoveis.json")
    .then((res) => res.json())
    .then((imoveis) => {
      const carouselContent = document.getElementById("carousel-content");
      imoveis.forEach((imovel, index) => {
        const item = `
          <div class="carousel-item ${index === 0 ? "active" : ""}">
            <img src="${imovel.imagem}" class="d-block" alt="${imovel.titulo}">
          </div>
        `;
        carouselContent.innerHTML += item;
      });
    });

  (function ($) {
    $.fn.writeText = function (content) {
      var contentArray = content.split(""),
        current = 0,
        elem = this;
      var intervalId = setInterval(function () {
        if (current < contentArray.length) {
          elem.text(elem.text() + contentArray[current++]);
        } else {
          clearInterval(intervalId);
        }
      }, 80);
    };
  })(jQuery);

  $("#holder").writeText("WEB DESIGNER + FRONT-END DEVELOPER");

  new WOW().init();

  $(".menu-toggle").click(function () {
    $(".nav-screen").css("right", "0");
    $("body").css("right", "285px");
  });

  $(".menu-close, .nav-links a").click(function () {
    $(".nav-screen").css("right", "-285px");
    $("body").css("right", "0");
  });

  var form = $("#ajax-contact");
  var formMessages = $("#form-messages");

  $(form).submit(function (e) {
    e.preventDefault();
    var formData = $(form).serialize();

    $.ajax({
      type: "POST",
      url: $(form).attr("action"),
      data: formData,
    })
      .done(function (response) {
        formMessages.removeClass("error").addClass("success");
        formMessages.text(response);
        $(form).find("input, textarea").val("");
      })
      .fail(function (data) {
        formMessages.removeClass("success").addClass("error");
        formMessages.text(data.responseText || "Erro ao enviar a mensagem.");
      });
  });
});
