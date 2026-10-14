<?php
$icons = [
    'painel' => 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    'catalogo' => 'M4 4h6v16H4z M10 4h6v16h-6z M16 5l4-1 3 15-4 1z',
    'autores' => 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M19 8a3 3 0 0 1 0 6 M22 21v-2a4 4 0 0 0-3-3.87',
    'temas' => 'M3 3h7l11 11-7 7L3 10z M7 7h.01',
    'pesquisa' => 'M21 21l-5-5 M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15',
    'estante' => 'M5 3h14v18l-7-4-7 4z',
];
?>
<a class="skip-link" href="#mainContent">Ir para o conteúdo</a>
<aside class="app-sidebar" id="appSidebar" aria-label="Menu principal">
    <div class="sidebar-brand"><a href="index.php" aria-label="LibraryMind, início"><span class="brand-mark" aria-hidden="true">L<span>m</span></span><span>LibraryMind<small>Biblioteca pessoal</small></span></a><button class="sidebar-close" id="menuClose" aria-label="Fechar menu">×</button></div>
    <p class="sidebar-label">BIBLIOTECA</p>
    <nav class="app-nav" aria-label="Seções da biblioteca">
    <?php foreach ($navigation as $item): ?>
        <a href="#<?= $item['id'] ?>" data-v="<?= $item['id'] ?>" <?= $item['id'] === 'painel' ? 'aria-current="page"' : '' ?>><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="<?= $icons[$item['id']] ?>"/></svg><span><?= htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8') ?></span></a>
    <?php endforeach; ?>
    </nav>
    <div class="sidebar-note"><span class="status-dot" aria-hidden="true"></span><div>Seu espaço de leitura<small>Organize. Descubra. Leia.</small></div></div>
</aside>
<button class="sidebar-backdrop" id="menuBackdrop" aria-label="Fechar menu" hidden tabindex="-1"></button>
