x = 1;
y = 250;
a = 1;

setInterval(function(){
	test(x, y, a);
	switch(stage){
		case 1: 
			a+=10;
			break;
		case 3:
			x+=10;
			break;
		case 5:
			y+=10;
			break;
		default:
			break;
	}
	switch(a){
		case 360:
			stage = 2;
		case 0:
			stage = 3;
			a = 150;
	}
	switch(x){
		case 500:
			stage = 4;
		case 0:
			stage = 5;
			x = 1;
	}
	switch(y){
		case 500:
			stage = 6;
		case 0:
			stage = 1;
			y = 250;
			a = 0;
	}

},100);