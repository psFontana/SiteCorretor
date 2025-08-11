window.addEventListener("DOMContentLoaded", async () => {
  let auth0;

  // Utilitários de log para padronizar mensagens
  const log = {
    info: (...a) => console.info("[ADMIN] ℹ️", ...a),
    warn: (...a) => console.warn("[ADMIN] ⚠️", ...a),
    error: (...a) => console.error("[ADMIN] ❌", ...a),
  };

  try {
    // 1) Inicializa Auth0
    log.info("Inicializando Auth0...");
    auth0 = await createAuth0Client({
      domain: "dev-cbwsq4qtummqvn4c.us.auth0.com",
      client_id: "rPs2U7DJJNYYRh0IGUypS97fqL1XBUWi",
      // Redireciona de volta para a própria página admin.html
      redirect_uri: `${window.location.origin}/admin.html`,
      cacheLocation: "memory", // padrão; pode ser "localstorage" se precisar de sessão persistente
    });

    // 2) Trata retorno do Auth0 (code/state no callback)
    const hasAuthParams =
      window.location.search.includes("code=") &&
      window.location.search.includes("state=");
    if (hasAuthParams) {
      log.info("Callback detectado. Processando retorno de autenticação...");
      try {
        const { appState } = await auth0.handleRedirectCallback();
        log.info("Callback processado com sucesso.", { appState });
      } catch (err) {
        log.error("Falha ao processar callback de autenticação.", err);
        alert("Não foi possível concluir o login. Tente novamente.");
      } finally {
        // Remove query params da URL
        window.history.replaceState({}, document.title, "/admin.html");
      }
    }

    // 3) Verifica autenticação
    const isAuthenticated = await auth0.isAuthenticated();
    log.info("Usuário autenticado?", isAuthenticated);

    if (!isAuthenticated) {
      log.info(
        "Usuário não autenticado. Redirecionando para a tela de login do Auth0..."
      );
      await auth0.loginWithRedirect();
      return; // a execução continuará após o redirect/callback
    }

    // 4) Obtém informações do usuário
    const user = await auth0.getUser();
    log.info("Usuário autenticado:", user);

    if (!user) {
      log.error("Auth0.getUser() retornou null/undefined.");
      alert("Não foi possível obter os dados do usuário. Tente novamente.");
      await auth0.logout({
        logoutParams: { returnTo: window.location.origin },
      });
      return;
    }

    // Opcional: apenas avisar se o e-mail não estiver verificado
    if (user.email && user.email_verified === false) {
      log.warn(`E-mail ${user.email} ainda não verificado no Auth0.`);
      // Se quiser bloquear usuários sem e-mail verificado, descomente:
      // alert("Seu e-mail ainda não foi verificado. Verifique-o para acessar a área administrativa.");
      // await auth0.logout({ logoutParams: { returnTo: window.location.origin } });
      // return;
    }

    // 5) Carrega os imóveis somente após autenticar
    await carregarImoveis();

    // 6) Disponibiliza funções globais (usadas pelos botões no HTML)
    window.adicionarImovel = () => {
      log.info("Adicionar imóvel: ação clicada (implemente a lógica aqui).");
    };

    window.atualizarImovel = (id) => {
      log.info(
        `Atualizar imóvel ${id}: ação clicada (implemente a lógica aqui).`
      );
    };

    window.deletarImovel = (id) => {
      log.info(
        `Deletar imóvel ${id}: ação clicada (implemente a lógica aqui).`
      );
    };

    // 7) Logout opcional (se quiser adicionar um botão no futuro)
    window.logout = async () => {
      log.info("Efetuando logout...");
      await auth0.logout({
        logoutParams: { returnTo: window.location.origin },
      });
    };
  } catch (err) {
    console.error("[ADMIN] ❌ Erro inesperado na inicialização:", err);
    alert(
      "Erro ao iniciar a área administrativa. Veja o console para detalhes."
    );
  }

  // --------- Funções auxiliares ---------

  async function carregarImoveis() {
    const lista = document.getElementById("lista-imoveis");
    if (!lista) {
      console.warn("[ADMIN] ⚠️ Elemento #lista-imoveis não encontrado no DOM.");
      return;
    }

    // Ajuste o caminho conforme a localização real do arquivo no seu deploy.
    // Se admin.html está na raiz e imoveis.json também, use "./imoveis.json".
    // Se estiver em outra pasta, ajuste.
    const url = "../imoveis.json"; // mude para "./imoveis.json" se necessário
    console.info("[ADMIN] ℹ️ Buscando imóveis de:", url);

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        console.error(
          "[ADMIN] ❌ Falha ao carregar imoveis.json. Status:",
          res.status,
          res.statusText
        );
        lista.innerHTML = `<div class="alert alert-danger">Não foi possível carregar a lista de imóveis (HTTP ${res.status}).</div>`;
        return;
      }

      const imoveis = await res.json();
      console.info(
        "[ADMIN] ℹ️ Quantidade de imóveis carregados:",
        imoveis?.length ?? 0
      );

      if (!Array.isArray(imoveis) || imoveis.length === 0) {
        console.warn("[ADMIN] ⚠️ Nenhum imóvel encontrado no JSON.");
        lista.innerHTML = `<div class="alert alert-warning">Nenhum imóvel encontrado.</div>`;
        return;
      }

      lista.innerHTML = imoveis.map(gerarCard).join("");
    } catch (err) {
      console.error("[ADMIN] ❌ Erro ao buscar/parsear imoveis.json:", err);
      lista.innerHTML = `<div class="alert alert-danger">Erro ao carregar os imóveis. Veja o console para detalhes.</div>`;
    }
  }

  function gerarCard(imovel) {
    const imagens = Array.isArray(imovel.imagens) ? imovel.imagens : [];
    const carouselId = `carousel-${imovel.id}`;

    const slides = imagens
      .map(
        (img, index) => `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <img src="../public/${img}" class="d-block w-100" alt="Imagem imóvel">
      </div>
    `
      )
      .join("");

    return `
      <div class="col-md-4">
        <div class="card h-100">
          <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${
                slides ||
                `<div class="p-4 text-center text-muted">Sem imagens</div>`
              }
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Próximo</span>
            </button>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${imovel.titulo ?? "Imóvel"}</h5>
            <p class="card-text">${[imovel.cidade, imovel.bairro]
              .filter(Boolean)
              .join(" - ")}</p>
            <p class="card-text fw-bold">R$${imovel.preco ?? "—"}</p>
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
});
