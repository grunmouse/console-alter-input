const {input} = require('@rakov-node/console-read');

function *convertConfig(config){
	for(let item of config){
		let {label, accelerator} = item;
		yield [label.toLowerCase(), item];
		yield [accelerator.toLowerCase(), item];
	}
}

/**
 * @typedef {Array[4]|Array[3]|Array[2]} configitem
 * @params [label, accelerator, prompt, func]
 * @param {String} [0] - Метка в списке альтернатив
 * @param {String} [1] - Акслератор - принятая аббревиатура, которую можно ввести
 * @param {String} [2] - Приглашение ко вводу, показывающаяся перед списком альтернатив
 * @param {Function|any} [3] - Функция, которая будет вызвана, или значение, которое будет возвращено 
 * @params [label, accelerator, func]
 * @param {String} [0] - Метка в списке альтернатив, и она же - приглашение
 * @param {String} [1] - Акслератор - принятая аббревиатура, которую можно ввести
 * @param {Function|any} [2] - Функция, которая будет вызвана, или значение, которое будет возвращено 
 * @params [label, accelerator]
 * @param {String} [0] - Метка в списке альтернатив, и она же - приглашение
 * @param {String} [1] - Акслератор - принятая аббревиатура, которую можно ввести, и он же - возвращаемое значение
 */

/**
 *
 */
function alternativeInput(config){
	let items = config.map(([label, accelerator, prompt, func])=>{
		if(!func){
			if(prompt){
				return {label, accelerator, prompt:label, func:prompt};
			}
			else{
				return {label, accelerator, prompt:label, func:accelerator};
			}
		}
		return {label, accelerator, prompt, func}
	});
	let mapping = new Map(convertConfig(items));
	//console.log(mapping.keys());
	return {
		/**
		 * Включает состояние, соответствующее переданному ключу (метка или акселератор)
		 * Если состояние не содержит функции обработки, оно считается завершающим, возвращается значение func
		 * Выводит приглашение ко вводу и ждёт ввода строки,
		 * Если введён новый ключ - меняет состояние и перезапускается.
		 * Если введено значение - вызывает с ним функцию обработки и возвращает её возврат
		 */
		input:async function(key, handler){
			while(key){
				//console.log('key ' +key);
				this.last = key;
				
				let item = mapping.get(key.toLowerCase());
				
				//Если нет функции - просто вернуть значение
				if(!(item.func instanceof Function)){
					return item.func;
				}
				
				let prompt = item.prompt +'(' + items.filter((a)=>(a!==item)).map((a)=>(a.label)).join('|') + ')>';
				
				let entry = await input(prompt);
				
				if(mapping.has(entry.toLowerCase())){
					//Если введён ключ - сменить режим и повторить
					key = entry;
				}
				else{
					try{
						return await item.func(entry);
					}
					catch(e){
						if(item.handler){
							item.handler(e);
						}
						else if(handler){
							if(handler typeof Function){
								handler(e);
							}
							else{
								console.log('Error in function');
								console.log(e.stack);
							}
						}
						else{
							throw e;
						}
					}
				}
			}
		}
	}
}

module.exports = alternativeInput;