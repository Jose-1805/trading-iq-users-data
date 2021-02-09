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
                //El activo está configurado
                data.active_id in active_settings
                && (
                    //Si no deben copiarse las operaciones de acuerdo a la hora actual
                    !active_settings[data.active_id].apply_hours.percentage
                    //Si la hora actual esta configurada para el activo
                    || active_settings[data.active_id].hours.percentage[hour]
                )
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
                //El activo está configurado
                data.active_id in active_settings
                && (
                    //Si no deben copiarse las operaciones de acuerdo a la hora actual
                    !active_settings[data.active_id].apply_hours.performance
                    //Si la hora actual esta configurada para el activo
                    || active_settings[data.active_id].hours.performance[hour]
                )
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
                //El activo está configurado
                data.active_id in active_settings
                && best_users[data.user_id].ranking_operations >= active_settings[data.active_id].min_operations_best_users
                && (
                    //Si no deben copiarse las operaciones de acuerdo a la hora actual
                    !active_settings[data.active_id].apply_hours.best_users
                    //Si la hora actual esta configurada para el activo
                    || active_settings[data.active_id].hours.best_users[hour]
                )
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
                //El activo está configurado
                data.active_id in active_settings
                && (
                    //Si no deben copiarse las operaciones de acuerdo a la hora actual
                    !active_settings[data.active_id].apply_hours.best_users_copied
                    //Si la hora actual esta configurada para el activo
                    || active_settings[data.active_id].hours.best_users_copied[hour]
                )
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
        //Si el activo está configurado
        data.active_id in active_settings
        && (
            (active_settings[data.active_id].copy_from_ranking_percentage && copyFromPercentage(data, false))
            || (active_settings[data.active_id].copy_from_ranking_performance && copyFromPerformance(data, false))
            || (active_settings[data.active_id].copy_from_best_users && copyFromBestUsers(data, false))
            || (active_settings[data.active_id].copy_from_best_users_copied && copyFromBestUsersCopied(data, false))
        )
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
function printActiveSettings(){
    for(let active_id in active_settings){
        console.log("\n\n** ACTIVE SETTINGS "+active_id);

        const printDataStrategy = (strategy) => {
            console.log("****** Use general settings: "+(active_settings[active_id]["use_general_settings"][strategy]?"YES":"NO"));
            console.log("****** Only good seconds: "+(active_settings[active_id]["copy_only_good_seconds"][strategy]?"YES":"NO"));
            console.log("****** Full percentages: "+(active_settings[active_id]["copy_trademood_full_percentages"][strategy]?"YES":"NO"));
            console.log("****** Apply hours: "+(active_settings[active_id]["apply_hours"][strategy]?"YES":"NO"));
            if(active_settings[active_id]["apply_hours"][strategy]?"YES":"NO")
                console.log("****** Hours", active_settings[active_id]["hours"][strategy]);
        }

        if(active_settings[active_id].copy_from_ranking_percentage){
            console.log("**** PERCENTAGE");
            printDataStrategy('percentage');
        }

        if(active_settings[active_id].copy_from_ranking_performance){
            console.log("**** PERFORMANCE");
            printDataStrategy('performance');
        }

        if(active_settings[active_id].copy_from_best_users){
            console.log("**** BEST USERS");
            console.log("****** Min. operations: "+active_settings[active_id]["min_operations_best_users"]);
            printDataStrategy('best_users');
        }

        if(active_settings[active_id].copy_from_best_users_copied){
            console.log("**** BEST USERS COPIED");
            printDataStrategy('best_users_copied');
        }

        console.log("**** Copy from trademood: "+(active_settings[active_id]["copy_for_trademood"]?"YES":"NO"));
        console.log("**** Trademood to TrSoft: "+(active_settings[active_id]["trademood_copy_in_trsoft"]?"YES":"NO"));

        console.log("**** Copy from strategy: "+(active_settings[active_id]["copy_for_strategy"]?"YES":"NO"));
        console.log("**** Strategy to TrSoft: "+(active_settings[active_id]["selection_copy_in_trsoft"]?"YES":"NO"));

        console.log("**** Copy from selection: "+(active_settings[active_id]["copy_for_selection"]?"YES":"NO"));
        console.log("**** Selection to TrSoft: "+(active_settings[active_id]["strategy_copy_in_trsoft"]?"YES":"NO"));
    }
}

/**
 * Imprime las horas en que el sistema tratará de
 * copiar operaciones automáticamente
 */
function printHours(){
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

        for(let active_id in active_settings){

            if(active_settings[active_id].copy_from_ranking_percentage && active_settings[active_id].apply_hours.percentage && apply_to[i] in active_settings[active_id].hours.percentage){
                save_hour = true;
                text_ += '| Percentage => '+active_id+' |';
            }
            if(active_settings[active_id].copy_from_ranking_performance && active_settings[active_id].apply_hours.performance && apply_to[i] in active_settings[active_id].hours.performance){
                save_hour = true;
                text_ += '| Performance => '+active_id+' |';
            }
            if(active_settings[active_id].copy_from_best_users && active_settings[active_id].apply_hours.best_users && apply_to[i] in active_settings[active_id].hours.best_users){
                save_hour = true;
                text_ += '| Best users => '+active_id+' |';
            }
            if(active_settings[active_id].copy_from_best_users_copied && active_settings[active_id].apply_hours.best_users_copied && apply_to[i] in active_settings[active_id].hours.best_users_copied){
                save_hour = true;
                text_ += '| Best users copied => '+active_id+' |';
            }
        }


        if(save_hour)
            hours['H '+apply_to[i]] = text_;
    }
    
    console.log("*** Copying according to configuration ***", hours);
    let data_print = [];
    for(let active_id in active_settings){

        if(active_settings[active_id].copy_from_ranking_percentage && !active_settings[active_id].apply_hours.percentage){
            data_print.push("Active "+active_id+" => percentage");
        }
        if(active_settings[active_id].copy_from_ranking_performance && !active_settings[active_id].apply_hours.performance){
            data_print.push("Active "+active_id+" => performance");
        }
        if(active_settings[active_id].copy_from_best_users && !active_settings[active_id].apply_hours.best_users){
            data_print.push("Active "+active_id+" => best users");
        }
        if(active_settings[active_id].copy_from_best_users_copied && !active_settings[active_id].apply_hours.best_users_copied){
            data_print.push("Active "+active_id+" => best users copied");
        }
    }
    console.log("*** always copying ***", data_print);
}


/**
 * Elimina datos de operaciones que ya han expirado
 */
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

//Elimina datos del historial de precios de cada divisa
function cleanValues(){

    for(active_id in history_levels){
        let current_length = Object.keys(history_levels[active_id]).length;
        let counter = 0;

        for(key in history_levels[active_id]){
            //Si hay más de 20 datos se dejan los ultimos 20 y se 
            //eliminan los demás
            if(counter < (current_length - 20)){
                delete history_levels[active_id][key];
            }else{
                break;
            }
            counter++;
        }
    }
}