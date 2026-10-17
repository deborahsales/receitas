# Receitas para a rotina

Site interativo com as 40 receitas dos cards, a identidade em tons de verde e a logo de quiabos sem texto. A Vercel publica diretamente a pasta `src`, sem executar instalação ou script de build.

## O que está incluído

- 7 cafés da manhã, 10 almoços, 10 jantares e 13 lanches.
- Fotos ilustrativas, ingredientes com quantidades, porção para servir, etapas, equipamentos, alérgenos e conservação.
- Filtros por categoria, equipamento, tempo de preparo e congelamento; seleções com iogurte natural, gelatina com sabor e Ninja Creami.
- Favoritos, planejador semanal com porções e três sugestões de cardápio.
- Lista de compras que soma os ingredientes e considera o rendimento dos preparos.
- Marcação de itens comprados, itens extras, cópia e impressão da lista.
- Impressão de receitas e cardápio; download dos cards originais em A4 e A5.
- Exportação e restauração das escolhas em JSON.
- Layout responsivo, navegação por teclado, fontes e imagens locais.

Não é preciso criar conta. As escolhas são salvas no armazenamento local do navegador. Não há banco de dados, login, analytics ou serviços pagos obrigatórios.

## Publicar na Vercel pelo GitHub

1. Extraia o ZIP. A pasta `site_receitas_vercel` contém `package.json`, `vercel.json`, `src`, `scripts` e `tests`.
2. Crie um repositório no GitHub e envie **o conteúdo dessa pasta** para a raiz do repositório. Inclua todos os arquivos de `src`, inclusive fotos, fontes e PDFs. Para enviar a pasta completa com os PDFs, prefira Git pelo terminal ou GitHub Desktop.
3. Acesse [vercel.com/new](https://vercel.com/new), conecte sua conta do GitHub e importe o repositório.
4. Se o painel pedir a configuração, use:

| Campo | Valor |
| --- | --- |
| Framework Preset | Other |
| Root Directory | A pasta que contém `vercel.json` e `src` |
| Build Command | Vazio, com Override ativado |
| Install Command | Vazio, com Override ativado |
| Output Directory | `src` |
| Variáveis de ambiente | Nenhuma |

5. Clique em **Deploy**. Quando a publicação terminar, abra o endereço fornecido pela Vercel.

O arquivo `vercel.json` já desativa instalação e build e declara a pasta de saída `src`. Se o repositório tiver uma pasta externa `site_receitas_vercel`, selecione essa pasta em Root Directory. A raiz é a pasta que contém `src`; não selecione a própria pasta `src` como Root Directory.

Se preferir usar o terminal, execute dentro do projeto:

```bash
npx vercel --prod
```

O comando da Vercel pedirá seu login e o projeto de destino. Ele publica no ambiente de produção quando você o executar. Este pacote não foi publicado automaticamente.

Se você já tentou publicar a versão anterior, substitua o `vercel.json` da raiz pelo arquivo atualizado e faça um novo deploy. Na Vercel, confira **Settings → Build and Deployment**: remova qualquer comando antigo de build ou instalação e troque a saída de `dist` para `src`.

Documentação oficial: [configuração de build](https://vercel.com/docs/builds/configure-a-build) e [Vercel CLI Deploy](https://vercel.com/docs/cli/deploy).

## Abrir no computador antes de publicar

Instale o [Node.js](https://nodejs.org/) 20 ou mais recente. Na pasta do projeto:

```bash
npm run dev
```

Abra `http://localhost:3000`. Para escolher outra porta: `npm run dev -- --port 3001`.

Não abra `src/index.html` com um duplo clique: o navegador precisa servir os módulos JavaScript e o JSON por HTTP. O servidor local acima faz isso. Não é necessário instalar dependências para executar este projeto.

## Editar

| Arquivo ou pasta | Conteúdo |
| --- | --- |
| `src/data/recipes.json` | As 40 receitas, seus textos, ingredientes e metadados |
| `src/styles.css` | Paleta, fontes, espaçamentos, responsividade e impressão |
| `src/app.js` | Interface, navegação, favoritos, cardápio e impressão |
| `src/core.js` | Regras de busca, rendimento e lista de compras |
| `src/assets/photos` | Fotos WebP: imagem completa e miniatura por receita |
| `src/assets/logo-quiabo.svg` | Logo vetorial original sem texto |
| `src/assets/logo-quiabo.webp` | Versão otimizada usada na interface |
| `src/downloads` | PDFs dos 40 cards em A4 e A5 |
| `src/index.html` | Título da aba, descrição, cabeçalho e rodapé |

Os IDs `01` a `40` conectam receitas, fotos, favoritos e cardápios. Preserve esses IDs ao alterar uma receita. A verificação de integridade espera exatamente 40 receitas; para ampliar o catálogo, atualize também os totais da interface e os testes.

Depois de editar, rode:

```bash
npm test
npm run build
```

O build local é opcional: ele recria `dist` a partir de `src`, mas a configuração atual da Vercel publica `src` diretamente. Faça as edições em `src`. Na publicação pelo GitHub, um novo commit pode iniciar um novo deploy conforme a configuração do projeto na Vercel.

## Se aparecer MODULE_NOT_FOUND

O final da pilha com `requireStack: []` não identifica sozinho o arquivo ausente. Procure a primeira linha `Error: Cannot find module '...'` e confira qual caminho foi usado. Os scripts `scripts/build.mjs` e `scripts/dev.mjs` estão incluídos no ZIP, ao lado de `package.json` na estrutura do projeto.

No computador, extraia o ZIP inteiro e execute `npm run dev` na pasta que contém `package.json` e `scripts`. Não execute `node index.html`, `node src` ou comandos dentro do ZIP ainda compactado.

Na Vercel, a configuração atual não executa esses scripts: Framework **Other**, Build Command e Install Command vazios e saída **src**. O arquivo `vercel.json` precisa estar na Root Directory selecionada. Se o erro continuar, envie a linha `Cannot find module ...` e o comando executado para identificar a causa exata.

## Como a lista de compras calcula

- **Preparos inteiros:** arredonda as necessidades para receitas completas. Uma fornada de brownie rende três lanches; planejar três lanches usa os ingredientes de uma fornada.
- **Só as porções planejadas:** usa a fração do preparo correspondente às porções escolhidas. Pode gerar frações de ovos e de fornadas. As instruções do card continuam com as quantidades originais.
- Iogurte complementar dos muffins e quadradinhos entra apenas nas porções planejadas para café da manhã.
- Receitas frias, como potinhos e gelatinas, são separadas em novos lotes quando os dias ficam distantes, conforme a janela de conservação.
- Pesos crus e cozidos de carnes permanecem separados. Água fica fora da lista. Quantidades “a gosto” não são transformadas em uma dose arbitrária.
- Faixas, como 15–30 ml de leite para Re-Spin, usam o limite superior e aparecem com “até”. A reserva opcional é indicada na interface.
- Ao mudar uma receita ou quantidade do cardápio, ingredientes cuja quantidade mudou são desmarcados. Extras e marcações ficam vinculados à semana.

Confira o rendimento e o armazenamento de cada card antes de preparar. A lista é um apoio culinário; não calcula calorias nem define um plano alimentar individual.

## Guardar e levar suas escolhas

Favoritos, cardápios e lista de compras ficam no navegador, na chave `receitas_rotina_v1`. Limpar os dados do site ou usar outro navegador não mantém a seleção. Em navegação privada, ela pode ser apagada ao fechar a sessão.

No rodapé, **Salvar minhas escolhas** baixa um arquivo JSON. **Restaurar minhas escolhas** importa esse arquivo e substitui as escolhas atuais; um botão permite desfazer logo após a importação. Os dados não são sincronizados entre aparelhos.

## PDFs e imagens

Os dois PDFs públicos incluem os cards, sem o perfil pessoal do guia original. As fotos são ilustrações geradas por IA e o aviso aparece no site. O SVG da logo mantém os elementos vetoriais. A licença das fontes DejaVu está em `src/assets/fonts/LICENCA.txt`.

## Verificação deste pacote

Foram executados 21 testes automatizados das regras e uma simulação de DOM cobrindo busca, filtros, favoritos, 40 detalhes completos, cardápio, rendimentos, compras, impressão, downloads e backup/restauração. O catálogo foi comparado com os 40 cards revisados, sem diferenças nos textos e quantidades originais.

O build foi validado e os caminhos dos arquivos locais foram conferidos. Não houve prévia visual em navegador neste ambiente. Após o deploy, confira a aparência no seu celular e no computador antes de divulgar o endereço.

## Estrutura técnica

HTML, CSS e JavaScript com módulos nativos. A publicação na Vercel serve `src` diretamente. O build local opcional e o servidor de desenvolvimento usam apenas módulos padrão do Node.js. Não há dependências de execução, chaves de API, autenticação nem etapa de configuração de banco de dados. Rotas de receitas usam hash, por exemplo `/#receita/07`, e funcionam no site estático.
