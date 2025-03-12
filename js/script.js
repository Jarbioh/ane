document.addEventListener("DOMContentLoaded", function () {
    console.log("JS carregado!");

    // 📌 MENU RESPONSIVO (HAMBÚRGUER)
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            console.log("Botão hambúrguer clicado!");
            navMenu.classList.toggle("active");
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
            });
        });
    } else {
        console.error("Elemento menu-toggle ou navMenu não encontrado.");
    }

    // 📌 TROCA AUTOMÁTICA DE IMAGENS NO HERO
    const imagensHero = [
        "img/projects/regadio.png",
        "img/projects/153665.png",
        "img/projects/93285246554.png",
        "img/projects/N1estrada.png"
    ];
    const altTexts = [
        "Descrição da imagem 1",
        "Descrição da imagem 2",
        "Descrição da imagem 3",
        "Descrição da imagem 4"
    ];

    const heroSection = document.querySelector(".hero");
    if (heroSection && imagensHero.length > 0) {
        let indexAtual = 0;

        function trocarImagemHero() {
            indexAtual = (indexAtual + 1) % imagensHero.length;
            heroSection.style.backgroundImage = `url('${imagensHero[indexAtual]}')`;
            heroSection.setAttribute("aria-label", altTexts[indexAtual]);
        }

        trocarImagemHero();
        setInterval(trocarImagemHero, 5000);
    }

    // 📌 SCROLL TO TOP
    const scrollToTopButton = document.getElementById("scrollToTop");
    if (scrollToTopButton) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollToTopButton.style.display = "block";
            } else {
                scrollToTopButton.style.display = "none";
            }
        });

        scrollToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 📌 EXPANDIR NOTÍCIAS AO CLICAR EM "LEIA MAIS"
    document.querySelectorAll(".noticia a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const noticia = this.closest(".noticia");
            const resumo = noticia.querySelector("p");

            if (resumo.style.display === "none" || resumo.style.display === "") {
                resumo.style.display = "block";
                this.textContent = "Recolher";
            } else {
                resumo.style.display = "none";
                this.textContent = "Leia mais";
            }
        });
    });

    // 📌 VALIDAÇÃO DO FORMULÁRIO DE CONTATO
    const formularioContato = document.getElementById("formulario-contato");
    if (formularioContato) {
        formularioContato.addEventListener("submit", async function (e) {
            e.preventDefault();

            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const mensagem = document.getElementById("mensagem").value;

            if (nome && email && mensagem) {
                try {
                    const response = await fetch("https://api.exemplo.com/enviar", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nome, email, mensagem })
                    });
                    if (response.ok) {
                        alert("Mensagem enviada com sucesso!");
                        formularioContato.reset();
                    } else {
                        alert("Erro ao enviar a mensagem. Tente novamente.");
                    }
                } catch (error) {
                    alert("Erro de conexão. Verifique sua internet.");
                }
            } else {
                alert("Por favor, preencha todos os campos.");
            }
        });
    }

    // 📌 FUNCIONALIDADE DE PESQUISA
    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.querySelector(".search-container");
    const searchInput = document.getElementById("searchInput");
    const searchResultsSection = document.getElementById("searchResults");
    const resultsGrid = document.getElementById("resultsGrid");
    const noResultsMessage = document.getElementById("noResults");
    const closeResultsButton = document.getElementById("closeResults");
    const filterType = document.getElementById("filterType");

    if (searchButton && searchContainer && searchInput && searchResultsSection && resultsGrid && noResultsMessage && closeResultsButton && filterType) {
        let dadosIndexados = [];

        // Adiciona um indicador de carregamento
        const loadingIndicator = document.createElement("div");
        loadingIndicator.textContent = "Carregando dados...";
        loadingIndicator.style.fontSize = "1.2em";
        loadingIndicator.style.color = "#777";
        loadingIndicator.style.textAlign = "center";
        resultsGrid.appendChild(loadingIndicator);

        // Carrega os dados do config.json
        fetch('config.json') // Ajuste o caminho se o arquivo estiver em outra pasta (ex.: 'data/config.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar config.json. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                dadosIndexados = data;
                console.log("Dados carregados com sucesso:", dadosIndexados);
                resultsGrid.removeChild(loadingIndicator); // Remove o indicador após sucesso
            })
            .catch(error => {
                console.error('Erro ao carregar dados:', error);
                resultsGrid.removeChild(loadingIndicator); // Remove o indicador em caso de erro
                noResultsMessage.textContent = `Erro ao carregar dados: ${error.message}. Verifique o arquivo config.json ou o servidor.`;
                noResultsMessage.style.display = "block";
            });

        searchButton.addEventListener("click", function () {
            searchContainer.classList.toggle("active");
            if (searchContainer.classList.contains("active")) {
                searchInput.focus();
            }
        });

        searchInput.addEventListener("input", function () {
            const termoPesquisa = searchInput.value.trim().toLowerCase();
            const filtroSelecionado = filterType.value.toLowerCase();

            if (termoPesquisa && dadosIndexados.length > 0) { // Só filtra se os dados foram carregados
                // Oculta todas as seções principais
                document.querySelectorAll("section:not(.search-results)").forEach(section => {
                    section.style.display = "none";
                });

                // Exibe a seção de resultados
                searchResultsSection.style.display = "block";
                resultsGrid.innerHTML = "";
                noResultsMessage.style.display = "none";

                // Filtra os dados
                let resultados = dadosIndexados.filter(item =>
                    (item.titulo.toLowerCase().includes(termoPesquisa) ||
                    item.descricao.toLowerCase().includes(termoPesquisa)) &&
                    (filtroSelecionado === "all" || item.tipo.toLowerCase() === filtroSelecionado)
                );

                if (resultados.length > 0) {
                    resultados.forEach(resultado => {
                        const resultItem = document.createElement("div");
                        resultItem.classList.add("result-item");
                        resultItem.innerHTML = `
                            ${resultado.imagem ? `<img src="${resultado.imagem}" alt="${resultado.titulo}" loading="lazy">` : ""}
                            <h3>${resultado.titulo}</h3>
                            <p>${resultado.descricao}</p>
                            <a href="${resultado.link}" target="${resultado.link.endsWith('.pdf') ? '_blank' : '_self'}">${resultado.tipo === "Notícia" ? "Leia mais" : "Saiba mais"}</a>
                        `;
                        resultsGrid.appendChild(resultItem);
                    });
                } else {
                    noResultsMessage.style.display = "block";
                }
            } else if (!termoPesquisa) {
                searchResultsSection.style.display = "none";
                document.querySelectorAll("section:not(.search-results)").forEach(section => {
                    section.style.display = "block";
                });
            }
        });

        // Atualiza os resultados quando o filtro muda
        filterType.addEventListener("change", function () {
            const termoPesquisa = searchInput.value.trim().toLowerCase();
            if (termoPesquisa && dadosIndexados.length > 0) {
                searchInput.dispatchEvent(new Event("input"));
            }
        });

        // Fecha o campo ao clicar fora
        document.addEventListener("click", function (e) {
            if (!searchContainer.contains(e.target) && searchContainer.classList.contains("active")) {
                searchContainer.classList.remove("active");
                searchInput.value = "";
                searchResultsSection.style.display = "none";
                document.querySelectorAll("section:not(.search-results)").forEach(section => {
                    section.style.display = "block";
                });
            }
        });

        // Fecha a seção de resultados manualmente
        closeResultsButton.addEventListener("click", function () {
            searchResultsSection.style.display = "none";
            searchInput.value = "";
            document.querySelectorAll("section:not(.search-results)").forEach(section => {
                section.style.display = "block";
            });
        });
    }

    // 📌 ATUALIZAÇÃO DINÂMICA DO ANO NO RODAPÉ
    const footerYear = document.querySelector("footer p");
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = `© ${currentYear} ANE - Administração Nacional de Estradas`;
    }
});