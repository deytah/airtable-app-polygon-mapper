# Map Viewer for Airtable

Map Viewer uses Mapbox to render GeoJSON stored in Airtable as shapes.

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
3. Follow the steps in [Airtable's "Remix from GitHub" guide](https://airtable.com/developers/apps/guides/remix-from-github).
4. From the root of your new block, run `block run`.
5. Run `block release` to publish the app to Airtable's servers so that all collaborators can use it.

_Note: Custom Apps are only available to Base Collaborators. "Share via Base Link" viewers will not be able to use the app._

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
- The visible Map Canvas can be downloaded as a PDF with its required Mapbox attribution text. Optionally, add a second attribution line for your dataset.

## Limitations and Restrictions

The options/features you have access to are dependent on your Collaborator type's permissions.

| Collaborator Type | Mode: View | Filtering | Conditions | Mode: Draw | App Settings |
|-------------------|:----------:|:---------:|:----------:|:----------:|:------------:|
| Owner             | ✅         | ✅        | ✅         | ✅          | ✅           |
| Creator           | ✅         | ✅        | ✅         | ✅          | ✅           |
| Editor            | ✅         | ✅        | ✅         | ✅          | ✅           |
| Commenter         | ✅         | ✅        | ✅         | ✅          | ✅           |
| Read only         | ✅         | 🚫        | 🚫         | 🚫          | 🚫           |

Read only collaborators can use existing Views (to filter the map, if applicable to the View) and Conditions (for fill colors) set by a paid Airtable user.

## Roadmap

- [ ] Draw Mode: Create and save new geometry for records
- [ ] Layer: Background overlay(s) using a linked record parent
- [ ] Toggle: Labels

## Acknowledgements

Initial development of this app was funded by the Institute for Advanced Study, Princeton.
