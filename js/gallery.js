/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
    var currentTime = new Date().getTime();
    if (mLastFrameTime === 0) {
        mLastFrameTime = currentTime;
    }

    if ((currentTime - mLastFrameTime) > mWaitTime) {
        swapPhoto();
        mLastFrameTime = currentTime;
    }
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/
// Makes gallery Image Object
function GalleryImage(path, place, descrp, d) {
    this.image = path;
    this.location = place;
    this.description = descrp;
    this.date = d;
}
//$GET request
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
 = decodeURIComponent(tokens[2]);
 }
 return params;
}
var $_GET = getQueryParams(document.location.search + '');
//XMLHTTP Request
var mImages = [];
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mURL ="";
if ($_GET["json"]){
    mURL = $_GET["json"];
}else{
   mURL = "images.json"; 
}
var mRequest = new XMLHttpRequest();
mRequest.onreadystatechange = function() {
    // Do something interesting if file is opened successfully
    if (mRequest.readyState == 4 && mRequest.status == 200) {
        try {
            mJson = JSON.parse(mRequest.responseText);
            for(var i = 0; i<mJson.images.length; i++) { 
                var imgloc = mJson.images[i].imgPath;
                var loca = mJson.images[i].imgLocation;
                var desc = mJson.images[i].description;
                var d = mJson.images[i].date;
                mImages.push(new GalleryImage(imgloc, loca, desc, d));
            }
            console.log(mJson);
        } catch(err) {
            console.log(err.message);
        }
    }
};
mRequest.open("GET",mURL, true);
mRequest.send();
var mCurrentIndex = 0;
function swapPhoto() {
    if(prevClicked){
        if(mCurrentIndex > 0) {
            mCurrentIndex--;
        } else { 
            mCurrentIndex = mImages.length-1;
        };
    }else {
        if(mCurrentIndex < mImages.length-1) {
            mCurrentIndex++;
        } else { 
        mCurrentIndex = 0;
    };
    };

        setPhoto();       
};
//Set Photo to be displayed
function setPhoto(){
    $('.photoHolder #photo').attr("src", mImages[mCurrentIndex].image);
    $('.location').text('Location: ' + mImages[mCurrentIndex].location);
    $('.description').text('Description: ' + mImages[mCurrentIndex].description);
    $('.date').text('Date: ' + mImages[mCurrentIndex].date); 
}
//cycles backwards, from 13 to 1 back to 13. also sets it to automatically go backwards
var prevClicked = false;
function goBack(){
        $('#prevPhoto').click(function(){
            prevClicked=true;
        if(mCurrentIndex === 0){
            mCurrentIndex = mImages.length-1;
            setPhoto();
            mLastFrameTime=0;

        }else{
            mCurrentIndex--;
            setPhoto();
            mLastFrameTime=0;
        }
    });
};
//cycles forwards, also clicks through pictures
function goFor(){
        $('#nextPhoto').click(function(){
                prevClicked=false;
        if(mCurrentIndex === mImages.length-1){
            mCurrentIndex = 0;
            setPhoto();
            mLastFrameTime=0;

        }else{
            mCurrentIndex++;
            setPhoto();
            mLastFrameTime=0;
        }
    });
};
//hides/shows details 
function deets(){
    $('.moreIndicator').click(function(){ 
        console.log(mCurrentIndex);
        if( $('.moreIndicator').hasClass('rot90')){
            $('.details').slideDown();
            $('.moreIndicator').removeClass('rot90');
            $('.moreIndicator').addClass('rot270');
        }else{
            $('.details').slideUp();
            $('.moreIndicator').removeClass('rot270');
            $('.moreIndicator').addClass('rot90');
        }
    });
};

function makeGalleryImageOnloadCallback(galleryImage) {
    return function(e) {
        galleryImage.img = e.target;
        mImages.push(galleryImage);
    }
} //when doc loads, have these going/active i guess
$(document).ready( function() {
  $('.details').eq(0).hide();
  deets();
  goBack();
  goFor();
});
window.addEventListener('load', function() {
    
    console.log('window loaded');

}, false);
