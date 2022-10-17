let bruto;
let resultados = document.getElementById("res");

function iniciar() {
  console.log("iniciando...");
  let url =
    "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";
  let method = "GET";
  let callback = load_xml;

  xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.send();
  xhr.addEventListener("load", callback);
}

const load_xml = () => {
  let resultados = "";
  console.log("cargado");
  bruto = JSON.parse(xhr.response);
  listarData(bruto.ListaEESSPrecio);
};

function listarData(datos) {
  console.log("listarData");
  for (let i = 0; i < datos.length; i++) {
    // resultados.innerHTML += datos[i].Dirección;
    if (datos[i].Localidad == "VIGO") {
      console.log(datos[i]["Rótulo"]);
      console.log(datos[i]["Dirección"]);
      console.log(datos[i]["Precio Gasoleo A"]);
      console.log(datos[i]["Precio Gasoleo Premium"]);
      console.log(datos[i]["Precio Gasolina 95 E5"]);
      console.log(datos[i]["Precio Gasolina 98 E5"]);
    }
  }
}

// propiedades del objeto
/*
    # C.P.
    # Dirección
    # Horario
    IDCCAA
    IDEESS
    IDMunicipio
    IDProvincia
    # Latitud
    # Localidad
    # Longitud (WGS84)
    Margen
    # Municipio
    Precio Biodiesel
    Precio Bioetanol
    Precio Gas Natural Comprimido
    Precio Gas Natural Licuado
    Precio Gases licuados del petróleo
    # Precio Gasoleo A
    Precio Gasoleo B
    # Precio Gasoleo Premium
    # Precio Gasolina 95 E5
    Precio Gasolina 95 E5 Premium
    Precio Gasolina 95 E10
    # Precio Gasolina 98 E5
    Precio Gasolina 98 E10
    Precio Hidrogeno
    # Provincia
    Remisión
    # Rótulo
    Tipo Venta

*/
