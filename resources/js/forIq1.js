const host = 'http://127.0.0.1:8000';
//Almacena el historial de precios de los ultimos 15 segundos de cada divisa
let history_levels = [];
//Valor actual de cada par de divisas
let current_asset_levels = {};
//Operaciones almacenadas en memoria antes de ser enviadas al servidor
let operations_data = {binary:[]};
//Almacena las operaciones que no se pudieron enviar porque el precio
//cuando se recibió la operacion no era el mismo de la operación original
//Si el precio vuelve a ser el de la operación original se hace la operación si aún hay tiempo de hacerla
let pending_operations = [];
//Almacena las operaciones de trademood que no se puieron envíar pero aún pueden enviarse
//Si las condiciones actuales cambian
let pending_operations_trademood = [];

//Ranking de usuarios ordenado por porcentaje de acierto
let ranking_percentage = {};
//Rankin de usuarios ordenado por rendimiento
let ranking_performance = {};
//Almacena la lista de los mejores usuarios que han sido copiados
let best_users_copied = {};
//Almacena la lista de los mejores usuarios del sistema
let best_users = {};

//Ejecutar en cuenta de práctica o real
let practice_account = true;
//Valor de inversión
let current_amount = 1;
//Información de los activos disponibles para el usuario
let actives = null;
//Activos que están abiertos o de los que se recibe información
//en el minuto actual
let current_actives = {};
//Cuenta los pares de divisas de los que se han enviado datos de cierre
//de vela en el último minuto
let amount_expiration_sent = 0;
//Cuenta los pares de divisas de los que se han iniciado el envio  de datos
//de cierre de vela en el último minuto
let amount_expiration_prev_sent = 0;

//Almacena información de las operaciones de cada usuario (activos y expiraciones)
let user_operations = {};
//Informción del usuario traida desde el broker
let user_data = null;
//Ultimo segundo desde el que se recibieron datos
let last_second = {};
//Determina si sólo se deben enviar datos de cierre de vela
//para evaluar las operaciones que cierran en cada minuto
let only_evaluate_expiration = false;
let force_only_evaluate_expiration = false;
//Limite de operaciones que se almacenan antes de ser enviadas al servidor
let limit_sent_operations = 20;

let audio_play = false;
let audio_play_inactivity = false;

//Determina si se deben imprimir en la consola los errores
//generadis durante la ejecución del código
let print_errors = false;

//Ultima vez que se recibió una alerta (time)
let last_option_at = 0;
//Peticiones pendientes de respuesta desde el servidor
let pending_fetch = 0;
let limit_pending_fetch = 20;

//Determina si se está testeando el código
//si es así no se envián datos ni operaciones reales
let run_test = false;

//Estado de animo del comercio en el mínuto actual
let trade_mood = {};
//Estado de animo mínimo para hacer una entrada (porcentage de dinero ingresado)
let trade_mood_min_percentage_amount = 60;
//Estado de animo mínimo para hacer una entrada (porcentage de opraciones)
let trade_mood_min_percentage_operations = 60;
//Cantidad de operaciones mínimas para copiar una operacion
let trade_mood_min_operations = 20;
//Comisión mínima que debe tener el broker para copiar una entrada
let trade_mood_min_commission_broker = 7;

let actives_to_copy = {
    1 : true,
    4 : true,
    99 : true,
}

/**
 * Configuración para determinar que entradas copiar
 */
let copy_from_ranking_performance = false;//Sólo usuarios que estén en el ranking de rendimiento
let copy_from_ranking_percentage = false;//Sólo usuarios que estén en el rankng de porcentaje de acierto
let copy_from_best_users_copied = false;//Sólo usuarios que estén dentró de los mejores usuarios copiados
let copy_from_best_users = true;//Sólo usuarios que estén dentró de los mejores usuarios del sistema

//Determina si las operaciones deben ser copiadas a los usuarios TrSoft
let copy_in_trsoft = false;
//Determina si se deben hacer copias de operaciones donde el trademood calculado
//es el indicado y aparece una operación de copia en el mismo sentido
let copy_for_trademood = false;

const current_day = 3;

//Strategy from percentage
let hours_for_day_percentage = {
    7 : {
        0 : true,
    },
    1 : {
        0 : true,
        10 : true,
    },
    2 : {
    },
    3 : {
        9 : true,
    },
    4 : {
        10 : true,
    }
};

//Strategy from performance
let hours_for_day_performance = {
    7 : {
        23 : true,
        0 : true,
        2 : true,
    },
    1 : {
        0 : true,
        1 : true,
        2 : true,
        5 : true,
        7 : true,
        10 : true,
    },
    2 : {
        11 : true,                
    },
    3 : {
        23 : true,                
        7 : true,                
    },
    4 : {
        4 : true,
        12 : true,
    }
};

//Strategy from best users
let hours_for_day_best_users = {
    7 : {
        23 : true,
        0 : true,
        1 : true,
        2 : true,
        3 : true,
        4 : true,
        5 : true,
        6 : true,
        7 : true,
        8 : true,
        9 : true,
        10 : true,
        11 : true,
        12 : true,
        13 : true,
        14 : true,
    },
    1 : {
        23 : true,
        0 : true,
        1 : true,
        2 : true,
        3 : true,
        4 : true,
        5 : true,
        6 : true,
        7 : true,
        8 : true,
        9 : true,
        10 : true,
        11 : true,
        12 : true,
        13 : true,
        14 : true,
    },
    2 : { 
        23 : true,
        0 : true,
        1 : true,
        2 : true,
        3 : true,
        4 : true,
        5 : true,
        6 : true,
        7 : true,
        8 : true,
        9 : true,
        10 : true,
        11 : true,
        12 : true,
        13 : true,
        14 : true,
    },
    3 : {
        23 : true,
        0 : true,
        1 : true,
        2 : true,
        3 : true,
        4 : true,
        5 : true,
        6 : true,
        7 : true,
        8 : true,
        9 : true,
        10 : true,
        11 : true,
        12 : true,
        13 : true,
        14 : true,
    },
    4 : {
        23 : true,
        0 : true,
        1 : true,
        2 : true,
        3 : true,
        4 : true,
        5 : true,
        6 : true,
        7 : true,
        8 : true,
        9 : true,
        10 : true,
        11 : true,
        12 : true,
        13 : true,
        14 : true,
    }
};

//Strategy from best users copies
let hours_for_day_best_users_copied = {
    7 : {
        0 : true,
        3 : true,
        13 : true,
    },
    1 : {
        23 : true,
        3 : true,
        9 : true,
        13 : true,
    },
    2 : {
        10 : true,
        12 : true,
    },
    3 : {
        8 : true,
        13 : true,
    },
    4 : {
    }
};

/**
 * Determina si una operación debe ser copiada de acuerdo
 * al ranking de porcentaje
 */
function copyFromPercentage(data, only_save = true) {
    let hour = new Date().getHours();
    return (
        ranking_percentage[data.user_id] 
        && ranking_percentage[data.user_id].avg <= data.amount_enrolled
        && (
            only_save
            || (
                !only_save
                //La hora es indicada para copiar operaciones desde porcentage
                && hours_for_day_percentage[current_day] 
                && hours_for_day_percentage[current_day][hour]
            )
        )

        /*
            AGREGAR AQUÍ MÁS CONDICIONES
         */
        
        //Domingo - Lunes
        //&& ranking_percentage[data.user_id].hit_percentage <= 90
        //&& data.amount_enrolled <= 50
        //&& ranking_percentage[data.user_id].performance >= 30
        
        //Lunes - Martes
        //&& ranking_percentage[data.user_id].hit_percentage <= 93
        //&& data.amount_enrolled <= 50
        //&& ranking_percentage[data.user_id].performance >= 50
        
        //Martes - Miercoles
        //&& ranking_percentage[data.user_id].hit_percentage <= 93
        //&& data.amount_enrolled <= 20
        //&& ranking_percentage[data.user_id].performance >= 30
        
        //Miercoles - Jueves
        //&& ranking_percentage[data.user_id].avg * 2.5 <= data.amount_enrolled
        //&& ranking_percentage[data.user_id].performance >= 90
        
        //Jueves - Viernes
        //&& ranking_percentage[data.user_id].avg * 3 <= data.amount_enrolled
        //&& ranking_percentage[data.user_id].hit_percentage >= 90
        //&& ranking_percentage[data.user_id].performance >= 30       
    );
}

/**
 * Determina si una operación debe ser copiada de acuerdo
 * al ranking de rendimiento
 */
function copyFromPerformance(data, only_save = true) {
    let hour = new Date().getHours();
    return (
        ranking_performance[data.user_id] 
        && ranking_performance[data.user_id].avg <= data.amount_enrolled
        && (
            only_save
            || (
                !only_save
                //La hora es indicada para copiar operaciones desde rendimiento
                && hours_for_day_performance[current_day] 
                && hours_for_day_performance[current_day][hour]
            )
        )
        /*
            AGREGAR AQUÍ MÁS CONDICIONES
         */
    );
}

/**
 * Determina si una operación debe ser copiada de acuerdo
 * a la lista de mejores usuarios
 */
function copyFromBestUsers(data, only_save = true) {
    let hour = new Date().getHours();
    return (
        best_users[data.user_id]
        && (
            only_save
            || (
                !only_save
                //La hora es indicada para copiar operaciones desde mejores usuarios
                && hours_for_day_best_users[current_day] 
                && hours_for_day_best_users[current_day][hour]
            )
        )
        /*
            AGREGAR AQUÍ MÁS CONDICIONES
         */
    );
}

/**
 * Determina si una operación debe ser copiada de acuerdo
 * a la lista de mejores usuarios copiados
 */
function copyFromBestUsersCopied(data, only_save = true) {
    let hour = new Date().getHours();
    return (
        best_users_copied[data.user_id]
        && best_users_copied[data.user_id].min_amount <= data.amount_enrolled
        && (
            only_save
            || (
                !only_save
                //La hora es indicada para copiar operaciones desde mejores usuarios copiados
                && hours_for_day_best_users_copied[current_day] 
                && hours_for_day_best_users_copied[current_day][hour]
            )
        )
        /*
            AGREGAR AQUÍ MÁS CONDICIONES
         */
    );
}

/**
 * Determina si la operación de un usuario debe ser copiada
 * @return {[type]} [description]
 */
function mustBeCopied (data) {
    if(!user_data)
        return false;

    /*return (
        && !copyFromPercentage(data)
        && !copyFromPerformance(data)
        && (copyFromBestUsers(data) || copyFromBestUsersCopied(data))
    );*/

    return (
        (copy_from_ranking_percentage && copyFromPercentage(data, false))
        || (copy_from_ranking_performance && copyFromPerformance(data, false))
        || (copy_from_best_users && copyFromBestUsers(data, false))
        || (copy_from_best_users_copied && copyFromBestUsersCopied(data, false))
    );
}

/**
 * Determina si la operación de un usuario debe ser almacenada como copia
 * en el sistema para evaluar mejores usuarios
 * @return {[type]} [description]
 */
function mustBeSavedAsCopy (data) {
    //Si el usuario está en cualquier ranking o lista y 
    //el valor de la entrada es mayor o igual  al promedio
    return (
        (ranking_performance[data.user_id] && ranking_performance[data.user_id].avg <= data.amount_enrolled)
        || (ranking_percentage[data.user_id] && ranking_percentage[data.user_id].avg <= data.amount_enrolled)
        || (best_users_copied[data.user_id] && best_users_copied[data.user_id].min_amount <= data.amount_enrolled)
        || best_users[data.user_id]
    )
}

/**
 * Genera una cadena formateada para envíar una operación al broker
 * @return {[type]}      [description]
 */
function getDataSendOption(data, is_copy){
    return '{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":'+getBalanceId(is_copy)+',"active_id":'+data.active_id+',"option_type_id":'+(data.option_type == 'turbo'?3:1)+',"direction":"'+data.direction+'","expired":'+data.expiration.toString().substr(0,10)+',"refund_value":0,"price":'+current_amount+',"value":0,"profit_percent":'+ (100-actives[data.active_id]['option_'+data.option_type].profit.commission)+'}}}';
}


/**
 * Envía una operación de acuerdo a la configuración y los datos enviados
 */
function sendOperation(data, is_copy) {
    wsSend(getDataSendOption(data, is_copy));
}

/**
 * Identifica cual es el id del balance que se debe enviar
 * @return {[type]} [description]
 */
function getBalanceId(is_copy){
    for(i = 0; i < user_data.balances.length; i++){
        if((practice_account || is_copy) && user_data.balances[i].type == 4)return user_data.balances[i].id;
        else if(!practice_account && user_data.balances[i].type == 1)return user_data.balances[i].id;
    }
}

function candlesGenerated(data){
    if(pending_fetch > limit_pending_fetch)
        only_evaluate_expiration = true;

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
                if(operation.expiration - current_date.getTime() >= 31500){
                    //Si el precio actual es adecuado para copiar la operación
                    if(
                        (operation.direction == 'call' && level >= current_asset_levels[data.msg.active_id])
                        || (operation.direction == 'put' && level <= current_asset_levels[data.msg.active_id])
                    ){
                        //Se envia la operación en cuenta de práctica
                        sendOperation(operation, true);

                        let text_start = operation.must_be_copied?'⚝⚝⚝⚝⚝':'------';
                        
                        //Si cumple parametros para ser copia filtrada
                        if(operation.must_be_copied && !run_test){
                            //Si debe ser copiada a los usuarios de TrSoft
                            if(copy_in_trsoft){
                                try {
                                    console.log('5 ENVIANDO A TRSOFT ...');
                                    //Se copia la extensión en los clientes
                                    chrome.runtime.sendMessage('nnfiiefoeiedkdlaeppojmmcbblipldd', {
                                        data:{
                                            name:'start_option',
                                            params:{
                                                active:operation.active_id,
                                                expiration:operation.expiration,
                                                direction:operation.direction
                                            }
                                        }
                                    });
                                } catch(e) {
                                    // statements
                                    console.log('5 ERROR ENVIANDO', e);
                                }
                            }

                            //Si se debe copiar en la cuenta real
                            if(!practice_account)
                                sendOperation(operation);
                        }
                        
                        if(operation.must_be_copied && operation.good_trademood){
                            console.log('Debe ser copiada por trademood (RECUPERADA POR NIVEL)');
                        }

                        if(
                            !run_test
                            && (
                                //Copia por trade mood
                                (
                                    copy_for_trademood
                                    && operation.must_be_copied
                                    && operation.good_trademood
                                )
                                ||
                                //Manejo de botones de entrada
                                (
                                    //Si es una copia al alza y están habiltadas la copias al alza para el activo
                                    (operation.direction == 'call' && copy_up[operation.active_id])
                                    //Si es una copia a la baja y están habiltadas la copias a la baja para el activo
                                    || (operation.direction != 'call' && copy_down[operation.active_id])
                                )
                            )
                        ){
                            try {
                                console.log('1 ENVIANDO A TRSOFT ...');
                                //Se copia la extensión en los clientes
                                chrome.runtime.sendMessage('nnfiiefoeiedkdlaeppojmmcbblipldd', {
                                    data:{
                                        name:'start_option',
                                        params:{
                                            active:operation.active_id,
                                            expiration:operation.expiration,
                                            direction:operation.direction
                                        }
                                    }
                                });
                            } catch(e) {
                                console.log('1 ERROR ENVIANDO', e);
                            }
                            //playAudioForEntry(operation);
                            playAudio('new_entry');
                            copy_up[operation.active_id] = false;
                            copy_down[operation.active_id] = false;
                            createUiElements();
                        }

                        if(operation.active_id == active_selected){
                            console.log('\nRECUPERADA '+text_start+'\n'
                                +'\nActive: '+operation.active_id
                                +'\nExpiration: '+new Date(operation.expiration).getMinutes()
                                +'\nDirection: '+(operation.direction == 'call'?'SUBE':'BAJA')
                                +'\nLevel: '+level
                                +'\nUser: '+user_id
                                +'\nAmount: $'+operation.amount_enrolled
                                +'\n');
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
        if(data.msg.active_id in trade_mood)
            trade_mood[data.msg.active_id] = {};
        
        if(data.msg.active_id in pending_operations_trademood)
            delete pending_operations_trademood[data.msg.active_id];

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
        if(!run_test){
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
    //Se identifica de cuantas divisas se esperan datos para el cierre de minuto
    }else if(date_at.getSeconds() > 55 && date_at.getSeconds() < 59){
        current_actives[data.msg.active_id] = true;
    }

    last_second[data.msg.active_id] = date_at.getSeconds();
}

function liveBinaryOption(data){
    if(data.msg.option_type == 'turbo'){
        //Si no hay adtos de trade mood para la divisa
        if(!(data.msg.active_id in trade_mood))
            trade_mood[data.msg.active_id] = {};

        //Si no hay adtos de trade mood para la expiración
        if(!(data.msg.expiration in trade_mood[data.msg.active_id])){
            trade_mood[data.msg.active_id][data.msg.expiration] = {
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

        trade_mood[data.msg.active_id][data.msg.expiration][data.msg.direction]['operations']++;
        trade_mood[data.msg.active_id][data.msg.expiration][data.msg.direction]['amount'] += data.msg.amount_enrolled;

        showTradeMood();

        //Determina si el activo de la operación esta configurado para copias
        let active_must_be_copied = data.msg.active_id in actives_to_copy;

        //console.log(data.msg);
        last_option_at = new Date().getTime();
        //Se pausa el audio de inactividad si está activo
        if(audio_play_inactivity)
            stopAlertInactivity();

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
            && (
                //El usuario no tiene operaciones registradas
                !user_operations.hasOwnProperty(data.msg.user_id) 
                //El usuario no tiene operaciones registradas en el activo actual
                || !user_operations[data.msg.user_id].hasOwnProperty(data.msg.active_id) 
                //El usuario no tiene operaciones registradas en el activo actual con la expiración actual
                || !user_operations[data.msg.user_id][data.msg.active_id].hasOwnProperty(data.msg.expiration)
            )
        ){
            let current_asset_level = current_asset_levels[data.msg.active_id];
            //Si se debe guardar como cópia para evaluación posterior
            let must_be_saved_as_copy = mustBeSavedAsCopy(data.msg);
            //Si debe ser realmente copiada
            let must_be_copied = mustBeCopied(data.msg);


            //Fecha en que se abrió la operacion
            let operation_date = new Date();
            operation_date.setTime(data.msg.created_at);
            //Key para averiguar si existe y cual es el preció donde se abrió la operación
            key = operation_date.getHours()+'-'+operation_date.getMinutes()+'-'+operation_date.getSeconds();

            //En esta variable se establece el nivel donde se abrió la operación
            //Si no se logra identificar el nivel se utiliza el nivel actual
            level_open = -1;

            let current_date = new Date();
            current_date.setMilliseconds(0);

            if(must_be_copied && active_must_be_copied){
                console.log('Nueva posible operación '+current_date+' // '+new Date(data.msg.expiration));
            }

            let text_start = '';

            let up = trade_mood[data.msg.active_id][data.msg.expiration]['call']['operations'];
            let down = trade_mood[data.msg.active_id][data.msg.expiration]['put']['operations'];

            let up_amount = trade_mood[data.msg.active_id][data.msg.expiration]['call']['amount'];
            let down_amount = trade_mood[data.msg.active_id][data.msg.expiration]['put']['amount'];

            let up_percentage = parseInt((up * 100)/(up + down));
            let down_percentage = parseInt((down * 100)/(up + down));
            
            let up_percentage_amount = parseInt((up_amount * 100)/(up_amount + down_amount));
            let down_percentage_amount = parseInt((down_amount * 100)/(up_amount + down_amount));

            let trade_mood_min_operations_second = parseInt(current_date.getSeconds()) * 0.5;

            //Si se puede recuperar una operación
            //por trademood que se intentaron abrir en el mismo minuto
            if(
                copy_for_trademood
                && active_must_be_copied
                && data.msg.active_id in pending_operations_trademood
                && current_date.getMinutes() in pending_operations_trademood[data.msg.active_id]
                && data.msg.expiration in pending_operations_trademood[data.msg.active_id][current_date.getMinutes()]
                && pending_operations_trademood[data.msg.active_id][current_date.getMinutes()][data.msg.expiration].direction == data.msg.direction
            ){
                level_operation = pending_operations_trademood[data.msg.active_id][current_date.getMinutes()][data.msg.expiration].level;

                let current_good_trademood = (
                    actives[data.msg.active_id]['option_'+data.msg.option_type].profit.commission >= trade_mood_min_commission_broker
                    && (up + down) >= trade_mood_min_operations
                    //&& (up + down) >= trade_mood_min_operations_second
                    && (
                        (data.msg.direction == 'call' && up_percentage >= trade_mood_min_percentage_operations && up_percentage_amount >= trade_mood_min_percentage_amount && current_asset_levels[data.msg.active_id] <= level_operation)
                        || (data.msg.direction == 'put' && down_percentage >= trade_mood_min_percentage_operations && down_percentage_amount >= trade_mood_min_percentage_amount && current_asset_levels[data.msg.active_id] >= level_operation)
                    )
                );

                if(current_good_trademood){
                    console.log('Debe copiarse por trademood (RECUPERADA POR MEJOR TRADEMOOD)');
                }


                //Hay un buen trademood para recuperar una operación
                //que no se pudo enviar anteriormente
                if(current_good_trademood){
                    try {
                        console.log('2 ENVIANDO A TRSOFT ...');
                        //Se copia la extensión en los clientes
                        chrome.runtime.sendMessage('nnfiiefoeiedkdlaeppojmmcbblipldd', {
                            data:{
                                name:'start_option',
                                params:{
                                    active:data.msg.active_id,
                                    expiration:data.msg.expiration,
                                    direction:data.msg.direction
                                }
                            }
                        });
                    } catch(e) {
                        // statements
                        console.log('2 ERROR ENVIANDO', e);
                    }
                    //playAudioForEntry(data.msg);
                    playAudio('new_entry');
                    copy_up[data.msg.active_id] = false;
                    copy_down[data.msg.active_id] = false;
                    createUiElements();

                    delete pending_operations_trademood[data.msg.active_id][current_date.getMinutes()][data.msg.expiration];
                }
            }

            let good_trademood = (
                actives[data.msg.active_id]['option_'+data.msg.option_type].profit.commission >= trade_mood_min_commission_broker
                && must_be_copied
                && (up + down) >= trade_mood_min_operations
                //&& (up + down) >= trade_mood_min_operations_second
                && (
                    (data.msg.direction == 'call' && up_percentage >= trade_mood_min_percentage_operations && up_percentage_amount >= trade_mood_min_percentage_amount)
                    || (data.msg.direction == 'put' && down_percentage >= trade_mood_min_percentage_operations && down_percentage_amount >= trade_mood_min_percentage_amount)
                )
            );

            //Si ya se encuentra registrado el precio en que se abrió la operación
            if(key in history_levels[data.msg.active_id]){
                level_open = history_levels[data.msg.active_id][key];

                //Si precio actual no está a favor de la operación de acuerdo al precio de apertura
                //y la operación debe ser copiada en demo o real
                if(
                    active_must_be_copied
                    && (
                        (data.msg.direction == 'call' && level_open < current_asset_level)
                        || (data.msg.direction == 'put' && level_open > current_asset_level)
                    )
                    && (must_be_copied || must_be_saved_as_copy)
                ){
                    if(!(data.msg.active_id in pending_operations))
                        pending_operations[data.msg.active_id] = [];

                    if(!(level_open in pending_operations[data.msg.active_id]))
                        pending_operations[data.msg.active_id][level_open] = [];

                    data.msg.must_be_copied = must_be_copied;
                    data.msg.good_trademood = good_trademood;

                    if(good_trademood){
                        console.log('Pendiente (Precio actual en contra)');
                    }

                    text_start = must_be_copied?'⚝⚝⚝⚝⚝':'------';

                    //Se agrega la operación actual a la lista de operaciones pendientes
                    //SI el precio vuelve al lugar donde se abrió la operación se ejecutará la operación si aún se puede
                    pending_operations[data.msg.active_id][level_open][data.msg.user_id] = data.msg;
                    
                    if(data.msg.active_id == active_selected){
                        console.warn('\nPENDIENTE '+text_start+'\n'
                            +'\nActive: '+data.msg.active_id
                            +'\nExpiration: '+new Date(data.msg.expiration).getMinutes()
                            +'\nDirection: '+(data.msg.direction == 'call'?'SUBE':'BAJA')
                            +'\nLevel: '+level_open
                            +'\nUser: '+data.msg.user_id
                            +'\nAmount: $'+data.msg.amount_enrolled
                            +'\n');
                    }
                }else{
                    level_open = current_asset_level
                }
            }

            //Cuando trademood es malo pero la operación debe
            //ser copiada si las cosas cambián, se agrega a la lista de pendientes
            //si las cirsunstancias de trademood mejoran la operación se copia
            if(
                !good_trademood 
                && active_must_be_copied
                && must_be_copied
                && (
                    (data.msg.direction == 'call' && up_percentage >= 51)
                    || (data.msg.direction == 'put' && down_percentage >= 51)
                )
            ){
                if(!(data.msg.active_id in pending_operations_trademood))
                    pending_operations_trademood[data.msg.active_id] = [];

                if(!(current_date.getMinutes() in pending_operations_trademood[data.msg.active_id]))
                    pending_operations_trademood[data.msg.active_id][current_date.getMinutes()] = [];

                data.msg.level = level_open > 0?level_open:current_asset_level;
                pending_operations_trademood[data.msg.active_id][current_date.getMinutes()][data.msg.expiration] = data.msg;
                console.log('Pendiente (trademood inadecuado)');
            }

            //Si debe guardarse como copia
            if(must_be_saved_as_copy){

                //Se envía la operación para conocer el resultado
                //real de la copia (se envia si el nivel actual es igual nivel de apertura, este ultimo pudo ser actualizado si el valor actual era mejor al de apertura)
                if(level_open == current_asset_level){
                    sendOperation(data.msg, true);

                    text_start = must_be_copied?'⚝⚝⚝⚝⚝':'------';
                    if(data.msg.active_id == active_selected && active_must_be_copied){
                        console.log('\nENVIADA '+text_start+'\n'
                            +'\nActive: '+data.msg.active_id
                            +'\nExpiration: '+new Date(data.msg.expiration).getMinutes()
                            +'\nDirection: '+(data.msg.direction == 'call'?'SUBE':'BAJA')
                            +'\nLevel: '+current_asset_level
                            +'\nUser: '+data.msg.user_id
                            +'\nAmount: $'+data.msg.amount_enrolled                        
                            +'\n');
                    }

                    //Si la operación cumple los parametros para ser guardada como copia filtrada
                    if(must_be_copied && active_must_be_copied && !run_test){
                        //Si se debe copiar a ls cuentas de los usuarios TrSoft
                        if(copy_in_trsoft){
                            try {
                                console.log('3 ENVIANDO A TRSOFT ...');
                                //Se copia la extensión en los clientes
                                chrome.runtime.sendMessage('nnfiiefoeiedkdlaeppojmmcbblipldd', {
                                    data:{
                                        name:'start_option',
                                        params:{
                                            active:data.msg.active_id,
                                            expiration:data.msg.expiration,
                                            direction:data.msg.direction
                                        }
                                    }
                                });
                            } catch(e) {
                                // statements
                                console.log('3 ERROR ENVIANDO', e);
                            }
                        }

                        //Si se debe copiar en la cuenta real
                        if(!practice_account){
                            sendOperation(data.msg);
                            //playAudioForEntry(data.msg);
                        }
                    }

                    if(must_be_copied && active_must_be_copied && good_trademood){
                        console.log('Debe ser copiada por trademood');
                    }

                    if(
                        !run_test
                        && active_must_be_copied
                        && (
                            //Copia por trade mood
                            (
                                copy_for_trademood
                                && must_be_copied
                                && good_trademood
                            )
                            ||
                            //Manejo de botones de entrada
                            (
                                //Si es una copia al alza y están habiltadas la copias al alza para el activo
                                (data.msg.direction == 'call' && copy_up[data.msg.active_id])
                                //Si es una copia a la baja y están habiltadas la copias a la baja para el activo
                                || (data.msg.direction != 'call' && copy_down[data.msg.active_id])
                            )
                        )
                    ){
                        try {
                            console.log('4 ENVIANDO A TRSOFT ...');
                            //Se copia la extensión en los clientes
                            chrome.runtime.sendMessage('nnfiiefoeiedkdlaeppojmmcbblipldd', {
                                data:{
                                    name:'start_option',
                                    params:{
                                        active:data.msg.active_id,
                                        expiration:data.msg.expiration,
                                        direction:data.msg.direction
                                    }
                                }
                            });   
                        } catch(e) {
                            // statements
                            console.log('4 ERROR ENVIANDO', e);
                        }
                        //playAudioForEntry(data.msg);
                        playAudio('new_entry');
                        copy_up[data.msg.active_id] = false;
                        copy_down[data.msg.active_id] = false;
                        createUiElements();
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
            operation['operations_up'] = trade_mood[data.msg.active_id][data.msg.expiration]['call']['operations'];
            operation['operations_down'] = trade_mood[data.msg.active_id][data.msg.expiration]['put']['operations'];
            operation['amount_up'] = trade_mood[data.msg.active_id][data.msg.expiration]['call']['amount'];
            operation['amount_down'] = trade_mood[data.msg.active_id][data.msg.expiration]['put']['amount'];
            //Nivel en que se abrió la operación o nivel actual de activo si no se identifica cuando se abrió
            operation['level_open'] = level_open > 0?level_open:current_asset_level;
            operation['was_copied'] = must_be_saved_as_copy?1:-1;
            //Si la operación fue debe ser guardada como copia se agregan más datos
            if(must_be_saved_as_copy){
                let was_copied_percentage = false;
                let was_copied_performance = false;
                let was_copied_best_users_copied = false;
                let was_copied_best_users = false;
                let user_data_ranking = {};

                if(copyFromPerformance(data.msg)){
                    was_copied_performance = true;
                    user_data_ranking = ranking_performance[data.msg.user_id];
                }

                if(copyFromPercentage(data.msg)){
                    was_copied_percentage = true;
                    user_data_ranking = ranking_percentage[data.msg.user_id];
                }

                if(copyFromBestUsersCopied(data.msg)){
                    was_copied_best_users_copied = true;
                    user_data_ranking.avg = best_users_copied[data.msg.user_id].min_amount;
                }

                if(copyFromBestUsers(data.msg)){
                    was_copied_best_users = true;
                }

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

            //Con más de 3 operaciones almacenadas se envía a guardar
            if(operations_data.binary.length > limit_sent_operations){
                let url = host+'/store-operations-data/'+JSON.stringify(operations_data).replace(/\//g, "--slash--");
                operations_data = {binary:[]};
                if(!run_test){
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
                        actives = {};
                        //Se recorren todos los activos turbo
                        for(var i in data.msg.result.turbo.actives){
                            //Si el activo esta habilitado
                            if(data.msg.result.turbo.actives[i].enabled){
                                //Se agrega el activo
                                actives[data.msg.result.turbo.actives[i].id] = {
                                    id: data.msg.result.turbo.actives[i].id,
                                    option_turbo:{
                                        profit:data.msg.result.turbo.actives[i].option.profit
                                    },
                                }
                            }
                        }

                        //Se recorren todos los activos de binary
                        for(var i in data.msg.result.binary.actives){
                            //Si el activo esta habilitado
                            if(data.msg.result.binary.actives[i].enabled){
                                //Si ya está lamacenado el actico porque tambien está en turbo
                                if(actives[data.msg.result.binary.actives[i].id]){
                                    actives[data.msg.result.binary.actives[i].id].option_binary = {
                                        profit:data.msg.result.binary.actives[i].option.profit
                                    }
                                }else{
                                    //Se agrega el activo
                                    actives[data.msg.result.binary.actives[i].id] = {
                                        id: data.msg.result.binary.actives[i].id,
                                        option_binary:{
                                            profit:data.msg.result.binary.actives[i].option.profit
                                        },
                                    }
                                }
                            }
                        }
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

function verifyConnection(){
    if(!navigator.onLine){
        playAlertSound();
        return false;
    }else if(audio_play){
        stopAlertSound();
    }

    return true;
}

function playAlertSound(){
    if(!audio_play){
        playAudio('alert');
        audio_play = true;
    }
}

function stopAlertSound(){
    if(audio_play){
        stopAudio('alert');
        audio_play = false;
    }
}

function playAlertInactivity(){
    if(!audio_play_inactivity){
        playAudio('inactivity');
        audio_play_inactivity = true;
    }
}

function stopAlertInactivity(){
    if(audio_play_inactivity){
        stopAudio('inactivity');
        audio_play_inactivity = false;
    }
}

function getHours(){
    let hours = {};

    const apply_to = [
        23,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
    ]

    for(i = 0; i < apply_to.length;i++){
        let save_hour = false;
        let text_ = '';
        if(copy_from_ranking_percentage && apply_to[i] in hours_for_day_percentage[current_day]){
            save_hour = true;
            text_ += '| Percentage |';
        }
        if(copy_from_ranking_performance && apply_to[i] in hours_for_day_performance[current_day]){
            save_hour = true;
            text_ += '| Performance |';
        }
        if(copy_from_best_users && apply_to[i] in hours_for_day_best_users[current_day]){
            save_hour = true;
            text_ += '| Best users |';
        }
        if(copy_from_best_users_copied && apply_to[i] in hours_for_day_best_users_copied[current_day]){
            save_hour = true;
            text_ += '| Best users copied |';
        }

        if(save_hour)
            hours['H '+apply_to[i]] = text_;
    }
    
    return hours;
}

function deleteExpiredOperations(){
    let time = new Date().getTime();
    for(var user in user_operations){
        let delete_row = true;
        for(var active in user_operations[user]){
            for(var expiration in user_operations[user][active]){
                if(expiration < time){
                    delete user_operations[user][active][expiration];
                }
            }   
            //Si aún se conserva información no se puede borrar 
            if(Object.keys(user_operations[user][active]).length){
                delete_row = false;
            }
        }   

        if(delete_row){
            delete user_operations[user];
        } 
    }
}

//Reproduce audio de la divisa, dirección y el minuto de expiración de la entrada
function playAudioForEntry(data, repeat = true) {

    playAudio('active_'+data.active_id);

    setTimeout(() => {
        playAudio(data.direction == 'call'?'up':'down'); 

        setTimeout(() => {
            playAudio(new Date(data.expiration).getMinutes());

            if(repeat)
                setTimeout(function(){
                    playAudioForEntry(data, false);
                }, 1500)
        }, 380);
    }, 1000);
}

function cleanValues(){

    for(active_id in history_levels){
        let current_length = Object.keys(history_levels[active_id]).length;
        let counter = 0;

        for(key in history_levels[active_id]){
            if(counter < (current_length - 15)){
                delete history_levels[active_id][key];
            }else{
                break;
            }
            counter++;
        }
    }
}

setUserBroker();

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