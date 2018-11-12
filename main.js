//CANVAS
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
//VARIABLES
var interval
var frames = 0
var images = {
    bg: "./Imagenes/bosque.png",
    trex1: "./Imagenes/trex1.png",
    trex2: "./Imagenes/trex2.png",
    logo: "",
    obstacle_bottom: "",
    obstacle_top: ""
}
var obstaculos = []

//CLASES 
    //BG
function Board(){
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.image = new Image()
    this.image.src = images.bg
    this.draw = function(){
        this.x--
        if(this.x < -this.width) this.x = 0
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
        ctx.drawImage(this.image,this.x + this.width,this.y,this.width,this.height)
    }

    this.drawScore = function(){
        ctx.font = "bold 24px Avenir"
        ctx.fillText("Score: " + Math.floor(frames/60), 50,50)
    }
}

    //TREX
function Trex(){
    Board.call(this)
    this.x = 100
    this.y = 215
    this.width = 65
    this.height = 100
    this.img1 = new Image()
    this.img1.src = images.trex1
    this.img2 = new Image()
    this.img2.src = images.trex2
    this.draw = function(){
        // this.boundaries()
        var img = this.which ? this.img1:this.img2;
        ctx.drawImage(img,this.x,this.y,this.width,this.height);
        if(frames%20===0) this.toggleWhich();
      }
      this.toggleWhich = function(){
        this.which = !this.which;
      }

    // this.boundaries = function(){
    //     if(this.y+this.height > canvas.height-10) {
    //         this.y = canvas.height-this.height
    //     }
    //     else if(this.y < 10 ) {
    //         this.y = 10
    //     }
    //     else this.y+=2.01

    // }

    // this.isTouching = function(item){
    //     return (this.x < item.x + item.width) &&
    //     (this.x + this.width > item.x) &&
    //     (this.y < item.y + item.height) &&
    //     (this.y + this.height > item.y);
    // }
}
    
    





//instances
var bg = new Board()
var tRex = new Trex()


//main functions
function start(){
    if(!interval) interval = setInterval(update,1000/60)
}
function update(){
    frames++
    ctx.clearRect(0,0,canvas.width, canvas.height)
    bg.draw()
    tRex.draw()
    
}
function gameOver(){
    clearInterval(interval)
    interval = null
    
}

//aux functions



//listeners

start()

