
function doPost(e) {
  const update = JSON.parse(e.postData.contents);
  if (update && update.callback_query) { //this is from the verifier
    const callbackQueryId = update.callback_query.id;
    const messageId = update.callback_query.message.message_id; // Get the ID of the message with the buttons
    const params = update.callback_query.data; // The data associated with the clicked button
    answer_callback(callbackQueryId);
    edit_message(messageId, params);
    update_db(params);
    update_client_status(params);
    send_text(clientId, params); //let the kids know the result
  }
}

// Run this to set up the webhook and initial config
function setup_webhook() {  // set webhook
  const webhookUrl = 'https://script.google.com/macros/s/AKfycbyLiEp6lX0VtN46drE9m-c5ir2QJwEPnLMGPWLx0wiGd4x_GBV_oqxpRxfdnGIfHSKb-w/exec';
  const url = `https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`;
  const response = UrlFetchApp.fetch(url);
  console.log(response.getContentText());
}