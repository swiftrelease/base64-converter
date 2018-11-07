let fileInp = document.querySelector("input");
let img = document.querySelector("img");
let outputText = document.querySelector("textarea#base64")
// fileInp.type = "file";
// document.body.appendChild(fileInp);

const base64table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var bytes;

var binaryReader = new FileReader();

fileInp.onchange = function(event) {
    binaryReader.readAsArrayBuffer(event.target.files[0]);
    binaryReader.onload = function(event) {
        bytes = new Uint8Array(event.target.result);
        let b64 = toBase64(bytes);

        // The crutches
        //
        // .png
        // iVBORw0KGgoAAAANSUhEUgAA
        //
        // .jpg
        // /9j/4AAQSkZJRgABAQ
        //
        // .gif
        // R0lGODlh

        let imgExtensions = {
            png: "iVBORw0KGgoAAAANSUhEUgAA",
            jpeg: "/9j/4AAQSkZJRgABAQ",
            gif: "R0lGODlh"
        };

        let extension;

        for(var ext in imgExtensions) {
            let matches = true;
            for(let i = 0; i < imgExtensions[ext].length; i++) {
                matches = matches && b64[i] === imgExtensions[ext][i];
                if(!matches) break;
            }
            if(matches) extension = ext;
        }

        if(extension) {
            img.style.width = "500px";
            img.src = `data:image/${extension};base64,${b64}`;
        }
        outputText.style = `
            width: 600px;
            height: 600px;
            overflow: scroll;
            word-wrap:break-word;
        `;
        outputText.innerText = b64;
    };
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


// no cors url
// var imgUrl = "https://avatars2.githubusercontent.com/u/46?v=4";
