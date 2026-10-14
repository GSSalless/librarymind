<section class="view" id="v-catalogo" hidden>
    <div class="toolbar">
      <input type="search" id="cQ" placeholder="Filtrar por título ou autor" aria-label="Filtrar catálogo">
      <select id="cCat" aria-label="Categoria"></select>
      <select id="cSub" aria-label="Gênero"></select>
      <select id="cConf" aria-label="Classificação"><option value="">Toda classificação</option><option>Revisada</option><option>Por autor</option><option>Por assuntos/sinopse</option><option>Pela pasta de origem</option><option>Estimada</option></select>
      <select id="cSort" aria-label="Ordenar">
        <option value="t">Título A–Z</option><option value="a">Autor A–Z</option>
        <option value="pd">Mais páginas</option><option value="pa">Menos páginas</option>
      </select>
      <div class="seg" role="group" aria-label="Modo de exibição">
        <button id="mGrid" aria-pressed="true">Capas</button><button id="mList" aria-pressed="false">Lista</button>
      </div>
    </div>
    <div class="count" id="cCount"></div>
    <div id="cOut"></div>
    <button class="more" id="cMore" hidden>Mostrar mais</button>
  </section>
