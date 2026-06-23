// ASAP Medical System - Vanilla JS client-side state engine

// --- Caesar Cipher (Step 3) ---
function cifradoCesar(texto) {
    if (!texto) return "";
    const codigo = 3;
    let cifrado = "";
    for (let i = 0; i < texto.length; i++) {
        let char = texto.charAt(i);
        let code = texto.charCodeAt(i);
        if (char >= 'a' && char <= 'z') {
            if (code + codigo > 122) {
                cifrado += String.fromCharCode(code + codigo - 26);
            } else {
                cifrado += String.fromCharCode(code + codigo);
            }
        } else if (char >= 'A' && char <= 'Z') {
            if (code + codigo > 90) {
                cifrado += String.fromCharCode(code + codigo - 26);
            } else {
                cifrado += String.fromCharCode(code + codigo);
            }
        } else {
            cifrado += String.fromCharCode(code + codigo);
        }
    }
    return cifrado;
}

function descifradoCesar(texto) {
    if (!texto) return "";
    const codigo = 3;
    let descifrado = "";
    for (let i = 0; i < texto.length; i++) {
        let char = texto.charAt(i);
        let code = texto.charCodeAt(i);
        if (char >= 'a' && char <= 'z') {
            if (code - codigo < 97) {
                descifrado += String.fromCharCode(code - codigo + 26);
            } else {
                descifrado += String.fromCharCode(code - codigo);
            }
        } else if (char >= 'A' && char <= 'Z') {
            if (code - codigo < 65) {
                descifrado += String.fromCharCode(code - codigo + 26);
            } else {
                descifrado += String.fromCharCode(code - codigo);
            }
        } else {
            descifrado += String.fromCharCode(code - codigo);
        }
    }
    return descifrado;
}

// --- Date & Time Utilities ---
function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function getCurrentTimeInMinutes() {
    const today = new Date();
    return today.getHours() * 60 + today.getMinutes();
}

function parseTimeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function formatMinutesToTime(totalMins) {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}:${String(m).padStart(2, '0')}`;
}

// Compare targetDate to current date.
// Returns: 1 if past date, 2 if today, 3 if future date
function compareDate(targetDateStr) {
    const todayStr = getTodayDateString();
    if (targetDateStr < todayStr) return 1;
    if (targetDateStr === todayStr) return 2;
    return 3;
}

// Checks if date2 is within 30 days of date1
function isWithin30Days(date1Str, date2Str) {
    const d1 = new Date(date1Str + 'T00:00:00');
    const d2 = new Date(date2Str + 'T00:00:00');
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
}

// --- State / LocalStorage management ---
async function initDatabase() {
    const keys = ['pacientes', 'doctores', 'citas', 'situaciones', 'especialidades', 'consultorios', 'mensajes'];
    for (const key of keys) {
        if (!localStorage.getItem(key)) {
            try {
                const res = await fetch(`data/${key}.json`);
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem(key, JSON.stringify(data));
                } else {
                    localStorage.setItem(key, JSON.stringify([]));
                }
            } catch (e) {
                console.error("Error loading mock data for " + key, e);
                localStorage.setItem(key, JSON.stringify([]));
            }
        }
    }
}

function getTable(name) {
    return JSON.parse(localStorage.getItem(name) || '[]');
}

function saveTable(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

// --- Session management ---
function getSession() {
    return JSON.parse(sessionStorage.getItem('sesion') || 'null');
}

function setSession(ses) {
    sessionStorage.setItem('sesion', JSON.stringify(ses));
}

function clearSession() {
    sessionStorage.removeItem('sesion');
}

// --- Alerts and Notification helper ---
function triggerAlert(title, icon, redirectUrl) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title,
            icon: icon,
            confirmButtonColor: '#006980'
        }).then((result) => {
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        });
        if (redirectUrl) {
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 3000);
        }
    } else {
        alert(title);
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }
}

// --- Page Route Controller ---
document.addEventListener("DOMContentLoaded", async () => {
    // Make sure db is initialized
    await initDatabase();

    const page = window.location.pathname.split("/").pop() || "index.html";
    const ses = getSession();

    // 1. Role-based Redirection Checks on entry
    if (page === "index.html" || page === "") {
        if (ses) {
            if (ses.nivel === 2 || ses.nivel === "2") {
                window.location.href = "Medico.html";
                return;
            } else if (ses.nivel === 3 || ses.nivel === "3") {
                window.location.href = "IndAdmin.html";
                return;
            }
        }
        setupIndexPage(ses);
    } else if (page === "main.html") {
        if (ses) {
            if (ses.nivel === 1 || ses.nivel === "1" || ses.nivel === 2 || ses.nivel === "2") {
                window.location.href = "editar.html";
            } else if (ses.nivel === 3 || ses.nivel === "3") {
                window.location.href = "IndAdmin.html";
            }
            return;
        }
        setupLoginPage();
    } else if (page === "agendar.html") {
        if (!ses || String(ses.nivel) !== "1") {
            alert("Inicia sesión para acceder");
            window.location.href = "index.html";
            return;
        }
        setupAgendarPage(ses);
    } else if (page === "confirmar.html") {
        const Es = sessionStorage.getItem("Especialidad");
        if (!Es) {
            window.location.href = "agendar.html";
            return;
        }
        setupConfirmarPage(ses);
    } else if (page === "modificar.html") {
        if (!ses || String(ses.nivel) !== "1") {
            alert("Inicia sesión para acceder");
            window.location.href = "index.html";
            return;
        }
        setupModificarPage(ses);
    } else if (page === "Medico.html") {
        if (!ses || String(ses.nivel) !== "2") {
            window.location.href = "index.html";
            return;
        }
        setupMedicoPage(ses);
    } else if (page === "Receta.html") {
        if (!ses || String(ses.nivel) !== "2") {
            window.location.href = "index.html";
            return;
        }
        setupRecetaPage();
    } else if (page === "chat.html") {
        if (!ses) {
            window.location.href = "index.html";
            return;
        }
        setupChatPage(ses);
    } else if (page === "editar.html") {
        if (!ses) {
            window.location.href = "index.html";
            return;
        }
        setupEditarPage(ses);
    } else if (page === "IndAdmin.html") {
        if (!ses || String(ses.nivel) !== "3") {
            alert("Ocurrió un error");
            window.location.href = "index.html";
            return;
        }
        setupAdminPage();
    } else if (page === "registrar2.html") {
        if (!ses || String(ses.nivel) !== "3") {
            alert("Ocurrió un error");
            window.location.href = "index.html";
            return;
        }
        setupRegistrarDoctorPage();
    } else if (page === "Situaciones.html") {
        if (!ses || String(ses.nivel) !== "3") {
            alert("Ocurrió un error");
            window.location.href = "index.html";
            return;
        }
        setupSituacionesPage();
    } else if (page === "Especialidad.html") {
        if (!ses || String(ses.nivel) !== "3") {
            alert("Ocurrió un error");
            window.location.href = "index.html";
            return;
        }
        setupEspecialidadesPage();
    } else if (page === "Consultorios.html") {
        if (!ses || String(ses.nivel) !== "3") {
            alert("Ocurrió un error");
            window.location.href = "index.html";
            return;
        }
        setupConsultoriosPage();
    }
});

// --- Page Setup Logic ---

// 1. Index Page
function setupIndexPage(ses) {
    const citaContainer = document.querySelector(".cita");
    if (!citaContainer) return;

    if (!ses) {
        citaContainer.innerHTML = `
            <h2 style="color:#000000">No hay cita próxima</h2>
            <h3 style="color:#000000">(Inicia sesión para ver tu próxima cita)</h3>
        `;
        return;
    }

    // Patient next appointment selection logic
    const email = ses.usuarioSesion;
    const today = getTodayDateString();
    const nowMin = getCurrentTimeInMinutes();

    const citas = getTable("citas");
    // filter active appointments:
    // date > today OR (date == today AND Hora >= nowMin)
    let activeCitas = citas.filter(c => {
        if (c.paciente !== email) return false;
        if (c.fecha > today) return true;
        if (c.fecha === today && c.Hora >= nowMin) return true;
        return false;
    });

    // Sort by date then by hour ascending
    activeCitas.sort((a, b) => {
        if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
        return a.Hora - b.Hora;
    });

    if (activeCitas.length > 0) {
        const nextCita = activeCitas[0];
        const timeStr = formatMinutesToTime(nextCita.Hora);
        citaContainer.innerHTML = `
            <pre><h2 align="left" style="color:#000000">Cita Próxima</h2>  <h3 style="color:#000000">Fecha</h3><input type="text" value="${nextCita.fecha}" disabled><br><h3 style="color:#000000">Hora</h3><input type="text" value="${timeStr}" disabled><br><h3 style="color:#000000">Situación</h3><input type="text" value="${nextCita.Situacion}" disabled></pre>
        `;
    } else {
        citaContainer.innerHTML = `
            <h2 style="color:#000000">No hay cita próxima</h2>
        `;
    }
}

// 2. Login / Register Page (main.html)
function setupLoginPage() {
    // Dynamic toggling between sign-up and sign-in is handled by local static Sesion.js
    const signUpForm = document.querySelector(".sign-up-container form");
    const signInForm = document.querySelector(".sign-in-container form");

    if (signUpForm) {
        signUpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = signUpForm.querySelector("input[name='name']").value.trim();
            const apeInput = signUpForm.querySelector("input[name='ape']").value.trim();
            const emailInput = signUpForm.querySelector("input[name='email']").value.trim().toLowerCase();
            const passwordInput = signUpForm.querySelector("input[name='password']").value.trim();

            const pacientes = getTable("pacientes");
            const userExists = pacientes.some(u => u.email === emailInput);

            if (userExists) {
                triggerAlert("Este correo ya ha sido registrado", "warning", "main.html");
                return;
            }

            // Create patient
            const newPatient = {
                nombre: cifradoCesar(nameInput),
                apellidos: cifradoCesar(apeInput),
                email: emailInput,
                contra: cifradoCesar(passwordInput),
                nivel: 1
            };

            pacientes.push(newPatient);
            saveTable("pacientes", pacientes);

            console.log("SMTP: Enviando correo de bienvenida a " + emailInput);
            triggerAlert("Cuenta creada", "success", "main.html");
        });
    }

    if (signInForm) {
        signInForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = signInForm.querySelector("input[name='email']").value.trim().toLowerCase();
            const passwordInput = signInForm.querySelector("input[name='password']").value.trim();
            const cipheredPass = cifradoCesar(passwordInput);

            const pacientes = getTable("pacientes");
            const user = pacientes.find(u => u.email === emailInput && u.contra === cipheredPass);

            if (user) {
                const sessionObj = {
                    nivel: user.nivel,
                    usuarioSesion: user.email
                };
                setSession(sessionObj);

                let nextUrl = "index.html";
                let msg = "Sesión Iniciada";
                if (String(user.nivel) === "2") {
                    nextUrl = "Medico.html";
                    msg = "Sesión Iniciada como médico";
                } else if (String(user.nivel) === "3") {
                    nextUrl = "IndAdmin.html";
                    msg = "Sesión Iniciada como administrador";
                }

                triggerAlert(msg, "success", nextUrl);
            } else {
                triggerAlert("Correo y/o Contraseña incorrectos", "error", "main.html");
            }
        });
    }
}

// 3. Agendar Page
function setupAgendarPage(ses) {
    const form = document.querySelector(".controlador");
    if (!form) return;

    // Load patient profile data
    const pacientes = getTable("pacientes");
    const patientObj = pacientes.find(u => u.email === ses.usuarioSesion);
    if (patientObj) {
        const nameInput = form.querySelector("input[name='nombre']");
        const apeInput = form.querySelector("input[name='Ape']");
        if (nameInput) nameInput.value = descifradoCesar(patientObj.nombre);
        if (apeInput) apeInput.value = descifradoCesar(patientObj.apellidos);
    }

    // Limit check: <= 3 active appointments
    const citas = getTable("citas");
    const today = getTodayDateString();
    const nowMin = getCurrentTimeInMinutes();
    const activeCitasCount = citas.filter(c => {
        if (c.paciente !== ses.usuarioSesion) return false;
        if (c.fecha > today) return true;
        if (c.fecha === today && c.Hora >= nowMin) return true;
        return false;
    }).length;

    if (activeCitasCount >= 3) {
        alert("Límite de citas alcanzado, espera que pasen algunas de tus citas vigentes para agendar más citas");
        window.location.href = "index.html";
        return;
    }

    // Populate situations dropdown
    const selectSit = form.querySelector("select[name='Sit']");
    if (selectSit) {
        const situaciones = getTable("situaciones");
        selectSit.innerHTML = situaciones.map(s => `<option value="${s.nombre}">${s.nombre}</option>`).join("");
    }

    // Submit handler
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const sitName = selectSit.value;
        const diaValue = form.querySelector("input[name='Dia']").value;

        // Date validation
        const comp = compareDate(diaValue);
        if (comp === 1) { // past
            triggerAlert("No puedes seleccionar días pasados", "warning", "agendar.html");
            return;
        }

        const todayStr = getTodayDateString();
        if (!isWithin30Days(todayStr, diaValue)) {
            triggerAlert("Solo puedes agendar citas para los próximos 30 días", "warning", "agendar.html");
            return;
        }

        // Get situation details to find specialty
        const situaciones = getTable("situaciones");
        const sitObj = situaciones.find(s => s.nombre === sitName);
        if (!sitObj) {
            triggerAlert("Ocurrió un error", "error", "agendar.html");
            return;
        }

        let aum = 0;
        if (comp === 3) aum = 1; // future

        sessionStorage.setItem("Especialidad", sitObj.especialidad);
        sessionStorage.setItem("Dia", diaValue);
        sessionStorage.setItem("Situa", sitName);
        sessionStorage.setItem("aum", String(aum));

        window.location.href = "confirmar.html";
    });
}

// 4. Confirmar Page
function setupConfirmarPage(ses) {
    const form = document.querySelector(".controlador");
    if (!form) return;

    const Es = sessionStorage.getItem("Especialidad");
    const Fe = sessionStorage.getItem("Dia");
    const aum = Number(sessionStorage.getItem("aum") || "0");
    const SitName = sessionStorage.getItem("Situa");

    const selectHora = form.querySelector("select[name='Hora']");
    if (!selectHora) return;

    // Core Scheduling Logic
    const doctores = getTable("doctores");
    const citas = getTable("citas");
    const situaciones = getTable("situaciones");

    // Filter doctores with the correct specialty
    const specDocs = doctores.filter(d => d.especialidad === Es);
    if (specDocs.length === 0) {
        alert("Ocurrió un error, es posible que no haya citas disponibles para este día, intenta seleccionar otro1");
        window.location.href = "agendar.html";
        return;
    }

    // Find the max hour end (maxH) among all doctors of this specialty
    let maxH = 0;
    specDocs.forEach(d => {
        if (d.horF > maxH) maxH = d.horF;
    });

    // Find min hour start (minH) among doctors of this specialty
    let minH = 24 * 60;
    specDocs.forEach(d => {
        if (d.horI < minH) minH = d.horI;
    });

    // Start scanning time slots.
    // Ho is start minutes.
    let Ho = getCurrentTimeInMinutes() + 30;
    // Align to 30 min intervals
    while (Ho % 30 !== 0) {
        Ho++;
    }

    if (aum === 1 || Ho < minH) {
        Ho = minH;
    }

    let availableTimes = [];

    while (Ho < maxH) {
        // Find if there is any doctor of this specialty available at this time
        let anyDocAvailable = false;
        for (const doc of specDocs) {
            // Checks:
            // 1. Doctor is working during this slot (horI <= Ho and horF > Ho)
            if (doc.horI <= Ho && doc.horF > Ho) {
                // 2. Doctor has no overlapping appointment on date Fe at time Ho
                const overlap = citas.some(c => c.doctor === doc.email && c.fecha === Fe && c.Hora === Ho);
                if (!overlap) {
                    anyDocAvailable = true;
                    break;
                }
            }
        }

        if (anyDocAvailable) {
            availableTimes.push(Ho);
        }
        Ho += 30;
    }

    if (availableTimes.length === 0) {
        alert("Ocurrió un error, es posible que no haya citas disponibles para este día, intenta seleccionar otro1");
        window.location.href = "agendar.html";
        return;
    }

    selectHora.innerHTML = availableTimes.map(t => {
        const timeStr = formatMinutesToTime(t);
        return `<option value="${t}">${timeStr}</option>`;
    }).join("");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedMins = Number(selectHora.value);

        // Find which doctor to assign
        let assignedDoc = null;
        for (const doc of specDocs) {
            if (doc.horI <= selectedMins && doc.horF > selectedMins) {
                const overlap = citas.some(c => c.doctor === doc.email && c.fecha === Fe && c.Hora === selectedMins);
                if (!overlap) {
                    assignedDoc = doc;
                    break;
                }
            }
        }

        if (!assignedDoc) {
            triggerAlert("Ocurrió un error, prueba intentar de nuevo", "error", "index.html");
            return;
        }

        // Get situation duration
        const sitObj = situaciones.find(s => s.nombre === SitName);
        const duration = sitObj ? sitObj.duracion : 30;
        const Hof = selectedMins + duration;

        const newCita = {
            paciente: ses.usuarioSesion,
            doctor: assignedDoc.email,
            Situacion: SitName,
            Hora: selectedMins,
            fecha: Fe,
            consultorio: assignedDoc.consultorio,
            Especialidad: Es,
            HoraF: Hof,
            receta: "El doctor no ha generado una receta aun"
        };

        citas.push(newCita);
        saveTable("citas", citas);

        // Clean temp session variables
        sessionStorage.removeItem("Especialidad");
        sessionStorage.removeItem("Dia");
        sessionStorage.removeItem("Situa");
        sessionStorage.removeItem("aum");

        // Mock emails to console
        const pacientes = getTable("pacientes");
        const docUserObj = pacientes.find(p => p.email === assignedDoc.email);
        const patUserObj = pacientes.find(p => p.email === ses.usuarioSesion);

        const docName = docUserObj ? descifradoCesar(docUserObj.nombre) : "Doctor";
        const patName = patUserObj ? descifradoCesar(patUserObj.nombre) : "Paciente";

        console.log(`SMTP: Correo a Paciente (${ses.usuarioSesion}): Cita Agendada a las ${formatMinutesToTime(selectedMins)} horas con el Dr. ${docName}`);
        console.log(`SMTP: Correo a Doctor (${assignedDoc.email}): Nueva Cita a las ${formatMinutesToTime(selectedMins)} horas con el paciente ${patName}`);

        triggerAlert("Cita Agendada", "success", "modificar.html");
    });
}

// 5. Modificar Page (Patient Scheduled Appointments view)
function setupModificarPage(ses) {
    const carouselContainer = document.querySelector(".carousel");
    if (!carouselContainer) return;

    const citas = getTable("citas");
    const today = getTodayDateString();
    const nowMin = getCurrentTimeInMinutes();

    // Filter active scheduled appointments for patient
    let patientCitas = citas.filter(c => {
        if (c.paciente !== ses.usuarioSesion) return false;
        // active: date > today OR (date == today AND Hora >= nowMin)
        if (c.fecha > today) return true;
        if (c.fecha === today && c.Hora >= nowMin) return true;
        return false;
    });

    if (patientCitas.length === 0) {
        carouselContainer.innerHTML = `<h5 style="color:#000000; text-align:center;">No tienes citas agendadas programadas</h5>`;
        return;
    }

    const patients = getTable("pacientes");

    let slidesHTML = "";
    patientCitas.forEach(cita => {
        const timeStr = formatMinutesToTime(cita.Hora);
        const docUserObj = patients.find(u => u.email === cita.doctor);
        const docName = docUserObj ? descifradoCesar(docUserObj.nombre) + " " + descifradoCesar(docUserObj.apellidos) : "Doctor";

        slidesHTML += `
            <div class="carousel-item">
                <div class="container2">
                    <h5>Doctor que lo atenderá:<input class="dato" type="text" value="${docName}" style="width: 40%;" disabled></h5>
                    <h5>Situación de la cita:<input class="dato" type="text" value="${cita.Situacion}" style="width: 40%;" disabled></h5>
                    <h5>Fecha:<input class="dato" type="text" value="   ${cita.fecha}" style="width: 25%;" disabled> Hora:<input class="dato" type="text" value="   ${timeStr}" style="width: 13%;" disabled> </h5>
                    <h5>Consultorio:<input class="dato" type="text" value="${cita.consultorio}" style="width: 40%;" disabled></h5>
                    <h5>Receta:</h5>
                    <textarea rows="3" cols="50" style="height: 72px; width: 397px;" disabled>${cita.receta}</textarea>
                    <br>
                    <button style="width: 90%; background-color: #006A55;" onclick="openChatWith('${cita.doctor}')">Ver mensajes con el doctor</button>
                    <br>
                    <br>
                </div>
            </div>
        `;
    });

    carouselContainer.innerHTML = slidesHTML;

    // Initialize Materialize Carousel
    if (typeof M !== 'undefined') {
        M.Carousel.init(carouselContainer, {
            duration: 150,
            dist: -80,
            shift: 5,
            padding: 5,
            numVisible: 3,
            indicators: true,
            noWrap: false
        });
    }
}

// 6. Doctor Dashboard Page (Medico.html)
function setupMedicoPage(ses) {
    const carouselContainer = document.querySelector(".carousel");
    if (!carouselContainer) return;

    const citas = getTable("citas");
    const today = getTodayDateString();

    // Filter appointments for Doctor Augusto or Doctor Daniel for today or future dates
    let doctorCitas = citas.filter(c => {
        return c.doctor === ses.usuarioSesion && c.fecha >= today;
    });

    if (doctorCitas.length === 0) {
        carouselContainer.innerHTML = `<h5 style="color:#000000; text-align:center;">No tienes citas programadas</h5>`;
        return;
    }

    const patients = getTable("pacientes");

    let slidesHTML = "";
    doctorCitas.forEach(cita => {
        const timeStr = formatMinutesToTime(cita.Hora);
        const patUserObj = patients.find(u => u.email === cita.paciente);
        const patName = patUserObj ? descifradoCesar(patUserObj.nombre) + " " + descifradoCesar(patUserObj.apellidos) : "Paciente";

        slidesHTML += `
            <div class="carousel-item">
                <div class="container2">
                    <h5>Nombre del Paciente:<input class="dato" type="text" value="${patName}" style="width: 40%;" disabled></h5>
                    <h5>Situación de la cita:<input class="dato" type="text" value="${cita.Situacion}" style="width: 40%;" disabled></h5>
                    <h5>Fecha:<input class="dato" type="text" value="   ${cita.fecha}" style="width: 25%;" disabled> Hora:<input class="dato" type="text" value="   ${timeStr}" style="width: 13%;" disabled> </h5>
                    <h5>Receta:</h5>
                    <textarea rows="3" cols="50" style="height: 72px; width: 397px;" disabled>${cita.receta}</textarea>
                    <br>
                    <button style="width: 90%; background-color: #006A55;" onclick="editReceta('${cita.paciente}', '${cita.Situacion}', '${cita.fecha}', ${cita.Hora})">Editar Receta</button>
                    <br>
                    <br>
                    <button style="width: 90%; background-color: #006A55;" onclick="openChatWith('${cita.paciente}')">Ver mensajes con el paciente</button>
                    <br>
                    <br>
                </div>
            </div>
        `;
    });

    carouselContainer.innerHTML = slidesHTML;

    // Initialize Materialize Carousel
    if (typeof M !== 'undefined') {
        M.Carousel.init(carouselContainer, {
            duration: 150,
            dist: -80,
            shift: 5,
            padding: 5,
            numVisible: 3,
            indicators: true,
            noWrap: false
        });
    }
}

// Helper handlers for buttons in carousel
window.openChatWith = function(email) {
    sessionStorage.setItem("Doc", email);
    window.location.href = "chat.html";
};

window.editReceta = function(pac, sit, fe, ho) {
    // Save appointment identifier details in sessionStorage to write recipe
    sessionStorage.setItem("receta_pac", pac);
    sessionStorage.setItem("receta_sit", sit);
    sessionStorage.setItem("receta_fe", fe);
    sessionStorage.setItem("receta_ho", ho);
    window.location.href = "Receta.html";
};

// 7. Receta Edit Page
function setupRecetaPage() {
    const form = document.querySelector(".controlador");
    if (!form) return;

    const pac = sessionStorage.getItem("receta_pac");
    const sit = sessionStorage.getItem("receta_sit");
    const fe = sessionStorage.getItem("receta_fe");
    const ho = Number(sessionStorage.getItem("receta_ho"));

    if (!pac) {
        window.location.href = "Medico.html";
        return;
    }

    const textarea = form.querySelector("textarea[name='receta']");

    // Preload recipe if it exists
    const citas = getTable("citas");
    const appointmentIndex = citas.findIndex(c => c.paciente === pac && c.Situacion === sit && c.fecha === fe && c.Hora === ho);
    if (appointmentIndex !== -1 && citas[appointmentIndex].receta && citas[appointmentIndex].receta !== "El doctor no ha generado una receta aun") {
        textarea.value = citas[appointmentIndex].receta;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const textVal = textarea.value.trim();

        if (appointmentIndex !== -1) {
            citas[appointmentIndex].receta = textVal;
            saveTable("citas", citas);
        }

        // Clean temp session
        sessionStorage.removeItem("receta_pac");
        sessionStorage.removeItem("receta_sit");
        sessionStorage.removeItem("receta_fe");
        sessionStorage.removeItem("receta_ho");

        triggerAlert("Receta Guardada", "success", "Medico.html");
    });
}

// 8. Chat Page
function setupChatPage(ses) {
    const form = document.querySelector("form");
    const table = document.querySelector(".chat-table");
    const chatTitle = document.querySelector(".titulo");

    const UD = ses.usuarioSesion;
    const ED = sessionStorage.getItem("Doc");

    if (!ED) {
        window.location.href = "index.html";
        return;
    }

    const patients = getTable("pacientes");
    const chatPartnerObj = patients.find(u => u.email === ED);
    if (chatPartnerObj && chatTitle) {
        const pName = descifradoCesar(chatPartnerObj.nombre) + " " + descifradoCesar(chatPartnerObj.apellidos);
        chatTitle.textContent = `Mensajes con ${pName}`;
    }

    // Load and render messages
    function renderMessages() {
        const mensajes = getTable("mensajes");
        // filter messages between UD and ED
        const thread = mensajes.filter(m => (m.remitente === UD && m.destinatario === ED) || (m.remitente === ED && m.destinatario === UD));
        
        let rows = "";
        thread.forEach(msg => {
            let senderName = "Tú";
            if (msg.remitente === ED) {
                senderName = chatPartnerObj ? descifradoCesar(chatPartnerObj.nombre) : "Médico/Paciente";
            }
            const timeStr = formatMinutesToTime(msg.hora);
            rows += `
                <tr class="message"><td class="sender"><p align="left" style="color: #fff; margin: 5px 0;">${senderName}</p></td></tr>
                <tr class="message"><td class="content"><p align="left" style="color: #ECECEE; margin: 5px 0;">${msg.mensaje}</p></td></tr>
                <tr class="message"><td class="timestamp"><p align="right" style="color: #ffeba7; font-size: 0.8em; margin: 5px 0;">${msg.fecha}    ${timeStr}</p></td></tr>
            `;
        });
        table.innerHTML = rows;
    }

    renderMessages();

    // Auto focus and place cursor at end
    const input = document.getElementById("mensaje");
    if (input) {
        input.focus();
    }

    // Submit message handler
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const textVal = input.value.trim();
            if (!textVal) return;

            const mensajes = getTable("mensajes");
            const newMsg = {
                remitente: UD,
                destinatario: ED,
                fecha: getTodayDateString(),
                hora: getCurrentTimeInMinutes(),
                mensaje: textVal
            };

            mensajes.push(newMsg);
            saveTable("mensajes", mensajes);

            input.value = "";
            renderMessages();
            input.focus();
        });
    }

    // Auto-refresh chat from localStorage every 3 seconds instead of doing location.reload!
    setInterval(() => {
        renderMessages();
    }, 3000);
}

// 9. Editar / Modificar Cuenta Page
function setupEditarPage(ses) {
    const form = document.querySelector(".controlador");
    if (!form) return;

    const pacientes = getTable("pacientes");
    const userObj = pacientes.find(u => u.email === ses.usuarioSesion);

    if (userObj) {
        const nameInput = form.querySelector("input[name='N']");
        const apeInput = form.querySelector("input[name='A']");
        const passInput = form.querySelector("input[name='C']");

        if (nameInput) nameInput.value = descifradoCesar(userObj.nombre);
        if (apeInput) apeInput.value = descifradoCesar(userObj.apellidos);
        if (passInput) passInput.value = descifradoCesar(userObj.contra);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const action = e.submitter ? e.submitter.value : "Editar";

        if (action === "Cerrar Sesion") {
            clearSession();
            triggerAlert("Sesión cerrada correctamente", "success", "index.html");
            return;
        }

        // Edit handler
        const nameVal = form.querySelector("input[name='N']").value.trim();
        const apeVal = form.querySelector("input[name='A']").value.trim();
        const passVal = form.querySelector("input[name='C']").value.trim();

        if (userObj) {
            userObj.nombre = cifradoCesar(nameVal);
            userObj.apellidos = cifradoCesar(apeVal);
            userObj.contra = cifradoCesar(passVal);
            saveTable("pacientes", pacientes);
            triggerAlert("Información de la cuenta editada correctamente", "success", "editar.html");
        }
    });
}

// 10. Admin Dashboard Page (IndAdmin.html)
function setupAdminPage() {
    const tableBody = document.querySelector("table tbody");
    if (!tableBody) return;

    function renderDoctors() {
        const doctores = getTable("doctores");
        const pacientes = getTable("pacientes");
        const citas = getTable("citas");
        const today = getTodayDateString();
        const nowMin = getCurrentTimeInMinutes();

        let rows = "";
        doctores.forEach(doc => {
            const userObj = pacientes.find(p => p.email === doc.email);
            const docName = userObj ? descifradoCesar(userObj.nombre) + " " + descifradoCesar(userObj.apellidos) : "Doctor";

            const timeStartStr = formatMinutesToTime(doc.horI);
            const timeEndStr = formatMinutesToTime(doc.horF);

            // Citas vigentes: date > today OR (date == today AND Hora >= nowMin)
            const citasVigentes = citas.filter(c => {
                if (c.doctor !== doc.email) return false;
                if (c.fecha > today) return true;
                if (c.fecha === today && c.Hora >= nowMin) return true;
                return false;
            }).length;

            // Total Citas
            const totalCitas = citas.filter(c => c.doctor === doc.email).length;

            rows += `
                <tr>
                    <th>${docName}</th>
                    <th>${doc.especialidad}</th>
                    <th>${timeStartStr}</th>
                    <th>${timeEndStr}</th>
                    <th>${doc.consultorio}</th>
                    <th>${citasVigentes}</th>
                    <th>${totalCitas}</th>
                    <th><button onclick="eliminarDoctor('${doc.email}')" style="background-color:#d9534f; border-color:#d43f3a; padding:6px 12px; font-size:11px;">Eliminar</button></th>
                </tr>
            `;
        });
        tableBody.innerHTML = rows;
    }

    renderDoctors();

    window.eliminarDoctor = function(email) {
        if (confirm("¿Estás seguro de eliminar a este doctor?")) {
            let doctores = getTable("doctores");
            let pacientes = getTable("pacientes");

            doctores = doctores.filter(d => d.email !== email);
            pacientes = pacientes.filter(p => p.email !== email);

            saveTable("doctores", doctores);
            saveTable("pacientes", pacientes);

            renderDoctors();
        }
    };
}

// 11. Admin Form - Add Doctor (registrar2.html)
function setupRegistrarDoctorPage() {
    const form = document.querySelector(".controlador");
    if (!form) return;

    const especialidades = getTable("especialidades");
    const consultorios = getTable("consultorios");

    if (especialidades.length === 0 || consultorios.length === 0) {
        alert("Debes de agregar al menos una especialidad y un consultorio antes de agregar a un doctor");
        window.location.href = "IndAdmin.html";
        return;
    }

    // Populate selects
    const selectEsp = form.querySelector("select[name='Esp']");
    const selectCons = form.querySelector("select[name='Cons']");

    if (selectEsp) {
        selectEsp.innerHTML = especialidades.map(e => `<option value="${e.nombre}">${e.nombre}</option>`).join("");
    }
    if (selectCons) {
        selectCons.innerHTML = consultorios.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join("");
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameVal = form.querySelector("input[name='name']").value.trim();
        const apeVal = form.querySelector("input[name='ape']").value.trim();
        const emailVal = form.querySelector("input[name='email']").value.trim().toLowerCase();
        const passVal = form.querySelector("input[name='password']").value.trim();
        const horIVal = form.querySelector("input[name='horI']").value;
        const horFVal = form.querySelector("input[name='horF']").value;
        const espVal = selectEsp.value;
        const consVal = selectCons.value;

        const hoI = parseTimeToMinutes(horIVal);
        const hoF = parseTimeToMinutes(horFVal);

        if (hoF <= hoI) {
            triggerAlert("La hora de término no puede ser menor o igual a la hora de inicio", "warning", "registrar2.html");
            return;
        }

        // Consultorio occupancy check
        // Check if there are other doctors occupying this consultorio at overlapping times.
        const doctores = getTable("doctores");
        const conflict = doctores.find(d => {
            if (d.consultorio !== consVal) return false;
            // Overlap: horI < d.horF and horF > d.horI
            return hoI < d.horF && hoF > d.horI;
        });

        if (conflict) {
            const conflictTimeStart = formatMinutesToTime(conflict.horI);
            const conflictTimeEnd = formatMinutesToTime(conflict.horF);
            triggerAlert(`Hora no disponible, este consultorio solamente está disponible antes de las ${conflictTimeStart} y después de las ${conflictTimeEnd}`, "warning", "registrar2.html");
            return;
        }

        const pacientes = getTable("pacientes");
        const docExists = pacientes.some(u => u.email === emailVal);

        if (docExists) {
            triggerAlert("Este correo ya ha sido registrado", "warning", "registrar2.html");
            return;
        }

        // Add to users
        const newDocUser = {
            nombre: cifradoCesar(nameVal),
            apellidos: cifradoCesar(apeVal),
            email: emailVal,
            contra: cifradoCesar(passVal),
            nivel: 2
        };
        pacientes.push(newDocUser);
        saveTable("pacientes", pacientes);

        // Add to doctores
        const newDoc = {
            email: emailVal,
            especialidad: espVal,
            horI: hoI,
            horF: hoF,
            consultorio: consVal,
            FeProxC: "",
            HoProxC: ""
        };
        doctores.push(newDoc);
        saveTable("doctores", doctores);

        console.log(`SMTP: Correo a Doctor (${emailVal}): Este correo ha sido registrado en ASAP como un doctor`);
        window.location.href = "IndAdmin.html";
    });
}

// 12. Admin Form - Add Situation (Situaciones.html)
function setupSituacionesPage() {
    const form = document.querySelector(".controlador");
    if (!form) return;

    const especialidades = getTable("especialidades");
    if (especialidades.length === 0) {
        alert("Debes de agregar una especialidad antes de agregar a una situación");
        window.location.href = "IndAdmin.html";
        return;
    }

    const selectEsp = form.querySelector("select[name='EspC']");
    if (selectEsp) {
        selectEsp.innerHTML = especialidades.map(e => `<option value="${e.nombre}">${e.nombre}</option>`).join("");
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const sitName = form.querySelector("input[name='NSit']").value.trim();
        const duration = Number(form.querySelector("input[name='Dur']").value);
        const espVal = selectEsp.value;

        const situaciones = getTable("situaciones");
        if (situaciones.some(s => s.nombre.toLowerCase() === sitName.toLowerCase())) {
            triggerAlert("Situación ya registrada", "warning", "Situaciones.html");
            return;
        }

        situaciones.push({
            nombre: sitName,
            duracion: duration,
            especialidad: espVal
        });
        saveTable("situaciones", situaciones);

        window.location.href = "IndAdmin.html";
    });
}

// 13. Admin Form - Add Specialty (Especialidad.html)
function setupEspecialidadesPage() {
    const form = document.querySelector(".controlador");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameVal = form.querySelector("input[name='NEs']").value.trim();

        const especialidades = getTable("especialidades");
        if (especialidades.some(e => e.nombre.toLowerCase() === nameVal.toLowerCase())) {
            triggerAlert("Especialidad ya registrada", "warning", "Especialidad.html");
            return;
        }

        especialidades.push({ nombre: nameVal });
        saveTable("especialidades", especialidades);

        window.location.href = "IndAdmin.html";
    });
}

// 14. Admin Form - Add Consultorio (Consultorios.html)
function setupConsultoriosPage() {
    const form = document.querySelector(".controlador");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameVal = form.querySelector("input[name='NEs']").value.trim(); // name is NEs in form HTML

        const consultorios = getTable("consultorios");
        if (consultorios.some(c => c.nombre.toLowerCase() === nameVal.toLowerCase())) {
            triggerAlert("Consultorio ya registrado", "warning", "Consultorios.html");
            return;
        }

        consultorios.push({ nombre: nameVal });
        saveTable("consultorios", consultorios);

        window.location.href = "IndAdmin.html";
    });
}
