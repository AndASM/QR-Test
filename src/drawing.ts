import {EventDispatcher} from "ste-events";

export interface Point {
    x: number;
    y: number;
}

export interface Rectangular {
    topRightCorner: Point
    topLeftCorner: Point
    bottomRightCorner: Point
    bottomLeftCorner: Point
}

export class CanvasVideoDrawing {
    context: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    video: HTMLVideoElement

    constructor(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
        this.context = canvas.getContext("2d")
        this.canvas = canvas
        this.video = video

        this.checkVideoFrame()
    }

    private _onVideoFrame = new EventDispatcher<CanvasVideoDrawing,ImageData>()

    public get onVideoFrame() {
        return this._onVideoFrame.asEvent()
    }

    public drawLine(begin: Point, end: Point, color: CanvasFillStrokeStyles["strokeStyle"]) {
        this.context.beginPath();
        this.context.moveTo(begin.x, begin.y);
        this.context.lineTo(end.x, end.y);
        this.context.lineWidth = 4;
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    public drawRectangular(shape: Rectangular, color: CanvasFillStrokeStyles["strokeStyle"]) {
        this.context.beginPath();
        this.context.moveTo(shape.topLeftCorner.x, shape.topLeftCorner.y);
        this.context.lineTo(shape.topRightCorner.x, shape.topRightCorner.y);
        this.context.lineTo(shape.bottomRightCorner.x, shape.bottomRightCorner.y);
        this.context.lineTo(shape.bottomLeftCorner.x, shape.bottomLeftCorner.y);
        this.context.closePath()
        this.context.lineWidth = 4;
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    protected checkVideoFrame() {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.canvas.height = this.video.videoHeight
            this.canvas.width = this.video.videoWidth

            // Draw the video to the canvas, and get the image for processing
            this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
            const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)

            // Give our subscribers the new frame
            this._onVideoFrame.dispatch(this, imageData)
        }

        window.requestAnimationFrame(()=> this.checkVideoFrame())
    }
}
