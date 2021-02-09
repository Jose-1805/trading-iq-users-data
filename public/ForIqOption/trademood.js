//Se actualizan los datos de trademood con la operación
//que se recibe como parametro
function setTrademoodData(data) {
	//Si no hay datos de trademood para la divisa
	if(!(data.active_id in trade_mood))
	    trade_mood[data.active_id] = {};

	//Si no hay datos de trademood para la expiración
	if(!(data.expiration in trade_mood[data.active_id])){
	    trade_mood[data.active_id][data.expiration] = {
	        call:{
	            operations:0,
	            amount:0
	        },
	        put:{
	            operations:0,
	            amount:0
	        }
	    };
	}

	trade_mood[data.active_id][data.expiration][data.direction]['operations']++;
	trade_mood[data.active_id][data.expiration][data.direction]['amount'] += data.amount_enrolled;

	showTradeMood();
}

/**
 * Calcula y retorna los datos de trademood de un activo y una expiración determinada
 * @param  {[type]} active_id [Identificador del activo]
 * @param  {[type]} expiration [Time de la expiración]
 */
function getDataTrademood(active_id, expiration){
	let up = trade_mood[active_id][expiration]['call']['operations'];
	let down = trade_mood[active_id][expiration]['put']['operations'];

	let up_amount = trade_mood[active_id][expiration]['call']['amount'];
	let down_amount = trade_mood[active_id][expiration]['put']['amount'];

	return {
		operations : up + down,
		amount : up_amount + down_amount,

		up,
		down,

		up_amount,
		down_amount,

		up_percentage : parseInt((up * 100)/(up + down)),
		down_percentage : parseInt((down * 100)/(up + down)),
	
		up_percentage_amount : parseInt((up_amount * 100)/(up_amount + down_amount)),
		down_percentage_amount : parseInt((down_amount * 100)/(up_amount + down_amount)),

		min_operations_second : parseInt(new Date().getSeconds()) * 0.5,
	}
}

/**
 * Determina si el trademood de un activo 
 * en una dirección y expiración determinada es bueno o no
 * @param  {[type]} active_id  [Identificador del activo]
 * @param  {[type]} expiration [Time de la expiración]
 * @param  {[type]} direction  [Dirección a evaluar]
 */
function goodTrademood(active_id, expiration, direction, data_trade_mood, copy_source, is_confirmation = false){
	//Si el activo está configurado
	if(active_id in active_settings){
		//Se define la configuración de trademood a utilizar		
		let trademood_settings = active_settings[active_id].use_general_settings[copy_source]?active_settings[active_id].trademood_settings_general:active_settings[active_id].trademood_settings;

		//Determina si la comisión actual es válida 
		//de acuerdo a la configuración de la divisa
	    let commission_is_valid = actives[active_id]['option_turbo'].profit.commission >= trademood_settings.min_commission_broker
		        && actives[active_id]['option_turbo'].profit.commission <= trademood_settings.max_commission_broker;

		//Full percentage es válido cuando está desactivado 
		//o cuando los porcentajes de la operación son igual a 100%
		let full_percentages_is_valid = !active_settings[active_id].copy_trademood_full_percentages[copy_source]?true:(
				(
					direction == 'put'
					&& data_trade_mood.down_percentage == 100
		        	&& data_trade_mood.down_percentage_amount == 100
		        ) || (
					direction == 'call'
					&& data_trade_mood.up_percentage == 100
					&& data_trade_mood.up_percentage_amount == 100
		        )
			);

		let copy = (
				commission_is_valid
		        //Cantidad de operaciones válida
		        && data_trade_mood.operations >= trademood_settings.min_operations
		        && data_trade_mood.operations <= trademood_settings.max_operations
		        && (
		        	//Operacion al alza
		            (
		            	direction == 'call' 
		            	//Porcentages correctos
		            	&& data_trade_mood.up_percentage >= trademood_settings.min_percentage_operations 
		            	&& data_trade_mood.up_percentage_amount >= trademood_settings.min_percentage_amount
		            )
		            //Operación a la baja
		            || (
		            	direction == 'put' 
		            	//Porcentages correctos
		            	&& data_trade_mood.down_percentage >= trademood_settings.min_percentage_operations 
		            	&& data_trade_mood.down_percentage_amount >= trademood_settings.min_percentage_amount
		            )
		        )
		        && full_percentages_is_valid
		    );

		return {
			copy : (
				copy
		        //No necesita confirmación con más operaciones
		        //o se está consultando con una operación de confirmación
		        && (
		        	!active_settings[active_id].copy_trademood_confirmation_operations[copy_source]
		        	|| is_confirmation
		        )
		    ),

			pending_for_confirmation : (
				copy
		        //Necesita confirmación con más operaciones
		        && active_settings[active_id].copy_trademood_confirmation_operations[copy_source]
		        //La operación  actual no es una confirmación
		        && !is_confirmation
		    ),

	    	pending_for_trademood : (
	    		commission_is_valid
		        //Cantidad de operaciones válida para almacenar como operación pendiente
		        && data_trade_mood.operations >= trademood_settings.min_operations_pending
		        && data_trade_mood.operations <= trademood_settings.max_operations
		        //Porcentajes válidos para almacenar como operación pendiente
		        && (
		            (direction == 'call' && data_trade_mood.up_percentage >= trademood_settings.min_percentage_operations_pending && data_trade_mood.up_percentage_amount >= trademood_settings.min_percentage_amount_pending)
		            || (direction == 'put' && data_trade_mood.down_percentage >= trademood_settings.min_percentage_operations_pending && data_trade_mood.down_percentage_amount >= trademood_settings.min_percentage_amount_pending)
		        )
		        && full_percentages_is_valid
		    )
	    };
	}

	return {};
}

/**
 * Determina si la operación recibida como parámetro se 
 * puede tomar como la recuperación de una operación anterior
 * que debió ser copiada pero no se pudo por trademood inadecuado
 */
function applyToRecoverTrademoodOperation(current_date, operation, current_asset_level, data_trade_mood, copy_source, level_open){
	if(
		//El activo está configurado
		operation.active_id in active_settings
		&& (
			//Hay oeraciones pendientes por trademood en el mismo activo
			operation.active_id in pending_operations_trademood
			//Hay oeraciones pendientes por trademood en el mismo activo y minuto
	        && current_date.getMinutes() in pending_operations_trademood[operation.active_id]
			//Hay oeraciones pendientes por trademood en el mismo activo, minuto y expiración
	        && operation.expiration in pending_operations_trademood[operation.active_id][current_date.getMinutes()]
	        //La operación recibida tiene la misma dirección de la operación pendiente
	        && pending_operations_trademood[operation.active_id][current_date.getMinutes()][operation.expiration].direction == operation.direction
        )
	){
		//Nivel original de la operación pendiente
		level_operation = pending_operations_trademood[operation.active_id][current_date.getMinutes()][operation.expiration].level;

		if(
			//Si el precio actual es igual o mejor al de la operación pendiente			
            (operation.direction == 'call' && current_asset_level <= level_operation && level_open <= level_operation)
            || (operation.direction == 'put' && current_asset_level >= level_operation && level_open >= level_operation)
		){
			let good_trademood = goodTrademood(operation.active_id, operation.expiration, operation.direction, data_trade_mood, copy_source)

			//La operación ya puede ser copiada
			//porque el trademood es adecuado
			if(good_trademood.copy){
				sendOperation(operation, 'trademood');
				print_log?console.log('RECUPERADA CON MEJOR TRADEMOOD'):false;
				print_log?console.log(data_trade_mood):false;

				delete pending_operations_trademood[operation.active_id][current_date.getMinutes()][operation.expiration];

			//Si la operación mejoró en trademood 
			//pero necesita confirmación de operaciones
			}else if(good_trademood.pending_for_confirmation){
				delete pending_operations_trademood[operation.active_id][current_date.getMinutes()][operation.expiration];

				operation.copy_from = 'trademood';
				addPendingOperationsConfirmation(operation, level_operation, current_date)
				print_log?console.log(data_trade_mood):false;
			}
		}
	}
}

/**
 * Determina si la operación recibida como parámetro se 
 * puede tomar como la confirmación de una operación anterior
 * que debió ser copiada pero no se pudo porque necesita confirmar con más operaciones
 */
function applyToConfirmationTrademoodOperation(current_date, operation, current_asset_level, data_trade_mood, copy_source, level_open){
	if(
		//El activo está configurado
		operation.active_id in active_settings
		&& (
			//Hay oeraciones pendientes por trademood en el mismo activo
			operation.active_id in pending_operations_confirmation
			//Hay oeraciones pendientes por trademood en el mismo activo y minuto
	        && current_date.getMinutes() in pending_operations_confirmation[operation.active_id]
			//Hay oeraciones pendientes por trademood en el mismo activo, minuto y expiración
	        && operation.expiration in pending_operations_confirmation[operation.active_id][current_date.getMinutes()]
	        //La operación recibida tiene la misma dirección de la operación pendiente
	        && pending_operations_confirmation[operation.active_id][current_date.getMinutes()][operation.expiration].direction == operation.direction
        )
	){
		//Nivel original de la operación pendiente
		level_operation = pending_operations_confirmation[operation.active_id][current_date.getMinutes()][operation.expiration].level;

		if(
			//Si el precio actual es igual o mejor al de la operación pendiente			
            (operation.direction == 'call' && current_asset_level <= level_operation && level_open <= level_operation)
            || (operation.direction == 'put' && current_asset_level >= level_operation && level_open >= level_operation)
		){
			let good_trademood = goodTrademood(operation.active_id, operation.expiration, operation.direction, data_trade_mood, copy_source, true);

			//La operación ya puede ser copiada
			//porque el trademood es adecuado
			if(good_trademood.copy){
				sendOperation(operation, 'trademood');
				print_log?console.log('RECUPERADA CON CONFIRMACIÓN'):false;
				print_log?console.log(data_trade_mood):false;

				delete pending_operations_confirmation[operation.active_id][current_date.getMinutes()][operation.expiration];
			}
		}
	}
}