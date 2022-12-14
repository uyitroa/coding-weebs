import React, { useState } from 'react';
import { useEffect } from 'react';
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

function blobToDataURL(blob, callback) {
  var a = new FileReader();
  a.onload = function(e) {callback(e.target.result);}
  a.readAsDataURL(blob);
}




function App (props) {
  const [dataUri, setDataUri] = useState('');
  const [checked, setChecked] = React.useState(false);
  const [checkedRotten, setCheckedRotten] = React.useState(true);

  useEffect(() => {
    document.title = 'Fruit Recognition';
  }, []);


  function sendBase64ToServer(base64){
    var httpPost = new XMLHttpRequest(),
        path = "https://2eb7-2a0c-b641-2f1-0-f816-3eff-fe27-25f6.eu.ngrok.io/send_checkfruit/",
        data = JSON.stringify({image: base64, checkfruit: checked, checkrotten: checkedRotten});
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

  async function handleTakePhotoBlob(blob) {
    console.log("hello")
    Compress.imageFileResizer(
        blob, // the file from input
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

  function FileUploadPage(){
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
    };

    const handleSubmission = () => {
      handleTakePhotoBlob(selectedFile);
    }

    return(
        <div>
          <input type="file" name="file" onChange={changeHandler} />
          <div>
            <button onClick={handleSubmission}>Submit</button>
          </div>
        </div>
    )
  }

  function handleChange() {

    setChecked(!checked);
  }

  function handleChangeRotten() {

    setCheckedRotten(!checkedRotten);
  }


  const isFullscreen = false;
  return (
      <div>
        {
          (dataUri)
              ? <ImagePreview dataUri={dataUri}
                              isFullscreen={isFullscreen}
              />
              :
              <div>
	        <img width={"150"} src={"https://raw.githubusercontent.com/uyitroa/coding-weebs/master/logo.png"}/>
                <Camera onTakePhotoAnimationDone = {handleTakePhoto}
                         isFullscreen={isFullscreen}
                         idealFacingMode={FACING_MODES.ENVIRONMENT}
                />

                <FileUploadPage />

                <label>
                  <input
                      type="checkbox"
                      checked={checked}
                      onChange={handleChange}
                  />
                  Check fruit
                </label>

                <label>
                  <input
                      type="checkbox"
                      checked={checkedRotten}
                      onChange={handleChangeRotten}
                  />
                  Check rotten
                </label>
              </div>
        }
      </div>
  );
}

export default App;
