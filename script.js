var canvas = document.getElementById("canvas");
var layer = document.getElementById("layer");
var btn = document.getElementById("enable");

var goC = document.getElementById("goC");

var enableGreenScreen = true;
var size = 500;


btn.onclick = () =>{
    if(enableGreenScreen){
        btn.innerHTML = "ENABLE";
        enableGreenScreen = false;
    }else{
        btn.innerHTML = "DISABLE";
        enableGreenScreen = true;
    }
}

var c = canvas.getContext("2d");
var lc = layer.getContext("2d");

document.body.style.margin = "0px";

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;

var v = g = false;

layer.width = w;
layer.height = h;

var cloneCat = false;

var video = document.createElement("video");
var guy = document.createElement("video");
guy.src="guy.mp4";
video.src = "cat.mp4";
video.muted = true;
video.crossOrigin = "Anonymous";
guy.crossOrigin = "Anonymous";

var pbs = 1;
var count = 1;

goC.onclick = () =>{
    goC.innerHTML = "GO CRAZY ( x" + count + ")";
    if(size > 100){
        count++;
        size /= 2;
        pbs += 0.5;
    }else{
        alert("They both TIERD...");
        goC.innerHTML = "GO CRAZY";
        size = w;
        pbs = 0.5;
    }
    cloneCat = true;
    guy.playbackRate = pbs;
    video.playbackRate = pbs;
}

function draw(){
    if(v && g){
        lc.fillRect(0, 0, w, h);
        lc.drawImage(guy, 0, 0, w, h);
        c.clearRect(0, 0, w, h);
        video.play();
        guy.play()
        if(!cloneCat){
            c.drawImage(video, 0, 0, w * 1.3, h);
        }else{
            c.drawImage(video, 0, 0, size, size);
        }
        const frame = c.getImageData(0, 0, w, h);
        const length = frame.data.length;

        for (let i = 0; i < length; i += 4) {
            let data = frame.data;            
            const red = data[i + 0];
            const green = data[i + 1];
            const blue = data[i + 2];
            if (green > 170 && red < 50) {
                if(enableGreenScreen){
                    data[i + 3] = 0;
                }
            }
        }
        if(!cloneCat){
            c.putImageData(frame, 0, 0);
        }else{
            for(let i = 0; i < w / size; i++){
                for(let j = 0; j < h / size; j++){
                    c.putImageData(frame, i * size, j * size)
                }
            }
        }
    }else{
        c.font = "20px verdana";
        c.fillText("Video Loading....", 0, h/2)
    }

}

function update(dt){
    if(video.readyState == 4) v = true;
    if(guy.readyState == 4) g = true;
}

var t0 = performance.now();
var t1 = dt = 0;

function loop(){
    t1 = performance.now();
    dt = t1 - t0;
    draw();
    update(dt / 1000);
    requestAnimationFrame(loop);
}

loop();

