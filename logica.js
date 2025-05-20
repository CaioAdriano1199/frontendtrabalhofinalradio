
function mudarCorElipse(corHex) {
  document.documentElement.style.setProperty('--cor-elipse', corHex);
  document.body.style.background = "linear-gradient(to bottom, #color1, #color2)";

}

//playlist

const container = document.getElementById("playlistList");

fetch("mocks/playlists.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Erro ao carregar o mock");
    }
    return response.json();
  })
  .then(playlists => {
    playlists.forEach(pl => {
      const item = document.createElement("div");
      item.classList.add("playlist-item");

      item.innerHTML = `
        <img src="${pl.img}" alt="${pl.title}">
        <div class="title">${pl.title}</div>
      `;

      container.appendChild(item);
    });
  })
  .catch(error => {
    console.error("Erro ao buscar as playlists:", error);
  });


//carregar conteudo da pagina inicial  

async function carregarJogos() {
  const resposta = await fetch('mocks/jogostrilha.json');
  const dadosJogos = await resposta.json();

  const listaGeneros = document.getElementById('lista-generos');

  for (const genero in dadosJogos) {
    const h2 = document.createElement('h2');
    h2.textContent = genero;
    listaGeneros.appendChild(h2);

    const container = document.createElement('div');
    container.classList.add('jogos-container');

    dadosJogos[genero].forEach(jogo => {
      const divJogo = document.createElement('div');
      divJogo.classList.add('jogo');

      divJogo.innerHTML = `
        <img src="${jogo.img}" alt="Capa de ${jogo.title}">
        <p>${jogo.title}</p>
      `;

      container.appendChild(divJogo);
    });

    listaGeneros.appendChild(container);
  }
}

carregarJogos();


//buscar radios dos jogos

fetch('mocks/jogostrilha.json')
  .then(res => res.json())
  .then(data => renderizarJogos(data))
  .catch(err => console.error('Erro ao carregar mock:', err));

function renderizarJogos(dadosJogos) {
  const listaGeneros = document.getElementById("lista-generos");
  listaGeneros.innerHTML = "";

  for (const genero in dadosJogos) {
    const categoria = document.createElement("div");
    categoria.className = "categoria";

    const h2 = document.createElement("h2");
    h2.textContent = genero;
    categoria.appendChild(h2);

    const container = document.createElement("div");
    container.className = "jogos-container";

    dadosJogos[genero].forEach(jogo => {
      const divJogo = document.createElement("div");
      divJogo.className = "jogo";
      divJogo.style.cursor = "pointer";

      let titulo = jogo.title;
      if (titulo.length > 14) {
        titulo = titulo.slice(0, 14) + "...";
      }

      divJogo.innerHTML = `
        <img src="${jogo.img}" alt="${jogo.title}">
        <p title="${jogo.title}">${titulo}</p>
      `;

      // Adicionando o evento de clique
      divJogo.addEventListener("click", () => mostrarRadiosDoJogo(jogo.title));
      container.appendChild(divJogo);
    });

    categoria.appendChild(container);
    listaGeneros.appendChild(categoria);
  }
}

// Função para mostrar as rádios de um jogo
function mostrarRadiosDoJogo(tituloJogo) {
  // Carregar as rádios do jogo selecionado
  fetch('mocks/radiosdosjogos.json')
    .then(res => res.json())
    .then(dadosRadios => {
      const radios = dadosRadios[tituloJogo];

      if (!radios) {
        alert("Nenhuma rádio encontrada para esse jogo.");
        return;
      }

      // Ocultar a lista de jogos
      document.getElementById("lista-generos").style.display = "none";

      // Mostrar container com rádios
      const radiosContainer = document.getElementById("radios-container");
      radiosContainer.style.display = "block";
      radiosContainer.innerHTML = `
        <h2>Rádios de ${tituloJogo}</h2>
        <ul>
          ${radios.map(r => `<li>${r}</li>`).join("")}
        </ul>
        <button onclick="voltar()">Voltar</button>
      `;
    })
    .catch(err => {
      console.error('Erro ao carregar rádios:', err);
      alert("Ocorreu um erro ao carregar as rádios.");
    });
}

// Função para voltar à lista de jogos
function voltar() {
  document.getElementById("radios-container").style.display = "none";
  document.getElementById("lista-generos").style.display = "block";
}
