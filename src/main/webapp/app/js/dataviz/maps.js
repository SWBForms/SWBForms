/** Class to encapsulate maps creation */
class MapsFactory {
  constructor() { }

  _onEachFeature(feature, layer) {
    if (feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }

  _onEachStyle(feature){
    if(feature.properties.color){
      return {color:feature.properties.color,
        weight: 5,
        opacity: 0.65};
    }
  }

    /*

    */
  createMap(container, engine, firstPoint, setZoom) {
    let mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';

    switch(engine) {
      case ENGINE_LEAFLET_DUAL:
        if (!L) return;

        let mbUrl ='https://api.mapbox.com/styles/v1/ismene93/ciwcwzju6000f2plkb4k1qk38/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA',
            mbUrl2='https://api.mapbox.com/styles/v1/ismene93/ciwd28yeq000h2pnafgwqprhz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA';

        let grayscale = L.tileLayer(mbUrl2, {id: 'mapbox.light', attribution: mbAttr}),
            streets = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

        let ret = L.map(container,{
          center: [firstPoint[0], firstPoint[1]],
          zoom: setZoom,
          layers: [grayscale, streets]
        });

        let baseLayers = {
          "Grayscale": grayscale,
          "Streets": streets
        };
        L.control.layers(baseLayers).addTo(ret);
        return ret;
        break;
      case ENGINE_GOOGLEMAPS:
        //let self = this;
        //  let map;
        //add api key
        GoogleMapsLoader.KEY = 'AIzaSyC2hy80dZpGaH4_ivGjqYS1f_UDJZrgyBI';
        //load service
        /*GoogleMapsLoader.onLoad(function(google) {
        console.log('I just loaded google maps api');
      });*/

      //load map
      GoogleMapsLoader.load(function(google) {
        let map = new google.maps.Map(document.getElementById(container), {
          center: {lat: firstPoint[0], lng: firstPoint[1]},
          scrollwheel: true,
          zoom: setZoom
        });
        return map;
      });

      break;
      case ENGINE_LEAFLET:
      if (!L) return;
      let mymap = L.map(container).setView([firstPoint[0], firstPoint[1]], setZoom);
      L.tileLayer('https://api.mapbox.com/styles/v1/ismene93/ciwcwzju6000f2plkb4k1qk38/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA', {
        attribution: mbAttr,
        maxZoom: setZoom,
      }).addTo(mymap);

      return mymap;
      break;
    }//switch
  }//createMap
  /*
  Load Json data
  */
  addGeoJSONLayer(map, data, engine) {
    switch(engine) {
      case ENGINE_GOOGLEMAPS:
      if (map) {
        map.data.loadGeoJson(data);
      };
      break;
      case ENGINE_LEAFLET:
      L.geoJSON(data, {
        onEachFeature: this._onEachFeature,
        style: this._onEachStyle
      }).addTo(map);
      break;
      case ENGINE_D3:
      break;
      default:
    }//switch
  }//Layer

  addRoute(map, origin, destination, type, engine) {
    switch(engine) {
      case ENGINE_GOOGLEMAPS:
      if (map) {
        GoogleMapsLoader.load(function(google, map, origin, destination, type) {
          directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
          });
          //formar el request con la ruta
          let request = {
            destination: destination,
            origin: origin,
            travelMode: type
          };
          //ejecutar la direccion del servicio
          let directionsService = new google.maps.DirectionsService();
          directionsService.route(request, function(response, status) {
            if (status == 'OK') {
              //si se realizo correctamente la consulta se establece la dirección
              directionsDisplay.setDirections(response);
            }
          });
        });
      };

      break;
      case ENGINE_LEAFLET:

      break;
      case ENGINE_D3:
      break;
      default:
    }//switch
  }//route
  addSimpleMarker(data, map){
    return L.marker([data[0], data[1]]).addTo(map);
  }
  addCircleMarker(map, data){
    let geojsonMarkerOptionsBlue = {
      radius: 8,
      fillColor: "#5882FA",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    let geojsonMarkerOptionsGreen = {
      radius: 8,
      fillColor: "#04B431",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        if (feature.properties.popupContent)
        return L.circleMarker(latlng, geojsonMarkerOptionsBlue)
        else
        return L.circleMarker(latlng, geojsonMarkerOptionsGreen)
      }
    }).addTo(map);
  }

  addMarker(map, data, engine) {
    switch(engine) {
      case ENGINE_GOOGLEMAPS:
      if (map) {
        GoogleMapsLoader.load(function(google, map, data, title) {
          var marker2 = new google.maps.Marker({
            map: map,
            position: market,
            title: title
          });
        });
      };
      break;
      case ENGINE_LEAFLET:
      let greenIcon = L.icon({
        iconUrl: './img/icon/leaf-green.png',
        shadowUrl: './img/icon/leaf-shadow.png',
        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
      let escuela = L.icon({
        iconUrl: './img/icon/bandera.png',
        iconSize:     [38, 80], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
      let templo = L.icon({
        iconUrl: './img/icon/blanco.png',
        iconSize:     [38, 70], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
      L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          switch(feature.properties.geografico){
            case "Escuela":
            return L.marker(latlng, {icon: escuela});
            break;
            case "Templo":
            return L.marker(latlng, {icon: templo});
            break;
            default:
            return L.marker(latlng, {icon: greenIcon});
            break;
          }
        }
      }).addTo(map);
      break;
      case ENGINE_D3:
      break;
      default:
    }//switch
    return;
  }//marker


}//maps
