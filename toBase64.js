let fileInp = document.querySelector("input#file");
let textInp = document.querySelector("textarea#text");
let img = document.querySelector("img.image-upload");
let outputText = document.querySelector("textarea#base64");
let convertButton = document.querySelector("button#convert");

const base64table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var bytes;

const binaryReader = new FileReader();
const encoder = new TextEncoder();
let file;

File.prototype.isImage = function() {
  return this.type.indexOf("image") === 0;
}


convertButton.onclick = function(event) {
  if(!textInp) {
    console.warn("Uh, we didn't find the text input. Sorry, something broke...");
    return;
  }
  if(!textInp.value) return;

  let bytes = encoder.encode(textInp.value);
  outputText.innerText = toBase64(bytes);
}

fileInp.onchange = function(event) {
  console.log(event.target.files);
  console.log(event.target.files[0]);

  file = event.target.files[0];

  if(!file) {
    this.style.color = "red";
    return;
  }
  this.style.color = "black";

  binaryReader.readAsArrayBuffer(file);
  binaryReader.onload = function(event) {
    bytes = new Uint8Array(event.target.result);
    let b64 = toBase64(bytes);

    if(file.isImage()) {
      img.src = `data:${file.type};base64,${b64}`;
    }

    outputText.innerText = b64;
  };
  // event.target.value = "";
};

function toBase64(uint8arr) {
    let result = "";
    let bin = [];
    for(let i of uint8arr) {
        bin.push(i.toString(2).padStart(8, "0"));
    }
    convert(bin.length % 3);

    function convert(remainder) {
        for(let i = 0; i < bin.length - remainder; i += 3) {
            let triplet = bin[i] + bin[i + 1] + bin[i + 2];

            let sextets = [];
            for(let j = 0; j < 4; j++) {
                sextets.push(triplet.slice(j * 6, j * 6 + 6));
            }
//             let sext1 = triplet.slice(0, 6);
//             let sext2 = triplet.slice(6, 12);
//             let sext3 = triplet.slice(12, 18);
//             let sext4 = triplet.slice(18, 24);

            for(let s of sextets) {
                result += base64table[parseInt(s, 2)];
            }
        }
        switch(remainder) {
            case 0: break;
            case 1:
                var last = bin[bin.length - 1];
                var one = last.slice(0, 6);
                var two = last.slice(6, last.length).padEnd(6, "0");
                result += base64table[parseInt(one, 2)];
                result += base64table[parseInt(two, 2)];
                result += "==";
            break;

            case 2:
                var last = bin[bin.length - 2] + bin[bin.length - 1];
                var one = last.slice(0, 6);
                var two = last.slice(6, 12);
                var three = last.slice(12, last.length).padEnd(6, "0");
                result += base64table[parseInt(one, 2)];
                result += base64table[parseInt(two, 2)];
                result += base64table[parseInt(three, 2)];
                result += "=";
            break;
        }
    }

    return result;
}
