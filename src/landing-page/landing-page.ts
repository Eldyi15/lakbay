import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { phgeoJson } from '../app/shared/polygons/philippines.polygon';
import { regionsPoly } from '../app/shared/polygons/regions.polygon';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingPage implements OnInit, AfterViewInit {
  phPoly: any = phgeoJson;
  regionsPoly: any = regionsPoly;
  map: any;
  regionsLayer: any; // Keep a reference to the layer
  luzonGeoJSONLayer:any;
  visayasGeoJsonLayer:any;
  mindanaoGeoJsonLayer:any;
  layerGroup = new L.LayerGroup();
  sections = ['luzon', 'visayas', 'mindanao'];
  selectedIsland = 'luzon';
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.generateMap();
  }

  onSectionChange(section: string) {
    this.selectedIsland = section;
    this.cdr.detectChanges();
    console.log(this.selectedIsland, 'selected')
    switch (section) {
      case 'luzon':
        this.map.flyTo([16.5, 121], 6);
        break;

      case 'visayas':
        this.map.flyTo([10.0, 124.0], 7);

        break;

      case 'mindanao':
        this.map.flyTo([7.0, 125.0], 7);
        break;
    }
  }
  highlightRegion(regionName: string) {
    const geoJsonLayer = regionName === 'luzon' ? this.luzonGeoJSONLayer : regionName === 'visayas' ? this.visayasGeoJsonLayer : this.mindanaoGeoJsonLayer;
    geoJsonLayer.eachLayer((layer: any) => {
      const isTarget = layer.feature.properties.name === regionName;

      layer.setStyle({
        fillColor: isTarget ? '#ffcc00' : '#cccccc',
        weight: isTarget ? 3 : 1
      });
    });
  }

  generateMap() {
    this.map = L.map('map', {
      center: [12.8797, 121.7740],
      zoom: 6,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      zoomAnimation:false,
      markerZoomAnimation:false
    });
    this.map.whenReady(() => {
      this.addLuzonPolygon();
      this.addVisayasPolygon();
      this.addMindanaoPolygon();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.onSectionChange(entry.target.id);
          }
        });
      }, { threshold: 0.6 });
      this.sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    })

    // // 1. Assign colors to the data first
    // this.regionsPoly.features.forEach((region: any) => {
    //   console.log(region.properties.name)
    //   region.properties['uniqueColor'] = this.getRandomHexColor();
    // });

    // // 2. Add all regions as a SINGLE layer
    // this.addRegionsLayer();
  }

  addPhilippinePolygon() {
    L.geoJSON(this.phPoly, {
      style: { color: 'none', fillColor: "#1d6d38ff", fillOpacity: 0.8 }
    }).addTo(this.map);
  }

  addLuzonPolygon() {
    const luzonRegions = [
      "Ilocos",
      "Cagayan Valley",
      "Central Luzon",
      "Calabarzon",
      "Mimaropa",
      "Bicol",
      "Cordillera Administrative Region",
      "National Capital Region"
    ];
    const luzonPolygon:any = {
      type: 'FeatureCollection',
      features: this.regionsPoly.features.filter((f:any) =>
      luzonRegions.includes(f.properties.name)
    )
  }
    L.geoJSON(luzonPolygon, {
      style: {
        color: '#a4a4a444',       // semi-transparent black stroke for shadow
        weight: 7,               // thicker than the actual polygon
        fillColor: 'none',
        opacity:1
      }
    }).addTo(this.map);
    
    this.luzonGeoJSONLayer = L.geoJSON(luzonPolygon, {
      onEachFeature: (feature, layer) => {
        // if (feature.properties?.iconUrl) {
        //   const iconOpt:any = L.icon({
        //     iconUrl: feature.properties?.iconUrl,
        //     iconSize: [64, 64],
        //   })
        //   const center = turf.centroid(feature).geometry.coordinates;
        //   const [lng, lat] = center;

        //   L.marker([lat, lng], { icon: iconOpt }).addTo(this.map);
        // }
      },
      style: {
        color: '#0074f9ff',
        weight:1,
        fillColor: '#89bef9ff',
        fillOpacity:1
      }
    }).addTo(this.map);
    this.addLayerGroup(this.luzonGeoJSONLayer);
  }

  addVisayasPolygon() {
    const visayasRegions = [
      "Western Visayas",
      "Central Visayas",
      "Eastern Visayas"
    ];
    const visayasPolygon:any = {
      type: 'FeatureCollection',
      features: this.regionsPoly.features.filter((f:any) =>
      visayasRegions.includes(f.properties.name))
    }
    L.geoJSON(visayasPolygon, {
      style: {
        color: '#a3a3a344',       // semi-transparent black stroke for shadow
        weight: 7,               // thicker than the actual polygon
        fillColor: 'none',
        opacity:.5
      }
    }).addTo(this.map);
    this.visayasGeoJsonLayer = L.geoJSON(visayasPolygon, {
      onEachFeature: (feature, layer) => {
        // if (feature.properties?.iconUrl) {
        //   const iconOpt:any = L.icon({
        //     iconUrl: feature.properties?.iconUrl,
        //     iconSize: [64, 64],
        //   })
        //   const center = turf.centroid(feature).geometry.coordinates;
        //   const [lng, lat] = center;

        //   L.marker([lat, lng], { icon: iconOpt }).addTo(this.map);
        // }
      },
      style: {
        color: 'rgba(201, 208, 0, 1)',
        fillColor: '#fff58bff',
        fillOpacity:1,
        weight:1
      }
    }).addTo(this.map);
    this.addLayerGroup(this.visayasGeoJsonLayer);
  }

  addMindanaoPolygon() {
    const mindanaoRegions = [
      "Zamboanga Peninsula",
      "Northern Mindanao",
      "Davao",
      "Soccsksargen",
      "Caraga",
      "Bangsamoro Autonomous Region in Muslim Mindanao"
    ];
    const mindanaoPolygon:any = {
      type: 'FeatureCollection',
      features: this.regionsPoly.features.filter((f:any) =>
      mindanaoRegions.includes(f.properties.name))
    }
    L.geoJSON(mindanaoPolygon, {
      style: {
        color: '#bdbdbd44',       // semi-transparent black stroke for shadow
        weight: 7,               // thicker than the actual polygon
        fillColor: 'none',
        opacity:1
      }
    }).addTo(this.map);
    this.mindanaoGeoJsonLayer = L.geoJSON(mindanaoPolygon, {
      onEachFeature: (feature, layer) => {
        // if (feature.properties?.iconUrl) {
        //   const iconOpt:any = L.icon({
        //     iconUrl: feature.properties?.iconUrl,
        //     iconSize: [64, 64],
        //   })
        //   const center = turf.centroid(feature).geometry.coordinates;
        //   const [lng, lat] = center;

        //   L.marker([lat, lng], { icon: iconOpt }).addTo(this.map);
        // }
        layer.on('click', () => {
          this.removeLayer('mindanao');
          this.zoomOnClick(this.mindanaoGeoJsonLayer);
        })
      },
      style: {
        color: '#ff0404ff',
        fillColor: '#ff8787ff',
        fillOpacity:1,
        weight:1
      }
    }).addTo(this.map);
    this.addLayerGroup(this.mindanaoGeoJsonLayer);
    
  }

  

  addRegionsLayer() {
    this.regionsLayer = L.geoJSON(this.regionsPoly, {
      style: (feature: any) => ({
        color: 'none',
        fillColor: feature.properties.uniqueColor,
        fillOpacity: 1
      }),
      onEachFeature: (feature, layer) => {
        let hoverTimer: any;

        layer.on({
          // click: (e) => {
          //   this.map.fitBounds(e.target.getBounds(), {
          //     padding: [50, 50],
          //     maxZoom: 20,
          //     animate: true,
          //     duration: 1.5 // 4.0 is quite slow, adjusted to 1.5
          //   });
          //   console.log(e.target, 'SHOW DETAILS CLICK');
          // },
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({
              color: "rgba(0, 0, 0, 1)",
              weight: 1
            });
            
            clearTimeout(hoverTimer);
            hoverTimer = setTimeout(() => {
              console.log(feature.properties, 'SHOW DETAILS');
            }, 500);
          },
          mouseout: (e) => {
            clearTimeout(hoverTimer);
            // Reset style back to original using the feature property
            this.regionsLayer.resetStyle(e.target); 
          }
        });

        layer.bindTooltip(this.addToolTip(feature), {
          direction: 'top',   // Position relative to cursor
          className: 'custom-region-tooltip',
          sticky: true
        })
      }
    }).addTo(this.map);
  }
  addToolTip(feature:any) {
    return `
          <div class="tooltip-header">
            <div class=img-container><img src='../assets/images/${feature.properties.name.toLowerCase().replaceAll(' ', '-')}.png' /></div>
            ${feature.properties.name || 'Region'}
          </div>
          <span class='click-more'>Click for more information</span>
        </div>
      `;
  }
  getRandomHexColor() {
    return '#' + Math.floor(Math.random() * 16776415).toString(16).padStart(6, '0');
  }

  addLayerGroup(layer:any) {
    this.layerGroup.addTo(this.map);
    this.layerGroup.addLayer(layer);
  }
  removeLayer(id:string) {
    switch (id) {
      case 'luzon':
        this.layerGroup.removeLayer(this.visayasGeoJsonLayer);
        this.layerGroup.removeLayer(this.mindanaoGeoJsonLayer);
        break;
      case 'visayas':
        this.layerGroup.removeLayer(this.luzonGeoJSONLayer);
        this.layerGroup.removeLayer(this.mindanaoGeoJsonLayer);
        break;
      case 'mindanao':
        this.layerGroup.removeLayer(this.luzonGeoJSONLayer);
        this.layerGroup.removeLayer(this.visayasGeoJsonLayer);
        break;
      default:
        break;
    }
  }
  zoomOnClick(geoJson:any) {
    const center = geoJson.getBounds();
    this.map.fitBounds(center);
  }
}
