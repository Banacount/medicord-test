import { drawDocument } from "./drawDocument.js";

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
   let logoutBtn = document.getElementById("logoutBtn");
   logoutBtn.addEventListener('click', () => {
      localStorage.setItem(CURPAGE, "login");
      location.reload(true);
   });
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

   const generateBtn = document.getElementById("generateDrawing");
   const logEl = document.getElementById("inputLog");
   const infokeys1 = Object.keys(patient_info_id);

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
      } else {
         let mod_date = patient_info_id['birthDate'].value.split('-'); 
         let final_date = `${mod_date[2]}/${mod_date[1]}/${mod_date[0]}`;
         let patient = {
            'name': patient_info_id['patientName'].value, 'number': patient_info_id['patientNo'].value, 
            'address': patient_info_id['patientAddress'].value, 
            'birth_date': final_date, 'weight': patient_info_id['patientWeight'].value, 
            'height': patient_info_id['patientHeight'].value
         }
         let medicalInfo = {
            allergies: patient_info_id['medAllergy'].value,
            medicalProblems: patient_info_id['medProb'].value,
            vaccines: patient_info_id['medVac'].value,
            medications: patient_info_id['medTake'].value,
            insuranceCompany: patient_info_id['insurance'].value,
         }
         logEl.innerHTML = "";
         drawDocument("imgDoc", { patient, medicalInfo });
      }
      generateBtn.disabled = false;
      generateBtn.innerHTML = getOldText;
   });
   drawDocument("imgDoc");
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