// docs
const form = FormApp.openById("1It9M8E__Rj24Fw_Sp_8CUdP33XSzvxqSJuFGswjrz9I");
const ss = SpreadsheetApp.openById("1t8GKmftek4yHYzUwWMYQwak9ZpQJDrdu4wrlSyOrepY");
const lyvanSheet = ss.getSheetByName("lyvan DB");
const moleeSheet = ss.getSheetByName("molee DB");
let lyvanTaskSheet = ss.getSheetByName("lyvan task");
let moleeTaskSheet = ss.getSheetByName("molee task");
const responseSheet = ss.getSheetByName("response");
// bot
const botToken = '7564002422:AAHfOfyLb8LN87t0tK5Xo-3uLHmQAwbNKeU';
const grpId = '-1002327323978';
const adminId = '825410603';
const clientId = '1136339496';
