import { CATEGORIES, MEALS, STORAGE_KEY, SHOP_GROUPS, TEMPLATES, number, normalize, escapeHTML as e, category, searchMatches, compatible, filterRecipes, localISO, parseDate, monday, shiftDays, weekDays, weekLabel, freshState, sanitizeState, shoppingList, formatShoppingQuantity, applyTemplate } from './core.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const main = $('#main-content');
const recipeDialog = $('#recipe-dialog');
const utilityDialog = $('#utility-dialog');
const weekdayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
const icons = {
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h3z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-13 4h2m4 0h2m-8 3h2"/>',
  bag: '<path d="M5 7h14l2 14H3zM8 8V6a4 4 0 0 1 8 0v2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.2"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  left: '<path d="m15 5-7 7 7 7"/>',
  right: '<path d="m9 5 7 7-7 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M3.5 10l4.1-1.1-1.1-4.1m11 14.4-1.1-4.1 4.1-1.1M3.5 14l4.1 1.1-1.1 4.1m11-14.4-1.1 4.1 4.1 1.1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10Z"/>',
  plate: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><path d="M1 5v5m0 3v7M23 5v15"/>',
  snack: '<path d="m4 9 2-5h12l2 5-2 12H6zM4 9h16M9 14h6"/>',
  leaf: '<path d="M20 3C5 2 1 10 6 16s15 3 14-13Z"/><path d="M4 21 16 8"/>',
  oven: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M8 5.5h.1m4 0h.1m4 0h.1M8 12h8v6H8z"/>',
  pan: '<path d="M3 10h15v4a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6zm15 2h5M7 3v3m5-3v3"/>',
  blender: '<path d="M6 3h12l-2 12H8zM9 15l-2 6h10l-2-6M9 6h5m-6 3h5"/><circle cx="12" cy="18" r=".6"/>',
  air: '<rect x="5" y="3" width="14" height="18" rx="4"/><path d="M5 10h14M9 6h.1m3 0h.1m-3 8h6v3H9z"/>',
  fridge: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M6 10h12M9 5v2m0 6v3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  edit: '<path d="m14 5 5 5M4 20l5-1L21 7l-5-5L4 14z"/>',
  print: '<path d="M6 8V3h12v5M6 17H3V8h18v9h-3M6 14h12v7H6zM17 11h.1"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
  bulb: '<path d="M9 18h6m-6 3h6M8 15a7 7 0 1 1 8 0l-1 3H9z"/>',
  portion: '<path d="M3 13a9 9 0 0 0 18 0H3Zm-1 0h20M8 3v4m4-4v4m4-4v4"/>',
  sparkle: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>',
};
function icon(name) { return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.plate}</svg>`; }
function equipmentIcon(name) {
  if (/airfryer/i.test(name)) return 'air';
  if (/forno/i.test(name)) return 'oven';
  if (/fogão/i.test(name)) return 'pan';
  if (/geladeira/i.test(name)) return 'fridge';
  if (/liquidificador|creami/i.test(name)) return 'blender';
  return 'portion';
}
const freezerLabel = { yes: 'Pode congelar', partial: 'Congela em partes', none: 'Sem congelar' };
let recipes = [], byId = new Map(), state = freshState(), view = 'receitas', renderedView = '', week = monday();
let filters = { sort: 'collection' }, returnRoute = '#receitas', currentRecipe = null, utilityContext = null;
let storageAvailable = true, toastTimer, undoAction, lastFocus;

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { storageAvailable = false; showToast('Não foi possível salvar neste navegador. Use “Salvar minhas escolhas” no rodapé.'); }
}
function loadState() {
  try { state = sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'), recipes); }
  catch { state = freshState(); storageAvailable = false; }
}
function planFor(selectedWeek = week) { return state.plans[selectedWeek] || {}; }
function updatePlan(plan, selectedWeek = week) {
  const previous = shoppingList(planFor(selectedWeek), recipes, state.shoppingMode).items;
  const next = shoppingList(plan, recipes, state.shoppingMode).items;
  const previousQty = new Map(previous.map(item => [item.key, formatShoppingQuantity(item)]));
  const nextQty = new Map(next.map(item => [item.key, formatShoppingQuantity(item)]));
  state.checks[selectedWeek] = (state.checks[selectedWeek] || []).filter(key => key.startsWith('extra:') || (nextQty.has(key) && nextQty.get(key) === previousQty.get(key)));
  if (Object.keys(plan).length) state.plans[selectedWeek] = plan;
  else delete state.plans[selectedWeek];
  persist();
}
function showToast(message, label, action) {
  clearTimeout(toastTimer); undoAction = action;
  $('#toast').innerHTML = `<span>${e(message)}</span>${label ? `<button data-action="toast-action">${e(label)}</button>` : ''}`;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => { $('#toast').classList.remove('visible'); undoAction = null; }, label ? 11000 : 5000);
}
function favoriteButtons() {
  $$('[data-action="favorite"]').forEach(button => {
    const recipe = byId.get(button.dataset.id), selected = state.favorites.includes(button.dataset.id);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', `${selected ? 'Remover dos favoritos' : 'Favoritar'}: ${recipe?.title || ''}`);
    const label = $('[data-favorite-label]', button); if (label) label.textContent = selected ? 'Favorita' : 'Favoritar';
  });
  $('#favorites-count').textContent = state.favorites.length;
  $('#favorites-count').hidden = !state.favorites.length;
}
function toggleFavorite(id) {
  if (!byId.has(id)) return;
  const index = state.favorites.indexOf(id);
  if (index < 0) state.favorites.push(id); else state.favorites.splice(index, 1);
  persist(); favoriteButtons();
  if (view === 'favoritos') renderCatalogResults();
  showToast(index < 0 ? 'Receita salva nos favoritos.' : 'Receita removida dos favoritos.');
}
function renderCurrent() {
  if (view === 'receitas' || view === 'favoritos') renderCatalog();
  else if (view === 'cardapio') renderPlanner();
  else renderShopping();
  renderedView = view;
  $$('[data-nav]').forEach(link => {
    if (link.dataset.nav === view) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  favoriteButtons();
}
function route() {
  const hash = window.location.hash || '#receitas';
  const match = hash.match(/^#receita\/(\d{2})$/);
  if (match && byId.has(match[1])) {
    if (!renderedView) renderCurrent();
    openRecipe(match[1]); return;
  }
  if (recipeDialog.open) { recipeDialog.close(); currentRecipe = null; }
  if (utilityDialog.open) closeUtility();
  const next = ['receitas', 'favoritos', 'cardapio', 'compras'].includes(hash.slice(1)) ? hash.slice(1) : 'receitas';
  const changed = renderedView !== next;
  view = next; returnRoute = `#${next}`;
  if (changed || !renderedView) {
    renderCurrent(); window.scrollTo({ top: 0 });
    if (changed) main.focus({ preventScroll: true });
  }
  document.title = `${({ receitas: 'OKRArdapio', favoritos: 'Minhas favoritas', cardapio: 'Meu cardápio', compras: 'Lista de compras' })[view]}${view === 'receitas' ? '' : ' · OKRArdapio'}`;
}
function closeRecipe() {
  if (utilityDialog.open) closeUtility();
  if (recipeDialog.open) recipeDialog.close();
  currentRecipe = null;
  if (window.location.hash.startsWith('#receita/')) history.replaceState(null, '', returnRoute);
  document.title = view === 'receitas' ? 'OKRArdapio' : `${({ favoritos: 'Minhas favoritas', cardapio: 'Meu cardápio', compras: 'Lista de compras' })[view]} · OKRArdapio`;
  if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
  else main.focus({ preventScroll: true });
}

function hero() {
  return `<section class="hero container" aria-labelledby="hero-title">
    <div class="hero-copy"><div class="eyebrow">${icon('leaf')} Pequenas escolhas, bons sabores</div>
    <h1 id="hero-title">Uma boa refeição começa com <em>uma ideia.</em></h1>
    <p>${recipes.length} receitas para variar o que vai ao prato. Escolha seus sabores, organize a semana e leve só o que precisa para casa.</p>
    <div class="hero-actions"><button class="button button-lime" data-action="explore">Explorar receitas ${icon('arrow')}</button><a href="#cardapio" class="button button-ghost">Montar meu cardápio ${icon('calendar')}</a></div>
    <div class="hero-note">${icon('check')} Do smoothie de 5 minutos ao preparo em lote.</div></div>
    <div class="hero-visual"><img class="hero-food" src="assets/photos/07.webp" alt="Frango com limão e páprica acompanhado de batatas assadas" width="1200" height="800" fetchpriority="high"><a href="#receita/38" aria-label="Ver Creami de morango e iogurte"><img class="hero-round" src="assets/photos/38-small.webp" width="600" height="400" alt="Sorvete de morango e iogurte para a Ninja Creami"></a><div class="hero-stamp" aria-label="${recipes.length} receitas"><strong>${recipes.length}</strong><span>receitas</span></div><a href="#receita/07" class="hero-photo-link"><span><small>Hoje pode ser assim</small><strong>Frango, limão e batatas douradas</strong></span>${icon('arrow')}</a></div>
  </section>`;
}
function categoryTabs() {
  const favoriteSet = new Set(state.favorites);
  const base = view === 'favoritos' ? recipes.filter(r => favoriteSet.has(r.id)) : recipes;
  return `<div class="category-tabs" role="group" aria-label="Categoria da receita"><button class="category-tab ${!filters.category ? 'active' : ''}" data-action="category" data-value="" aria-pressed="${!filters.category}">${icon('book')} Todas <span class="count">${base.length}</span></button>${CATEGORIES.map(c => `<button class="category-tab ${filters.category === c.name ? 'active' : ''}" data-action="category" data-value="${e(c.name)}" aria-pressed="${filters.category === c.name}">${icon(c.icon)} ${e(c.name)} <span class="count">${base.filter(r => r.category === c.name).length}</span></button>`).join('')}</div>`;
}
function option(value, label, current) { return `<option value="${e(value)}"${String(current || '') === String(value) ? ' selected' : ''}>${e(label)}</option>`; }
function catalogTools() {
  const equipment = ['Airfryer', 'Forno', 'Fogão', 'Liquidificador', 'Ninja Creami', 'Sem cocção'];
  return `<div class="catalog-tools"><div class="searchbox">${icon('search')}<label class="sr-only" for="recipe-search">Buscar receita ou ingrediente</label><input type="search" id="recipe-search" placeholder="O que você quer preparar? Busque receita ou ingrediente" value="${e(filters.search || '')}" autocomplete="off"><button class="search-clear" data-action="search-clear" aria-label="Limpar busca"${!filters.search ? ' hidden' : ''}>${icon('close')}</button></div><div class="sortbox"><label class="sr-only" for="sort-recipes">Ordenar receitas</label><select id="sort-recipes" data-filter="sort">${option('collection', 'Ordem dos cards', filters.sort)}${option('time', 'Menor tempo', filters.sort)}${option('name', 'Ordem alfabética', filters.sort)}</select></div></div>
  <div class="filter-row"><label class="filter-field">${icon('pan')}<span class="sr-only">Equipamento</span><select data-filter="equipment" aria-label="Filtrar por equipamento" class="${filters.equipment ? 'has-value' : ''}">${option('', 'Todos os equipamentos', filters.equipment)}${equipment.map(x => option(x, x, filters.equipment)).join('')}</select></label><label class="filter-field">${icon('clock')}<span class="sr-only">Tempo</span><select data-filter="maxTime" aria-label="Filtrar por tempo" class="${filters.maxTime ? 'has-value' : ''}">${option('', 'Qualquer tempo', filters.maxTime)}${[10, 20, 30, 45].map(n => option(String(n), `Até ${n} min de preparo`, filters.maxTime)).join('')}</select></label><label class="filter-field">${icon('snow')}<span class="sr-only">Congelamento</span><select data-filter="freezer" aria-label="Filtrar por congelamento" class="${filters.freezer ? 'has-value' : ''}">${option('', 'Congelamento: todos', filters.freezer)}${Object.entries(freezerLabel).map(([k, v]) => option(k, v, filters.freezer)).join('')}</select></label><button class="text-button" data-action="reset-filters">Limpar filtros</button></div>
  <div class="quick-filters" role="group" aria-label="Seleções especiais"><span>Experimente também</span>${[['yogurt', 'Com iogurte natural', 'portion'], ['gelatin', 'Com gelatina', 'snack'], ['creami', 'Ninja Creami', 'snow']].map(([key, label, glyph]) => `<button class="quick-chip ${filters.ingredient === key ? 'active' : ''}" data-action="ingredient-filter" data-value="${key}" aria-pressed="${filters.ingredient === key}">${icon(glyph)}${label}</button>`).join('')}</div>`;
}
function renderCatalog() {
  const favorites = view === 'favoritos';
  main.innerHTML = `${favorites ? `<div class="container page-heading"><div class="eyebrow">${icon('heart')} Sua seleção</div><h1>Receitas para repetir.</h1><p>Guarde as que você gosta e encontre uma boa ideia sempre que precisar.</p></div>` : hero()}
  <section class="collection container" id="collection" aria-labelledby="collection-title"><div class="section-heading"><h2 id="collection-title">${favorites ? 'Minhas favoritas' : 'O que vamos preparar?'}</h2><p>${CATEGORIES.map((c, i) => `${recipes.filter(r => r.category === c.name).length} ${['cafés', 'almoços', 'jantares', 'lanches'][i]}`).join(' · ')}</p></div><div id="category-tabs">${categoryTabs()}</div>${catalogTools()}<div class="results-bar"><p id="result-count" role="status" aria-live="polite"></p><p class="waiting-note">Tempos de espera e congelamento aparecem em cada receita.</p></div><div id="catalog-results"></div>${!storageAvailable ? '<div class="storage-fallback">O navegador não permitiu salvar as escolhas. Use o botão “Salvar minhas escolhas” no rodapé antes de sair.</div>' : ''}</section>`;
  renderCatalogResults();
}
function renderCatalogResults() {
  const target = $('#catalog-results'); if (!target) return;
  const result = filterRecipes(recipes, { ...filters, onlyFavorites: view === 'favoritos' }, state.favorites);
  $('#category-tabs').innerHTML = categoryTabs();
  $('#result-count').innerHTML = `<strong>${result.length}</strong> ${result.length === 1 ? 'receita encontrada' : 'receitas encontradas'}`;
  if (result.length) target.innerHTML = `<div class="recipe-grid">${result.map(recipeCard).join('')}</div>`;
  else if (view === 'favoritos' && !state.favorites.length) target.innerHTML = empty('heart', 'Sua próxima favorita está por aqui.', 'Toque no coração de uma receita para guardar nesta seleção.', '<a href="#receitas" class="button button-lime">Explorar receitas</a>');
  else target.innerHTML = empty('search', 'Vamos tentar outra combinação?', 'Não há receitas com estes filtros. Busque outro ingrediente ou limpe a seleção.', '<button class="button button-light" data-action="reset-filters">Limpar filtros</button>');
  favoriteButtons();
}
function recipeCard(r, index) {
  const c = category(r.category), favorite = state.favorites.includes(r.id);
  const primary = r.is_creami ? 'Ninja Creami' : r.equipment_tags[0];
  return `<article class="recipe-card" data-recipe-card="${r.id}"><div class="recipe-image"><a href="#receita/${r.id}" aria-label="Ver receita: ${e(r.title)}"><img src="${r.thumbnail}" width="600" height="400" alt="${e(r.title)} pronto para servir" loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async"></a><button class="favorite-button" data-action="favorite" data-id="${r.id}" aria-label="${favorite ? 'Remover dos favoritos' : 'Favoritar'}: ${e(r.title)}" aria-pressed="${favorite}">${icon('heart')}</button><span class="category-badge ${c.className}">${e(r.category)}</span></div><div class="recipe-body"><div class="recipe-meta"><span class="time">${icon('clock')}${e(r.time)}</span><span class="recipe-id">#${r.id}</span></div><h3><a href="#receita/${r.id}">${e(r.title)}</a></h3><p class="recipe-subtitle">${e(r.subtitle)}</p><div class="recipe-tags"><span class="recipe-tag">${icon(equipmentIcon(primary))}${e(primary)}</span><span class="recipe-tag">${icon(r.freezer_status === 'none' ? 'fridge' : 'snow')}${freezerLabel[r.freezer_status]}</span></div><div class="recipe-footer"><a href="#receita/${r.id}" class="recipe-link">Ver receita ${icon('arrow')}</a><button class="plan-card-button" data-action="plan-recipe" data-id="${r.id}" aria-label="Adicionar ${e(r.title)} ao cardápio">${icon('plus')} Cardápio</button></div></div></article>`;
}
function empty(glyph, title, description, actions = '') {
  return `<div class="empty-state"><div class="empty-icon">${icon(glyph)}</div><h2>${e(title)}</h2><p>${e(description)}</p>${actions ? `<div class="empty-actions">${actions}</div>` : ''}</div>`;
}

function openRecipe(id) {
  const r = byId.get(id); if (!r) return;
  if (currentRecipe === id && recipeDialog.open) return;
  if (utilityDialog.open) closeUtility();
  lastFocus = document.activeElement; currentRecipe = id;
  const c = category(r.category);
  $('#recipe-content').innerHTML = `<div class="dialog-topbar"><button class="dialog-back" data-action="close-recipe">${icon('back')} Voltar</button><div class="dialog-topbar-actions"><button class="icon-button small" data-action="favorite" data-id="${id}" aria-label="Favoritar: ${e(r.title)}" aria-pressed="${state.favorites.includes(id)}">${icon('heart')}</button><button class="icon-button small" data-action="share-recipe" data-id="${id}" aria-label="Copiar link da receita" title="Copiar link">${icon('share')}</button><button class="icon-button small" data-action="print-recipe" data-id="${id}" aria-label="Imprimir receita" title="Imprimir">${icon('print')}</button><button class="button button-light" data-action="plan-recipe" data-id="${id}">${icon('plus')} Cardápio</button></div></div>
  <div class="detail-hero"><div><img class="detail-image" src="${r.image}" width="1200" height="800" alt="${e(r.title)} pronto para servir"><p class="image-note">Imagem ilustrativa gerada por IA.</p></div><div><div class="detail-title-line"><span class="category-badge ${c.className}">${e(r.category)}</span><span class="recipe-id">#${id}</span></div><h1 id="recipe-title">${e(r.title)}</h1><p class="detail-subtitle">${e(r.subtitle)}</p><div class="detail-meta"><span>${icon('clock')}${e(r.time)}</span><span>${icon('portion')}${e(r.yield_text)}</span></div><div class="serving-note"><strong>Porção para servir</strong>${e(r.serving)}</div>${r.alternative_categories.length ? `<p class="alternative-note">Também pode ser: ${e(r.alternative_categories.join(', '))}. Confira a porção acima.</p>` : ''}</div></div>
  <div class="detail-nav" aria-label="Seções da receita"><button data-action="detail-section" data-target="ingredients">Ingredientes</button><button data-action="detail-section" data-target="steps">Modo de preparo</button><button data-action="detail-section" data-target="methods">Equipamentos</button><button data-action="detail-section" data-target="storage">Como guardar</button></div>
  <div class="detail-body"><div class="recipe-columns"><section class="detail-section" id="detail-ingredients"><h2>Ingredientes</h2><p class="section-caption">Quantidades para o preparo inteiro. Siga a porção para servir. Marque o que já separou.</p><ul class="ingredient-list">${r.ingredients.map(([name, qty], i) => `<li><label class="ingredient-row"><input type="checkbox" aria-label="Já separei: ${e(name)}"><span>${e(name)}</span><strong>${e(qty)}</strong></label></li>`).join('')}</ul><div class="recipe-tip"><strong>${icon('bulb')} Uma dica antes de começar</strong><p>${e(r.tip)}</p></div></section><section class="detail-section" id="detail-steps"><h2>Modo de preparo</h2><ol class="steps-list">${r.steps.map(([title, text], i) => `<li class="step"><span class="step-number" aria-hidden="true">${i + 1}</span><div><h3>${e(title)}</h3><p>${e(text)}</p></div></li>`).join('')}</ol></section></div>
  <section class="detail-section equipment-section" id="detail-methods"><h2>Formas de preparar</h2><p class="section-caption">Os tempos podem variar conforme o aparelho. Confira o ponto indicado na receita.</p><div class="methods-grid">${r.methods.map(([method, text]) => `<div class="method-box"><h3>${icon(equipmentIcon(method))}${e(method)}</h3><p>${e(text)}</p></div>`).join('')}</div><p class="equipment-caption"><strong>Utensílios:</strong> ${e(r.equipment)}</p></section>
  <section class="detail-section storage-section" id="detail-storage"><h2>Prepare hoje. Aproveite depois.</h2><div class="storage-grid"><div class="storage-box"><h3>${icon('fridge')} Na geladeira</h3><p>${e(r.storage)}</p></div><div class="storage-box"><h3>${icon('snow')} Pode congelar?</h3><p>${e(r.freeze)}</p></div><div class="storage-box"><h3>${icon('portion')} Na hora de consumir</h3><p>${e(r.thaw)}</p></div></div></section><p class="allergen-note"><strong>Alérgenos:</strong> ${e(r.allergens)}</p><div class="detail-bottom-actions"><button class="button button-outline" data-action="guide">${icon('info')} Guia de preparo</button><button class="button" data-action="plan-recipe" data-id="${id}">${icon('calendar')} Colocar no cardápio</button></div></div>`;
  if (!recipeDialog.open) recipeDialog.showModal();
  recipeDialog.scrollTop = 0; favoriteButtons();
  document.title = `${r.title} · OKRArdapio`;
}

function weekNavigation() {
  return `<div class="week-navigation"><button class="icon-button" data-action="week-prev" aria-label="Semana anterior">${icon('left')}</button><span class="week-label">${e(weekLabel(week))}</span><button class="icon-button" data-action="week-next" aria-label="Próxima semana">${icon('right')}</button><button class="text-button" data-action="week-today">Esta semana</button></div>`;
}
function renderPlanner() {
  const plan = planFor(), days = weekDays(week), entries = Object.values(plan), portions = entries.reduce((sum, x) => sum + x.portions, 0);
  main.innerHTML = `<div class="container"><div class="page-heading"><div class="eyebrow">${icon('calendar')} Uma semana de cada vez</div><h1>Seu cardápio, do seu jeito.</h1><p>Escolha as refeições e quantas porções quer servir. Comece do zero ou use uma sugestão para preencher os espaços vazios.</p></div><section class="page-content" aria-label="Planejador semanal"><div class="page-toolbar">${weekNavigation()}<div class="toolbar-actions"><button class="button button-light button-sm" data-action="templates">${icon('sparkle')} Usar sugestão</button><button class="button button-outline button-sm" data-action="print-plan">${icon('print')} Imprimir</button><button class="text-button" data-action="clear-week"${entries.length ? '' : ' disabled'}>Limpar semana</button></div></div><div class="plan-summary">${icon('check')}<span><strong>${entries.length} de 28</strong> refeições escolhidas</span><span>${portions} ${portions === 1 ? 'porção planejada' : 'porções planejadas'}</span><span class="spacer"></span><a href="#compras" class="button button-sm button-lime">Ver lista de compras ${icon('arrow')}</a></div>
  <div class="weekly-grid">${days.map((date, day) => `<section class="day-column ${localISO(date) === localISO(new Date()) ? 'is-today' : ''}" aria-label="${weekdayNames[day]}, ${shortDate.format(date)}"><div class="day-heading"><strong>${weekdayNames[day]}</strong><span>${shortDate.format(date)}</span></div>${MEALS.map(meal => {
    const slot = `${day}:${meal.key}`, entry = plan[slot], r = entry && byId.get(entry.recipeId);
    return `<div class="meal-slot"><div class="meal-label">${icon(meal.icon)}${meal.name}</div>${r ? `<a href="#receita/${r.id}" aria-label="Ver ${e(r.title)}"><img class="slot-image" src="${r.thumbnail}" width="600" height="400" alt="" loading="lazy"></a><a href="#receita/${r.id}" class="slot-title">${e(r.title)}</a><button class="slot-remove" data-action="remove-slot" data-slot="${slot}" aria-label="Remover ${e(r.title)} de ${weekdayNames[day]}, ${meal.name}">${icon('close')}</button><div class="slot-bottom"><span>${entry.portions} ${entry.portions === 1 ? 'porção' : 'porções'}</span><button class="icon-button" data-action="pick-slot" data-slot="${slot}" aria-label="Editar ${meal.name} de ${weekdayNames[day]}">${icon('edit')}</button></div>` : `<button class="slot-empty" data-action="pick-slot" data-slot="${slot}" aria-label="Escolher ${meal.name} de ${weekdayNames[day]}">${icon('plus')} Escolher receita</button>`}</div>`;
  }).join('')}</section>`).join('')}</div><div class="mealprep-note">${icon('snow')}<p><strong>Um preparo pode render mais de uma refeição.</strong> A lista de compras considera o rendimento de cada receita. Para usar nos dias seguintes, siga os prazos e as instruções de conservação do card.</p></div>${!entries.length ? `<div class="template-strip">${Object.entries(TEMPLATES).map(([key, t]) => `<button class="template-small" data-action="apply-template" data-value="${key}">${icon('sparkle')}${e(t.name)}</button>`).join('')}</div>` : ''}<p class="dialog-note">As sugestões ajudam a organizar a cozinha e podem ser alteradas livremente. As porções são referências culinárias; necessidades individuais variam.</p></section></div>`;
}
function shoppingData() { return shoppingList(planFor(), recipes, state.shoppingMode); }
function allShoppingKeys(items) { return [...items.map(i => i.key), ...(state.extras[week] || []).map(i => `extra:${i.id}`)]; }
function checkedCount(items) { const checks = new Set(state.checks[week] || []); return allShoppingKeys(items).filter(key => checks.has(key)).length; }
function renderShopping() {
  const { groups, items } = shoppingData(), extras = state.extras[week] || [], checks = new Set(state.checks[week] || []), total = items.length + extras.length;
  main.innerHTML = `<div class="container"><div class="page-heading"><div class="eyebrow">${icon('bag')} Da ideia à despensa</div><h1>A semana começa na lista.</h1><p>Os ingredientes do seu cardápio, somados e organizados. Marque o que já tem em casa ou o que colocou na cesta.</p></div><section class="page-content" aria-label="Lista de compras semanal"><div class="page-toolbar">${weekNavigation()}<div class="toolbar-actions"><button class="button button-outline button-sm" data-action="copy-shopping"${total ? '' : ' disabled'}>${icon('copy')} Copiar lista</button><button class="button button-outline button-sm" data-action="print-shopping"${total ? '' : ' disabled'}>${icon('print')} Imprimir</button></div></div>
  <div class="shopping-layout"><div class="shopping-main"><div class="shopping-controls"><div class="segmented" role="group" aria-label="Cálculo dos ingredientes"><button class="${state.shoppingMode === 'batch' ? 'active' : ''}" data-action="shopping-mode" data-value="batch" aria-pressed="${state.shoppingMode === 'batch'}">Preparos inteiros</button><button class="${state.shoppingMode === 'portions' ? 'active' : ''}" data-action="shopping-mode" data-value="portions" aria-pressed="${state.shoppingMode === 'portions'}">Só as porções planejadas</button></div><p>${state.shoppingMode === 'batch' ? 'Considera a receita inteira e aproveita o rendimento. Ex.: 1 fornada de brownie atende 3 lanches. Podem sobrar porções para guardar. Preparos frios de dias distantes são separados em novos lotes.' : 'Calcula a fração correspondente às porções do cardápio. Pode resultar em frações de ovos e de fornadas. Os cards mantêm as quantidades originais; confira o rendimento antes de preparar.'}</p></div>
  ${total ? `<div class="shopping-progress"><div class="progress-caption"><span id="shopping-progress-text">${checkedCount(items)} de ${total} itens marcados</span><button class="text-button" data-action="uncheck-shopping">Desmarcar todos</button></div><div class="progress-track"><div class="progress-fill" id="shopping-progress-fill" style="width:${Math.round(checkedCount(items) / total * 100)}%"></div></div></div>` : ''}
  <div id="shopping-groups">${!items.length && !extras.length ? empty('bag', 'O cardápio dá origem à lista.', 'Adicione refeições à semana e os ingredientes aparecerão aqui. Você também pode incluir itens extras abaixo.', '<a href="#cardapio" class="button button-lime">Montar meu cardápio</a>') : SHOP_GROUPS.map(group => {
    const members = items.filter(i => i.group === group);
    return members.length ? `<section class="shopping-group"><h2>${icon(group === 'Hortifruti' ? 'leaf' : group === 'Laticínios e bebidas' ? 'fridge' : 'bag')}${group}<span>${members.length} itens</span></h2>${members.map((item, i) => shoppingItem(item, checks, `${SHOP_GROUPS.indexOf(group)}-${i}`)).join('')}</section>` : '';
  }).join('')}${extras.length ? `<section class="shopping-group"><h2>${icon('plus')}Itens extras<span>${extras.length} itens</span></h2>${extras.map((item, i) => `<div class="shopping-item ${checks.has(`extra:${item.id}`) ? 'is-checked' : ''}"><input type="checkbox" id="extra-${i}" data-shop-key="${e(`extra:${item.id}`)}"${checks.has(`extra:${item.id}`) ? ' checked' : ''}><label class="item-description" for="extra-${i}"><strong>${e(item.name)}</strong></label><span class="shopping-quantity">${e(item.quantity)}</span><button class="icon-button small" data-action="remove-extra" data-id="${e(item.id)}" aria-label="Remover ${e(item.name)}">${icon('close')}</button></div>`).join('')}</section>` : ''}</div>
  <form class="extra-form" id="extra-form"><h3>Mais alguma coisa?</h3><div class="extra-fields"><label class="sr-only" for="extra-name">Nome do item extra</label><input id="extra-name" name="name" placeholder="Adicionar um item à lista" required maxlength="120"><label class="sr-only" for="extra-quantity">Quantidade</label><input id="extra-quantity" name="quantity" placeholder="Quantidade" maxlength="60"><button class="button" type="submit">${icon('plus')} Adicionar</button></div></form><p class="shopping-footnote">Quantidades conforme os ingredientes dos cards, incluindo pesos crus, limpos ou já cozidos. Água não entra na lista; temperos “a gosto” devem ser conferidos em casa. Gelatina: confira a dose e o rendimento do rótulo. Extras e ingredientes ficam salvos por semana.</p></div>
  <aside class="shopping-aside"><div class="prep-card"><h2>O que vai sair da cozinha</h2><p>${groups.length ? 'Cada multiplicador se refere ao preparo original completo. Abra a receita para conferir a porção e como guardar.' : 'Escolha uma receita e comece a planejar.'}</p><ul class="prep-list">${groups.map(prep => `<li><a href="#receita/${prep.recipe.id}"><span class="prep-multiplier">${number(prep.multiplier)}×</span>${e(prep.recipe.title)}</a><small>${prep.planned} ${prep.planned === 1 ? 'porção planejada' : 'porções planejadas'} · ${[...new Set(prep.days)].map(day => weekdayNames[day].slice(0, 3)).join(', ')}</small><small>Receita original: ${e(prep.recipe.yield_text)}</small></li>`).join('')}</ul><a href="#cardapio" class="button button-outline button-sm" style="margin-top:18px;width:100%">${icon('edit')} Ajustar cardápio</a></div></aside></div></section></div>`;
}
function shoppingItem(item, checks, index) {
  const hint = item.label.startsWith('Ovos') ? 'Peso sem casca; 1 ovo médio tem cerca de 50 g.' : item.optional ? 'Inclui reserva opcional para ajustar a textura no Re-Spin.' : '';
  return `<div class="shopping-item ${checks.has(item.key) ? 'is-checked' : ''}"><input type="checkbox" id="shop-${index}" data-shop-key="${e(item.key)}"${checks.has(item.key) ? ' checked' : ''}><label class="item-description" for="shop-${index}"><strong>${e(item.label)}</strong>${hint ? `<small>${hint}</small>` : ''}</label><span class="shopping-quantity">${e(formatShoppingQuantity(item))}</span></div>`;
}
function updateShoppingProgress() {
  const { items } = shoppingData(), total = allShoppingKeys(items).length;
  if ($('#shopping-progress-text')) $('#shopping-progress-text').textContent = `${checkedCount(items)} de ${total} itens marcados`;
  if ($('#shopping-progress-fill')) $('#shopping-progress-fill').style.width = `${total ? Math.round(checkedCount(items) / total * 100) : 0}%`;
}

function openUtility(title, subtitle, body, footer = '', wide = false) {
  utilityDialog.classList.toggle('wide', wide);
  $('#utility-content').innerHTML = `<div class="utility-header"><div><h2 id="utility-title">${e(title)}</h2>${subtitle ? `<p>${e(subtitle)}</p>` : ''}</div><button class="icon-button small" data-action="close-utility" aria-label="Fechar janela">${icon('close')}</button></div>${body}${footer}`;
  if (!utilityDialog.open) utilityDialog.showModal();
  utilityDialog.scrollTop = 0;
}
function closeUtility() { if (utilityDialog.open) utilityDialog.close(); utilityContext = null; }
function defaultMeal(recipe) { return MEALS.find(m => m.name === recipe.category)?.key || 'snack'; }
function openPlanRecipe(id) {
  const r = byId.get(id); if (!r) return;
  utilityContext = { type: 'plan-recipe', recipeId: id };
  const today = localISO(new Date()), defaultDate = monday() === week ? today : week;
  openUtility('Uma boa ideia para a semana.', 'Escolha o dia, a refeição e quantas porções quer servir.', `<form id="plan-form"><div class="utility-body"><div class="chosen-recipe"><img src="${r.thumbnail}" width="600" height="400" alt=""><div><strong>${e(r.title)}</strong><small>${e(r.yield_text)} · ${e(r.time)}</small></div></div><div class="form-grid"><label class="field">Dia<input type="date" name="date" value="${defaultDate}" required min="2020-01-01" max="2099-12-31"></label><label class="field">Refeição<select name="meal">${MEALS.map(m => option(m.key, m.name, defaultMeal(r))).join('')}</select></label><label class="field full">Porções para servir<input name="portions" type="number" min="1" max="12" step="1" value="1" required><span class="field-help">${e(r.serving)} A lista de compras usa o rendimento da receita para calcular os preparos.</span></label></div><p class="replacement-note">Se já houver uma receita neste dia e refeição, ela será substituída pela sua escolha.</p></div><div class="utility-footer"><button class="text-button" type="button" data-action="close-utility">Cancelar</button><button class="button" type="submit">${icon('plus')} Adicionar ao cardápio</button></div></form>`);
}
function openPicker(slot) {
  if (!/^[0-6]:(breakfast|lunch|snack|dinner)$/.test(slot)) return;
  const [dayString, meal] = slot.split(':'), day = Number(dayString), entry = planFor()[slot];
  utilityContext = { type: 'picker', slot, day, meal, selected: entry?.recipeId || '', query: '', showAll: Boolean(entry && !compatible(byId.get(entry.recipeId), meal)) };
  const mealLabel = MEALS.find(m => m.key === meal).name;
  openUtility(`${weekdayNames[day]} · ${mealLabel}`, `Semana de ${weekLabel(week)}. Escolha uma receita para este espaço.`, `<form id="picker-form"><div class="utility-body"><div class="searchbox">${icon('search')}<label class="sr-only" for="picker-search">Buscar receita</label><input type="search" id="picker-search" placeholder="Busque uma receita ou ingrediente" autocomplete="off"></div><div class="picker-top"><label><input type="checkbox" id="picker-all"${utilityContext.showAll ? ' checked' : ''}> Mostrar todas as categorias</label><span id="picker-count" class="sr-status" role="status"></span></div><div class="picker-results" id="picker-results"></div></div><div class="utility-footer"><label class="picker-portions">Porções para servir<input type="number" name="portions" min="1" max="12" step="1" value="${entry?.portions || 1}" required></label><button class="button" type="submit" id="picker-save"${entry ? '' : ' disabled'}>${icon('check')} Salvar escolha</button><p id="picker-selection" style="width:100%" role="status"></p></div></form>`, '', true);
  renderPickerResults();
}
function renderPickerResults() {
  const context = utilityContext; if (context?.type !== 'picker') return;
  const matches = recipes.filter(r => (context.showAll || compatible(r, context.meal)) && searchMatches(r, context.query));
  $('#picker-results').innerHTML = matches.length ? matches.map(r => `<label class="picker-row"><input type="radio" name="recipe" value="${r.id}"${r.id === context.selected ? ' checked' : ''}><img src="${r.thumbnail}" width="600" height="400" alt="" loading="lazy"><span><strong>${e(r.title)}</strong><small>${e(r.category)} · ${e(r.time)} · ${e(r.yield_text)}</small></span></label>`).join('') : '<p class="dialog-note">Nenhuma receita encontrada. Tente outro ingrediente ou mostre todas as categorias.</p>';
  $('#picker-count').textContent = `${matches.length} receitas`;
  updatePickerSelection();
}
function updatePickerSelection() {
  if (utilityContext?.type !== 'picker') return;
  const r = byId.get(utilityContext.selected);
  $('#picker-save').disabled = !r;
  $('#picker-selection').textContent = r ? `Escolhida: ${r.title}. ${r.serving}` : 'Selecione uma receita para continuar.';
}
function openTemplates() {
  utilityContext = { type: 'templates' };
  openUtility('Uma sugestão para começar.', 'Preenche os espaços vazios da semana selecionada. Suas escolhas atuais são mantidas.', `<div class="utility-body"><div class="template-list">${Object.entries(TEMPLATES).map(([key, t]) => `<button class="template-choice" data-action="apply-template" data-value="${key}">${icon(key === 'mealprep' ? 'snow' : key === 'variedade' ? 'leaf' : 'clock')}<span><strong>${e(t.name)}</strong><small>${e(t.subtitle)}</small></span>${icon('arrow')}</button>`).join('')}</div><p class="dialog-note">São combinações de receitas para facilitar a organização. Altere os dias, as quantidades e as refeições conforme sua rotina.</p></div>`);
}
function openDownloads() {
  utilityContext = { type: 'downloads' };
  openUtility('Da tela para a sua cozinha.', `Os ${recipes.length} cards com ingredientes, preparo e conservação, em PDF de alta qualidade.`, `<div class="utility-body"><a class="download-option" href="downloads/cards_receitas_A4_duplex.pdf" download>${icon('print')}<span><strong>Cards em folhas A4</strong><small>${2 * Math.ceil(recipes.length / 2)} páginas · 2 cards por face · frente e verso</small><small>Imprima em 100%, virando pela borda longa.</small></span>${icon('download')}</a><a class="download-option" href="downloads/cards_receitas_A5.pdf" download>${icon('book')}<span><strong>Cards individuais em A5</strong><small>${2 * recipes.length} páginas · frente e verso de cada receita</small><small>A5 paisagem, 100%, virando pela borda curta.</small></span>${icon('download')}</a><p class="dialog-note">Os PDFs preservam textos e elementos vetoriais, com fotos independentes. São arquivos grandes: aguarde o download terminar. Você também pode imprimir uma receita pela janela de detalhes.</p></div>`);
}
function openGuide() {
  utilityContext = { type: 'guide' };
  const topics = [
    ['Porções e rendimento', '<p>A lista de ingredientes de cada card é para o <strong>preparo inteiro</strong>. A caixa “Porção para servir” informa quanto rende para uma refeição. Brownies, muffins, cookies, potinhos e sorvetes podem render várias porções.</p><p>São sugestões culinárias para uma alimentação variada. A quantidade adequada para você depende da sua fome, rotina, atividade e necessidades individuais. O material não fixa uma meta de calorias.</p>'],
    ['Organizar o preparo em lote', '<p>Comece pelos pratos que levam mais tempo, prepare os acompanhamentos enquanto assam e porcione depois do resfriamento rápido. Identifique cada embalagem com receita e data.</p><p>Na lista de compras, “Preparos inteiros” arredonda para a receita completa. “Só as porções planejadas” calcula frações, inclusive de ovos. Confira as sobras e os prazos de cada card. Iogurte complementar de café da manhã é comprado por porção, separado da massa.</p>'],
    ['Geladeira, freezer e reaquecimento', '<p>Mantenha a geladeira a <strong>4 °C ou menos</strong> e o freezer a <strong>−18 °C ou menos</strong>. Refrigere prontamente em recipientes rasos, sem deixar a comida pronta em temperatura ambiente por mais de 2 horas (1 hora em calor acima de 32 °C).</p><p>Descongele na geladeira e siga o prazo do card. Quando o card orientar aquecer, leve a porção a <strong>74 °C no centro</strong>. Para o arroz, resfrie rapidamente, idealmente em até 1 hora; refrigerado, use em até 24 horas e reaqueça uma única vez. Para mais dias, congele no dia do preparo.</p><p>Os prazos de freezer nos cards se referem à qualidade. Componentes frescos, saladas e molhos de iogurte devem ficar separados quando indicado.</p>'],
    ['Ninja Creami: antes de usar', '<p>As três receitas usam como referência a Creami padrão, pote de 473 ml (linha NC300). Em outro modelo, confira o manual, o pote e o programa compatível.</p><ul><li>Bata a base completamente lisa. Não processe gelo puro nem pedaços soltos de fruta congelada.</li><li>Congele no pote original, em pé e nivelado, por pelo menos 24 horas, sem ultrapassar MAX FILL.</li><li>Faça o ciclo indicado no card. Use RE-SPIN apenas depois desse primeiro processamento, se necessário.</li><li>Nas sobras, alise a superfície antes de recongelar. Espere 24 horas e repita o programa inicial; não comece apenas com RE-SPIN.</li><li>Não reduza o açúcar nem troque a base por água ou gelo: isso altera a dureza e a textura.</li></ul>'],
    ['Gelatina com sabor e iogurte', '<p>As receitas usam uma dose de gelatina em pó com sabor para 500 ml de preparo, referenciada como 20 g no card. Há marcas e versões com pesos diferentes: use a dose equivalente indicada no seu rótulo.</p><p>Dissolva na água quente e deixe amornar antes de juntar ao iogurte. Os potinhos das receitas 36 e 37 ficam na geladeira e não são indicados para congelar.</p>'],
    ['Como suas escolhas são guardadas', '<p>Favoritos, cardápios, itens extras e marcações ficam salvos neste navegador. Não é preciso criar conta. As escolhas não são sincronizadas automaticamente entre aparelhos.</p><p>Para levar a seleção a outro aparelho, use “Salvar minhas escolhas” no rodapé. Depois escolha “Restaurar minhas escolhas” no outro navegador. Restaurar substitui a seleção que estiver nele. As receitas e os PDFs continuam públicos no endereço que você publicar.</p>'],
  ];
  openUtility('Uma cozinha bem organizada.', 'Um guia rápido para aproveitar os cards e preparar com antecedência.', `<div class="utility-body">${topics.map(([title, html], i) => `<details class="guide-details"${i === 0 ? ' open' : ''}><summary>${title}</summary><div>${html}</div></details>`).join('')}<details class="guide-details"><summary>Referências de preparo</summary><div><p>Consulte as instruções do seu aparelho e o rótulo dos produtos. Referências:</p><ul><li><a href="https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety" target="_blank" rel="noopener noreferrer">FoodSafety.gov · conservação e preparo</a></li><li><a href="https://www.food.gov.uk/safety-hygiene/home-food-fact-checker" target="_blank" rel="noopener noreferrer">Food Standards Agency · cuidados com arroz</a></li><li><a href="https://support.sharkninja.co.uk/" target="_blank" rel="noopener noreferrer">Ninja · manuais por modelo</a></li></ul></div></details></div>`);
}

function shoppingText() {
  const { items, groups } = shoppingData(), checks = new Set(state.checks[week] || []);
  const lines = [`LISTA DE COMPRAS · ${weekLabel(week)}`, state.shoppingMode === 'batch' ? 'Cálculo: preparos inteiros' : 'Cálculo: porções planejadas', ''];
  for (const group of SHOP_GROUPS) {
    const members = items.filter(item => item.group === group); if (!members.length) continue;
    lines.push(group.toUpperCase());
    for (const item of members) lines.push(`[${checks.has(item.key) ? 'x' : ' '}] ${item.label} — ${formatShoppingQuantity(item)}`);
    lines.push('');
  }
  if (state.extras[week]?.length) {
    lines.push('EXTRAS');
    for (const item of state.extras[week]) lines.push(`[${checks.has(`extra:${item.id}`) ? 'x' : ' '}] ${item.name}${item.quantity ? ` — ${item.quantity}` : ''}`);
    lines.push('');
  }
  lines.push('PREPAROS');
  for (const prep of groups) lines.push(`${number(prep.multiplier)}× ${prep.recipe.title} (${prep.planned} porções planejadas)`);
  lines.push('', 'Pesos conforme os cards; água não incluída. Confira as porções e a conservação de cada receita.');
  return lines.join('\n');
}
async function copyText(text, message) {
  try { if (!navigator.clipboard?.writeText) throw new Error('Clipboard indisponível'); await navigator.clipboard.writeText(text); showToast(message); }
  catch {
    utilityContext = { type: 'copy' };
    openUtility('Copie e leve com você.', 'Selecione o texto abaixo e use a opção Copiar do seu aparelho.', `<div class="utility-body"><label class="sr-only" for="copy-field">Texto para copiar</label><textarea class="copy-field" id="copy-field" readonly>${e(text)}</textarea></div>`);
    $('#copy-field').focus(); $('#copy-field').select();
  }
}
function downloadBackup() {
  const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = `minhas-receitas-${localISO(new Date())}.json`;
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Arquivo de escolhas preparado para download.');
}
async function restoreBackup(file) {
  if (!file) return;
  try {
    if (file.size > 2 * 1024 * 1024) throw new Error('Arquivo muito grande');
    const data = JSON.parse(await file.text());
    if (!data || data.version !== 1 || !Array.isArray(data.favorites) || !data.plans || typeof data.plans !== 'object') throw new Error('Formato incompatível');
    const before = structuredClone(state);
    state = sanitizeState(data, recipes); persist();
    if (utilityDialog.open) closeUtility(); if (recipeDialog.open) closeRecipe(); renderCurrent();
    showToast('Suas escolhas foram restauradas.', 'Desfazer', () => { state = before; persist(); renderCurrent(); showToast('Restauração desfeita.'); });
  } catch { showToast('Não foi possível restaurar. Escolha um arquivo JSON gerado por este site.'); }
  finally { $('#restore-file').value = ''; }
}
function printHeader(label) {
  return `<header class="print-header"><img src="assets/okrardapio-horizontal.webp" width="200" height="33" alt="OKRArdapio"><small>${e(label)}</small></header>`;
}
async function printContent(html) {
  $('#print-root').innerHTML = html;
  if (document.fonts?.ready) await document.fonts.ready;
  await Promise.all($$('img', $('#print-root')).map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  window.print();
}
function printRecipe(id) {
  const r = byId.get(id); if (!r) return;
  return printContent(`${printHeader(`${r.category} · #${r.id}`)}<h1 class="print-title">${e(r.title)}</h1><p class="print-subtitle">${e(r.subtitle)} · ${e(r.time)}</p><img class="print-photo" src="${r.image}" width="1200" height="800" alt="${e(r.title)}"><p><strong>Rendimento:</strong> ${e(r.yield_text)}<br><strong>Porção:</strong> ${e(r.serving)}</p><section class="print-section"><h2>Ingredientes · preparo inteiro</h2><ul class="print-ingredients">${r.ingredients.map(([name, qty]) => `<li><span>${e(name)}</span><strong>${e(qty)}</strong></li>`).join('')}</ul></section><div class="print-clear"></div><section class="print-section"><h2>Modo de preparo</h2>${r.steps.map(([title, text], i) => `<div class="print-step"><h3>${i + 1}. ${e(title)}</h3><p>${e(text)}</p></div>`).join('')}</section><div class="print-grid">${r.methods.map(([title, text]) => `<section class="print-section"><h3>${e(title)}</h3><p>${e(text)}</p></section>`).join('')}</div><p class="print-muted"><strong>Utensílios:</strong> ${e(r.equipment)}</p><div class="print-storage"><p><strong>Geladeira:</strong> ${e(r.storage)}</p><p><strong>Congelamento:</strong> ${e(r.freeze)}</p><p><strong>Para consumir:</strong> ${e(r.thaw)}</p></div><p class="print-muted" style="margin-top:12px"><strong>Dica:</strong> ${e(r.tip)}<br><strong>Alérgenos:</strong> ${e(r.allergens)}<br>Foto ilustrativa gerada por IA. Porções culinárias como referência.</p>`);
}
function printPlan() {
  const plan = planFor();
  return printContent(`${printHeader('Cardápio semanal')}<h1 class="print-title">Meu cardápio</h1><p class="print-subtitle">${e(weekLabel(week))}</p><div class="print-plan-grid">${weekDays(week).map((date, day) => `<section class="print-day"><h2>${weekdayNames[day]} · ${shortDate.format(date)}</h2>${MEALS.map(meal => {
    const entry = plan[`${day}:${meal.key}`], r = entry && byId.get(entry.recipeId);
    return `<p><strong>${meal.name}:</strong> ${r ? `${e(r.title)} — ${entry.portions} ${entry.portions === 1 ? 'porção' : 'porções'}` : '________________________'}</p>`;
  }).join('')}</section>`).join('')}</div><p class="print-muted">Confira o rendimento e as instruções de preparo e conservação de cada receita. As sugestões podem ser ajustadas à sua rotina.</p>`);
}
function printShopping() {
  const { items, groups } = shoppingData(), checks = new Set(state.checks[week] || []);
  return printContent(`${printHeader('Lista de compras')}<h1 class="print-title">Lista de compras</h1><p class="print-subtitle">${e(weekLabel(week))} · ${state.shoppingMode === 'batch' ? 'Preparos inteiros' : 'Porções planejadas'}</p><div class="print-columns">${SHOP_GROUPS.map(group => {
    const members = items.filter(item => item.group === group);
    return members.length ? `<section class="print-section"><h2>${group}</h2><ul class="print-shopping-list">${members.map(item => `<li class="${checks.has(item.key) ? 'checked' : ''}"><span>${e(item.label)}</span><strong>${e(formatShoppingQuantity(item))}</strong></li>`).join('')}</ul></section>` : '';
  }).join('')}${state.extras[week]?.length ? `<section class="print-section"><h2>Extras</h2><ul class="print-shopping-list">${state.extras[week].map(item => `<li class="${checks.has(`extra:${item.id}`) ? 'checked' : ''}"><span>${e(item.name)}</span><strong>${e(item.quantity)}</strong></li>`).join('')}</ul></section>` : ''}</div><section class="print-section"><h2>Preparos da semana</h2><ul class="print-prep">${groups.map(prep => `<li>${number(prep.multiplier)}× ${e(prep.recipe.title)} · ${prep.planned} porções planejadas</li>`).join('')}</ul></section><p class="print-muted">Pesos conforme os cards; água não incluída. Confira sobras, complementos de café da manhã, temperos e conservação de cada receita.</p>`);
}

function changeWeek(days) { week = days === 'today' ? monday() : shiftDays(week, days); renderCurrent(); }
function applySuggestedTemplate(key) {
  if (!TEMPLATES[key]) return;
  const before = Object.keys(planFor()).length, next = applyTemplate(planFor(), key);
  updatePlan(next); if (utilityDialog.open) closeUtility(); renderCurrent();
  showToast(before === 28 ? 'A semana já está preenchida. Edite uma refeição para trocar a receita.' : `${28 - before} refeições adicionadas à semana.`);
}
function removeSlot(slot) {
  const before = structuredClone(planFor()), plan = { ...before }; if (!plan[slot]) return;
  const removed = plan[slot], selectedWeek = week; delete plan[slot]; updatePlan(plan); renderCurrent();
  showToast('Refeição removida do cardápio.', 'Desfazer', () => { updatePlan({ ...planFor(selectedWeek), [slot]: removed }, selectedWeek); renderCurrent(); showToast('Refeição restaurada.'); });
}
function resetFilters() { filters = { sort: 'collection' }; renderCatalog(); $('#recipe-search')?.focus({ preventScroll: true }); }

document.addEventListener('click', async event => {
  if (event.target.closest('.skip-link')) { event.preventDefault(); main.focus({ preventScroll: true }); main.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  const button = event.target.closest('[data-action]'); if (!button || button.disabled) return;
  const action = button.dataset.action;
  try {
    if (action === 'favorite') toggleFavorite(button.dataset.id);
    else if (action === 'category') { filters.category = button.dataset.value; renderCatalogResults(); }
    else if (action === 'ingredient-filter') {
      filters.ingredient = filters.ingredient === button.dataset.value ? '' : button.dataset.value;
      $$('[data-action="ingredient-filter"]').forEach(b => { const active = b.dataset.value === filters.ingredient; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
      renderCatalogResults();
    }
    else if (action === 'reset-filters') resetFilters();
    else if (action === 'search-clear') { filters.search = ''; $('#recipe-search').value = ''; button.hidden = true; renderCatalogResults(); $('#recipe-search').focus(); }
    else if (action === 'explore') { $('#collection').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('#recipe-search').focus({ preventScroll: true }); }
    else if (action === 'close-recipe') closeRecipe();
    else if (action === 'detail-section') $(`#detail-${button.dataset.target}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (action === 'plan-recipe') openPlanRecipe(button.dataset.id);
    else if (action === 'pick-slot') openPicker(button.dataset.slot);
    else if (action === 'remove-slot') removeSlot(button.dataset.slot);
    else if (action === 'week-prev') changeWeek(-7);
    else if (action === 'week-next') changeWeek(7);
    else if (action === 'week-today') changeWeek('today');
    else if (action === 'templates') openTemplates();
    else if (action === 'apply-template') applySuggestedTemplate(button.dataset.value);
    else if (action === 'clear-week') {
      const selectedWeek = week, before = structuredClone(planFor()); updatePlan({}); renderCurrent();
      showToast('Semana limpa. Você pode começar de novo.', 'Desfazer', () => { updatePlan(before, selectedWeek); renderCurrent(); showToast('Cardápio restaurado.'); });
    }
    else if (action === 'shopping-mode') {
      if (state.shoppingMode !== button.dataset.value) {
        state.shoppingMode = button.dataset.value === 'portions' ? 'portions' : 'batch';
        state.checks[week] = (state.checks[week] || []).filter(key => key.startsWith('extra:')); persist(); renderShopping();
      }
    }
    else if (action === 'uncheck-shopping') { state.checks[week] = []; persist(); renderShopping(); }
    else if (action === 'remove-extra') {
      state.extras[week] = (state.extras[week] || []).filter(item => item.id !== button.dataset.id);
      state.checks[week] = (state.checks[week] || []).filter(key => key !== `extra:${button.dataset.id}`); persist(); renderShopping();
    }
    else if (action === 'copy-shopping') await copyText(shoppingText(), 'Lista copiada. Pronta para levar às compras.');
    else if (action === 'share-recipe') {
      const url = new URL(window.location.href); url.hash = `receita/${button.dataset.id}`;
      await copyText(url.href, 'Link da receita copiado.');
    }
    else if (action === 'print-recipe') await printRecipe(button.dataset.id);
    else if (action === 'print-plan') await printPlan();
    else if (action === 'print-shopping') await printShopping();
    else if (action === 'close-utility') closeUtility();
    else if (action === 'downloads') openDownloads();
    else if (action === 'guide') openGuide();
    else if (action === 'backup') downloadBackup();
    else if (action === 'restore') $('#restore-file').click();
    else if (action === 'toast-action') { const callback = undoAction; clearTimeout(toastTimer); $('#toast').classList.remove('visible'); undoAction = null; callback?.(); }
    else if (action === 'reload') window.location.reload();
  } catch (error) { console.error('Não foi possível concluir a ação.', error); showToast('Não foi possível concluir. Tente novamente.'); }
});
document.addEventListener('input', event => {
  if (event.target.id === 'recipe-search') { filters.search = event.target.value; $('.search-clear').hidden = !filters.search; renderCatalogResults(); }
  if (event.target.id === 'picker-search' && utilityContext?.type === 'picker') { utilityContext.query = event.target.value; renderPickerResults(); }
});
document.addEventListener('change', event => {
  const target = event.target;
  if (target.dataset.filter) { filters[target.dataset.filter] = target.value; target.classList.toggle('has-value', Boolean(target.value)); renderCatalogResults(); }
  if (target.id === 'picker-all' && utilityContext?.type === 'picker') { utilityContext.showAll = target.checked; renderPickerResults(); }
  if (target.name === 'recipe' && utilityContext?.type === 'picker') { utilityContext.selected = target.value; updatePickerSelection(); }
  if (target.dataset.shopKey) {
    const checks = new Set(state.checks[week] || []); if (target.checked) checks.add(target.dataset.shopKey); else checks.delete(target.dataset.shopKey);
    state.checks[week] = [...checks]; persist(); target.closest('.shopping-item').classList.toggle('is-checked', target.checked); updateShoppingProgress();
  }
  if (target.id === 'restore-file') restoreBackup(target.files?.[0]);
});
document.addEventListener('submit', event => {
  const form = event.target; if (!['plan-form', 'picker-form', 'extra-form'].includes(form.id)) return;
  event.preventDefault(); if (!form.reportValidity()) return;
  const data = new FormData(form);
  if (form.id === 'extra-form') {
    const name = String(data.get('name') || '').trim(); if (!name) return;
    const extras = state.extras[week] || [];
    if (extras.length >= 100) { showToast('A lista já tem 100 extras. Remova um item antes de adicionar.'); return; }
    const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    state.extras[week] = [...extras, { id, name: name.slice(0, 120), quantity: String(data.get('quantity') || '').trim().slice(0, 60) }];
    persist(); renderShopping(); $('#extra-name').focus({ preventScroll: true }); return;
  }
  const portions = Number(data.get('portions'));
  if (!Number.isInteger(portions) || portions < 1 || portions > 12) return;
  if (form.id === 'plan-form' && utilityContext?.type === 'plan-recipe') {
    const date = parseDate(String(data.get('date'))), meal = String(data.get('meal'));
    if (!date || !MEALS.some(m => m.key === meal)) return;
    week = monday(date); const slot = `${(date.getDay() + 6) % 7}:${meal}`;
    updatePlan({ ...planFor(), [slot]: { recipeId: utilityContext.recipeId, portions } }); closeUtility(); renderCurrent();
    showToast('Receita adicionada ao cardápio.', 'Ver cardápio', () => { if (recipeDialog.open) closeRecipe(); window.location.hash = 'cardapio'; });
  } else if (form.id === 'picker-form' && utilityContext?.type === 'picker' && byId.has(utilityContext.selected)) {
    updatePlan({ ...planFor(), [utilityContext.slot]: { recipeId: utilityContext.selected, portions } }); closeUtility(); renderCurrent(); showToast('Escolha salva no cardápio.');
  }
});
recipeDialog.addEventListener('cancel', event => { event.preventDefault(); closeRecipe(); });
recipeDialog.addEventListener('click', event => { if (event.target === recipeDialog) { const rect = recipeDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeRecipe(); } });
utilityDialog.addEventListener('cancel', event => { event.preventDefault(); closeUtility(); });
utilityDialog.addEventListener('click', event => { if (event.target === utilityDialog) { const rect = utilityDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeUtility(); } });
window.addEventListener('hashchange', () => { if (recipes.length) route(); });
window.addEventListener('storage', event => { if (event.key === STORAGE_KEY && recipes.length) { loadState(); renderCurrent(); favoriteButtons(); } });

async function init() {
  $$('[data-icon]').forEach(span => { span.outerHTML = icon(span.dataset.icon); });
  const response = await fetch('data/recipes.json');
  if (!response.ok) throw new Error('Falha ao carregar as receitas');
  recipes = await response.json();
  if (!Array.isArray(recipes) || !recipes.length || new Set(recipes.map(r => r.id)).size !== recipes.length || recipes.some(r => !r.title || !r.ingredients?.length || !r.steps?.length)) throw new Error('Catálogo incompleto');
  byId = new Map(recipes.map(r => [r.id, r])); loadState(); route();
}
const ready = init().catch(error => {
  console.error('Não foi possível abrir o catálogo.', error);
  main.innerHTML = `<div class="container">${empty('info', 'As receitas ainda não carregaram.', 'Confira a conexão e tente novamente. Os cards em PDF também ficam disponíveis para download.', '<button class="button" data-action="reload">Tentar novamente</button><a class="button button-outline" href="downloads/cards_receitas_A4_duplex.pdf" download>Baixar PDF</a>')}</div>`;
});
