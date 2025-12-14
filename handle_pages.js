import { drawDocument, formatDate, downloadCanvas } from "./drawDocument.js";
import { savePatientData, editPatientData, refreshData, getState, updateState, getPatientData, deleteDataById } from "./handle_saving.js";

const CURPAGE = "curPage";
const mainRoot = document.getElementById("mainRoot");

const userLock = { "username": "admin", "password": "group5demo" }
let currentPage = "";
let pages = {
   "login": "./login.html",
   "dashboard": "./view_record.html",
   "createPage": "./create_record.html"
}
const var_nicknames = {
   patientName : 'Patient name',
   patientNo : 'Patient number',
   patientWeight : 'Patient weight',
   patientHeight : 'Patient height',
   birthDate : 'Birth date',
   patientAddress : 'Patient address',
   //Medical infos
   medAllergy: 'Allergies',   
   medProb: 'Medical problems',   
   medVac: 'Vaccines',   
   medTake: 'Regular medications',   
   insurance: 'Medical insurance' 
}

const locatePage = async (location) =>  {
   const html = await fetch(location).then((data) => data.text());
   mainRoot.innerHTML = html;
}

let numErr = 0;

//Page Functions
//Login
let loginAuth = () => {
   let loginBtn = document.getElementById("loginBtn");
   let userStr = document.getElementById("usernameInput");
   let passStr = document.getElementById("passwordInput"); 
   let logText = document.getElementById("logText");

   loginBtn.addEventListener('click', () => {
      if(userStr.value === userLock.username && passStr.value === userLock.password){
         localStorage.setItem(CURPAGE, "dashboard");
         location.reload(true);
      } else {
         logText.innerHTML = `${numErr}: Username or Password is Incorrect.`;
         numErr++;
      }
   });
   passStr.addEventListener('keydown', (e) => {
      if(e.code == "Enter"){
         if(userStr.value === userLock.username && passStr.value === userLock.password){
            localStorage.setItem(CURPAGE, "dashboard");
            location.reload(true);
         } else {
            logText.innerHTML = `${numErr}: Username or Password is Incorrect.`;
            numErr++;
         }
         passStr.blur();
      }
   });
   userStr.addEventListener('keydown', (e) => {
      if(e.code == "Enter"){
         passStr.focus();
      }
   });
}
//Dashboard
let dashboard = () => {
   updateState(0, true);
   //Handle logout
   let logoutBtn = document.getElementById("logoutBtn");
   let addBtn = document.getElementById("addRecordBtn");
   const emptyLog = document.getElementById("emptyLogView");
   logoutBtn.addEventListener('click', () => {
      localStorage.setItem(CURPAGE, "login");
      location.reload(true);
   });
   let dataIndex = JSON.parse(localStorage.getItem('all_data_indexed'));
   let manyCreated = 0;

   //Add button hehe
   addBtn.addEventListener('click', () => {
      localStorage.setItem(CURPAGE, 'createPage');
      location.reload(true);
   });

   //loop and through the patient data
   dataIndex.map((item) => {
      let recContainer = document.getElementById('recordContainer'); 
      let medRecItem = document.createElement('div');

      let recProf = document.createElement('div');

      let infoRec = document.createElement('div');
      let recName = document.createElement('div');
      let recProp = document.createElement('div');

      let recBtnCon = document.createElement('div');
      let editBtn = document.createElement('button');
      let deleteBtn = document.createElement('button');
      //Setting all the properties
      medRecItem.className = 'medical-record-item';
      recProf.className = 'record-profile';
      recProf.innerHTML = '<img src="./img/blank_profile.webp">';
      infoRec.className = 'info-in-record';
      recName.className = 'record-name';
      recProp.className = 'record-properties';
      recBtnCon.className = 'rec-btn-container';
      editBtn.className = 'edit-btn';
      deleteBtn.className = 'delete-btn';
      //Variable values
      recName.innerHTML = item.data_patient.name;
      let dateMod = new Date(item.dataModified);
      recProp.innerHTML = `Data was last updated in ${formatDate(dateMod)}.`;
      editBtn.addEventListener('click', () => {
         updateState(item.data_id, false);
         localStorage.setItem(CURPAGE, 'createPage');
         location.reload(true);
      });
      deleteBtn.addEventListener('click', () => {
         deleteDataById(item.data_id);
         location.reload(true);
      });
      //Appending yeeey
      medRecItem.appendChild(recProf);
      infoRec.appendChild(recName); infoRec.appendChild(recProp);
      medRecItem.appendChild(infoRec);
      recBtnCon.appendChild(editBtn); recBtnCon.appendChild(deleteBtn);
      medRecItem.appendChild(recBtnCon);
      recContainer.appendChild(medRecItem);
      manyCreated++;
   });
   if(manyCreated <= 0){
      console.log("Data Empty!");
      emptyLog.style.display = 'block';
   } else {
      emptyLog.style.display = 'none';
   }
}
//Create record
let createRecord = () => {
   const patient_info_id = {
      patientName : document.getElementById("patName"),
      patientNo : document.getElementById("patNo"),
      patientWeight : document.getElementById("patWeight"),
      patientHeight : document.getElementById("patHeight"),
      birthDate : document.getElementById("birthDate"),
      patientAddress : document.getElementById("patAddr"),
      //Medical infos
      medAllergy: document.getElementById("medAllergies"),   
      medProb: document.getElementById("medProblems"),   
      medVac: document.getElementById("medVaccines"),   
      medTake: document.getElementById("medTaken"),   
      insurance: document.getElementById("medInsurance") 
   }

   const homeBtn = document.getElementById("goBackBtn");
   const generateBtn = document.getElementById("generateDrawing");
   const downloadBtn = document.getElementById("downloadDrawing")
   const logEl = document.getElementById("inputLog");
   const infokeys1 = Object.keys(patient_info_id);

   let drawcanv = document.getElementById("imgDoc");
   drawcanv.style.display = "none";
   downloadBtn.style.display = "none";
   //Check if on edit mode and append data to elements
   /*
   */
   if(!getState()[1]){
      let theData = getPatientData();
      if(theData && theData.data_patient && theData.data_medical){
         let patientGet = theData.data_patient;
         let medicalGet = theData.data_medical;
         //Append patient infos
         patient_info_id.patientName.value = patientGet['name'];
         patient_info_id.patientNo.value = patientGet['number'];
         patient_info_id.patientAddress.value = patientGet['address'];
         patient_info_id.birthDate.value = patientGet['birth_date'] || "";
         patient_info_id.patientWeight.value = patientGet['weight'];
         patient_info_id.patientHeight.value = patientGet['height'];
         //Append medical infos
         patient_info_id.medAllergy.value = medicalGet['allergies'];
         patient_info_id.medProb.value = medicalGet['medicalProblems'];
         patient_info_id.medVac.value = medicalGet['vaccines'];
         patient_info_id.medTake.value = medicalGet['medications'];
         patient_info_id.insurance.value = medicalGet['insuranceCompany'];
      }
   }

   generateBtn.addEventListener('click', () => {
      let getOldText = generateBtn.innerText;
      let blankSpot = false; let allblanks = [];

      generateBtn.innerHTML = "Loading..";
      generateBtn.disabled = true;
      infokeys1.map((item) => {
         console.log(`${item}: ${patient_info_id[item].value}`);
         if(patient_info_id[item].value.trim() == "" && item != "insurance"){
            blankSpot = true;
            allblanks.push(var_nicknames[item]);
         }
      });

      if(blankSpot){
         logEl.innerHTML = `Blank: ${allblanks.join(', ')}`;
         drawcanv.style.display = "none";
      } else {
         let patient = {
            'name': patient_info_id['patientName'].value, 'number': patient_info_id['patientNo'].value, 
            'address': patient_info_id['patientAddress'].value, 
            'birth_date': patient_info_id['birthDate'].value, 'weight': patient_info_id['patientWeight'].value, 
            'height': patient_info_id['patientHeight'].value
         }
         let medicalInfo = {
            allergies: patient_info_id['medAllergy'].value,
            medicalProblems: patient_info_id['medProb'].value,
            vaccines: patient_info_id['medVac'].value,
            medications: patient_info_id['medTake'].value,
            insuranceCompany: patient_info_id['insurance'].value,
         }
         drawDocument("imgDoc", { patient, medicalInfo });
         downloadBtn.style.display = 'block';
         drawcanv.style.display = "block";
         if(getState()[1]){
            savePatientData(patient, medicalInfo);
         } else {
            editPatientData(patient, medicalInfo);
         }
         logEl.innerHTML = "Data saved!";
      }
      generateBtn.disabled = false;
      generateBtn.innerHTML = getOldText;
   });
   //Home frfr
   homeBtn.addEventListener('click', () => {
      localStorage.setItem(CURPAGE, 'dashboard');
      location.reload(true);
   });
   //Download button
   downloadBtn.addEventListener('click', () => {
      downloadCanvas("imgDoc", "medical_record.png");
   });
}

//Check if curPage variable exists in localStorage
if(localStorage.getItem(CURPAGE) === null){
   console.log("First time. Creating CURRENTPAGE variable.");
   localStorage.setItem(CURPAGE, "login");
   currentPage = "login";
} else {
   currentPage = localStorage.getItem(CURPAGE);
}

//Load page init
const init = async () => {
   await locatePage(pages[currentPage]); // <-- Await the content load

   if(currentPage === "login") loginAuth();
   else if(currentPage === "dashboard") dashboard();
   else if(currentPage === "createPage") createRecord();
}

init();