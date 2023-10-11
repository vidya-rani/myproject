var token = "90931608|-31949332396611038|90961779";
var dbName = "SCHOOL-DB";
var relName = "STUDENT-TABLE";

// Function to reset the form
function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#address").val("");
    $("#birthDate").val("");
    $("#enrollmentDate").val("");
    $("#rollNo").prop("disabled", false);
    $("#Save").prop("disabled", true);
    $("#Update").prop("disabled", true);
    $("#reset").prop("disabled", true);
}

// Function to enable input fields
function enableInput() {
    $("#fullName").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#birthDate").prop("disabled", false);
    $("#enrollmentDate").prop("disabled", false);
    $("#reset").prop("disabled", false);
}

// Function to check if a record exists
function checkRecord() {
    var rollNoVar = $("#rollNo").val();
    if (rollNoVar === "") {
        alert("Roll No is required");
        $("#rollNo").focus();
        return;
    }

    var jsonObj = {
        rollNo: rollNoVar
    };
    var jsonStr = JSON.stringify(jsonObj);
    if (jsonStr === "") {
        return;
    }

    // Placeholder for createGET_BY_KEYRequest
    var getReqStr = createGET_BY_KEYRequest(token, dbName, relName, jsonStr, true, true);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(getReqStr, "http://api.login2explore.com:5577", "/api/irl");

    if (resultObj.status !== 200) {
        $("#Save").prop("disabled", false);
        enableInput();
    } else {
        fillData(resultObj);
    }
}

// Function to fill form data from the database
function fillData(resultObj) {
    var data = JSON.parse(resultObj.data);
    var data1 = JSON.stringify(data.record);
    var data2 = JSON.parse(data1);
    $("#rollNo").val(data2.rollNo);
    $("#fullName").val(data2.name);
    $("#class").val(data2.class);
    $("#address").val(data2.address);
    $("#birthDate").val(data2.BirthDate);
    $("#enrollmentDate").val(data2.EnrollmentDate);
    savetolocalstorage(resultObj);
    $("#rollNo").prop("disabled", true);
    $("#Save").prop("disabled", false);
    $("#Update").prop("disabled", false);
    enableInput();
}

// Function to save data to the database
function RegisterStudent() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }

    // Placeholder for createPUTRequest
    var putReqStr = createPUTRequest(token, jsonStr, dbName, relName);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, "http://api.login2explore.com:5577", "/api/iml");

    if (resultObj.status === 200) {
        alert("Data added Successfully");
        resetForm();
    } else if (resultObj.status === 401) {
        alert("Invalid Token");
    } else if (resultObj.status === 400) {
        alert("Something went wrong, Try after some time");
    }
}

// Function to update data in the database
function updateStudent(){
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }

    // Placeholder for createUPDATERecordRequest
    var putReqStr = createUPDATERecordRequest(token, jsonStr, dbName, relName, localStorage.getItem("rec_no"));

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, "http://api.login2explore.com:5577", "/api/iml");

    if (resultObj.status === 200) {
        alert("Data updated Successfully");
        resetForm();
    } else if (resultObj.status === 401) {
        alert("Invalid Token");
    } else if (resultObj.status === 400) {
        alert("Something went wrong, Try after some time");
    }
}

// Function to save record ID to local storage
function savetolocalstorage(resultObj) {
    var data = JSON.parse(resultObj.data);
    localStorage.setItem('rec_no', data.rec_no);
}

// Initialize the form on page load
resetForm();
