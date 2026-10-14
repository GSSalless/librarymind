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
