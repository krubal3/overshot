var sts = 25;
var rws = 80;
var mc = "silver";


function removeEmpty(arrS) {
  let arrReturn = new Array();
  for (s = 0; s < arrS.length; s++) {
    if (arrS[s].num > 0) {
      arrReturn.push(arrS[s]);
    }
  }
  return arrReturn;
}

function sumSts(arrS) {

    for (s = 1; s < arrS.length; s++) {
      if (arrS[s].txt > "" && arrS[s].txt == arrS[s-1].txt) {
        arrS[s].num = arrS[s].num + arrS[s-1].num;
        arrS[s-1].num = 0;
        arrS[s-1].txt = "";
      }
    }
  
  return removeEmpty(arrS);
}

function concatSts(arrS) {
  for (s = 0; s < arrS.length; s++) {
    
    arrS[s].txt = arrS[s].txt + " " + arrS[s].num;
    arrS[s].num = 1;
    
  }
  return removeEmpty(arrS);
}

function concatSingles(arrS) {
  for (s = 1; s < arrS.length; s++) {
    if (arrS[s].num == 1 && arrS[s-1].num == 1) {
      arrS[s-1].txt = arrS[s-1].txt + ", " + arrS[s].txt;
      arrS[s-1].num = 1;
      arrS[s].num = 0;
      arrS[s].txt = "";
    }
  }
  return removeEmpty(arrS);
}

function convertRow(arrS) {
  arrS = sumSts(arrS);
  arrS = concatSts(arrS);
  arrS = concatSingles(arrS);
  arrS = sumSts(arrS);
  arrS = concatSingles(arrS);
  arrS = sumSts(arrS);
  arrS = concatSingles(arrS);
  arrS = sumSts(arrS);
  let txt = "";
  for (s = 0; s < arrS.length; s++){
    if (arrS[s].num > 1) {
      txt = txt + "(" + arrS[s].txt + ") " + arrS[s].num + " times"
    }
    else {
      txt = txt + arrS[s].txt;
    }
    if (s < arrS.length - 1) {
      txt = txt + ", ";
    }
  }
  return txt;
}

function viewInstructions() {
  let sc = "under";
  let dc = "over";

  let divInstruct = document.getElementById("divInstruct");
  let instruct = "";

  for (r = 1; r <= rws; r++) {
    
    instruct = instruct + "<b>pick " + r + ":</b> ";
    if (r % 2 == 0) {
      //instruct = instruct + "*, ";
    }
    let arrS = new Array();
    for (s = 1; s <= sts; s++) {
      let txt = sc;
      let td = document.getElementById("_" + r + "_" + s);
      let color = td.style.backgroundColor;
      if (color == mc) {
        txt = dc;
      }
      let st = {
        "num": 1,
        "txt": txt
      };
      arrS.push(st);
    }
    let pick = convertRow(arrS);
    if (pick.indexOf("over") >= 0) {
      instruct = instruct + "<br />A: " + pick;
      instruct = instruct + "<br />B: "
    }
    else {
      //instruct = instruct + "(B only) ";
    }
    let rpt = Math.floor(sts / 2);
    if (r % 2 == 0) {
      instruct = instruct + "(under 1, over 1) " + rpt + " times, under 1";
    }
    else {
      instruct = instruct + "(over 1, under 1) " + rpt + " times, over 1";
    }
    if (r % 2 == 1) {
      //instruct = instruct + "*";
    }
    instruct = instruct + "<br />";
  }

  divInstruct.innerHTML = instruct;
  
}


function readSts(offset) {

  var c = document.getElementById("myCanvasImport");
  var ctx = c.getContext("2d");
  var img = document.getElementById("imgImport");
  var scale = 80.0 / img.height;

  var wscale = scale * (24/80);

  c.height = (img.height * scale) + 0;
  c.width = (img.width * wscale) + 0;

  ctx.scale(wscale, scale);
  ctx.drawImage(img, 0, 0);

  var imageData = ctx.getImageData(0, 0, c.width, c.height);

  localStorage.setItem("sts", c.width);
  localStorage.setItem("rws", c.height + offset);
  loadChart();

  for (r = rws - 1; r > -1; r--) {
    for (s = sts - 1; s > -1; s--) {

      let redComp = imageData.data[((r * (c.width * 4)) + (s * 4))];
      let greenComp = imageData.data[((r * (c.width * 4)) + (s * 4)) + 1];
      let blueComp = imageData.data[((r * (c.width * 4)) + (s * 4)) + 2];
      let avg = (redComp + greenComp + blueComp) / 3
    
      if (avg < 200) {
        let currR = rws - r;
        let currS = sts - s;
        let td = document.getElementById("_" + currR + "_" + currS);
        if (td) {
          if (td.style.backgroundColor != mc) {
            td.style.backgroundColor = mc;
          }
        }
      }
    }
  }

  addXs();
}

function toggleClick(td) {
 

      if (td.style.backgroundColor == mc) {
        td.style.backgroundColor = "white";

      }
      else  {
        td.style.backgroundColor = mc;
        
      }

    addXs();

}

function tdClick(td) {
  toggleClick(td);
}

function addXs() {
  viewDesign();
  savePat();
}

function savePat() {

  let pat = new Array();
  
  for (r = rws; r > 0; r--) {
    for (s = sts; s > 0; s--) {
      let td = document.getElementById("_" + r + "_" + s);
      let color = td.style.backgroundColor;
      if (color == mc) {
        let st = {
        "r": r,
        "s": s,
        "color": color
        };
        pat.push(st);
      }
    }
  }

  localStorage.setItem("patOld", localStorage.getItem("pat"));

  localStorage.setItem("pat", JSON.stringify(pat));

  localStorage.setItem("sts", sts);
  localStorage.setItem("rws", rws);


}

function restorePat() {

  let pat = JSON.parse(localStorage.getItem("pat"));

  if (pat) {

    for (r = rws; r > 0; r--) {
      for (s = sts; s > 0; s--) {
        let td = document.getElementById("_" + r + "_" + s);
        let st = pat.find(st => st.r === r && st.s === s);
        if (st)  {
          td.style.backgroundColor = st.color;
        }
      }
    }

  }

}

function exportPat() {
  let txtPat = document.getElementById("txtPat");
  txtPat.value = localStorage.getItem("pat");
  txtPat.select();
  //txtPat.setSelectionRange(0, 99999);
  document.execCommand("copy");
  txtPat.value = "";
  alert("Pattern copied to clipboard.");
}

function importPat() {
  if (confirm("Okay to overwrite existing pattern with import?")) {
    let txtPat = document.getElementById("txtPat");
    localStorage.setItem("pat", txtPat.value);
    txtPat.value = "";
    restorePat();
    addXs();
  }
}

function clearPat() {
  let ret = false;

  if (confirm("Okay to clear the chart?  All data will be lost.")) {
    for (r = rws; r > 0; r--) {
      for (s = sts; s > 0; s--) {
        let td = document.getElementById("_" + r + "_" + s);
        td.style.backgroundColor = "white";
      }
    }
    addXs();
    ret = true;
  }
  return ret;
}

function undo() {

  localStorage.setItem("pat", localStorage.getItem("patOld"));

  restorePat();

  addXs();

}

function viewDesign() {
  let wf = 10;
  let hf = 3;
  var c = document.getElementById("myCanvas");
  c.width  = parseInt(sts, 10) * wf;
  c.height = parseInt(rws, 10) * hf;
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  var cRev = document.getElementById("myCanvasRev");
  cRev.width  = parseInt(sts, 10) * wf;
  cRev.height = parseInt(rws, 10) * hf;
  var ctxRev = cRev.getContext("2d");
  ctxRev.clearRect(0, 0, c.width, c.height);


  var r;
  
  for (r = rws; r > 0; r--) {
    let y = (parseInt(rws, 10) - r) * hf;
    var s;
    for (s = sts; s > 0; s--) {
      let td = document.getElementById("_" + r + "_" + s);
      let x = (parseInt(sts, 10) - s) * wf;
      
      if (td.style.backgroundColor == mc) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x+wf,y);
        ctx.stroke();
        ctx.closePath();
      }
      else {
        ctxRev.beginPath();
        ctxRev.moveTo(x, y);
        ctxRev.lineTo(x+wf,y);
        ctxRev.stroke();
        ctxRev.closePath();
      }
    }
  }
  viewInstructions();
}

function loadChart() {

  let table = document.querySelector('#chart');
  table.innerHTML = "";
  let thead = table.createTHead();

  let row = thead.insertRow();

  let th = document.createElement("td");
  let text = document.createTextNode("");
  th.appendChild(text);
  row.appendChild(th);

  var s;

  for (s = sts; s > 0; s--) {

    let th = document.createElement("td");
    let text = document.createTextNode(s);
    th.appendChild(text);
    row.appendChild(th);

    }

  th = document.createElement("td");
  text = document.createTextNode("");
  th.appendChild(text);
  row.appendChild(th);

  var r;

  for (r = rws; r > 0; r--) {
  
    let row = thead.insertRow();
    let td = document.createElement("td");
    let text = document.createTextNode(r);
    td.appendChild(text);
    row.appendChild(td);

    var s;

    for (s = sts; s > 0; s--) {

    let td = document.createElement("td");
    let text = document.createTextNode("");
    td.appendChild(text);
    td.setAttribute("onclick", "tdClick(this);");
    td.id = "_" + r + "_" + s;


    row.appendChild(td);

    }

    td = document.createElement("td");
    text = document.createTextNode(r);
    td.appendChild(text);
    row.appendChild(td);

  }

  row = thead.insertRow();

  th = document.createElement("td");
  text = document.createTextNode("");
  th.appendChild(text);
  row.appendChild(th);

  for (s = sts; s > 0; s--) {

    let th = document.createElement("td");
    let text = document.createTextNode(s);
    th.appendChild(text);
    row.appendChild(th);

    }

  th = document.createElement("td");
  text = document.createTextNode("");
  th.appendChild(text);
  row.appendChild(th);

  restorePat();
  
  addXs();


}

addEventListener('load', loadChart());

window.addEventListener('load', function() {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
          var img = document.querySelector('img');
          img.onload = () => {
              URL.revokeObjectURL(img.src);  // no longer needed, free memory
          }

          img.src = URL.createObjectURL(this.files[0]); // set src to blob url
      }
  });
});