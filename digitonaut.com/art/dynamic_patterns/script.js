// "paint particles mixing" by garabatospr

// color palette

var colors   =  ["#ff0000","#feb30f","#0aa4f7","#000000","#ffffff"];

// set weights for each color 

// red, blue, and white dominates 

var weights  = [0,2,2,2,2];             

// scale of the vector field 
// smaller values => bigger structures  
// bigger values  ==> smaller structures 


// number of drawing agents 

var nAgents = 200;

let agent = [];

function setup() {
  //createCanvas(800,800);
	createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
	rectMode(CENTER);
  strokeCap(SQUARE);

  background(0);
  

  for(let i=0;i < nAgents;i++)
  {
		agent.push(new Agent(0,height*0.25 + randomGaussian()*70));
    agent.push(new Agent(0,height/2 + randomGaussian()*70));
		agent.push(new Agent(0,height*0.75 + randomGaussian()*70));
		agent.push(new Agent(0,height*1.0 + randomGaussian()*70));
	}

  
}

function draw() {

  if (frameCount > 10000)
  {
    noLoop();
  }
  
  for(let i=0;i < agent.length;i++)
  {
    agent[i].update(0,0);
  }
  
  
	stroke(0,0,100);
	noFill();
	strokeWeight(20);
	
	//rect(width/2,height/2,width-10,height-10);
	
}

// select random colors with weights from palette 

function myRandom(colors,weights)
{
    let sum = 0;
 
    for(let i=0;i < colors.length; i++)
    {
      sum += weights[i];
    }
 
    let rr = random(0,sum);
 
    for(let j=0;j < weights.length;j++)
    {
 
      if (weights[j] >= rr)
      {
        return colors[j];
      }
        rr -= weights[j];
    }

 }



// paintining agent 

class Agent {
  constructor(x0,y0)
  {
      this.p     = createVector(x0,y0);
      this.direction = 1;
      this.color = generateColor(10);
			this.scale = 3;
			this.strokeWidth = 5;
		  this.step = 2;
      this.pOld  = createVector(this.p.x,this.p.y);
		  this.split = 4;
  }
  
  update(xx,yy) {
		
    this.p.x += this.direction*vector_field(this.p.x,this.p.y,this.scale).x*this.step + 1;
    this.p.y += this.direction*vector_field(this.p.x,this.p.y,this.scale).y*this.step;
		
		if (this.p.x >= width)
		{
			this.p.x = 0;
			this.color = generateColor(10);
		  this.pOld.set(this.p);
		
		}

    strokeWeight(this.strokeWidth);
    stroke(this.color);
    line(this.pOld.x,this.pOld.y,this.p.x,this.p.y);
    
    this.pOld.set(this.p);
    
  }
    
}

// vector field function 
// the painting agents follow the flow defined 
// by this function 


function vector_field(x,y,myScale) {
  
  x = map(x,0,width,-myScale - 10,myScale + 10);
  y = map(y,0,height,-myScale - 10,myScale + 10);
  
  let k1 = 5;
  let k2 = 3;
 
	let u = sin(k1*y) + floor(cos(k2*y));
  let v = sin(k2*x) - cos(k1*x);
	
  // litle trick to move from left to right 
  
  if (u <= 1) 
  {
      u = -u;
   }  
	 
  
  return createVector(u,v);
}

function generateColor(scale) {
	let temp = myRandom(colors, weights);

	myColor = color(hue(temp) + randomGaussian() * scale,
		              saturation(temp) + randomGaussian() * scale,
		              brightness(temp) - scale, 
									random(1,100));

	return myColor;
}



// function to select 

function myRandom(colors,weights)
{ 
    let sum = 0;
 
    for(let i=0;i < colors.length; i++)
    {
      sum += weights[i];
    }
 
    let rr = random(0,sum);
 
    for(let j=0;j < weights.length;j++)
    {
 
      if (weights[j] >= rr)
      {
        return colors[j];
      }
        rr -= weights[j];
    }
 }

