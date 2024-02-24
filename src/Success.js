import React, {useEffect} from "react";

function Success(){
    useEffect(() => {
        // Code to access the webcam
        const video = document.getElementById("video");

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
            })
            .catch((error) => {
                console.log("Error accessing webcam", error);
                alert("Cannot access webcam");
            });
    }, []);
    function capture(){
        const canvas = document.getElementById("canvas");
        const video = document.getElementById("video");
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0,canvas.width, canvas.height);
        canvas.style.display = "block";
        canvas.style.display = "none";
    }

    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
    
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([arrayBuffer], { type: mimeString });
    }

    function createProfile(){
        const nameInput = document.getElementById("name");
        const canvas = document.getElementById("canvas");
        const name = nameInput.value;
        const photo = dataURItoBlob(canvas.toDataURL());

        if(!name || !photo){
            alert("Name and Photo required");
            return
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("photo", photo, `${name}.jpg`);

        fetch("/register", {
            method: "POST",
            body: formData
        }).then(response=>response.json()).then(data=>{
            if(data.success){
                alert("Profile created sucessfully");
                window.location.href = "/"
            }else{
                alert("Sorry Failed to create profile");
            }

        }).catch(error=>{
            console.log("Error",error);
        });
    }
    function viewProfile(){
        const nameInput = document.getElementById("name");
        const canvas = document.getElementById("canvas");
        const video = document.tElementById("video");
        const photo = dataURItoBlob(canvas.toDataURL());
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0,canvas.width, canvas.height);

        if(!photo){
            alert("Photo required");
            return
        }
        const formData = new FormData();
        formData.append("photo", photo, "login.jpg");

        fetch("/login", {
            method: "POST",
            body: formData
        }).then(response=>response.json()).then(data=>{
            console.log(data);
            if(data.success){
                alert("Login sucessfully");
                window.location.href = "/success?user_name" + nameInput.value;
            }else{
                alert("Failed to create profile");
            }

        }).catch(error=>{
            console.log("Error",error);
        });
    }

    return(
        <body>
            <video id= "video" width={440} height={280} autoPlay></video>
            <br/>

            <button onClick={capture}>Take A Photo</button>
            <br/>

            <canvas id="canvas" width={400} height={200}className="canvas"></canvas>
            <h3>Create Profile</h3>
            <label htmlFor="name">Your name:</label>
            <input type="text" id="name" required name=""/>
            <button onClick={createProfile}>Create Profile</button>
            <button onClick={viewProfile}>View Profile</button>
        </body>
    )
}

export default Success;