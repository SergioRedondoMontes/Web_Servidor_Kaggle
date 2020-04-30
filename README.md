# Web_Servidor_Kaggle

## Instalando los paquetes necesarios

```sh
npm install dotenv accesscontrol bcrypt body-parser express jsonwebtoken mongoose
```

Aquí hay un breve resumen de cada paquete instalado:

- **dotenv** este paquete carga variables de entorno de un archivo .env en el objeto process.env de Node.
- **bcrypt**: se usa para codificar contraseñas de usuario u otra información confidencial que no queremos almacenar en nuestra base de datos.
- **body-parser**: se utiliza para analizar los datos entrantes de los cuerpos de una solicitud, como los datos de formulario, y adjunta el valor analizado a un objeto al que luego puede acceder un middleware.
- **jsonwebtoken**: proporciona un medio para representar las reclamaciones que se transferirán entre dos partes asegurando que la información transferida no haya sido manipulada por un tercero no autorizado.
- **mongoose**: es una biblioteca ODM para MongoDB, proporciona características tales como validación de esquema, gestión de relaciones entre datos, etc.
- **express**: facilita la creación de aplicaciones API y del lado del servidor con Node, proporcionando funciones útiles como enrutamiento, middlewares, etc.
- **accesscontrol**: proporciona control de acceso basado en roles y atributos.

## Configuración del Modelo de la Base de Datos

Como se indicó anteriormente, utilizaremos MongoDB como la base de datos para esta aplicación y, en particular, mongoose para el modelado de datos, avancemos y configuremos el esquema del usuario. Dirígete al archivo `server/models/userModel.js` e inserta el siguiente código:

```js
// server/models/userModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "competidor",
    enum: ["competidor", "desafiador", "empleado", "admin"],
  },
  accessToken: {
    type: String,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
```

En el archivo anterior, definimos qué campos se deben permitir almacenar en la base de datos para cada usuario y también qué tipo de valor debe tener cada campo. El campo accessToken contendrá un JWT (token web JSON), este JWT contiene información que se utilizará para identificar a los usuarios en toda la aplicación.
Cada usuario tendrá un rol específico y eso es muy importante. Para mantener la aplicación bastante simple, permitiremos solo cuatro roles como se especifica en la propiedad enum, los permisos para cada rol se definirán más adelante.
Mongoose proporciona una propiedad predeterminada que nos permite especificar cuál debería ser el valor predeterminado para un campo si no se especifica uno cuando se crea un usuario.

Con eso ordenado, configuremos una autenticación básica del usuario.
