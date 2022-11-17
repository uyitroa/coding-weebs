import React, { useState } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './ImagePreview';



function App (props) {
  const [dataUri, setDataUri] = useState('');

  var sendBase64ToServer = function(base64){
    var httpPost = new XMLHttpRequest(),
        path = "https://d860-138-195-50-87.ngrok.io/send/",
        data = JSON.stringify({image: base64});
    httpPost.onreadystatechange = function(err) {
      console.log("sent")
      if (httpPost.readyState == 4 && httpPost.status == 200) {
        setDataUri(httpPost.response);
      } else {
        console.log(err);
      }
    };
    console.log("enterd");
    // httpPost.setHeader('Content-Type', 'application/json');
    httpPost.open("POST", path, true);
    console.log('zzzz');
    httpPost.send(data);
  };

  async function handleTakePhoto (dataUri) {
    console.log("hello")
    sendBase64ToServer(dataUri)

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
