# Reestruturação do LibraryMind

Cada etapa corresponde a um commit independente.

1. **MVC em PHP:** separar catálogo (Model), rotas e ações (Controllers), telas (Views) e assets. Preservar catálogo, filtros, favoritos, download, leitor e links antigos. Manter JSON como armazenamento atual; banco de dados será uma decisão posterior.
2. **Layout reutilizável:** separar cabeçalho, conteúdo, rodapé e modal, com páginas por seção e configuração compartilhada de navegação.
3. **Interface de aplicativo:** navegação lateral fixa no computador e recolhível no celular, cabeçalho compacto com nome da seção, indicação de página ativa e rodapé discreto.

O acervo e as capas continuam locais. A reestruturação não altera os identificadores dos livros nem as chaves do localStorage. Os commits desta sequência são preparados localmente para revisão antes do próximo envio ao GitHub.
