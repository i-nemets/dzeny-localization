# Dzeny Localization

A lightweight internationalization (i18n) project for managing translations and localization files.

## Overview

This project provides a structured approach to managing multilingual content for web applications. It organizes translation files by language and feature, making it easy to maintain and scale internationalization efforts.

## Project Structure

```
dzeny-localization/
├── public/
│   ├── i18n/
│   │   ├── en/          # English translations
│   │   │   └── home.json
│   │   └── ru/          # Russian translations
│   │       └── home.json
│   └── index.ts         # Main entry point
└── README.md
```

## Features

- **Multi-language Support**: Currently supports English (en) and Russian (ru)
- **Modular Organization**: Translations are organized by feature/screen (e.g., home, settings, etc.)
- **JSON Format**: Clean and readable JSON structure for translation keys
- **Scalable Architecture**: Easy to add new languages and translation files

## Translation Files

### English (en/home.json)
```json
{
  "title": "Home",
  "description": "Home screen"
}
```

### Russian (ru/home.json)
```json
{
  "title": "Главная",
  "description": "Главная экран"
}
```

## Usage

1. **Adding New Languages**: Create a new directory under `public/i18n/` with the language code (e.g., `fr/` for French)
2. **Adding New Features**: Create new JSON files for different screens or features
3. **Translation Keys**: Use descriptive keys that clearly indicate the content purpose
4. **Consistency**: Maintain the same key structure across all language files

## Best Practices

- Keep translation keys descriptive and consistent
- Use nested objects for related translations
- Maintain alphabetical order within JSON files
- Include comments for context when necessary
- Test translations with native speakers when possible

## Contributing

When adding new translations:
1. Create the corresponding file in all supported language directories
2. Ensure all keys are present in all language files
3. Maintain consistent formatting and structure
4. Update this README if adding new languages or features

## License

[Add your license information here]
