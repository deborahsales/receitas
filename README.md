# OKRArdapio

Coleção interativa de **52 receitas**: 6 cafés da manhã, 18 almoços, 15 jantares e 13 lanches. Inclui buscas, filtros, favoritos, cardápio semanal, lista de compras e cards em PDF para imprimir.

## Edição atual

- Logo horizontal no cabeçalho e nas impressões do site; versão compacta no rodapé e nos cards.
- Cuscuz com ovos e frittata no jantar; demais pratos principais anteriores organizados no almoço.
- Treze jantares novos com macaxeira, batata-doce, proteínas, sopas e caldos, incluindo caldo fino de camarão com gengibre e limão.
- IDs 29, 48 e 54 descontinuados: excluídos do catálogo, das sugestões e dos PDFs.
- Cards A5 com 104 páginas e A4 com 52 páginas para impressão frente e verso.

As receitas são sugestões culinárias. Não calculam uma dieta ou meta de calorias. As quantidades e o rendimento escritos prevalecem sobre as imagens ilustrativas geradas por IA.

## Vercel

O projeto é estático, sem dependências de execução. A Vercel publica `src` diretamente, conforme `vercel.json`.

| Campo | Valor |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Pasta que contém `src` e `vercel.json` |
| Build Command | Vazio, com Override ativado |
| Install Command | Vazio, com Override ativado |
| Output Directory | `src` |
| Variáveis de ambiente | Nenhuma |

Inclua integralmente `src/assets`, `src/data` e `src/downloads`. Não há endereço da Vercel fixado no código: os arquivos usam caminhos relativos, e os links de compartilhamento usam o endereço aberto no navegador. Um novo commit pode iniciar um deploy conforme a configuração do projeto na Vercel.

Documentação: [configuração de build](https://vercel.com/docs/builds/configure-a-build).

## Desenvolvimento

Com Node.js 20 ou superior, na raiz:

```bash
npm test
npm run build
npm run dev
```

O servidor local abre em `http://localhost:3000`. Outra porta: `npm run dev -- --port 3001`. Não é necessário executar `npm install`. O build opcional copia `src` para `dist`; a Vercel continua publicando `src`. Não abra o HTML por duplo clique: módulos e JSON precisam de HTTP.

## Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `src/data/recipes.json` | Base completa das receitas e metadados |
| `src/app.js` | Interface, navegação, favoritos, cardápio e impressão |
| `src/core.js` | Busca, rendimentos, compras e sugestões semanais |
| `src/styles.css` | Identidade, responsividade e impressão |
| `src/assets/photos` | Foto completa e miniatura por ID |
| `src/assets/okrardapio-horizontal.*` | Logo com texto ao lado |
| `src/assets/okrardapio-compacta.*` | Logo com texto abaixo |
| `src/downloads` | PDFs A4 e A5 dos cards |
| `tests/core.test.mjs` | Verificação das regras e integridade do catálogo |

Os IDs são estáveis e não formam uma sequência contínua. Novas receitas precisam de ID único, imagens, equipamentos e rendimento corretos. Os totais da interface são calculados da base; atualize os testes ao ampliar o conteúdo.

## Planejamento e compras

**Preparos inteiros** arredonda para receitas completas. Os novos jantares rendem 2 refeições: planejar o mesmo preparo em dois dias usa uma receita. **Só as porções planejadas** usa frações do preparo, podendo gerar frações de ovos ou de fornadas. As instruções permanecem com as quantidades originais.

Pesos crus e cozidos de carnes, frango, macaxeira e batata-doce são separados. Água fica fora da lista de compras. Faixas usam o limite superior e aparecem com “até”. Complementos de café da manhã entram somente quando planejados nesse horário. Consulte a conservação de cada card e congele as porções necessárias para dias distantes.

As sugestões semanais respeitam as novas categorias e exclusões. Ao preencher espaços vazios, preservam as escolhas existentes. Referências a receitas excluídas são descartadas quando os dados salvos são carregados.

## Dados e PDFs

Favoritos, cardápios e marcações ficam no navegador, na chave `receitas_rotina_v1`, preservada nesta edição. Não há login, banco de dados, analytics ou sincronização entre aparelhos. Use **Salvar minhas escolhas** e **Restaurar minhas escolhas** para transportar os dados. Limpar os dados do navegador apaga as escolhas locais.

Os PDFs públicos contêm os cards, sem o perfil pessoal do guia de impressão. As fontes DejaVu incluem licença em `src/assets/fonts/LICENCA.txt`.
