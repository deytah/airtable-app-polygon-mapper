# Map Viewer for Airtable

Map Viewer uses Mapbox to render GeoJSON stored in Airtable. As an Airtable Editor or higher, you can also draw new polygons and edit existing ones.

## Requirements

To **use** this app, you will need:
- an Airtable Pro account
- a Mapbox account

To **run** this app, you will need:
- an Airtable base
- a Mapbox Access Token
- a field in your base with GeoJSON **geometry**, named the exact same across all relevant Tables

## Installation

To remix this app as a Custom App:
1. Create a new base or use an existing one.
2. Create a new app in your base, selecting "Remix from GitHub" as your template.
3. In "GitHub Repository" paste: `https://github.com/deytah/airtable-app-mapbox`
4. Follow the steps in [Airtable's "Remix from GitHub" guide](https://airtable.com/developers/apps/guides/remix-from-github).

_Note: Custom Apps are only available to Base Collaborators. "Share via Base Link" viewers will not be able to use the app._

### Local Development

Use `block run` to start the app.

Use `block release` to publish the app to Airtable's servers so that all collaborators in the base can use it.

If you want to run the app in more than one base, you will need remotes to run and release your app. Follow the steps in [Airtable's "Run and release an app in multiple bases" guide](https://airtable.com/developers/apps/guides/run-in-multiple-bases).

## Getting Started

### Configure App Settings

Once the app is installed, you will be prompted to configure its settings.

If you do not have a Mapbox account yet, you can sign up at [https://account.mapbox.com/auth/signup/](https://account.mapbox.com/auth/signup/). You will need a Public Access Token. You can learn more about Access Tokens at [https://docs.mapbox.com/help/how-mapbox-works/access-tokens/](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/)

Settings:
- **Mapbox Public Access Token**: The app cannot render a map canvas until your token is saved.
- **Geometry field**: This is a shared named field across all tables. It should contain the "geometry" part of a GeoJSON feature.
  - Currently supports Polygon and MultiPolygon geometry types.
  - We recommend using the "Long Text" field type, which supports up to 100,000 characters.
- **Label field (optional)**: This is a shared field across all tables. Defaults to your table's primary field, if empty.
- **Use background images (optional)**: Toggle the setting to configure raster sources for your map composed of images. Each image is paired with GeoJSON geometry to place it on the map. You can use background images as references when drawing new features.
  - **Table**: The table containing your collection of images.
  - **Image Field**: The field in your selected table containing the background images.
  - **Geometry Field**: The field in your selected table containing the background images' geometry. The image will be contained inside the coordinates provided.

### Format your Geometry

The app uses the user's Active View to build a `FeatureCollection`, complete with properties (parsed from the record ID and primary field). For it to join your data together properly, **your geometry needs to only include geometry**.

Here is an example of valid geometry for a Polygon:
```
{
  "type": "Polygon",
  "coordinates": [
    [
      [-138, 60],
      [-110, 60],
      [-110, 40],
      [-138, 40],
      [-138, 60]
    ]
  ]
}
```

If your polygon is showing up on a wrong part of the map, double check that your geometry coordinates are in the correct order: `[longitude, latitude]`.

If you are exporting GeoJSON from Thanados:
- You can use [Thanados GeoJSON to CSV Converter](https://thanados-geojson-to-csv.netlify.app/) to download a CSV and use with the "CSV importer" Airtable app.
- The Converter will extract the required geometry in the format needed for this app.

### Wiki

Additional documentation and tutorials are available in the [project wiki](https://github.com/deytah/airtable-app-mapbox/wiki).

## How It Works

In View Mode:
- The Map uses the active Table as the data source for the Map.
- The Map loads all records in the active View that have GeoJSON data.
- If applicable, the Map will cluster your shapes at zoomed out levels.
- A View can be Filtered to add/remove records from the Map.
- A View can use Conditions to define colors for shapes on the Map. (Editors and up)
- A Record can be selected and highlighted on the Map by clicking its shape.
- A Record or Records can be selected from the Table and highlighted on the Map.
- The Map will Zoom in/out, if applicable, to the active selection.
- Selected Record(s) are displayed in a Record List under the Map.
- A Record in the Record List can be expanded to view all its details.
- The visible Map Canvas can be downloaded as a PDF with its required Mapbox attribution text. Optionally or if applicable, add a second attribution line for your dataset.
- If a geo-referenced Image is available, it can be shown as a background overlay. Background image configuration can be defined in Global Settings.
- If background images are toggled on, the image will be included in the downloaded PDF.

In Draw Mode:
- A user can use the Draw tool to create a shape and save the coordinates to the Selected Record.
- The Draw tool can be used to edit a shape and save new coordinates to the Selected Record.
- Users can use a background overlay as a reference for creating shapes.

Visit the [project wiki](https://github.com/deytah/airtable-app-mapbox/wiki) for examples and guidance.

## Limitations and Restrictions

The options/features you have access to are dependent on your Collaborator type's permissions.

| Collaborator Type | Mode: View | Filtering | Conditions | Mode: Draw | App Settings |
|-------------------|:----------:|:---------:|:----------:|:----------:|:------------:|
| Owner             | ✅         | ✅        | ✅        | ✅         | ✅           |
| Creator           | ✅         | ✅        | ✅        | ✅         | ✅           |
| Editor            | ✅         | ✅        | ✅        | ✅         | ✅           |
| Commenter         | ✅         | ✅        | ✅        | ✅         | ✅           |
| Read only         | ✅         | 🚫        | 🚫        | 🚫         | 🚫           |

Read only collaborators can use existing Views (to filter the map, if applicable to the View) and Conditions (for fill colors) set by a paid Airtable user.

You must include Mapbox's Attribution on exports. By default, the app includes the required attribution line. Data sources you provide may also require attribution, which can be cited with the "Attribution Text" option. Learn more about Mapbox Attribution requirements at [https://docs.mapbox.com/help/how-mapbox-works/attribution/](https://docs.mapbox.com/help/how-mapbox-works/attribution/)

## Acknowledgements

Initial development of this app was funded by the Institute for Advanced Study, Princeton.

## License and Usage

You must abide by the Airtable Developer Agreement and Mapbox Terms of Service.

### Airtable Developer Agreement ([@airtable/blocks](https://github.com/Airtable/blocks))

With the Blocks SDK, you can create your own custom apps on top of Airtable. These apps can be integrations, visualizations, internal tools, and more!

To get started, check out the [official Blocks SDK documentation website](https://airtable.com/developers/blocks). If you have any questions, feedback, or feature requests, we encourage you to post in the [community forum](https://community.airtable.com/c/developers/custom-blocks-beta/54).

By using the software, you accept and agree to abide by terms of the developer agreement below:

1. Airtable hereby grants you a limited, non-transferable, non-sublicensable license to access and use the Airtable beta software and related software development kit (collectively, the “Software”) for the duration of the Beta Program.
2. If you submit suggestions or recommended changes to the Software, Airtable is free to use such feedback for any purpose.
3. Airtable makes no warranty of any kind that the software will meet your requirements, operate without interruption, or be secure, accurate, complete, or error free.
These terms supplement your other agreements with Airtable, which may include the Airtable Terms of Service (located at [airtable.com/tos](https://airtable.com/tos)), the Airtable Privacy Policy (located at [airtable.com/privacy](https://airtable.com/privacy)), and the Airtable Developer Policy (located at [airtable.com/developer-policy](https://airtable.com/developer-policy)).

By using the Software, you accept and agree to abide by these terms.

### Mapbox Web SDK ([mapbox/mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js#license))

Mapbox gl-js version 2.0 or higher (“Mapbox Web SDK”) must be used according to the Mapbox Terms of Service. This license allows developers with a current active Mapbox account to use and modify the Mapbox Web SDK. Developers may modify the Mapbox Web SDK code so long as the modifications do not change or interfere with marked portions of the code related to billing, accounting, and anonymized data collection. The Mapbox Web SDK only sends anonymized usage data, which Mapbox uses for fixing bugs and errors, accounting, and generating aggregated anonymized statistics. This license terminates automatically if a user no longer has an active Mapbox account.

For the full license terms, please see the [Mapbox Terms of Service](https://www.mapbox.com/legal/tos/).
