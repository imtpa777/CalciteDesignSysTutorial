import esriConfig from "https://js.arcgis.com/4.27/@arcgis/core/config.js";
import FeatureLayer from "https://js.arcgis.com/4.27/@arcgis/core/layers/FeatureLayer.js";
import Map from "https://js.arcgis.com/4.27/@arcgis/core/Map.js"; 
import WebMap from "https://js.arcgis.com/4.27/@arcgis/core/WebMap.js";
import MapView from "https://js.arcgis.com/4.27/@arcgis/core/views/MapView.js";
import Bookmarks from "https://js.arcgis.com/4.27/@arcgis/core/widgets/Bookmarks.js";
import LayerList from "https://js.arcgis.com/4.27/@arcgis/core/widgets/LayerList.js";
import Legend from "https://js.arcgis.com/4.27/@arcgis/core/widgets/Legend.js";
import Print from "https://js.arcgis.com/4.27/@arcgis/core/widgets/Print.js";
import Home from "https://js.arcgis.com/4.27/@arcgis/core/widgets/Home.js";
import Locate from "https://js.arcgis.com/4.27/@arcgis/core/widgets/Locate.js";
import BasemapGallery from "https://js.arcgis.com/4.27/@arcgis/core/widgets/BasemapGallery.js";
import Search from "https://js.arcgis.com/4.27/@arcgis/core/widgets/Search.js";
import appConfig from "../config/config.js"
    const webmapId = new URLSearchParams(window.location.search).get("webmap") ?? "210c5b77056846808c7a5ce93920be81";

    const map = new WebMap({
      portalItem: {
        id: webmapId
      }
    });

    const view = new MapView({
      map,
      container: "viewDiv",
      padding: {
        left: 49
      }
    });

    view.ui.move("zoom", "top-left");

    const basemaps = new BasemapGallery({
      view,
      container: "basemaps-container"
    });

    const bookmarks = new Bookmarks({
      view,
      container: "bookmarks-container"
    });

    const layerList = new LayerList({
      view,
      selectionEnabled: true,
      container: "layers-container"
    });

    const legend = new Legend({
      view,
      container: "legend-container"
    });

    const print = new Print({
      view,
      container: "print-container"
    });

    const featureLayerDistricts = new FeatureLayer({
      url:
        "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_117th_Congressional_Districts_all/FeatureServer/0",
      popupTemplate: {
        // autocasts as new PopupTemplate()
        title: "Congressional District {DISTRICTID} </br>{NAME}, ({PARTY})",
        overwriteActions: true
      }
    });

    const featureLayerSenators = new FeatureLayer({
      url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/US_Senators_2020/FeatureServer/0",
      popupTemplate: {
        // autocasts as new PopupTemplate()
        title: "<a href={Web_Page} target='_blank'> {Name}</a>, ({Party}-{State}) ",
        overwriteActions: true
      }
    });
  
  const searchWidget = new Search({
      view: view,
      allPlaceholder: "District or Senator",
      includeDefaultSources: false,
      container: "search-container",
      sources: [
        {
          layer: featureLayerDistricts,
          searchFields: ["DISTRICTID"],
          displayField: "DISTRICTID",
          exactMatch: false,
          outFields: ["DISTRICTID", "NAME", "PARTY"],
          name: "Congressional Districts",
          placeholder: "example: 3708"
        },
        {
          layer: featureLayerSenators,
          searchFields: ["Name", "Party"],
          suggestionTemplate: "{Name}, Party: {Party}",
          exactMatch: false,
          outFields: ["*"],
          placeholder: "example: Casey",
          name: "Senators",
          zoomScale: 500000,
          resultSymbol: {
            type: "picture-marker", // autocasts as new PictureMarkerSymbol()
            url: "https://developers.arcgis.com/javascript/latest//sample-code/widgets-search-multiplesource/live/images/senate.png",
            height: 36,
            width: 36
          }
        },
        {
          name: "ArcGIS World Geocoding Service",
          placeholder: "example: Nuuk, GRL",
          apiKey: "YOUR API KEY",
          singleLineFieldName: "SingleLine",
          url: "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        }
      ]
    });

    map.when(() => {
      const { title, description, thumbnailUrl, avgRating } = map.portalItem;
      //document.querySelector("#header-title").textContent = title;
      document.querySelector("#item-description").innerHTML = description;
      document.querySelector("#item-thumbnail").src = thumbnailUrl;
      document.querySelector("#item-rating").value = avgRating;

      let activeWidget;

      const handleActionBarClick = ({ target }) => {
        if (target.tagName !== "CALCITE-ACTION") {
          return;
        }

        if (activeWidget) {
          document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
          document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
        }

        const nextWidget = target.dataset.actionId;
        if (nextWidget !== activeWidget) {
          document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
          document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
          activeWidget = nextWidget;
        } else {
          activeWidget = null;
        }
      };

      document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);

      let actionBarExpanded = false;

      document.addEventListener("calciteActionBarToggle", event => {
        actionBarExpanded = !actionBarExpanded;
        view.padding = {
          left: actionBarExpanded ? 150 : 49
        };
      });

      document.querySelector("calcite-shell").hidden = false;
      document.querySelector("calcite-loader").hidden = true;

    });
/*   }); */