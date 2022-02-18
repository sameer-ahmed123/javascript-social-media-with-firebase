//forn rotating the page box
var card = document.getElementById("card");

function openSignup() {
    card.style.transform = "rotateY(-180deg)";
}
function openLogin() {
    card.style.transform = "rotateY(0deg)";
}

// conneting firebase
console.log(localStorage.getItem("user"));
const firebaseConfig = {
    apiKey: "AIzaSyAbmsWaB_xpj5l4EEFStBiS8ovegxzAWIE",
    authDomain: "signin-fbe32.firebaseapp.com",
    projectId: "signin-fbe32",
    storageBucket: "signin-fbe32.appspot.com",
    messagingSenderId: "622379387575",
    appId: "1:622379387575:web:e73458b7242f5c551b1b32",
    measurementId: "G-CBW63P4EXP"
};
// // Initialize Firebase
firebase.initializeApp(firebaseConfig);
// // // //submitting data to firebase realtime database

let userKey = localStorage.getItem("lsUserKey");;
var storageRef = firebase.storage().ref();
let filePicker = document.getElementById('inp_choose_file');
let file;

filePicker.addEventListener("change", function () {
    file = this.files[0];
    if (file) {
        const reader = new FileReader();
        // reader.addEventListener('load', function(){
        //     document.getElementById('img').src = this.result
        //     alert(this.result)
        // })

        reader.readAsDataURL(file)
    }

});

function uploadPost() {

    let post = document.getElementById("inp_post_text").value;

    // Create the file metadata
    var metadata = {
        contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':

                    // User doesn't have permission to access the object
                    break;

                case 'storage/canceled':

                    // User canceled the upload
                    break;
                case 'storage/unknown':

                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        }, function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {

                firebase.database().ref("/posts/").push({
                    Postedby: userKey,
                    PostValue: post,
                    PostLikes: [0],
                    PostComments: [0],
                    PostImage: downloadURL
                })
                console.log('File available at', downloadURL);
            });
        });
}


//posts
firebase.database().ref("/posts/").on('value', function (snapshot) {
    document.getElementById('div_all_posts').innerHTML = "";
    snapshot.forEach(function (childsnapshot) {

        let postId = childsnapshot.key;//find
        let posts = childsnapshot.val();
        let Postedby = posts['Postedby'];
        let postsLikedBy = posts['PostLikes'];
        let postAllComment = posts['PostComments'];
        let PostImage = posts['PostImage'];
        let PostValue = posts['PostValue'];

        //post top
        var div_outer = document.createElement("div");
        var img = document.createElement("img");
        var p = document.createElement("p");
        var h3 = document.createElement("h3");
        var div = document.createElement("div");

        img.src = "images/avatar.png";
        img.classList.add('user_avatar');
        img.classList.add('post_avatar');

        div_outer.classList.add("post_top");


        h3.innerText = Postedby;
        p.innerText = "26th september 9:53";
        div.classList.add("post_topinfo");
        div.appendChild(h3)
        div.appendChild(p)

        div_outer.appendChild(img)
        div_outer.appendChild(div)
        //post top

        //post bottom
        var post_bottom = document.createElement("div");
        var message = document.createElement("p");
        message.innerText = PostValue;
        post_bottom.classList.add("post_bottom");
        post_bottom.appendChild(message)
        //post bottom

        //post image
        post_img = document.createElement("div");
        p_img = document.createElement("img");
        p_img.src = PostImage;
        post_img.classList.add("post_img");
        post_img.appendChild(p_img)
        //post image
        //post options
        var like = document.createElement("p")
        var thumbsup = document.createElement("span");//child of first inner div
        thumbsup.innerText = "thumb_up";
        like.innerText = postsLikedBy + "Like";
        thumbsup.classList.add("material-icons");

        var comment = document.createElement("p");
        var chatbubble = document.createElement("span");//child of second inner div
        chatbubble.innerText = "chat_bubble_outline";
        chatbubble.id = "comments";
        comment.innerText = postAllComment + "Comment";
        chatbubble.classList.add("material-icons");

        var share = document.createElement("p");
        var nearme = document.createElement("span");//child of third inner div
        nearme.innerText = "near_me";
        share.innerText = "Share";
        nearme.classList.add("material-icons");

        var option1 = document.createElement("div");//first inner div
        option1.classList.add("post_option");
        option1.appendChild(thumbsup)
        option1.appendChild(like)

        var option2 = document.createElement("div");//second inner div
        option2.classList.add("post_option");
        option2.appendChild(chatbubble)
        option2.appendChild(comment)

        //all inner divs are the child of the outer div (post option S)
        var option3 = document.createElement("div");//third inner div
        option3.classList.add("post_option");
        option3.appendChild(nearme);
        option3.appendChild(share)

        //post options
        var options = document.createElement("div");//the outer div of post options
        options.classList.add('post_options')
        options.appendChild(option1)
        options.appendChild(option2)
        options.appendChild(option3)

        //comment box
        var input = document.createElement("input");//text
        var inputsubmit = document.createElement("input");//submitbtn
        var lable = document.createElement("label");//for text
        var lable2 = document.createElement("label");//for textarea
        var textarea=document.createElement("textarea");//textarea
        var commentform=document.createElement("form");//form for commenting in   //will contain all of labels and input
        var list=document.createElement("ul");//onordered list
        var heading=document.createElement("h3");//heading comments
        var allcomments=document.createElement("div");//will contains everything 

        allcomments.id="allcomments";
        list.id="pastcomments";
        commentform.id="newcomment";
        input.id="tbname";
        textarea.id="txcomment";
        inputsubmit.id="btnsubmitcomment";
        lable.innerText="Name";
        lable.for="tbname";
        lable2.innerText="Comment";
        lable2.for="txcomment";

        heading.innerText="Comments";
        inputsubmit.value="submit Comment";

        input.type="text";
        inputsubmit.type="button";
        input.maxLength="20";
        textarea.maxLength="4096";
        textarea.style.width="96%";

        //append for the form
        commentform.appendChild(lable)
        commentform.appendChild(input)
        commentform.appendChild(lable2)
        commentform.appendChild(textarea)
        commentform.appendChild(inputsubmit)

        //append for div
        allcomments.appendChild(heading)
        allcomments.appendChild(list)
        allcomments.appendChild(commentform)



        //comment box

        var div_post = document.createElement("div");
        div_post.classList.add('post');

        div_post.appendChild(div_outer);//make a form for commenting
        div_post.appendChild(post_bottom);
        div_post.appendChild(post_img);
        div_post.appendChild(options);
        div_post.appendChild(allcomments);


        document.getElementById('div_all_posts').appendChild(div_post);

    });



});


const rootRef=firebase.database().ref();
const commentRef=rootRef.child("comments");

document.getElementById("btnsubmitcomment").addEventListener("click",function(){
    var newcomment= document.getElementById("txcomment").value

    var newpostRef= commentRef.push();

    newpostRef.set({

        name:document.getElementById("tbname").value.trim(),
        Comment:newcomment.trim(),
        frompage:location.pathname,
        when:firebase.database.ServerValue.TIMESTAMP
    });
})


// document.getElementById("comment-box").style.display = "none";
// document.getElementById("comments").onclick = display_comment_box();

// console.log(stories)
//stories 
for (var i = 0; i < 50; i++) {
    var img = document.createElement("img");
    var h4 = document.createElement("h4");
    var imgback = document.createElement("img");

    imgback.src = 'images/418876.jpg';
    img.src = 'images/avatar.png';
    img.classList.add('story_avatar');
    imgback.classList.add('storyImage');
    h4.innerText = "Sameer"
    var div = document.createElement("div");
    div.classList.add('story');
    div.appendChild(imgback)
    div.appendChild(img)
    div.appendChild(h4)

    var stories = document.getElementById('stories');
    stories.appendChild(div)
    // document.getElementById('mydiv').style.backgroundImage = "url('images/avatar.png');"    
}
// {/* <div style="background-image: url(images/418876.jpg);" class="story">
//                     <img class="user_avatar story_avtar" src="images/avatar.png" alt="">
//                     <h4>Sameer</h4>
//                 </div> */}
function register() {
    var isEexists = false;
    var sEmail = document.getElementById("inp_sgn_email").value;
    var sName = document.getElementById("inp_sgn_user").value;
    var sPassword = document.getElementById("inp_sgn_password").value

    if (sName == "") {
        document.getElementById("inp_sgn_user").style.borderColor = "red"; //border ko red karna hai takay user ko focus ho saky kay yahan error hai
        document.getElementById("inp_sgn_user").style.backgroundColor = "#FF7F7F";
        document.getElementById("inp_sgn_user").placeholder = "username Required";
        return;
    }
    if (sEmail == "") {
        document.getElementById("inp_sgn_email").style.borderColor = "red"; //border ko red karna hai takay user ko focus ho saky kay yahan error hai
        document.getElementById("inp_sgn_email").style.backgroundColor = "#FF7F7F";
        document.getElementById("inp_sgn_email").placeholder = "email Required";
        return;
    }
    if (sPassword == "" || (sPassword + "").length < 6) {
        document.getElementById("inp_sgn_password").value = "";
        document.getElementById("inp_sgn_password").style.borderColor = "red"; //border ko red karna hai takay user ko focus ho saky kay yahan error hai
        document.getElementById("inp_sgn_password").style.backgroundColor = "#FF7F7F";
        document.getElementById("inp_sgn_password").placeholder = "required with min 6 digit";
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(sEmail, sPassword)
        .then((cred) => {
            // Signed in 
            // ...
            var user = cred.user;
            var userData = {
                UID: user.uid,
                Name: sName,
                Email: sEmail,
                Password: sPassword
            }
            firebase.database().ref("/credentials").push(userData);

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
            // ..
            console.log(error)
        });
}
//login with password and email
var currentUserUID = "";
var currentUser = "";

function login() {
    var isEFound = false;
    var isPFound = false;
    var email = document.getElementById('inp_lgn_email').value;
    var password = document.getElementById('inp_lgn_password').value;
    var checkBox = document.getElementById("myCheck");

    logmein(email, password, checkBox.checked);
}

function signout() {
    localStorage.clear();
    location.replace("index.html");
}
//check if data already exists
var lsUserKey = localStorage.getItem("lsUserKey");
var lsEmail = localStorage.getItem("lsEmail");
var lsPassword = localStorage.getItem("lsPassword");
// localStorage.clear();
if (lsUserKey != null && lsEmail != null && lsPassword != null) {
    logmein(lsEmail, lsPassword);
}
else {
    alert("storage empty")
}

function logmein(e, p, cb) {
    firebase.auth().signInWithEmailAndPassword(e, p)
        .then((cred) => {
            // Signed in 
            // ...
            var user = cred.user;
            firebase.database().ref("/credentials/").once('value', function (snapshot) {
                snapshot.forEach(function (childsnapshot) {
                    var key = childsnapshot.key;
                    var users = childsnapshot.val();

                    if (users['UID'] == user.uid) {
                        // userKey = key;
                        // alert(users['Name']+" sign in success "+users['Email'])
                        if (cb == true)//if keep me login true
                        {
                            localStorage.setItem("lsUserKey", key)
                            localStorage.setItem("lsEmail", e)
                            localStorage.setItem("lsPassword", p)
                        }
                        window.open("facebook.html")
                        //console.log("logged in")
                    }

                })
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
            // ..
            console.log(error)
        });
}
// //changing password
// function chngpass() {
//     document.getElementById('div1').style.display = "none"
//     document.getElementById('div2').style.display = "block"

// }
// function confirm_chng() {
//     const user = firebase.auth().currentUser;
//     var crntPassword = document.getElementById('inp_crnt_pass').value;
//     const newPassword = document.getElementById('inp_new_pass').value;
//     if (crntPassword == lsPassword) {
//         user.updatePassword(newPassword).then(() => {
//             // Update successful.
//             localStorage.setItem("lsPassword", newPassword)
//             location.reload();
//         }).catch((error) => {
//             // An error ocurred
//             // ...
//             console.log(error.message)
//         });
//     }
//     else {
//         alert("enter correct password")
//     }
// }