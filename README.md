# 🏥 Sistema de Agendado de Citas Médicas - Base de Datos

Repositorio general: https://github.com/gabrielhuav/DB-Coursework-2026-2

Sistema web para el agendado y gestión de citas médicas en un entorno hospitalario.

## 🛠️ Tecnologías
- **Backend:** Java, Apache Netbeans
- **Base de Datos:** PostgreSQL
- **Frontend:** HTML, CSS (Bootstrap 5) y JavaScript vanilla (Fetch API)
- **Despliegue:** Save in cloud

## 🗣️ Levantamiento de Requerimientos (Entrevista con el Cliente)
El diseño de la base de datos se fundamentó en una entrevista previa con el cliente para comprender las necesidades operativas del hospital. Se definieron tres pilares de información clave:

1. **Usuarios del sistema:** El sistema debe ser capaz de almacenar de forma segura la identidad de los usuarios (nombre y apellidos), sus datos de contacto (email), credenciales de acceso (contraseña) y su nivel de acceso o privilegio en la plataforma.
2. **Datos de cada cita:** Para la correcta gestión hospitalaria, cada cita agendada requiere relacionar la situación o motivo de la consulta, la fecha y hora programadas, el consultorio asignado, la especialidad requerida, así como la vinculación entre el paciente, el médico tratante y la receta médica generada.
3. **Mensajería Interna:** Se requiere un módulo de comunicación que permita registrar la fecha, la hora, el usuario remitente, el usuario destinatario y el contenido del mensaje.

## 📢 Usuarios y Funcionalidades Principales
El sistema está respaldado por un modelo relacional compuesto por 7 entidades principales, diseñadas para cubrir las siguientes interacciones:

- **Pacientes:** Pueden agendar y consultar sus citas médicas.
- **Médicos:** Atienden a los pacientes basándose en su especialidad y horario asignado. Cuentan con una sesión personal para visualizar sus consultas.
- **Administrador:** Rol encargado de gestionar la plantilla de doctores, los consultorios disponibles y las especialidades del consultorio.

## 👨‍👩‍👧‍👦 Integrantes del equipo
- Flores Vargas Augusto Hazel
- Hernández Zúñiga Andrea Verónica
- Linares Medina Fernando Agustin
- Angeles Salinas Daniel Alejandro

<details>
<summary>🖼️ Capturas de la página</summary>
<br>

| | |
|---|---|
| <img loading="lazy" width="1800" src="https://github.com/user-attachments/assets/7e617b84-42e8-49f9-8907-274c34e515bd" alt="Vista principal del Sistema de Citas" /><br>*Vista principal del Sistema de Citas* | |
| <img loading="lazy" width="1190" src="https://github.com/user-attachments/assets/cfd6fdaf-692a-43a2-83fd-e357257a4117" alt="Perfil de usuario" /><br>*Perfil de usuario* | <img loading="lazy" width="1874" src="https://github.com/user-attachments/assets/c40df635-46ac-4868-8750-0b76bc2a32ce" alt="Bandeja de mensajería" /><br>*Bandeja de mensajería* |

</details>

<details>
<summary>🖼️ Capturas del proyecto (Base de Datos)</summary>
<br>

| Modelos de la Base de Datos | Código SQL |
|---|---|
| <img width="100%" alt="Modelo Entidad Relacion Extendido" src="https://github.com/user-attachments/assets/4760ff18-0f5d-414c-ae49-2f6df1392622" /><br>*Modelo Entidad-Relación Extendido* | <img width="100%" alt="Creacion de tablas 1" src="https://github.com/user-attachments/assets/0c46efe9-ed53-46b1-ab91-9c6c1b1a0faa" /><br>*Creación de tablas (Parte 1)* |
| <img width="100%" alt="Modelo Relacional" src="https://github.com/user-attachments/assets/0b64e937-01b8-4f16-be8b-e4d9c297e45f" /><br>*Modelo Relacional* | <img width="100%" alt="Creacion de tablas 2" src="https://github.com/user-attachments/assets/b3a5b72d-1bc2-4be0-a3df-f07b73199082" /><br>*Creación de tablas (Parte 2)* |

</details>

## 🔗 Link de la demo
https://sistemamedico-1gmy.onrender.com

## 👤 Usuarios de prueba:

Administrador: admin@gmail.com
Contraseña: 123321

Doctor: Chapatin@gmail.com
Contraseña: 123321

Paciente: prueba2@gmail.com
Contraseña: 123321
