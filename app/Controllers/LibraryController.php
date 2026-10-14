<?php
declare(strict_types=1);
namespace App\Controllers;
use App\Core\View;
use App\Models\Catalog;
final class LibraryController
{
    private Catalog $catalog;
    public function __construct(Catalog $catalog) { $this->catalog = $catalog; }
    public function index(): void
    {
        $navigation = require dirname(__DIR__, 2) . '/config/navigation.php';
        View::render('library/index', ['page' => 'library', 'pageTitle' => 'LibraryMind', 'navigation' => $navigation], 'library');
    }
    public function catalog(): void
    {
        $catalog = $this->catalog->all();
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($catalog, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
}
