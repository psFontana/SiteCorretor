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
