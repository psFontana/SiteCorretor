// Carregar imóveis de imoveis.json
fetch("imoveis.json")
  .then((res) => res.json())
  .then((imoveis) => {
    const carouselContent = document.getElementById("carousel-content");

    // Preencher o carrossel
    imoveis.forEach((imovel, index) => {
      const item = `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <img src="${imovel.imagem}" class="d-block" alt="${imovel.titulo}">
        </div>
      `;
      carouselContent.innerHTML += item;
    });
  });
// if (window.innerWidth > 768) {
//   new fullpage("#fullpage", {
//     scrollBar: true,
//     navigation: true,
//     anchors: ["home", "sobre", "contato"],
//     menu: false,
//     afterLoad: function (origin, destination, direction) {
//       if (destination.index === 0) {
//         $(".header-links i").css("color", "white");
//       } else {
//         $(".header-links i").css("color", "black");
//       }
//     },
//   });
// } else {
//   console.log("FullPage não ativado (mobile)");
// }

if (window.innerWidth > 768) {
  let essabosta = document.createElement("script");
  essabosta.src =
    "https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/4.0.14/fullpage.min.js";
  document.head.appendChild(essabosta);
}

$(document).ready(function () {
  // 1) typing animation
  (function ($) {
    $.fn.writeText = function (content) {
      var contentArray = content.split(""),
        current = 0,
        elem = this;
      setInterval(function () {
        if (current < contentArray.length) {
          elem.text(elem.text() + contentArray[current++]);
        }
      }, 80);
    };
  })(jQuery);

  $("#holder").writeText("WEB DESIGNER + FRONT-END DEVELOPER");

  // 2) wow.js
  new WOW().init();

  // 3) nav-screen toggle
  $(".menu-toggle").click(function () {
    $(".nav-screen").css("right", "0");
    $("body").css("right", "285px");
  });

  $(".menu-close, .nav-links a").click(function () {
    $(".nav-screen").css("right", "-285px");
    $("body").css("right", "0");
  });

  // 4) fullPage.js
  new fullpage("#fullpage", {
    scrollBar: true,
    navigation: true,
    anchors: ["home", "sobre", "contato"],
    menu: false,
    afterLoad: function (origin, destination, direction) {
      // muda estilo de header-links conforme seção
      if (destination.index === 0) {
        $(".header-links i").css("color", "white");
      } else {
        $(".header-links i").css("color", "black");
      }
    },
  });

  // 5) smooth anchors (caso use links normais)
  $('a[href*="#"]')
    .not('[href="#"]')
    .click(function () {
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

  // 6) AJAX form
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

// Remover watermark do fullPage.js
// setTimeout(() => {
//   const watermark = document.querySelector(".fp-watermark");
//   if (watermark) {
//     watermark.remove();
//   }
// }, 100);
