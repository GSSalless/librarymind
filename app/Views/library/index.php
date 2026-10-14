<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LibraryMind</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;0,7..72,700;1,7..72,400&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="assets/css/library.css?v=mvc1">

</head><body>
<p id="appStatus" role="alert" hidden></p>
<header class="top">
  <div class="wrap">
    <div class="brand"><h1>LibraryMind</h1><span class="meta" id="meta"></span></div>
    <nav class="tabs" role="tablist">
      <button role="tab" data-v="painel">Painel</button>
      <button role="tab" data-v="catalogo">Catálogo</button>
      <button role="tab" data-v="autores">Autores</button>
      <button role="tab" data-v="temas">Temas</button>
      <button role="tab" data-v="pesquisa">Pesquisa</button>
      <button role="tab" data-v="estante">Minha estante</button>
    </nav>
  </div>
</header>

<main class="wrap">
  <!-- PAINEL -->
  <section class="view" id="v-painel">
    <div class="kpis" id="kpis"></div>
    <div class="grid2">
      <div class="panel"><h2>Livros por categoria</h2><p class="hint">Clique numa barra para abrir o tema.</p><div class="chartbox" style="height:440px"><canvas id="chCat"></canvas></div></div>
      <div class="panel"><h2>Gêneros da literatura</h2><p class="hint">Literatura brasileira, portuguesa e estrangeira juntas.</p><div class="chartbox" style="height:440px"><canvas id="chGen"></canvas></div></div>
    </div>
    <div class="grid2">
      <div class="panel"><h2>Quando os autores nasceram</h2><p class="hint">Livros agrupados pelo século de nascimento do autor.</p><div class="chartbox" style="height:300px"><canvas id="chSec"></canvas></div></div>
      <div class="panel"><h2>Tamanho dos livros</h2><p class="hint">Páginas estimadas (palavras ÷ 275).</p><div class="chartbox" style="height:300px"><canvas id="chPag"></canvas></div></div>
    </div>
    <div class="grid3">
      <div class="panel"><h2>Autores com mais livros</h2><p class="hint">Clique para ver a obra.</p><ul class="rank" id="rkAut"></ul></div>
      <div class="panel"><h2>Nacionalidades</h2><p class="hint">Livros dos autores com nacionalidade identificada.</p><ul class="rank" id="rkNac"></ul></div>
      <div class="panel"><h2>Os mais longos</h2><p class="hint">Maiores obras do acervo em páginas.</p><ul class="rank" id="rkLong"></ul></div>
    </div>
    <div class="grid2">
      <div class="panel"><h2>De onde vieram os livros</h2><p class="hint">Títulos únicos por pacote de origem (repetidos já descontados).</p><ul class="rank" id="rkCol"></ul></div>
      <div class="panel"><h2>Qualidade da classificação</h2><p class="hint">Como cada livro foi classificado. Clique para filtrar o catálogo.</p><ul class="rank" id="rkConf"></ul></div>
    </div>
  </section>

  <!-- CATÁLOGO -->
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

  <!-- AUTORES -->
  <section class="view" id="v-autores" hidden>
    <div id="aList">
      <div class="toolbar" style="margin-bottom:14px">
        <input type="search" id="aQ" placeholder="Buscar autor" aria-label="Buscar autor">
        <select id="aNac" aria-label="Nacionalidade"></select>
        <select id="aSort" aria-label="Ordenar autores"><option value="n">Nome A–Z</option><option value="c">Mais livros</option><option value="y">Mais antigos</option></select>
      </div>
      <div class="az" id="az" style="margin-bottom:14px"></div>
      <div class="count" id="aCount" style="margin-bottom:10px"></div>
      <div class="authors" id="aOut"></div>
      <button class="more" id="aMore" hidden style="margin-top:16px">Mostrar mais</button>
    </div>
    <div id="aDetail" hidden></div>
  </section>

  <!-- TEMAS -->
  <section class="view" id="v-temas" hidden>
    <div id="tList">
      <div class="themes" id="tOut"></div>
      <div class="panel" style="margin-top:22px"><h2>Séries e coleções</h2><p class="hint">As 90 sagas e coleções com mais volumes no acervo.</p><div class="chips" id="sOut"></div></div>
    </div>
    <div id="tDetail" hidden></div>
  </section>

  <!-- PESQUISA -->
  <section class="view" id="v-pesquisa" hidden>
    <div class="bigsearch"><input type="search" id="sQ" placeholder="Busque por título, autor, série, editora ou palavras da sinopse" aria-label="Pesquisa"></div>
    <div class="filters">
      <label><input type="checkbox" id="fT" checked> Título</label>
      <label><input type="checkbox" id="fA" checked> Autor</label>
      <label><input type="checkbox" id="fS" checked> Sinopse</label>
      <label><input type="checkbox" id="fSe" checked> Série/Editora</label>
      <label>Páginas de <input type="number" id="pMin" min="0" placeholder="0"> a <input type="number" id="pMax" min="0" placeholder="∞"></label>
      <label><input type="checkbox" id="fSyn"> Só com sinopse</label>
    </div>
    <div class="chips" id="sugg"></div>
    <div class="count" id="sCount"></div>
    <div class="results" id="sOut2"></div>
  </section>

  <!-- ESTANTE -->
  <section class="view" id="v-estante" hidden>
    <div class="panel"><h2>Minha estante</h2><p class="hint" style="margin:0">Marque livros com ★ na ficha de cada um. A marcação fica salva só neste navegador.</p></div>
    <div id="eOut"></div>
  </section>
</main>

<dialog id="dlg" aria-label="Ficha do livro"><div style="position:relative"><button class="x" id="dlgX" aria-label="Fechar">×</button><div id="dlgBody"></div></div></dialog>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script src="assets/js/book-actions.js?v=mvc1"></script>

<script src="assets/js/library.js?v=mvc1"></script>
</body></html>
