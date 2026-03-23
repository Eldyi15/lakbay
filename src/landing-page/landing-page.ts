import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { SharedHeader } from '../shared/shared-header/shared-header';
import { SharedBottomNav } from "../shared/shared-bottom-nav/shared-bottom-nav";
import * as L from 'leaflet';
import { phgeoJson } from '../app/shared/polygons/philippines.polygon';
import { regionsPoly } from '../app/shared/polygons/regions.polygon';

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
  
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    this.generateMap();
  }

  generateMap() {
    this.map = L.map('map', {
      center: [12.8797, 121.7740],
      zoom: 6,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false
    });

    this.addPhilippinePolygon();

    // 1. Assign colors to the data first
    this.regionsPoly.features.forEach((region: any) => {
      console.log(region.properties.name)
      region.properties['uniqueColor'] = this.getRandomHexColor();
    });

    // 2. Add all regions as a SINGLE layer
    this.addRegionsLayer();
  }

  addPhilippinePolygon() {
    L.geoJSON(this.phPoly, {
      style: { color: 'none', fillColor: "#1d6d38ff", fillOpacity: 0.8 }
    }).addTo(this.map);
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
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
}
