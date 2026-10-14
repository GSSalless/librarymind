# LibraryMind

Biblioteca pessoal de ebooks. Versão inicial em HTML, CSS e JavaScript, com catálogo embutido no arquivo `biblioteca.html` e favoritos no localStorage do navegador.

## Teste no XAMPP

Inicie o Apache no XAMPP e acesse http://localhost/librarymind/.

- `index.php`: entrada para a interface existente.
- `biblioteca.html`: interface, catálogo, busca, filtros e favoritos.
- `dados/capas_sprites/`: imagens de capas usadas pela interface.
- `Biblioteca/`: acervo local.
- `servidor_biblioteca.py`: servidor legado, porta 8765, usado pelas funções de integração com o Mac.

## Download e leitura

O modal permite baixar o arquivo diretamente, abrir o leitor, copiar o link da ficha e adicionar o livro à estante. O envio pelo WhatsApp foi removido nesta versão.

`leitor.html`, `leitor.js` e `leitor.css` oferecem leitura EPUB (EPUB.js 0.3.93 / JSZip 3.10.1, incluídos em `assets/vendor` com suas licenças) e PDF pelo visualizador do navegador. A posição de leitura EPUB é salva no localStorage. Outros formatos oferecem download. Capítulos dependem do sumário presente no EPUB.

O servidor Python e os scripts .command permanecem como arquivos legados. Os favoritos e a posição de leitura não são transferidos automaticamente entre origens do navegador.

O acervo, a planilha e a pasta de dados ficam fora do Git. O HTML contém os metadados do catálogo atual. Os livros, a planilha e os arquivos de dados e capas não são distribuídos neste repositório; sem esses arquivos locais, as capas e os downloads não estarão disponíveis.
