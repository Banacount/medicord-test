
const mainRoot = document.getElementById("mainRoot");

const userLock = { "username": "admin", "password": "group5demo" }
let pages = {
   "login": "./login.html",
   "dashboard": "./view_record.html"
}

const locatePage = async (location) =>  {
   const html = await fetch(location).then((data) => data.text());
   mainRoot.innerHTML = html;
}

locatePage(pages["login"]);