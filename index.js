import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.5/+esm'

let password;
let isOn = false;
let channel = "just_ns";
let substring = "!комп";

document.body.onload = init;

addEventListener("resize",updateResized)

let mainpageRoot;
let mainpageFormHeader;

let adminForm;
let adminStatus;
let adminChannelInput;
let adminSubstringInput;
let adminButton;
let adminDropCollectionButton;
let adminDownloadParticipantsButton;

let passwordpageForm;
let passwordpageInput;
let passwordpageButton;

function init()
{    
    mainpageRoot = document.createElement("div");
    mainpageRoot.className = "mainpage-root";

    const mainpageHeader = document.createElement("div");
    mainpageHeader.className = "mainpage-header";

    mainpageFormHeader = document.createElement("div");
    mainpageFormHeader.className = "mainpage-form-header";
    mainpageFormHeader.textContent = "Subday Админка";

    document.body.appendChild(mainpageRoot);
    mainpageRoot.appendChild(mainpageHeader);
    mainpageHeader.appendChild(mainpageFormHeader);

    buildPasswordpage();
    buildMainpage();

    mountPasswordpage();
    updateResized();
}

function buildMainpage()
{
    adminForm = document.createElement("div");
    adminForm.className = "mainpage-form";

    const adminStatusLabel = document.createElement("div");
    adminStatusLabel.className = "mainpage-label";
    adminStatusLabel.textContent = "Статус бота:";
    adminStatus = document.createElement("div");

    updateBotStatus();

    const adminChannelInputLabel = document.createElement("div");
    adminChannelInputLabel.textContent = "Канал, на котором будем слушать чат";
    adminChannelInputLabel.className = "mainpage-label-block";

    adminChannelInput = document.createElement("input");
    adminChannelInput.className = "mainpage-input";
    adminChannelInput.value = channel;
    adminChannelInput.placeholder = "justns";

    const adminSubstringInputLabel = document.createElement("div");
    adminSubstringInputLabel.textContent = "Строчка, которую будет искать";
    adminSubstringInputLabel.className = "mainpage-label-block";

    adminSubstringInput = document.createElement("input");
    adminSubstringInput.className = "mainpage-input";
    adminSubstringInput.value = substring;
    adminSubstringInput.placeholder = "!комп";
   
    adminButton = document.createElement("button");
    adminButton.className = "mainpage-button";

    updateAdminButton();    

    adminDropCollectionButton = document.createElement("button");
    adminDropCollectionButton.className = "mainpage-button";
    adminDropCollectionButton.onclick = dropCollection;
    adminDropCollectionButton.textContent = "Очистить таблицу";

    updateAdminDropCollectionButton();

    adminDownloadParticipantsButton = document.createElement("button");
    adminDownloadParticipantsButton.className = "mainpage-button";
    adminDownloadParticipantsButton.onclick = downloadParticipants;
    adminDownloadParticipantsButton.textContent = "Скачать таблицу участников";
    

    adminForm.appendChild(adminStatusLabel);
    adminForm.appendChild(adminStatus);
    adminForm.appendChild(adminChannelInputLabel);
    adminForm.appendChild(adminChannelInput);
    adminForm.appendChild(adminSubstringInputLabel);
    adminForm.appendChild(adminSubstringInput);
    adminForm.appendChild(adminButton);
    adminForm.appendChild(adminDropCollectionButton);
    adminForm.appendChild(adminDownloadParticipantsButton);
}

function mountMainpage()
{
    mainpageRoot.appendChild(adminForm);
}

function dismountMainpage()
{
    mainpageForm.remove();
}

function buildPasswordpage()
{
    passwordpageForm = document.createElement("div");
    passwordpageForm.className = "mainpage-form";

    const passwordpageInputLabel = document.createElement("div");
    passwordpageInputLabel.textContent = "Введите пароль от админки:";
    passwordpageInputLabel.className = "mainpage-label-block";

    passwordpageInput = document.createElement("input");
    passwordpageInput.className = "mainpage-input";
    passwordpageInput.type = "password";

    passwordpageButton = document.createElement("button");
    passwordpageButton.className = "mainpage-button";
    passwordpageButton.textContent = "ОК";
    passwordpageButton.onclick = sendPassword;

    passwordpageForm.appendChild(passwordpageInputLabel);
    passwordpageForm.appendChild(passwordpageInput);
    passwordpageForm.appendChild(passwordpageButton);
}

function mountPasswordpage()
{
    mainpageRoot.appendChild(passwordpageForm);
}

function dismountPasswordpage()
{
    passwordpageForm.remove();
}

function updateBotStatus()
{
    if (isOn)
    {
        adminStatus.textContent = "Включен";
        adminStatus.className = "mainpage-status-on";
    }
    else
    {
        adminStatus.textContent = "Отключен";
        adminStatus.className = "mainpage-status-off";
    }
}

function updateAdminButton()
{
    console.log('Is on: '+isOn)
    if (isOn)
    {   
        adminButton.textContent = "Отключить бота";
        adminButton.onclick = turnOff;
    }
    else
    {
        adminButton.textContent = "Включить бота";
        adminButton.onclick = turnOn;
    }
}

function updateAdminDropCollectionButton()
{
    if (isOn)
    {
        adminDropCollectionButton.disabled = true;
    }
    else
    {
        adminDropCollectionButton.disabled = false;
    }
}

function updateAdminInput()
{
    if (isOn)
    {
        adminChannelInput.disabled = true;
        adminChannelInput.value = channel;
        adminSubstringInput.disabled = true;
        adminSubstringInput.value = substring;
    }
    else
    {
        adminChannelInput.disabled = false;
        adminChannelInput.value = channel;
        adminSubstringInput.disabled = false;
        adminSubstringInput.value = substring;
    }
}

function updateResized()
{
    updateCentral(adminForm,0);
    updateCentral(passwordpageForm,0);
    updateCentral(mainpageFormHeader,0);
}

function updateCentral(element)
{
    let width = document.body.offsetWidth / 3;
    if (width > 700)
        width = 700;
    if (width < 300)
        width = 300;
    
    let margin = (document.body.offsetWidth - width) / 2;
    element.style.width = (width) + "px";
    element.style.marginLeft = (margin)  + "px";
    element.style.marginRight = (margin)  + "px";
}

const sendPassword = async () =>
{
    console.log('Отправляю пароль!');

    const postData = {
        password: passwordpageInput.value
    }
    
    const responce = await axios.post('https://subday.fun/login', postData);

    console.log(responce);

    if (responce.data.correct)
    {
        console.log('Correct!');
        dismountPasswordpage();
        mountMainpage();

        isOn = responce.data.isOn;
        channel = responce.data.channel;
        password = passwordpageInput.value;
        substring = responce.data.substring;

        updateBotStatus();
        updateAdminButton();
        updateAdminInput();
        updateAdminDropCollectionButton();
    }
    else
    {
        console.log('Wrong!');
    }
}

const turnOn = async () =>
{
    const postData = {
        password: password,
        commandLine: 'turnOn',
        channel: adminChannelInput.value,
        substring: adminSubstringInput.value
    }
    
    const responce = await axios.post('https://subday.fun/manage', postData);

    if (responce.data.correct)
    {
        isOn = responce.data.isOn;
        channel = responce.data.channel;
        substring = responce.data.substring;

        updateBotStatus();
        updateAdminButton();
        updateAdminInput();
        updateAdminDropCollectionButton();
    }

    console.log(isOn);
}

const turnOff = async () =>
{
    const postData = {
        password: password,
        commandLine: 'turnOff'
    }
    
    const responce = await axios.post('https://subday.fun/manage', postData);

    console.log(responce);

    if (responce.data.correct)
    {
        isOn = responce.data.isOn;
        channel = responce.data.channel;
        substring = responce.data.substring;

        updateBotStatus();
        updateAdminButton();
        updateAdminInput();
        updateAdminDropCollectionButton();
    }

    console.log(isOn);
}

const dropCollection = async () =>
{
    const postData = {
        password: password,
        commandLine: 'dropCollection'
    }
    
    const responce = await axios.post('https://subday.fun/manage', postData);

}

const downloadParticipants = async () =>
{
    await axios.get('https://subday.fun/get-participants').then (res => {

        const participantsRaw = res.data.participantsCSV;
        let participantsProcessed = "";
        for (let i =0; i < participantsRaw.length; ++i)
        {
            participantsProcessed += participantsRaw[i].chatter + "\n";
        }
        

        const csvFile = new File([participantsProcessed], 'participants.csv', {    
        type: 'text/plain',
        });
        const csvLink = document.createElement('a');
        const csvUrl = URL.createObjectURL(csvFile);

        csvLink.href = csvUrl;
        csvLink.download = csvFile.name;
        document.body.appendChild(csvLink);
        csvLink.click();

        document.body.removeChild(csvLink);
        window.URL.revokeObjectURL(csvUrl);
        
        console.log('Got participants CSV');
        });
}