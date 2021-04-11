if(myball.g>0){ // positive gradient
	if(myball.g<DG){
		refl_grad = tan(myball.a - (90-relf_angle)*2);
	}
	else if(myball.g>DG){
		refl_grad = tan(myball.a + (90-relf_angle)*2);
	}
}
else if(myball.g<0){ // negative gradient
	if(myball.g<DG){
		refl_grad = tan(myball.a + (90-relf_angle)*2);
	}
	else if(myball.g>DG){
		refl_grad = tan(myball.a - (90-relf_angle)*2);
	}
}