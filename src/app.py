import os
import datetime
import cv2
from flask import Flask,jsonify,request,render_template\
    
import face_recognition

app = Flask(__name__)

registered_data = {}

@app.route("/")
def index():
    #render html file
   return render_template('index.html') 

# post method
@app.route("/register", method=["POST"])
def register():
    name = request.form.get('name')
    #photo uploads
    photo = request.files['photo']
    
    # save photo to database
    db = os.path.join(os.getcwd(), "static", "uploads")
    
    if not os.path.exists(db):
        os.makedev(db)
    
    #save the image with the file name
    photo.save(os.path.join(db, f'{datetime.date.today()}{name}.jpg'))
    
    registered_data[name] = f'{datetime.date.today()} {name}.jpg'
    
    #successfully
    response = {"success": True, 'name': name}
    return jsonify(response)
    
    #login route post
    @app.route("/login", methods=["POST"])
    def login():
        photo = requet.files["photo"]
        
        # save photo to db
        db = os.path.join(os.getcwd(),"static", "uploads")
        
        #when a folder is not found
        if not os.path.exists(db):
            os.makedirs(db)
            
        login_fileName = os.path.join(db, "login_face.jpg")
        
        photo.save(login_fileName)
        
        # camera activation
        login_image = cv2.imread(login_file)
        gray_image = cv2.cvtColor(login_image, cv2.COLOR_BGR2GRAY)
        
        #load haar Cascade file
        trained = cv2.CascadeClassifier(cv2.data.haarCascade + "haarcascade_frontalface_default.xml")
        faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30,30))
        
        # detect if no faces in camera
        if len(faces) == 0:
            response = {"success": False}
            return jsonify(response)
        
        login_image = face_recognition.load_image_file()
        
        # when face is available on database
        login_face_encodings = face_recognition.face_encodings(login_image)
        
        # process image with face recognition
        for name,fileName in registered_data.items():
            #find registered photo
           registered_photo = os.path.join(db, fileName)
           registered_image = face_recognition.load_image_file(registered_photo)
           registered_face_encoding = face_recognition.face_encodings(registered_image)
           
           # compare both images
           if len(registered_face_encoding) >0 and len(login_face_encodings) > 0:
               matches = face_recognition.compare_faces(registered_face_encoding, login_face_encoding[0])
               print("The Match", matches)
               if any(matches):
                    response = {"Succes":True, "name":name}
                    return jsonify(response) 
    # no match 
    response = {"Succes":False}
    return jsonify(response)

#successfully logedin
@app.route("/success")
def success():
    user_name = request.args.get("user_name")
    return render_template("success.html", user_name=user_name)

if __name__ == "__main__":
    app.run(debug=True)