// Create global variables from all UI elements with IDs
// Add the "on_" prefix so I know I'm not using the global defaults
var UIelements = document.querySelectorAll("[id]");
for (let i = 0; i < UIelements.length; i++) {
  let x = UIelements[i].id;
  window["on_" + x] = document.getElementById(x);
}

// A-frame does not support blob URLS
// so we need to convert all images to base64

function getDataUri(url, callback) {
  var image = new Image();

  image.onload = function () {
    var canvas = document.createElement("canvas");
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;
    canvas.getContext("2d").drawImage(this, 0, 0);
    callback(canvas.toDataURL("image/jpeg"));
  };

  image.src = url;
}

///////////////////////////////////////////////////////////
var Q = 0;
var R = 0;
var S = 0;
var totalFiles;
var gallery = [];
const newVRview = on_template.content.cloneNode(true);

// Load function after user has selected images
updateList = function () {
  totalFiles = uploaded.files.length;
  for (var i = 0; i < totalFiles; ++i) {
    const inputURL = URL.createObjectURL(uploaded.files.item(i));
    gallery.push(inputURL);

    // This is just to display all selected files
    const template = document.getElementById("listItem");
    const listNode = template.content.cloneNode(true);
    const listUnit = listNode.querySelector(".listContent");
    const pictUnit = listNode.querySelector(".listContain");
    listUnit.textContent = uploaded.files.item(i).name;
    pictUnit.setAttribute("style", `background-image: url('${inputURL}');`);
    pictUnit.setAttribute("data-index", gallery.length);
    fileList.appendChild(listNode);
    countMeter.innerText = `Load ${gallery.length} images in VR`;
    countMeter.removeAttribute("disabled");
  }
};

function removeFomList(item) {
  item.remove();
  gallery.splice(item.getAttribute("data-index") - 1, 1);
  countMeter.innerText = `Load ${gallery.length} images in VR`;
}

function processAllIMG() {
  // Convert all images to base64, then add them to the a-frame asset manager
  // After all files are processed, create a new VR scene
  countNote.innerHTML = "Loading";
  countNote.classList.add("loading");
  totalFiles = gallery.length;
  for (var i = 0; i < totalFiles; ++i) {
    getDataUri(gallery[i], function (dataUri) {
      const newAsset = createNewImage(dataUri);
      const addAsset = newVRview.querySelector("a-assets");
      addAsset.appendChild(newAsset);
      if (i === totalFiles)
        setTimeout(() => {
          createVRgallery(newVRview);
        }, 1000);
    });
  }
}

// Create a new image node from the base64 data
function createNewImage(src) {
  const image = new Image();
  image.id = "myImage" + Q;
  image.crossOrigin = "anonymous";
  image.src = src;
  ++Q;
  return image;
}

// Load the completed VR scene, hide the file picker,
// and assign a function to the next button
function createVRgallery(newVRview) {
  on_AFrScene.appendChild(newVRview);
  on_AFrScene.setAttribute("style", "position: absolute;top:0px;left:0px;");
  on_vrLoader.style.display = "none";

  if (S === 0) {
    ++R;
  } else {
    return;
  }
  changeScene = document.querySelector("#changeScene");
  changeScene.addEventListener("click", showNext);
  circleColor();
  ++S;
}

// Replace the current image with the next image
function showNext() {
  let curvedI = document.querySelector("a-curvedimage");
  if (R === totalFiles) R = 0;
  curvedI.setAttribute("src", "#myImage" + R);
  ++R;
}
/*
&nbsp;
*/

function doThisWhenClicked() {}

function circleColor() {
  const el = document.querySelector("#circleBTN");
  el.addEventListener("mouseenter", function () {
    doThisWhenClicked = () => {
      showNext();
    };
    el.setAttribute("color", "blue");
  });

  el.addEventListener("mouseleave", function () {
    el.setAttribute("color", "red");
    doThisWhenClicked = () => {};
  });

  el.addEventListener("mousedown", function () {
    el.setAttribute("color", "green");
  });

  el.addEventListener("mouseup", function () {
    el.setAttribute("color", "red");
  });
}
