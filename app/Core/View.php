<?php
declare(strict_types=1);
namespace App\Core;
final class View
{
    public static function render(string $template, array $data = [], ?string $layout = null): void
    {
        extract($data, EXTR_SKIP);
        $contentTemplate = dirname(__DIR__) . '/Views/' . $template . '.php';
        require $layout === null ? $contentTemplate : dirname(__DIR__) . '/Views/layouts/' . $layout . '.php';
    }
}
