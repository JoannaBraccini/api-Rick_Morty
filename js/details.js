document.addEventListener("DOMContentLoaded", async () => {
  await loadSearchResults();
});
async function loadSearchResults() {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("query");
  const results = await getCardsByName(query);

  if (!results) {
    alertToast("Campo de busca vazio!", "danger");
    return;
  }
  displayResults(results);
}

function displayResults(results) {
  const searchTitle = document.getElementById("search-title");
  const carouselContent = document.getElementById("carousel-content");
  const carouselIndicators = document.getElementById("carousel-indicators");

  carouselContent.innerHTML = "";
  carouselIndicators.innerHTML = "";

  if (results.length === 0) {
    carouselContent.innerHTML =
      '<div class="carousel-item active"><div class="d-block w-100 text-center">Nada encontrado</div></div>';
    return;
  }
  //Atualizar para nome do personagem buscado
  searchTitle.textContent = results[0].name;

  results.forEach((result, index) => {
    const isActive = index === 0 ? "active" : "";
    const urlLastEpisode = result.episode[result.episode.length - 1];

    getLastEpisode(urlLastEpisode).then((lastEpisode) => {
      const indicatorHtml = `
        <button type="button" data-bs-target="#search-results-carousel" data-bs-slide-to="${index}" class="${isActive}" aria-current="${isActive}" aria-label="Slide ${
        index + 1
      }"></button>
      `;
      carouselIndicators.insertAdjacentHTML("beforeend", indicatorHtml);
      const cardHtml = `
        <div class="carousel-item ${isActive}">
          <img src="${result.image}" class="d-block w-100" alt="${result.name}">
          <div class="carousel-caption d-none d-md-block">          
            <h1 class="fw-bold">${result.name}</h1>
            <p class="fs-5">
              Status: ${result.status} - Espécie: ${result.species} - Gênero: ${
        result.gender
      }
              <br>
              Localização: ${result.location.name || "Desconhecido"}
              <br>
              Visto por último em: ${lastEpisode.name || "Desconhecido"}
            </p>
          </div>
        </div>
      `;
      carouselContent.insertAdjacentHTML("beforeend", cardHtml);
    });
  });
}
