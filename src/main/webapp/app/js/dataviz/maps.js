/** Class to encapsulate maps creation */
class MapsFactory {
constructor() { }

  _onEachFeature(feature, layer) {
	if (feature.properties && feature.properties.popupContent) {
		layer.bindPopup(feature.properties.popupContent);
	}
	/*
	if(feature.geometry.type == "Point"){
	  switch(feature.properties.geografico){
		  case "Plaza":
		  break;
	          case "Mercado":
		  break;
		  case "Escuela":
		  break;
	  }
	}*/
}

_onEachStyle(feature){
    if(feature.properties.color){
      return {color: feature.properties.color};
    }
}

  addGeoJSONLayer(map, data) {
    L.geoJSON(data, {
      onEachFeature: this._onEachFeature,
      style: this._onEachStyle
    }).addTo(map);
  }

	addGeoJSONCircle(map, data){
    var geojsonMarkerOptionsBlue = {
        radius: 8,
        fillColor: "#5882FA",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
 	 L.geoJSON(data, {
 	    pointToLayer: function (feature, latlng) {
 		     return L.circleMarker(latlng, geojsonMarkerOptionsBlue);
 	    }
 	}).addTo(map);
  }


  addGeoJSONMarkers(map, data){
    var greenIcon = L.icon({
        iconUrl: './img/icons/leaf-green.png',
        shadowUrl: './img/icons/leaf-shadow.png',

        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
	 	 L.geoJSON(data, {
	 	    pointToLayer: function (feature, latlng) {
	 		    return L.marker(latlng, {icon: greenIcon});
	 	    }
	 	}).addTo(map);
  }

  createMap(container, engine) {
    switch(engine){

      case ENGINE_LEAFLET:
        if (!L) return;
        
          let mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                              '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                              'Imagery © <a href="http://mapbox.com">Mapbox</a>',
          mbUrl ='https://api.mapbox.com/styles/v1/ismene93/ciwcwzju6000f2plkb4k1qk38/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA',
          mbUrl2='https://api.mapbox.com/styles/v1/ismene93/ciwd28yeq000h2pnafgwqprhz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA';
          
          let grayscale   = L.tileLayer(mbUrl2, {id: 'mapbox.light', attribution: mbAttr}),
              streets     = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});
                     
          let mymap = L.map(container,{
            center: [25.793, -108.977],
            zoom: 10,
            layers: [grayscale, streets]
          });
        
           var baseLayers = {
            "Grayscale": grayscale,
            "Streets": streets
            };
          L.control.layers(baseLayers).addTo(mymap);
            return mymap;
            break;

      case ENGINE_D3:


           break;
      case ENGINE_GOOGLEMAPS:
           break;
    }//switch
  }//createMap


}//maps





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