// Carregar imóveis na página de listagem
fetch("public/imoveis.json")
  .then((res) => res.json())
  .then((imoveis) => {
    const lista = document.getElementById("lista-imoveis");
    if (!lista) return;

    imoveis.forEach((imovel) => {
      lista.innerHTML += gerarCard(imovel);
    });
  });

// Gerar card para cada imóvel
function gerarCard(imovel) {
  return `
    <div class="col-md-4">
      <div class="card h-100">
        <img src="public/${imovel.imagens[0]}" class="card-img-top" alt="Imagem imóvel">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${imovel.titulo}</h5>
          <p class="card-text">${imovel.cidade} - ${imovel.bairro}</p>
          <p class="card-text fw-bold">R$${imovel.preco}</p>
          <a href="imovel.html?id=${imovel.id}" class="btn btn-primary mt-auto">Ver mais</a>
        </div>
      </div>
    </div>
  `;
}
