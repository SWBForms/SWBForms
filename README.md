Plataforma de integración de datos para el apoyo a la caracterización y análisis de los destinos denominados Pueblos Mágicos.

## Quick start
Se requiere un servidor de MongoDB.

### Clonar el repositorio
````sh
git clone https://github.com/FST2015PM/Plataforma.git
cd Plataforma
````

### Construir y empaquetar la aplicación
````sh
bower install
mvn clean && mvn package
````

### Desplegar la aplicación usando webapp-runner (sólo desarrollo)

````sh
java -jar target/dependency/webapp-runner.jar target/Plataforma-1.0-SNAPSHOT.war
````
### Desplegar la aplicación en ambientes productivos

Deberá establecer la variable de entorno **FST2015PM_ENV** con el valor _production_, de lo contrario, los enlaces a los recursos podrían no funcionar.

### Abrir la aplicación
En su navegador Web vaya a [localhost:8080/login](localhost:8080/login) para iniciar sesión y porteriormente, navegue a [localhost:8080/app](localhost:8080/app) para comenzar a usar la aplicación como usuario visualizador o a [localhost:8080/app/#/admin/](localhost:8080/app/#/admin/) para ver las opciones administrativas.
