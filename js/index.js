/** CONTAINERS */
let Clients = document.getElementById("render_clients");
let Pets = document.getElementById("render_pets");
let Medicines = document.getElementById("render_medicines");

/** BUTTONS */
let BtnCreate = document.getElementById('btn_create_client');
BtnCreate.addEventListener('click', CreateCustomer);

/** FORM UPDATE */
let FormUpdateCustomer = document.getElementById("update_form_customer");
let FormUpdatePet = document.getElementById("update_form_pet");

function AddClickNames(clase, funcion) {

    let Names = document.querySelectorAll(clase);

    Names.forEach((item) => {
        item.addEventListener('click', funcion);
    })
}

function RenderCustomers() {
    fetch('http://localhost:3001/customers')
        .then((res) => {
            return res.json();
        })
        .then((data) => {

            data.result.map((item) => {

                let Element = document.createElement('section');

                Element.innerHTML = `
                    <h2 id="${item._id}" class="CustomerClient">${item.Nombres} ${item.Apellidos}</h2>
                    <p>CC: ${item.Cedula}</p>
                    <button id="${item._id}" class="btn_eliminar_customer">Eliminar</button>
                    <button id="${item._id}" class="btn_actualizar_customer">Actualizar</button>
                    `

                Clients.append(Element);
                AddClickNames('.CustomerClient', RenderPets);
                AddClickNames('.btn_actualizar_customer', UpdateCustomer);
                AddClickNames('.btn_eliminar_customer', DeleteCustomer);
            })

        })
}
RenderCustomers();

function GetMedicines(clase, idCheckbox) {

    fetch('http://localhost:3001/medicines')
        .then((res) => {
            return res.json();
        })
        .then((data) => {

            data.result.map((item) => {

                let CheckboxContainer = document.getElementById(clase);

                let Label = document.createElement('label');
                Label.innerHTML = ` 
                    <input type="checkbox" id="${idCheckbox}" value="${item._id}">
                    ${item.Nombre}`

                CheckboxContainer.append(Label);
            })
        })
}

function RenderPets(event) {

    let RenderFormCreatePet = document.querySelector('.CreatePet');
    RenderFormCreatePet.innerHTML = `
    <div>
        <input type="text" id="Id" placeholder="Id" />
        <input type="text" id="Nombre" placeholder="Nombre" />
        <input type="text" id="Raza" placeholder="Raza" />
        <input type="text" id="Edad" placeholder="Edad" />
        <input type="text" id="Peso" placeholder="Peso" />
        <div id="checkbox_medicines"></div>
        <button id="${event.target.id}" class="btn_create_pet">Crear</button>
    </div>`;

    GetMedicines('checkbox_medicines', 'medicines');

    let BtnCreatePet = document.querySelector('.btn_create_pet');
    BtnCreatePet.addEventListener('click', CreatePet);

    Pets.innerHTML = "";
    Medicines.innerHTML = "";

    fetch(`http://localhost:3001/pets/${event.target.id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {

            if (data.result == undefined) {
                Pets.innerHTML = `<h3>NO TIENES MASCOTAS</h3>`
            } else {
                data.result.map((item) => {

                    let Element = document.createElement('section');

                    Element.innerHTML = `
                        <h2 id="${item._id}" class="Pet">${item.Nombre}</h2>
                        <button 
                            data-pet="${item._id}" 
                            id="${item.Id_Cliente}" class="btn_eliminar_pet">Eliminar</button>
                        <button 
                            data-pet="${item._id}" 
                            id="${item.Id_Cliente}" class="btn_actualizar_pet">Actualizar</button>
                        `

                    Pets.append(Element);
                    AddClickNames('.Pet', RenderMedicines);
                    AddClickNames('.btn_eliminar_pet', DeletePet);
                    AddClickNames('.btn_actualizar_pet', UpdatePet);
                })
            }

        })

}

function RenderMedicines(event) {
    Medicines.innerHTML = "";

    fetch(`http://localhost:3001/medicines/${event.target.id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {

            data.result[0].Medicamentos.map((item) => {

                let Element = document.createElement('section');

                Element.innerHTML = `
                    <h2 id="${item._id}" class="Pet">${item.Nombre}</h2>
                    <p>${item.Descripcion}</p>
                    <button id="${item._id}" class="btn_eliminar">Eliminar</button>
                    <button id="${item._id}" class="btn_actualizar" >Actualizar</button>
                    `

                Medicines.append(Element);
            })
        })
}

/** CUSTOMERS */
function CreateCustomer() {

    let Values = {
        Cedula: document.getElementById('Cedula').value,
        Nombres: document.getElementById('Nombres').value,
        Apellidos: document.getElementById('Apellidos').value,
        Direccion: document.getElementById('Direccion').value,
        Telefono: document.getElementById('Telefono').value,
    }

    fetch(`http://localhost:3001/new_customer`, {
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
            Clients.innerHTML = "";
            RenderCustomers();
        })
}

function UpdateCustomer(event) {

    FormUpdateCustomer.innerHTML = `
        <input type="text" id="UpdateCedula" placeholder="Cedula" />
        <input type="text" id="UpdateNombres" placeholder="Nombres" />
        <input type="text" id="UpdateApellidos" placeholder="Apellidos" />
        <input type="text" id="UpdateDireccion" placeholder="Dirección" />
        <input type="text" id="UpdateTelefono" placeholder="Teléfono" />
        <button id="${event.target.id}" class="btn_update_save">GUARDAR</button>
    `

    let BtnSaveUpdate = document.querySelector('.btn_update_save').addEventListener('click', (event) => {
        let Values = {
            Cedula: document.getElementById('UpdateCedula').value,
            Nombres: document.getElementById('UpdateNombres').value,
            Apellidos: document.getElementById('UpdateApellidos').value,
            Direccion: document.getElementById('UpdateDireccion').value,
            Telefono: document.getElementById('UpdateTelefono').value,
        }

        fetch(`http://localhost:3001/customer/${event.target.id}`, {
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
                Clients.innerHTML = "";
                RenderCustomers();
            })

    })

}

function DeleteCustomer(event) {
    fetch(`http://localhost:3001/customer/${event.target.id}`, {
        method: 'DELETE',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            alert(data.message);
            Clients.innerHTML = "";
            RenderCustomers();
        })
}

/** PETS */
function CreatePet(event) {

    let CheckboxSelected = document.querySelectorAll('#medicine');
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

    console.log(Values);

    fetch(`http://localhost:3001/new_pet`, {
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
        })

}

function DeletePet(event) {
    fetch(`http://localhost:3001/pet/${event.target.getAttribute('data-pet')}`, {
        method: 'DELETE',
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            alert(data.message);
            RenderPets(event);
        })
}

function UpdatePet(event) {
    FormUpdatePet.innerHTML = `
    <div>
        <input type="text" id="UpdateId" placeholder="Id" />
        <input type="text" id="UpdateNombre" placeholder="Nombre" />
        <input type="text" id="UpdateRaza" placeholder="Raza" />
        <input type="text" id="UpdateEdad" placeholder="Edad" />
        <input type="text" id="UpdatePeso" placeholder="Peso" />
        <div id="update_checkbox_medicines"></div>
        <button id="${event.target.getAttribute('data-pet')}" class="btn_update_save_pet">GUARDAR</button>
    </div>`

    GetMedicines('update_checkbox_medicines', 'Updatemedicine');

    let BtnSaveUpdate = document.querySelector('.btn_update_save_pet').addEventListener('click', (event) => {

        let CheckboxSelected = document.querySelectorAll('#Updatemedicine');
        let Checked = [];

        CheckboxSelected.forEach((checkbox) => {
            if (checkbox.checked) {
                Checked.push(checkbox.value);
            }
        })

        console.log(event.target);

        let Values = {
            Id: document.getElementById('UpdateId').value,
            Nombre: document.getElementById('UpdateNombre').value,
            Raza: document.getElementById('UpdateRaza').value,
            Edad: document.getElementById('UpdateEdad').value,
            Peso: document.getElementById('UpdatePeso').value,
            Medicamentos: Checked,
            Id_Cliente: event.target.id
        }

        fetch(`http://localhost:3001/pet/${event.target.id}`, {
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
                RenderPets(event);
            })

    })
}