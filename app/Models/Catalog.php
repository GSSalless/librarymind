<?php
declare(strict_types=1);
namespace App\Models;
final class Catalog
{
    private string $file;
    public function __construct(string $file) { $this->file = $file; }
    public function all(): array
    {
        $json = file_get_contents($this->file);
        if ($json === false) { throw new \RuntimeException('Catálogo indisponível.'); }
        $catalog = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        foreach (['cats', 'desc', 'authors', 'books', 'cov', 'reps'] as $key) {
            if (!array_key_exists($key, $catalog)) { throw new \RuntimeException('Catálogo inválido.'); }
        }
        return $catalog;
    }
}
