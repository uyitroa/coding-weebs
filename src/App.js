import React, { useState } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './ImagePreview';
import Compress from "react-image-file-resizer";


function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}



function App (props) {
  const [dataUri, setDataUri] = useState('');

  var sendBase64ToServer = function(base64){
    var httpPost = new XMLHttpRequest(),
        path = "https://d860-138-195-50-87.ngrok.io/send/",
        data = JSON.stringify({image: base64});
    httpPost.onreadystatechange = function(err) {
      console.log("sent")
      if (httpPost.readyState == 4 && (httpPost.status == 200 || httpPost.status == 301)) {
        setDataUri(httpPost.response);
      } else {
        console.log(err);
      }
    };
    console.log("enterd");
    // httpPost.setHeader('Content-Type', 'application/json');
    httpPost.open("POST", path, true);
    //httpPost.setestHeader("Access-Control-Allow-Origin", "https://138.195.44.21:8000");
    //httpPost.setRequestHeader("ngrok-skip-browser-warning", "true");
    console.log('zzzz');
    httpPost.send(data);
  };

  async function handleTakePhoto (dataUri) {
    console.log("hello")
    Compress.imageFileResizer(
        dataURItoBlob(dataUri), // the file from input
        480, // width
        480, // height
        "JPEG", // compress format WEBP, JPEG, PNG
        70, // quality
        0, // rotation
        (uri) => {
          sendBase64ToServer(uri)
          // You upload logic goes here
        },
        "base64" // blob or base64 default base64
    );
  }


  const isFullscreen = false;
  return (
      <div>
        {
          (dataUri)
              ? <ImagePreview dataUri={dataUri}
                              isFullscreen={isFullscreen}
              />
              : <Camera onTakePhotoAnimationDone = {handleTakePhoto}
                        isFullscreen={isFullscreen}
                        idealFacingMode={FACING_MODES.ENVIRONMENT}
              />
        }
      </div>
  );
}

export default App;
