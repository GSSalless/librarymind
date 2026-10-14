<?php
declare(strict_types=1);
namespace App\Controllers;
use App\Core\View;
use App\Models\Catalog;
final class LibraryController
{
    private Catalog $catalog;
    public function __construct(Catalog $catalog) { $this->catalog = $catalog; }
    public function index(): void { View::render('library/index'); }
    public function catalog(): void
    {
        $catalog = $this->catalog->all();
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($catalog, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
}
