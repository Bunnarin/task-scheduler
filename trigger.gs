function report_back() { //everynight
  // skip weekend
  const now = new Date();
  const dayOfWeek = now.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {return}

  lyvanTime = lyvanTaskSheet.getRange("D5").getValue();
  moleeTime = moleeTaskSheet.getRange("D5").getValue();
  send_text(adminId, `lyvan: ${lyvanTime} mn\nmolee: ${moleeTime} mn`);
}

function remove_expired(){ //everynight
  const taskList = {read: 2, write: 3, hw: 4}
  for (const task in taskList) {
    const rowIndex = taskList[task];
    const lyvanMsgId = lyvanTaskSheet.getRange(rowIndex, 5);
    const moleeMsgId = lyvanTaskSheet.getRange(rowIndex, 5);
    // kill the prompt
    if (lyvanMsgId) { kill_prompt(lyvanMsgId) }
    if (moleeMsgId) { kill_prompt(moleeMsgId) }
  }
  // remove all the temp msgId
  lyvanTaskSheet.getRange("E2:E4").setValue('');
  moleeTaskSheet.getRange("E2:E4").setValue('');
}

function update_tasks() { //every morning
  const taskObj = get_today_task();
  update_task_board(taskObj);
  // call update_form on the form interface
  for (const person in taskObj) {
    const sheet = taskObj[person]["sheet"];
    const taskTypes = taskObj[person]["taskTypes"];
    for (const taskType in taskTypes) {
      const taskIndex = taskObj[person]["taskTypes"][taskType];
      const taskName = `${person} ${taskType}`;
      const taskContent = sheet.getRange(taskIndex, 2).getValue();
      update_form(taskName, taskContent);
    }
  }
}

function get_verify() { //when form is submitted, must not run by yourself
  responseSheet.deleteRow(2);
  const responseData = responseSheet.getDataRange().getValues();
  let row = responseData[1];
  let person = row[1];
  let taskType = row[2];
  const taskSheet = person === 'lyvan' ? lyvanTaskSheet : moleeTaskSheet;
  let rowIndex;
  switch (taskType) {
    case "read": rowIndex = 2; break;
    case "write": rowIndex = 3; break;
    default: rowIndex = 4;
  }
  // kill the last prompt
  const msgIdCell = taskSheet.getRange(rowIndex, 5);
  const oldMsgId = msgIdCell.getValue();
  if (oldMsgId) { kill_prompt(oldMsgId) }
  // send the package
  send_ptean(person, taskType);
  send_answers(taskType);
  const newMsgId = send_verify(person, taskType);
  // update the messageId to kill later
  msgIdCell.setValue(newMsgId);
}
