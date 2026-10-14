<?php
declare(strict_types=1);
spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    if (strncmp($class, $prefix, strlen($prefix)) !== 0) { return; }
    $file = __DIR__ . '/app/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($file)) { require $file; }
});
$route = $_GET['route'] ?? 'biblioteca';
if (!is_string($route)) { http_response_code(400); exit('Rota inválida.'); }
if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) {
    http_response_code(405); header('Allow: GET, HEAD'); exit('Método não permitido.');
}
try {
    $library = new App\Controllers\LibraryController(new App\Models\Catalog(__DIR__ . '/storage/catalogo.json'));
    $routes = [
        'biblioteca' => [$library, 'index'],
        'api/catalogo' => [$library, 'catalog'],
        'leitor' => [new App\Controllers\ReaderController(), 'index'],
    ];
    if (!isset($routes[$route])) { http_response_code(404); exit('Página não encontrada.'); }
    $routes[$route]();
} catch (Throwable $error) {
    error_log((string) $error);
    http_response_code(500);
    if ($route === 'api/catalogo') {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Não foi possível carregar o catálogo.']);
    } else { echo 'Não foi possível abrir o LibraryMind. Tente novamente.'; }
}
