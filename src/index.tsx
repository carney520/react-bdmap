declare global {
  namespace BMap {
    interface Map {
      addEventListener(event: string, handler: Function): void
      removeEventListener(event: string, handler: Function): void
    }

    interface Overlay {
      owner?: any
    }
  }
}

export { default as BDMapLoader } from './BDMapLoader'
export { default as BDMap } from './BDMap'
export { default as withMap } from './withMap'
export { default as ContextMenu } from './ContextMenu'
// controls
export { default as Control } from './controls/Control'
export { default as CustomControl } from './controls/CustomControl'
export { default as GeolocationControl } from './controls/GeolocationControl'
export { default as MapTypeControl } from './controls/MapTypeControl'
export { default as NavigationControl } from './controls/NavigationControl'
export { default as OverviewMapControl } from './controls/OverviewMapControl'
export { default as ScaleControl } from './controls/ScaleControl'
export { default as CopyrightControl } from './controls/CopyrightControl'
// overlays
export { default as CanvasLayer } from './overlays/CanvasLayer'
export { default as Circle } from './overlays/Circle'
export { default as CustomOverlay } from './overlays/CustomOverlay'
export { default as GroundOverlay } from './overlays/GroundOverlay'
export { default as InfoWindow } from './overlays/InfoWindow'
export { default as Label } from './overlays/Label'
export { default as Marker } from './overlays/Marker'
export { default as Overlay } from './overlays/Overlay'
export { default as PointCollection } from './overlays/PointCollection'
export { default as Polygon } from './overlays/Polygon'
export { default as Polyline } from './overlays/Polyline'
// tile layers
export { default as CustomLayer } from './tileLayers/CustomLayer'
export { default as CustomTileLayer } from './tileLayers/CustomTileLayer'
export { default as TileLayer } from './tileLayers/TileLayer'
export { default as TrafficLayer } from './tileLayers/TrafficLayer'
// clusterer
export * from './Clusterer'
