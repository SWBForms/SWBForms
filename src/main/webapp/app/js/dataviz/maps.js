/** Class to encapsulate maps creation */
class MapsFactory {
  constructor() { }

  _onEachFeature(feature, layer) {
		var popupContent = "<p>I started out as a GeoJSON " +
				feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);
	}

  //TODO: Place specific code from here
  createMap(container) {
    if (!L) return;
    //Sample code
    let mymap = L.map(container).setView([25.793, -108.977], 12);
    L.tileLayer('https://api.mapbox.com/styles/v1/ismene93/ciwcwzju6000f2plkb4k1qk38/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
    }).addTo(mymap);
    
    return mymap;
  }

  addGeoJSONLayer(map, data) {
    L.geoJSON(data, {
      onEachFeature: this._onEachFeature
    }).addTo(map);
  }

  /*createMap(container, data, engine, options) {
    if (!L) return;
    //Sample code
    let mymap = L.map(container).setView([25.793, -108.977], 12);

    L.tileLayer('https://api.mapbox.com/styles/v1/ismene93/ciwcwzju6000f2plkb4k1qk38/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
    }).addTo(mymap);
   let marker1 = L.marker([25.789, -109.004]).addTo(mymap);
   let marker2 = L.marker([25.761, -108.967]).addTo(mymap);
   let circle = L.circle([25.744, -108.993], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 1000
    }).addTo(mymap);
    let polygon = L.polygon([
      [25.782, -109.029],
      [25.772, -108.984],
      [25.757, -109.011]
    ]).addTo(mymap);
    marker1.bindPopup("<b>Parque</b>").openPopup();
    marker2.bindPopup("<b>Estaci&oacute;n de Trenes</b>");
    circle.bindPopup("&Aacute;rea uno");
    polygon.bindPopup("&Aacute;rea dos");
    let popup = L.popup();
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("Coordenadas seleccionadas  " + e.latlng.toString())
            .openOn(mymap);
    }
   mymap.on('click', onMapClick);

   return mymap;
 }*/
}
