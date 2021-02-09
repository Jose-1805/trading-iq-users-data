let btn_copy_up = null;
let btn_copy_down = null;
let select_active = null;
let trade_mood_text = null;

const active_names = {
	1:"EUR/USD",
	2:"EUR/GBP",
	3:"GBP/JPY",
	4:"EUR/JPY",
	5:"GBP/USD",
	6:"USD/JPY",
	7:"AUD/CAD",
	8:"NZD/USD",
	72:"USD/CHF",
	76:"EUR/USD (OTC)",
	77:"EUR/GBP (OTC)",
	78:"USD/CHF (OTC)",
	80:"NZD/USD (OTC)",
	81:"GBP/USD (OTC)",
	86:"AUD/CAD (OTC)",
	99:"AUD/USD",
	100:"USD/CAD",
	101:"AUD/JPY",
	102:"GBP/CAD",
	103:"GBP/CHF",
	104:"GBP/AUD",
	105:"EUR/CAD",
	107:"CAD/CHF",
	108:"EUR/AUD",
	168:"USD/NOK",
	212:"EUR/NZD",
	943:"AUD/CHF",
	944:"AUD/NZD",
	946:"EUR/CHF",
	947:"GBP/NZD",
}

function createUiElements() {
	old_div_parent = document.getElementById('ui_copy_trading');
	if(old_div_parent)
		old_div_parent.parentNode.removeChild(old_div_parent);

	let div_parent = document.createElement('DIV');
	div_parent.id = 'ui_copy_trading';
	div_parent.style.backgroundColor = '#fff';
	div_parent.style.position = 'fixed';
	div_parent.style.minHeight = '35px';
	div_parent.style.minWidth = '100px';
	div_parent.style.width = 'auto';
	div_parent.style.left = '0px';
	div_parent.style.bottom = '0px';
	div_parent.style.padding = '5px 10px';


	document.getElementsByTagName('body')[0].append(div_parent);
	createButtons();
	createSelectActive();
	createTradeMode();
	updateUI();
}

/**
 * Crea botones para configurar el estado de entradas al alza o a la baja
 */
function createButtons() {
	let div_parent = document.getElementById('ui_copy_trading');

	if(div_parent){
		//Botón para hacer copias al alza
		btn_copy_up = document.createElement('BUTTON');
		btn_copy_up.style.backgroundColor = '#ededed';
		btn_copy_up.style.color = 'green';
		btn_copy_up.style.maxHeight = '35px';
		btn_copy_up.style.width = 'auto';
		btn_copy_up.style.lineHeight = '0';
		btn_copy_up.innerHTML = 'COPIAR AL ALZA';
		btn_copy_up.onclick = () => {
			//Si se ha seleccionado un activo
			if(active_selected){
				//Se invierte el estado de copia al alza para el activo seleccionado
				copy_up[active_selected] = !copy_up[active_selected];
				updateUI();
			}else{
				alert('Seleccione un activo');
			}
		}
		div_parent.append(btn_copy_up);

		//Botón para hacer copias a la baja
		btn_copy_down = document.createElement('BUTTON');
		btn_copy_down.style.backgroundColor = '#ededed';
		btn_copy_down.style.color = 'red';
		btn_copy_down.style.maxHeight = '35px';
		btn_copy_down.style.width = 'auto';
		btn_copy_down.style.lineHeight = '0';
		btn_copy_down.innerHTML = 'COPIAR A LA BAJA';
		btn_copy_down.onclick = () => {
			//Si se ha seleccionado un activo
			if(active_selected){
				//Se invierte el estado de copia a la baja para el activo seleccionado
				copy_down[active_selected] = !copy_down[active_selected];
				updateUI();
			}else{
				alert('Seleccione un activo');
			}
		}
		div_parent.append(btn_copy_down);
	}
}

/**
 * Crea el selector de activo
 */
function createSelectActive() {
	let div_parent = document.getElementById('ui_copy_trading');

	if(div_parent){
		select_active = document.createElement('select');
		select_active.onchange = (e) => {
			active_selected = eval(e.target.value);
			updateUI();
			showTradeMood();
		}
		div_parent.append(select_active);

		var opt = document.createElement("option"); 
        opt.setAttribute("value", null); 
        var nod = document.createTextNode('Sel. Activo'); 
        opt.appendChild(nod); 
        select_active.appendChild(opt); 

		for(active_id in copy_up){
			opt = document.createElement("option"); 
            opt.setAttribute("value", active_id); 
            
            if(active_id == active_selected)
            	opt.setAttribute('selected', true);

            nod = document.createTextNode(active_names[active_id]); 
            opt.appendChild(nod); 
            select_active.appendChild(opt); 
		}
	}
}

/**
 * Crea el estado de animo del comercio
 */
function createTradeMode() {
	let div_parent = document.getElementById('ui_copy_trading');

	if(div_parent){
		trade_mood_text = document.createElement('p');
		trade_mood_text.style.display = 'block';
		trade_mood_text.style.fontSize = 'medium';
		trade_mood_text.style.marginTop = '5px';
		trade_mood_text.style.marginBottom = '1px';
		div_parent.append(trade_mood_text);
	}
}

/**
 * Actualiza la interfaz grafica de acuerdo a la configuración del activo seleccionado
 * @return {[type]} [description]
 */
function updateUI(){
	if(active_selected){
		if(copy_up[active_selected]){
			btn_copy_up.style.backgroundColor = 'green';
			btn_copy_up.style.color = '#ededed';
		}else{
			btn_copy_up.style.backgroundColor = '#ededed';
			btn_copy_up.style.color = 'green';
		}

		if(copy_down[active_selected]){
			btn_copy_down.style.backgroundColor = 'red';
			btn_copy_down.style.color = '#ededed';
		}else{
			btn_copy_down.style.backgroundColor = '#ededed';
			btn_copy_down.style.color = 'red';
		}

	}else{
		btn_copy_up.style.backgroundColor = '#ededed';
		btn_copy_up.style.color = 'green';
		btn_copy_down.style.backgroundColor = '#ededed';
		btn_copy_down.style.color = 'red';
	}
}


function showTradeMood(){
	
	trade_mood_text.innerHTML = '';
	
	if(active_selected && active_selected in trade_mood && active_selected in active_settings){
		trademood_settings_data = active_settings[active_selected].trademood_settings;

		let times = Object.keys(trade_mood[active_selected]);
		times.sort(function(a, b) {
			return a - b;
		});

		for(e = 0; e < times.length; e++){
			let date_ = new Date();
			let time = times[e];
			date_.setTime(time);
			let up = trade_mood[active_selected][time]['call']['operations'];
			let down = trade_mood[active_selected][time]['put']['operations'];

			let up_amount = trade_mood[active_selected][time]['call']['amount'];
			let down_amount = trade_mood[active_selected][time]['put']['amount'];

			let up_percentage = parseInt((up * 100)/(up + down));
			let down_percentage = parseInt((down * 100)/(up + down));

			let up_percentage_amount = parseInt((up_amount * 100)/(up_amount + down_amount));
			let down_percentage_amount = parseInt((down_amount * 100)/(up_amount + down_amount));

			trade_mood_text.innerHTML += 'M.'+date_.getMinutes()+' ';

			span_data = document.createElement('span');
			span_data.style.display = 'inline';
			span_data.style.fontSize = 'medium';
			span_data.style.color = 'black';

			if(up_percentage >= trademood_settings_data.min_percentage_operations[active_selected] && up_percentage_amount >= trademood_settings_data.min_percentage_amount && (up + down) >= trademood_settings_data.min_operations){
				span_data.style.backgroundColor = 'green';
				span_data.style.color = 'white';
			}else if(down_percentage >= trademood_settings_data.min_percentage_operations[active_selected] && down_percentage_amount >= trademood_settings_data.min_percentage_amount && (up + down) >= trademood_settings_data.min_operations){
				span_data.style.backgroundColor = 'red';
				span_data.style.color = 'white';
			}

			percentage_call = goodTrademood(active_id, time, "call", getDataTrademood(active_selected, time), "percentage", true).copy;
			performance_call = goodTrademood(active_id, time, "call", getDataTrademood(active_selected, time), "performance", true).copy;
			best_users_call = goodTrademood(active_id, time, "call", getDataTrademood(active_selected, time), "best_users", true).copy;
			best_users_copied_call = goodTrademood(active_id, time, "call", getDataTrademood(active_selected, time), "best_users_copied", true).copy;

			percentage_put = goodTrademood(active_id, time, "put", getDataTrademood(active_selected, time), "percentage", true).copy;
			performance_put = goodTrademood(active_id, time, "put", getDataTrademood(active_selected, time), "performance", true).copy;
			best_users_put = goodTrademood(active_id, time, "put", getDataTrademood(active_selected, time), "best_users", true).copy;
			best_users_copied_put = goodTrademood(active_id, time, "put", getDataTrademood(active_selected, time), "best_users_copied", true).copy;

			if(
				percentage_call
				|| performance_call
				|| best_users_call
				|| best_users_copied_call
			){
				span_data.style.backgroundColor = 'green';
				span_data.style.color = 'white';
			}else if(
				percentage_put
				|| performance_put
				|| best_users_put
				|| best_users_copied_put
			){
				span_data.style.backgroundColor = 'red';
				span_data.style.color = 'white';
			}

			let html_span_up = '<span style="font-size:medium; display:inline;'
			+'color:'+((up_amount > down_amount)?'white':'black')+';'
			+'background-color:'+((up_amount > down_amount)?'blue':'transparent')+';'
			+'font-weight:'+((up_amount > down_amount)?'bold':'normal')+';'
			+'">S</span>';

			let html_span_down = '<span style="font-size:medium; display:inline;'
			+'color:'+((up_amount < down_amount)?'white':'black')+';'
			+'background-color:'+((up_amount < down_amount)?'blue':'transparent')+';'
			+'font-weight:'+((up_amount < down_amount)?'bold':'normal')+';'
			+'">B</span>';

			span_data.innerHTML = '('+html_span_up+' '+ up_percentage +'%'+' - '+html_span_down+' '+ down_percentage +'%) '+(up+down)+' ** '

			trade_mood_text.append(span_data);

			//string_print += 'M.'+date_.getMinutes()+' (S '+ parseInt((up * 100)/(up + down)) +'%'+' - B '+ parseInt((down * 100)/(up + down)) +'%) '+(up+down)+' ** ';
		}
	}
}

createUiElements();