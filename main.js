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
var velocidad = 0;
var numTaco = 0;
var images = {
    logo: "./Imagenes/LOGO1.png",
    bg: "./Imagenes/fondo1.png",
    bg2: "./Imagenes/ciudad.png",
    trex1: "./Imagenes/trex1.png",
    trex2: "./Imagenes/trex2.png",
    obstaculo_roca: "./Imagenes/roca1.png",
    obstaculo_tronco: "./Imagenes/tronco1.png",
    taco: "./Imagenes/taco.png",
    obstaculo_carro1: "./Imagenes/carro1.png",
    obstaculo_carro2: "./Imagenes/carro2.png",
    instrucciones: "./Imagenes/instrucciones.png"
}
var obstaculos = [];
var tacos = [];
var audioBack = new Audio()
var velocidad = 1
var btnPlay = document.getElementById('jugar')
var btnInst = document.getElementById('instrucciones')
var turnos = []


//CLASES 
    //BG
function Board(){
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.image = new Image()
    this.image.src = images.bg
    // this.velocidad= 1
    this.draw = function(){
        if(Math.random()<1-(Math.pow(.9,frames/1000000))){
            velocidad+=2
        }
        this.x -= velocidad
        if(this.x < - this.width) this.x = 0
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
        ctx.drawImage(this.image,this.x + this.width,this.y,this.width,this.height) 
    }.bind(this);

    this.drawScore = function(){
        ctx.fillStyle = "black"
        ctx.font = "bold 24px Avenir"
        ctx.fillText("Score: " + score, 50,60)
    }

    this.drawTacosNum = function(){
        ctx.fillStyle = "black"
        ctx.font = "bold 24px Avenir"
        ctx.fillText("Tacos: " + numTaco, 50,50)
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
        if(this.y < 215) this.y =215
        if (this.y > 300) this.y = 300
    }

    this.isTouching = function(item){
        return (this.x + 20 < item.x + item.width )&&
        (this.x + this.width - 10 > item.x) &&
        (this.y + (this.height*.85) < item.y + item.height) &&
        (this.y + this.height> item.y + 7);
    }
}
    
    //OBSTACULOS

function Obstaculos(y, src, width,height){
    Board.call(this)
    this.x = canvas.width
    this.y = y
    this.width = width || 30
    this.height = height || 30
    this.image = new Image()
    this.image.src = src ? src : images.obstaculo_roca
    this.draw = function(){
        if (frames > 1000){
            console.log('speed')
            this.x-=4
        } else if (frames > 2000){
            this.x-=5
        } else if(frames > 3000){
            this.x -= 6
        }else {
            console.log('normal')
            this.x-=3.5
        }

        ctx.drawImage(this.image,this.x,this.y,this.width,this.height) 
    }
}
     //TACOS
function Tacos(y){
    Board.call(this)
    this.x = canvas.width
    this.y = y
    this.width = 35
    this.height = 30
    this.image = new Image()
    this.image.src = images.taco
    this.draw = function(){
        if (frames > 1000){
            console.log('speed')
            this.x-=4
        } else if (frames > 2000){
            this.x-=5
        } else {
            console.log('normal')
            this.x-=3.5
        }

        ctx.drawImage(this.image,this.x,this.y,this.width,this.height) 
    }
}

//INSTANCIAS
var bg = new Board()
var tRex = new Trex()



//FUNCIONES PRINCIPALES
function start(){
    obstaculos = []
    bg.image.src=images.bg
    numTaco = 0
    frames = 0
    score =0
    velocidad = 1
    tacosTurnos=[]
    tRex = new Trex()
    if(!interval) interval = setInterval(update,1000/60)
    audioBack.src = "./Audio/quiero_tacos.mp3"
    audioBack.play()
    audioBack.onended = function(){
        audioBack.src = "./Audio/gorillaz-on-melancholy-hill-instrumental.mp3"
        audioBack.load()
        audioBack.play()
    }
}

function update(){
    frames++
    console.log(frames)
    if (frames % 60 === 0) {
        score++;
    }
    if (score>100){
        bg.image.src = images.bg2;
    }
    ctx.clearRect(0,0,canvas.width, canvas.height)
    bg.draw()
    // bg.drawScore()
    bg.drawTacosNum()
    drawRocas()
    // bliss()
    drawTacos()
    tRex.draw()
    checkTrexCollition()
    
}

function gameOver(){
    clearInterval(interval)
    interval = null
    ctx.fillStyle = "white"
    ctx.font = "bold 80px Monaco"
    ctx.fillText("GAME OVER", 250,150)
    // ctx.fillStyle = "black"
    // ctx.font = "bold 40px Monaco"
    // ctx.fillText("Tacos: " + numTaco ,360,250)
    // ctx.font = "bold 20px Monaco"
    // ctx.fillText("Presiona 'Return' para reiniciar", 260,360)
    audioBack.pause()
    audioBack.currentTime= 0
    var audio = new Audio(src = "./Audio/mis_tacos.mp3")
    audio.play()
    turnos.push(numTaco)
    if(turnos.length === 2){
        ctx.fillStyle = "black"
        ctx.font = "bold 40px Monaco"
        ctx.fillText("Jugador 1-- Tacos " + turnos[0] ,160,250)
        ctx.fillText("Jugador 2 -- Tacos " + turnos[1] ,160,320)
        ctx.font = "bold 20px Monaco"
        ctx.fillText("Presiona 'Return' para reiniciar", 260,360)
    } else{
        ctx.fillStyle = "black"
        ctx.font = "bold 40px Monaco"
        ctx.fillText("Jugador 1 -- Tacos " + turnos[0] ,170,250)
        ctx.font = "bold 20px Monaco"
        ctx.fillText("Presiona 'Return' para jugador 2", 260,360)
    }
    
}

//FUNCIONES AUXILIARES

function drawCover(){
    var img = new Image()
    img.src = images.bg
    img.onload = function(){
        ctx.drawImage(img, 0,0,canvas.width,canvas.height)
    }
}


function generarRoca(){
    if(frames%101===0){
        if (score<=100) {
            var y = Math.floor(Math.random()*60 + 300)
            obstaculos.push(new Obstaculos (y))
        } else {
            var y = Math.floor(Math.random()*55 + 300)
            obstaculos.push(new Obstaculos (y, images.obstaculo_carro1, 50, 50))
        }
    }
    if (frames%223===0){
        if (score<=100){
            var y = Math.floor(Math.random()*60 + 300)
            obstaculos.push(new Obstaculos(y, images.obstaculo_tronco))
        }else{
            var y = Math.floor(Math.random()*55 + 300)
            obstaculos.push(new Obstaculos (y, images.obstaculo_carro2, 50, 50))
        }
        
    }
}


function drawRocas(){
    generarRoca()
    obstaculos.forEach(function(roca){
        roca.draw()
    })
}

function generarTacos(){
    if(frames%337===0){
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
            // score+=50;
            numTaco++
        }
    }
}



//LISTENERS

addEventListener('keydown', function(e){
    switch (e.keyCode){
        case 13:
            return start()
        case 37:
            e.preventDefault()
            tRex.y -= 25
            break
        case 38:
        e.preventDefault()
            tRex.y -= 25
            break
        case 39:
        e.preventDefault()
            tRex.y += 25
            break  
        case 40:
        e.preventDefault()
            tRex.y += 25
            break   
    }
})


btnPlay.onclick = function(){
    start()
    btnPlay.classList.add("ocultar")
    btnInst.classList.add("ocultar")
}

//INSTRUCCIONES
// btnInst.onclick = function(){
//     var image = new Image()
//     image.srcset=images.instrucciones
//     ctx.drawImage(image,0,0,canvas.width,canvas.height)

// }


drawCover()
