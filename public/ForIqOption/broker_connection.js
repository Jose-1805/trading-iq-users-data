/**
 * Genera una cadena formateada para envíar una operación al broker
 * @return {[type]}      [description]
 */
function getDataSendOption(data){
	if(
		'option_'+data.option_type in actives[data.active_id]
		&& actives[data.active_id]['option_'+data.option_type]
	){
    	return '{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":'+getBalanceId()+',"active_id":'+data.active_id+',"option_type_id":'+(data.option_type == 'turbo'?3:1)+',"direction":"'+data.direction+'","expired":'+data.expiration.toString().substr(0,10)+',"refund_value":0,"price":'+current_amount+',"value":0,"profit_percent":'+ (100-actives[data.active_id]['option_'+data.option_type].profit.commission)+'}}}';
	}else{
		console.log('option_'+data.option_type+' NO ENCONTRADO', actives[data.active_id]);
		return '';
	}
}

function getDataSendOptionDemo(data){
	if(
		'option_'+data.option_type in actives[data.active_id]
		&& actives[data.active_id]['option_'+data.option_type]
	){
    	return '{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":'+getBalanceId(true)+',"active_id":'+data.active_id+',"option_type_id":'+(data.option_type == 'turbo'?3:1)+',"direction":"'+data.direction+'","expired":'+data.expiration.toString().substr(0,10)+',"refund_value":0,"price":'+current_amount+',"value":0,"profit_percent":'+ (100-actives[data.active_id]['option_'+data.option_type].profit.commission)+'}}}';
	}else{
		console.log('option_'+data.option_type+' NO ENCONTRADO', actives[data.active_id]);
		return '';
	}
}

/**
 * Envía una operación de acuerdo a la configuración y los datos enviados
 */
function sendOperation(data, copy_from = '') {
	if(
		//El activo está configurado
		data.active_id in active_settings
		&& (
			(copy_from == 'trademood' && active_settings[data.active_id].trademood_copy_in_trsoft)
			|| (copy_from == 'strategy' && active_settings[data.active_id].strategy_copy_in_trsoft)
			|| (copy_from == 'selection' && active_settings[data.active_id].selection_copy_in_trsoft)
		)
	){
		chrome.runtime.sendMessage('nnfiiefoeiedkdlaeppojmmcbblipldd', {
	        data:{
	            name:'start_option',
	            params:{
	                active:data.active_id,
	                expiration:data.expiration,
	                direction:data.direction
	            }
	        }
	    });
	}

    wsSend(getDataSendOption(data));

    play_audio_entry?playAudio('new_entry'):false;

    if(print_log/* data.active_id == active_selected*/){
        console.log('\nOPERACIÓN ENVIADA\n'
            +'\nActive: '+data.active_id
            +'\nExpiration: '+new Date(data.expiration).getMinutes()
            +'\nDirection: '+(data.direction == 'call'?'SUBE':'BAJA')
            //+'\nLevel: '+current_asset_level
            +'\nUser: '+data.user_id
            +'\nAmount: $'+data.amount_enrolled                        
            +'\n');
    }
}

/**
 * Envía una operación en demo de acuerdo a la configuración y los datos enviados
 */
function sendOperationDemo(data) {

    wsSend(getDataSendOptionDemo(data));

}

/**
 * Identifica cual es el id del balance que se debe enviar
 * @return {[type]} [description]
 */
function getBalanceId(demo = false){
    for(i = 0; i < user_data.balances.length; i++){
        if((practice_account || demo) && user_data.balances[i].type == 4)return user_data.balances[i].id;
        else if(!practice_account && user_data.balances[i].type == 1)return user_data.balances[i].id;
    }
}

function requestSyncDataBroker(){
    wsSend('{"msg":"","name":"api_option_init_all"}');
}

function setUserBroker(callback){
    return fetch("https://iqoption.com/api/register/getregdata", {
        method: 'GET'
    }).then(function (res){
        //Usuario ya inició sesion en el broker
        if(res.status == 200){
            res.json().then((data) => {
                user_data = data.result.profile;
            })
        }
    });
}

function wsSend(data){
    if(verifyConnection()){
        //Se obtiene el identificador del wensocket
        let id_ws = JSON.stringify(GLEngineModule.JSWebSockets).split('"')[1];
        //Se envía la operación copiada
        GLEngineModule.JSWebSockets[id_ws].send(data);
    }
}

/**
 * Almacena y/o actualiza la información de los activos
 */
function setDataActives(data){
	//actives = {};
	//Se recorren todos los activos turbo
	for(var i in data.result.turbo.actives){
	    //Si el activo esta habilitado
	    if(data.result.turbo.actives[i].enabled){
	    	if(!(data.result.turbo.actives[i].id in actives)){
	    		actives[data.result.turbo.actives[i].id] = {};	
	    	}

	        //Se agrega el activo
	        actives[data.result.turbo.actives[i].id].id = data.result.turbo.actives[i].id;
	        actives[data.result.turbo.actives[i].id].option_turbo = {
                profit:data.result.turbo.actives[i].option.profit
            };
	    }
	}

	//Se recorren todos los activos de binary
	for(var i in data.result.binary.actives){
	    //Si el activo esta habilitado
	    if(data.result.binary.actives[i].enabled){
	    	if(!(data.result.binary.actives[i].id in actives)){
	    		actives[data.result.binary.actives[i].id] = {};	
	    	}

	        actives[data.result.binary.actives[i].id].id = data.result.binary.actives[i].id;
	        actives[data.result.binary.actives[i].id].option_binary = {
                profit:data.result.binary.actives[i].option.profit
            }
	    }
	}
}

function verifyConnection(){
    if(!navigator.onLine){
        playAlertSound();
        return false;
    }else if(audio_play){
        stopAlertSound();
    }

    return true;
}

setUserBroker();