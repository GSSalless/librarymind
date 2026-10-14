# LibraryMind

Biblioteca pessoal em PHP 8, com arquitetura MVC e JavaScript para as interações e o leitor EPUB. Sem framework ou dependências PHP externas.

## Executar

Inicie o Apache no XAMPP e acesse http://localhost/librarymind/.

- `index.php`: entrada única e tabela de rotas.
- `app/Models/Catalog.php`: leitura e validação dos metadados do catálogo JSON.
- `app/Controllers/`: controladores da biblioteca, API e leitor.
- `app/Views/`: telas renderizadas pelo PHP.
- `assets/css/` e `assets/js/`: apresentação e interações do navegador.
- `assets/vendor/`: EPUB.js e JSZip com suas licenças.
- `storage/catalogo.json`: metadados do catálogo versionados. O acesso HTTP direto a storage e app é bloqueado por .htaccess.
- `Biblioteca/` e `dados/`: livros e capas locais, fora do Git.

## Rotas

- `index.php`: biblioteca.
- `index.php?route=api/catalogo`: dados do catálogo em JSON.
- `index.php?route=leitor&arquivo=...&titulo=...&livro=...`: leitor EPUB/PDF.

Os endereços antigos biblioteca.html e leitor.html redirecionam para as rotas PHP, preservando parâmetros e o livro selecionado. Os scripts Python/.command são legados; o servidor atual é o Apache/PHP. Favoritos e posição de leitura permanecem no localStorage da mesma origem do navegador.

O download permanece disponível; o envio pelo WhatsApp foi removido. O leitor EPUB tem coluna vertical e fonte ajustável; PDFs usam o visualizador do navegador. Sem os livros e as capas locais, o catálogo abre, mas downloads e capas não estarão disponíveis.
