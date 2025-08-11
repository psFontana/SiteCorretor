// Formata número para real
function formatarPreco(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

const detalhesEl = document.getElementById("detalhes-imovel");
const loadingEl = document.getElementById("loading");

if (!detalhesEl || !loadingEl) {
  console.error("Não encontrou #detalhes-imovel ou #loading no DOM");
}

fetch("imoveis.json")
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then((imoveis) => {
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
      detalhesEl.innerHTML =
        '<div class="alert alert-warning">ID do imóvel não informado.</div>';
      return;
    }

    const imovel = imoveis.find((i) => String(i.id) === id);
    if (!imovel) {
      detalhesEl.innerHTML =
        '<div class="alert alert-danger">Imóvel não encontrado.</div>';
      return;
    }

    // Garante sempre um array de imagens
    const imagens = Array.isArray(imovel.imagens)
      ? imovel.imagens
      : imovel.imagem
      ? [imovel.imagem]
      : [];

    // Monta itens do carousel
    const itensCarousel = imagens
      .map(
        (url, idx) => `
      <div class="carousel-item ${idx === 0 ? "active" : ""}">
        <img src="${url}" class="d-block w-100" alt="Foto ${idx + 1}">
      </div>
    `
      )
      .join("");

    const carouselHTML = imagens.length
      ? `<div id="carouselImovel" class="carousel slide mb-4" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${itensCarousel}
            </div>
            <button class="carousel-control-prev" data-bs-target="#carouselImovel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" data-bs-target="#carouselImovel" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>`
      : `<div class="alert alert-secondary mb-4">Nenhuma imagem disponível.</div>`;

    detalhesEl.innerHTML = `
      <h2>${imovel.titulo}</h2>
      ${carouselHTML}
      <p><strong>Preço:</strong> ${formatarPreco(imovel.preco)}</p>
      <p><strong>Localização:</strong> ${imovel.cidade} - ${imovel.bairro}</p>
      <p><strong>Descrição:</strong> ${imovel.descricao}</p>
      <a href="https://wa.me/5546999379268?text=${encodeURIComponent(
        "Olá, tenho interesse no imóvel " + imovel.titulo
      )}"
          target="_blank"
          class="btn btn-success">
        Falar sobre este imóvel
      </a>
    `;
  })
  .catch((err) => {
    console.error("Erro no fetch ou processamento:", err);
    detalhesEl.innerHTML = `
      <div class="alert alert-danger">
        Ocorreu um erro ao carregar os detalhes: ${err.message}
      </div>
    `;
  })
  .finally(() => {
    if (loadingEl) loadingEl.remove();
  });
