# Minecraft Hub

Мини-сайт для модов, скинов и сборок по Minecraft. Хостится на GitHub Pages.

## Как размещать

1. Создай репозиторий на GitHub
2. Загрузи все файлы из папки `minecraft-site`
3. Включи GitHub Pages (Settings → Pages → Source: main branch)
4. Сайт доступен по `https://username.github.io/repo-name/`

## Как добавлять контент

Редактируй JSON-файлы в папке `data/` прямо через GitHub (нажми pencil icon).

### Моды — `data/mods.json`

```json
{
  "mods": [
    {
      "id": "optifine",
      "name": "OptiFine",
      "version": "HD U I7",
      "minecraft_version": "1.20.1",
      "description": "Улучшает графику и производительность.",
      "author": "sp614x",
      "download_url": "https://optifine.net",
      "images": [
        "https://example.com/screenshot1.png"
      ],
      "tags": ["performance", "graphics"]
    }
  ]
}
```

### Скины — `data/skins.json`

```json
{
  "skins": [
    {
      "id": "my-skin",
      "name": "Cool Skin",
      "username": "Notch",
      "description": "Крутой скин.",
      "author": "Artist",
      "uuid": "069a79f4-44e9-4726-a5be-fca90e38aaf5",
      "images": []
    }
  ]
}
```

Для предпросмотра скина нужен `uuid` игрока. UUID можно найти на [minetools.eu](https://minetools.eu/uuid/) по нику.

### Сборки — `data/builds.json`

```json
{
  "builds": [
    {
      "id": "my-build",
      "name": "Performance Pack",
      "description": "Сборка для увеличения FPS.",
      "author": "Builder",
      "download_url": "https://example.com/download",
      "images": [
        "https://example.com/screenshot1.png"
      ],
      "mods_count": 15,
      "tags": ["performance"]
    }
  ]
}
```

## Поля

| Поле | Описание |
|------|----------|
| `id` | Уникальный идентификатор (латиница, дефисы) |
| `name` | Название |
| `description` | Описание |
| `author` | Автор |
| `images` | Массив URL картинок (первая — превью) |
| `tags` | Массив тегов для фильтрации |

Дополнительно для модов: `version`, `minecraft_version`, `download_url`
Дополнительно для скинов: `username`, `uuid`
Дополнительно для сборок: `mods_count`, `download_url`

## Локальный запуск

```bash
cd minecraft-site
python -m http.server 8000
```

Открой `http://localhost:8000`
