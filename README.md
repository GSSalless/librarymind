# LibraryMind

Biblioteca pessoal de ebooks. Versão inicial em HTML, CSS e JavaScript, com catálogo embutido no arquivo `biblioteca.html` e favoritos no localStorage do navegador.

## Teste no XAMPP

Inicie o Apache no XAMPP e acesse http://localhost/librarymind/.

- `index.php`: entrada para a interface existente.
- `biblioteca.html`: interface, catálogo, busca, filtros e favoritos.
- `dados/capas_sprites/`: imagens de capas usadas pela interface.
- `Biblioteca/`: acervo local.
- `servidor_biblioteca.py`: servidor legado, porta 8765, usado pelas funções de integração com o Mac.

Abrir arquivos no aplicativo do Mac, revelar no Finder e o fluxo original de compartilhamento ainda usam a ponte Python. Os scripts .command são legados e precisam ser revisados antes de uso na nova pasta. Os favoritos não são transferidos automaticamente entre origens do navegador.

O acervo, a planilha e a pasta de dados ficam fora do Git. O HTML contém os metadados do catálogo atual. Os livros, a planilha e os arquivos de dados e capas não são distribuídos neste repositório; sem esses arquivos locais, as capas e os downloads não estarão disponíveis.
