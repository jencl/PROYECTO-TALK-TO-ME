const firebaseConfig = {
apiKey: "AIzaSyAjBghlQuGQjedJqrK4Nn1LWj_3Bt0bN8Y",
    authDomain: "talk-to-me-199e1.firebaseapp.com",
    projectId: "talk-to-me-199e1",
    storageBucket: "talk-to-me-199e1.appspot.com",
    messagingSenderId: "1041923849412",
    appId: "1:1041923849412:web:cf75e2488f5bf62fbd9d91",
    measurementId: "G-FQR4K3FHZR"
};
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para agregar usuarios
document.getElementById('formUsuario').addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  if (!nombre || !correo || !contrasena) {
    alert('Por favor, completa todos los campos');
    return;
  }

  // Comprobar si estamos editando un usuario o agregando uno nuevo
  const usuarioId = document.getElementById('formUsuario').getAttribute('data-id');
  if (usuarioId) {
    // Editar usuario
    db.collection('usuarios').doc(usuarioId).update({
      nombre: nombre,
      correo: correo,
      contrasena: contrasena
    }).then(() => {
      alert('Usuario actualizado con éxito');
      document.getElementById('formUsuario').reset();
      document.getElementById('formUsuario').removeAttribute('data-id');
      mostrarUsuarios();
    }).catch((error) => {
      console.error('Error al actualizar el usuario: ', error);
    });
  } else {
    // Agregar nuevo usuario
    db.collection('usuarios').add({
      nombre: nombre,
      correo: correo,
      contrasena: contrasena
    }).then(() => {
      alert('Usuario registrado con éxito');
      document.getElementById('formUsuario').reset();
      mostrarUsuarios();
    }).catch((error) => {
      console.error('Error al registrar el usuario: ', error);
    });
  }
});

// Función para mostrar los usuarios en la tabla
function mostrarUsuarios() {
  const tablaUsuarios = document.getElementById('tablaUsuarios');
  tablaUsuarios.innerHTML = ''; // Limpiar tabla antes de mostrar datos

  db.collection('usuarios').get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const usuario = doc.data();
      const fila = `
        <tr>
          <td>${doc.id}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.correo}</td>
          <td><button class="btn btn-danger" onclick="eliminarUsuario('${doc.id}')">Eliminar</button></td>
          <td><button class="btn btn-warning" onclick="editarUsuario('${doc.id}', '${usuario.nombre}', '${usuario.correo}', '${usuario.contrasena}')">Editar</button></td>
        </tr>
      `;
      tablaUsuarios.innerHTML += fila;
    });
  });
}

// Función para eliminar un usuario
function eliminarUsuario(id) {
  db.collection('usuarios').doc(id).delete().then(() => {
    alert('Usuario eliminado');
    mostrarUsuarios();
  }).catch((error) => {
    console.error('Error al eliminar el usuario: ', error);
  });
}

// Función para editar un usuario
function editarUsuario(id, nombre, correo, contrasena) {
  // Cargar los valores actuales en el formulario
  document.getElementById('nombre').value = nombre;
  document.getElementById('correo').value = correo;
  document.getElementById('contrasena').value = contrasena;

  // Almacenar el ID del usuario en el formulario para saber que estamos editando
  document.getElementById('formUsuario').setAttribute('data-id', id);
}

// Llamar a mostrarUsuarios cuando se carga la página
mostrarUsuarios();