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
//Almacena las operaciones de trademood que no se puieron envíar por trademood
//pero aún pueden enviarse si las condiciones actuales cambian
let pending_operations_trademood = [];
//Almacena las operaciones de trademood que no se pudieron enviar
//porque necesitan confirmación
let pending_operations_confirmation = [];

//Ranking de usuarios ordenado por porcentaje de acierto
let ranking_percentage = {};
//Rankin de usuarios ordenado por rendimiento
let ranking_performance = {};
//Almacena la lista de los mejores usuarios que han sido copiados
let best_users_copied = {};
//Almacena la lista de los mejores usuarios del sistema
let best_users = {};

//Información de los activos disponibles para el usuario
let actives = {};
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

//Limite de operaciones que se almacenan antes de ser enviadas al servidor
let limit_sent_operations = 20;
//Ultima vez que se recibió una alerta (time)
let last_option_at = 0;
//Peticiones pendientes de respuesta desde el servidor
let pending_fetch = 0;
let limit_pending_fetch = 20;

//Estado de animo del comercio en el mínuto actual
let trade_mood = {};

let audio_play = false;
let audio_play_inactivity = false;
//Activo seleccionado desde la vista de selección
let active_selected = null;
//Almacena las configuraciones para determinar si
//copiar las entradas al alza o a la baja
let copy_up = {
	//1:false
};
let copy_down = {
	//1:false
};

//Almacenas las configuraciones de cada activo
let active_settings = {};
//Cuenta la cantidad de veces que el sistema deja de enviar entradas 
//por acumulación
let counter_pause = 0;