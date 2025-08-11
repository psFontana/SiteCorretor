window.onload = async () => {
  const auth0 = await createAuth0Client({
    domain: "dev-cbwsq4qtummqvn4c.us.auth0.com",
    client_id: "rPs2U7DJJNYYRh0IGUypS97fqL1XBUWi",
    redirect_uri: "https://sergiocorretor.netlify.app/admin.html",
  });

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/admin.html");
  }

  const isAuthenticated = await auth0.isAuthenticated();

  if (!isAuthenticated) {
    await auth0.loginWithRedirect();
    return;
  }

  const user = await auth0.getUser();

  const roles = user["https://sergiocorretor.app/claims/roles"] || [];
  console.log("Usuário não é um administrador:", user);

  if (!roles.includes("admin")) {
    alert("Você não tem permissão para acessar esta página.");
    window.location.href = "/";
  }

  // Carregar imóveis
  fetch("../imoveis.json")
    .then((res) => res.json())
    .then((imoveis) => {
      const lista = document.getElementById("lista-imoveis");
      if (!lista) return;

      imoveis.forEach((imovel) => {
        lista.innerHTML += gerarCard(imovel);
      });
    });

  // Função para gerar cards
  function gerarCard(imovel) {
    return `
      <div class="col-md-4">
        <div class="card h-100">
          <div id="carousel-${
            imovel.id
          }" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${imovel.imagens
                .map(
                  (img, index) => `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                  <img src="../public/${img}" class="d-block w-100" alt="Imagem imóvel">
                </div>
              `
                )
                .join("")}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${
              imovel.id
            }" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${
              imovel.id
            }" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Próximo</span>
            </button>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${imovel.titulo}</h5>
            <p class="card-text">${imovel.cidade} - ${imovel.bairro}</p>
            <p class="card-text fw-bold">R$${imovel.preco}</p>
            <button class="btn btn-warning mt-auto" onclick="atualizarImovel(${
              imovel.id
            })">Atualizar</button>
            <button class="btn btn-danger mt-auto" onclick="deletarImovel(${
              imovel.id
            })">Deletar</button>
          </div>
        </div>
      </div>
    `;
  }

  // Outras funções
  window.adicionarImovel = () => {
    // Lógica para adicionar imóvel
  };

  window.atualizarImovel = (id) => {
    // Lógica para atualizar imóvel
  };

  window.deletarImovel = (id) => {
    // Lógica para deletar imóvel
  };
};
