function test(){
  var input = document.getElementById("images"),
      formdata = false;
     
  if (window.FormData) {
    formdata = new FormData();
    document.getElementById("btn").style.display = "none";
  } 
}

function showUploadedItem (source) {
  var list = document.getElementById("image-list"),
      li   = document.createElement("li"),
      img  = document.createElement("img");
    img.src = source;
    li.appendChild(img);
  list.appendChild(li);
}

if (input.addEventListener) {
  input.addEventListener("change", function (evt) {
    var i = 0, len = this.files.length, img, reader, file;
     
    document.getElementById("response").innerHTML = "Uploading . . ."
     
    for ( ; i < len; i++ ) {
      file = this.files[i];
   
      if (!!file.type.match(/image.*/)) {
 
      } 
    }
       
  }, false);
}