<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
<?php if ($page === 'library'): ?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;0,7..72,700;1,7..72,400&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<?php endif; ?>
<link rel="stylesheet" href="assets/css/<?= $page === 'library' ? 'library' : 'reader' ?>.css?v=mvc2">
<link rel="stylesheet" href="assets/css/layout.css?v=mvc2">
</head><body class="<?= $page === 'library' ? 'library-app' : 'reader-app' ?>">
