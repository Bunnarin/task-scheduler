
function update_db(params='molee,read,ខុស') {
  let parts = params.split(',');
  let person = parts[0];
  let taskType = parts[1];
  let kh_status = parts[2];
  const sheet = person === 'lyvan' ? lyvanSheet : moleeSheet;
  const bool_status = kh_status === 'ត្រូវ' ? true : false;
  // process the HW taskType first
  if (taskType == "hw") { return sheet.getRange('E2').setValue(bool_status) }
  const taskSheet = person === 'lyvan' ? lyvanTaskSheet : moleeTaskSheet;
  //get today task id from the tasksheet, then use it to tick the task status in the db
  let taskIdIndex = taskType === 'read' ? 2 : 3; 
  let taskRowIndex = taskSheet.getRange(taskIdIndex, 2).getValue();
  let taskColIndex = taskType === 'read' ? 3 : 4;
  sheet.getRange(taskRowIndex, taskColIndex).setValue(bool_status);
}

function update_client_status(params='lyvan,read,ខុស'){
  // read the today task and update on the qs
  let person = params.split(',')[0];
  let taskSheet = person === 'lyvan' ? lyvanTaskSheet : moleeTaskSheet;
  const taskList = { read: false, write: false, hw: false };
  const col = 4;
  let row = 2;
  let time = taskSheet.getRange("D5").getValue();
  let statusText = `${time}mn, `;
  for (const task in taskList) {
    let taskStatus = taskSheet.getRange(row, col).getValue();
    let taskStatusSimple = taskStatus === true ? "✅" : "❌";
    statusText += `${task}:${taskStatusSimple}, `
    row++;
  }
  update_form(`${person} status`, statusText);
}

