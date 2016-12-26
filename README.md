Plataforma de integración de datos para el apoyo a la caracterización y análisis de los destinos denominados Pueblos Mágicos.

## Quick start
Se requiere un servidor de MongoDB.

### Clonar el repositorio
````sh
git clone https://github.com/FST2015PM/SWBForms2.git
cd SWBForms2
````

### Construir y empaquetar la aplicación
````sh
mvn clean && mvn package
````

### Desplegar la aplicación usando webapp-runner (sólo desarrollo)

````sh
java -jar target/dependency/webapp-runner.jar target/SWBForms2-1.0-SNAPSHOT.war
````

### Abrir la aplicación
En su navegador Web vaya a [localhost:8080/login](localhost:8080/login) para comenzar a usar la aplicación.
