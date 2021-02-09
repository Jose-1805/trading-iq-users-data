const host = 'http://127.0.0.1:8000';
//Valor actual de cada par de divisas
let current_asset_levels = {};
//Operaciones almacenadas en memoria antes de ser enviadas al servidor
let operations_data = {binary:[]};
//Ranking de usuarios ordenado por porcentaje de acierto
let ranking = {};
//Rankin de usuarios ordenado por rendimiento
let ranking_performance = {};
//Almacena la lista de los mejores usuarios que han sido copiados
let best_users_copied = {};
//Almacena la lista de los mejores usuarios del sistema
let best_users = {};
//Ejecutar en cuenta de práctica o real
let practice_account = true;
//Valor de inversión predeterminada
let my_amount = 1;
//Valor actual de inversión
let current_amount = my_amount;
//Información de los activos disponibles para el usuario
let actives = null;

/**
 * Configuración para determinar que entradas copiar
 * Para realizar una copia el usuario de la operación
 * debe estar en todos los lugares representdos por las variables
 * que estñen en true
 */
let copy_from_ranking = true;//Usuarios que estén en cualquier ranking
let copy_from_ranking_performance = true;//Sólo usuarios que estén en el ranking de rendimiento
let copy_from_ranking_percentage = true;//Sólo usuarios que estén en el rankng de porcentaje de acierto
let copy_from_best_users_copied = true;//Sólo usuarios que estén dentró de los mejores usuarios copiados
let copy_from_best_users = true;//Sólo usuarios que estén dentró de los mejores usuarios del sistema

//Almacena las fechas de expiracion de las operaciones copiadas
//y en cada fecha almacena el id de los usuarios que abrieron operaciones
//para dicha fecha de expiración y que fueron copiadas
let time_operations_copy = {};
//Informción del usuario traida desde el broker
let user_data = null;
//Ultimo segundo desde el que se recibieron datos
let last_second = null;
//Determina si sólo se deben enviar datos de cierre de vela
//para evaluar las operaciones que cierran en cada minuto
let only_evaluate_expiration = false;

//Determina si las operaciones se deben copiar con la estrategia martingala
let martingale_is_active = false;
//Cantidad de intentos actuales fallidos en la actual operación martingala
let current_attemps_for_martingale = 0;
//Cantidad máxima de intentos fallidos por operación martingala
let max_attemps_for_martingale = 10;
//Determina si existe una operación e martingala corriedo actualmente
let martingale_operation_in_progress = false; 
//ALmacena la informaćión de las operaciones realizadas para martingala
//el key es el timestamp de la expiración de la operación
let martingale_operations = {};
//Determina si para que una operación deba ser copiada 
//debe cumplir (true) todas las condiciones de ranling o solo una (false)
let must_be_copied_with_all = false;

let audio_alert = null;
let audio_play = false;

const current_day = 4;

//Strategy from percentage
const hours_for_day_percentage = {
    7 : {
        2 : true,
        6 : true,
    },
    1 : {
        12 : true,
    },
    2 : {
    },
    3 : {
        2 : true,
        12 : true,
    },
    4 : {
        5 : true,
        10 : true,
    }
};

//Strategy from performance
const hours_for_day_performance = {
    7 : {
        10 : true,
    },
    1 : {
        11 : true,
    },
    2 : {
        2 : true, 
        4 : true,
        12 : true,
    },
    3 : {
    },
    4 : {
        11 : true,
    }
};


//Strategy from best users
const hours_for_day_best_users = {
    7 : {
        1 : true,
    },
    1 : {
        23 : true,
        8 : true,
    },
    2 : { 
        1 : true, 
        7 : true,
        10 : true,
    },
    3 : {
        12 : true,
    },
    4 : {
        7  : true
    }
};


//Strategy from best users copies
const hours_for_day_best_users_copied = {
    7 : {
    },
    1 : {
        3 : true,
    },
    2 : {
    },
    3 : {
        2 : true,
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
        ranking[data.user_id] 
        && ranking[data.user_id].avg <= data.amount_enrolled
        && (
            //Si se consulta solo para guardar la operación, se calcula con el promedio normal
            //(only_save && ranking[data.user_id].avg <= data.amount_enrolled)
            only_save
            //Si se consulta para copiar la operación en real
            || (
                !only_save 
                //&& ranking[data.user_id].avg * 2 <= data.amount_enrolled
                //&& ranking[data.user_id].ranking_operations > 8

                //La hora es indicada para copiar operaciones desde porcentage
                && (
                    hours_for_day_percentage[current_day] 
                    && hours_for_day_percentage[current_day][hour]
                )

                /*
                    AGREGAR AQUÍ MÁS CONDICIONES
                 */
                
                //Domingo - Lunes
                //&& ranking[data.user_id].hit_percentage <= 90
                //&& data.amount_enrolled <= 50
                //&& ranking[data.user_id].performance >= 30
                
                //Lunes - Martes
                //&& ranking[data.user_id].hit_percentage <= 93
                //&& data.amount_enrolled <= 50
                //&& ranking[data.user_id].performance >= 50
                
                //Martes - Miercoles
                //&& ranking[data.user_id].hit_percentage <= 93
                //&& data.amount_enrolled <= 20
                //&& ranking[data.user_id].performance >= 30
                
                //Miercoles - Jueves
                //&& ranking[data.user_id].avg * 2.5 <= data.amount_enrolled
                //&& ranking[data.user_id].performance >= 90
                
                //Jueves - Viernes
                //&& ranking[data.user_id].avg * 3 <= data.amount_enrolled
                //&& ranking[data.user_id].hit_percentage >= 90
                //&& ranking[data.user_id].performance >= 30
            )
        )
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
            //Si se consulta solo para guardar la operación, no requiere más
            only_save
            //Si se consulta para copiar la operación, sólo promedios mayores a 300
            //y sólo posiciones menores a 15
            || (
                !only_save

                //La hora es indicada para copiar operaciones desde rendimiento
                && (
                    hours_for_day_performance[current_day] 
                    && hours_for_day_performance[current_day][hour]
                )
                /*
                    AGREGAR AQUÍ MÁS CONDICIONES
                 */
            )
        )
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
            //Si se consulta solo para guardar la operación, no requiere más
            only_save
            //Si se consulta para copiar la operación, sólo importes mayores o iguales a 10
            || (
                !only_save 

                //La hora es indicada para copiar operaciones desde mejores usuarios
                && (
                    hours_for_day_best_users[current_day] 
                    && hours_for_day_best_users[current_day][hour]
                )
                /*
                    AGREGAR AQUÍ MÁS CONDICIONES
                 */
            )
        )
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
            //Si se consulta solo para guardar la operación, no requiere más
            only_save
            //Si se consulta para copiar la operación, 
            //usuarios que también estén en lista de mejores usuarios
            //y también en la lista de porcentaje
            || (
                !only_save 
                
                //La hora es indicada para copiar operaciones desde mejores usuarios copiados
                && (
                    hours_for_day_best_users_copied[current_day] 
                    && hours_for_day_best_users_copied[current_day][hour]
                )
                /*
                    AGREGAR AQUÍ MÁS CONDICIONES
                 */
            )
        )
    );
}

/**
 * Determina si la operación de un usuario debe ser copiada
 * @return {[type]} [description]
 */
function mustBeCopied (data) {
    let must_be_copied = false;

    if(!user_data)
        return false;

    //Si el usuario debe estar en cualquier ranking
    if(copy_from_ranking){
        //Si el usuario está en cualquier ranking y cumple las condiciones de copiado
        if(copyFromPerformance(data, false) || copyFromPercentage(data, false)){
            //Si no se necesitan todas las condiciones la operación actual puede ser copiada
            if(!must_be_copied_with_all)
                must_be_copied = true;
        }else{
            //El usuario no está en ningún ranking y se necesitaban todas las condiciones
            if(must_be_copied_with_all)
                return false;   
        }
    }else{
        //Si el usuario debe estar en el ranking de rendimiento
        if(copy_from_ranking_performance){
            //Si el usuario está en el ranking y cumple las condiciones de copiado
            if(copyFromPerformance(data, false)){
                //Si no se necesitan todas las condiciones la operación actual puede ser copiada
                if(!must_be_copied_with_all)
                    must_be_copied = true;
            }else{
                //El usuario no está en el ranking y se necesitaban todas las condiciones
                if(must_be_copied_with_all)
                    return false;   
            }
        }

        //Si el usuario debe estar en el ranking de porcentaje
        if(copy_from_ranking_percentage && !must_be_copied){
            //Si el usuario está en el ranking y cumple las condiciones de copiado
            if(copyFromPercentage(data, false)){
                //Si no se necesitan todas las condiciones la operación actual puede ser copiada
                if(!must_be_copied_with_all)
                    must_be_copied = true;
            }else{
                //El usuario no está en el ranking y se necesitaban todas las condiciones
                if(must_be_copied_with_all)
                    return false;   
            }
        }
    }

    //Si el usuario debe estar en la lista de mejores usuarios copiados
    if(copy_from_best_users_copied && !must_be_copied){
        //Si el usuario está en la lista de mejores usuarios copiados y cumple las condiciones de copiado
        if(copyFromBestUsersCopied(data, false)){
            //Si no se necesitan todas las condiciones la operación actual puede ser copiada
            if(!must_be_copied_with_all)
                must_be_copied = true;
        }else{
            //El usuario no está en la lista de mejores usuarios y se necesitaban todas las condiciones
            if(must_be_copied_with_all)
                return false;   
        }
    }

    //Si el usuario debe estar en la lista de mejores usuarios
    if(copy_from_best_users && !must_be_copied){
        //Si el usuario está en la lista de mejores usuarios y cumple las condiciones de copiado
        if(copyFromBestUsers(data, false)){
            //Si no se necesitan todas las condiciones la operación actual puede ser copiada
            if(!must_be_copied_with_all)
                must_be_copied = true;
        }else{
            //El usuario no está en la lista de mejores usuarios y se necesitaban todas las condiciones
            if(must_be_copied_with_all)
                return false;   
        }
    }

    //Si must_be_copied sigue en false y no se necesitaban todas las condiciones
    //es porque no cumplió ningúna
    if(!must_be_copied && !must_be_copied_with_all)
        return false;

    //Si martingala está activo y hay una operación en progreso no se debe copiar la actual
    if(martingale_is_active && martingale_operation_in_progress)
        return false;

    //Si el usuario de la operación tiene otra operación para la fecha
    //de expiración de la actual
    if(time_operations_copy[data.expiration] && time_operations_copy[data.expiration][data.user_id])
        return false;

    return true;
}

/**
 * Determina si la operación de un usuario debe ser almacenada como copia
 * en el sistema para evaluar mejores usuarios
 * @return {[type]} [description]
 */
function mustBeSavedAsCopy (data) {
    //Si el usuario está en cualquier ranking o lista y 
    //el valor de la entrada es mayor o igual  al promedio
    if(
        (ranking_performance[data.user_id] && ranking_performance[data.user_id].avg <= data.amount_enrolled)
        || (ranking[data.user_id] && ranking[data.user_id].avg <= data.amount_enrolled)
        || (best_users_copied[data.user_id] && best_users_copied[data.user_id].min_amount <= data.amount_enrolled)
        || best_users[data.user_id]
    ){
        return true;
    }

    return false;
}

/**
 * Genera una cadena formateada para envíar una operación al broker
 * @return {[type]}      [description]
 */
function getDataSendOption(data, is_copy){
    return '{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":'+getBalanceId(is_copy)+',"active_id":'+data.active_id+',"option_type_id":'+(data.option_type == 'turbo'?3:1)+',"direction":"'+data.direction+'","expired":'+data.expiration.toString().substr(0,10)+',"refund_value":0,"price":'+current_amount+',"value":0,"profit_percent":'+ (100-actives[data.active_id]['option_'+data.option_type].profit.commission)+'}}}';
}

/**
 * Envía una operación para martingala de acuerdo a la configuración y los datos enviados
 */
function sendMartingale(data) {
    wsSend(getDataSendOption(data));

    martingale_operation_in_progress = true;

    //Si no existe una operación registrada para la fecha
    if(!time_operations_copy[data.expiration]){
        time_operations_copy[data.expiration] = {};
    }
    
    //El id del usuario se ubica dentro de la expiración para identificar que
    //el usuario ya realizó una entrada para la fecha
    time_operations_copy[data.expiration][data.user_id] = true;                                
    //Se agrega la operación a la lista de operaciones martingala
    martingale_operations[data.expiration] = {
        active_id: data.active_id,
        direction: data.direction,
        expiration: data.expiration
    }

    //Se suma el actual como un nuevo intento de martingala
    current_attemps_for_martingale++;
}

/**
 * Envía una operación de acuerdo a la configuración y los datos enviados
 */
function sendOperation(data, is_copy) {
    wsSend(getDataSendOption(data, is_copy));
    //oSendOperation(data);

    //Si no existe una operación registrada para la fecha
    if(!time_operations_copy[data.expiration]){
        time_operations_copy[data.expiration] = {};
    }
    
    //El id del usuario se ubica dentro de la expiración para identificar que
    //el usuario ya realizó una entrada para la fecha
    time_operations_copy[data.expiration][data.user_id] = true;
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

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;

    try{
        var data = JSON.parse(str);
        let url = '';
        if(data.name){
            switch (data.name) {
                case 'candle-generated':
                
                case 'candles-generated':
                    //Ultimo valor antes de asignar el nuevo
                    const previous_value = current_asset_levels[data.msg.active_id];
                    current_asset_levels[data.msg.active_id] = data.name == 'candles-generated'?data.msg.value:data.msg.close;

                    //Se convierte la fecha
                    var time_date_at = data.msg.at.toString().substr(0,13);
                    var date_at = new Date();
                    date_at.setTime(time_date_at);

                    //Al cerrar una vela se envian los datos al servidor 
                    //para que evalue la las entradas que vencen en el segundo actual
                    if(date_at.getSeconds() == 1 && last_second == 0){
                        //Se resta un segundo para que quede igual a la fecha anterior
                        date_at.setSeconds(date_at.getSeconds() - 1);
                        date_at.setMilliseconds(0);
                        url = host+'/evaluate-expiration/'+data.msg.active_id+'/'+previous_value+'/'+date_at.getTime().toString().substr(0,13);
                        //Se envñia el valor de cierre de la vela para evaluar resultados
                        //de operaciones que cierra en el minuto actual
                        fetch(url, {mode: 'no-cors'}).then((response) => {
                            if(!only_evaluate_expiration){
                                //Ranking generado de acuerdo al rendimiento alcanzado por los usuarios
                                fetch('http://127.0.0.1:8000/ranking/performance/25').then((response) => {
                                    response.json().then((data) => {
                                        ranking_performance = data;
                                    })

                                    //Ranking generado de acuerdo al porcentaje de acierto de los usuario
                                    fetch('http://127.0.0.1:8000/ranking/percentage/25').then((response) => {
                                        response.json().then((data) => {
                                            ranking = data;
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
                        });

                        //Se deja la fecha como estaba
                        date_at.setSeconds(date_at.getSeconds() + 1);

                    }else if(date_at.getSeconds() % 5 == 0 && operations_data.binary.length && !only_evaluate_expiration){
                        let url = host+'/store-operations-data/'+JSON.stringify(operations_data).replace(/\//g, "--slash--");

                        operations_data = {binary:[]};
                        fetch(url, {mode: 'no-cors'}).then((response) => {
                            if(response.status == 404){
                                console.warn('ERROR:', url);
                                console.warn('OR:', response.url);
                            }else if(response.status != 200){
                                console.warn('OTHER RESPONSE:', response);
                            }
                        });
                    }

                    last_second = date_at.getSeconds();
                    break;

                //Opciones binarias en vivo
                case 'live-deal-binary-option-placed':
                    //El precio actual del activo esta registradoo
                    if(
                        current_asset_levels[data.msg.active_id] 
                        && actives[data.msg.active_id] 
                        && !only_evaluate_expiration
                        //Falta más de 31 segundos para expirar
                        && (data.msg.expiration - new Date().getTime()) >= 31000
                    ){
                        //Si se debe guardar como cópia para evaluación posterior
                        let must_be_saved_as_copy = mustBeSavedAsCopy(data.msg);
                        let must_be_copied = false;

                        //Si debe guardarse como copia
                        if(must_be_saved_as_copy){
                            //Se envía la operación para conocer el resultado
                            //real de la copia
                            sendOperation(data.msg, true);

                            must_be_copied = mustBeCopied(data.msg);

                            //Si la operación debe ser copiada en real
                            if(must_be_copied && !practice_account){
                                //Si debe ser enviada por martingala
                                if(martingale_is_active){
                                    sendMartingale(data.msg);
                                //Copia de operación sin martingala
                                }else{
                                    sendOperation(data.msg);
                                }
                            }
                        }


                        let operation = {};
                        operation['active_id'] = data.msg.active_id;
                        operation['amount_enrolled'] = data.msg.amount_enrolled;
                        operation['direction'] = data.msg.direction;
                        operation['option_type'] = data.msg.option_type;
                        operation['created_at'] = data.msg.created_at;
                        operation['expiration'] = data.msg.expiration;
                        operation['option_id'] = data.msg.option_id;
                        operation['user_id'] = data.msg.user_id;
                        operation['name'] = data.msg.name;
                        operation['country_id'] = data.msg.country_id;
                        //Nivel actual de activo
                        operation['level_open'] = current_asset_levels[data.msg.active_id];
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
                                user_data_ranking = ranking[data.msg.user_id];
                            }

                            if(copyFromBestUsersCopied(data.msg)){
                                was_copied_best_users_copied = true;
                                user_data_ranking.avg = best_users_copied[data.msg.user_id].min_amount;
                            }

                            if(copyFromBestUsers(data.msg)){
                                was_copied_best_users = true;
                            }

                            operation['sent'] = must_be_copied?1:-1;
                            operation['use_for_martingale'] = (martingale_is_active && must_be_copied)?1:-1;
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
                        if(operations_data.binary.length > 3){
                            let url = host+'/store-operations-data/'+JSON.stringify(operations_data).replace(/\//g, "--slash--");
                            operations_data = {binary:[]};
                            fetch(url, {mode: 'no-cors'}).then((response) => {
                                if(response.status == 404){
                                    console.warn('ERROR:', url);
                                    console.warn('OR:', response.url);
                                }else if(response.status != 200){
                                    console.warn('OTHER RESPONSE:', response);
                                }
                            });
                        }
                    }
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

                    //Si la fecha de expiración está en una de las entradas de martinagla
                    if(martingale_is_active
                        && martingale_operations[data.msg.expired+'000']
                        && !martingale_operations[data.msg.expired+'000'].broker_id
                        && martingale_operations[data.msg.expired+'000'].direction == data.msg.dir
                        && martingale_operations[data.msg.expired+'000'].active_id == data.msg.active_id
                    ){
                        martingale_operations[data.msg.expired+'000'].broker_id = data.msg.id
                    }
                    break;
                
                case 'socket-option-closed':
                    //Al cerrar una operación se envía a evaluar si hay datos relacionados con la operación
                    //para actualizar el resultado
                    setTimeout(() => {
                        url = host+'/evaluate-option-closed/'+data.msg.id+'/'+(data.msg.win == 'loose'?-1:(data.msg.win == 'win'?1:0));
                        fetch(url, {mode: 'no-cors'});
                    }, 6000);

                    //Si está activo martingala se determina si la operción era de martingala
                    //y se determina que hacer según el resultado
                    if(martingale_is_active && martingale_operation_in_progress && martingale_operations[data.msg.expired+'000'] && martingale_operations[data.msg.expired+'000'].broker_id == data.msg.id){
                        switch (data.msg.win){
                            case 'win':
                                console.warn('Operación ganada en intento #'+current_attemps_for_martingale);
                                current_attemps_for_martingale = 0;
                                current_amount = my_amount;
                                break;
                            case 'loose':
                                if(current_attemps_for_martingale >= max_attemps_for_martingale){
                                    current_amount = my_amount;
                                    current_attemps_for_martingale = 0;
                                    console.warn('Martingala detenido por máximo de intentos alcanzado');
                                }else{
                                    current_amount += parseFloat(parseFloat(current_amount * 1.25).toFixed(2));
                                }
                                break;
                            default:
                                current_attemps_for_martingale--;
                                break;
                        }
                        martingale_operation_in_progress = false;
                    }
                    break;
                
                case 'option-rejected':
                    console.warn(data.msg);
                    break;
                
                case 'option':
                    //Si la operación no logra enviarse en martingala
                    if(martingale_is_active && martingale_operation_in_progress && data.msg.message == 'Time for purchasing options is over, please try again later.'){
                        current_attemps_for_martingale--;
                        martingale_operation_in_progress = false;
                    }
                    break;
                default:
                    // statements_def
                    break;
            }
        }
    }catch(error){
        //console.warn('ERROR', error)
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

function createAudioElement(){
    audio_alert = new Audio("data:audio/mpeg;base64,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et278zfTtRpmv/////oeoSnG9QwAB+7/+/pj/////9v//////9IAQADmuGjQAAt9YsTM4EkXI3oNXvFwJuSmSmf850XPT/6JVrGev2//T/77mh5mrTfqAf//NFUUwFUmq9j7diNz43QqASfIgE8XMuZLEaleASblYjQad1i4Jff/+zBkC4jRuTVFsy0S4BaACHIAIwAGBNUfTChLgC4AIggAjAB5wUztqbUPmiNNa6jvRJFQ1lps0r/0z//f/3yCSkn4xV/IB0//Vck4kKl5x8i8eoWslqHlqn9IbuWBoAFGv/eltWM0rYrpXnuFo1S9A6VVXIVvo15r7MtlbdwaTbo62///T9vr7I4oqf//6UjxlD5dUhqqASXGEgD/+0BkAojRgDTGuwoq4BgACLoAAgEFaEEYyclHAB4AY0wAiAQUu/f4uXB1wLkkXUR34jitNfDpDzM3521Pq1yolm3r///9/tpaj40CA++WAAANSNEAD/+jXQZYkmSLl31tet9icerpJfoABWzLnQx06dCGy4ag2IbojESO6gmraZRbECRwuTe9KWh0YEEt1f/9ZlgQf/9H/9pKAAFK/hAKXf/cochWi3EpyLXvMjAL2eWqCatU9f/7MGQOCIGLNUZLCirgCkAYsQAiAYUE1SmmnKuoXAAh2AGMAJ9KfMY1fzv7TM13Xk/Lo///16wVfV4H//ezQ+MV2OyoUVu1YQADX5VkNKJh6C/LYevNzEpnzHolaLZDV+9E/rp////XIATV9CXygf/7P3zIKAyi54rnNbUs/Q/VRb+qAdfkgFEv1/z05moDO6SL8jENQtQE1bTfP//7IGQMgNFdNMazChLgCsAYggACAQU8Mx1INWTAJoAiCAGMBG63qr9JS91tZX//+/9L9vSDd1tAAH//fmF0H2i1YCBFqOBAABW6x/LpwEsfgtHzEfOK1Au8wWWdUo+iDKFrbEJ4otP/d+/Fkk//93/Pfc450wBXwoAVraQErLC9Zxj/+zBkBoDBfTTFskoS4hUACIIAIjkEWEMppRVHIFoMokwACOQuH8wTaZQE1HuuRLK5yobUvBrU9Vd2RfXv6en9lb/86M8K23IAf0/1swCneHVJsbwFXLl2MtpZSACAG9bdQAAA75R4cWAHotHi4IlH7+VZSXJWOF70lV////LCSJAAf/9U7+UYooOQbF0Azets92DuKAAQAVW5YAj/+zBkA4DRGw1IaadpMA7ACFIAIwAEMDMpo4lE4DsAI0wQjSwAGbycZDR0B/z9TxmFc6Wj6rU7cjWeQmT///oDgkgB///o/rQv/W7////1AFgCTC7UAAAG+PjKA4B6nUeIwdKns+oiKrW5lJFav///ULa///6TBhLEkckueYpFVQBEqABQrm+Zt1t6Xl31z61beIASVPt9Vp9a/Xr/+xBkDgnRLDVFMwcS4AoACHIAIgADeDMZJqjkwB8AIYQBjAR0b9f7W///9QNiNAD///X+nvT+kCUMBBV5IF1DNoSN1rvEAJSC+r/rOl0Bhn//5Rn//+uEUGPrKAAQFA2oBAAN3lMcx//7IGQGgMD9NMpo5RLoC2AIcgBiAQPUMRbGnKTAW4AhiACMAPb+FBpV//1dqdG9/v///////FrIAH//vvpmZPZ0jwBFoAAM1nkuMQD0gQz9q4UGldXFX1DTwGdRp///uIP0QH//0KVjDQceKmvclostaHf9uqdxVQAAIPpAA11OsaX/+yBkBQjRCRrGSacpwBQgCEIAIkoEMDUYxqREwCKAYkgAjARw42Edf2hQbZ//bWV6NXGqX631J/p/y42oB///bit/YLhAow439X//93/6hF4oArzmaPwNS5T/KvtBDoM/05PJnj5ZCXvS//Uxn1MOIaz//6eqyrAdChkAANdTKGpS//sgZAQM0Sc1RRGiEuANgBgyACIAA/gxFEaoRMAbgGJIAIwGxJWlePVKNBDuTT/TR/VkdXQj+1pH6P///f//F9RKAB//+dbTvyPs//7tDUoAKVbTcsgOPKVTGpgh1e9o4Nh6f2mUW32fpop/Z/UEH///qdKKAAAl6AABtcU4RpXan//7IGQGiMDwFcZI5ynICcAYcgACAQPILxbDlETAQQAjTAAIBEDa6ZP4xFGmiybS1+eIp0XpDgAP///ejUv/rFdygAlXMeCFm3x9oJ7c+2fWtck9y58m97Ol2//06LtRAAP//hyYS1bF2Mv//+aqAAQCAgtgAAD8sC63+l/PCZYqHlv/+xBkCgHAvgTJaCEQGA9gGCYAIwAB+BMfIIRAYE0AIkwAjATCwH+gAJWgB//R6/Tda8JJYvf1gACNfjl8LfW7fVDm9f6rEjaiIAf//3tVeihi9P+jbY+O/dXVAGEhNwAABqtVcm5ifP/7EGQGjdCcAMdQIRAICOAX4QAmAQDUAyJgBGAgTIAeyBCMADXERbXdfqID//9qLUqYXXRgP/+5P+kGE3Jnis8Wnf/+SLPBUqdDtyL0KgBQAAH/rFWYsLC6hYWFm4r///FRUVFRQWFh//sQZA0P8FUAp7ABGAgQ4AQQBCMAAAABpAAAACAAADSAAAAEYWpMQU1FMy45OC4yqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xBkIQ/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7EGRDD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
    audio_alert.style = 'display=none';
    audio_alert.loop = true;
    document.body.appendChild(audio_alert);
}

function playAlertSound(){
    if(!audio_play){
        audio_alert.play();
        audio_play = true;
    }
}

function stopAlertSound(){
    if(audio_play){
        audio_alert.pause();
        audio_play = false;
    }
}

function getHours(){
    let hours = Object.assign({}, hours_for_day_percentage[current_day], {});
    hours = Object.assign({}, hours_for_day_performance[current_day], hours);
    hours = Object.assign({}, hours_for_day_best_users[current_day], hours);
    hours = Object.assign({}, hours_for_day_best_users_copied[current_day], hours);
    return hours;
}

createAudioElement();

setUserBroker();

setInterval(() => {
    requestSyncDataBroker();
}, 10000);

//google-chrome  --user-data-dir=/tmp --disable-web-security