<?php

use App\Models\Active;
use App\Models\BinaryOption;
use App\Models\BrokerUser;
use App\Models\CopiedBinaryOption;
use App\Models\Country;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


/**
 * Almacena la información de operaciones en la base de datos
 */
Route::get('/store-operations-data/{data}', function ($data) {
    $data = json_decode($data);

    //Alacena los datos de las opciones binarias enviadas
    if($data && $data->binary){
	    foreach ($data->binary as $operation) {

    		//Se busca si el usuario ya está almacenado en el sistema
	    	$broker_user = BrokerUser::select('id')->where('broker_id', $operation->user_id)->first();

	    	//Si no existe el usuario se crea
	    	if(!$broker_user){
	    		$country = Country::find($operation->country_id);

	    		if(!$country){
	    			$country = Country::create([
	    				'id' => $operation->country_id,
	    				'name' => 'NEW COUNTRY',
	    				'broker_id' => $operation->country_id,
	    			]);
	    		}

	    		$broker_user = BrokerUser::create([
	    			'name' => $operation->name,
			        'broker_id' => $operation->user_id,
			        'country_id' => $operation->country_id
	    		]);
	    	}

	    	//Se crea y almacena la operación
    		$binary_option = BinaryOption::create([
	    		'amount' => $operation->amount_enrolled,
	    		'direction' => $operation->direction == 'call'?1:-1,
	    		'level_open' => $operation->level_open,
	    		'type' => $operation->option_type,
	    		'opening_time' => $operation->created_at,
	    		'expiration_time' => $operation->expiration,
	    		'operations_up' => $operation->operations_up,
	    		'operations_down' => $operation->operations_down,
	    		'amount_up' => $operation->amount_up,
	    		'amount_down' => $operation->amount_down,
	    		'broker_id' => $operation->option_id,
	    		'active_id' => $operation->active_id,
	    		'broker_user_id' => $broker_user->id,
	    	]);
	    	//$binary_option->save();

	    	//La operación fue copiada
	    	if($operation->was_copied == 1){
	    		CopiedBinaryOption::create([
	    			'sent'  => $operation->sent,
	    			'profit'  => $operation->profit,
	    			'use_for_martingale'  => $operation->use_for_martingale,
	    			'from_performance'  => $operation->was_copied_performance,
	    			'from_percentage'  => $operation->was_copied_percentage,
	    			'from_best_users_copied'  => $operation->was_copied_best_users_copied,
	    			'from_best_users'  => $operation->was_copied_best_users,
	    			'ranking_position'  => $operation->pos,
	    			'avg'  => $operation->avg,
	    			'hit_percentage'  => $operation->hit_percentage,
	    			'performance'  => $operation->performance,
	    			'operations'  => $operation->ranking_operations,
	    			'binary_option_id'  =>  $binary_option->id
	    		]);
	    	}
	    }
	}
});

/**
 * Evalua las operaciones que expiran con la expiración, divisa y valor recibidos
 */
Route::get('/evaluate-expiration/{active}/{level_close}/{expiration}/{last}', function ($active, $level_close, $expiration, $last = -1) {
	
	DB::select("
		UPDATE binary_options
		SET 
			level_close = $level_close, 
			result = IF(level_open = $level_close, 0, (
						IF(direction = 1, (
							IF(level_open > $level_close, -1, 1)
						), (
							IF(level_open < $level_close, -1, 1)
						))
					))
		WHERE expiration_time = $expiration
		AND active_id = $active
	");

	/**
	 
	 //Operaciones ganadas en opciones binarias
	 BinaryOption::where('binary_options.expiration_time', $expiration)
	 ->where('binary_options.active_id', $active->id)
	 ->where(function($q) use ($level_close){
	 	$q->where(function($q_) use ($level_close){//Ganadas al alza
	 		$q_->where('binary_options.level_open', '<', $level_close)
	 		->where('binary_options.direction', 1);
	 	})
	 	->orWhere(function($q_) use ($level_close){//Ganadas a la baja
	 		$q_->where('binary_options.level_open', '>', $level_close)
	 		->where('binary_options.direction', -1);
	 	});
	 })
	 ->update([
	 	'level_close' => $level_close,
	 	'result' => 1
	 ]);

	 //Operaciones perdidas en opciones binarias
	 BinaryOption::where('binary_options.expiration_time', $expiration)
	 ->where('binary_options.active_id', $active->id)
	 ->where(function($q) use ($level_close){
	 	$q->where(function($q_) use ($level_close){//perdidas al alza
	 		$q_->where('binary_options.level_open', '>', $level_close)
	 		->where('binary_options.direction', 1);
	 	})
	 	->orWhere(function($q_) use ($level_close){//perdidas a la baja
	 		$q_->where('binary_options.level_open', '<', $level_close)
	 		->where('binary_options.direction', -1);
	 	});
	 })
	 ->update([
	 	'level_close' => $level_close,
	 	'result' => -1
	 ]);

	 //Operaciones neutras en opciones binarias
	 BinaryOption::where('binary_options.expiration_time', $expiration)
	 ->where('binary_options.active_id', $active->id)
	 ->where('binary_options.level_open', $level_close)
	 ->update([
	 	'level_close' => $level_close,
	 	'result' => 0
	 ]);

	 */
	
	if($last == 1){
		BrokerUser::setDataRankingFromExpirationTime($expiration);
	}

	
	//Cada 5 minutos se calculan los datos de ranking
	/*if($last == 1 && (int) date('i', substr($expiration, 0, 10))%2 == 0){
		$expiration = (int) $expiration;

		$expiration = '('.$expiration
		.','.($expiration - 60000)
		.','.($expiration - 120000)
		.','.($expiration - 180000)
		.','.($expiration - 240000)
		.')';
		
		//Se asignan los valores para los ranking
		BrokerUser::setDataRankingFromExpirationTime($expiration);
	}*/
});

/**
 * Evalua si nuevas operaciones si existen en la base de datos y se asigna el id de broker
 */
Route::get('/evaluate-option-opened/{active}/{expiration}/{dir}/{broker_id}', function ($active, $expiration, $dir, $broker_id) {
	
	$copy = CopiedBinaryOption::select('copied_binary_options.*')->join('binary_options', 'copied_binary_options.binary_option_id', '=', 'binary_options.id')	
	->where('active_id', $active)
	->where('expiration_time', $expiration)
	->where('direction', $dir)
	//->where('sent', 1)
	->whereNull('copied_binary_options.broker_id')
	->whereNull('copied_binary_options.result')
	->first();

	if($copy){
		$copy->broker_id = $broker_id;
		$copy->save();
	}
});


/**
 * Evalua si una operación que ha cerrado existe en labase de datos
 * y se actualiza el resultado
 */
Route::get('/evaluate-option-closed/{broker_id}/{result}', function ($broker_id, $result) {
	
	$copy = CopiedBinaryOption::select('copied_binary_options.*')->join('binary_options', 'copied_binary_options.binary_option_id', '=', 'binary_options.id')	
	->where('copied_binary_options.broker_id', $broker_id)
	//->where('sent', 1)
	->whereNotNull('copied_binary_options.broker_id')
	->whereNull('copied_binary_options.result')
	->first();

	if($copy){
		$copy->result = $result;
		$copy->save();

		$option = $copy->binaryOption;

		if($option->result != $copy->result){
			/*$option->result = $result;
			$option->save();*/

			$user = $option->brokerUser;
			$user->setDataRanking(7, 15);
            $user->save();
		}
	}
});

Route::get('/ranking/{type}/{length?}', function ($type, $length = 1) {
	switch ($type) {
		case 'percentage':
			$data = DB::select('select broker_id as user_id, avg * 0.75 as avg, performance, operations ranking_operations, hit_percentage from ranking_percentage');
			$data_return = [];
			$pos = 1;
			foreach ($data as $d) {
				$d->pos = $pos;
				$data_return[$d->user_id] = $d;
				$pos++;
			}
			return $data_return;

		case 'performance':
			$data = DB::select('select broker_id as user_id, avg * 0.75 as avg, performance, operations as ranking_operations, hit_percentage from ranking_performance');
			$data_return = [];
			$pos = 1;
			foreach ($data as $d) {
				$d->pos = $pos;
				$data_return[$d->user_id] = $d;
				$pos++;
			}
			return $data_return;
		case 'best-users-copied':
			$data = DB::select('select broker_id as user_id, min_amount as avg, operations as ranking_operations, hit_percentage from best_users_copied');

			$data_return = [];
			foreach ($data as $d) {
				$data_return[$d->user_id] = $d;
			}
			return $data_return;
		case 'best-users':
			$data = DB::select('select broker_id as user_id, operations as ranking_operations, hit_percentage from best_users');

			$data_return = [];
			foreach ($data as $d) {
				$data_return[$d->user_id] = $d;
			}
			return $data_return;
		default:
			break;
	}

	return [];
});
