let alterInput = require('../index.js');

let config = [
	['Cube', 'C', 'Entry a cube length', function(code){
		let a = parseFloat(code);
		return a**3;
	}],
	['Square', 'S', 'Entry a square length', function(code){
		let a = parseFloat(code);
		return a**2;
	}],
	['cIrcle', 'I', 'Entry a circle diameter', function(code){
		let a = parseFloat(code);
		return (a/2)**2 * Math.PI;
	}],
	['eXit', 'x', 'exit']
];

let obj = alterInput(config);


async function testing(){
	var res, key = 'c';
	do{
		res = await obj.input('c');
		console.log(res);
	}while(res !== 'exit');
}

testing().catch((e)=>(console.log(e.stack)));