//Pierre MARZIN 14/11/2018
// Trying to get realistic digital 2d trees

//trees array
var trees;
//trees index
var ntrees;
//how many rows,columns
var nh, nv;
//how long a branch grows until it divides itself 
var maxlife=15;

function setup() {
	//canvas initialization
  createCanvas(windowWidth, windowHeight, P2D);
  colorMode(HSB, 360, 255, 255);
  background(40, 10, 255);
  frameRate(200);
  smooth(4);
	//array of tress
  trees=[];
	//rows, columns
  nh=8;
  nv=3;
  ntrees=0;
	//trees are created
  for (var i=0; i<nh; i++) {
    for (var j=0; j<nv; j++) {
      createTree(i, j);
    }
  }
}

function draw() {
	//trees grow once per frame
  for (var i=0; i<nv*nh; i++) {
    trees[i].grow();
  }
}
//restart on click event
function mouseReleased() {
  setup();
}
//creation of tree at row j, column i
function createTree(i, j) {
	//origin location
  var x=.1*width+i*int(.9*width/nh);
  var y=int(.2*height+j*int(.8*height/nv));
  var start=createVector(x, y);
	//tree
  trees[i+j*nh]=new Tree(start, start.y/(height-130), i+j*nh);
	//first branch: trunk
  trees[i+j*nh].branches[0]=new Branche(start, 15*sqrt(start.y/height), 0, 1, i+j*nh);
  ntrees++;
}
//tree object 'constructor'
function Tree(start, coeff, index) {
	//branches
  this.branches=[];
	//location of the origin (bottom) of the tree
  this.start=start;
	//ratio used for perspective adjustements
  this.coeff=coeff;
	//base color
  this.teinte=random(30);
	//position in the array
  this.index=index;  
	//probabilities used for branches division
  this.proba1=random(.8, 1);
  this.proba2=random(.8, 1);
  this.proba3=random(.4, .5);
  this.proba4=random(.4, .5);
}
Tree.prototype.grow=function() {
	//is any branch still 'alive'?
  var found=false;
  for (var i=0; i<this.branches.length; i++) {
    var b=this.branches[i];    
    if (b.alive) {
			//alive branch is found
      found=true;
			//branch ages
      b.age++;
			//branch grows
      b.grow();
			//branch is displayed
      b.display();
    }
  }

}
//Branch object 'constructor'
function Branche(start, stw, angle, gen, index) {
	//origin
  this.position=start.copy();
	//STrokeWidth
  this.stw=stw;
	//generation index
  this.gen=gen;  
	//age	
  this.alive=true;
  this.age=0;
	//absolute angle
  this.angle=angle;
	//growing speed
  this.speed=createVector(0, -3);
	//index in the branches array
  this.index=index;
	//maximum age
  this.maxlife=maxlife*random(.3, .8);//;*(.4+.2*start.y/height);
	//probabilities are inherited from the tree
  this.proba1=trees[this.index].proba1;
  this.proba2=trees[this.index].proba2;
  this.proba3=trees[this.index].proba3;
  this.proba4=trees[this.index].proba4;
	//angle between parent and child branch
  this.deviation=random(.2, .7);
}
Branche.prototype.grow=function() {
	//branch has reached its max age (or random decides it dies sooner)
  if (this.age==int(this.maxlife/this.gen)||random(1)<.05*this.gen)  {
		//branch is dead
    this.alive=false;
		//if this branch is big enough, it divides itself 
		if(this.stw>.2){
    var brs=trees[this.index].branches;
    var c=trees[this.index].coeff;
		//divisions depend on the tree 'probalities'
    if (random(1)<this.proba1/this.gen)brs.push(new Branche(createVector(this.position.x, this.position.y), this.stw*random(.2, 1), this.angle+random(.7, 1.1)*this.deviation, this.gen+.1, this.index));//;//
    if (random(1)<this.proba2/this.gen)brs.push(new Branche(createVector(this.position.x, this.position.y), this.stw*random(.2, 1), this.angle-random(.7, 1.1)*this.deviation, this.gen+.1, this.index));
    if (random(1)<this.proba3/this.gen)brs.push(new Branche(createVector(this.position.x, this.position.y), this.stw*random(.5, .8), this.angle+random(.2, 1)*this.deviation, this.gen+.1, this.index));
    if (random(1)<this.proba4/this.gen)brs.push(new Branche(createVector(this.position.x, this.position.y), this.stw*random(.5, .8), this.angle-random(.2, 1)*this.deviation, this.gen+.1, this.index));
		}
}else {
		//branch is still alive, it grows
    this.speed.x+=random(-.5, .5);
  }
}
Branche.prototype.display=function() {
  var c=trees[this.index].coeff;  
  var st=trees[this.index].start;
  var x0=this.position.x;
  var y0=this.position.y;
	//rotation of the branch segment around its origin
  this.position.x+=-this.speed.x*cos(this.angle)+this.speed.y*sin(this.angle);
  this.position.y+=this.speed.x*sin(this.angle)+this.speed.y*cos(this.angle); 
  //shadows
  stroke(trees[this.index].teinte+this.age+10*this.gen, 0, 0, .04);
  strokeWeight(map(this.age, 0, this.maxlife, this.stw*1.3, this.stw*.9));
  var dis=.005*pow(st.y-y0, 1.8);
  line(x0+dis*random(.5, 1.2), 2*st.y-y0+dis*random(.5, 1.2), this.position.x+dis*random(.5, 1.2), 2*st.y-this.position.y+dis*random(.5, 1.2));//*sin(.3*(st.y-y0))//sin(.3*(st.y-this.position.y))*
  line(x0+dis*random(.5, 1.2), 2*st.y-y0+dis*random(.5, 1.2), this.position.x+dis*random(.5, 1.2), 2*st.y-this.position.y+dis*random(.5, 1.2));
  //light accent
  strokeWeight(map(this.age, 0, this.maxlife, this.stw, this.stw*.6));
  stroke(trees[this.index].teinte+this.age+20*this.gen, 150*c, 200+20*this.gen, 15*c);//
  line(x0+.1*this.stw, y0, this.position.x+.1*this.stw, this.position.y); 
  //darker tree
  stroke(trees[this.index].teinte+this.age+20*this.gen, 100*c, 50+20*this.gen, 15*c);//
  strokeWeight(map(this.age, 0, this.maxlife, this.stw, this.stw*.6));
  line(x0, y0, this.position.x, this.position.y);
}