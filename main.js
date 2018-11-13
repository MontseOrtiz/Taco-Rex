//CANVAS
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

// function bliss(){
//     ctx.fillRect(canvas.width - 100,330,30,30)
// }

//VARIABLES
var interval;
var frames = 0;
var images = {
    logo: "",
    bg: "./Imagenes/bosque.png",
    trex1: "./Imagenes/trex1.png",
    trex2: "./Imagenes/trex2.png",
    obstaculo_roca: "./Imagenes/roca.png",
    obstaculo_tronco: "./Imagenes/tronco.png"
}
var obstaculos = [];


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
        ctx.fillStyle = "black"
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
        this.boundaries()
        var img = this.which ? this.img1:this.img2;
        ctx.drawImage(img,this.x,this.y,this.width,this.height);
        if(frames%20===0) this.toggleWhich();
      }
        this.toggleWhich = function(){
        this.which = !this.which;
      }

    this.boundaries = function(){
        if(this.y < 190) this.y =190
        if (this.y > 250) this.y = 250
    }

    this.isTouching = function(item){
        return (this.x < item.x + item.width) &&
        (this.x + this.width > item.x) &&
        (this.y < item.y + item.height) &&
        (this.y + this.height > item.y);
    }
}
    
    //OBSTACULOS

function Obstaculos(y, src){
    this.x = canvas.width
    this.y = y
    this.width = 30
    this.height = 25
    this.image = new Image()
    this.image.src = src ? src : images.obstaculo_roca
    this.draw = function(){
        this.x--
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height) 
    }
}
     




//INSTANCIAS
var bg = new Board()
var tRex = new Trex()
var roca = new Obstaculos()


//FUNCIONES PRINCIPALES
function start(){
    if(!interval) interval = setInterval(update,1000/60)
}
function update(){
    frames++
    ctx.clearRect(0,0,canvas.width, canvas.height)
    bg.draw()
    bg.drawScore()
    tRex.draw()
    drawRocas()
    //bliss()
    checkTrexCollition()
    
}
function gameOver(){
    clearInterval(interval)
    interval = null
    
}

//FUNCIONES AUXILIARES


function generarRoca(){
    if(frames%150===0){
        var y = Math.floor(Math.random()*50 + 280)
        obstaculos.push(new Obstaculos (y))
    }
    if (frames%350===0){
        var y = Math.floor(Math.random()*50 + 280)
        obstaculos.push(new Obstaculos(y, images.obstaculo_tronco))
    }
}


function drawRocas(){
    generarRoca()
    obstaculos.forEach(function(roca){
        roca.draw()
    })
}

function checkTrexCollition(){
    for(var roca of obstaculos){
        if(tRex.isTouching(roca)){
            gameOver()
        }
    }
}

//LISTENERS

addEventListener('keydown', function(e){
    switch (e.keyCode){
        case 37:
            tRex.y -= 30
            break
        case 39:
            tRex.y += 30
            break     
    }
})

addEventListener('keyup', function(){

})
start()

