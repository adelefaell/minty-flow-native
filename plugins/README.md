# WatermelonDB JSI Expo Plugin

This custom Expo config plugin automatically configures WatermelonDB JSI for Android, so you don't have to manually set it up every time you delete and rebuild the `android` folder.

## What it does

The plugin automatically:

1. **Adds watermelondb-jsi module** to `android/settings.gradle`
2. **Adds dependency and packaging options** to `android/app/build.gradle`
   - Adds `implementation project(':watermelondb-jsi')` dependency
   - Adds `pickFirst '**/libc++_shared.so'` to packaging options
3. **Adds WatermelonDBJSIPackage** to `MainApplication.kt`
   - Adds the import statement
   - Adds the package to `getPackages()` method
4. **Adds ProGuard rules** to `android/app/proguard-rules.pro`

## Usage

The plugin is already configured in `app.json`:

```json
{
  "expo": {
    "plugins": [
      "./plugins/withWatermelonDBJSI"
    ]
  }
}
```

## How it works

When you run `expo prebuild`, this plugin will automatically apply all the necessary configurations to enable WatermelonDB JSI support.

## Testing

To test the plugin:

1. Delete the `android` folder (if it exists)
2. Run `expo prebuild` or `pnpm prebuild`
3. The plugin will automatically configure everything
4. Build and run: `pnpm android`

The JSI SQLiteAdapter should now be available without any manual configuration!
