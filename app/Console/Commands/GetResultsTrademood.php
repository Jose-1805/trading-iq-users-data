<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GetResultsTrademood extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trademood:results {--start=} {--end=} {--only-day=} {--print-data=} {--import=} {--from=*} {--actives=*} {--print-operations} {--print-day-results} {--use-best-users-settings}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Obtiene e imprime los resultados obtenidos por trademood de acuerdo a la configuración de cada divisa';

    protected $start_time = '18:00';
    protected $end_time = '16:00';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //Se determina la fecha de inicio para evaluar
        if($this->option('start')){
            $start = date('Y-m-d', strtotime($this->option('start'))).' '.$this->start_time;
        }else{
            $start = date('Y-m-d', strtotime('-1day')).' '.$this->start_time;
        }

        //Se determina la fecha fin para evaluar
        if($this->option('end')){
            $end = date('Y-m-d', strtotime($this->option('end'))).' '.$this->end_time;
        }else{
            $end =  date('Y-m-d', strtotime('+2 day')).' '.$this->end_time;
        }

        $start_time = strtotime($start);
        $end_time = strtotime($end);

        //Si la fecha de inicio es mayor a la final
        //se restan días a la fecha de inicio hasta que sea menor a la de fin
        while ($start_time > $end_time) {
            $start = date('Y-m-d H:i', strtotime('-1day '.$start));
            $start_time = strtotime($start);
        }

        $continue = true;
        $new_start = $start;
        $new_end = date('Y-m-d', strtotime('+1day '.$start)).' '.$this->end_time;

        //Se inicia un día antes de las fecha de inicio 
        //para realizar el incremento en cada ciclo del siguiete WHILE
        $new_start = date('Y-m-d H:i', strtotime('-1day '.$new_start));
        $new_end = date('Y-m-d H:i', strtotime('-1day '.$new_end));
        $data_operations = [];
        while ($continue) {
            $new_start = date('Y-m-d H:i', strtotime('+1day '.$new_start));
            $new_end = date('Y-m-d H:i', strtotime('+1day '.$new_end));

            //NO se debe consultar fechas superiores $end 
            if(strtotime($new_end) > $end_time){
                $continue = false;
            }else{
                $day = date('N', strtotime($new_start));
                $start_query = true;

                if($this->option('only-day')){
                    if($day != $this->option('only-day'))
                        $start_query = false;
                }

                if($start_query){
                    $current_day_operations = [];
                    foreach ($this->option("actives") as $active_id) {
                        foreach ($this->option("from") as $from) {
                            $current_day_operations = array_merge($current_day_operations, $this->getOperations($active_id, $from, $new_start, $new_end));
                        }   
                    }
                    $data_operations[$new_start] = $current_day_operations;
                }
            }
        }
        $full_win = 0;
        $full_lose = 0;
        $full_operations = 0;
        $full_utility = 0;
        foreach ($data_operations as $start_operations => $operations) {
            if(count($operations)){
                $operations = collect($operations);
                $operations = $operations->sortBy('opened');
                if($this->option('print-day-results') || $this->option('print-operations')){
                    $this->info("");
                    $this->info("");
                    $this->info("************* $start_operations *************");
                    $this->info("");
                }
                $win = 0;
                $lose = 0;
                $utility = 0;

                $profit_value_martingale = 0;
                $operations_martingale = 0;
                $current_amount_martingale = $this->option('import');
                $attemps_martingale = 0;
                $last_expired_martingale = 0;
                $lose_martingale = 0;

                foreach ($operations as $op) {                    
                    $text = $op->from." - ";
                    $text .= $op->full_percentages && $op->more_operations?'*****':($op->full_percentages?'**':($op->more_operations?'***':''));
                    $increase = $op->full_percentages && $op->more_operations?4:($op->full_percentages?2:($op->more_operations?3:1));
                    $increase = 1;
                    $text .= "($op->active_id) $op->opened --> $op->expired | $op->seconds_to_expired sec | $op->profit% | \$".$op->profit_value_original*$increase." | \$".$op->profit_value_other*$increase." | $op->tm_operations_original | $op->tm_operations_other | $op->tm_op_percentage_original% | $op->tm_op_percentage_other% | $op->tm_am_percentage_original% | $op->tm_am_percentage_other%";
                    if($this->option('print-operations'))$this->info($text." --- ".$op->id_original." ----- ".$op->id_other." ----- ".$op->expiration_time." -- LO ".$op->level_open." -- LC ".$op->level_close." -- LOO ".$op->level_open_other." -- LCO ".$op->level_close_other." --- ".$op->operations);

                    if($op->res_calc_other == 1)$win++;
                    if($op->res_calc_other == -1)$lose++;
                    $utility += $op->profit_value_other;

                    //La operación sirve para martingale
                    if($last_expired_martingale < $op->opening_time){
                        $last_expired_martingale = $op->expiration_time;
                        if($op->res_calc_other == 1){
                            $operations_martingale++;
                            $profit_value_martingale += ($current_amount_martingale * $op->profit)/100;

                            $current_amount_martingale = $this->option('import');
                            $attemps_martingale = 0;
                        }else if($op->res_calc_other == -1){
                            $operations_martingale++;
                            $attemps_martingale++;
                            $profit_value_martingale -= $current_amount_martingale;
                            if($attemps_martingale == 3){
                                $current_amount_martingale = $this->option('import');
                                $attemps_martingale = 0;
                                $lose_martingale++;
                            }else{
                                $current_amount_martingale *= 2.25;
                            }
                        }
                    }
                }

                $full_win += $win;
                $full_lose += $lose;
                $full_operations += $operations->count();
                $full_utility += $utility;

                if($this->option('print-day-results')){
                    $this->info("");

                    $this->info("---- ".$operations->count()." OPERACIONES");
                    $this->info("---- $win GANADAS - $lose PERDIDAS");
                    $hit_percentage = 0;
                    if(($win + $lose) > 0)
                        $hit_percentage = ($win * 100)/($win + $lose);
                    $hit_percentage = number_format($hit_percentage, 2);
                    $this->info("---- $hit_percentage% DE ACIERTO");
                    $this->info("---- \$$utility UTILIDAD");

                    $this->info("");
                    $this->info("MARTINGALE ***********");
                    $this->info("---- OPERACIONES $operations_martingale");
                    $this->info("---- UTILIDAD \$$profit_value_martingale");
                    $this->info("---- TOPES ALCANZADOS: $lose_martingale");
                }
            }
        }

        $this->info("");
        $this->info("");
        $this->info("*************************************");
        $this->info("************ CONSOLIDADO ************");
        $this->info("*************************************");

        $this->info("**** ".$full_operations." OPERACIONES");
        $this->info("**** $full_win GANADAS - $full_lose PERDIDAS");
        $full_hit_percentage = 0;
        if(($full_win + $full_lose) > 0)
            $full_hit_percentage = ($full_win * 100)/($full_win + $full_lose);
        $full_hit_percentage = number_format($full_hit_percentage, 2);
        $this->info("**** $full_hit_percentage% DE ACIERTO");
        $this->info("**** \$$full_utility UTILIDAD");
    }

    /**
     * Consulta los resultados de un activo
     * con una estrategía determinada
     * @param  [type] $active [Identificador del activo]
     * @param  [type] $from   [estrategia a consultar]
     */
    public function getOperations($active_id, $from, $start, $end)
    {
        $settings = $this->getActiveSettings($active_id, date('N', strtotime($start)));

        if($settings){

            $trademood_settings = $settings->trademood_settings;

            if($settings->use_general_settings->$from){
                $trademood_settings = $settings->trademood_settings_general;
            }

            $copy = "copy_from_";

            if($from == 'percentage' || $from == 'performance'){
                $copy .= "ranking_";
            }

            $copy .= $from;

            if($settings->$copy){
                $from_argument = "";

                if($from == 'best_users'){
                    $from_argument = "AND c_b_o.from_$from = 1 AND c_b_o.operations >= ".$settings->min_operations_best_users;
                }else{
                    $from_argument = "AND c_b_o.from_$from = 1 ";
                }

                $condition_full_percentage = "";

                //Si se requiere full_percentages
                if($settings->copy_trademood_full_percentages->$from){
                    $condition_full_percentage = "
                        AND (
                                IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) = 100
                                AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) = 100
                            )
                    ";
                }

                $condition_confirmation_operations = "
                    AND b_o_3.id >= b_o_1.id
                ";

                //Si se requiere full_percentages
                if($settings->copy_trademood_confirmation_operations->$from){
                    $condition_confirmation_operations = "
                        AND (
                            b_o_3.id > b_o_1.id
                            AND IF(b_o_1.direction = 1, b_o_1.operations_up, b_o_1.operations_down) < IF(b_o_1.direction = 1, b_o_3.operations_up, b_o_3.operations_down)
                        )
                    ";
                }

                $sql_operations = "
                    SELECT /*SUM(profit_value_other), count(*)*/* FROM (
                        SELECT * FROM (
                            SELECT 
                                b_o_1.id as id_original,
                                b_o_2.id as id_other,
                                b_o_2.opening_time,
                                b_o_2.expiration_time,
                                FROM_UNIXTIME(
                                    CAST(
                                        b_o_2.opening_time / 1000 AS INT
                                    )
                                ) AS opened_other,
                                FROM_UNIXTIME(
                                    CAST(
                                        b_o_1.opening_time / 1000 AS INT
                                    )
                                ) AS opened,
                                FROM_UNIXTIME(
                                    CAST(
                                        b_o_1.expiration_time / 1000 AS INT
                                    )
                                ) AS expired,
                                (b_o_2.expiration_time - b_o_2.opening_time)/1000 as seconds_to_expired,
                                b_o_1.active_id,
                                b_o_1.level_open,
                                b_o_1.level_close,
                                b_o_2.level_open as level_open_other,
                                b_o_2.level_close as level_close_other,
                                b_o_1.direction,
                                b_o_1.amount,
                                c_b_o.profit,

                                c_b_o.result as res_real,
                                b_o_1.result as res_calc_original,
                                b_o_2.result as res_calc_other,
                            
                                IF(b_o_1.result = 1,(".$this->option('import')."*c_b_o.profit/100),(IF(b_o_1.result = -1,-1,0))) as profit_value_original,
                                IF(b_o_2.result = 1,(".$this->option('import')."*c_b_o.profit/100),(IF(b_o_2.result = -1,-1,0))) as profit_value_other,
                            
                                (b_o_1.operations_up + b_o_1.operations_down) as tm_operations_original,
                                (b_o_2.operations_up + b_o_2.operations_down) as tm_operations_other, 

                                IF(b_o_1.direction = 1, b_o_1.operations_up, b_o_1.operations_down) as tm_dir_operations_original,
                                IF(b_o_1.direction = 1, b_o_2.operations_up, b_o_2.operations_down) as tm_dir_operations_other,
                            
                                IFNULL(((IF(b_o_1.direction = 1, b_o_1.operations_up, b_o_1.operations_down) * 100)/(b_o_1.operations_up + b_o_1.operations_down)),0) as tm_op_percentage_original,
                                IFNULL(((IF(b_o_2.direction = 1, b_o_2.operations_up, b_o_2.operations_down) * 100)/(b_o_2.operations_up + b_o_2.operations_down)),0) as tm_op_percentage_other,
                            
                                (b_o_1.amount_up + b_o_1.amount_down) as tm_amount_original,
                                (b_o_2.amount_up + b_o_2.amount_down) as tm_amount_other,
                            
                                IFNULL(((IF(b_o_1.direction = 1, b_o_1.amount_up, b_o_1.amount_down) * 100)/(b_o_1.amount_up + b_o_1.amount_down)),0) as tm_am_percentage_original,
                                IFNULL(((IF(b_o_2.direction = 1, b_o_2.amount_up, b_o_2.amount_down) * 100)/(b_o_2.amount_up + b_o_2.amount_down)),0) as tm_am_percentage_other,

                                c_b_o.from_percentage,
                                c_b_o.from_performance,
                                c_b_o.from_best_users,
                                c_b_o.from_best_users_copied,
                                c_b_o.operations,
                                c_b_o.avg

                            FROM copied_binary_options c_b_o
                            INNER JOIN binary_options b_o_1 ON c_b_o.binary_option_id = b_o_1.id AND b_o_1.active_id = $active_id 
                            INNER JOIN 
                                binary_options b_o_2 
                            ON b_o_2.id = (
                                SELECT b_o_3.id FROM binary_options b_o_3
                                WHERE b_o_3.expiration_time = b_o_1.expiration_time 
                                AND b_o_3.active_id = b_o_1.active_id
                                AND b_o_3.direction = b_o_1.direction
                                AND b_o_3.opening_time >= b_o_1.opening_time
                                AND (
                                    (b_o_3.direction = 1 AND b_o_3.level_open <= b_o_1.level_open)
                                    OR (b_o_3.direction = -1 AND b_o_3.level_open >= b_o_1.level_open)
                                )
                                AND (
                                    (b_o_3.operations_up + b_o_3.operations_down) >= $trademood_settings->min_operations
                                    AND (b_o_3.operations_up + b_o_3.operations_down) <= $trademood_settings->max_operations
                                    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= $trademood_settings->min_percentage_operations
                                    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= $trademood_settings->min_percentage_amount
                                )
                                $condition_confirmation_operations
                                $condition_full_percentage
                                AND minute(
                                    FROM_UNIXTIME(
                                                CAST(
                                                    b_o_3.opening_time / 1000 AS INT
                                                )
                                            )
                                ) = minute (
                                    FROM_UNIXTIME(
                                                CAST(
                                                    b_o_1.opening_time / 1000 AS INT
                                                )
                                            )
                                )
                                ORDER BY b_o_3.id ASC
                                LIMIT 1
                            )
                            WHERE 
                                b_o_1.opening_time >= UNIX_TIMESTAMP(STR_TO_DATE('$start', '%Y-%m-%d %H:%i')) * 1000 
                                AND b_o_1.opening_time <= UNIX_TIMESTAMP(STR_TO_DATE('$end', '%Y-%m-%d %H:%i')) * 1000
                                $from_argument
                                AND (
                                    b_o_1.active_id = $active_id
                                    AND c_b_o.profit <= ".(100-$trademood_settings->min_commission_broker)
                                    ." AND c_b_o.profit >= ".(100-$trademood_settings->max_commission_broker)
                                .")
                            ORDER BY b_o_1.opening_time DESC
                        ) results GROUP BY expired, active_id ORDER BY opened DESC
                    ) res WHERE (
                        active_id = $active_id
                        AND tm_operations_original >= $trademood_settings->min_operations_pending
                        AND tm_op_percentage_original >= $trademood_settings->min_percentage_operations_pending 
                        AND tm_am_percentage_original >= $trademood_settings->min_percentage_amount_pending 
                    )
                ";

                //$this->info($sql_operations);
                $operations = DB::select($sql_operations);

                
                if(count($operations)){
                    //Variable para reordenar los resultados
                    $operations_aux = [];
                    //Se reordenan los resultados
                    for ($i = count($operations)-1; $i >= 0; $i--) {
                        $operations_aux[] = $operations[$i];
                    }

                    $operations = $operations_aux;
                    $filtered_operations =  [];

                    foreach ($operations as $operation) {
                        $hour = (int) date('H', strtotime($operation->opened));
                        
                        if(
                            (
                                //La configuración de la estrategía no aplica horas
                                !$settings->apply_hours->$from
                                //La configuración de la estrategía aplica horas
                                //y la hora de la operación está habilitada
                                || array_key_exists($hour, (array)$settings->hours->$from) 
                            )
                            && (
                                //Para best_users no se requiere nada más
                                $from == "best_users"
                                //Para las demás estrategias se requiere importes
                                //mayores al promedio
                                || (
                                    $from != "best_users"
                                    && $operation->avg <= $operation->amount
                                )
                            )
                        ){
                            //La operación siempre tuvo 100% en trademood
                            $full_percentages = ($operation->tm_op_percentage_original == 100 && $operation->tm_op_percentage_other == 100 && $operation->tm_am_percentage_original == 100 && $operation->tm_am_percentage_other == 100)?true:false;
                            //La operación quedó pendiente por trademood pero las situación mejoró y se copió
                            $more_operations = ($operation->tm_operations_other > $operation->tm_operations_original);
                            if( 
                                //si no se requiere full percentage o se requiere y la operación pasa dicha validación
                                (
                                    !$settings->copy_trademood_full_percentages->$from
                                    || ($full_percentages || $more_operations)
                                )
                                //Si se requiere operaciones con entradas en buenos segundos
                                && (
                                    !$settings->copy_only_good_seconds->$from
                                    || ($operation->seconds_to_expired <= 200 && $operation->seconds_to_expired >= 62)
                                )
                            ){
                                $operation->from = $from;
                                $operation->full_percentages = $full_percentages;
                                $operation->more_operations = $more_operations;
                                $filtered_operations[] = $operation;
                            }
                        }
                    }

                    return $filtered_operations;
                }
            }
        }
        return [];
    }

    /**
     * Retorna la configuración establecida para un activo
     * @param  [type] $active_id [Activo a consultar]
     */
    public function getActiveSettings($active_id, $day){
        $folder = "";

        if($this->option('use-best-users-settings'))$folder = "/best_users";

        $path_file = base_path("app/Console/Commands$folder/active_settings_day_$day/active_".$active_id."_settings.json");
        if(file_exists($path_file)){
            $string = file_get_contents($path_file);
            $active_settings = json_decode($string);
            return $active_settings;
        }
    }
}
