
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

//mostrar as rádios de um jogo
function mostrarRadiosDoJogo(tituloJogo) {
  window.nomeJogoAtual = tituloJogo;
  Promise.all([
    fetch('mocks/jogostrilha.json').then(res => res.json()),
    fetch('mocks/radiosdosjogos.json').then(res => res.json())
  ])
    .then(([dadosJogos, dadosRadios]) => {

      let jogoEncontrado = null;
      for (const genero in dadosJogos) {
        const jogo = dadosJogos[genero].find(j => j.title === tituloJogo);
        if (jogo) {
          jogoEncontrado = jogo;
          break;
        }
      }

      if (!jogoEncontrado) {
        alert("Informações do jogo não encontradas.");
        return;
      }

      // Buscar rádios com verificação flexível
      let radios = null;
      for (const nomeJogo in dadosRadios) {
        if (nomeJogo.toLowerCase().trim() === tituloJogo.toLowerCase().trim()) {
          radios = dadosRadios[nomeJogo];
          break;
        }
      }

      if (!radios || radios.length === 0) {
        alert("Nenhuma rádio encontrada para esse jogo.");
        return;
      }

      document.getElementById("lista-generos").style.display = "none";
      const radiosContainer = document.getElementById("radios-container");
      radiosContainer.style.display = "block";

      radiosContainer.innerHTML = `
        <div class="jogo-info">
          <img src="${jogoEncontrado.img}" alt="${tituloJogo}" class="jogo-imagem">
          <h2>${tituloJogo}</h2>
          </div>
          <p class="tabelainforadio">Estações de rádio</p>
        <ul class="lista-radios">
          ${radios.map(r => `
            <li class="radio-item" onclick="buscarMusicasDaRadio('${r.nome}')">
              <img src="${r.logo}" alt="${r.nome}" class="logo-radio">
              <span>${r.nome}</span>
            </li>
          `).join("")}
        </ul>
        <button onclick="voltar()" class="btn-voltar">Voltar</button>
      `;
    })
    .catch(err => {
      console.error("Erro ao carregar dados:", err);
      alert("Ocorreu um erro ao carregar as informações.");
    });
}

// Função para voltar à lista de jogos
function voltar() {
  document.getElementById("radios-container").style.display = "none";
  document.getElementById("lista-generos").style.display = "block";
}

function buscarMusicasDaRadio(nomeRadio) {
  fetch('mocks/musicasdasradios.json')
    .then(res => res.json())
    .then(dadosMusicas => {
      const musicas = dadosMusicas[nomeRadio];

      if (!musicas || musicas.length === 0) {
        alert("Nenhuma música encontrada para essa rádio.");
        return;
      }

      const radiosContainer = document.getElementById("radios-container");
      radiosContainer.innerHTML = `
        <h3>Músicas da rádio: ${nomeRadio}</h3>
        <ul class="lista-musicas">
  ${musicas.map(m => `
    <li class="musica-item">
      <img src="${m.capa}" alt="Capa de ${m.titulo}" class="capa-musica">
      <div>
        <strong>${m.titulo}</strong> — ${m.artista}<br>
        <small>Lançamento: ${m.dataLancamento} | Duração: ${m.duracao}</small>
      </div>
    </li>
  `).join("")}
</ul>

        <button onclick="mostrarRadiosDoJogo('${nomeJogoAtual}')" class="btn-voltar">Voltar às rádios</button>
      `;
    })
    .catch(err => {
      console.error("Erro ao carregar músicas:", err);
      alert("Ocorreu um erro ao buscar as músicas da rádio.");
    });
}
