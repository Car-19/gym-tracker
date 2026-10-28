import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';



interface Registro {
  fecha: Date;
  peso: number;
  repeticiones: number;
}

interface Ejercicio {
  nombre: string;
  historial: Registro[];
  pesoActual: number | null;
  repeticionesActuales: number | null;
}

@Component({
  standalone: true,
  imports: [DatePipe, FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App implements OnInit{
  // protected readonly title = signal('gym-tracker'); --> Esto estaba antes por defecto

  ngOnInit() {
  this.cargarDatos();
}

  gruposMusculares = [
    'Piernas',
    'Pecho',
    'Espalda',
    'Hombros',
    'Bíceps',
    'Tríceps',
    'Cardio',
    'Abdominales'
  ];

  
guardarRegistro(ejercicio: Ejercicio) {
  if (
    ejercicio.pesoActual === null ||
    ejercicio.repeticionesActuales === null ||
    ejercicio.pesoActual < 0 ||
    ejercicio.repeticionesActuales < 1 ||
    !this.fechaEntrenamiento
  ) {
    return;
  }

  const registro: Registro = {
    fecha: new Date(`${this.fechaEntrenamiento}T12:00:00`),
    peso: ejercicio.pesoActual,
    repeticiones: ejercicio.repeticionesActuales
  };

  ejercicio.historial.push(registro);
  this.guardarDatos();
}



anadirEjercicio() {
  const nombre = this.nuevoEjercicioNombre.trim();

  if (!nombre || !this.grupoSeleccionado) {
    return;
  }

  const grupo = this.grupoSeleccionado as keyof typeof this.ejercicios;
  const listaEjercicios = this.ejercicios[grupo];

  const yaExiste = listaEjercicios.some(
    ejercicio => ejercicio.nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (yaExiste) {
    alert('Ya existe un ejercicio con ese nombre en este grupo.');
    return;
  }

  const confirmado = confirm(
    `¿Quieres añadir "${nombre}" al grupo ${grupo}?`
  );

  if (!confirmado) {
    return;
  }

  listaEjercicios.push({
    nombre,
    historial: [],
    pesoActual: null,
    repeticionesActuales: null
  });

  this.nuevoEjercicioNombre = '';
  this.guardarDatos();
}


borrarRegistro(ejercicio: Ejercicio, indice: number) {
  const registro = ejercicio.historial[indice];

  const confirmado = confirm(
    `¿Quieres borrar este registro?\n\n` +
    `${registro.peso} kg × ${registro.repeticiones} repeticiones\n` +
    `Fecha: ${registro.fecha.toLocaleDateString('es-ES')}`
  );

  if (!confirmado) return;

  ejercicio.historial.splice(indice, 1);
  this.guardarDatos();
}

pesoEdicionTexto: string | null = '';
repeticionesEdicionTexto: string | null = '';

registroEnEdicion: Registro | null = null;
pesoEdicion: number | null = null;
repeticionesEdicion: number | null = null;
fechaEdicion = '';

iniciarEdicion(registro: Registro) {
  this.registroEnEdicion = registro;

  this.pesoEdicionTexto = String(registro.peso);
  this.repeticionesEdicionTexto = String(registro.repeticiones);

  const fecha = new Date(registro.fecha);
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  this.fechaEdicion = `${anio}-${mes}-${dia}`;
}

esEdicionValida(): boolean {
  const pesoTexto = (this.pesoEdicionTexto ?? '').trim().replace(',', '.');
  const repeticionesTexto = (this.repeticionesEdicionTexto ?? '').trim();

  return (
    pesoTexto !== '' &&
    repeticionesTexto !== '' &&
    Boolean(this.fechaEdicion) &&
    Number.isFinite(Number(pesoTexto)) &&
    Number(pesoTexto) >= 0 &&
    Number.isInteger(Number(repeticionesTexto)) &&
    Number(repeticionesTexto) >= 1
  );
}

guardarEdicionRegistro() {
  const registro = this.registroEnEdicion;

  if (!registro || !this.esEdicionValida()) {
    return;
  }

  const peso = Number(
    (this.pesoEdicionTexto ?? '').trim().replace(',', '.')
  );

  const repeticiones = Number(
    (this.repeticionesEdicionTexto ?? '').trim()
  );

  registro.peso = peso;
  registro.repeticiones = repeticiones;
  registro.fecha = new Date(`${this.fechaEdicion}T12:00:00`);

  this.guardarDatos();
  this.cancelarEdicion();
}

cancelarEdicion() {
  this.registroEnEdicion = null;
  this.pesoEdicionTexto = '';
  this.repeticionesEdicionTexto = '';
  this.fechaEdicion = '';
}



borrarEjercicio(ejercicio: Ejercicio) {
  const grupo = this.grupoSeleccionado as keyof typeof this.ejercicios;

  const confirmado = confirm(
    `¿Seguro que quieres borrar "${ejercicio.nombre}"?\n\n` +
    'También se eliminará todo su historial. Esta acción no se puede deshacer.'
  );

  if (!confirmado) return;

  this.ejercicios[grupo] = this.ejercicios[grupo].filter(
    item => item !== ejercicio
  );

  this.guardarDatos();
}


guardarDatos() {
  localStorage.setItem(
    'gym-tracker',
    JSON.stringify(this.ejercicios)
  );
}

cargarDatos() {
  const datosGuardados = localStorage.getItem('gym-tracker');

  if (datosGuardados) {
    this.ejercicios = JSON.parse(datosGuardados);

    for (const grupo of this.gruposMusculares) {
      for (const ejercicio of this.ejercicios[grupo]) {
        ejercicio.historial = ejercicio.historial.map(registro => ({
          ...registro,
          fecha: new Date(registro.fecha)
        }));
      }
    }
  }
}


  ejercicios: { [grupo: string]: Ejercicio[] } = {
  Piernas: [
    {
      nombre: 'Sentadilla',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Prensa',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Extensión de cuádriceps',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Curl femoral',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Abductores',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Glúteos',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Gemelos',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    }
  ],

  Hombros: [
    {
      nombre: 'Press militar',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Elevaciones laterales',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Pájaros',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Elevaciones frontales',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Elevación lateral a frontal',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Press Arnold',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    }
  ],

  Bíceps: [
    {
      nombre: 'Curl con barra',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Curl martillo',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Curl en banco',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Mancuerna libre',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Curl martillo inclinado',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
  ],

  Pecho: [
    {
      nombre: 'Press banca',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Press inclinado',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Aperturas',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Polea pecho inferior',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Mancuerna press banca',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Mancuerna press inclinado',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Mancuerna aperturas',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    }
  ],

  Tríceps: [
    {
      nombre: 'Barra en polea',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Extensión en polea (bolas)',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Mancuerna detrás de nuca',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    }
    
  ],

  Espalda: [
    {
      nombre: 'Jalón al pecho',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Remo',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Dominadas',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null  
    },
    {
      nombre: 'Facepull',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Peso muerto',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Máquina jalón',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Máquina remo',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Máquina trapecio',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    }
  ],

  Abdominales: [
    {
      nombre: 'Crunch',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Elevaciones de piernas',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Plancha',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Abdominales en polea',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Abdominales en banco',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Abdominales en máquina',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    }
  ],

  Cardio: [
    {
      nombre: 'Cinta',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Bicicleta',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Elíptica',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    },
    {
      nombre: 'Escaladora',
      historial: [],
      pesoActual: null,
      repeticionesActuales: null
    }
  ]
};

  fecha = new Date();
  fechaEntrenamiento = this.obtenerFechaLocal();

  obtenerFechaLocal(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
}

  grupoSeleccionado = '';
  nuevoEjercicioNombre = '';
  ejercicioProgresoSeleccionado = '';


  seleccionarGrupo(grupo: string) {
    this.grupoSeleccionado = grupo;
    this.ejercicioProgresoSeleccionado = '';
  }

  obtenerEjercicios() {
  return this.ejercicios[this.grupoSeleccionado as keyof typeof this.ejercicios];
}

contarRegistros(): number {
  return this.obtenerEjercicios().reduce(
    (total, ejercicio) => total + ejercicio.historial.length,
    0
  );
}


obtenerSesiones() {
  const sesiones: {
    fechaClave: string;
    fecha: Date;
    registros: {
      grupo: string;
      ejercicio: string;
      peso: number;
      repeticiones: number;
    }[];
  }[] = [];

  for (const grupo of this.gruposMusculares) {
    for (const ejercicio of this.ejercicios[grupo]) {
      for (const registro of ejercicio.historial) {
        const fecha = new Date(registro.fecha);

        // Construimos la fecha usando el calendario local.
        const fechaClave =
          `${fecha.getFullYear()}-` +
          `${String(fecha.getMonth() + 1).padStart(2, '0')}-` +
          `${String(fecha.getDate()).padStart(2, '0')}`;

        let sesion = sesiones.find(
          item => item.fechaClave === fechaClave
        );

        if (!sesion) {
          sesion = {
            fechaClave,
            fecha,
            registros: []
          };

          sesiones.push(sesion);
        }

        sesion.registros.push({
          grupo,
          ejercicio: ejercicio.nombre,
          peso: registro.peso,
          repeticiones: registro.repeticiones
        });
      }
    }
  }

  // Las fechas más recientes aparecen primero.
  return sesiones.sort(
    (a, b) => b.fechaClave.localeCompare(a.fechaClave)
  );
}


obtenerEjerciciosConHistorial(): Ejercicio[] {
  return this.obtenerEjercicios().filter(
    ejercicio => ejercicio.historial.length > 0
  );
}

obtenerRegistrosGrafica(): Registro[] {
  const ejercicio = this.obtenerEjercicios().find(
    item => item.nombre === this.ejercicioProgresoSeleccionado
  );

  if (!ejercicio) return [];

  return [...ejercicio.historial]
    .sort(
      (a, b) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )
    .slice(-10);
}

obtenerXGrafica(indice: number): number {
  const registros = this.obtenerRegistrosGrafica();

  if (registros.length <= 1) return 300;

  return 40 + indice * (520 / (registros.length - 1));
}

obtenerYGrafica(peso: number): number {
  const registros = this.obtenerRegistrosGrafica();

  if (registros.length === 0) return 175;

  const pesos = registros.map(registro => registro.peso);
  const minimo = Math.min(...pesos);
  const maximo = Math.max(...pesos);

  if (minimo === maximo) return 105;

  return 175 - ((peso - minimo) / (maximo - minimo)) * 140;
}

obtenerPuntosGrafica(): string {
  return this.obtenerRegistrosGrafica()
    .map((registro, indice) =>
      `${this.obtenerXGrafica(indice)},${this.obtenerYGrafica(registro.peso)}`
    )
    .join(' ');
}


}

