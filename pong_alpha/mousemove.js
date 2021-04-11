$(document).ready(function(){
	$('#canvas').mousemove(function(event){
		var x = event.pageX;
		var y = event.pageY;
		test(x,y,100);
	})
});