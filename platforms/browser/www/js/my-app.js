// Initialize app
var myApp = new Framework7();
  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/about/',
        url: 'about.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
})

function takePicture(){
  navigator.camera.getPicture(cameraCallback, onError);
}

function cameraCallback(imageData) {
  var image = document.getElementById('myImage');
  image.src = imageData;
}

function onError(msg) {
  Console.log(msg);
}

function showImage() {
  window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
    console.log('file system open: ' + fs.name);
    getSampleFile(fs.root);
  }, onErrorLoadFs);
}

function getSampleFile(dirEntry) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://cordova.apache.org/static/img/cordova_bot.png', true);
  xhr.responseType = 'blob';

  xhr.onload = function() {
      if (this.status == 200) {

          var blob = new Blob([this.response], { type: 'image/png' });
          saveFile(dirEntry, blob, "downloadedImage.png");
      }
  };
  xhr.send();
}

function saveFile(dirEntry, fileData, fileName) {

  dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

      writeFile(fileEntry, fileData);

  }, onErrorCreateFile);
}

function writeFile(fileEntry, dataObj, isAppend) {

  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(function (fileWriter) {

      fileWriter.onwriteend = function() {
          console.log("Successful file write...");
          if (dataObj.type == "image/png") {
              readBinaryFile(fileEntry);
          }
          else {
              readFile(fileEntry);
          }
      };

      fileWriter.onerror = function(e) {
          console.log("Failed file write: " + e.toString());
      };

      fileWriter.write(dataObj);
  });
}

function readBinaryFile(fileEntry) {

  fileEntry.file(function (file) {
      var reader = new FileReader();

      reader.onloadend = function() {

          console.log("Successful file write: " + this.result);
          displayFileData(fileEntry.fullPath + ": " + this.result);

          var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
          displayImage(blob);
      };

      reader.readAsArrayBuffer(file);

  }, onErrorReadFile);
}

function displayImage(blob) {

  // Displays image if result is a valid DOM string for an image.
  var elem = document.getElementById('imageFile');
  // Note: Use window.URL.revokeObjectURL when finished with image.
  elem.src = window.URL.createObjectURL(blob);
}

function displayImageByFileURL(fileEntry) {
  var elem = document.getElementById('imageFile');
  elem.src = fileEntry.toURL();
}



function tryingFile(){

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
 
}

function fileSystemCallback(fs){

  // Name of the file I want to create
  var fileToCreate = "newPersistentFile.txt";

  // Opening/creating the file
  fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };

function getFileCallback(fileEntry){
  
  var dataObj = new Blob(['Hello'], { type: 'text/plain' });
  // Now decide what to do
  // Write to the file
  writeFile(fileEntry, dataObj);

  // Or read the file
  readFile(fileEntry);
}

// Let's write some files
function writeFile(fileEntry, dataObj) {

  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(function (fileWriter) {

      // If data object is not passed in,
      // create a new Blob instead.
      if (!dataObj) {
          dataObj = new Blob(['Hello'], { type: 'text/plain' });
      }

      fileWriter.write(dataObj);

      fileWriter.onwriteend = function() {
          console.log("Successful file write...");
      };

      fileWriter.onerror = function (e) {
          console.log("Failed file write: " + e.toString());
      };

  });
}

// Let's read some files
function readFile(fileEntry) {

  // Get the file from the file entry
  fileEntry.file(function (file) {
      
      // Create the reader
      var reader = new FileReader();
      reader.readAsText(file);

      reader.onloadend = function() {

          console.log("Successful file read: " + this.result);
          console.log("file path: " + fileEntry.fullPath);

      };

  }, onError);
}

function onError(msg){
  console.log(msg);
}
