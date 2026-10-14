<?php
declare(strict_types=1);
namespace App\Controllers;
use App\Core\View;
final class ReaderController
{
    public function index(): void { View::render('reader/index', ['page' => 'reader', 'pageTitle' => 'Leitor · LibraryMind'], 'reader'); }
}
