<?php require __DIR__ . '/../partials/head.php'; ?>
<?php require __DIR__ . '/../partials/sidebar.php'; ?>
<div class="app-workspace">
    <?php require __DIR__ . '/../partials/header.php'; ?>
    <p id="appStatus" class="app-status" role="alert" hidden></p>
    <main class="wrap app-content" id="mainContent" tabindex="-1"><?php require $contentTemplate; ?></main>
    <?php require __DIR__ . '/../partials/footer.php'; ?>
</div>
<?php require __DIR__ . '/../partials/book-modal.php'; ?>
<?php require __DIR__ . '/../partials/scripts.php'; ?>
</body></html>
