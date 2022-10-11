/** CONTAINERS */
let Clients = document.getElementById("render_clients");
let PetsAll = document.querySelector(".CreatePet");
let Pets = document.getElementById("render_pets");
let Medicines = document.getElementById("render_medicines");
let MedicinesGeneral = document.getElementById('medicinesGeneral');
let ReportContainer = document.getElementById('resultReport');
let ReportClient = document.getElementById('ReportClient');

/** BUTTONS */
let BtnCreate = document.getElementById('btn_create_client');
let BtnCreateMedicine = document.getElementById('btn_create_medicing');
let BtnReportAll = document.querySelector('.btn-reportGeneral')
BtnReportAll.addEventListener('click', ReportGeneral);

/** ADD EVENT LISTENER */
BtnCreate.addEventListener('click', CreateCustomer);
BtnCreateMedicine.addEventListener('click', CreateMedicine);

/** FORM UPDATE */
let FormUpdateCustomer = document.getElementById("update_form_customer");
let FormUpdatePet = document.getElementById("update_form_pet");
let FormUpdateMedicine = document.getElementById("update_form_medicine");

/** AÑADIR A CUALQUIER OBJETO SU RESPECTIVO EVENTLISTENER */
function AddClickNames(clase, funcion) {
    let Names = document.querySelectorAll(clase);

    Names.forEach((item) => {
        item.addEventListener('click', funcion);
    })
}

/** OBTENER MEDICINAS PARA LOS CHECKBOX */
function GetMedicines(clase, idCheckbox) {
    fetch('https://partyanimal.vercel.app/medicines')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            let CheckboxContainer = document.getElementById(clase);

            CheckboxContainer.innerHTML = '';

            let titleMedicaments = document.createElement('h3');
            titleMedicaments.setAttribute('class', 'titleCreatePetMedicaments');
            titleMedicaments.innerHTML = `Medicamentos`;

            CheckboxContainer.append(titleMedicaments);

            data.result.map((item) => {

                let Label = document.createElement('label');

                Label.innerHTML = ` 
                    <input type="checkbox" id="${idCheckbox}" value="${item._id}">
                    ${item.Nombre}`

                CheckboxContainer.append(Label);
            })
        })
}

/** RENDER CLIENTS */
function RenderCustomers() {
    Clients.innerHTML = "";

    fetch('https://partyanimal.vercel.app/customers')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.result == undefined) {
                Clients.innerHTML = `<h3 class="noCustomers">NO HAY NINGÚN CLIENTE REGISTRADO</h3>`;
            } else {
                data.result.map((item) => {

                    let Element = document.createElement('section');

                    Element.innerHTML = `
                        <h2 id="${item._id}" class="CustomerClient">${item.Nombres} ${item.Apellidos}</h2>
                        <p>CC: ${item.Cedula}</p>
                        <p>Teléfono: ${item.Telefono}</p>
                        <p>Dirección: ${item.Direccion}</p>
                        <div class="container_btn_client">
                            <button id="${item._id}" class="btn_report_customer">📄 Reporte</button>
                            <button id="${item._id}" class="btn_actualizar_customer">🖋️ Actualizar</button>
                            <button id="${item._id}" class="btn_eliminar_customer">🗑️ Eliminar</button>
                        </div>
                        `

                    Clients.append(Element);
                    AddClickNames('.CustomerClient', RenderPetsTitle);
                    AddClickNames('.btn_actualizar_customer', UpdateCustomer);
                    AddClickNames('.btn_eliminar_customer', DeleteCustomer);
                    AddClickNames('.btn_report_customer', ReportIndividual);
                })
            }
        })
}

/** RENDER PET OF CLIENT */
function RenderPets(event) {
    Pets.innerHTML = "";

    let RenderFormCreatePet = document.querySelector('.CreatePet');
    RenderFormCreatePet.innerHTML = `
        <div class="containerCreatePet">
            <h1 class="titleCreatePet">➕ CREAR MASCOTA</h1>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Id" name="Id" id='Id' required />
            </div>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Nombre" name="Nombre" id='Nombre' required />
            </div>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Raza" name="Raza" id='Raza' required />
            </div>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Edad" name="Edad" id='Edad' required />
            </div>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Peso" name="Peso" id='Peso' required />
            </div>
            <div id="checkbox_medicines"></div>
        </div>
        <button id="${event.target.id}" class="btn_create_pet">Crear</button>
    `;

    GetMedicines('checkbox_medicines', 'medicines');

    let BtnCreatePet = document.querySelector('.btn_create_pet');
    BtnCreatePet.addEventListener('click', CreatePet);

    fetch(`https://partyanimal.vercel.app/pets/${event.target.id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            Pets.innerHTML = `<h1 class="titlePets">🐾 MASCOTAS</h1>`;

            if (data.result == undefined) {
                Pets.innerHTML += `<h3 class="noPets">NO TIENES MASCOTAS</h3>`
            } else {
                data.result.map((item) => {

                    Pets.innerHTML += `
                        <section>
                            <h2 id="${item._id}" class="Pet">${item.Nombre}</h2>
                            <p>Raza: ${item.Raza}</p>
                            <p>Edad: ${item.Edad}</p>
                            <p>Peso: ${item.Peso}</p>
                            <div class="container_btn_pet">
                                <button 
                                data-pet="${item._id}" 
                                id="${item.Id_Cliente}" class="btn_actualizar_pet">🖋️ Actualizar</button>
                                <button 
                                data-pet="${item._id}" 
                                id="${item.Id_Cliente}" class="btn_eliminar_pet">🗑️ Eliminar</button>
                            </div>
                        </section>
                        `

                    AddClickNames('.Pet', RenderMedicinesTitle);
                    AddClickNames('.btn_eliminar_pet', DeletePet);
                    AddClickNames('.btn_actualizar_pet', UpdatePet);
                })
            }
        })
}

/** RENDER PET OF CLIENT FROM TITLE */
function RenderPetsTitle(event) {
    RenderPets(event);
    Medicines.innerHTML = "";
    ReportContainer.innerHTML = "";
    ReportClient.innerHTML = "";
    FormUpdateCustomer.innerHTML = "";
    FormUpdatePet.innerHTML = "";
    FormUpdateMedicine.innerHTML = "";
}

/** RENDER MEDICINES OF PET */
function RenderMedicines(event) {
    Medicines.innerHTML = "";

    fetch(`https://partyanimal.vercel.app/medicines/${event.target.id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {

            Medicines.innerHTML = `<h1 class="titleMedicine">💊 MEDICAMENTOS ASIGNADOS</h1>`;

            if (data.result[0].Medicamentos.length == 0) {
                Medicines.innerHTML += `<h3 class="noMedicines">LA MASCOTA NO TIENE MEDICAMENTOS 🤒</h3>`;
            } else {
                data.result[0].Medicamentos.map((item) => {

                    let Element = document.createElement('section');

                    Element.innerHTML = `
                        <h2 id="${item._id}" class="Pet">${item.Nombre}</h2>
                        <p>Descripción: ${item.Descripcion}</p>
                        <p>Dosis: ${item.Dosis}</p>
                        <div class="container_btn_medicine">
                            <button data-medicine="${item._id}" id="${event.target.id}" class="btn_quitar">🗑️ Quitar</button>
                        </div>
                        `

                    Medicines.append(Element);
                    AddClickNames('.btn_quitar', DeleteMedicinePet);
                })
            }
        })
}

/** RENDER MEDICINES OF PET FROM TITLE */
function RenderMedicinesTitle(event) {
    RenderMedicines(event);
    ReportContainer.innerHTML = "";
    ReportClient.innerHTML = "";
    FormUpdateCustomer.innerHTML = "";
    FormUpdatePet.innerHTML = "";
    FormUpdateMedicine.innerHTML = "";
}

/** RENDER MEDICINES GENERAL */
function RenderMedicinesGeneral() {
    MedicinesGeneral.innerHTML = "";

    fetch('https://partyanimal.vercel.app/medicines')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.result == undefined) {
                MedicinesGeneral.innerHTML += `<h3 class="noMedicinesGeneral">NO HAY MEDICINAS CREADAS</h3>`
            } else {
                data.result.map((item) => {

                    let Element = document.createElement('section');

                    Element.innerHTML = `
                    <h2 id="${item._id}" class="MedicineName">${item.Nombre} </h2>
                    <p>Descripción: ${item.Descripcion}</p>
                    <p>Dosis: ${item.Dosis}</p>
                    <div class="container_btn_medicinesGeneral">
                        <button id="${item._id}" class="btn_actualizar_medicineg"> 🖋️ Actualizar</button>
                        <button id="${item._id}" class="btn_eliminar_medicineg"> 🗑️ Eliminar</button>
                    </div>
                    `

                    MedicinesGeneral.append(Element);
                    AddClickNames('.btn_actualizar_medicineg', UpdateMedicine);
                    AddClickNames('.btn_eliminar_medicineg', DeleteMedicine);
                })
            }
        })
}

/** C - R - U - D !! */

/** CUSTOMERS */
function CreateCustomer() {
    let Cedula = document.getElementById('Cedula').value;
    let Nombres = document.getElementById('Nombres').value;
    let Apellidos = document.getElementById('Apellidos').value;
    let Direccion = document.getElementById('Direccion').value;
    let Telefono = document.getElementById('Telefono').value;

    if ((Cedula == "") || (Nombres == "") || (Apellidos == "") || (Direccion == "") || (Telefono == "")) {
        new AWN().warning("Los campos no pueden quedar vacios")
    } else {
        let Values = {
            Cedula: Cedula,
            Nombres: Nombres,
            Apellidos: Apellidos,
            Direccion: Direccion,
            Telefono: Telefono
        }

        fetch(`https://partyanimal.vercel.app/new_customer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Values)
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                new AWN().success(data.message, {durations: {success: 0}})
                RenderCustomers();
                PetsAll.innerHTML = "";
                Pets.innerHTML = "";
                Medicines.innerHTML = "";
                ReportContainer.innerHTML = "";
                ReportClient.innerHTML = "";
                FormUpdateCustomer.innerHTML = "";
                FormUpdatePet.innerHTML = "";
                FormUpdateMedicine.innerHTML = "";

                document.getElementById('Cedula').value = "";
                document.getElementById('Nombres').value = "";
                document.getElementById('Apellidos').value = "";
                document.getElementById('Direccion').value = "";
                document.getElementById('Telefono').value = "";
            })
    }
}

function UpdateCustomer(event) {
    PetsAll.innerHTML = "";
    Pets.innerHTML = "";
    Medicines.innerHTML = "";
    ReportContainer.innerHTML = "";
    ReportClient.innerHTML = "";
    FormUpdateCustomer.innerHTML = "";
    FormUpdatePet.innerHTML = "";
    FormUpdateMedicine.innerHTML = "";

    FormUpdateCustomer.innerHTML = `
        <div class="containerUpdate">
            <h1 class="titleUpdateClient">ACTUALIZAR CLIENTE</h1>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Cédula" name="Cedula" id='UpdateCedula' required />
            </div>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Nombres" name="Nombres" id='UpdateNombres' required />
            </div>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Apellidos" name="Apellidos" id='UpdateApellidos' required />
            </div>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Dirección" name="Direccion" id='UpdateDireccion' required />
            </div>
            <div class="form__group">
                <input type="text" class="form__field" placeholder="Teléfono" name="Telefono" id='UpdateTelefono' required />
            </div>
        </div>

        <button id="${event.target.id}" class="btn_update_save">Actualizar</button>
    `

    fetch(`https://partyanimal.vercel.app/customer/${event.target.id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            document.getElementById('UpdateCedula').value = data.result.Cedula;
            document.getElementById('UpdateNombres').value = data.result.Nombres;
            document.getElementById('UpdateApellidos').value = data.result.Apellidos;
            document.getElementById('UpdateDireccion').value = data.result.Direccion;
            document.getElementById('UpdateTelefono').value = data.result.Telefono;
        })

    let BtnSaveUpdate = document.querySelector('.btn_update_save').addEventListener('click', (event) => {

        let UpdateCedula = document.getElementById('UpdateCedula').value;
        let UpdateNombres = document.getElementById('UpdateNombres').value;
        let UpdateApellidos = document.getElementById('UpdateApellidos').value;
        let UpdateDireccion = document.getElementById('UpdateDireccion').value;
        let UpdateTelefono = document.getElementById('UpdateTelefono').value;

        let Values = {
            Cedula: UpdateCedula,
            Nombres: UpdateNombres,
            Apellidos: UpdateApellidos,
            Direccion: UpdateDireccion,
            Telefono: UpdateTelefono
        }

        if ((UpdateCedula == "") || (UpdateNombres == "") || (UpdateApellidos == "") || (UpdateDireccion == "") || (UpdateTelefono == "")) {
            new AWN().warning("Los campos no pueden quedar vacios")
        } else {
            fetch(`https://partyanimal.vercel.app/customer/${event.target.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Values)
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    new AWN().success(data.message, {durations: {success: 0}})
                    RenderCustomers();
                    PetsAll.innerHTML = "";
                    Pets.innerHTML = "";
                    Medicines.innerHTML = "";
                    ReportContainer.innerHTML = "";
                    ReportClient.innerHTML = "";
                    FormUpdateCustomer.innerHTML = "";
                    FormUpdatePet.innerHTML = "";
                    FormUpdateMedicine.innerHTML = "";
                })
        }
    })
}

function DeleteCustomer(event) {
    fetch(`https://partyanimal.vercel.app/customer/${event.target.id}`, {
        method: 'DELETE',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            new AWN().success(data.message, {durations: {success: 0}})
            RenderCustomers();
            PetsAll.innerHTML = "";
            Pets.innerHTML = "";
            Medicines.innerHTML = "";
            ReportContainer.innerHTML = "";
            ReportClient.innerHTML = "";
            FormUpdateCustomer.innerHTML = "";
            FormUpdatePet.innerHTML = "";
            FormUpdateMedicine.innerHTML = "";
        })
}

/** PETS */
function CreatePet(event) {
    let CheckboxSelected = document.querySelectorAll('#medicines');

    let Checked = [];

    CheckboxSelected.forEach((checkbox) => {
        if (checkbox.checked) {
            Checked.push(checkbox.value);
        }
    })

    let Id = document.getElementById('Id').value;
    let Nombre = document.getElementById('Nombre').value;
    let Raza = document.getElementById('Raza').value;
    let Edad = document.getElementById('Edad').value;
    let Peso = document.getElementById('Peso').value;

    if ((Id == "") || (Nombre == "") || (Raza == "") || (Edad == "") || (Peso == "")) {
        new AWN().warning("Los campos no pueden quedar vacios")
    } else {
        let Values = {
            Id: Id,
            Nombre: Nombre,
            Raza: Raza,
            Edad: Edad,
            Peso: Peso,
            Medicamentos: Checked,
            Id_Cliente: event.target.id
        }

        fetch(`https://partyanimal.vercel.app/new_pet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Values)
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                new AWN().success(data.message, {durations: {success: 0}})
                RenderPets(event);
                Medicines.innerHTML = "";
                ReportContainer.innerHTML = "";
                ReportClient.innerHTML = "";
                FormUpdateCustomer.innerHTML = "";
                FormUpdatePet.innerHTML = "";
                FormUpdateMedicine.innerHTML = "";

                document.getElementById('Id').value = "";
                document.getElementById('Nombre').value = "";
                document.getElementById('Raza').value = "";
                document.getElementById('Edad').value = "";
                document.getElementById('Peso').value = "";
            })
    }
}

function UpdatePet(eventUpdate) {
    Medicines.innerHTML = "";
    ReportContainer.innerHTML = "";
    ReportClient.innerHTML = "";
    FormUpdateCustomer.innerHTML = "";
    FormUpdatePet.innerHTML = "";
    FormUpdateMedicine.innerHTML = "";

    FormUpdatePet.innerHTML = `
    <div class="containerUpdate">
        <h1 class="titleUpdatePet">ACTUALIZAR MASCOTA</h1>
        <div class="form__group">
            <input type="text" class="form__field" placeholder="Id" name="UpdateId" id='UpdateId' required />
        </div>
        <div class="form__group">
            <input type="text" class="form__field" placeholder="Nombre" name="UpdateNombre" id='UpdateNombre' required />
        </div>
        <div class="form__group">
            <input type="text" class="form__field" placeholder="Raza" name="UpdateRaza" id='UpdateRaza' required />
        </div>
        <div class="form__group">
            <input type="text" class="form__field" placeholder="Edad" name="UpdateEdad" id='UpdateEdad' required />
        </div>
        <div class="form__group">
            <input type="text" class="form__field" placeholder="Peso" name="UpdatePeso" id='UpdatePeso' required />
        </div>

        <div id="update_checkbox_medicines"></div>

        <button id="${eventUpdate.target.getAttribute('data-pet')}" class="btn_update_save_pet">Actualizar</button>
    </div>`

    fetch(`https://partyanimal.vercel.app/pet/${eventUpdate.target.getAttribute('data-pet')}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            document.getElementById('UpdateId').value = data.result.Id;
            document.getElementById('UpdateNombre').value = data.result.Nombre;
            document.getElementById('UpdateRaza').value = data.result.Raza;
            document.getElementById('UpdateEdad').value = data.result.Edad;
            document.getElementById('UpdatePeso').value = data.result.Peso;
        })

    GetMedicines('update_checkbox_medicines', 'Updatemedicine');

    let BtnSaveUpdate = document.querySelector('.btn_update_save_pet').addEventListener('click', (eventSave) => {

        let CheckboxSelected = document.querySelectorAll('#Updatemedicine');
        let Checked = [];

        CheckboxSelected.forEach((checkbox) => {
            if (checkbox.checked) {
                Checked.push(checkbox.value);
            }
        })

        let UpdateId = document.getElementById('UpdateId').value;
        let UpdateNombre = document.getElementById('UpdateNombre').value;
        let UpdateRaza = document.getElementById('UpdateRaza').value;
        let UpdateEdad = document.getElementById('UpdateEdad').value;
        let UpdatePeso = document.getElementById('UpdatePeso').value;

        if ((UpdateId == "") || (UpdateNombre == "") || (UpdateRaza == "") || (UpdateEdad == "") || (UpdatePeso == "")) {
            new AWN().warning("Los campos no pueden quedar vacios")
        } else {
            let Values = {
                Id: UpdateId,
                Nombre: UpdateNombre,
                Raza: UpdateRaza,
                Edad: UpdateEdad,
                Peso: UpdatePeso,
                Medicamentos: Checked,
                Id_Cliente: eventUpdate.target.id
            }

            fetch(`https://partyanimal.vercel.app/pet/${eventSave.target.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Values)
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    new AWN().success(data.message, {durations: {success: 0}})
                    RenderPets(eventUpdate);
                    Medicines.innerHTML = "";
                    ReportContainer.innerHTML = "";
                    ReportClient.innerHTML = "";
                    FormUpdateCustomer.innerHTML = "";
                    FormUpdatePet.innerHTML = "";
                    FormUpdateMedicine.innerHTML = "";
                })
        }
    })
}

function DeletePet(event) {
    fetch(`https://partyanimal.vercel.app/pet/${event.target.getAttribute('data-pet')}`, {
        method: 'DELETE',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            new AWN().success(data.message, {durations: {success: 0}})
            RenderPets(event);
            Medicines.innerHTML = "";
            ReportContainer.innerHTML = "";
            ReportClient.innerHTML = "";
            FormUpdateCustomer.innerHTML = "";
            FormUpdatePet.innerHTML = "";
            FormUpdateMedicine.innerHTML = "";
        })
}

/** MEDICINES - GENERAL */
function CreateMedicine() {
    let IdMedicine = document.getElementById('IdMedicine').value;
    let NombreMedicine = document.getElementById('NombreMedicine').value;
    let DescripcionMedicine = document.getElementById('DescripcionMedicine').value;
    let DosisMedicine = document.getElementById('DosisMedicine').value;

    if ((IdMedicine == "") || (NombreMedicine == "") || (DescripcionMedicine == "") || (DosisMedicine == "")) {
        new AWN().warning("Los campos no pueden quedar vacios")
    } else {
        let Values = {
            Id: IdMedicine,
            Nombre: NombreMedicine,
            Descripcion: DescripcionMedicine,
            Dosis: DosisMedicine
        }

        fetch(`https://partyanimal.vercel.app/new_medicine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Values)
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                new AWN().success(data.message, {durations: {success: 0}})
                RenderMedicinesGeneral();
                PetsAll.innerHTML = "";
                Pets.innerHTML = "";
                Medicines.innerHTML = "";
                ReportContainer.innerHTML = "";
                ReportClient.innerHTML = "";
                FormUpdateCustomer.innerHTML = "";
                FormUpdatePet.innerHTML = "";
                FormUpdateMedicine.innerHTML = "";

                document.getElementById('IdMedicine').value = "";
                document.getElementById('NombreMedicine').value = "";
                document.getElementById('DescripcionMedicine').value = "";
                document.getElementById('DosisMedicine').value = "";
            })
    }
}

function UpdateMedicine(event) {
    PetsAll.innerHTML = "";
    Pets.innerHTML = "";
    Medicines.innerHTML = "";
    ReportContainer.innerHTML = "";
    ReportClient.innerHTML = "";
    FormUpdateCustomer.innerHTML = "";
    FormUpdatePet.innerHTML = "";
    FormUpdateMedicine.innerHTML = "";

    FormUpdateMedicine.innerHTML = `
    <div class="containerUpdateMedicine">
        <h1 class="titleUpdateMedicine">ACTUALIZAR MEDICINA</h1>
        <div class="form__group">
            <input type="text" class="form__field" placeholder="Id" name="Id" id='UpdateIdMedicine' required />
        </div>
        <div class="form__group">
            <input type="text" class="form__field" placeholder="Nombre" name="Nombre" id='UpdateNombreMedicine' required />
        </div>
        <div class="form__group">
            <input type="text" class="form__field" placeholder="Descripción" name="Descripcion" id='UpdateDescripcionMedicine' required />
        </div>
        <div class="form__group">
            <input type="text" class="form__field" placeholder="Dosis" name="Dosis" id='UpdateDosisMedicine' required />
        </div>
    </div>
    <button id="${event.target.id}" class="btn_update_save_medicine">GUARDAR</button>`;

    fetch(`https://partyanimal.vercel.app/medicine/${event.target.id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            document.getElementById('UpdateIdMedicine').value = data.result.Id;
            document.getElementById('UpdateNombreMedicine').value = data.result.Nombre;
            document.getElementById('UpdateDescripcionMedicine').value = data.result.Descripcion;
            document.getElementById('UpdateDosisMedicine').value = data.result.Dosis;
        })

    let BtnSaveUpdate = document.querySelector('.btn_update_save_medicine').addEventListener('click', (eventSave) => {

        let UpdateIdMedicine = document.getElementById('UpdateIdMedicine').value;
        let UpdateNombreMedicine = document.getElementById('UpdateNombreMedicine').value;
        let UpdateDescripcionMedicine = document.getElementById('UpdateDescripcionMedicine').value;
        let UpdateDosisMedicine = document.getElementById('UpdateDosisMedicine').value;

        if ((UpdateIdMedicine == "") || (UpdateNombreMedicine == "") || (UpdateDescripcionMedicine == "") || (UpdateDosisMedicine == "")) {
            new AWN().warning("Los campos no pueden quedar vacios")
        } else {
            let Values = {
                Id: UpdateIdMedicine,
                Nombre: UpdateNombreMedicine,
                Descripcion: UpdateDescripcionMedicine,
                Dosis: UpdateDosisMedicine
            }

            fetch(`https://partyanimal.vercel.app/medicine/${eventSave.target.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Values)
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    new AWN().success(data.message, {durations: {success: 0}})
                    RenderMedicinesGeneral();
                    PetsAll.innerHTML = "";
                    Pets.innerHTML = "";
                    Medicines.innerHTML = "";
                    ReportContainer.innerHTML = "";
                    ReportClient.innerHTML = "";
                    FormUpdateCustomer.innerHTML = "";
                    FormUpdatePet.innerHTML = "";
                    FormUpdateMedicine.innerHTML = "";
                })
        }
    })
}

function DeleteMedicine(event) {
    fetch(`https://partyanimal.vercel.app/medicine/${event.target.id}`, {
        method: 'DELETE',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            new AWN().success(data.message, {durations: {success: 0}})
            RenderMedicinesGeneral();
            PetsAll.innerHTML = "";
            Pets.innerHTML = "";
            Medicines.innerHTML = "";
            ReportContainer.innerHTML = "";
            ReportClient.innerHTML = "";
            FormUpdateCustomer.innerHTML = "";
            FormUpdatePet.innerHTML = "";
            FormUpdateMedicine.innerHTML = "";
        })
}

/** MEDICINE - PET */
function DeleteMedicinePet(event) {
    fetch(`https://partyanimal.vercel.app/medicines/${event.target.id}/${event.target.getAttribute('data-medicine')}`, {
        method: 'PUT',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            new AWN().success(data.message, {durations: {success: 0}})
            RenderMedicines(event);
            ReportContainer.innerHTML = "";
            ReportClient.innerHTML = "";
            FormUpdateCustomer.innerHTML = "";
            FormUpdatePet.innerHTML = "";
            FormUpdateMedicine.innerHTML = "";
        })
}

/** REPORTE GENERAL */
function ReportGeneral() {
    fetch('https://partyanimal.vercel.app/report_all')
        .then((res) => {
            return res.text();
        })
        .then((data) => {
            ReportContainer.innerHTML = "";
            let Element = document.createElement('div');
            Element.innerHTML = data;
            ReportContainer.append(Element);
            PetsAll.innerHTML = "";
            Pets.innerHTML = "";
            Medicines.innerHTML = "";
            ReportClient.innerHTML = "";
            FormUpdateCustomer.innerHTML = "";
            FormUpdatePet.innerHTML = "";
            FormUpdateMedicine.innerHTML = "";
        })
}

/** REPORTE CLIENTE */
function ReportIndividual(event) {
    fetch(`https://partyanimal.vercel.app/report/${event.target.id}`)
        .then((res) => {
            return res.text();
        })
        .then((data) => {
            ReportClient.innerHTML = "";
            let Element = document.createElement('div');
            Element.innerHTML = data;
            ReportClient.append(Element);
            PetsAll.innerHTML = "";
            Pets.innerHTML = "";
            Medicines.innerHTML = "";
            ReportContainer.innerHTML = "";
            FormUpdateCustomer.innerHTML = "";
            FormUpdatePet.innerHTML = "";
            FormUpdateMedicine.innerHTML = "";
        })
}

/** EJECUCIÓN INICIAL */
RenderCustomers();
RenderMedicinesGeneral();