document.forms.register.noValidate = true;
document.getElementById("showUsers").style.visibility = "hidden";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("showUsers").click();
});
// Dialog for the add user button

document.getElementById("addNewUser").addEventListener("click", function () {
  dialogNewUser.dialog("open");
});

let dialogNewUser = $("#addNewUserDialog").dialog({
  modal: true,
  resizable: false,
  title: "Add User",
  autoOpen: false,
  open: function () {
    $("#buttonSubmitUser").focus();
  },
});

// Form and Validation

document.getElementById("formUser").addEventListener("submit", function (e) {
  e.preventDefault();
  let valFirst = document.getElementById("fname");
  let valLast = document.getElementById("lname");
  let valAge = document.getElementById("age");
  let valEmail = document.getElementById("email");

  let errorFirstName = document.getElementById("firstname");
  let errorLastName = document.getElementById("lastname");
  let errorAge = document.getElementById("ageSpan");
  let errorEmail = document.getElementById("emailSpan");

  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  let dataPost = {};

  errorFirstName.innerHTML = "";
  errorLastName.innerHTML = "";
  errorAge.innerHTML = "";
  errorEmail.innerHTML = "";
  let valid = [];

  // Validation

  if (valFirst.value == null || valFirst.value == "") {
    errorFirstName.innerHTML = "First Name is required";
    e.preventDefault();
    valid.push("false");
  } else {
    valid.push("true");
    dataPost.fname = valFirst.value;
    valFirst.value = "";
  }

  if (valLast.value == null || valLast.value == "") {
    errorLastName.innerHTML = "Last Name is required";
    e.preventDefault();
    valid.push("false");
  } else {
    valid.push("true");
    dataPost.lname = valLast.value;
    valLast.value = "";
  }

  function getAge(dateOfBirth) {
    var todayDate = new Date();
    var birthDate = new Date(dateOfBirth);
    var age = todayDate.getFullYear() - birthDate.getFullYear();
    var monthDate = todayDate.getMonth() - birthDate.getMonth();
    if (
      monthDate < 0 ||
      (monthDate === 0 && todayDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  let enteredValue = valAge.value;
  let enteredAge = getAge(enteredValue);

  if (valAge.value == null || valAge.value == "") {
    errorAge.innerHTML = "Age is required";
    e.preventDefault();
    valid.push("false");
  } else if (enteredAge < 18) {
    errorAge.innerHTML = "You need to be 18 years or over";
    e.preventDefault();
    valid.push("false");
  } else {
    valid.push("true");
    dataPost.age = valAge.value;
    valAge.value = "";
  }

  if (valEmail.value == null || valEmail.value == "") {
    errorEmail.innerHTML = "Email is required";
    e.preventDefault();
    valid.push("false");
  } else if (!valEmail.value.match(validRegex)) {
    errorEmail.innerHTML = "Email is not valid";
    e.preventDefault();
    valid.push("false");
  } else {
    valid.push("true");
    dataPost.email = valEmail.value;
    valEmail.value = "";
  }

  function checkData(element) {
    return element === "true";
  }

  // If validation is OK then send to database

  if (valid.every(checkData)) {
    fetch(
      "https://formvalidation-197a7-default-rtdb.europe-west1.firebasedatabase.app/users.json",
      {
        method: "POST",
        body: JSON.stringify(dataPost),
      }
    ).then((resp) => dialogLoading.dialog("open"));
    dialogNewUser.dialog("close");

    //document.getElementById("showUsers").click());
  }
});

// Transform database data to display in table

const transformData = (data) => {
  const transformedData = [];

  for (const key in data) {
    const dataObj = {
      id: key,
      ...data[key],
    };

    transformedData.push(dataObj);
  }

  let temp = "";

  for (let i = 0; i < transformedData.length; i++) {
    temp += "<tr>";
    temp += "<td>" + transformedData[i].fname + "</td>";
    temp += "<td>" + transformedData[i].lname + "</td>";
    temp += "<td>" + transformedData[i].age + "</td>";
    temp += "<td>" + transformedData[i].email + "</td>";
    temp +=
      "<td> <button type='button' id=" +
      transformedData[i].id +
      " " +
      "class='buttonDelete'>Delete</button> </td>";
    temp +=
      "<td> <button type='button' class='buttonModifyUser'>Modify</button> </td>";
    temp +=
      "<td> <button type='button' class='buttonShowUser'>Show</button> </td></tr>";
  }
  document.getElementById("data").innerHTML = temp;

  // Button to display user information in a dialog

  let buttonsShow = document.querySelectorAll(".buttonShowUser");

  let valFirstDialogShow = document.getElementById("fnameDialogShow");
  let valLastDialogShow = document.getElementById("lnameDialogShow");
  let valAgeDialogShow = document.getElementById("ageDialogShow");
  let valEmailDialogShow = document.getElementById("emailDialogShow");

  let dialogShowUser = $("#dialogShowUser").dialog({
    autoOpen: false,
    dialogClass: "no-close",
    modal: true,
    buttons: [
      {
        text: "Close",
        click: function () {
          $(this).dialog("close");
        },
      },
    ],
  });
  for (let i = 0; i < buttonsShow.length; i++) {
    buttonsShow[i].addEventListener("click", function () {
      valFirstDialogShow.value = transformedData[i].fname;
      valLastDialogShow.value = transformedData[i].lname;
      valAgeDialogShow.value = transformedData[i].age;
      valEmailDialogShow.value = transformedData[i].email;

      dialogShowUser.dialog("open");
    });
  }

  // Button to display user information in a dialog and MODIFY IT

  let buttonsModify = document.querySelectorAll(".buttonModifyUser");

  let valFirstDialogModify = document.getElementById("fnameDialogModify");
  let valLastDialogModify = document.getElementById("lnameDialogModify");
  let valAgeDialogModify = document.getElementById("ageDialogModify");
  let valEmailDialogModify = document.getElementById("emailDialogModify");

  let errorFirstNameDialog = document.getElementById("errorFnameDialog");
  let errorLastNameDialog = document.getElementById("errorLnameDialog");
  let errorAgeDialog = document.getElementById("errorAgeDialog");
  let errorEmailDialog = document.getElementById("errorEmailDialog");

  let validRegexEmailDialog =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  let actualIdUser;

  let dialogModifyUser = $("#dialogModifyUser").dialog({
    autoOpen: false,
    dialogClass: "no-close",
    modal: true,
    buttons: [
      {
        text: "Modify User",
        click: function () {
          modifyUser(actualIdUser);
        },
      },
      {
        text: "Close",
        click: function () {
          $(this).dialog("close");
        },
      },
    ],
  });

  for (let i = 0; i < buttonsModify.length; i++) {
    buttonsModify[i].addEventListener("click", function () {
      valFirstDialogModify.value = transformedData[i].fname;
      valLastDialogModify.value = transformedData[i].lname;
      valAgeDialogModify.value = transformedData[i].age;
      valEmailDialogModify.value = transformedData[i].email;
      actualIdUser = transformedData[i].id;

      errorFirstNameDialog.innerHTML = "";
      errorLastNameDialog.innerHTML = "";
      errorAgeDialog.innerHTML = "";
      errorEmailDialog.innerHTML = "";

      dialogModifyUser.dialog("open");
    });
  }

  function modifyUser(userId) {
    errorFirstNameDialog.innerHTML = "";
    errorLastNameDialog.innerHTML = "";
    errorAgeDialog.innerHTML = "";
    errorEmailDialog.innerHTML = "";
    let validDialog = [];

    const dataToModify = {
      fname: document.getElementById("fnameDialogModify").value,
      lname: document.getElementById("lnameDialogModify").value,
      age: document.getElementById("ageDialogModify").value,
      email: document.getElementById("emailDialogModify").value,
    };

    if (
      valFirstDialogModify.value == null ||
      valFirstDialogModify.value == ""
    ) {
      errorFirstNameDialog.innerHTML = "First Name is required";
      validDialog.push("false");
    } else {
      validDialog.push("true");
      dataToModify["fname"] =
        document.getElementById("fnameDialogModify").value;
    }

    if (valLastDialogModify.value == null || valLastDialogModify.value == "") {
      errorLastNameDialog.innerHTML = "Last Name is required";
      validDialog.push("false");
    } else {
      validDialog.push("true");
      dataToModify["lname"] =
        document.getElementById("lnameDialogModify").value;
    }

    function getAgeDialog(dateOfBirth) {
      var todayDate = new Date();
      var birthDate = new Date(dateOfBirth);
      var age = todayDate.getFullYear() - birthDate.getFullYear();
      var monthDate = todayDate.getMonth() - birthDate.getMonth();
      if (
        monthDate < 0 ||
        (monthDate === 0 && todayDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    }

    let actualValue = valAgeDialogModify.value;
    let actualAge = getAgeDialog(actualValue);

    if (valAgeDialogModify.value == null || valAgeDialogModify.value == "") {
      errorAgeDialog.innerHTML = "Age is required";
      e.preventDefault();
      validDialog.push("false");
    } else if (actualAge < 18) {
      errorAgeDialog.innerHTML = "You need to be 18 years or over";
      e.preventDefault();
      validDialog.push("false");
    } else {
      validDialog.push("true");
      dataToModify["age"] = document.getElementById("ageDialogModify").value;
    }

    if (
      valEmailDialogModify.value == null ||
      valEmailDialogModify.value == ""
    ) {
      errorEmailDialog.innerHTML = "Email is required";
      validDialog.push("false");
    } else if (!valEmailDialogModify.value.match(validRegexEmailDialog)) {
      errorEmailDialog.innerHTML = "Email is not valid";
      validDialog.push("false");
    } else {
      validDialog.push("true");
      dataToModify["email"] =
        document.getElementById("emailDialogModify").value;
    }

    function checkDataDialog(element) {
      return element === "true";
    }

    if (validDialog.every(checkDataDialog)) {
      fetch(
        "https://formvalidation-197a7-default-rtdb.europe-west1.firebasedatabase.app/users/" +
          userId +
          ".json",
        { method: "PUT", body: JSON.stringify(dataToModify) }
      ).then((resp) => {
        dialogLoading.dialog("open");
        // document.getElementById("showUsers").click();
      });
      dialogModifyUser.dialog("close");
    }
  }

  // Button to delete a user entry in the database

  for (let i = 0; i < transformedData.length; i++) {
    document
      .getElementById(transformedData[i].id)
      .addEventListener("click", function (e) {
        deleteUser(e.target.id);
      });
  }

  function deleteUser(userId) {
    fetch(
      "https://formvalidation-197a7-default-rtdb.europe-west1.firebasedatabase.app/users/" +
        userId +
        ".json",
      { method: "DELETE" }
    ).then((resp) => {
      dialogLoading.dialog("open");
      // document.getElementById("showUsers").click();
    });
  }
};

// Get data from the database and call the "transformData" function to display the information in the table

document.getElementById("showUsers").addEventListener("click", function (e) {
  fetch(
    "https://formvalidation-197a7-default-rtdb.europe-west1.firebasedatabase.app/users.json",
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => transformData(data));
});

// Search bar code

document.getElementById("searchBar").addEventListener("keyup", function () {
  let searchBar = document.getElementById("searchBar");
  let filterUser = searchBar.value.toUpperCase();
  let tableUsers = document.getElementById("tableUsers");
  let tableRow = tableUsers.getElementsByTagName("tr");

  for (let i = 0; i < tableRow.length; i++) {
    tableDataFname = tableRow[i].getElementsByTagName("td")[0];
    tableDataLname = tableRow[i].getElementsByTagName("td")[1];
    if (tableDataFname && tableDataLname) {
      let valueFname = tableDataFname.textContent || tableDataFname.innerText;
      let valueLname = tableDataLname.textContent || tableDataLname.innerText;
      valueFname = valueFname.toUpperCase();
      valueLname = valueLname.toUpperCase();

      if (
        valueFname.indexOf(filterUser) > -1 ||
        valueLname.indexOf(filterUser) > -1
      ) {
        tableRow[i].style.display = "";
      } else {
        tableRow[i].style.display = "none";
      }
    }
  }
});

// Tooltip code to show "title" on inputs

$(function () {
  $("#fname, #lname, #age, #email").tooltip({
    position: {
      my: "left top",
      at: "right+5 top-5",
      collision: "none",
    },
  });
});

// Progressbar whit Dialog from Jquery UI
$(function () {
  let loadingBar = $("#loadingBar");

  loadingBar.progressbar({
    value: false,
  });
});

let dialogLoading = $("#dialogLoading").dialog({
  modal: true,
  resizable: false,
  dialogClass: "no-close",
  title: "Wait please...",
  autoOpen: false,
  open: function () {
    setTimeout(function () {
      document.getElementById("showUsers").click();
      $("#dialogLoading").dialog("close");
    }, 2000);
  },
});
