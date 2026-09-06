---
title: "從 OSM 到 Browser：我如何理解 Web Mapping Stack"
description: "從一次 CARTO self-hosting 需求出發，追完整條 OSM → PostGIS → Tile Server → XYZ Tiles → HTTP → Leaflet 的 Web Map data flow。"
category: "GIS / Web Map"
visual: "map"
pubDate: 2026-09-06
tags: ["GIS", "OpenStreetMap", "Leaflet", "PostGIS", "Docker", "Web Map"]
slug: "web-map-stack-from-carto-to-self-hosted"
order: 4
draft: false
---

最近在 HINO 車聯網專案中，我遇到一個原本看起來很單純的需求：

> Map service needs to be self-hosted.

專案原本使用 Leaflet 顯示地圖，底圖來自 CARTO。最開始我對它的理解其實停在：

```text
Leaflet → CARTO → 地圖出現
```

但當「把地圖服務自己架起來」變成需求後，這條線顯然不夠用了。我開始追問：OSM、PostGIS、Tile Server、Leaflet、Nominatim 與 OSRM 的責任為什麼不同？Docker container 跑起來後，為什麼還不代表整個 map stack 已經可用？

最後我發現，真正值得理解的不是名詞定義，而是這個問題：

> **How does OSM data eventually become the interactive map I see in the browser?**

這篇記錄我如何從一次實際的 self-hosting 需求，慢慢把一張 Web Map 的完整生命週期追出來。

## From OSM Data to a Map in the Browser

真正去追整個流程後，我才理解：**瀏覽器其實從來沒有「下載一張完整地圖」。** 它下載的是很多個小 tile。在我們採用的 raster tile stack 中，OSM data 會先經過 import 與 preprocessing；需要動態 rendering 時，Tile Server 可以查詢 spatial database、套用 style 並產生 tile，而已快取或預先產生的 tile 則可以直接回傳。

我現在會把整條 pipeline 拆成兩個階段：

```text
① Data Preparation

OpenStreetMap → .osm.pbf → Import → PostGIS → Geographic Data


② Runtime Map Request

User opens / moves map
        ↓
     Leaflet
        ↓
Viewport + Zoom
        ↓
Web Mercator
        ↓
Calculate XYZ Tiles
        ↓
HTTP GET /{z}/{x}/{y}.png
        ↓
    Tile Server
        ↓
Query geographic data + apply map style
        ↓
Render Raster Tile
        ↓
HTTP Response: PNG
        ↓
Leaflet arranges returned tiles
        ↓
Interactive Map
```

理解這兩個階段後，我才真正知道 CARTO 原本位於整個 architecture 的哪一層。

## Step 1 — OSM Is the Geographic Source

OpenStreetMap 儲存的不是一張「地圖圖片」，而是 geographic features：

```text
road
building
river
school
administrative boundary
place
```

它們主要透過 Node、Way、Relation 描述。以道路來說，它不是一條已畫好顏色的線，而是由多個 geographic points 組成的 way，再搭配 tags：

```text
highway=primary
name=忠孝西路
lanes=4
```

因此：

```text
OSM Data ≠ Rendered Map

OSM Data + Map Style → Rendered Map
```

專案中使用 Taiwan OSM snapshot，例如 `taiwan-260722.osm.pbf`。`.osm.pbf` 是壓縮的 geographic data binary format，不是瀏覽器可以直接顯示的圖檔。

## Step 2 — Why Import OSM into PostGIS?

`.osm.pbf` 很適合保存完整 dataset，但不適合每次 Web request 都直接掃描。假設 browser 需要 `zoom = 14, x = 13715, y = 7011`，Tile Server 真正需要知道的是：這一小塊 geographic bounding box 裡有哪些道路、建築物、河流與其他 features？每次從完整 `.osm.pbf` 掃描會非常沒效率，因此 OSM data 會先被 import 到 spatial database：

```text
PostgreSQL + PostGIS
```

PostGIS 讓 PostgreSQL 能理解 spatial geometry：

```text
Point
LineString
Polygon
MultiPolygon
```

道路可以是 `LineString`、建築物可以是 `Polygon`、地點可以是 `Point`。Tile Server 之後便能做概念上像這樣的 spatial query：

```text
Find all geographic features
inside this tile's bounding box
```

所以我現在會把兩者理解成不同角色：

| 資料層 | 角色 |
| --- | --- |
| `.osm.pbf` | canonical geographic source / transport format |
| PostGIS | runtime spatial storage and query layer |

這個區分也讓我開始把 basemap data 和 application data 分開思考。OSM 提供道路、行政區與底圖資料；車輛位置、geofence、journey 與 telemetry 則屬於產品自己的 application data。兩者最後可以一起呈現在 Leaflet 上，但資料來源與處理流程並不相同。

## From Viewport to XYZ Tile Requests

當我在 Leaflet 打開台北地圖時，browser 不會 request `GET /map/taipei`，也不會 request `Give me the whole Taiwan map.`。真正發生的是一組 tile request：

```text
GET /tile/14/13714/7010.png
GET /tile/14/13715/7010.png
GET /tile/14/13716/7010.png

GET /tile/14/13714/7011.png
GET /tile/14/13715/7011.png
GET /tile/14/13716/7011.png
```

Browser 只下載目前 viewport 需要的 tiles。這也是為什麼 Web Map 可以快速拖動：不是每次重新下載整張地圖，而是使用已可見的 tiles，再補上新進入 viewport 的部分。

> **The browser never requests “a map.” It requests a set of XYZ tiles required by the current viewport. Leaflet then arranges those independent HTTP responses into what the user perceives as one continuous map.**

### From Longitude / Latitude to XYZ

Leaflet 知道 map center、viewport size 與 zoom level，例如：

```text
center: 25.0478, 121.517
zoom: 14
```

但 Tile Server 使用的不是 longitude / latitude URL，而是：

```text
/{z}/{x}/{y}
```

中間需要完成：

```text
Longitude / Latitude
        ↓
Web Mercator Projection
        ↓
Normalized Map Coordinates
        ↓
XYZ Tile Coordinates
```

大部分 Web Maps 使用 EPSG:3857，也就是 Web Mercator。在 zoom level `z`：

```text
n = 2^z
x = floor((longitude + 180) / 360 × 2^z)
```

Latitude 則不是 linear mapping，因為 Web Mercator 對 latitude 使用 nonlinear transformation。因此 `(latitude + 90) / 180` 不能直接拿來算 Web Map 的 Y tile。這也是我後來才理解，為什麼 Web Mercator 的 latitude 範圍大約限制在 `±85.0511°`，而不是完整的 `±90°`。

### What zoom actually means

XYZ Tile Scheme 中：

```text
z = zoom level
x = horizontal tile index
y = vertical tile index
```

每增加一層 zoom，每一個 axis 的 tile 數量都會乘以 2：

```text
z = 0 → 1 × 1
z = 1 → 2 × 2
z = 2 → 4 × 4
```

一般化來說：

```text
tiles per axis = 2^z
theoretical tile count = 4^z
```

所以 zoom 越高，每個 tile 覆蓋的 geographic area 越小，detail 越高。Raster tile 很常是 `256 × 256 px`；Leaflet 就能根據 viewport、tile size 與中心點，算出當前畫面需要哪些 tiles。

## What Happens After a Tile HTTP Request?

收到 `/z/x/y` 後，Tile Server 會先檢查 cache；如果沒有可直接回傳的 tile，才把 tile coordinate 轉回 geographic bounding box，取得這個範圍裡需要的 objects：

```text
z/x/y
↓
Tile geographic extent
↓
Spatial query
↓
PostGIS
↓
roads / buildings / water / boundaries / labels
```

但這些 data 還不是地圖圖片。下一步還要套用 map style，例如 motorway 的寬度與顏色、water 的樣式、building 的填色、place label 的 font size。最後 renderer 才把：

```text
Geographic Data + Map Style
↓
256 × 256 PNG
```

轉成 HTTP response：

```http
HTTP/1.1 200 OK
Content-Type: image/png
```

## How Leaflet Builds and Updates the Map

一個 `256 × 256` tile 通常只佔螢幕的一小部分。假設畫面需要 4 columns × 3 rows，browser 可能需要 12 個獨立 request；Leaflet 再按照 `z / x / y` 把它們放到正確位置：

```text
┌────────┬────────┬────────┬────────┐
│ Tile A │ Tile B │ Tile C │ Tile D │
├────────┼────────┼────────┼────────┤
│ Tile E │ Tile F │ Tile G │ Tile H │
├────────┼────────┼────────┼────────┤
│ Tile I │ Tile J │ Tile K │ Tile L │
└────────┴────────┴────────┴────────┘
```

因為相鄰 tile 的邊界是連續的，使用者最後看到的是一張完整地圖，而不是很多張圖片：

```text
User opens map
      ↓
Leaflet knows viewport
      ↓
Projection
      ↓
Determine visible XYZ tiles
      ↓
Multiple HTTP GET requests
      ↓
Tile Server
      ↓
Multiple PNG responses
      ↓
Leaflet positions every tile
      ↓
One continuous map
```

### Panning only fetches what is new

當使用者拖動地圖，Leaflet 不需要重新取得所有東西。原本仍在畫面中的 tile 可以繼續使用，只有新進入 viewport 的區域需要 request：

```text
Before

A B C
D E F
G H I

往右拖後

B C J
E F K
H I L
```

`B C / E F / H I` 已經存在，只需要 request `J / K / L`。Browser cache 或 Tile Cache 還能進一步減少重複 request 與 rendering；這是 tile-based Web Map 能流暢 pan 的重要原因之一。

## Cache, Raster Tiles and Pre-generated Archives

我一開始以為 Tile Server 每次收到 `GET /z/x/y` 都一定會 query PostGIS 再 render。後來才發現，實際架構不一定如此：

```text
Browser
↓
Tile Server
↓
Cache hit?
↙     ↘
HIT     MISS
 ↓        ↓
Return    PostGIS → Render → Cache → Return
Tile
```

如果 tile 已經 render 過，服務可以直接回傳 cached tile；只有 cache miss 才需要 query、render 與 cache。若 geographic data 很少改變，也可以先把 tiles pre-render。高 zoom level 的 tile 數量會隨 `4^z` 快速增加，因此才會出現 MBTiles、PMTiles 這類 tile archive formats，把大量 tiles 放到較方便管理的 single archive 中。

```text
.osm.pbf
→ source geographic data

PostGIS
→ spatial query layer

MBTiles / PMTiles
→ prepared tile archive
```

## Basemap and Application Data Are Different Layers

Leaflet 顯示出來的東西，不一定全部來自 Tile Server。Road、building、river、administrative boundary 等 basemap 可能來自 raster tiles；但 HINO application 自己的 vehicle marker、journey route、telemetry point、event marker、geofence 通常是另外一層。

```text
              Leaflet
                 │
       ┌─────────┴─────────┐
       │                   │
   Base Map             App Layer
       │                   │
XYZ Raster Tiles      Marker / Polyline / Polygon / Popup
```

`L.tileLayer(...)` 顯示 OSM basemap，而 `L.marker(...)`、`L.polyline(...)`、`L.polygon(...)` 是 application-specific data。這也讓我理解為什麼換掉 CARTO 後，車輛 marker、journey polyline 等 application logic 並不需要全部重寫；我們真正替換的是 basemap provider。

## Nominatim and OSRM Are Related, but Different

同一份 OSM-derived data 可以被不同 infrastructure 使用，但責任不同。地址文字轉座標或座標反查地名是 geocoding，較接近 Nominatim；從 origin 和 destination 找到合理道路路徑、距離與 ETA 則是 routing，較接近 OSRM：

```text
"台北車站" ──→ Nominatim ──→ { latitude, longitude }

origin + destination ──→ OSRM ──→ geometry, distance, duration, steps
```

它們都不是 basemap tile service。這個區分讓我在 debug 時能先判斷問題屬於哪一層：搜尋不到地址看 geocoder，路徑不合理看 routing engine，底圖不見才回頭看 tile URL、renderer 或 cache。

## The Complete Mental Model

最後我會把整條流程畫成：

```text
                      DATA PREPARATION

OpenStreetMap → .osm.pbf → Import → PostGIS → Geographic Features


                         ↓


                       RUNTIME

User opens / pans / zooms map
            ↓
Leaflet (center + zoom + viewport)
            ↓
Web Mercator
            ↓
Calculate XYZ Tiles
            ↓
Multiple HTTP GET Requests
            ↓
Tile Server
       ↙           ↘
Cache Hit       Cache Miss
   ↓                ↓
Return         PostGIS Query → Map Style → Render → Cache
   └────────────────┬────────────────┘
                    ↓
                PNG Tiles
                    ↓
              HTTP Responses
                    ↓
                 Leaflet
                    ↓
          Arrange Tiles + Application Layers
                    ↓
            Interactive Web Map
```

## Where CARTO Was in This Pipeline

理解完整 pipeline 後，再回頭看原本的 CARTO architecture 就簡單很多。

以前：

```text
Leaflet → XYZ HTTP Request → CARTO → Rendered Tiles → Leaflet
```

Self-hosted 之後：

```text
Leaflet → XYZ HTTP Request → Our Tile Server → Our OSM-derived Map Data → Rendered Tiles → Leaflet
```

前端的核心邏輯其實沒有根本性變化。改變的是：

```text
Who answers the tile HTTP request?

Before: CARTO
After: our own infrastructure
```

這也是我這次最大的理解之一。Self-hosting map service 並不是自己寫一套 Leaflet，而是把原本位於 Leaflet 後面的 map-serving layer，從 third-party provider 移回自己的 infrastructure。

## What I Took Away

這次最大的收穫不是學會使用某一個 GIS library，而是建立了一個能用來定位問題的 mental model。

當底圖消失時，我現在知道要從 tile URL、Tile Server、cache 或 rendering pipeline 往下查；地址搜尋有問題時，應該看 geocoder；路徑結果不合理時，則回到 routing engine。

原本的 `Leaflet → CARTO → Map` 對我來說是一個黑盒子。把整條 data flow 拆開後，我開始能從資料來源、projection、HTTP request 到 browser rendering，理解每一層真正負責的事情。

> **CARTO was no longer “the map.” It was one provider in a much larger Web Mapping Stack.**
