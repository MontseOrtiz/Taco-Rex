//CANVAS
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

// function bliss(){
//     ctx.fillRect(canvas.width - 150,290,30,30)
// }

//VARIABLES
var interval;
var frames = 0;
var score = 0;
var images = {
    logo: "",
    bg: "./Imagenes/bosque.jpg",
    bg2: "./Imagenes/ciudad.png",
    trex1: "./Imagenes/trex1.png",
    trex2: "./Imagenes/trex2.png",
    obstaculo_roca: "./Imagenes/roca1.png",
    obstaculo_tronco: "./Imagenes/tronco1.png",
    taco: "./Imagenes/taco.png",
    chilli:  "./Imagenes/Chilli.png"
}
var obstaculos = [];
var tacos = [];


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
        if (frames > 1000){
            console.log('speed')
            this.x-=3
        } else if (frames > 2000){
            this.x-=3.5
        } else {
            console.log('normal')
            this.x-=2.5
        }
        if(this.x < - this.width) this.x = 0
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
        ctx.drawImage(this.image,this.x + this.width,this.y,this.width,this.height) 
    }

    this.drawScore = function(){
        ctx.fillStyle = "black"
        ctx.font = "bold 24px Avenir"
        ctx.fillText("Score: " + score, 50,50)
    }
}

    //TREX
function Trex(){
    Board.call(this)
    this.x = 100
    this.y = 215
    this.width = 65
    this.height = 100
    this.live = 
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
        if(this.y < 215) this.y =215
        if (this.y > 300) this.y = 300
    }

    this.isTouching = function(item){
        return (this.x + 20 < item.x + item.width) &&
        (this.x + this.width > item.x) &&
        (this.y + (this.height*.85) < item.y + item.height) &&
        (this.y + this.height> item.y);
    }
}
    
    //OBSTACULOS

function Obstaculos(y, src){
    this.x = canvas.width
    this.y = y
    this.width = 30
    this.height = 30
    this.image = new Image()
    this.image.src = src ? src : images.obstaculo_roca
    this.draw = function(){
        this.x--
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height) 
    }
}

     //TACOS
function Tacos(y){
    this.x = canvas.width
    this.y = y
    this.width = 30
    this.height = 25
    this.image = new Image()
    this.image.src = images.taco
    this.draw = function(){
        this.x--
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height) 
    }
}



//INSTANCIAS
var bg = new Board()
var tRex = new Trex()
var roca = new Obstaculos()
var taco = new Tacos()


//FUNCIONES PRINCIPALES
function start(){
    if(!interval) interval = setInterval(update,1000/60)
}
function update(){
    frames++
    if (frames % 60 === 0) {
        score++;
    }
    if (score>5){
        bg.image.src = images.bg2;
    }
    ctx.clearRect(0,0,canvas.width, canvas.height)
    bg.draw()
    bg.drawScore()
    drawRocas()
    // bliss()
    drawTacos()
    tRex.draw()
    checkTrexCollition()
    
    
}
function gameOver(){
    clearInterval(interval)
    interval = null
    
}

//FUNCIONES AUXILIARES


function generarRoca(){
    if(frames%300===0){
        if (score<=10) {
            var y = Math.floor(Math.random()*60 + 300)
            obstaculos.push(new Obstaculos (y))
        } else {
            var y = Math.floor(Math.random()*60 + 350)
            obstaculos.push(new Obstaculos (y, images.chilli))
        }
    }
    if (frames%550===0){
        var y = Math.floor(Math.random()*60 + 300)
        obstaculos.push(new Obstaculos(y, images.obstaculo_tronco))
    }
}


function drawRocas(){
    generarRoca()
    obstaculos.forEach(function(roca){
        roca.draw()
    })
}

function generarTacos(){
    if(frames%1000===0){
        var y = Math.floor(Math.random()*60 + 300)
        tacos.push(new Tacos(y))
    }
}

function drawTacos(){
    generarTacos()
    tacos.forEach(function(taco){
        taco.draw()
    })
}



function checkTrexCollition(){
    for(var roca of obstaculos){
        if(tRex.isTouching(roca)){
            gameOver()
        }
    }
    for(var i=0; i<tacos.length; i++){
        if(tRex.isTouching(tacos[i])){
            tacos.splice(i,1);
            score+=50;
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

