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
