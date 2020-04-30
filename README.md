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

## Autenticación del usuario

Para implementar el control de acceso basado en roles en nuestra aplicación, necesitaremos tener usuarios en nuestra aplicación que otorguaremos acceso a ciertos recursos en función de sus roles. Entonces, en esta sección, configuraremos la lógica para manejar el registro de usuarios, el inicio de sesión y todo lo que tenga que ver con la autenticación. Comencemos con el registro.

### Registro de usuario
Toda la lógica de autenticación y autorización estará dentro del archivo `server/controllers/userController.js`. Continúe y pegue el código a continuación en el archivo y lo revisaremos en detalle justo después:

```js
// server/controllers/userController.js

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "basic",
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
```

Desglosemos el fragmento de código anterior.
Tenemos dos funciones de utilidad:

**hashPassword** que toma un valor de contraseña simple y luego usa bcrypt para cambiar el valor y devolver el valor hash.
**validatePassword**, por otro lado, se usará al iniciar sesión para verificar si la contraseña es la misma que la que proporcionó el usuario al registrarse. Puedes leer más sobre bcrypt en la documentación [oficial](https://www.npmjs.com/package/bcrypt#usage).
Luego está la función de **singup**. Los valores de correo electrónico y contraseña se enviarán idealmente desde un formulario, luego el paquete **bodyParser** analizará los datos enviados a través del formulario y los adjuntará al objeto **req.body**. Los datos proporcionados se utilizan para crear un nuevo usuario. Finalmente, una vez creado el usuario, podemos usar la ID del usuario para crear un JWT, que se utilizará para identificar a los usuarios y determinar a qué recursos se les permitirá acceder.
La variable de entorno **JWT_SECRET** contiene una clave privada que se utiliza al firmar el JWT, esta clave también se utilizará al analizar el JWT para verificar que no haya sido comprometida por una parte no autorizada.
Crearemos la variable de entorno **JWT_SECRET** agregándola al archivo **.env** en el directorio del proyecto.
Puedes establecer la variable a cualquier valor de tu elección:

```js
JWT_SECRET={{YOUR_RANDOM_SECRET_VALUE}}
```
