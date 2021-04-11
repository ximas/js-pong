window.onload = () => {
var y_b = 500;
var x_b = 500;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var Round = Math.round;
var Pow = Math.pow;
var Sqrt = Math.sqrt;

var draw = function(){ // replace draw functions
    
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

var calc = function(){
    var arg = arguments;
    var ret = [];
    if(arg[arg.length-1] === 'e'){
        ret[0] = (arg[3]-arg[1])/(arg[2]-arg[0]); //a,b,x,y     g,i   getting line equation
        ret[1] = arg[3]-ret[0]*arg[2]; 
    }else if(arg[arg.length-1] === 'p'){
        ret[0] = -1/arg[2]; // x,y,p g,i getting line equation (perpendicular) from another line
        ret[1] = arg[1]-ret[0]*arg[0];
    }else if(arg[arg.length-1] === 'c'){ // find a point on the circumference by equating
        var a = Round((Pow(arg[2],2)+1)*1000)/1000; // the equation of one line to the
        var b = Round((2*arg[2]*(arg[3]-arg[1])-2*arg[0])*1000)/1000; // equation of the circle
        var c = Round((Pow(arg[3]-arg[1],2)+Pow(arg[0],2)-Pow(arg[4],2))*1000)/1000;
        
        var x_i = ((-b)+Sqrt(Pow(b,2)+(-4*a*c)))/(2*a); // the equation will produce 2 values
        var x_ii = ((-b)-Sqrt(Pow(b,2)+(-4*a*c)))/(2*a); // as the line penetrates the circle's
                                                        // circumference twice
        var y_i = arg[2]*x_i+arg[3]; // [x_i,y_i] and [x_ii,y_ii] are two
        var y_ii = arg[2]*x_ii+arg[3]; // corresponding point on the circumference discussion
        if(Sqrt(Pow(arg[5]-x_i,2)+Pow(arg[6]-y_i,2))<Sqrt(Pow(arg[5]-x_ii,2)+Pow(arg[6]-y_ii,2))){
            ret[0] = x_i; // use pythagoras to determin point on circumference
            ret[1] = y_i; // which is closest to the ball (as this is where it will collide)
        }               
        if(Sqrt(Pow(arg[5]-x_ii,2)+Pow(arg[6]-y_ii,2))<Sqrt(Pow(arg[5]-x_i,2)+Pow(arg[6]-y_i,2))){
            ret[0] = x_ii;
            ret[1] = y_ii;
        }                   // cpx,cpy,g,i,r,bx,by     x,y point on circumference
    }                       
    
    return ret;    
};

function circ (x,y,r){
    this.cpx = x;
    this.cpy = y;
    this.rad = r;
}

function ball (x,y,a){
    this.angle = a;
    this.x_pos = x;
    this.y_pos = y;
  
    this.line_eq = function(x,y,a){
        var g = tan(a);
        this.g = g;
        var i = y-x*g;
        this.i = i;
        draw_line(0,i,500,i+500*g);
    };
}

var test = function(x,y,a,cx){
    
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(0,0,x_b,y_b);
    
    var mycirc = new circ(cx,0,100);
    draw_circ(mycirc.cpx,mycirc.cpy,mycirc.rad);    
    var myball = new ball (x,y,a);
    draw_circ(myball.x_pos,myball.y_pos,10);
    myball.line_eq(myball.x_pos,myball.y_pos,myball.angle);   
    var CP = calc(mycirc.cpx,mycirc.cpy,myball.g,myball.i,mycirc.rad,myball.x_pos,myball.y_pos,'c'); //coordinates of point on circle    
    if(typeof CP === 'undefined'){
    CP = [0,0]; // if ball tradjectory will miss the circumference of the circle
    }   
    var CL = calc(mycirc.cpx,mycirc.cpy,CP[0],CP[1],'e'); // equation of line, using coord's and centre of circle
    var PL = calc(CP[0],CP[1],CL[0],'p'); // line which is perpendicular to above line 
    // draw_line(0,PL[1],500,500*PL[0]+PL[1]);    
    var para_i = myball.y_pos - CL[0]*myball.x_pos; //parallel is line which creates a triangle between the perpendicular line, the ball tradjectory line, and this line which is parallel to the line disecting the centre of the circle
    var PV = [CL[0],para_i];    
    var p_x = (PL[1]-PV[1])/(CL[0]-PL[0]); // point at which the parallel line and the perpendicular line meet ^^
    var p_y = p_x*CL[0] + PV[1]; // see above    
    var len_adj = Sqrt(Pow(p_x-CP[0],2)+Pow(p_y-CP[1],2)); // length of adjacent
    var len_opp = Sqrt(Pow(p_x-myball.x_pos,2)+Pow(p_y-myball.y_pos,2)); // length of opposite    
    var refl_angle = atan(len_opp/len_adj);  // reflection angle
    var refl_grad;    
    var DG = calc(myball.x_pos,myball.y_pos,mycirc.cpx,mycirc.cpy,'e'); //direct line from center point to ball
  
    if(myball.g>0){ // positive gradient
        if(myball.g<DG[0]){
            refl_grad = tan(myball.angle + (90-refl_angle)*2);
        }
        else if(myball.g>DG[0]){
            refl_grad = tan(myball.angle - (90-refl_angle)*2);
        }
    }
    else if(myball.g<0){ // negative gradient
        if(myball.g<DG[0]){
            refl_grad = tan(myball.angle + (90-refl_angle)*2);
        }
        else if(myball.g>DG[0]){
            refl_grad = tan(myball.angle - (90-refl_angle)*2);
        }
    } // gradient of reflected line
    
    if(myball.g<0 && DG[0]>0){
        refl_grad = tan(myball.angle - (90-refl_angle)*2);
    }
    else if(myball.g>0 && DG[0]<0){
        refl_grad = tan(myball.angle + (90-refl_angle)*2);
    }             
    var refl_i = CP[1] - CP[0]*refl_grad; // y intercept of reflected line   
    var RL = [refl_grad,refl_i,refl_angle];   
    draw_line(0,RL[1],500,RL[1]+500*RL[0]);
    return [CP,RL[0]];

};

var com = function(bx,by,ba,cx,CP,RG){
  
  var g = tan(ba);
  if(CP[0] > bx){
    bx+=1;
    by+=1*g;
  }
  else if(CP[0] < bx){
    bx-=1;
    by+=1*g;
  }
  if(bx === CP[0] && by === CP[1]){
    // reflect using RG refl grad
  }
  
  var a = test(bx,by,ba,cx);
  return[bx,by,ba];  
};
  


var vars = [0,250,315];
var cx = 250;
var v = test(vars[0],vars[1],vars[2],cx);


$(document).ready(function(){
  setInterval(function(){vars = com(vars[0],vars[1],vars[2],cx,v[0],v[1]);},10);
  $('#canvas').mousemove(function(event){
    cx = event.pageX-(screen.width-500)/2;
    v = test(vars[0],vars[1],vars[2],cx);
  });      
});
}
