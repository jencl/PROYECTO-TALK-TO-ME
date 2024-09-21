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

// Función para agregar cursos
document.getElementById('formCurso').addEventListener('submit', (e) => {
  e.preventDefault();

  const curso = document.getElementById('curso').value;
  const nivel = document.getElementById('nivel').value;
  const duracion = document.getElementById('duracion').value;

  if (!curso || !nivel || !duracion) {
    alert('Por favor, completa todos los campos');
    return;
  }

  // Comprobar si estamos editando un curso o agregando uno nuevo
  const cursoId = document.getElementById('formCurso').getAttribute('data-id');
  if (cursoId) {
    // Editar curso
    db.collection('cursos').doc(cursoId).update({
      curso: curso,
      nivel: nivel,
      duracion: duracion
    }).then(() => {
      alert('Curso actualizado con éxito');
      document.getElementById('formCurso').reset();
      document.getElementById('formCurso').removeAttribute('data-id');
      mostrarCursos();
    }).catch((error) => {
      console.error('Error al actualizar el curso: ', error);
    });
  } else {
    // Agregar nuevo curso
    db.collection('cursos').add({
      curso: curso,
      nivel: nivel,
      duracion: duracion
    }).then(() => {
      alert('Curso registrado con éxito');
      document.getElementById('formCurso').reset();
      mostrarCursos();
    }).catch((error) => {
      console.error('Error al registrar el curso: ', error);
    });
  }
});

// Función para mostrar los cursos en la tabla
function mostrarCursos() {
  const tablaCursos = document.getElementById('tablaCursos');
  tablaCursos.innerHTML = ''; // Limpiar tabla antes de mostrar datos

  db.collection('cursos').get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const curso = doc.data();
      const fila = `
        <tr>
          <td>${doc.id}</td>
          <td>${curso.curso}</td>
          <td>${curso.nivel}</td>
          <td>${curso.duracion}</td>
          <td><button class="btn btn-danger" onclick="eliminarCurso('${doc.id}')">Eliminar</button></td>
          <td><button class="btn btn-warning" onclick="editarCurso('${doc.id}', '${curso.curso}', '${curso.nivel}', '${curso.duracion}')">Editar</button></td>
        </tr>
      `;
      tablaCursos.innerHTML += fila;
    });
  });
}

// Función para eliminar un curso
function eliminarCurso(id) {
  db.collection('cursos').doc(id).delete().then(() => {
    alert('Curso eliminado');
    mostrarCursos();
  }).catch((error) => {
    console.error('Error al eliminar el curso: ', error);
  });
}

// Función para editar un curso
function editarCurso(id, curso, nivel, duracion) {
  // Cargar los valores actuales en el formulario
  document.getElementById('curso').value = curso;
  document.getElementById('nivel').value = nivel;
  document.getElementById('duracion').value = duracion;

  // Almacenar el ID del curso en el formulario para saber que estamos editando
  document.getElementById('formCurso').setAttribute('data-id', id);
}

// Llamar a mostrarCursos cuando se carga la página
mostrarCursos();