<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class BrokerUser_ extends Model
{
    protected $table = 'broker_users';

    protected $fillable = [
        'name',
        'broker_id',
        'country_id'
    ];

    public function binaryOptions()
    {
    	return $this->hasMany(BinaryOption::class);
    }   

    /**
     * Asigna los datos para los ranking segun los resultados del usuario
     * @param integer $max_length_performance [description]
     * @param integer $max_length_percentage  [description]
     */
    public function setDataRankingPerformancePercentage($max_length_performance = 7, $max_length_percentage = 15)
    {
        $binary_options_performance = collect(DB::select("SELECT amount, result FROM binary_options WHERE result IS NOT NULL AND broker_user_id = ? GROUP BY broker_user_id, expiration_time, active_id ORDER BY id DESC LIMIT ?", [$this->id, $max_length_performance]));
        $binary_options_percentage = collect(DB::select("SELECT amount, result FROM binary_options WHERE result IS NOT NULL AND broker_user_id = ? GROUP BY broker_user_id, expiration_time, active_id ORDER BY id DESC LIMIT ?", [$this->id, $max_length_percentage]));

        $this['performance_1'] = $binary_options_performance->sum(function($item){
            return $item->amount * $item->result;
        });

        $this['performance_2'] = $binary_options_percentage->sum(function($item){
            return $item->amount * $item->result;
        });

        $this['avg_amount_1'] = $binary_options_performance->avg('amount');
        $this['avg_amount_2'] = $binary_options_percentage->avg('amount');

        $this['operations_1'] = $binary_options_performance->count();
        $this['operations_2'] = $binary_options_percentage->count();

        if($this['operations_1'] == 0){
            $this['hit_percentage_1'] = 0;
        }else{
            $this['hit_percentage_1'] = ($binary_options_performance->where('result', 1)->count() * 100)/$this['operations_1'];
        }

        if($this['operations_2'] == 0){
            $this['hit_percentage_2'] = 0;
        }else{
            $this['hit_percentage_2'] = ($binary_options_percentage->where('result', 1)->count() * 100)/$this['operations_2'];
        }
    }

    /**
     * Calcula el rendimiento de las operaciones de un usuario
     * @param integer $length [Cantidad máxima de operaciones para calcular el rendimiento]
     * @param integer $type   [Determina donde ubicar el valor del rendimiento calculado]
     */
    public function setPerformance($max_length = 1, $type = 1){
        $this['performance_'.$type] = DB::select("SELECT SUM(t.amount * t.result) as performance FROM (SELECT amount, result FROM binary_options WHERE enabled = 1 AND result IS NOT NULL AND broker_user_id = ? GROUP BY broker_user_id, expiration_time, active_id ORDER BY id DESC LIMIT ?) as t", [$this->id, $max_length])[0]->performance;
    }

    /**
     * Calcula el valor promedio de entrada de las operaciones de un usuario
     * @param integer $length [Cantidad máxima de operaciones para calcular el promedio]
     * @param integer $type   [Determina donde ubicar el valor calculado]
     */
    public function setAvgAmount($max_length = 1, $type = 1){
        $this['avg_amount_'.$type] = DB::select("SELECT AVG(t.amount) as avg_amount FROM (SELECT amount FROM binary_options WHERE enabled = 1 AND result IS NOT NULL AND broker_user_id = ? GROUP BY broker_user_id, expiration_time, active_id ORDER BY id DESC LIMIT ?) as t", [$this->id, $max_length])[0]->avg_amount;
    }

    /**
     * Calcula la cantidad de operaciones que tiene el usuario para el limite máximo enviado
     * @param integer $length [Cantidad máxima de operaciones que se pueden contar]
     * @param integer $type   [Determina donde ubicar el valor calculado]
     */
    public function setOperations($max_length = 1, $type = 1){
        $this['operations_'.$type] = DB::select("SELECT COUNT(t.id) as operations FROM (SELECT id FROM binary_options WHERE enabled = 1 AND result IS NOT NULL AND broker_user_id = ? GROUP BY broker_user_id, expiration_time, active_id ORDER BY id DESC LIMIT ?) as t", [$this->id, $max_length])[0]->operations;
    }

    /**
     * Calcula el porcentaje de acierto en las ultimas $max_length operaciones realizadas por el usuario
     * @param integer $length [Cantidad máxima de operaciones que se pueden contar]
     * @param integer $type   [Determina donde ubicar el valor calculado]
     */
    public function setHitPercentage($max_length = 1, $type = 1){
        $this->setOperations($max_length, $type);

        if($this['operations_'.$type] == 0){
            $this['hit_percentage_'.$type] = 0;
        }else{
            $win = DB::select("SELECT count(result) as win FROM (SELECT t.result FROM (SELECT result FROM binary_options WHERE enabled = 1 AND result IS NOT NULL AND broker_user_id = ? GROUP BY broker_user_id, expiration_time, active_id ORDER BY id DESC LIMIT ?) as t) as t_ WHERE result = 1", [$this->id, $max_length])[0]->win;

            $this['hit_percentage_'.$type] = ($win * 100)/$this['operations_'.$type];
        }
    }

    /**
     * Asigna el total de operaciones y el porcentaje de acierto del usuario
     */
    public function setFullDataOperations()
    {
        $operations = collect(DB::select("SELECT result FROM binary_options WHERE result IS NOT NULL AND broker_user_id = ? GROUP BY broker_user_id, expiration_time, active_id ORDER BY id DESC", [$this->id]));
        $this['operations'] = $operations->count();

        if($this['operations'] == 0){
            $this['hit_percentage'] = 0;
        }else{
            $win = $operations->where('result', 1)->count();

            $this['hit_percentage'] = ($win * 100)/$this['operations'];
        }
    }

    /**
     * Calcula la cantidad de operaciones que tiene el usuario
     */
    public function setFullOperations(){
        $this['operations'] = DB::select("SELECT COUNT(t.id) as operations FROM (SELECT id FROM binary_options WHERE result IS NOT NULL AND broker_user_id = ? GROUP BY broker_user_id, expiration_time, active_id) as t", [$this->id])[0]->operations;
    }

    /**
     * Calcula el porcentaje de acierto en las ultimas $max_length operaciones realizadas por el usuario
     * @param integer $length [Cantidad máxima de operaciones que se pueden contar]
     * @param integer $type   [Determina donde ubicar el valor calculado]
     */
    public function setFullHitPercentage(){
        $this->setFullOperations();

        if($this['operations'] == 0){
            $this['hit_percentage'] = 0;
        }else{
            $win = DB::select("SELECT count(result) as win FROM (SELECT t.result FROM (SELECT result FROM binary_options WHERE result IS NOT NULL AND broker_user_id = ? GROUP BY broker_user_id, expiration_time, active_id ORDER BY id DESC) as t) as t_ WHERE result = 1", [$this->id])[0]->win;

            $this['hit_percentage'] = ($win * 100)/$this['operations'];
        }
    }

    /**
     * Asigna los resultados de las copias de un usuario
     */
    public function setDataCopies()
    {
        $operations = collect(DB::select("SELECT b_o.result, b_o.amount FROM copied_binary_options c_b_o INNER JOIN binary_options b_o ON c_b_o.binary_option_id = b_o.id WHERE b_o.result IS NOT NULL AND b_o.broker_user_id = ?", [$this->id]));
        if($operations->count()){
            $this['copied_operations'] = $operations->count();
            $this['copies_win'] = $operations->where('result', 1)->count();
            $this['copies_loose'] = $operations->where('result', -1)->count();
            $this['copies_equal'] = $operations->where('result', 0)->count();
            $this['copies_min_amount'] = $operations->min('amount');
            $this['copies_hit_percentage'] = ($this['copies_win'] * 100)/$this['copied_operations'];
        }
    }

    /**
     * Calcula los valores necesarios para entrar en los rankings del sistema
     * @param integer $max_length_performance [Cantidad máxima de registros para analisis de ranking de rendimiento]
     * @param integer $max_length_percentage [Cantidad máxima de registros para analisis de ranking de porcentaje]
     */
    public function setDataRanking($max_length_performance = 7, $max_length_percentage = 15)
    {   
        //Datos de ranking
        $this->setDataRankingPerformancePercentage($max_length_performance, $max_length_percentage);
        
        //Datos de ranking de rendimiento
        //$this->setPerformance($max_length_performance, 1);
        //$this->setAvgAmount($max_length_performance, 1);
        //$this->setHitPercentage($max_length_performance, 1);

        //Datos de ranking de porcentaje
        //$this->setPerformance($max_length_percentage, 2);
        //$this->setAvgAmount($max_length_percentage, 2);
        //$this->setHitPercentage($max_length_percentage, 2);

        //$this->setFullHitPercentage();
        
        //Datos de operaciones y aciertos totales
        $this->setFullDataOperations();

        //Resultados de las copias hechas al usuario
        $this->setDataCopies();
    }

    /**
     * Asigna los valores para los ranking de los usuarios que tengan operacines
     * que cierran en la fecha de expuración enviada
     */
    public static function setDataRankingFromExpirationTime($expiration)
    {
        //Se consulta cada usuario que tiene un operación que cerró en el minuto actual
        /*$users = BrokerUser::select('broker_users.id')
        ->join('binary_options', 'broker_users.id', '=', 'binary_options.broker_user_id')
        ->where('binary_options.expiration_time', $expiration)
        ->groupBy('binary_options.broker_user_id')
        ->get();*/

        $users = BrokerUser::select('id')
        //->whereRaw("id IN (SELECT broker_user_id FROM binary_options WHERE expiration_time IN $expiration)")->get();
        ->whereRaw("id IN (SELECT broker_user_id FROM binary_options WHERE expiration_time = $expiration)")->get();
        
        //Se asignan los valores para los ranking
        //7 para ranking de rendimiento
        //y 15 para ranking de porcentaje de acierto
        foreach ($users as $user) {
            $user->setDataRanking(7, 15);
            $user->save();
        }
    }

    /**
     * Actualiza los datos de ranking de las ultimas N expiraciones registradas
     */
    public static function op($limit = 1)
    {
        $binary_options = BinaryOption::select('binary_options.expiration_time')
        ->orderBy('id', 'DESC')
        ->groupBy('expiration_time')
        ->limit($limit)
        ->get();

        foreach ($binary_options as $b) {
            BrokerUser::setDataRankingFromExpirationTime($b->expiration_time);
        }
    }

    /**
     * Actualiza las operaciones de acuerdo al resultado de la copia
     * y se calculan los datos de ranking nuevamente
     */
    public static function updateFromCopies()
    {
        $copies = CopiedBinaryOption::whereNotNull('result')->get();
        echo date('Y-m-d H:i:s').' ***** ';
        echo $copies->count().' Copias con resultado encontradas.';
        $i = 0;
        foreach ($copies as $copy) {
            $option = $copy->binaryOption;

            if($option->result != $copy->result){
                $i++;
                $option->result = $copy->result;
                $option->save();

                $user = $option->brokerUser;
                $user->setDataRanking(7, 15);
                $user->save();
            }
        }
        echo ' ***** '.$i.' Copias con resultado diferente a la operación.';
        echo ' ***** '.date('Y-m-d H:i:s');
    }

    /**
     * Calcula los valores necesarios para entrar en los rankings del sistema para todos los usuarios
      * @param integer $max_length_performance [Cantidad máxima de registros para analisis de ranking de rendimiento]
      * @param integer $max_length_percentage [Cantidad máxima de registros para analisis de ranking de porcentaje]
     */
    public static function setDataRankingAllUsers($max_length_performance = 7, $max_length_percentage = 15)
    {
        echo "Iniciando...";
        echo "\nInicio: ".date('Y-m-d H:i:s');
        $users = BrokerUser::all();
        $total = $users->count();
        echo "\nUsuarios: $total";
        $complete = 0;
        $print_percentage = 0;
        //$users = BrokerUser::select('broker_users.*')->join('binary_options', 'broker_users.id', '=', 'binary_options.broker_user_id')->join('copied_binary_options', 'binary_options.id', '=', 'copied_binary_options.binary_option_id')->groupBy('broker_users.id')->get();
        
        echo "\nProgreso: ";
        
        foreach ($users as $user) {
            $user->setDataRanking($max_length_performance, $max_length_percentage);
            $user->save();
            $complete++;
            $current_percentage = ($complete * 100)/$total;

            if(($print_percentage * 10) < $current_percentage){
                echo (int) $current_percentage."% * ";
                $print_percentage += 0.5;
            }
        }
        echo "100% **";
        echo "\nFin: ".date('Y-m-d H:i:s');
    }

    public static function removeDuplicates()
    {
        echo 'Iniciando...';
        echo 'Inicio: '.date('Y-m-d H:i:s');
        $users = BrokerUser::all();
        $counter = 0;

        foreach ($users as $user) {
            $operations = $user->binaryOptions()->orderBy('id', 'asc')->get();
            $last_expiration = 0;
            $ids_remove = [];

            foreach ($operations as $operation) {
                if($operation->expiration_time == $last_expiration){
                  $ids_remove[] = $operation->id;
                  $counter++;
                }
                $last_expiration = $operation->expiration_time;
            }

            BinaryOption::whereIn('id', $ids_remove)->delete();
        }

        echo $counter.' operaciones eliminadas';


        echo 'Fin: '.date('Y-m-d H:i:s');
    }
}
