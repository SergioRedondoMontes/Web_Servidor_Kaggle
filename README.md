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

### User Login

Ahira configuremos el inicio de sesión del usuario, siga adelante y pegue el siguiente código en la parte inferior del archivo `server/controllers/userController.js`:

```js
// server/controllers/userController.js

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Email does not exist"));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error("Password is not correct"));
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    res.status(200).json({
      data: { email: user.email, role: user.role },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
```

El código anterior es muy similar al de registrarse. Para iniciar sesión, el usuario envía el correo electrónico y la contraseña utilizados al registrarse, la función **validatePassword** se utiliza para verificar que la contraseña sea correcta. Una vez hecho esto, podemos crear un nuevo token para ese usuario que reemplazará cualquier token emitido anteriormente. Idealmente, el usuario enviará ese token en el encabezado cuando intente acceder a cualquier ruta restringida.

Eso es todo para la autenticación, luego crearemos los tres roles previamente especificados y también definiremos los permisos para cada rol.

## Creando roles con AccessControl

En esta sección, crearemos roles específicos y definiremos permisos en cada rol para acceder a los recursos. Haremos esto en el archivo `server/roles.js`, una vez más copie y pegue el código a continuación en ese archivo y lo revisaremos después de:

```js
// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("competidor")
    .readOwn("profile")
    .updateOwn("profile")
    .deleteOwn("profile")
    .readAny("challenge");

  ac.grant("desafiador")
    .extend("competidor")
    .updateOwn("challenge")
    .deleteOwn("challenge");

  ac.grant("empleado").extend("desafiador").updateAny("challenge");

  ac.grant("admin")
    .extend("competidor")
    .extend("desafiador")
    .extend("empleado")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile")
    .deleteAny("challenge");

  return ac;
})();
```

Todos los roles y permisos se crearon usando el paquete **Accesscontrol**, proporciona algunos métodos útiles para crear roles y definir qué acciones puede realizar cada rol, el método **grant** se usa para crear un rol, mientras que métodos como **readAny**, **updateAny**, **deleteAny**, etc. ... se denominan atributos de acción porque definen qué acciones puede realizar cada rol en un recurso. El recurso, en este caso, es el perfil y los retos. Para mantener nuestra aplicación simple y al grano, definimos acciones mínimas para cada rol.

La herencia entre roles se puede lograr utilizando el método **extend**, esto permite que un rol herede todos los atributos definidos en otro rol. El paquete **Accesscontrol** proporciona una gran cantidad de funciones.
Puedes leer más sobre Accesscontrol [aquí](https://onury.io/accesscontrol/?api=ac).

## Configuración de las rutas

A continuación, crearemos rutas para las diferentes partes de nuestra aplicación. Algunas de estas rutas contienen recursos que queremos limitar solo a usuarios con roles específicos.

Pero antes de eso, configuremos la lógica de las rutas, funciones que se conectarán como middlewares en las diversas rutas.

Una vez más, pegue el siguiente código en la parte inferior del archivo `server/controllers/userController` :

```js
...

// server/controllers/userController.js

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users,
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: "User has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

...
```

Las funciones anteriores son bastante sencillas y se pueden entender fácilmente sin mucha explicación. Ahora centrémonos en crear middleware para restringir el acceso solo a los usuarios registrados y también un middleware para permitir el acceso solo a usuarios con roles específicos.

Una vez más, pegue el siguiente código en la parte inferior del archivo `server/controllers/userController.js` :

```js
// server/controllers/userController.js

...

// Add this line to the top of the file
const { roles } = require('../roles')

exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
   const permission = roles.can(req.user.role)[action](resource);
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}

exports.allowIfLoggedin = async (req, res, next) => {
 try {
  const user = res.locals.loggedInUser;
  if (!user)
   return res.status(401).json({
    error: "You need to be logged in to access this route"
   });
   req.user = user;
   next();
  } catch (error) {
   next(error);
  }
}

```

El middleware **allowIfLoggedIn** filtrará y solo otorgará acceso a los usuarios que hayan iniciado sesión, la variable **res.locals.loggedInUser** contiene los detalles del usuario que ha iniciado sesión, rellenaremos esta variable muy pronto.

El middleware **grantAccess**, por otro lado, permite que solo los usuarios con ciertos roles accedan a la ruta. Toma dos argumentos **action** y **resource**, **action** será un valor como **readAny**, **deleteAny**, etc. Esto indica qué acción puede realizar el usuario, mientras que el recurso representa qué **resource** tiene permiso para operar la acción definida, por ejemplo, el **perfil** o el **reto**. El método **roles.can (userRole) \[action](resource)** determina si el rol del usuario tiene permiso suficiente para realizar la acción especificada del recurso proporcionado. A continuación veremos exactamente cómo funciona esto.

Creemos nuestras rutas y conectemos el middleware necesario, agregue el siguiente código al archivo `server/routes/route.js` :

```js
// server/routes/route.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.getUser
);

router.get(
  "/users",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  userController.getUsers
);

router.put(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("updateAny", "profile"),
  userController.updateUser
);

router.delete(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("deleteAny", "profile"),
  userController.deleteUser
);

module.exports = router;
```

Creamos nuestras rutas y conectamos las funciones creadas como middleware para imponer ciertas restricciones en algunas de estas rutas. Si observa detenidamente el middleware **grantAccess**, puede ver que especificamos que solo queremos otorgar acceso a los roles que pueden realizar la acción especificada en el recurso proporcionado.

Por último, agreguemos el archivo del servidor base ubicado en `server/server.js` :

```js
// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./models/userModel");
const routes = require("./routes/route.js");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/rbac").then(() => {
  console.log("Connected to the Database successfully");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    const accessToken = req.headers["x-access-token"];
    const { userId, exp } = await jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: "JWT token has expired, please login to obtain a new one",
      });
    }
    res.locals.loggedInUser = await User.findById(userId);
    next();
  } else {
    next();
  }
});

app.use("/", routes);
app.listen(PORT, () => {
  console.log("Server is listening on Port:", PORT);
});
```

En el archivo anterior, hicimos algunas configuraciones más, configuramos en qué puerto debería escuchar nuestro servidor, usamos **mongoose** para conectarnos a nuestro servidor MongoDB local y también configuramos algún otro middleware necesario.

Hay un middleware importante arriba y lo veremos a continuación:

```js
...

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
   const accessToken = req.headers["x-access-token"];
   const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
   // Check if token has expired
   if (exp < Date.now().valueOf() / 1000) {
    return res.status(401).json({
     error: "JWT token has expired, please login to obtain a new one"
    });
   }
   res.locals.loggedInUser = await User.findById(userId);
   next();
  } else {
   next();
  }
});

...
```

Recuerda, el usuario envía un token cada vez que desea acceder a una ruta segura. El middleware anterior recupera un token del encabezado **x-access-token**, luego usa la clave secreta utilizada para firmar el token para verificar que el token no ha sido comprometido. Cuando se completa esa verificación, el token se analiza y se recupera la identificación del usuario, también agregamos una verificación adicional para asegurarnos de que el token no haya expirado. Cuando se hace todo eso, la ID del usuario se usa para recuperar todos los demás detalles necesarios sobre el usuario y se almacena en una variable a la que puede acceder el middleware posterior.
