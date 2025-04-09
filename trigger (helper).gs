// get_verify
function send_answers(taskType) { //helper
  const responseData = responseSheet.getDataRange().getValues();
  const row = responseData[1];
  const mediaType = taskType === 'read' ? 'audio' : 'photo'; //by default
  let urlIndex;
  switch (taskType) {
    case "read": urlIndex = 3; break;
    case "write": urlIndex = 4; break;
    default: urlIndex = 7;
  }
  let urlList = row[urlIndex];
  let urls = urlList.split(', ');
  const regex = /id=([^&]*)/;
  for (let i = 0; i < urls.length; i++) {
    const match = urls[i].match(regex);
    const fileId = match[1];
    send_file(fileId, mediaType);
    Drive.Files.remove(fileId);
  }
}

function send_ptean(person, taskType){
  if (taskType == 'hw') { return } //skip hw task
  const taskSheet = person === 'lyvan' ? lyvanTaskSheet : moleeTaskSheet;
  const taskRowIndex = taskType === 'read' ? 2 : 3;
  const pteanCol = 3;
  const ptean = taskSheet.getRange(taskRowIndex, pteanCol).getValue();
  send_text(grpId, `ប្រធាន៖ \n ${ptean}`);
}

// update_tasks
function get_today_task(){
  const readColIndex = 2;
  const writeColIndex = 3;

  return taskObj = {
    lyvan: {
      taskSheet: lyvanTaskSheet,
      sheet: lyvanSheet,
      taskTypes: {
        read: get_ptean_index(lyvanSheet, readColIndex),
        write: get_ptean_index(lyvanSheet, writeColIndex)
      }
    },
    molee: {
      taskSheet: moleeTaskSheet,
      sheet: moleeSheet,
      taskTypes: {
        read: get_ptean_index(moleeSheet, readColIndex),
        write: get_ptean_index(moleeSheet, writeColIndex)
      }
    }
  };
}

function update_task_board(taskObj){
  for(const person in taskObj){
    const taskSheet = taskObj[person]["taskSheet"];
    const sheet = taskObj[person]["sheet"];
    // reset the HW status first
    sheet.getRange("E2").setValue(false);
    // update the index of each person's taskboard
    let rowIndex = 2;
    const colIndex = 2;
    const taskTypes = taskObj[person]["taskTypes"];
    for(const taskType in taskTypes){
      const taskIndex = taskTypes[taskType];
      taskSheet.getRange(rowIndex, colIndex).setValue(taskIndex);
      rowIndex++;
    }
  }
}

// get_today_task's helper
function get_ptean_index(sheet, colIndex)
{
  const data = sheet.getDataRange().getValues();
  for (let i=2; i < data.length; i++)
  {
    const currentCell = data[i][colIndex];
    if (currentCell) { continue }
    return i+1; //return the task that hasn't been ticked 
  }
  // alert me when out of ptean
  send_text(adminId, "alert: out of ptean");
}