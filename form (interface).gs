function update_form(targetTitle, ptean) {
  var items = form.getItems();
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.getTitle() == targetTitle) {
      item.setHelpText(ptean);
      return;
    }
  }
}
