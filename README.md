# Web_Servidor_Kaggle

## Instalando los paquetes necesarios

```sh
npm install dotenv accesscontrol bcrypt body-parser express jsonwebtoken mongoose
```

Aquí hay un breve resumen de cada paquete instalado:

- dotenv: este paquete carga variables de entorno de un archivo .env en el objeto process.env de Node.
- bcrypt: se usa para codificar contraseñas de usuario u otra información confidencial que no queremos almacenar en nuestra base de datos.
- body-parser: se utiliza para analizar los datos entrantes de los cuerpos de una solicitud, como los datos de formulario, y adjunta el valor analizado a un objeto al que luego puede acceder un middleware.
- jsonwebtoken: proporciona un medio para representar las reclamaciones que se transferirán entre dos partes asegurando que la información transferida no haya sido manipulada por un tercero no autorizado.
- mongoose: es una biblioteca ODM para MongoDB, proporciona características tales como validación de esquema, gestión de relaciones entre datos, etc.
- express: facilita la creación de aplicaciones API y del lado del servidor con Node, proporcionando funciones útiles como enrutamiento, middlewares, etc.
- accesscontrol: proporciona control de acceso basado en roles y atributos.
