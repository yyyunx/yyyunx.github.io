---
title: "從 CARTO 到 Self-Hosted Map：我如何理解 Web Mapping Stack"
description: "從一次地圖服務 self-hosting 的需求出發，重新理解 OSM、XYZ Tiles、Web Mercator、PostGIS、Leaflet、Nominatim 與 OSRM 在 Web Map 中各自扮演的角色。"
category: "GIS / Web Map"
visual: "terrain"
pubDate: 2026-09-06
tags: ["GIS", "OpenStreetMap", "Leaflet", "PostGIS", "Docker", "Web Map"]
slug: "web-map-stack-from-carto-to-self-hosted"
order: 4
draft: false
---

最近在 HINO 車聯網專案中，我遇到一個原本看起來很單純的問題：

> Map service needs to be self-hosted.

專案原本使用 Leaflet 顯示地圖，底圖則來自 CARTO。最開始我其實只知道：

```text
Leaflet → CARTO → 地圖出現
```

但當「把地圖服務自己架起來」變成需求後，這條線顯然不夠用了。我開始遇到更多問題：底圖資料從哪來？Leaflet 到底在做什麼？OSM、PostGIS、Nominatim 和 OSRM 是不是同一類服務？把 Docker container 跑起來，為什麼還不代表整個 map stack 已經可用？

這篇不是要整理一份 GIS 名詞百科，而是記錄我如何從一個實際部署需求，慢慢把 Web Mapping 的 data flow 拆開理解。

## 一開始的誤解：以為「地圖」是一個服務

在使用外部底圖時，前端程式碼通常很短：

```ts
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors © CARTO",
}).addTo(map);
```

這段程式很容易讓人形成一個直覺：Leaflet 負責顯示，CARTO 負責把地圖給我。這個理解在 prototype 階段沒有問題，但它把背後幾個不同責任混成了一件事。

當需求改成 self-hosting，真正要問的不是「要不要換一個 tile URL」，而是：

1. 誰保存道路、行政區、POI 等地理資料？
2. 誰把資料轉成使用者目前視窗所需的地圖圖磚？
3. 前端如何根據縮放與位置取得圖磚？
4. 搜尋地址與規劃路線，是否也需要一起自架？

我後來會把整件事拆成資料、地圖呈現、地理查詢與路由四層，而不是把它們都叫做「地圖 API」。

## 先把元件分清楚：每個服務做的事不一樣

| 元件 | 我現在的理解 | 它不負責什麼 |
| --- | --- | --- |
| OpenStreetMap（OSM） | 開放的地理資料與協作社群，也是許多底圖資料的來源 | 不是前端地圖元件，也不是直接等同 tile server |
| PostGIS | PostgreSQL 的空間資料能力；適合儲存、查詢與分析幾何資料 | 不會自動把資料畫成一張可滑動的地圖 |
| Tile Server / renderer | 將資料依樣式產生 raster 或 vector tiles | 不處理地址文字搜尋，也不替應用程式選路 |
| Leaflet | 瀏覽器端地圖 UI；管理 viewport、圖層、marker、popup 與互動 | 不提供道路或地圖資料 |
| Nominatim | Geocoding / reverse geocoding，例如地址轉座標或座標反查地名 | 不做 turn-by-turn routing |
| OSRM | 根據道路網路計算路徑、距離與預估時間 | 不提供一般底圖或地址資料庫 |

這張表對我最重要的價值，是讓我在 debug 時先判斷問題屬於哪一層。例如 marker 沒出現，可能是 Leaflet 或座標格式；搜尋不到地址，才去看 geocoder；路徑不合理，則要檢查 routing engine 與道路資料，而不是回頭調 tile style。

## Leaflet 和 XYZ Tiles：前端其實是在拼一張地圖

Leaflet 不會「下載一張世界地圖」。使用者拖曳或縮放時，它會依照目前的中心點與 zoom level，向 tile server 請求一小組圖磚。

常見的 URL 格式是：

```text
/{z}/{x}/{y}.png
```

其中：

- `z` 是縮放層級。
- `x` 是該層級中的橫向 tile index。
- `y` 是縱向 tile index。

當縮放層級增加一級，世界在每個方向都會被切得更細。也就是說，tile 數量大致會隨著 `2^z` 成長。這也讓我理解到：self-hosting 不只是把圖檔放到一個 web server；資料範圍、縮放層級、快取策略和 render 時機都會直接影響儲存空間與回應速度。

Leaflet 在這一層的工作很純粹：根據 view state 算出需要哪些 tile，發 request，把結果放到正確位置，再疊上我們自己的 route、vehicle marker 或 polygon layer。

## 為什麼 Web Mercator 會一直出現

我一開始看到 EPSG:3857、Web Mercator 和 latitude/longitude 時，覺得它們都是「座標系」。真正實作後才發現，這個區分會影響 tile 是否對得上。

GPS、OSM API 和多數 application data 常用 WGS84 經緯度（EPSG:4326）。但網頁地圖普遍採用 Web Mercator（EPSG:3857）來安排平面圖磚。經緯度要先投影到平面座標，才方便用 `z/x/y` 規則切圖。

簡化來看，資料流會像這樣：

```text
GPS / API: longitude, latitude (EPSG:4326)
        ↓ projection
Tile grid: x, y in Web Mercator (EPSG:3857)
        ↓
Leaflet assembles the requested tiles
```

這也提醒我，當資料看起來「在海上」或 marker 和底圖有明顯偏移時，不能只懷疑前端 CSS。要先檢查資料是經緯度、投影座標，還是經緯度順序被寫反；地理資料問題常常不是 UI 問題。

## PostGIS：不是為了取代 OSM，而是讓專案資料能做空間查詢

OSM 可以提供底圖與道路網路的原始資料，但 HINO 專案還有自己的 telemetry、車輛位置與營運相關資料。這些資料若只以一般欄位保存，很難回答像是「某台車是否進入指定區域」、「離某個 depot 最近的車是哪一台」或「這段 route 與特定行政區交疊多少」這類問題。

PostGIS 讓 PostgreSQL 能理解 geometry 與 geography，也能建立 spatial index。我的理解不是「把所有 OSM 都放進 PostGIS 就完成了」，而是把專案真正需要查詢與分析的空間資料放到一個可控、可索引的資料層。

例如，應用程式需要找出指定半徑內的車輛時，查詢的責任比較接近 PostGIS：

```sql
SELECT vehicle_id, recorded_at
FROM vehicle_positions
WHERE ST_DWithin(
  position::geography,
  ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
  :radius_meters
);
```

這和「把底圖顯示在 Leaflet 上」是不同路徑。前者是 application data query；後者是 map rendering。

## Nominatim 和 OSRM：地址搜尋與路線規劃是兩個問題

另一個容易混淆的地方，是搜尋地點與規劃路線。

如果使用者輸入「台北車站」，系統需要把文字轉成候選地點與座標，這是 geocoding；如果地圖上已有兩個座標，系統要找出道路上合理的行駛路徑與 ETA，這是 routing。

```text
"台北車站" ──→ Nominatim ──→ { latitude, longitude }

origin + destination ──→ OSRM ──→ geometry, distance, duration, steps
```

我以前會把兩者都視為「地圖服務」。現在會把 Nominatim 想成地名與座標之間的查詢服務，而 OSRM 是以道路網路做圖搜尋與成本計算的引擎。它們都可能使用 OSM 資料，但輸出的產品完全不同。

## Self-hosting 的重點其實是 data flow，而不只是 Docker

Docker 對這件事很有幫助，因為它可以把資料庫、tile renderer、geocoder 或 routing engine 的相依環境包起來。不過我在實作時學到，container 能正常啟動只是第一步。

我現在會用下面的順序思考 self-hosted stack：

1. **資料來源與範圍**：要匯入哪個區域的 OSM extract？資料更新頻率是什麼？
2. **資料處理**：哪些資料需要進 PostGIS，哪些交給 routing engine 建索引，哪些會被轉成 tiles？
3. **服務邊界**：tile、geocoding、routing 是否要分開部署與監控？
4. **前端整合**：Leaflet 的 tile URL、attribution、CORS 與 fallback 行為是否正確？
5. **營運問題**：快取、磁碟、記憶體、資料更新與 observability 要怎麼安排？

這個順序讓我不會因為「已經有 Docker Compose」就過早認定問題解完。若 tiles 很慢，可能是 render 或 cache；若 route 回傳空結果，可能是資料範圍、profile 或預處理；若搜尋沒結果，也未必是 Leaflet 的錯。

## 我目前整理出的整體架構

以車聯網應用來看，我會把概念圖整理成下面這樣：

```text
                         OSM regional extract
                           │        │        │
                           │        │        └──→ OSRM ──→ route / ETA
                           │        └──────────→ Nominatim ──→ search / reverse geocode
                           └───────────────────→ tile renderer ──→ XYZ tiles

Project telemetry / operational data ──→ PostGIS ──→ spatial query / API

XYZ tiles + project API + route geometry ──→ Leaflet ──→ browser map UI
```

這不是唯一的 production architecture，也不是每個服務都必須自架。但它幫助我在專案中回答一個更清楚的問題：我們是在替換哪個外部依賴？是底圖供應商、地址查詢、路線引擎，還是整個資料與呈現流程？

## 從這次實作帶走的理解

這次需求讓我重新認識到，Web Map 不是一個 API endpoint，而是一串不同格式與不同責任的資料流。Leaflet 是 UI，XYZ tiles 是地圖呈現方式，OSM 是重要資料來源，PostGIS 是專案空間資料層，Nominatim 負責位置名稱查詢，OSRM 負責路徑計算。

我一開始只是想知道「怎麼不用 CARTO 還能有地圖」，最後學到的是：只有把每個元件的 input、output 與 failure mode 分開看，self-hosting 才不會變成把一大堆 container 疊在一起。

下一步我想繼續補上的，不是更多名詞，而是把這些服務的 health check、資料更新流程與快取策略真的接進專案，讓這個理解能落到可維護的工程實作上。
