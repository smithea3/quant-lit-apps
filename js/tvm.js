function calculatePV() {
  var r = document.getElementById("rate");
  var years = document.getElementById("years");
  var payment = document.getElementById("pmt");
  var n = document.getElementById("compoundPeriods").value;
  if (pv == "") {
    pv.value = 0;
  }
  if (r == "") {
    n = 0;
  }
  var pv = (payment.value * (1 - (1 + (r.value / 100) / n) ** (-1 * years.value * n)) / ((r.value / 100) / n)).toFixed(2);
  if (n.value == 0 || n.value == -1) {
    alert("Please select a compounding period.");
    document.getElementById("pvButton").setAttribute("class", "btn btn-danger");
  } else {
    document.getElementById("pv").value = "" + pv;
    document.getElementById("pmtButton").setAttribute("class", "btn");
    document.getElementById("pvButton").setAttribute("class", "btn btn-success");
    document.getElementById("rateButton").setAttribute("class", "btn");
    document.getElementById("fvButton").setAttribute("class", "btn");
    document.getElementById("yearsButton").setAttribute("class", "btn");
  }
  return true;
}

function calculatePMT() {
  var n = document.getElementById("compoundPeriods");
  var pv = document.getElementById("pv");
  var r = document.getElementById("rate");
  var years = document.getElementById("years");
  if (pv.value == "") {
    n = 0;
  }
  if (r.value == "") {
    n = 0;
  }
  var pmt = ((r.value / 100 * pv.value) / (1 - (1 + r.value / 100) ** (-years.value * n.value))).toFixed(2);
  if (n.value == 0 || n.value == -1) {
    alert("Please select a compounding period.");
    document.getElementById("pmtButton").setAttribute("class", "btn btn-danger");
  } else {
    document.getElementById("pmt").value = "" + pmt;
    document.getElementById("pmtButton").setAttribute("class", "btn btn-success");
    document.getElementById("pvButton").setAttribute("class", "btn");
    document.getElementById("rateButton").setAttribute("class", "btn");
    document.getElementById("fvButton").setAttribute("class", "btn");
    document.getElementById("yearsButton").setAttribute("class", "btn");
  }
  return true;
}

function calculateFV() {
  var n = document.getElementById("compoundPeriods");
  var pmt = document.getElementById("pmt")
  var pv = document.getElementById("pv");
  var r = document.getElementById("rate");
  var years = document.getElementById("years");
  var fv = ((pmt.value * ((1 + (r.value / 100 / n.value)) ** (years.value * n.value) - 1)) / (r.value / 100 / n.value)).toFixed(2);
  if (n.value == 0 || n.value == -1) {
    alert("Please select a compounding period.");
    document.getElementById("fvButton").setAttribute("class", "btn btn-danger");
  } else {
    document.getElementById("fv").value = "" + fv;
    document.getElementById("pmtButton").setAttribute("class", "btn");
    document.getElementById("pvButton").setAttribute("class", "btn");
    document.getElementById("rateButton").setAttribute("class", "btn");
    document.getElementById("fvButton").setAttribute("class", "btn btn-success");
    document.getElementById("yearsButton").setAttribute("class", "btn");
  }
  return true;
}
