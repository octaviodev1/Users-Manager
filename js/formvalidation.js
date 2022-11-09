document.forms.register.noValidate = true;
document.getElementById("showUsers").style.visibility = "hidden";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("showUsers").click();
});

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

  if (valAge.value == null || valAge.value == "") {
    errorAge.innerHTML = "Age is required";
    e.preventDefault();
    valid.push("false");
  } else if (valAge.value < 0) {
    errorAge.innerHTML = "Age is not valid";
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

  if (valid.every(checkData)) {
    fetch(
      "https://formvalidation-197a7-default-rtdb.europe-west1.firebasedatabase.app/users.json",
      {
        method: "POST",
        body: JSON.stringify(dataPost),
      }
    ).then((resp) => document.getElementById("showUsers").click());
  }
});

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
      "<td>" +
      "<button type='button' id=" +
      transformedData[i].id +
      " " +
      "class='buttonDelete'>Delete</button>" +
      "</td></tr>";
  }
  document.getElementById("data").innerHTML = temp;

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
      document.getElementById("showUsers").click();
    });
  }
};

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

$(function () {
  $("#fname, #lname, #age, #email").tooltip({
    position: {
      my: "left top",
      at: "right+5 top-5",
      collision: "none",
    },
  });
});
