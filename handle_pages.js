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

//Handle different pages
locatePage(pages[currentPage]);
setTimeout(() => {
   if(currentPage === "login") loginAuth();
   else if(currentPage === "dashboard") dashboard();
   else if(currentPage === "createPage") createRecord();
}, 650);