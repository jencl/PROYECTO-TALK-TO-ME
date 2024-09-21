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

// Función para agregar o editar lecciones
document.getElementById('formLeccion').addEventListener('submit', (e) => {
  e.preventDefault();

  const leccion = document.getElementById('leccion').value;
  const dificultad = document.getElementById('dificultad').value;
  const duracion = document.getElementById('duracion').value;

  if (!leccion || !dificultad || !duracion) {
    alert('Por favor, completa todos los campos');
    return;
  }

  // Verificar si estamos editando una lección
  const leccionId = document.getElementById('formLeccion').getAttribute('data-id');
  if (leccionId) {
    // Editar lección existente
    db.collection('lecciones').doc(leccionId).update({
      leccion: leccion,
      dificultad: dificultad,
      duracion: duracion
    }).then(() => {
      alert('Lección actualizada con éxito');
      document.getElementById('formLeccion').reset();
      document.getElementById('formLeccion').removeAttribute('data-id');
      mostrarLecciones();
    }).catch((error) => {
      console.error('Error al actualizar la lección: ', error);
    });
  } else {
    // Agregar nueva lección
    db.collection('lecciones').add({
      leccion: leccion,
      dificultad: dificultad,
      duracion: duracion
    }).then(() => {
      alert('Lección registrada con éxito');
      document.getElementById('formLeccion').reset();
      mostrarLecciones();
    }).catch((error) => {
      console.error('Error al registrar la lección: ', error);
    });
  }
});

// Función para mostrar las lecciones en la tabla
function mostrarLecciones() {
  const tablaLecciones = document.getElementById('tablaLecciones');
  tablaLecciones.innerHTML = ''; // Limpiar tabla antes de mostrar datos

  db.collection('lecciones').get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const leccion = doc.data();
      const fila = `
        <tr>
          <td>${doc.id}</td>
          <td>${leccion.leccion}</td>
          <td>${leccion.dificultad}</td>
          <td>${leccion.duracion}</td>
          <td><button class="btn btn-danger" onclick="eliminarLeccion('${doc.id}')">Eliminar</button></td>
          <td><button class="btn btn-warning" onclick="editarLeccion('${doc.id}', '${leccion.leccion}', '${leccion.dificultad}', '${leccion.duracion}')">Editar</button></td>
        </tr>
      `;
      tablaLecciones.innerHTML += fila;
    });
  });
}

// Función para eliminar una lección
function eliminarLeccion(id) {
  db.collection('lecciones').doc(id).delete().then(() => {
    alert('Lección eliminada');
    mostrarLecciones();
  }).catch((error) => {
    console.error('Error al eliminar la lección: ', error);
  });
}

// Función para editar una lección
function editarLeccion(id, leccion, dificultad, duracion) {
  // Cargar los valores actuales en el formulario
  document.getElementById('leccion').value = leccion;
  document.getElementById('dificultad').value = dificultad;
  document.getElementById('duracion').value = duracion;

  // Almacenar el ID de la lección en el formulario para saber que estamos editando
  document.getElementById('formLeccion').setAttribute('data-id', id);
}

// Llamar a mostrarLecciones cuando se carga la página
mostrarLecciones();