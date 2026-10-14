<?php if ($page === 'library'): ?>
<header class="app-header">
    <button class="menu-toggle" id="menuToggle" aria-label="Abrir menu" aria-controls="appSidebar" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 6h16 M4 12h16 M4 18h16"/></svg></button>
    <div class="page-heading"><p>Sua biblioteca</p><h1 id="pageTitle">Painel</h1></div>
    <div class="app-summary"><span class="meta" id="meta"></span></div>
</header>
<?php else: ?>
<header><a id="back" href="index.php">← Biblioteca</a><strong>LibraryMind</strong><h1 id="title">Leitor</h1><a id="download" hidden download>Baixar arquivo</a></header>
<?php endif; ?>
