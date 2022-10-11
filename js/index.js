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

/**
Clients.innerHTML = "";
PetsAll.innerHTML = "";
Pets.innerHTML = "";
Medicines.innerHTML = "";
MedicinesGeneral.innerHTML = "";
ReportContainer.innerHTML = "";
ReportClient.innerHTML = "";
FormUpdateCustomer.innerHTML = "";
FormUpdatePet.innerHTML = "";
FormUpdateMedicine.innerHTML = "";
*/

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
                    AddClickNames('.CustomerClient', RenderPets);
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

                    AddClickNames('.Pet', RenderMedicines);
                    AddClickNames('.btn_eliminar_pet', DeletePet);
                    AddClickNames('.btn_actualizar_pet', UpdatePet);
                })
            }
        })
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

/** RENDER MEDICINES GENERAL */
function RenderMedicinesGeneral() {
    MedicinesGeneral.innerHTML = "";

    fetch('https://partyanimal.vercel.app/medicines')
        .then((res) => {
            return res.json();
        })
        .then((data) => {

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
        })
}

/** C - R - U - D !! */

/** CUSTOMERS */
function CreateCustomer() {
    let Values = {
        Cedula: document.getElementById('Cedula').value,
        Nombres: document.getElementById('Nombres').value,
        Apellidos: document.getElementById('Apellidos').value,
        Direccion: document.getElementById('Direccion').value,
        Telefono: document.getElementById('Telefono').value,
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
            alert(data.message);
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

    let BtnSaveUpdate = document.querySelector('.btn_update_save').addEventListener('click', (event) => {

        let Values = {
            Cedula: document.getElementById('UpdateCedula').value,
            Nombres: document.getElementById('UpdateNombres').value,
            Apellidos: document.getElementById('UpdateApellidos').value,
            Direccion: document.getElementById('UpdateDireccion').value,
            Telefono: document.getElementById('UpdateTelefono').value,
        }

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
                alert(data.message);
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
            alert(data.message);
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

    let Values = {
        Id: document.getElementById('Id').value,
        Nombre: document.getElementById('Nombre').value,
        Raza: document.getElementById('Raza').value,
        Edad: document.getElementById('Edad').value,
        Peso: document.getElementById('Peso').value,
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
            alert(data.message);
            RenderPets(event);
            Medicines.innerHTML = "";
            ReportContainer.innerHTML = "";
            ReportClient.innerHTML = "";
            FormUpdateCustomer.innerHTML = "";
            FormUpdatePet.innerHTML = "";
            FormUpdateMedicine.innerHTML = "";
        })
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

    GetMedicines('update_checkbox_medicines', 'Updatemedicine');

    let BtnSaveUpdate = document.querySelector('.btn_update_save_pet').addEventListener('click', (eventSave) => {

        let CheckboxSelected = document.querySelectorAll('#Updatemedicine');
        let Checked = [];

        CheckboxSelected.forEach((checkbox) => {
            if (checkbox.checked) {
                Checked.push(checkbox.value);
            }
        })

        let Values = {
            Id: document.getElementById('UpdateId').value,
            Nombre: document.getElementById('UpdateNombre').value,
            Raza: document.getElementById('UpdateRaza').value,
            Edad: document.getElementById('UpdateEdad').value,
            Peso: document.getElementById('UpdatePeso').value,
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
                alert(data.message);
                RenderPets(eventUpdate);
                Medicines.innerHTML = "";
                ReportContainer.innerHTML = "";
                ReportClient.innerHTML = "";
                FormUpdateCustomer.innerHTML = "";
                FormUpdatePet.innerHTML = "";
                FormUpdateMedicine.innerHTML = "";
            })
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
            alert(data.message);
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
    let Values = {
        Id: document.getElementById('IdMedicine').value,
        Nombre: document.getElementById('NombreMedicine').value,
        Descripcion: document.getElementById('DescripcionMedicine').value,
        Dosis: document.getElementById('DosisMedicine').value,
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
            alert(data.message);
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

    let BtnSaveUpdate = document.querySelector('.btn_update_save_medicine').addEventListener('click', (eventSave) => {

        let Values = {
            Id: document.getElementById('UpdateIdMedicine').value,
            Nombre: document.getElementById('UpdateNombreMedicine').value,
            Descripcion: document.getElementById('UpdateDescripcionMedicine').value,
            Dosis: document.getElementById('UpdateDosisMedicine').value
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
                alert(data.message);
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
            alert(data.message);
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
            alert(data.message);
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