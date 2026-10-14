<?php foreach ($navigation as $item): ?>
    <?php require __DIR__ . '/pages/' . $item['id'] . '.php'; ?>
<?php endforeach; ?>
