# Conecta Mais 4.0

WebApp acadêmico da Conecta Mais 4.0 — Central Inteligente de Atendimento.

## Arquitetura

Celular/cliente → WebApp (GitHub Pages) → Google Apps Script → Google Sheets → Power BI

## Publicação no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie `index.html` para a raiz do repositório.
3. Vá em **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch principal (`main`) e a pasta `/root`.
6. Salve.
7. O GitHub fornecerá o endereço público do site.

## Google Apps Script

O arquivo `apps_script.gs` é a ponte entre o WebApp e a aba `Pedidos`.

No Apps Script:

1. Abra a planilha Google.
2. Extensões → Apps Script.
3. Cole o conteúdo de `apps_script.gs`.
4. Salve.
5. Implante como **Aplicativo da Web**.
6. Execute como você.
7. Acesso: **Qualquer pessoa**.
8. Use a URL `/exec` no `GOOGLE_SHEETS_API` dentro do `index.html`.

## Importante sobre CORS

O WebApp usa `fetch` com `mode: "no-cors"` e `Content-Type: "text/plain"`.
Isso evita o preflight do navegador para o Apps Script. Nesse modo o navegador não consegue ler a resposta do servidor, então a interface informa que o envio foi disparado; a confirmação real deve ser feita na aba `Pedidos`.

## Estrutura da aba Pedidos

A ordem das colunas esperada é:

ID | Data/Hora de Entrada | Canal | Nome | Produto | Tipo | Problema | Setor | Prioridade | Status | Resolução | Prazo (h) | Vencimento | Duplicidade | Mensagem | Data/Hora da Resolução | Tempo de Atendimento (h) | Observação da Gestão

## Power BI

Use a aba `Pedidos` do Google Sheets como fonte principal no Power BI.
Mantenha os nomes e a ordem dos campos estáveis.

## Segurança

- Use somente dados fictícios durante a apresentação.
- A URL do Apps Script é um endpoint, não uma chave secreta.
- Não coloque chaves de API privadas no JavaScript público do GitHub.
- Para produção, use autenticação e controle de acesso adequados.

## Teste rápido

Envie uma reclamação pelo site publicado e confira se uma nova linha aparece em `Pedidos`.
Depois altere o status pela Área da equipe e confira se o mesmo ID é atualizado.
