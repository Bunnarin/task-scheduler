function send_file(fileId, mediaType) {
  const telegramApiMethod = mediaType === 'audio' ? 'sendAudio' : 'sendPhoto';
  const url = `https://api.telegram.org/bot${botToken}/${telegramApiMethod}`;
  const file = DriveApp.getFileById(fileId);
  const fileBlob = file.getBlob();
  const payload = {
    chat_id: grpId,
    [mediaType]: fileBlob,
  };
  const options = {
    method: 'post',
    payload: payload,
  };
  UrlFetchApp.fetch(url, options);
}

function send_text(chatId, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const options = {
    method: 'post',
    payload: {
      chat_id: chatId,
      text: text,
    },
    muteHttpExceptions: true,
  };
  UrlFetchApp.fetch(url, options);
}

function send_verify(person, taskType) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  let caption;
  switch (taskType) {
    case "read": caption = "អានត្រូវឬទេ?"; break;
    case "write": caption = "សរសេរអានដាច់ឬទេ?"; break;
    default: caption = "កិច្ចការផ្ទះធ្វើត្រូវដែរឬទេ?";
  }
  const payload = {
    chat_id: grpId,
    text: caption,
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'ត្រូវ', callback_data: `${person},${taskType},ត្រូវ` }],
        [{ text: 'ខុស', callback_data: `${person},${taskType},ខុស` }],
      ],
    }),
  };

  const options = {
    method: 'post',
    payload: payload,
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseJson = JSON.parse(response.getContentText());
  return messageId = responseJson.result.message_id;
}

function answer_callback(callbackQueryId){
  const urlAnswer = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;
  const payloadAnswer = {
    callback_query_id: callbackQueryId,
    text: 'callback done', // Optional user feedback
  };
  const optionsAnswer = {
    method: 'post',
    payload: payloadAnswer,
    muteHttpExceptions: false,
  };
  UrlFetchApp.fetch(urlAnswer, optionsAnswer);
}

function edit_message(messageId, params){
  const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
  const new_params = params.replace(/(,)(ត្រូវ|ខុស)$/, (_, c, value) => c + (value === 'ត្រូវ' ? 'ខុស' : 'ត្រូវ')); //embed the reverse params for when the user change their answer
  const payload = {
    chat_id: grpId,
    message_id: messageId,
    text: params,
    reply_markup: JSON.stringify({ inline_keyboard: [[{ text: 'ប្ដូរចម្លើយ', callback_data: new_params }],],}),
  };
  const options = {
    method: 'post',
    payload: payload,
    muteHttpExceptions: false,
  };
  UrlFetchApp.fetch(url, options);
}

function kill_prompt(messageId){
  const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
  const payload = {
    chat_id: grpId,
    message_id: messageId,
    text: "កិច្ចការនេះមិនបាច់ពិនិត្យទៀតទេ",
  };
  const options = {
    method: 'post',
    payload: payload,
    muteHttpExceptions: false,
  };
  UrlFetchApp.fetch(url, options);
}