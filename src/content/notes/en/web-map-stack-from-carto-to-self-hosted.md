---
lang: 'en'
translationKey: 'web-map-stack-from-carto-to-self-hosted'
visibility: 'public'
title: 'Understanding a web map stack'
description: 'Following OpenStreetMap data from import to XYZ tiles and browser rendering.'
category: 'Data Systems'
order: 4
pubDate: '2026-09-06'
---

## Starting with a self-hosting question

Replacing a third-party basemap means understanding more than a Leaflet call. The useful question is how geographic source data becomes the interactive map in the browser.

## Source data and spatial storage

OpenStreetMap describes geographic objects such as roads, buildings, and boundaries using nodes, ways, relations, and tags. An .osm.pbf snapshot is a compressed source format, not a map image.

For a raster rendering stack, imported features can live in PostgreSQL / PostGIS. Spatial queries retrieve the features intersecting a tile extent. Basemap features and application-specific locations remain different data layers.

## From a viewport to tiles

Leaflet combines map center, viewport, zoom, and projection to identify visible XYZ tiles. For zoom z, each axis has 2^z tiles. Longitude maps linearly to the X tile, while latitude uses the nonlinear Web Mercator projection.

```text
Viewport + zoom
  → Web Mercator coordinates
  → visible XYZ tile coordinates
  → HTTP requests for individual tiles
  → Leaflet positions the returned images
```

The browser requests multiple tiles rather than one complete map. Panning reuses still-visible tiles and fetches newly exposed ones.

## Rendering and caching

The tile server may return an existing cached tile. On a miss, a dynamic stack can query PostGIS, apply a map style, render a PNG, and cache it. Other stacks serve pre-generated tiles from archives such as MBTiles or PMTiles.

| Layer                 | Responsibility                         |
| --------------------- | -------------------------------------- |
| .osm.pbf              | Geographic source and transport        |
| PostGIS               | Spatial storage and queries            |
| Renderer and style    | Geographic features to map images      |
| Tile cache or archive | Reuse prepared tiles                   |
| Leaflet               | Arrange tiles and application overlays |

## Related services have different jobs

Nominatim supports geocoding; OSRM supports routing. Neither is the basemap tile service. Markers, route polylines, and geofences can be separate Leaflet overlays, so changing the basemap provider need not rewrite those application layers.

## What self-hosting changes

The frontend can continue making XYZ HTTP requests. The responsibility for answering them moves from a provider such as CARTO to infrastructure you operate.

That separation provides a debugging model: inspect tile URLs and serving layers for a missing basemap, geocoding for address search, and the routing engine for route behavior.
