// set these global variables that WILL NOT change.

///*** Generate a Table Function ***\\\
function generate_table() {
  // get the number of states
  let numOfStates = parseInt(document.getElementById("numOfStatesInput").value);
  let numOfSeats = parseInt(document.getElementById("numOfSeatsInput").value);

  // define the number of columens
  var columns = 10;

  // get the reference for the body
  var body = document.getElementsByTagName("body")[0];

  //header names
  var headerNames = Array("Group's Name", "Population", "Group's Quota", "Lower Quota", "Upper Quota",
    "Hamilton's Method <br> <small>Standard Divisor</small>  <input disabled='disabled' type='number' style='width: 150px; text-align: center' class='form-control' id = 'hamiltonsDivisor'>",
    "Jefferson's Method <br> <small>Modified Divisor</small> <input type='number' style='width: 150px; text-align: center' class='form-control' id = 'jeffersonDivisor' value=100 oninput='jeffersonMethod();'>",
    "Adams' Method <br> <small>Modified Divisor</small> <input type='number' style='width: 150px; text-align: center' class='form-control' id = 'adamsDivisor' value=100 oninput='adamsMethod();'>",
    "Webster's Method <br> <small>Modified Divisor</small> <input type='number' style='width: 150px; text-align: center' class='form-control' id = 'websterDivisor' value=100 oninput='webstersMethod();'>",
    "Huntington-Hill's Method <br> <small>Modified Divisor</small> <input type='number' style='width: 150px; text-align: center' class='form-control' id = 'hhDivisor' value=100 oninput='hhMethod();'>");

  // creates a <table> element and a <tbody> element
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");
  tbl.classList.add("table");

  // create table header
  var header = tbl.createTHead();
  var headerRow = header.insertRow(0);
  for (var k = 0; k < columns; k++) {
    headerCell = headerRow.insertCell(0);
    headerCell.innerHTML = headerNames[columns - k - 1];
    headerCell.setAttribute("align", "center");
    headerCell.setAttribute("class", "align-bottom");
  }
  // creating all cells
  for (var i = 0; i < numOfStates + 1; i++) { // creates a table
    var row = document.createElement("tr");
    for (var j = 0; j < columns; j++) { // Create a <td> element and a text node, make the
      // node the contents of the <td>, and put the <td>
      // the end of the table
      var cell = document.createElement("td");
      var cellText = document.createTextNode("");
      cell.setAttribute("align", "center");
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody); // appends <table> into <body>
  body.appendChild(tbl); // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "0");
  tbl.setAttribute("id", "appTable")
  tbl.setAttribute("class", "table table-striped table-hover table-responsive")
  tbl.rows[numOfStates + 1].cells[0].innerHTML = "Totals";

  let defaultPops = [54, 243, 703, 100];
  for (var ii = 1; ii <= numOfStates; ii++) {
    tbl.rows[ii].cells[0].innerHTML = '<input type="text" style="width: 200px;" class="form-control" placeholder="Enter the group\'s name">';

    tbl.rows[ii].cells[1].innerHTML = '<input type="number" name="statePop" style="width: 200px;" class="form-control" placeholder="Enter group\'s population" oninput="calculateQuotas(); hamiltonMethod(); jeffersonMethod(); adamsMethod(); webstersMethod(); hhMethod();">';

  }
  document.getElementById("createTableButton").remove();
  document.getElementById("numOfStatesInput").setAttribute("disabled", "disabled");
  document.getElementById("exportTableButton").removeAttribute("disabled");
}

///*** Calculate the divisor function ***\\\
function getDivisor() {
  let numOfStates = parseInt(document.getElementById("numOfStatesInput").value);
  let numOfSeats = parseInt(document.getElementById("numOfSeatsInput").value);
  var totalPop = 0;
  for (var i = 0; i < numOfStates; i++) {
    totalPop += parseFloat(document.getElementsByName("statePop")[i].value);
  }
  //for debugging
  //alert(totalPop/numOfSeats);
  return totalPop / numOfSeats;
}

///*** Calculate the quotas function ***\\\
function calculateQuotas() {
  let numOfStates = parseInt(document.getElementById("numOfStatesInput").value);
  let numOfSeats = parseInt(document.getElementById("numOfSeatsInput").value);
  var tbl = document.getElementById("appTable");
  var populations = [];

  // create an array with the populations in them.
  for (var i = 0; i < numOfStates; i++) {
    populations.push(parseFloat(document.getElementsByName("statePop")[i].value));
  }

  // calculate each states Quota, lower quota, and upper quota
  var quotas = populations.map(x => x / getDivisor());
  var lowerQuotas = quotas.map(x => Math.floor(x));
  var upperQuotas = quotas.map(x => Math.floor(x) + 1);

  var lowerQuotaSum = sumArray(lowerQuotas);
  var upperQuotaSum = sumArray(upperQuotas);

  // check for zeros and give those with zeros at least one seat.
  for (var j = 0; j < numOfStates; j++) {
    if (quotas[j] < 1) {
      lowerQuotas[j] += 1;
    }
  }

  for (var j = 1; j <= numOfStates; j++) {
    tbl.rows[j].cells[2].innerHTML = quotas[j - 1].toFixed(5);
    tbl.rows[j].cells[3].innerHTML = lowerQuotas[j - 1];
    tbl.rows[j].cells[4].innerHTML = upperQuotas[j - 1];
  }

  tbl.rows[numOfStates + 1].cells[1].innerHTML = sumArray(populations);
  tbl.rows[numOfStates + 1].cells[2].innerHTML = numOfSeats;
  tbl.rows[numOfStates + 1].cells[3].innerHTML = sumArray(lowerQuotas);
  tbl.rows[numOfStates + 1].cells[4].innerHTML = sumArray(upperQuotas);
  return [quotas, lowerQuotas, upperQuotas];
}

function hamiltonMethod() {
  // Notes on this Method
  // It is known that Hamilton's method has some issues.
  // Here, in the even that all of the states have the same population,
  // and you have a given number of seats to give back,
  // this algorithm will give the seats back to the first states in the list.

  var numOfStates = parseInt(document.getElementById("numOfStatesInput").value);
  var numOfSeats = parseInt(document.getElementById("numOfSeatsInput").value);
  var tbl = document.getElementById("appTable");
  var hamiltonsDivisor = getDivisor();
  var q = calculateQuotas()[0];
  var lq = calculateQuotas()[1];
  var uq = calculateQuotas()[2];
  var hamiltonsApp = lq;
  var unapportionedSeats = numOfSeats - sumArray(lq);
  var diff = difference(q, lq);
  if (unapportionedSeats > 0) {
    var cutOff = nLargest(difference(q, lq), unapportionedSeats);
    for (var i = 0; i < numOfSeats; i++) {
      if (diff[i] >= cutOff && unapportionedSeats > 0) {
        hamiltonsApp[i] += 1;
        unapportionedSeats--;
      }
    }
  }
  hamiltonSum = sumArray(hamiltonsApp);
  hamiltonsApp.push(hamiltonSum);
  for (var j = 0; j < hamiltonsApp.length; j++) {
    tbl.rows[j + 1].cells[5].innerHTML = hamiltonsApp[j];
  }

  if (hamiltonSum == numOfSeats) {
    tbl.rows[numOfStates + 1].cells[5].setAttribute("class", "bg-success");
  } else {
    tbl.rows[numOfStates + 1].cells[5].setAttribute("class", "bg-danger");
  }
  var hamiltonAdInput = document.getElementById("hamiltonsDivisor");
  hamiltonAdInput.setAttribute('value', hamiltonsDivisor.toFixed(5));
}

// Jeffersons Apportionment Method
function jeffersonMethod() {
  var numOfStates = parseInt(document.getElementById("numOfStatesInput").value);
  var numOfSeats = parseInt(document.getElementById("numOfSeatsInput").value);
  var jeffersonDivisor = parseFloat(document.getElementById("jeffersonDivisor").value);
  var populations = [];
  for (var i = 0; i < numOfStates; i++) {
    populations.push(parseFloat(document.getElementsByName("statePop")[i].value));
  }
  var jeffersonApp = populations.map(x => Math.floor(x / jeffersonDivisor));
  var jeffersonSum = sumArray(jeffersonApp);
  jeffersonApp.push(jeffersonSum);
  var tbl = document.getElementById("appTable");
  // calculate each states Quota, lower quota, and upper quote
  for (var j = 0; j < jeffersonApp.length; j++) {
    tbl.rows[j + 1].cells[6].innerHTML = jeffersonApp[j];
  }
  if (jeffersonSum == numOfSeats) {
    tbl.rows[numOfStates + 1].cells[6].setAttribute("class", "bg-success");
  } else {
    tbl.rows[numOfStates + 1].cells[6].setAttribute("class", "bg-danger");
  }
}

// Adams Apportionment Method
function adamsMethod() {
  var numOfStates = parseInt(document.getElementById("numOfStatesInput").value);
  var numOfSeats = parseInt(document.getElementById("numOfSeatsInput").value);
  var adamsDivisor = parseFloat(document.getElementById("adamsDivisor").value);
  var populations = [];
  for (var i = 0; i < numOfStates; i++) {
    populations.push(parseFloat(document.getElementsByName("statePop")[i].value));
  }
  var adamsApp = populations.map(x => Math.ceil(x / adamsDivisor));
  var adamsSum = sumArray(adamsApp);
  adamsApp.push(adamsSum);
  var tbl = document.getElementById("appTable");
  // calculate each states Quota, lower quota, and upper quote
  for (var j = 0; j < adamsApp.length; j++) {
    tbl.rows[j + 1].cells[7].innerHTML = adamsApp[j];
  }
  if (adamsSum == numOfSeats) {
    tbl.rows[numOfStates + 1].cells[7].setAttribute("class", "bg-success");
  } else {
    tbl.rows[numOfStates + 1].cells[7].setAttribute("class", "bg-danger");
  }
}

// websters Apportionment Method
function webstersMethod() {
  var numOfStates = parseInt(document.getElementById("numOfStatesInput").value);
  var numOfSeats = parseInt(document.getElementById("numOfSeatsInput").value);
  var webstersDivisor = parseFloat(document.getElementById("websterDivisor").value);
  var populations = [];
  for (var i = 0; i < numOfStates; i++) {
    populations.push(parseFloat(document.getElementsByName("statePop")[i].value));
  }
  var webstersApp = populations.map(x => Math.round(x / webstersDivisor));
  var webstersSum = sumArray(webstersApp);
  webstersApp.push(webstersSum);
  var tbl = document.getElementById("appTable");
  // calculate each states Quota, lower quota, and upper quote
  for (var j = 0; j < webstersApp.length; j++) {
    tbl.rows[j + 1].cells[8].innerHTML = webstersApp[j];
  }
  if (webstersSum == numOfSeats) {
    tbl.rows[numOfStates + 1].cells[8].setAttribute("class", "bg-success");
  } else {
    tbl.rows[numOfStates + 1].cells[8].setAttribute("class", "bg-danger");
  }
}

// websters Apportionment Method
function hhMethod() {
  var numOfStates = parseInt(document.getElementById("numOfStatesInput").value);
  var numOfSeats = parseInt(document.getElementById("numOfSeatsInput").value);
  var hhDivisor = parseFloat(document.getElementById("hhDivisor").value);
  var populations = [];
  for (var i = 0; i < numOfStates; i++) {
    populations.push(parseFloat(document.getElementsByName("statePop")[i].value));
  }
  var hhQuota = populations.map(x => (x / hhDivisor));
  var hhLQ = populations.map(x => Math.floor(x / hhDivisor));
  var hhUQ = populations.map(x => Math.ceil(x / hhDivisor));
  var hhApp = [];
  for (var ii = 0; ii < numOfStates; ii++) {
    if ( hhQuota[ii] > Math.sqrt(hhLQ[ii]*hhUQ[ii]) ) {
      hhApp.push(hhUQ[ii]);
    } else {
      hhApp.push(hhLQ[ii]);
    }
  }
  var hhSum = sumArray(hhApp);
  hhApp.push(hhSum);
  var tbl = document.getElementById("appTable");
  // calculate each states Quota, lower quota, and upper quote
  for (var j = 0; j < hhApp.length; j++) {
    tbl.rows[j + 1].cells[9].innerHTML = hhApp[j];
  }
  if (hhSum == numOfSeats) {
    tbl.rows[numOfStates + 1].cells[9].setAttribute("class", "bg-success");
  } else {
    tbl.rows[numOfStates + 1].cells[9].setAttribute("class", "bg-danger");
  }
}

function geometricMeanArray(array1, array2) {
  var list = [];
  for (var i = 0; i < array1.length; i++) {
    list.push(Math.sqrt(array1[i] * array2[i]));
  }

  return list;
}

///*** Get the nth largest number function ***\\\
function nLargest(array, n) {
  var list = array;
  return parseFloat(list.sort(function(a, b) {
    return b - a;
  })[n - 1]);
}

function sumArray(array) {
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function difference(array1, array2) {
  var difference = [];
  if (array1.length !== array2.length) {
    alert("The length of the arrays are not equal. Check your code.")
  } else {
    for (var i = 0; i < array1.length; i++) {
      difference.push(array1[i] - array2[i]);
    }
  }
  return difference;
}
