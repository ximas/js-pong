var y_b = 500;
var x_b = 500;

window.onload = () => {
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

var Round = Math.round;
var Pow = Math.pow;
var Sqrt = Math.sqrt;

var draw_line = function(xi,yi,xii,yii){
  ctx.beginPath();
  ctx.moveTo(xi,y_b-yi);
  ctx.lineTo(xii,y_b-yii);
  ctx.stroke();
  ctx.closePath();
};

var draw_circ = function(x,y,r){
  ctx.beginPath();
  ctx.arc(x,y_b-y,r,0,2*Math.PI);
  ctx.stroke();
  ctx.closePath();
};

var find_circ_point = function(cpx,cpy,g,i,r,bx,by){
  
  var a = Round((Pow(g,2)+1)*1000)/1000;
  var b = Round((2*g*(i-cpy)-2*cpx)*1000)/1000;
  var c = Round((Pow(i-cpy,2)+Pow(cpx,2)-Pow(r,2))*1000)/1000;

  var x_i = ((-b)+Sqrt(Pow(b,2)+(-4*a*c)))/(2*a);
  var x_ii = ((-b)-Sqrt(Pow(b,2)+(-4*a*c)))/(2*a);
  
  var y_i = g*x_i+i;
  var y_ii = g*x_ii+i;
  
  var d;
  
  if(Sqrt(Pow(bx-x_i,2)+Pow(by-y_i,2))<Sqrt(Pow(bx-x_ii,2)+Pow(by-y_ii,2))){
    d = [x_i,y_i];
  }
  if(Sqrt(Pow(bx-x_ii,2)+Pow(by-y_ii,2))<Sqrt(Pow(bx-x_i,2)+Pow(by-y_i,2))){
    d = [x_ii,y_ii];
  }
  
  return d;
};

var calc_line_equ = function(a,b,x,y){
  var g = (y-b)/(x-a);
  var i = y-(g*x);
  return [g,i];
};

var calc_line_perp = function(x,y,g){ // change the calc functions to one function which does multiple calculations !! like x,y,g ++ calculation eg 'p' (perp)
  p_g = -1/g;
  p_i = y-(p_g*x);
  return [p_g,p_i];
};

var tan = function(deg){
  var deg2rad = Math.PI/180;
  var ratio = Math.tan(deg * deg2rad);
  return ratio;
};

var atan = function(ratio){
  var rad2deg = 180/Math.PI;
  var deg = Math.atan(ratio) * rad2deg;
  return deg;
};

function circ (x,y,r){
  this.cpx = x;
  this.cpy = y;
  this.rad = r;
  
  this.draw = function(cpx,cpy,rad){
    draw_circ(cpx,cpy,rad);
  };
}

function ball (x,y,a){
  this.angle = a;
  this.x_pos = x;
  this.y_pos = y;
  
  this.draw = function(x,y){
    draw_circ(x,y,10);
  };
  
  this.line_eq = function(x,y,a){
    var g = tan(a);
    this.g = g;
    var i = y-x*g;
    this.i = i;
    draw_line(0,i,500,i+500*g);
  };
}

var test = function(x,y,a){
  
  ctx.fillStyle = 'rgb(255,255,255)';
  ctx.fillRect(0,0,x_b,y_b);
  
  var mycirc = new circ(210,0,100);
  mycirc.draw(mycirc.cpx,mycirc.cpy,mycirc.rad);
  
  var myball = new ball (x,y,a);
  myball.draw(myball.x_pos,myball.y_pos);
  myball.line_eq(myball.x_pos,myball.y_pos,myball.angle);
    
  var coord = (find_circ_point(mycirc.cpx,mycirc.cpy,myball.g,myball.i,mycirc.rad,myball.x_pos,myball.y_pos)); //coordinates of point on circle
  
  if(typeof coord === 'undefined'){
    coord = [0,0]; // if ball tradjectory will miss the circumference of the circle
  }
  
  draw_circ(coord[0],coord[1],10);
  
  var center_circ_to_coord = calc_line_equ(mycirc.cpx,mycirc.cpy,coord[0],coord[1]); // equation of line, using coord's and centre of circle
  var perp_to_center_circ = calc_line_perp(coord[0],coord[1],center_circ_to_coord[0]); // line which is perpendicular to above line 
  
  draw_line(mycirc.cpx-500,mycirc.cpy-500*center_circ_to_coord[0],mycirc.cpx+500,mycirc.cpy+500*center_circ_to_coord[0]);
  draw_line(0,perp_to_center_circ[1],500,500*perp_to_center_circ[0]+perp_to_center_circ[1]);
  
  var para_i = myball.y_pos - center_circ_to_coord[0]*myball.x_pos; //parallel is line which creates a triangle between the perpendicular line, the ball tradjectory line, and this line which is parallel to the line disecting the centre of the circle
    // parallel line's y intercept is found by rearranging the equation of a line and inputing the coordinates of the ball on the wall, and the gradient of the line disecting the circle
  
  var parallel_x = (perp_to_center_circ[1]-para_i)/(center_circ_to_coord[0]-perp_to_center_circ[0]); // point at which the parallel line and the perpendicular line meet ^^
  var parallel_y = parallel_x*center_circ_to_coord[0] + para_i; // see above 
    
  var len_adj = Sqrt(Pow(parallel_x-coord[0],2)+Pow(parallel_y-coord[1],2)); // length of adjacent
  var len_opp = Sqrt(Pow(parallel_x-myball.x_pos,2)+Pow(parallel_y-myball.y_pos,2)); // length of opposite
  
  var refl_angle = atan(len_opp/len_adj);  // reflection angle
  var refl_grad = tan(myball.angle+(90-refl_angle)*2); // gradient of reflected line
  
  var refl_i = coord[1] - coord[0]*refl_grad; // y intercept of reflected line
  
  draw_line(0,refl_i,500,refl_i+500*refl_grad);
  console.log(refl_angle);
};

var x = 0;
var y = 200;
var a = 330;

test(x,y,a);
}
