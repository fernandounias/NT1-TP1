
const formNameInput = document.querySelector('#form_name');
const formAgeInput = document.querySelector('#form_age');
const formAddBtn = document.querySelector('#addBtn');
const clearBtn = document.querySelector('#clearBtn');
const pannelClearIcon = document.querySelector('.closeIcon');
const showInPannelBtn = document.querySelector('#showBtn');
const pannel = document.querySelector('.print-data');

var clientList = [];
var selectedClientList = [];

//agrega validación al input de edad
formAgeInput.addEventListener('input', validationN);
function validationN (e){
    let input = e.target;
    //elimina todos los caracteres que no sean numericos
    input.value = input.value.replace(/\D+/g,'');
    //elimina todos "whitespace" (espacio y enter) en el input
    if(input.value.match(/\s/gi)){
        input.value = input.value.replace(/\s/gi,'');
    }
    //elimina cuando se superan 3 digitos en el input
    if(input.value.length > 3){
        input.value = input.value.slice(0,3);
    }
    //eliminia los "-" y "." del input
    if(input.value.match(/\-/gi) || input.value.match(/\./gi)){
        input.value = input.value.replace(/\-/gi,'');
        input.value = input.value.replace(/\./gi,'');
    }
    //https://regexr.com/
}

//valida si el id está en uso
function isIdInUse(id){
    let inUse = false;
    // clientList.forEach(item => {if(item.id == id) {inUse = true}})
    clientList.forEach(item => item.id == id ? inUse = true : '');
    return inUse;
}
//genera un id random compuesto por letras y numeros
function newRandomId(){
    const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    //let randomN = () => Math.round(Math.random()*10);
    let randomN = () => {
        let resp;
        do{ resp = Math.round(Math.random()*10) }while( resp > 9 );
        return resp;
    }
    let randomInRange = ( min , max ) => {
        let resp;
        do{ resp = Math.round(Math.random()*(max - min))}while(resp < min || resp > max )
        return resp
    }
    let randomL = () => letters[randomInRange(1,26)];
    const coinflip = () => randomN() % 2 ? true : false ;
    let randomLorN = () => coinflip() ? randomN() : randomL()

    let resp = '';
    do{
        for(let i = 0; i < 6 ; i++ ){ resp += randomLorN() }
    }while(isIdInUse(resp));
    return resp;
}

// valida el input de edad
function validateAgeField(input){
    let resp = false;
    let isNum = typeof(input) == 'number';
    if(!isNaN(input) && isNum){
        let reasonableAge = input > 0 && input < 120;
        if(reasonableAge) resp = true;
    }
    return resp;
}

function erraseAlert (){
    let alertDiv = document.querySelector('#inputAlert');
    let alClass = alertDiv.classList;
    if(alClass.contains('fieldErrorAlert')) alClass.remove('fieldErrorAlert');
    if(alClass.contains('fieldAlert')) alClass.remove('fieldAlert')
    alertDiv.innerHTML = '';
}

function createAlert (typeMessage){
    const messageAge1 = 'Porfavor ingrese un valor de edad apropiado';
    const messageAge2 = 'Porfavor complete el campo de edad';
    const messageName1 = 'Porfavor complete el campo de nombre';
    const empty = 'Porfavor complete los campos';
    const success = 'Se agrego exitosamente';
    const fail = 'No se pudo agregar';
    const listUpdated = 'item eliminado de la lista'

    let typeAlert = 'error';
    let text = '';
    switch(typeMessage){
        case 'age1':
            text = messageAge1;
            break;
        case 'age2':
            text = messageAge2;
            break;
        case 'name1':
            text = messageName1;
            break;
        case 'success':
            text = success;
            typeAlert = 'success';
            break;
        case 'fail':
            text = fail;
            break;
        case 'update':
            text = listUpdated;
            typeAlert = 'success';
            break;
        default:
            text = empty;
            break;
        }

    let alertDiv = document.querySelector('#inputAlert');
    let alClass = alertDiv.classList;
    if(!alClass.contains('fieldErrorAlert')) alClass.remove('fieldErrorAlert');
    if(!alClass.contains('fieldAlert')) alClass.remove('fieldAlert');
    
    typeAlert == 'success' ? alertDiv.classList.add('fieldAlert') : alertDiv.classList.add('fieldErrorAlert');
    const message = document.createElement('p');
    message.innerHTML = `${text}`;
    alertDiv.appendChild(message);
    /* <div class="fieldErrorAlert"><p>Porfavor Ingrese un valor de edad apropiado</p></div> */
    setTimeout(erraseAlert , 2000);
}

function alertOpen (){
    let resp = false;
    let AlertDiv = document.querySelector('#inputAlert');
    if(AlertDiv.classList.contains('fieldErrorAlert') || AlertDiv.classList.contains('fieldAlert')){
        if(AlertDiv.children.length > 0) resp = true;
    }
    return resp
}

function verifySelection(item){
    let resp = false;
    let idValid = !isIdInUse(item.id);
    let ageValid = validateAgeField(item.age);
    let nameValid = item.name != '';
    if(idValid && ageValid && nameValid){
        if(item.age >= 21) resp = true;
    }
    return resp;
}

formAddBtn.addEventListener('click' , createItem);

function addItemToList (item){
    if(!isIdInUse(item.id)){
        if(verifySelection(item)) selectedClientList.push(item);
        clientList.push(item);
        createAlert('success');
    }else{ createAlert('fail') }
}
function findOnList(id, list){
    let resp = null;
    list.forEach(item => item.id == id ? resp = item : '');
    return resp;
}
function erraseItemfromList (e){
    let binBtn = e.target;
    let item = binBtn.parentElement.parentElement;
    let id = item.dataset.itemId;
    if(binBtn.classList.contains('erraseItemBtn') && isIdInUse(id)){

        let isOnSelectedList = findOnList(id, selectedClientList)
        let isOnCList = findOnList(id, clientList)
        
        isOnSelectedList != null ? selectedClientList.pop(isOnSelectedList) : console.warn('item is not on selected list'); 
        isOnCList != null ? clientList.pop(isOnCList) : console.warn('item is not on list');
        
        item.remove();
        updateInfoCard();
        createAlert('update');
    }
}
function clearLists (){
    clientList = [];
    selectedClientList = [];
    pannel.innerHTML = '';
}

function createItem(){
    let emptyAgeField = formAgeInput. value == '';
    let emptyString = formNameInput.value == '';
    let emptyAll = emptyString && emptyAgeField;
    let ageField = parseInt(formAgeInput.value);
    if( !emptyAgeField && !emptyString){
        let vAgeField = validateAgeField(ageField);
        if(vAgeField) {
            let item = {
                id: newRandomId(),
                name: formNameInput.value,
                age: ageField
            }
            addItemToList(item)
            formNameInput.value = '';
            formAgeInput.value = '';
        }else{
            //show alert
            if(!alertOpen()) createAlert('age1');
        }
    }else{
        //show alert
        if(!alertOpen()) {
            if(emptyAll){
                createAlert();
            }else{
                emptyString ? createAlert('name1') : createAlert('age2');
            }
        }
    }
}
function createInfoCard(){
    const infocard = document.createElement('div');
    infocard.classList.add('infoTitle');
    const message = document.createElement('p');
    message.innerText = 'Cantidad de clientes de mayor o igual a 21 años: ';
    infocard.appendChild(message);
    const number = document.createElement('span');
    number.classList.add('number');
    number.innerText = `${selectedClientList.length} de ${clientList.length}`
    message.appendChild(number);
    
    return infocard
}
function updateInfoCard(){
    let infocard = document.querySelector('.infoTitle');
    infocard.children[0].children[0].innerText = `${selectedClientList.length} de ${clientList.length}`
    if(selectedClientList.length == 0 && clientList.length == 0){
        createMessageListEmpty();
    }
}
function createItemCard(item){
    const newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.dataset.itemId = item.id;

    const content = document.createElement('div');
    content.classList.add('content');
    content.innerHTML = `<p>Nombre: <span class="nameField">${item.name}</span></p>`;
    content.innerHTML += `<p>Edad: <span class="ageField">${item.age}</span></p>`;
    newItem.appendChild(content);

    const bin = document.createElement('div');
    bin.classList.add('btn-errase');
    bin.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="24px" height="24px"><g fill="#8e97ad" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M10,2l-1,1h-5v2h1v15c0,0.52222 0.19133,1.05461 0.56836,1.43164c0.37703,0.37703 0.90942,0.56836 1.43164,0.56836h10c0.52222,0 1.05461,-0.19133 1.43164,-0.56836c0.37703,-0.37703 0.56836,-0.90942 0.56836,-1.43164v-15h1v-2h-5l-1,-1zM7,5h10v15h-10zM9,7v11h2v-11zM13,7v11h2v-11z"/></g></g></svg>';
    bin.innerHTML += '<svg class="erraseItemBtn" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="24px" height="24px"><g fill="#000d23" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M10,2l-1,1h-5v2h1v15c0,0.52222 0.19133,1.05461 0.56836,1.43164c0.37703,0.37703 0.90942,0.56836 1.43164,0.56836h10c0.52222,0 1.05461,-0.19133 1.43164,-0.56836c0.37703,-0.37703 0.56836,-0.90942 0.56836,-1.43164v-15h1v-2h-5l-1,-1zM7,5h10v15h-10zM9,7v11h2v-11zM13,7v11h2v-11z"/></g></g></svg>';
    newItem.appendChild(bin);
    if(bin.children[1].classList.contains('erraseItemBtn')){
        bin.children[1].addEventListener('click' , erraseItemfromList);
    }else{
        console.error('bin button created without function')
    }
    return newItem;
}
function createMessageListEmpty(){
    const emptyMessage = document.createElement('div');
    emptyMessage.classList.add('emptyListTitle');
    const emptyText = document.createElement('div');
    emptyText.innerText = 'No hay items en la lista';
    emptyMessage.appendChild(emptyText);
    pannel.innerHTML = '';
    pannel.appendChild(emptyMessage);
}

function showItems(){
    let cantItems = clientList.length
    let cantSelectedItems = selectedClientList.length
        // console.log('clientList',clientList.length)
        // console.log('selectedClientList',selectedClientList.length)
    if(cantSelectedItems == 0){
        cantItems == 0 ? createMessageListEmpty() : clientList.forEach(item => verifySelection(item) ? selectedClientList.add(item) : '');
    }else{
        pannel.innerHTML = '';
        pannel.appendChild(createInfoCard());
        selectedClientList.forEach(item => pannel.appendChild(createItemCard(item)));
    }
}

showInPannelBtn.addEventListener('click', showItems);

clearBtn.addEventListener('click', clearLists);

pannelClearIcon.addEventListener('click', ()=> {pannel.innerHTML = '';});


