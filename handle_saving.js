
const STORAGE_NAME = 'all_data_indexed';
const MODIFYSTATE = 'modify_state';
let allData = [];
let dataModifyState = [0, true]
// data modify state, first data '(0)' is for what id to edit
// 2nd data is for create mode switch to identify if in create or edit mode

if(localStorage.getItem(STORAGE_NAME) == null){
   localStorage.setItem(STORAGE_NAME, JSON.stringify(allData));
}
if(localStorage.getItem(MODIFYSTATE) == null) localStorage.setItem(MODIFYSTATE, JSON.stringify(dataModifyState));

export const refreshData = () => {
   allData = JSON.parse(localStorage.getItem(STORAGE_NAME));
   dataModifyState = JSON.parse(localStorage.getItem(dataModifyState));
};

export const updateState = (id_edit, isCreate) => {
   dataModifyState[0] = id_edit;
   dataModifyState[1] = isCreate;
   localStorage.setItem(MODIFYSTATE, JSON.stringify(dataModifyState));
};

export const getState = () => {
   refreshData();
   return dataModifyState;
}

export const savePatientData = (patient, medical) => {
   allData.push({ data_id: allData.length, data_patient: patient, data_medical: medical });
   localStorage.setItem(STORAGE_NAME, JSON.stringify(allData));
};

export const editPatientData = (data_patient, data_medical) => {
   refreshData();
   for(let i = 0; i < allData.length; i++){
      if(dataModifyState[0] == allData[i].data_id){
         allData[i].data_patient = data_patient;
         allData[i].data_medical = data_medical
         localStorage.setItem(STORAGE_NAME, JSON.stringify(allData));
         break;
      }
   }
};