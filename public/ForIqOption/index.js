function candlesGenerated(data){
    if(pending_fetch > limit_pending_fetch && !only_evaluate_expiration){
        only_evaluate_expiration = true;
        counter_pause++;
    }

    //No existe en la interfaz de copy trading
    if(!(data.msg.active_id in copy_up)){
        copy_up[data.msg.active_id] = false;
        copy_down[data.msg.active_id] = false;
        //Se crea el select con todas las divisas actuales
        createUiElements();
    }

    //Ultimo valor antes de asignar el nuevo
    const previous_value = current_asset_levels[data.msg.active_id];
    current_asset_levels[data.msg.active_id] = data.name == 'candles-generated'?data.msg.value:data.msg.close;

    //Se convierte la fecha
    var time_date_at = data.msg.at.toString().substr(0,13);
    var date_at = new Date();
    date_at.setTime(time_date_at);

    //Identificador del nivel actual
    key = date_at.getHours()+'-'+date_at.getMinutes()+'-'+date_at.getSeconds();

    if(!(data.msg.active_id in history_levels))
        history_levels[data.msg.active_id] = [];

    //Se agrega el nivel actual al historial
    history_levels[data.msg.active_id][key] = current_asset_levels[data.msg.active_id];

    //Si hay operaciones pendientes para el activo
    if(data.msg.active_id in pending_operations){
        //Se recorren todos los niveles con operaciones pendientes
        for(level in pending_operations[data.msg.active_id]){
            //Se recorren todas las operaciones pendientes de un nivel
            for(user_id in pending_operations[data.msg.active_id][level]){
                let current_date = new Date();
                let operation = pending_operations[data.msg.active_id][level][user_id];

                //Falta más de 31 segundos para expirar
                if(operation.expiration - current_date.getTime() >= 31000){
                    //Si el precio actual es adecuado para copiar la operación
                    if(
                        (operation.direction == 'call' && level >= current_asset_levels[data.msg.active_id])
                        || (operation.direction == 'put' && level <= current_asset_levels[data.msg.active_id])
                    ){
                        if("copy_from" in operation){
                            //Se envia la operación en cuenta de práctica
                            sendOperation(operation, operation.copy_from);

                            print_log?console.log('OPERACIÓN RECUPERADA MEJOR NIVEL'):false;
                        }else{
                            sendOperationDemo(operation);
                        }
                        //Si la operacion ya no puede ser recuperada por tiempo, se elimina
                        delete pending_operations[data.msg.active_id][level][user_id]
                    }
                }else{
                    //Si la operacion ya no puede ser recuperada por tiempo, se elimina
                    delete pending_operations[data.msg.active_id][level][user_id]
                }   

            }
            //SI no hay registros de operaciones para el nivel, se elimina el item del nivel
            if(!Object.keys(pending_operations[data.msg.active_id][level]).length)
                delete pending_operations[data.msg.active_id][level];
        }

        //SI no hay registros de operaciones para el activo, se elimina el item del activo
        if(!Object.keys(pending_operations[data.msg.active_id]).length)
            delete pending_operations[data.msg.active_id];
    }

    //Al cerrar una vela se envian los datos al servidor 
    //para que evalue la las entradas que vencen en el segundo actual
    if(date_at.getSeconds() == 1 && last_second[data.msg.active_id] == 0){
        //Cada minuto se restanblece el trademood de los activos
        if(data.msg.active_id in trade_mood)
            trade_mood[data.msg.active_id] = {};
        //Las operaciones pendientes por trademood se eliminan cada minuto
        if(data.msg.active_id in pending_operations_trademood)
            delete pending_operations_trademood[data.msg.active_id];

        //Las operaciones pendientes esperando confirmación se eliminan cada minuri
        if(data.msg.active_id in pending_operations_confirmation)
            delete pending_operations_confirmation[data.msg.active_id];

        //Se resta un segundo para que quede igual a la fecha anterior
        date_at.setSeconds(date_at.getSeconds() - 1);
        date_at.setMilliseconds(0);
        amount_expiration_prev_sent++;
        url = host+'/evaluate-expiration/'+data.msg.active_id+'/'+previous_value+'/'+date_at.getTime().toString().substr(0,13)+'/'+((amount_expiration_prev_sent >= Object.keys(current_actives).length)?"1":"-1");

        let callback_evaluate_expiration = (response) => {}
        
        //Si es el ultmo par de divisa que se analiza en el minuto actual
        if(amount_expiration_prev_sent >= Object.keys(current_actives).length){
            current_actives = {};
            amount_expiration_prev_sent = 0;

            callback_evaluate_expiration = (response) => {
                if(pending_fetch <= 7 && only_evaluate_expiration && !force_only_evaluate_expiration){
                    only_evaluate_expiration = false;
                }

                if(date_at.getMinutes() % 2 == 0){
                    syncRankings();
                }
            }
        }

        //Se envñia el valor de cierre de la vela para evaluar resultados
        //de operaciones que cierra en el minuto actual
        fetch(url, {mode: 'no-cors'}).then(callback_evaluate_expiration);

        //Se deja la fecha como estaba
        date_at.setSeconds(date_at.getSeconds() + 1);

    }else if(date_at.getSeconds() % 5 == 0 && operations_data.binary.length && !only_evaluate_expiration){
        let url = host+'/store-operations-data/'+JSON.stringify(operations_data).replace(/\//g, "--slash--");
        operations_data = {binary:[]};
        pending_fetch++;
        fetch(url, {mode: 'no-cors'}).then((response) => {
            pending_fetch--;
            if(response.status == 404){
                console.warn('ERROR:', url);
                console.warn('OR:', response.url);
            }else if(response.status != 200){
                console.warn('OTHER RESPONSE:', response);
            }
        });
    //Se identifica de cuantas divisas se esperan datos para el cierre de minuto
    }else if(date_at.getSeconds() > 55 && date_at.getSeconds() < 59){
        current_actives[data.msg.active_id] = true;
    }

    last_second[data.msg.active_id] = date_at.getSeconds();
}

function syncRankings(){
    //Ranking generado de acuerdo al rendimiento alcanzado por los usuarios
    fetch('http://127.0.0.1:8000/ranking/performance/25').then((response) => {
        response.json().then((data) => {
            ranking_performance = data;
        })

        //Ranking generado de acuerdo al porcentaje de acierto de los usuario
        fetch('http://127.0.0.1:8000/ranking/percentage/25').then((response) => {
            response.json().then((data) => {
                ranking_percentage = data;
            })

            //Usuarios que han sido copiados y los resultados han sido buenos
            fetch('http://127.0.0.1:8000/ranking/best-users-copied').then((response) => {
                response.json().then((data) => {
                    best_users_copied = data;
                })

                //Usuarios que han buen porcentaje de acierto
                fetch('http://127.0.0.1:8000/ranking/best-users').then((response) => {
                    response.json().then((data) => {
                        best_users = data;
                    })
                })
            })
        })
    })
}

function liveBinaryOption(data){
    if(data.msg.option_type == 'turbo'){
        let not_is_duplicate = (
                //El usuario no tiene operaciones registradas
                !user_operations.hasOwnProperty(data.msg.user_id) 
                //El usuario no tiene operaciones registradas en el activo actual
                || !user_operations[data.msg.user_id].hasOwnProperty(data.msg.active_id) 
                //El usuario no tiene operaciones registradas en el activo actual con la expiración actual
                || !user_operations[data.msg.user_id][data.msg.active_id].hasOwnProperty(data.msg.expiration)
            );

        if(not_is_duplicate)
            setTrademoodData(data.msg);

        //Determina si el activo de la operación esta configurado para copias
        let active_must_be_copied = data.msg.active_id in actives_to_copy;

        //Se pausa el audio de inactividad si está activo
        if(audio_play_inactivity)
            stopAlertInactivity();

        last_option_at = new Date().getTime();
        
        if(
            current_asset_levels
            //El precio actual del activo esta registrado
            && data.msg.active_id in current_asset_levels 
            && actives
            //La información del activo eexiste
            && data.msg.active_id in actives 
            //No se está evaluando sólo la expiración
            && !only_evaluate_expiration
            //Falta más de 31 segundos para expirar
            && (data.msg.expiration - new Date().getTime()) >= 31000
            && not_is_duplicate
        ){
            //console.log(data.msg);
        
            let current_asset_level = current_asset_levels[data.msg.active_id];
            
            let user_data_ranking = {}
            let was_copied_performance = false;
            let was_copied_percentage = false;
            let was_copied_best_users_copied = false;
            let was_copied_best_users = false;
            let copy_source = '';

            if(copyFromPerformance(data.msg)){
                was_copied_performance = true;
                copy_source = "performance";
                user_data_ranking = ranking_performance[data.msg.user_id];
            }

            if(copyFromPercentage(data.msg)){
                was_copied_percentage = true;
                copy_source = "percentage";
                user_data_ranking = ranking_percentage[data.msg.user_id];
            }

            if(copyFromBestUsersCopied(data.msg)){
                was_copied_best_users_copied = true;
                copy_source = "best_users_copied";
                user_data_ranking = best_users_copied[data.msg.user_id];
            }

            if(copyFromBestUsers(data.msg)){
                was_copied_best_users = true;
                copy_source = "best_users";
                user_data_ranking = best_users[data.msg.user_id];
            }
            //Si se debe guardar como cópia para evaluación posterior
            //let must_be_saved_as_copy = mustBeSavedAsCopy(data.msg);
            let must_be_saved_as_copy = (was_copied_percentage || was_copied_performance || was_copied_best_users || was_copied_best_users_copied);
            //Si debe ser realmente copiada
            let must_be_copied = must_be_saved_as_copy?mustBeCopied(data.msg):false;

            //Fecha en que se abrió la operacion (según IqOption)
            let operation_date = new Date();
            operation_date.setTime(data.msg.created_at);

            //Key para averiguar si existe y cual es el precio donde se abrió la operación
            let key = operation_date.getHours()+'-'+operation_date.getMinutes()+'-'+operation_date.getSeconds();

            //En esta variable se establece el nivel donde se abrió la operación
            //Si no se logra identificar el nivel se utiliza el nivel actual
            let level_open = key in history_levels[data.msg.active_id]?history_levels[data.msg.active_id][key]:current_asset_level;

            //Determina si el nivel actual de la divisa está a favor
            //de la operación actual
            let level_in_favor = (
                        (data.msg.direction == 'call' && level_open >= current_asset_level)
                        || (data.msg.direction == 'put' && level_open <= current_asset_level)
                    );

            let current_date = new Date();
            current_date.setMilliseconds(0);

            let milliseconds_to_close = data.msg.expiration - new Date().getTime();
            let data_trade_mood = getDataTrademood(data.msg.active_id, data.msg.expiration);

            //Determina si la operación fue almacenada en las operaciones pendientes
            let save_in_pending_level = false;

            if(
                //El activo está configurado
                data.msg.active_id in active_settings
                && (
                    //El activo esta configurado para copiar desde cualquier segundo
                    !active_settings[data.msg.active_id].copy_only_good_seconds[copy_source] 
                    //Faltan los segundos adecuados para que la operación expire
                    || (
                        milliseconds_to_close >= 62000 
                        && milliseconds_to_close <= 200000
                    )
                )
            ){

                //Si el activo actual está habilitado para hacer copias
                //y tiene configuradas las copias por trademood
                if(active_must_be_copied && active_settings[data.msg.active_id].copy_for_trademood){
                    //Si la operacion puede aplicar como confirmación
                    //para una operación pendiente de confirmación
                    applyToConfirmationTrademoodOperation(current_date, data.msg, current_asset_level, data_trade_mood, copy_source, level_open);
                    //SI la operación puede aplicar para recuperación de
                    //una operación pendiente por trademood
                    applyToRecoverTrademoodOperation(current_date, data.msg, current_asset_level, data_trade_mood, copy_source, level_open);
                }

                //Si probablemente la operación deba ser copiada
                if(must_be_copied && active_must_be_copied){

                    print_log?console.log('NUEVA POSIBLE OPERACIÓN ('+data.msg.active_id+'): '+copy_source+' --> '+current_date.getHours()+':'+current_date.getMinutes()+':'+current_date.getSeconds()+' --> '+new Date(data.msg.expiration).getMinutes()):false;
                
                    //Si están activas las copias de acuerdo a la estrategia para el activo actual
                    if(active_settings[data.msg.active_id].copy_for_strategy){
                        //Nivel actual está a favor de la operación actual
                        if(level_in_favor){
                            sendOperation(data.msg, 'strategy');
                        }else{//Si el nivel actual está en contra la operación queda pendiente
                            data.msg.copy_from = 'strategy';
                            addPendingOperationsLevel(data.msg, level_open)
                            save_in_pending_level = true;
                        }
                    }
                    
                    //Si están activas las copias de acuerdo a la selección del usuario para el activo actual
                    if(active_settings[data.msg.active_id].copy_for_selection){
                        if(
                            //Nivel actual está a favor de la operación actual
                            level_in_favor
                            && (
                                //Si es una copia al alza y están habiltadas la copias al alza para el activo
                                (data.msg.direction == 'call' && copy_up[data.msg.active_id])
                                //Si es una copia a la baja y están habiltadas la copias a la baja para el activo
                                || (data.msg.direction != 'call' && copy_down[data.msg.active_id])
                            )
                        ){
                            sendOperation(data.msg, 'selection');
                        }
                    }

                    //Si están activas las copias de acuerdo al trademood para el activo actual
                    if(active_settings[data.msg.active_id].copy_for_trademood){

                        //El trademood actual es conveniente para copiar una operación
                        let good_trademood = goodTrademood(data.msg.active_id, data.msg.expiration, data.msg.direction, data_trade_mood, copy_source);

                        //Nivel actual está a favor de la operación actual
                        //Y el trademood es adecuado para copiar
                        if(level_in_favor && good_trademood.copy){
                            sendOperation(data.msg, 'trademood');
                            print_log?console.log(data_trade_mood):false;
                        }else{
                            //Si hay un buen trademood, significa que el nivel
                            //actual está en contra de la operación y el trademood es bueno.
                            //Por tanto,la operación queda pendiente y si el nivel se pone a favor,
                            //la operación se copia
                            if(good_trademood.copy){
                                data.msg.copy_from = 'trademood';
                                addPendingOperationsLevel(data.msg, level_open)
                                save_in_pending_level = true;

                            //Si la operación queda pendiente pro confirmación
                            }else if(good_trademood.pending_for_confirmation){
                                data.msg.copy_from = 'trademood';
                                addPendingOperationsConfirmation(data.msg, level_open, current_date)
                                print_log?console.log(data_trade_mood):false;
                            //Si la operación queda pendiente por trademood inadecuado
                            }else if(good_trademood.pending_for_trademood){
                                data.msg.copy_from = 'trademood';
                                addPendingOperationsTrademood(data.msg, level_open, current_date)
                                print_log?console.log(data_trade_mood):false;
                            }

                        }
                    }
                }
            }

            //La operación debe ser guardada como copia
            //Y el precio está a favor se envía en demo, de lo contrario
            //se almacena en las operaciones pendientes
            if(must_be_saved_as_copy){
                if(level_in_favor){
                    sendOperationDemo(data.msg);
                }else{
                    //Si la operación no se agrego a la lista de pendientes
                    if(!save_in_pending_level){
                        delete data.msg.copy_from;
                        addPendingOperationsLevel(data.msg, level_open, false);
                    }
                }
            }
            
            let operation = {};
            operation['active_id'] = data.msg.active_id;
            operation['amount_enrolled'] = data.msg.amount_enrolled;
            operation['direction'] = data.msg.direction;
            operation['option_type'] = data.msg.option_type;
            operation['created_at'] = current_date.getTime();
            operation['expiration'] = data.msg.expiration;
            operation['option_id'] = data.msg.option_id;
            operation['user_id'] = data.msg.user_id;
            operation['name'] = data.msg.name;
            operation['country_id'] = data.msg.country_id;
            operation['operations_up'] = data_trade_mood.up;
            operation['operations_down'] = data_trade_mood.down;
            operation['amount_up'] = data_trade_mood.up_amount;
            operation['amount_down'] = data_trade_mood.down_amount;
            //Nivel en que se abrió la operación o nivel actual de activo si no se identifica cuando se abrió
            operation['level_open'] = level_open;
            operation['was_copied'] = must_be_saved_as_copy?1:-1;
            //Si la operación fue debe ser guardada como copia se agregan más datos
            if(must_be_saved_as_copy){
                operation['sent'] = must_be_copied?1:-1;
                operation['profit'] = (100-actives[data.msg.active_id]['option_'+data.msg.option_type].profit.commission);
                operation['use_for_martingale'] = -1;
                operation['was_copied_percentage'] = was_copied_percentage?1:-1;
                operation['was_copied_performance'] = was_copied_performance?1:-1;
                operation['was_copied_best_users_copied'] = was_copied_best_users_copied?1:-1;
                operation['was_copied_best_users'] = was_copied_best_users?1:-1;
                operation['pos'] = user_data_ranking.pos?user_data_ranking.pos:-1;
                operation['avg'] = user_data_ranking.avg?user_data_ranking.avg:-1;
                operation['performance'] = user_data_ranking.performance?user_data_ranking.performance:-1;
                operation['ranking_operations'] = user_data_ranking.ranking_operations?user_data_ranking.ranking_operations:-1;
                operation['hit_percentage'] = user_data_ranking.hit_percentage?user_data_ranking.hit_percentage:-1;
            }
            
            operations_data.binary.push(operation);

            //Con más de N operaciones almacenadas se envía a guardar
            if(operations_data.binary.length > limit_sent_operations){
                let url = host+'/store-operations-data/'+JSON.stringify(operations_data).replace(/\//g, "--slash--");
                operations_data = {binary:[]};
                pending_fetch++;
                fetch(url, {mode: 'no-cors'}).then((response) => {
                    pending_fetch--;
                    if(response.status == 404){
                        console.warn('ERROR:', url);
                        console.warn('OR:', response.url);
                    }else if(response.status != 200){
                        console.warn('OTHER RESPONSE:', response);
                    }
                });
            }

            //La operación se almacena para que no se vuelva a copiar si es del mismo usuario
            if(!user_operations.hasOwnProperty(data.msg.user_id)){
                user_operations[data.msg.user_id] = {};
            }

            if(!user_operations[data.msg.user_id].hasOwnProperty(data.msg.active_id)){
                user_operations[data.msg.user_id][data.msg.active_id] = {};
            }

            user_operations[data.msg.user_id][data.msg.active_id][data.msg.expiration] = true;
        }
    }
}

function addPendingOperationsLevel(operation, level_open, print_msg = true){
    if(!(operation.active_id in pending_operations))
        pending_operations[operation.active_id] = [];

    if(!(level_open in pending_operations[operation.active_id]))
        pending_operations[operation.active_id][level_open] = [];

    //Se agrega la operación actual a la lista de operaciones pendientes
    //SI el precio vuelve al lugar donde se abrió la operación se ejecutará si aún se puede
    pending_operations[operation.active_id][level_open][operation.user_id] = operation;
    
    if(print_log && print_msg/*operation.active_id == active_selected*/){
        console.warn('\Operación pendiente (Nivel actual en contra)\n'
            +'\nActive: '+operation.active_id
            +'\nExpiration: '+new Date(operation.expiration).getMinutes()
            +'\nDirection: '+(operation.direction == 'call'?'SUBE':'BAJA')
            +'\nLevel: '+level_open
            +'\nUser: '+operation.user_id
            +'\nAmount: $'+operation.amount_enrolled
            +'\n');
    }
}

function addPendingOperationsTrademood(operation, level_open, current_date){
    if(!(operation.active_id in pending_operations_trademood))
        pending_operations_trademood[operation.active_id] = [];

    if(!(current_date.getMinutes() in pending_operations_trademood[operation.active_id]))
        pending_operations_trademood[operation.active_id][current_date.getMinutes()] = [];

    operation.level = level_open;
    pending_operations_trademood[operation.active_id][current_date.getMinutes()][operation.expiration] = operation;
    
    if(print_log /*operation.active_id == active_selected*/){
        console.warn('\Operación pendiente (trademood inadecuado)\n'
            +'\nActive: '+operation.active_id
            +'\nExpiration: '+new Date(operation.expiration).getMinutes()
            +'\nDirection: '+(operation.direction == 'call'?'SUBE':'BAJA')
            +'\nLevel: '+level_open
            +'\nUser: '+operation.user_id
            +'\nAmount: $'+operation.amount_enrolled
            +'\n');
    }
}

function addPendingOperationsConfirmation(operation, level_open, current_date){
    if(!(operation.active_id in pending_operations_confirmation))
        pending_operations_confirmation[operation.active_id] = [];

    if(!(current_date.getMinutes() in pending_operations_confirmation[operation.active_id]))
        pending_operations_confirmation[operation.active_id][current_date.getMinutes()] = [];

    operation.level = level_open;
    pending_operations_confirmation[operation.active_id][current_date.getMinutes()][operation.expiration] = operation;
    
    if(print_log /*operation.active_id == active_selected*/){
        console.warn('\Operación pendiente (Esperando confirmción)\n'
            +'\nActive: '+operation.active_id
            +'\nExpiration: '+new Date(operation.expiration).getMinutes()
            +'\nDirection: '+(operation.direction == 'call'?'SUBE':'BAJA')
            +'\nLevel: '+level_open
            +'\nUser: '+operation.user_id
            +'\nAmount: $'+operation.amount_enrolled
            +'\n');
    }
}

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;

    var data = {};
    try{
        data = JSON.parse(str);
    }catch(error){
        //console.error('ERROR JSON.parse', error)
    }

    try{
        let url = '';
        if(data.name){
            switch (data.name) {
                case 'candle-generated':
                case 'candles-generated':
                    candlesGenerated(data);
                    break;

                //Opciones binarias en vivo
                case 'live-deal-binary-option-placed':
                    liveBinaryOption(data);
                    break;
                
                case 'api_option_init_all_result':
                    if(data.msg.isSuccessful){
                        setDataActives(data.msg)
                    }
                    break;
                
                case 'profile':
                    user_data = data.msg;
                    break;
                
                case 'socket-option-opened':
                    //Al abrir una operación se envía a evaluar si hay datos relacionados con la operación
                    //para actualizar el id de la operación en el broker
                    setTimeout(() => {
                        url = host+'/evaluate-option-opened/'+data.msg.active_id+'/'+data.msg.expired+'000/'+(data.msg.dir == 'call'?1:-1)+'/'+data.msg.id;
                        fetch(url, {mode: 'no-cors'});
                    }, 6000);
                    break;
                
                case 'socket-option-closed':
                    //Al cerrar una operación se envía a evaluar si hay datos relacionados con la operación
                    //para actualizar el resultado
                    setTimeout(() => {
                        url = host+'/evaluate-option-closed/'+data.msg.id+'/'+(data.msg.win == 'loose'?-1:(data.msg.win == 'win'?1:0));
                        fetch(url, {mode: 'no-cors'});
                    }, 6000);

                    break;
                
                case 'option-rejected':
                    console.warn(data.msg);
                    break;
                
                case 'option':
                    //Si la operación no logra enviarse
                    break;
                default:
                    // statements_def
                    break;
            }
        }
    }catch(error){
        if(print_errors)
            console.error('ERROR en la ejecución', error)
    }

    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        }
    }
    outU8Array[outIdx] = 0;
    return outIdx - startIdx
}

function stopCopies(active_stop = null, strategy_stop = null){
    for(active_id in active_settings){
        //Si llegó un activo
        if(active_stop){
            if(active_stop == active_id){
                //Si llegó una estrategia determinada
                if(strategy_stop){
                    active_settings[active_id][strategy] = false;       
                }else{
                    active_settings[active_id].copy_from_ranking_performance = false;
                    active_settings[active_id].copy_from_ranking_percentage = false;
                    active_settings[active_id].copy_from_best_users = false;
                    active_settings[active_id].copy_from_best_users_copied = false;
                }
            }
        }else{
            //Si llegó una estrategia determinada
            if(strategy_stop){
                active_settings[active_id][strategy] = false;       
            }else{
                active_settings[active_id].copy_from_ranking_performance = false;
                active_settings[active_id].copy_from_ranking_percentage = false;
                active_settings[active_id].copy_from_best_users = false;
                active_settings[active_id].copy_from_best_users_copied = false;
            }
        }
    }
}


setInterval(() => {

    let current_date = new Date();

    requestSyncDataBroker();
    cleanValues();
    //Si hace más de 40 segundos no se reciben datos se inicia alerta
    if(current_date.getTime() - last_option_at > 40000){
        playAlertInactivity();   
    }

    //Cada dos minutos se solicita borrar operaciones que han expirado
    if(current_date.getMinutes()%2 == 0 && current_date.getSeconds() >= 20 && current_date.getSeconds() < 30){
        deleteExpiredOperations();    
    }

}, 10000);

//google-chrome  --user-data-dir=/tmp --disable-web-security --disable-extensions-http-throttling

/*
    script_vars = document.createElement("script");
    script_vars.src = "http://127.0.0.1:8000/ForIqOption/vars.js";
    document.getElementsByTagName("body")[0].append(script_vars);

    day_for_settings = 4;
    folder_name = "/best_users";



    script_active_1 = document.createElement("script");
    script_active_1.src = "http://127.0.0.1:8000/ForIqOption"+folder_name+"/active_settings_day_"+day_for_settings+"/active_1_settings.js";
    document.getElementsByTagName("body")[0].append(script_active_1);
    
    script_active_5 = document.createElement("script");
    script_active_5.src = "http://127.0.0.1:8000/ForIqOption"+folder_name+"/active_settings_day_"+day_for_settings+"/active_5_settings.js";
    document.getElementsByTagName("body")[0].append(script_active_5);
    
    script_active_99 = document.createElement("script");
    script_active_99.src = "http://127.0.0.1:8000/ForIqOption"+folder_name+"/active_settings_day_"+day_for_settings+"/active_99_settings.js";
    document.getElementsByTagName("body")[0].append(script_active_99);
    
    script_active_947 = document.createElement("script");
    script_active_947.src = "http://127.0.0.1:8000/ForIqOption"+folder_name+"/active_settings_day_"+day_for_settings+"/active_947_settings.js";
    document.getElementsByTagName("body")[0].append(script_active_947);



    script_settings = document.createElement("script");
    script_settings.src = "http://127.0.0.1:8000/ForIqOption/settings.js";
    document.getElementsByTagName("body")[0].append(script_settings);

    script_audio = document.createElement("script");
    script_audio.src = "http://127.0.0.1:8000/ForIqOption/audio.js";
    document.getElementsByTagName("body")[0].append(script_audio);

    script_validations = document.createElement("script");
    script_validations.src = "http://127.0.0.1:8000/ForIqOption/validations.js";
    document.getElementsByTagName("body")[0].append(script_validations);

    script_broker_connection = document.createElement("script");
    script_broker_connection.src = "http://127.0.0.1:8000/ForIqOption/broker_connection.js";
    document.getElementsByTagName("body")[0].append(script_broker_connection);

    script_trademood = document.createElement("script");
    script_trademood.src = "http://127.0.0.1:8000/ForIqOption/trademood.js";
    document.getElementsByTagName("body")[0].append(script_trademood);
    
    script_selection = document.createElement("script");
    script_selection.src = "http://127.0.0.1:8000/ForIqOption/selection.js";
    document.getElementsByTagName("body")[0].append(script_selection);

    script_index = document.createElement("script");
    script_index.src = "http://127.0.0.1:8000/ForIqOption/index.js";
    document.getElementsByTagName("body")[0].append(script_index);
*/

/*

    
1 => EUR/USD

2 => EUR/GBP

3 => GBP/JPY

4 => EUR/JPY

5 => GBP/USD

6 => USD/JPY

7 => AUD/CAD

8 => NZD/USD

31 => Amazon

32 => Apple

33 => Baidu

35 => Facebook

36 => Google

37 => Intel

38 => Microsoft

45 => CitiGroup

46 => Coca Cola

50 => Goldman Sachs

51 => JP Morgan Chase

52 => McDonald's

53 => Morgan Stanley

54 => Nike

72 => USD/CHF

76 => EUR/USD (OTC)

77 => EUR/GBP (OTC)

78 => USD/CHF (OTC)

80 => NZD/USD (OTC)

81 => GBP/USD (OTC)

86 => AUD/CAD (OTC)

87 => Alibaba

95 => Yandex

99 => AUD/USD

100 => USD/CAD

101 => AUD/JPY

102 => GBP/CAD

103 => GBP/CHF

104 => GBP/AUD

105 => EUR/CAD

107 => CAD/CHF

108 => EUR/AUD

113 => Twitter Inc

167 => Tesla

168 => USD/NOK

212 => EUR/NZD

943 => AUD/CHF

944 => AUD/NZD

946 => EUR/CHF

947 => GBP/NZD

 */

