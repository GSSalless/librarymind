<?php if ($page === 'library'): ?>
<header class="top"><div class="wrap">
    <div class="brand"><h1>LibraryMind</h1><span class="meta" id="meta"></span></div>
    <nav class="tabs" role="tablist" aria-label="Seções da biblioteca">
    <?php foreach ($navigation as $item): ?>
        <button role="tab" data-v="<?= $item['id'] ?>"><?= htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8') ?></button>
    <?php endforeach; ?>
    </nav>
</div></header>
<?php else: ?>
<header><a id="back" href="index.php">← Biblioteca</a><strong>LibraryMind</strong><h1 id="title">Leitor</h1><a id="download" hidden download>Baixar arquivo</a></header>
<?php endif; ?>
