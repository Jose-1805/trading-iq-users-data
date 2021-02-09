<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class BestHours extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'best-hours {start} {from} {active}';
    protected $start_time = '18:00';
    protected $end_time = '16:00';

    /*protected $queries_per_day = [
        'all' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg * 2 <= amount AND oper > 8 AND hit_perc <= 90 AND amount <= 50 AND perfor >= 30) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg * 2 <= amount AND oper > 8 AND hit_perc <= 93 AND amount <= 50 AND perfor >= 50) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg * 2 <= amount AND oper > 8 AND hit_perc <= 93 AND amount <= 20 AND perfor >= 30) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg * 2.5 <= amount AND oper > 8 AND hit_perc <= 100 AND perfor >= 90) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg * 3 <= amount AND oper > 8 AND hit_perc >= 90 AND perfor >= 30) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
        ],
        'percentage' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg * 2 <= amount AND oper > 8 AND hit_perc <= 90 AND amount <= 50 AND perfor >= 30 AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg * 2 <= amount AND oper > 8 AND hit_perc <= 93 AND amount <= 50 AND perfor >= 50 AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg * 2 <= amount AND oper > 8 AND hit_perc <= 93 AND amount <= 20 AND perfor >= 30 AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg * 2.5 <= amount AND oper > 8 AND hit_perc <= 100 AND perfor >= 90 AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg * 3 <= amount AND oper > 8 AND hit_perc >= 90 AND perfor >= 30 AND seconds_to_expired > 31 AND sent <> 10',
        ], 
        'performance' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
        ],
        'best_users' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
        ],
        'best_users_copied' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
        ]
    ];*/

    protected $queries_per_day = [
        'all' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10',
        ],
        'percentage' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
        ], 
        'performance' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
        ],
        'best_users' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10',
        ],
        'best_users_copied' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10',
        ]
    ];

    //Horas que deben ser evaluadas
    protected $hours = [
        23 => true,
        0 => true,
        1 => true,
        2 => true,
        3 => true,
        4 => true,
        5 => true,
        6 => true,
        7 => true,
        8 => true,
        9 => true,
        10 => true,
        11 => true,
        12 => true,
        13 => true
    ];

    protected $days = [
        7 => true,
        1 => true,
        2 => true,
        3 => true,
        4 => true,
        5 => true,
        6 => true,
    ];

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Determina cuales son las mejores horas de inversión para un día determinado';

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
        $this->info("Calculando ...");

        $global_result = [];

        foreach ($this->days as $day => $value) {

            $start = date('Y-m-d', strtotime($this->argument('start'))).' '.$this->start_time;

            $continue = true;

            $results = [];

            while ($continue) {
                //El día es el solicitado
                if(date('N', strtotime($start)) == $day){
                    $end = date('Y-m-d', strtotime('+1day '.$start)).' '.$this->end_time;

                    $operations = DB::select($this->queries_per_day[$this->argument('from')][$day].' AND active_id = ?', [$start, $end, $this->argument('active')]);

                    if(count($operations)){
                        $results[] = collect($operations);
                    }
                }else{
                    //Se suepura o alcanza la fecha actual
                    if(strtotime($start) >= strtotime(date('Y-m-d H:i:s'))){
                        $continue = false;
                    }
                }

                $start = date('Y-m-d H:i:s', strtotime('+1day '.$start));
            }

            $best_hours = [];

            foreach ($this->hours as $hour => $value) {
                //En cada item de este array se almacenan los grupos de 
                //operaciones que se realziaron en cada día en la hora actual
                $results_for_hour = [];

                //Se recorre cada grupo de operaciones
                foreach ($results as $operations) {
                    $results_for_hour[] = $operations->map(function($operation) use ($hour){
                        //SI la operación se abrió en la hora que va en el ciclo
                        if((int) date('H', strtotime($operation->open)) == $hour){
                            //Se establece el mejor resultado
                            if($operation->res_calc == 1)
                                $operation->result_value = (1 * $operation->profit)/100;
                            else if($operation->res_calc == -1)
                                $operation->result_value = -1;
                            else $operation->result_value = 0;

                            return $operation;
                        }
                    });
                }

                $positive_days = 0;
                $negative_days = 0;

                foreach ($results_for_hour as $operations) {
                    $result_value = $operations->sum('result_value');

                    if($result_value > 0)
                        $positive_days++;
                    else if($result_value < 0)
                        $negative_days++;
                }

                if(
                    //No se encuentran días negativos pero si más de dos positivos
                    ($negative_days == 0 && $positive_days > 2)
                    //Si hay días negativos, los días positivos deben ser por lo menos tres veces los negativos
                    || ($negative_days > 0 && ($negative_days * 3) <= $positive_days)
                ){
                    $best_hours[$hour] = true;
                }
            }

            $global_result[$day] = $best_hours;
        }

        foreach ($global_result as $day => $hours) {
            $settings = $this->getActiveSettings($this->argument('active'), $day);
            if($settings){
                $from = $this->argument('from');
                $settings->hours->$from = $hours;
                $json_data = json_encode($settings);
                $json_data = str_replace("{","{\n", $json_data);
                $json_data = str_replace(",",",\n", $json_data);
                $json_data = str_replace("}","\n}", $json_data);
                file_put_contents('app/Console/Commands/active_settings_day_'.$day.'/active_'.$this->argument('active').'_settings.json', $json_data);
            }
        }

        $this->info('Mejores horas desde '.$this->argument('from').' para el activo '.$this->argument('active'));
        //dd($global_result);
    }

    /**
     * Retorna la configuración establecida para un activo
     * @param  [type] $active_id [Activo a consultar]
     */
    public function getActiveSettings($active_id, $day){
        $path_file = base_path("app/Console/Commands/active_settings_day_$day/active_".$active_id."_settings.json");
        if(file_exists($path_file)){
            $string = file_get_contents($path_file);
            $active_settings = json_decode($string);
            return $active_settings;
        }
    }
}