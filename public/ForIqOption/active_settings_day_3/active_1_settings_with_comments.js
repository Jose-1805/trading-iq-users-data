//EUR-USD
active_settings[1] = {
	/**
	 * Configuración para determinar que entradas copiar
	 */
	"copy_from_ranking_percentage":true,//Sólo usuarios que estén en el rankng de porcentaje de acierto
	"copy_from_ranking_performance":true,//Sólo usuarios que estén en el ranking de rendimiento
	"copy_from_best_users":false,//Sólo usuarios que estén dentró de los mejores usuarios del sistema
	"copy_from_best_users_copied":false,//Sólo usuarios que estén dentró de los mejores usuarios copiados

	//Cantidad mínima de operaciones en el ranking de best_users para poder copiar una operación
	"min_operations_best_users":16,

	//Detrmina si se deben copiar sólo las operaciones en las que falte más de 
	//61 y menos de 200 segundos para expirar
	"copy_only_good_seconds":{
		"percentage":false,
		"performance":false,
		"best_users":false,
		"best_users_copied":false
	},

	//Determina si la copia de una operación por trademood se debe copiar
	//Sólo si todos los porcentajes están en 100%, de lo contrario puede quedar
	//pendiente y copiarse si el trademood cambia (así no llegue a 100%)
	"copy_trademood_full_percentages":{
		"percentage":true,
		"performance":true,
		"best_users":false,
		"best_users_copied":false
	},

	//Determina si se debe evaluar la hora actual para copiar una operación
	"apply_hours":{
		"percentage":true,
		"performance":false,
		"best_users":true,
		"best_users_copied":true
	},

	"hours": {
		"percentage":{
	        "0":true,
	        "3":true,
	        "5":true,
	        "8":true,
	        "9":true
	        //"12":true,
	    },

		"performance":{
	        "0":true,
	        "7":true
	    },

		"best_users":{
	        "23":true,
            "7":true,
            "9":true
	    },

		"best_users_copied":{
	        "23":true
	    }
	},

	//Determina que configuración de trademood utilizar
	"use_general_settings":{
		"percentage":false,
		"performance":false,
		"best_users":false,
		"best_users_copied":false
	},

	"trademood_settings":{
        //Cantidad de operaciones mínimas para copiar una operacion
        "min_operations":15,
        //Estado de animo mínimo para hacer una entrada (porcentage de opraciones)
        "min_percentage_operations":60,
        //Estado de animo mínimo para hacer una entrada (porcentage de dinero ingresado)
        "min_percentage_amount":60,
        //Cantidad de operaciones mínimas para que una operación quede pendiente
        "min_operations_pending":8,
        //Estado de animo mínimo para que una operación quede pendiente (porcentage de opraciones)
        "min_percentage_operations_pending":60,
        //Estado de animo mínimo para  para que una operación quede pendiente (porcentage de dinero ingresado)
        "min_percentage_amount_pending":60,
        //Cantidad de operaciones mánimas para copiar una operacion
        "max_operations":1000,
        //Comisión mínima que debe tener el broker para copiar una entrada
        "min_commission_broker":1,
        //Comisión mínima que debe tener el broker para copiar una entrada
        "max_commission_broker":30
    },

    "trademood_settings_general":{
        //Cantidad de operaciones mínimas para copiar una operacion
        "min_operations":5,
        //Estado de animo mínimo para hacer una entrada (porcentage de opraciones)
        "min_percentage_operations":70,
        //Estado de animo mínimo para hacer una entrada (porcentage de dinero ingresado)
        "min_percentage_amount":70,
        //Cantidad de operaciones mínimas para que una operación quede pendiente
        "min_operations_pending":5,
        //Estado de animo mínimo para que una operación quede pendiente (porcentage de opraciones)
        "min_percentage_operations_pending":70,
        //Estado de animo mínimo para  para que una operación quede pendiente (porcentage de dinero ingresado)
        "min_percentage_amount_pending":70,
        //Cantidad de operaciones mánimas para copiar una operacion
        "max_operations":1000,
        //Comisión mínima que debe tener el broker para copiar una entrada
        "min_commission_broker":10,
        //Comisión mínima que debe tener el broker para copiar una entrada
        "max_commission_broker":30
    },

	//Determina si las operaciones se deben copiar de acuerdo a las estrategías, horas y trademood
	"copy_for_trademood":false,
	//Determina si las operaciones se deben copiar de acuerdo a las estrategías y horas
	"copy_for_strategy":false,
	//Determina si las operaciones se deben copiar de acuerdo a las estrategías, horas, selección del usuario
	"copy_for_selection":false,

	//Determina si las operaciones de strategy deben ser copiadas a los usuarios TrSoft
	"strategy_copy_in_trsoft":false,
	//Determina si las operaciones de trademood deben ser copiadas a los usuarios TrSoft
	"trademood_copy_in_trsoft":false,
	//Determina si las operaciones de selection deben ser copiadas a los usuarios TrSoft
	"selection_copy_in_trsoft":false
};