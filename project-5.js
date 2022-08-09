let canvas =document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let collistioncanvas =document.getElementById("collistioncanvas");
const collistionctx = collistioncanvas.getContext('2d');
collistioncanvas.width  = window.innerWidth;
collistioncanvas.height = window.innerHeight;

let timetonextraven = 0 ;
let ravenInterval = 500 ;
let lasttime = 0 ;
let scrol = 0;
ctx.font='50px Impact' ;
let gameover = false ;

let ravans  = []  ;
class Ravans {
    constructor(){
        this.spritwidth = 271 ; 
        this.spritheight = 194 ; 
        this.sizeModifier = Math.random() * 0.6 + 0.4 ; 
        this.width = this.spritwidth * this.sizeModifier ; 
        this.height  =this.spritheight * this.sizeModifier ;
        this.x = canvas.width ; 
        this.y = Math.random() * (canvas.height - this.height ); 
        this.directionx = Math.random() * 5 + 3 ;  // move in + with x direction ;
        this.directiony = Math.random() * 5 - 2.5 ; // all dir in + and - ;
        this.marketfordetect = false;
        this.image =  new Image();
        this.image.src = 'https://www.frankslaboratory.co.uk/downloads/raven.png' ;
        this.frame = 0 ;
        this.maxframe = 4 ;  
        this.timeSinceFlap = 0 ;
        this.flapInterval = Math.random() * 50 + 50 ; 
        this.randomcolor =[Math.floor(Math.random() * 255) , Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)]; 
        this.color = 'rgb(' + this.randomcolor[0] + ',' + this.randomcolor[1] + ',' + this.randomcolor[2] + ')'; 
    }   
    update(delatime){
        if(this.y < 0 || this.y > canvas.height - this.height ){ // must - height of fly 
            this.directiony = this.directiony * -1  ;  // * -1 to change the direction
        } 
        this.x -= this.directionx;
        this.y += this.directiony;
        if(this.x < 0  - this.width) this.marketfordetect = true; 
        this.timeSinceFlap += delatime ;
        if(this.timeSinceFlap > this.flapInterval){
        if (this.frame > this.maxframe )this.frame = 0 ;
        else this.frame++; 
        this.timeSinceFlap = 0 ;
        particles.push(new Particle(this.x , this.y , this.width , this.color ));
        }   
        if (this.x < 0 - this.width ) gameover = true ;
    }
    draw(){
        collistionctx.fillStyle = this.color;
        collistionctx.fillRect(this.x , this.y , this.width, this.height)
         ctx.drawImage(this.image ,this.frame * this.spritwidth , 0 , this.spritwidth , this.spritheight , this.x , this.y 
          ,  this.width , this.height);
    }
}
let explosions = [] ; 
class Explosion {
    constructor(x ,y ,size ){
        this.image = new Image();
        this.image.src = "https://www.frankslaboratory.co.uk/downloads/boom.png";
        this.spritwidth = 200 ; 
        this.spritheight = 179 ;
        this.size = size;
        this.x =x ;
        this.y =y ;
        this.frame =  0; 
        this.sound = new Audio();
        // this.sound.src = "frozen orchard.mp3" ;
        this.timesincelastframe =0 ;
        this.frameinternval = 200 ; 
        this.marketfordetect = false ; 
    }
    update(delatime){
        if(this.frame === 0 )this.sound.play();
        this.timesincelastframe +=delatime;
        if(this.timesincelastframe > this.frameinternval){
            this.frame++ ;  
            this.timesincelastframe = 0 ;
            if(this.frame > 5 )this.marketfordetect = true ;
        }
    }
    draw(){
        ctx.drawImage(this.image ,this.frame * this.spritwidth , 0 ,
            this.spritwidth , this.spritheight , this.x , this.y - this.size/4 ,this.size, this.size);
    }
}
let particles = [] ;
class Particle{
    constructor(x , y , size , color){
        this.size = size ; 
        this.x = x * this.size/2 ; 
        this.y = y * this.size/3  ;
        this.radious  = Math.random() * this.size / 10  ;
        this.maxradious = Math.random() * 20 + 35 ; 
        this.marketfordetect = false ; 
        this.speedx = Math.random() * 1 + 0.5 ; 
        this.color = color ; 
    }
    update(){
        this.x += this.speedx ; 
        this.radious += 0.2 ;
        if (this.radious > this.maxradious) this.marketfordetect = true;
    }
    draw(){
        ctx.beginPath();
    ctx.fillStyle = this.color ; 
    ctx.arc(this.x , this.y, this.radious , 0 ,Math.PI * 2 );
    ctx.fill();  
    }
}



function drawscroll(){
    ctx.fillStyle = 'black' ;
    ctx.fillText('score :' + scrol, 50 , 75); 
    // ctx.fillStyle = 'white' ;
    // ctx.fillText('score :' + scrol, 55 , 80); 
}
function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black' ;
    ctx.fillText('Game over , you score is ' + scrol , canvas.width/2 , canvas.height/2 )
    ctx.fillStyle = 'red' ;
    ctx.fillText('Game over , you score is ' + scrol , canvas.width/2 +5 , canvas.height/2 +5 )
}
window.addEventListener("click" , function(e){
   const detectpixelcolor = collistionctx.getImageData(e.x , e.y , 1 , 1);
//    console.log(detectpixelcolor);
   const pc = detectpixelcolor.data ;
   ravans.forEach(object =>{
       if(object.randomcolor[0] === pc[0] ,object.randomcolor[1] === pc[1] ,object.randomcolor[2] === pc[2] ){
           object.marketfordetect = true ;
           scrol++;
           explosions.push(new Explosion(object.x, object.y , object.width));
       }
   })
})

const raven = new Ravans();
function animate(timestamp){
      ctx.clearRect(0 , 0 , canvas.width, canvas.height);
      collistionctx.clearRect(0 , 0 , canvas.width, canvas.height);
      let delatime = timestamp - lasttime ; // differ is 1 mill  seconds 
      lasttime = timestamp;  // 0
      timetonextraven += delatime ;
      if(timetonextraven > ravenInterval){
          ravans.push(new Ravans());
          timetonextraven = 0 ; 
          ravans.sort(function(a , b ){
              return a.width - b.width;
          })
      } 

      drawscroll();
      [...ravans , ...explosions , ...particles].forEach(object => object.update(delatime));
      [...ravans , ...explosions , ...particles].forEach(object => object.draw());
      ravans =  ravans.filter(object => !object.marketfordetect); 
      explosions =  explosions.filter(object => !object.marketfordetect); 
      particles =  particles.filter(object => !object.marketfordetect); 
    if(!gameover) requestAnimationFrame(animate); else drawGameOver()
}
animate(0);