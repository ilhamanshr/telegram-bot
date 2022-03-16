exports.SUCCESS_SERVER_RESPONSE        = { "code": 0, "message": "Success", "content": {} };
exports.SUCCESS_SERVER_DATA_NOT_FOUND  = { "code": 0, "message": "Data not found", "content": {} };
exports.ERR_SERVER_RESPONSE            = { "code": -1, "message": "Something error", "content": {} };
exports.ERR_SERVER_INVALID_ACTION      = { "code": -2, "message": "Invalid action", "content": {} };
exports.ERR_SERVER_INVALID_SUBACTION   = { "code": -3, "message": "Invalid sub-action", "content": {} };
exports.ERR_SERVER_BAD_REQUEST         = { "code": 400, "message": "Invalid request parameter", "content": {} };
exports.ERR_SERVER_UNAUTHORIZED        = { "code": 401, "message": "Unauthorized", "content": {} };
exports.ERR_SERVER_FORBIDDEN           = { "code": 403, "message": "Access denied", "content": {} };
exports.ERR_SERVER_BAD_GATEWAY         = { "code": 502, "message": "Something is wrong on back end", "content": {} };
exports.ERR_SERVER_GATEWAY_TIMEOUT     = { "code": 504, "message": "Request timeout from back end", "content": {} };

exports.SUCCESS_RESPONSE            = "Success";
exports.SUCCESS_DATA_NOT_FOUND      = "Data not found";
exports.ERR_RESPONSE                = "Something error";
exports.ERR_INVALID_ACTION          = "Invalid action";
exports.ERR_INVALID_SUBACTION       = "Invalid sub-action";
exports.ERR_BAD_REQUEST             = "Invalid request parameter";
exports.ERR_UNAUTHORIZED            = "Your session has expired. please login and try again.";
exports.ERR_FORBIDDEN               = "Sorry, you are not allowed to accessing me";
exports.ERR_FORBIDDEN_APPLICATION   = "Sorry, you are not allowed to accessing application";
exports.ERR_BAD_GATEWAY             = "Something wrong on backend, please contact admin.";
exports.ERR_GATEWAY_TIMEOUT         = "Request timeout from back end";

exports.ERR_WRONG_COMMAND = "Wrong command, Please send <b>/help</b> to view available commands.";

exports.START_CHAT = [
    "Congratulation", 
    "your account is registered. Please send /help to view available commands."
];
exports.HELP_CHAT = [
    "<b>Wellcome to Folkatech Bot</b>",
    "",
    "You can control me by sending these commands:",
    "",
    "<b>/input</b> - <i>to see input format</i>",
    "<b>/data</b> - <i>to see your data</i>",
    "<b>/update</b> - <i>to see update format</i>",
    "<b>/delete</b> - <i>to see delete format</i>",
    "<b>/evidence</b> - <i>to see evidence format</i>",
];

exports.INPUT_CHAT = [
    "Format Input",
    "<b>Nomor Tiket|Nomor Inet|Material|Jumlah|ODP|ID Teknisi</b>",
    "",
    "<i>Example:</i>",
    "<b>IN329857389|17210123456789|drop core|20|ODP-PSM-FAQ/011|938290019</b>",
    "",
    "<i>Notes:</i>",
    "<b>Nomor Tiket</b>: <i>Nomor Tiket data to be input (Required)</i>",
    "<b>Nomor Inet</b>: <i>Nomor Inet to be input (Required)</i>",
    "<b>Material</b>: <i>Material to be input (Required)</i>",
    "<b>Jumlah</b>: <i>Jumlah to be input (Required)</i>",
    "<b>ODP</b>: <i>ODP to be input (Required)</i>",
    "<b>ID Teknisi</b> <i>: ID Teknisi to be input (Required)</i>",
];

exports.SUCCESS_INPUT = [
    "Input Data Success!",
    "Type /data to see your data."
];

exports.FAILED_INPUT = [
    "Wrong Input Format,",
    "Please type /input to see the correct format."
];

exports.FAILED_INPUT_DUPLICATE = [
    "Failed Input,",
    "Nomor Tiket already exist, type /data to see your data."
];

exports.UPDATE_CHAT = [
    "Format Update",
    "<b>Nomor Tiket:Nomor Inet:Material:Jumlah:ODP:ID Teknisi</b>",
    "",
    "<i>Example:</i>",
    "<b>IN329857389:17210123456789:drop core:20:ODP-PSM-FAQ/011:938290019</b> <i>(update all data)</i>",
    "<b>IN329857389::up core:25::</b>  <i>(only update data Material and Jumlah)</i>",
    "",
    "<i>Notes:</i>",
    "<b>Nomor Tiket</b>: <i>Nomor Tiket data to be update (Required)</i>",
    "<b>Nomor Inet</b>: <i>Type this if you want to update Nomor Inet (Optional)</i>",
    "<b>Material</b>: <i>Type this if you want to update Material (Optional)</i>",
    "<b>Jumlah</b>: <i>Type this if you want to update Jumlah (Optional)</i>",
    "<b>ODP</b>: <i>Type this if you want to update ODP (Optional)</i>",
    "<b>ID</b> <i>Teknisi: Type this if you want to update ID Teknisi (Optional)</i>",
];

exports.SUCCESS_UPDATE = [
    "Update Data Success!",
    "Type /data to see your data."
];

exports.FAILED_UPDATE = [
    "Wrong Update Format,",
    "Please type /update to see the correct format."
]

exports.FAILED_UPDATE_NOT_FOUND = [
    "Failed Update Nomor Tiket not found,",
    "Please type /data to find Nomor Tiket to be update."
]

exports.DELETE_CHAT = [
    "Format Delete",
    "<b>Nomor Tiket!</b>",
    "",
    "<i>Example:</i>",
    "<b>IN329857391!</b>",
    "",
    "<i>Notes:</i>",
    "<b>Nomor Tiket</b>: <i>Nomor Tiket data to be delete (Required)</i>",
];

exports.SUCCESS_DELETE = [
    "Delete Data Success!",
    "Type /data to see your data."
];

exports.FAILED_DELETE = [
    "Wrong Delete Format,",
    "Please type /delete to see the correct format."
];

exports.FAILED_DELETE_NOT_FOUND = [
    "Failed Delete Nomor Tiket not found,",
    "Please type /data to find Nomor Tiket to be delete."
];

exports.EVIDENCE_CHAT = [
    "Format Evidence",
    "<b>/evidence Nomor Tiket</b>",
    "<b>-Send Your Photo-</b>",
    "",
    "<i>Example:</i>",
    "<b>/evidence IN329857391</b>",
    "<b>-Your Photo-</b>",
    "",
    "<i>Notes:</i>",
    "<b>Nomor Tiket</b>: <i>Nomor Tiket data to be evidenced (Required)</i>",
];

exports.SUCCESS_EVIDENCE = [
    "Sent Evidence Photo Success!",
    "Type /data to see your data."
];

exports.FAILED_EVIDENCE = [
    "Wrong Evidence Format,",
    "Please type /evidence to see the correct format."
];

exports.FAILED_EVIDENCE_NOT_FOUND = [
    "Failed evidence, Nomor Tiket which need evidence not found,",
    "Please type /data to find Nomor Tiket to be evidenced."
];

exports.DOCUMENT_CHAT = [
    "Format Document",
    "<b>/document Nomor Tiket</b>",
    "<b>-Send Your Document-</b>",
    "",
    "<i>Example:</i>",
    "<b>/document IN329857391</b>",
    "<b>-Your Document-</b>",
    "",
    "<i>Notes:</i>",
    "<b>Nomor Tiket</b>: <i>Nomor Tiket data to be documented (Required)</i>",
];

exports.SUCCESS_DOCUMENT = [
    "Sent Document Success!",
    "Type /data to see your data."
];

exports.FAILED_DOCUMENT_NOT_FOUND = [
    "Failed document, Nomor Tiket which need document not found,",
    "Please type /data to find Nomor Tiket to be documented."
];

exports.FAILED_DOCUMENT = [
    "Wrong Document Format,",
    "Please type /document to see the correct format."
];

exports.LIST_DATA = [
    "<b>Nomor Tiket|Nomor Inet|Material|Jumlah|ODP|ID Teknisi|Reported Date|Action|Status</b>",
    ""
];