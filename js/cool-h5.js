var myVideo = document.getElementById("video");//播放器
var coolPlay = document.getElementById("cool-play");
var cPlay = document.getElementById("c-play");//播放按钮
var cProgress = document.getElementById("c-progress");
var cPlayed = document.getElementById("c-played");//已经播放过的进度条
var cDrag = document.getElementById("c-drag");//进度条顶端的圆钮
var cCurrentTime = document.getElementById("c-currentTime");//当前时间span
var cTotalTime = document.getElementById("c-totalTime");//总时间
var loading = document.getElementsByClassName("icon-c-loading");//loading 旋转图标
var refresh = document.getElementsByClassName("icon-c-refresh");//重新加载按钮
var voice = document.getElementsByClassName("i-voice");//音量按钮
var voice_mask = document.getElementsByClassName("voice-mask");//音量总进度条
var voice_bared= document.getElementsByClassName("voice-bared");//现在的音量的进度条
var voice_dot = document.getElementsByClassName("voice-dot");
var voice_num = 0.8;//初始化当前的音量
volume(voice_num);//把音量初始化到80
function volume(n){
  myVideo.volume = n;
  voice_bared[0].style.height=n*100 + 'px';
}
function playPause() {
  if(myVideo.paused) {
    Play();
  } else {
    Pause();
  }
};
function Play(){
  cPlay.className = "icon-c-pause";
  myVideo.play();
}
function Pause(){
  cPlay.className = "icon-c-play";
  myVideo.pause();
}
refresh[0].onclick = function (){
  Load();
}
function Load(){
  Pause();
  myVideo.load();
  cPlayed.style.width = 0+"%";
  cDrag.style.display="none";
  cCurrentTime.innerHTML = "00:00";
  cTotalTime.innerHTML = "00:00";
}
//播放时间及进度条控制
myVideo.ontimeupdate = function(){  
  var currTime = this.currentTime,    //当前播放时间
      duration = this.duration;       // 视频总时长
  if(currTime == duration){
    Pause();
  }
  //百分比
  var pre = currTime / duration * 100 + "%";
  //显示进度条
  cPlayed.style.width = pre;
  var progressWidth = cProgress.offsetWidth;
  var leftWidth = progressWidth*(currTime / duration);
  if(leftWidth > 8 && (progressWidth - leftWidth) > 4){
    cDrag.style.display="block";    
  } else {
    cDrag.style.display="none";
  }  
  cDrag.style.left = progressWidth*(currTime / duration)-4 + "px";
  //显示当前播放进度时间
  cCurrentTime.innerHTML = getFormatTime(currTime,duration);
  cTotalTime.innerHTML = getFormatTime(duration,duration);
};
//当浏览器可在不因缓冲而停顿的情况下进行播放时
myVideo.oncanplaythrough = function() {
  loading[0].style.display="none";
}
  //当视频由于需要缓冲下一帧而停止
myVideo.onwaiting = function() {
  loading[0].style.display="block";
}
//当用户开始移动/跳跃到音频/视频中的新位置时
myVideo.onseeking = function() {
  if (myVideo.readyState == 0 || myVideo.readyState == 1) {
    loading[0].style.display="block";
  }
}
//拖拽进度条上的园钮实现跳跃播放
/*cDrag.onmousedown = function(e){ 
  if(cPlay.className == 'icon-c-pause')
    myVideo.pause();
  loading[0].style.display="block";
  document.onmousemove = function(e){
    console.log("e.clientX:"+e.clientX);
    console.log("coolPlay.offsetLeft:"+coolPlay.offsetLeft);

    var leftV = e.clientX - coolPlay.offsetLeft;
    console.log("coolPlay.offsetLeft:"+coolPlay.offsetLeft);
    console.log("leftV:"+leftV);
    if(leftV <= 0){
      leftV = 0;
    }
    if(leftV >= coolPlay.offsetWidth){
      leftV = coolPlay.offsetWidth-10;
    }
    cDrag.style.left = leftV+"px";
//  console.log(leftV);
  }    
  document.onmouseup = function (){
    var scales = cDrag.offsetLeft/cProgress.offsetWidth;
    var du = myVideo.duration*scales;
    console.log("scales:"+scales);
    console.log("du:"+du);
    myVideo.currentTime = du;
    if(cPlay.className == 'icon-c-pause')
      myVideo.play();     
    document.onmousemove = null;
    document.onmousedown = null;
  }
}*/
//在进度条上点击跳跃播放
cProgress.onclick = function(e){
  var event = e || window.event;
  console.log("当前点击的位置为："+(event.offsetX / this.offsetWidth) * myVideo.duration);
  myVideo.currentTime = (event.offsetX / this.offsetWidth) * myVideo.duration;
};
//根据duration总长度返回 00 或 00:00 或 00:00:00 三种格式
function getFormatTime(time,duration) {
  var time = time || 0;         
  
  var h = parseInt(time/3600),
      m = parseInt(time%3600/60),
      s = parseInt(time%60);
  s = s < 10 ? "0"+s : s;
  if(duration>=60 && duration <3600){
    m = m < 10 ? "0"+m : m; 
    return m+":"+s;
  }
  if (duration >=3600){
    m = m < 10 ? "0"+m : m; 
    h = h < 10 ? "0"+h : h;
    return h+":"+m+":"+s;
  } 
  return s;
}   
//音量的控制部分
//点击声音按钮时，把视频静音
voice[0].onclick = function(){  
  if(myVideo.muted){
    voice[0].className="i-voice icon-c-voice";
    myVideo.muted=false;
    if(voice_num >= 0 && voice_num <= 1){
      volume(voice_num);
    } else {
      volume(0.8);
    }    
  } else {
    voice_num = myVideo.volume; //记录下来静音前的音量
    voice[0].className='i-voice icon-c-mute';
    myVideo.muted=true;
    volume(0);
  }  
}
//当点击进度条上的一个位置时，变化音量
voice_mask[0].onclick = function(e){
  var event = e || window.event;  
  if(event.offsetY >= 100){
    voice[0].className='i-voice icon-c-mute';
    myVideo.muted=true;
    volume(0);
    return;
  }
  volume((100-event.offsetY)/100);
};
/*voice_mask[0].onmousedown = function(e){ 
  document.onmousemove = function(e){
    console.log("e.clientY:"+e.clientY);
    console.log("e.offsetY:"+e.offsetY);
    console.log(e);
    console.log(voice[0].offsetTop);
    console.log(document.getElementsByClassName("voice")[0]);
    volume((100-e.offsetY)/100);
    if(event.offsetY == 100){
      voice[0].className='i-voice icon-c-mute';
      myVideo.muted=true;
      volume(0);
    }   
  }    
  document.onmouseup = function (){    
    document.onmousemove = null;
    document.onmousedown = null;
  }
}*/
//全屏的控制部分
var fullscreen = document.getElementById('cool-fullScreen');
var FullScreenTF = true;
function launchFullscreen(element) {
  //此方法不能在异步中进行，否则火狐中不能全屏操作
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if(element.oRequestFullscreen) {
    element.oRequestFullscreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  } else {
    alert("您的浏览器版本太低，不支持全屏功能！");
  }
  FullScreenTF = false;
};
//退出全屏
function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.oRequestFullscreen) {
    document.oCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else {
    alert("您的浏览器版本太低，不支持全屏功能！");
  }
  FullScreenTF = true;
};
fullscreen.onclick = function() {       
  if(FullScreenTF) {
    launchFullscreen(coolPlay);
    fullscreen.className = "icon-c-shrink";         
  } else {
    exitFullscreen();
    fullscreen.className = "icon-c-enlarge";          
  }
};
