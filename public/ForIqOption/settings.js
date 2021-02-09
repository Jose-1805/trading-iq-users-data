//Ejecutar en cuenta de práctica o real
let practice_account = true;
//Valor de inversión
let current_amount = 1;

//Determina si sólo se deben enviar datos de cierre de vela
//para evaluar las operaciones que cierran en cada minuto
let only_evaluate_expiration = false;
let force_only_evaluate_expiration = false;
//Determina si se deben imprimir en la consola los errores
//generadis durante la ejecución del código
let print_errors = true;
//Determina si se muestran los mensajes de log
let print_log = true;
//Determina si se debe reproducir un sonido cuando una operación sea copiada
let play_audio_entry = false;

//Activos cuyas operaciones deben ser copidas
let actives_to_copy = {
    1 : true,
    //2 : true,
    //3 : true,
    4 : true,
    5 : true,
    //6 : true,
    //8 : true,
    99 : true,
    947 : true,
    //2 : true,
    //6 : true,

    //OTC
    76 : true,
    77 : true,
    78 : true,
    80 : true,
    81 : true,
    86 : true,
}