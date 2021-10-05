import type {Point} from "jsqr/dist/locator"
import jsQR from "jsqr"
import {SmartHealthCard} from "./smarthealthcards"


function doInit() {
    var video = <HTMLVideoElement>document.createElement("video");
    var canvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var shcSet = new Set();

    function drawLine(begin: Point, end: Point, color: CanvasFillStrokeStyles["strokeStyle"]) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    }

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}}).then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", 'true'); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
    });

    function tick() {
        loadingMessage.innerText = "⌛ Loading video..."
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            loadingMessage.hidden = true;
            canvasElement.hidden = false;
            outputContainer.hidden = false;

            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

                if (!shcSet.has(code.data)) {
                    shcSet.add(code.data);

                    SmartHealthCard.build(code.data)
                        .then(shc => {
                            const div = document.createElement('div');
                            div.innerText = `${shc.verified ? 'Verified' : 'Unverified'} for ${shc.patientName}`;
                            outputMessage?.appendChild(div);
                        })
                }
            } /*else {
                outputMessage.hidden = false;
                outputData.parentElement.hidden = true;
            }*/
        }
        requestAnimationFrame(tick);
    }
}

document.addEventListener("DOMContentLoaded", doInit);
