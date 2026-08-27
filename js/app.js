const EMBEDDED_DATA = {
  mods: [
    {
      "id": "optifine",
      "name": "OptiFine",
      "version": "HD U I6",
      "minecraft_version": "1.20.1",
      "description": "Улучшает графику и производительность. Поддержка шейдеров, HD текстур и оптимизация FPS.",
      "author": "sp614x",
      "download_url": "downloads/OptiFine_1.20.1_HD_U_I6.jar",
      "images": ["https://i.imgur.com/8QFmwHh.png"],
      "videos": [],
      "tags": ["performance", "graphics"]
    },
    {
      "id": "sodium",
      "name": "Sodium",
      "version": "0.5.13",
      "minecraft_version": "1.20.1",
      "description": "Мод для значительного увеличения FPS. Работает через Fabric Loader.",
      "author": "CaffeineMC",
      "download_url": "downloads/sodium-fabric-0.5.13+mc1.20.1.jar",
      "images": ["https://i.imgur.com/uKqKPOD.png"],
      "videos": [],
      "tags": ["performance", "client-side"]
    }
  ],
  skins: [
    {
      "id": "notch-skin",
      "name": "Notch",
      "username": "Notch",
      "description": "Классический скин создателя Minecraft.",
      "author": "Mojang",
      "uuid": "069a79f4-44e9-4726-a5be-fca90e38aaf5",
      "images": []
    },
    {
      "id": "jeb-skin",
      "name": "Jeb_",
      "username": "jeb_",
      "description": "Скин главного разработчика Minecraft с радужной бородой.",
      "author": "Mojang",
      "uuid": "853c80ef-3c37-49fd-aa49-938b674adae6",
      "images": []
    }
  ],
  builds: [
    {
      "id": "eden-ring-reforked",
      "name": "Eden Ring Reforked",
      "description": "Порт оригинального мода на новые версии игры. ERR добавит в игру научно-фантастическое измерение, представляющее собой кольцо островов вокруг газового гиганта. Вас ждёт двенадцать новых биомов, особые механики и бескрайние просторы парящих островов, озарённых светом голубой звезды.\n\nЧтобы попасть в измерение, необходимо построить портал и активировать его центральный золотой блок с помощью огнива.",
      "author": "ErzeKawek",
      "download_url": "downloads/eden-ring-20.1.21-build.1.zip",
      "images": [
        "https://minecraft-inside.ru/uploads/files/2024-02/thumb/eden-ring-img001.png",
        "https://minecraft-inside.ru/uploads/files/2026-08/thumb/81f97ca48efaa4822f172d71950499668a4814c3.png",
        "https://minecraft-inside.ru/uploads/files/2026-08/eden-ring.png"
      ],
      "videos": [
        "https://www.youtube.com/watch?v=2JCXlpxeK3I"
      ],
      "mods_count": 2,
      "tags": ["space", "measurement"]
    }
  ]
};

const DATA_BASE = 'data';
let allData = { mods: [], skins: [], builds: [] };
let currentPage = 'home';
let previousPage = 'home';

function getSkinHeadUrl(uuid) {
  return 'https://crafatar.com/heads/' + uuid + '?overlay&size=128';
}
function getSkinBodyUrl(uuid) {
  return 'https://crafatar.com/render/body/' + uuid + '?overlay&size=256';
}

function getYouTubeId(url) {
  var m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?#]+)/);
  return m ? m[1] : null;
}

function youtubeEmbed(url) {
  var id = getYouTubeId(url);
  return id ? 'https://www.youtube.com/embed/' + id : null;
}

async function loadData() {
  try {
    const [modsRes, skinsRes, buildsRes] = await Promise.all([
      fetch(DATA_BASE + '/mods.json'),
      fetch(DATA_BASE + '/skins.json'),
      fetch(DATA_BASE + '/builds.json')
    ]);
    if (!modsRes.ok || !skinsRes.ok || !buildsRes.ok) throw new Error('fetch failed');
    const modsJson = await modsRes.json();
    const skinsJson = await skinsRes.json();
    const buildsJson = await buildsRes.json();
    allData.mods = modsJson.mods || [];
    allData.skins = skinsJson.skins || [];
    allData.builds = buildsJson.builds || [];
  } catch (e) {
    console.log('Using embedded data (file:// mode)');
    allData = {
      mods: EMBEDDED_DATA.mods.slice(),
      skins: EMBEDDED_DATA.skins.slice(),
      builds: EMBEDDED_DATA.builds.slice()
    };
  }
  updateCounts();
  populateFilters();
  renderAll();
}

function updateCounts() {
  document.getElementById('mods-count').textContent = allData.mods.length + ' модов';
  document.getElementById('skins-count').textContent = allData.skins.length + ' скинов';
  document.getElementById('builds-count').textContent = allData.builds.length + ' сборок';
}

function populateFilters() {
  var modsTags = new Set();
  var buildsTags = new Set();
  allData.mods.forEach(function(m) { (m.tags || []).forEach(function(t) { modsTags.add(t); }); });
  allData.builds.forEach(function(b) { (b.tags || []).forEach(function(t) { buildsTags.add(t); }); });
  populateSelect('mods-filter', modsTags);
  populateSelect('builds-filter', buildsTags);
}

function populateSelect(id, tagsSet) {
  var sel = document.getElementById(id);
  sel.innerHTML = '<option value="all">Все теги</option>';
  Array.from(tagsSet).sort().forEach(function(tag) {
    var opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    sel.appendChild(opt);
  });
}

function showPage(page) {
  previousPage = currentPage;
  currentPage = page;
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(function(l) {
    l.classList.toggle('active', l.dataset.page === page);
  });
  window.scrollTo(0, 0);
  document.querySelector('.header__nav').classList.remove('open');
}

function goBack() { showPage(previousPage || 'home'); }
function toggleMenu() { document.querySelector('.header__nav').classList.toggle('open'); }

function renderAll() { renderMods(); renderSkins(); renderBuilds(); }

function renderMods() {
  var c = document.getElementById('mods-list');
  if (!allData.mods.length) { c.innerHTML = emptyState('Нет модов', 'Добавь моды в data/mods.json'); return; }
  c.innerHTML = allData.mods.map(modCard).join('');
}
function renderSkins() {
  var c = document.getElementById('skins-list');
  if (!allData.skins.length) { c.innerHTML = emptyState('Нет скинов', 'Добавь скины в data/skins.json'); return; }
  c.innerHTML = allData.skins.map(skinCard).join('');
}
function renderBuilds() {
  var c = document.getElementById('builds-list');
  if (!allData.builds.length) { c.innerHTML = emptyState('Нет сборок', 'Добавь сборки в data/builds.json'); return; }
  c.innerHTML = allData.builds.map(buildCard).join('');
}

function emptyState(title, desc) {
  return '<div class="empty-state"><div class="empty-state__icon">&#9888;</div><h3>' + title + '</h3><p>' + desc + '</p></div>';
}

function modCard(mod) {
  var img = (mod.images && mod.images[0]) || '';
  var preview = img
    ? '<img src="' + esc(img) + '" alt="' + esc(mod.name) + '" loading="lazy">'
    : '<div style="font-size:3rem">&#128230;</div>';
  var tags = (mod.tags || []).map(function(t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
  return '<div class="item-card" onclick="openDetail(\'mods\',\'' + esc(mod.id) + '\')">'
    + '<div class="item-card__preview">' + preview + '</div>'
    + '<div class="item-card__body">'
    + '<div class="item-card__name">' + esc(mod.name) + '</div>'
    + '<div class="item-card__meta">v' + esc(mod.version) + ' &middot; MC ' + esc(mod.minecraft_version) + ' &middot; ' + esc(mod.author) + '</div>'
    + '<div class="item-card__desc">' + esc(mod.description) + '</div>'
    + (tags ? '<div class="item-card__tags">' + tags + '</div>' : '')
    + '</div></div>';
}

function skinCard(skin) {
  var uuid = skin.uuid || '';
  var previewUrl = uuid ? getSkinBodyUrl(uuid) : '';
  var preview = previewUrl
    ? '<img class="skin-preview" src="' + esc(previewUrl) + '" alt="' + esc(skin.name) + '" loading="lazy">'
    : '<div style="font-size:3rem">&#128100;</div>';
  return '<div class="item-card" onclick="openDetail(\'skins\',\'' + esc(skin.id) + '\')">'
    + '<div class="item-card__preview">' + preview + '</div>'
    + '<div class="item-card__body">'
    + '<div class="item-card__name">' + esc(skin.name) + '</div>'
    + '<div class="item-card__meta">' + esc(skin.username) + ' &middot; ' + esc(skin.author) + '</div>'
    + '<div class="item-card__desc">' + esc(skin.description) + '</div>'
    + '</div></div>';
}

function buildCard(build) {
  var img = (build.images && build.images[0]) || '';
  var preview = img
    ? '<img src="' + esc(img) + '" alt="' + esc(build.name) + '" loading="lazy">'
    : '<div style="font-size:3rem">&#127960;</div>';
  var tags = (build.tags || []).map(function(t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
  return '<div class="item-card" onclick="openDetail(\'builds\',\'' + esc(build.id) + '\')">'
    + '<div class="item-card__preview">' + preview + '</div>'
    + '<div class="item-card__body">'
    + '<div class="item-card__name">' + esc(build.name) + '</div>'
    + '<div class="item-card__meta">' + (build.mods_count || 0) + ' модов &middot; ' + esc(build.author) + '</div>'
    + '<div class="item-card__desc">' + esc(build.description) + '</div>'
    + (tags ? '<div class="item-card__tags">' + tags + '</div>' : '')
    + '</div></div>';
}

function openDetail(category, id) {
  var item = allData[category].find(function(i) { return i.id === id; });
  if (!item) return;
  var container = document.getElementById('detail-content');
  var html = '';

  if (category === 'skins') {
    var uuid = item.uuid || '';
    var headUrl = uuid ? getSkinHeadUrl(uuid) : '';
    var bodyUrl = uuid ? getSkinBodyUrl(uuid) : '';
    html = '<div class="detail-header">'
      + '<div class="detail-header__image">'
      + (bodyUrl ? '<img class="skin-preview-large" src="' + esc(bodyUrl) + '" alt="' + esc(item.name) + '">' : '<div style="font-size:5rem">&#128100;</div>')
      + '</div>'
      + '<div class="detail-header__info">'
      + '<h1>' + esc(item.name) + '</h1>'
      + '<div class="detail-meta">'
      + '<strong>Ник:</strong> ' + esc(item.username) + '<br>'
      + '<strong>Автор:</strong> ' + esc(item.author) + '<br>'
      + (uuid ? '<strong>UUID:</strong> <code>' + esc(uuid) + '</code>' : '')
      + '</div>'
      + '<div class="detail-desc">' + esc(item.description) + '</div>'
      + (headUrl ? '<div style="margin-top:1rem"><strong>Голова:</strong><br><img src="' + esc(headUrl) + '" style="image-rendering:pixelated;margin-top:0.5rem" width="64" height="64"></div>' : '')
      + '</div></div>';
  } else {
    var img = (item.images && item.images[0]) || '';
    var isMod = category === 'mods';
    html = '<div class="detail-header">'
      + '<div class="detail-header__image">'
      + (img ? '<img src="' + esc(img) + '" alt="' + esc(item.name) + '">' : '<div style="font-size:5rem">' + (isMod ? '&#128230;' : '&#127960;') + '</div>')
      + '</div>'
      + '<div class="detail-header__info">'
      + '<h1>' + esc(item.name) + '</h1>'
      + '<div class="detail-meta">'
      + (isMod ? '<strong>Версия:</strong> ' + esc(item.version) + '<br><strong>Minecraft:</strong> ' + esc(item.minecraft_version) + '<br>' : '')
      + (!isMod && item.mods_count ? '<strong>Модов:</strong> ' + item.mods_count + '<br>' : '')
      + '<strong>Автор:</strong> ' + esc(item.author)
      + '</div>'
      + '<div class="detail-desc">' + esc(item.description) + '</div>'
      + (item.download_url ? '<a class="detail-download" href="' + esc(item.download_url) + '" target="_blank" rel="noopener">Скачать</a>' : '')
      + ((item.tags || []).length ? '<div class="detail-tags">' + item.tags.map(function(t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' : '')
      + '</div></div>';
  }

  var images = (item.images || []).slice(1);
  if (images.length) {
    html += '<div class="gallery"><h2>Галерея</h2><div class="gallery__grid">'
      + images.map(function(url) {
        return '<div class="gallery__item" onclick="openModal(\'' + esc(url) + '\')">'
          + '<img src="' + esc(url) + '" alt="Gallery" loading="lazy"></div>';
      }).join('')
      + '</div></div>';
  }

  var videos = item.videos || [];
  if (videos.length) {
    html += '<div class="gallery"><h2>Видео</h2><div class="gallery__grid">';
    videos.forEach(function(url) {
      var embed = youtubeEmbed(url);
      if (embed) {
        html += '<div class="gallery__item" style="cursor:default">'
          + '<iframe width="100%" height="200" src="' + esc(embed) + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:8px"></iframe>'
          + '</div>';
      }
    });
    html += '</div></div>';
  }

  container.innerHTML = html;
  showPage('detail');
}

function filterItems(category) {
  var search = (document.getElementById(category + '-search') || {}).value || '';
  search = search.toLowerCase();
  var tagFilter = (document.getElementById(category + '-filter') || {}).value || 'all';
  var container = document.getElementById(category + '-list');

  var filtered = allData[category].filter(function(item) {
    var matchesSearch = !search
      || item.name.toLowerCase().indexOf(search) !== -1
      || item.description.toLowerCase().indexOf(search) !== -1
      || (item.author || '').toLowerCase().indexOf(search) !== -1;
    var matchesTag = tagFilter === 'all' || (item.tags || []).indexOf(tagFilter) !== -1;
    return matchesSearch && matchesTag;
  });

  if (!filtered.length) {
    container.innerHTML = emptyState('Ничего не найдено', 'Попробуй изменить фильтры');
    return;
  }
  var renderer = { mods: modCard, skins: skinCard, builds: buildCard };
  container.innerHTML = filtered.map(renderer[category]).join('');
}

function openModal(url) {
  document.getElementById('modal-img').src = url;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal__close')) return;
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

function esc(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', loadData);
