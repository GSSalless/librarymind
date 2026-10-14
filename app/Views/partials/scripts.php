<?php if ($page === 'library'): ?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script src="assets/js/book-actions.js?v=mvc2"></script>
<script src="assets/js/library.js?v=mvc2"></script>
<?php else: ?>
<script defer src="assets/vendor/jszip.min.js"></script>
<script defer src="assets/vendor/epub.min.js"></script>
<script defer src="assets/js/reader.js?v=mvc2"></script>
<?php endif; ?>
