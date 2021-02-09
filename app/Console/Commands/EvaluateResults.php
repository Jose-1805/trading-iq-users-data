<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class EvaluateResults extends Command
{
    /**
     * The name AND signature of the console command.
     *
     * @var string
     */
    protected $signature = 'results:evaluate {--start=} {--end=} {--only-day=} {--except-day=*} {--apply-strategy=} {--print-date=} {--hour=} {--only-real-results=} {import} {from}';
    
    protected $queries_per_day = [
        'all' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND ((f_perce = 1 AND avg <= amount) OR f_b_u = 1 OR (f_perfor = 1 AND avg <= amount) OR (f_b_u_c = 1 AND avg <= amount)) AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
        ],
        'percentage' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
        ], 
        'performance' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
        ],
        'best_users' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1 AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
        ],
        'best_users_copied' => [
            7 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            1 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            2 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            3 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            4 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            5 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
            6 => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount AND seconds_to_expired > 31 AND sent <> 10 ORDER BY id ASC',
        ]
    ];

    protected $queries_per_day_without_strategy = [
        'all' => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND (f_b_u = 1 OR f_perce = 1 OR (f_perfor = 1 AND avg < amount) OR f_b_u_c = 1)',
        'percentage' => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perce = 1',
        'performance' => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_perfor = 1 AND avg < amount',
        'best_users' => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u = 1',
        'best_users_copied' => 'SELECT * FROM filtered_results WHERE expired > ? AND expired < ? AND f_b_u_c = 1 AND avg <= amount',
    ];

    protected $start_time = '18:00';
    protected $end_time = '16:00';

    protected $days = [
            0 => 'Do',
            1 => 'Lu',
            2 => 'Ma',
            3 => 'Mi',
            4 => 'Ju',
            5 => 'Vi',
            6 => 'Sa'
        ];

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evalua los resultados obtenidos';

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
            $end = date('Y-m-d').' '.$this->end_time;
        }

        $start_time = strtotime($start);
        $end_time = strtotime($end);

        while ($start_time > $end_time) {
            $start = date('Y-m-d H:i', strtotime('-1day '.$start));
            $start_time = strtotime($start);
        }

        $continue = true;
        $new_start = $start;
        $new_end = date('Y-m-d', strtotime('+1day '.$start)).' '.$this->end_time;

        $new_start = date('Y-m-d H:i', strtotime('-1day '.$new_start));
        $new_end = date('Y-m-d H:i', strtotime('-1day '.$new_end));

        $this->info(
            '                        ******************* EJECUCIÔN NORMAL *******************'
            .'   **************************** MARTINGALA ****************************'
            .'     ************* SEGUIDAS **************'
        );
        $this->info('');
        $normal = 0;
        $martingale = 0;
        $followed = 0;
        $days = 0;
        while ($continue) {
            $new_start = date('Y-m-d H:i', strtotime('+1day '.$new_start));
            $new_end = date('Y-m-d H:i', strtotime('+1day '.$new_end));            
            
            //NO se debe consultar fechas superiores $end 
            if(strtotime($new_end) > $end_time){
                $continue = false;
            }else{
                $print = true;

                if($this->option('only-day')){
                    if(date('N', strtotime($new_start)) != $this->option('only-day'))
                        $print = false;
                }

                if($this->option('except-day')){
                    for($i = 0; $i < count($this->option('except-day')); $i++){
                        if(date('N', strtotime($new_start)) == $this->option('except-day')[$i])
                            $print = false;       
                    }
                }

                if($print){
                    $utilities = $this->printInfoData($new_start, $new_end);            
                    if($utilities){
                        $normal += $utilities['normal'];
                        $martingale += $utilities['martingale'];
                        $followed += $utilities['followed'];
                        $days++;
                    }
                }
            }            
        }
        
        $this->info('');
        $this->info(
            '                                               UT: $'.number_format($normal, 2)
            .'                                                               UT: $'.number_format($martingale, 2)
            .'                                 UT: $'.number_format($followed, 2)
        );
        $this->info($days.' DÍAS');
    }

    public function printInfoData($start, $end)
    {      
        $operations = [];     
        $day = date('N', strtotime($start));
        
        //Strategy from percentage
        $hours_for_day_percentage = [
            7 => [
                11 => true,
                12 => true,
            ],
            1 => [
            ],
            2 => [
            ],
            3 => [
                4 => true,
            ],
            4 => [
                3 => true,
                9 => true,
            ],
            5 => [
            ],
            6 => [
            ]
        ];

        //Strategy from performance
        $hours_for_day_performance = [
            7 => [
                23 => true,
                8 => true,
            ],
            1 => [
                23 => true,
                0 => true,
                5 => true,
                7 => true,
            ],
            2 => [            
                1 => true,
                11 => true,
            ],
            3 => [
                4 => true,                
                6 => true,
                13 => true,
            ],
            4 => [
                12 => true,
            ],
            5 => [
            ],
            6 => [
            ]
        ];

        //Strategy from best users
        $hours_for_day_best_users = [
            7 => [
                23 => true,
                3 => true,
                7 => true,
                10 => true,
                12 => true,
            ],
            1 => [
            ],
            2 => [ 
                23 => true,
                7 => true,
            ],
            3 => [
                23 => true,
                9 => true,
                12 => true,
            ],
            4 => [
                10 => true,
                12 => true,
            ],
            5 => [
            ],
            6 => [
            ]
        ];

        //Strategy from best users copies
        $hours_for_day_best_users_copied = [
            7 => [
            ],
            1 => [
                3 => true,
                8 => true,
                9 => true,
                11 => true,
                13 => true,
            ],
            2 => [
                23 => true,
                5 => true,
                10 => true,
            ],
            3 => [
                13 => true,
            ],
            4 => [
                10 => true,
            ],
            5 => [
            ],
            6 => [
            ]
        ];

        $strategy_for_day = [
            7 => [
                'percentage' => true,
                'performance' => true,
                'best_users' => true,
                'best_users_copied' => true,
            ],
            1 => [
                'percentage' => true,
                'performance' => true,
                'best_users' => true,
                'best_users_copied' => true,
            ],
            2 => [
                'percentage' => true,
                'performance' => true,
                'best_users' => true,
                'best_users_copied' => true,
            ],
            3 => [
                'percentage' => true,
                'performance' => true,
                'best_users' => true,
                'best_users_copied' => true,
            ],
            4 => [
                'percentage' => true,
                'performance' => true,
                'best_users' => true,
                'best_users_copied' => true,
            ],
            5 => [
                'percentage' => true,
                'performance' => true,
                'best_users' => true,
                'best_users_copied' => true,
            ],
            6 => [
                'percentage' => true,
                'performance' => true,
                'best_users' => true,
                'best_users_copied' => true,
            ],
        ];

        if($this->option('apply-strategy') && strtolower($this->option('apply-strategy')) == 'yes'){
            if(array_key_exists($day, $this->queries_per_day[$this->argument('from')]))
                $operations = DB::select($this->queries_per_day[$this->argument('from')][$day], [$start, $end]);
        }else{
            $operations = DB::select($this->queries_per_day_without_strategy[$this->argument('from')], [$start, $end]);
        }

        if(count($operations)){
            $text = '('.count($operations).') *';

            while(strlen($text) < 6){
                $text .= '*';
            }

            $utility_normal = 0;
            $count_win = 0;
            $count_lose = 0;
            $count_equal = 0;
            $max_win = 0;
            $max_lose = 0;
            $last_operation_evaluate = null;

            foreach ($operations as $operation) {
                $hour = (int) date('H', strtotime($operation->open));
                /*if((int) date('d', strtotime($operation->expired)) == 22 && (int) date('H', strtotime($operation->expired)) == 9 && (int) date('i', strtotime($operation->expired)) == 15){
                    $this->info(date('Y-m-d H:i:s', strtotime($operation->expired)).' '.$operation->f_b_u_c);
                }*/
                //$this->info($operation->open.' | '.$operation->expired.' R:'.$operation->res_real.' RC:'.$operation->res_calc.' SENT:'.$operation->sent);
                //$this->info($operation->f_perce.' | '.$operation->f_perfor.' | '.$operation->f_b_u.' | '.$operation->f_b_u_c.' | '.$operation->amount.' | '.$operation->avg.' | '.$hour);
                if(
                    (
                        $operation->f_perce == 1 && array_key_exists($hour, $hours_for_day_percentage[$day]) && $operation->avg <= $operation->amount
                        && $strategy_for_day[$day]['percentage']
                        //&& $this->meetsPercentageConditions($operation, $day)
                    )
                    || (
                        $operation->f_b_u == 1 && array_key_exists($hour, $hours_for_day_best_users[$day])
                        && $strategy_for_day[$day]['best_users']
                    )
                    || (
                        $operation->f_perfor == 1 && array_key_exists($hour, $hours_for_day_performance[$day]) && $operation->avg <= $operation->amount
                        && $strategy_for_day[$day]['performance']
                    )
                    || (
                        $operation->f_b_u_c == 1 && array_key_exists($hour, $hours_for_day_best_users_copied[$day]) && $operation->avg <= $operation->amount
                        && $strategy_for_day[$day]['best_users_copied']
                    )
                ){
                    
                    $use = false;

                    if(!$last_operation_evaluate){
                        $use = true;
                    }else{
                        //Si ya se ha evaluado una operación se evalua si la actual
                        //puede remplazar a la ultima evaluada
                        //Si la fecha de apertura de la actual es menor a la ultima evaluada
                        //la actual no pudo ser utilizada en martingala porque hay otra abierta (la ultima evaluada)
                        $current_open = strtotime($operation->open);
                        $last_expired = strtotime($last_operation_evaluate->expired);
                        
                        if($current_open > $last_expired){
                            $use = true;
                        }
                    }

                    if($use && (!$this->option('only-real-results') || ($this->option('only-real-results') == 'yes' && $operation->res_real != null))){

                        $last_operation_evaluate = $operation;

                        if($this->option('print-date') && strtolower($this->option('print-date')) == 'yes'){
                            $this->info($operation->b_i_user.' | '.$operation->active_id.' | '.$operation->level_open.' | '.$operation->direction.' | '.$operation->open.' | '.$operation->expired.' R:'.$operation->res_real.' RC:'.$operation->res_calc.' SENT:'.$operation->sent.' SEC:'.$operation->seconds_to_expired);
                            //$this->info($operation->f_perce.' | '.$operation->f_perfor.' | '.$operation->f_b_u.' | '.$operation->f_b_u_c.' | '.$operation->amount.' | '.$operation->avg.' | '.$operation->seconds_to_expired);
                        }

                        if($operation->res_real == 1 || (is_null($operation->res_real) && $operation->res_calc == 1)){
                            $utility_normal += ((float) $this->argument('import') * $operation->profit) / 100;
                            if($utility_normal > $max_win)$max_win = $utility_normal;
                            $count_win++;
                        }else if($operation->res_real == -1 || (is_null($operation->res_real) && $operation->res_calc == -1)){
                            $utility_normal -= (float) $this->argument('import');
                            if($utility_normal < $max_lose)$max_lose = $utility_normal;
                            $count_lose++;
                        }else{
                            $count_equal++;
                        }
                    }
                }
            }

            $text .= ' W: '.$count_win;

            while(strlen($text) < 13){
                $text .= ' ';
            }

            $text .= '| L: '.$count_lose;

            while(strlen($text) < 21){
                $text .= ' ';
            }

            $text .= '| E: '.$count_equal;

            while(strlen($text) < 29){
                $text .= ' ';
            }

            $text .= '| U: $'. number_format($utility_normal, 2);

            while(strlen($text) < 42){
                $text .= ' ';
            }

            $text .= '| ▲ $'. number_format($max_win, 2);

            while(strlen($text) < 55){
                $text .= ' ';
            }

            $text .= '| ▼ $'. number_format($max_lose, 2);
            $text .= ' *';

            while(strlen($text) < 70){
                $text .= '*';
            }

            //INICIO DE EVALUACIÓN MARTIN74LA
            

            $max_win = 0;
            $max_lose = 0;

            $last_operation_evaluate = null;
            $attemps = 0;
            $utility_martingale = 0;
            $current_import = $this->argument('import');
            $data_atemps = [];
            $counter = 0;

            foreach ($operations as $operation) {
                $hour = (int) date('H', strtotime($operation->open));

                if(
                    (
                        $operation->f_perce == 1 && array_key_exists($hour, $hours_for_day_percentage[$day]) && $operation->avg <= $operation->amount
                        && $strategy_for_day[$day]['percentage']
                        //&& $this->meetsPercentageConditions($operation, $day)
                    )
                    || (
                        $operation->f_b_u == 1 && array_key_exists($hour, $hours_for_day_best_users[$day])
                        && $strategy_for_day[$day]['best_users']
                    )
                    || (
                        $operation->f_perfor == 1 && array_key_exists($hour, $hours_for_day_performance[$day]) && $operation->avg <= $operation->amount
                        && $strategy_for_day[$day]['performance']
                    )
                    || (
                        $operation->f_b_u_c == 1 && array_key_exists($hour, $hours_for_day_best_users_copied[$day]) && $operation->avg <= $operation->amount
                        && $strategy_for_day[$day]['best_users_copied']
                    )
                ){
                  //  $this->info('HOUR '.$hour);
                  
                //if($hour == $this->option('hour')){
                    //Determina si la operación se pudo utilizar en martingala
                    $use = false;

                    if(!$last_operation_evaluate){
                        $use = true;
                    }else{
                        //Si ya se ha evaluado una operación se evalua si la actual
                        //puede remplazar a la ultima evaluada
                        //Si la fecha de apertura de la actual es menor a la ultima evaluada
                        //la actual no pudo ser utilizada en martingala porque hay otra abierta (la ultima evaluada)
                        $current_open = strtotime($operation->open);
                        $last_expired = strtotime($last_operation_evaluate->expired);

                        if($current_open > $last_expired){
                            $use = true;
                        }
                    }

                    if($use && (!$this->option('only-real-results') || ($this->option('only-real-results') == 'yes' && $operation->res_real != null))){
                        $last_operation_evaluate = $operation;
                        $attemps++;

                        if($operation->res_real == 1 || $operation->res_calc == 1){

                            $utility_martingale += ((float) $current_import * (float) $operation->profit) / 100;

                            if($utility_martingale > $max_win)$max_win = $utility_martingale;

                            $current_import = $this->argument('import');

                            if(array_key_exists($attemps, $data_atemps)){
                                $data_atemps[$attemps]++;
                            }else{
                                $data_atemps[$attemps] = 1;
                            }

                            $attemps = 0;

                        }else if($operation->res_real == -1 || $operation->res_calc == -1){
                            $utility_martingale -= $current_import;
                            $current_import = $current_import * 2.25;

                            if($utility_martingale < $max_lose)$max_lose = $utility_martingale;

                            if($attemps == 4){
                                $current_import = $this->argument('import');
                                $attemps = 0;
                                $counter++;
                            }
                        }else{
                            $attemps--;
                        }
                    }
                }
            }

            $max_key = 0;
            foreach ($data_atemps as $key => $value) {
                $max_key = ($max_key < $key)?$key:$max_key;
            }


            for($i = 1; $i <= $max_key; $i++){
                if(array_key_exists($i, $data_atemps))
                    $text .= ' #'.$i.':'.$data_atemps[$i];
            }

            while(strlen($text) < 92){
                $text .= ' ';
            }

            $text .= '| R: '.$attemps;
            while(strlen($text) < 99){
                $text .= ' ';
            }

            $text .= '| T: '.$counter;
            while(strlen($text) < 106){
                $text .= ' ';
            }

            $text .= '| U: $'. number_format($utility_martingale, 2);

            while(strlen($text) < 118){
                $text .= ' ';
            }

            $text .= '| ▲ $'. number_format($max_win, 2);

            while(strlen($text) < 131){
                $text .= ' ';
            }

            $text .= '| ▼ $'. number_format($max_lose, 2);
            $text .= ' *';

            while(strlen($text) < 147){
                $text .= '*';
            }


            $last_operation_evaluate = null;
            $skipped_operations = 0;
            $win = 0;
            $utility_followed = 0;
            $current_import = $this->argument('import');
            $counter = 0;

            $max_win = 0;
            $max_lose = 0;

            foreach ($operations as $operation) {
                $hour = (int) date('H', strtotime($operation->open));

                if(
                    (
                        $operation->f_perce == 1 && array_key_exists($hour, $hours_for_day_percentage[$day]) && $operation->avg <= $operation->amount
                        && $strategy_for_day[$day]['percentage']
                        //&& $this->meetsPercentageConditions($operation, $day)
                    )
                    || (
                        $operation->f_b_u == 1 && array_key_exists($hour, $hours_for_day_best_users[$day])
                        && $strategy_for_day[$day]['best_users']
                    )
                    || (
                        $operation->f_perfor == 1 && array_key_exists($hour, $hours_for_day_performance[$day]) && $operation->avg <= $operation->amount
                        && $strategy_for_day[$day]['performance']
                    )
                    || (
                        $operation->f_b_u_c == 1 && array_key_exists($hour, $hours_for_day_best_users_copied[$day]) && $operation->avg <= $operation->amount
                        && $strategy_for_day[$day]['best_users_copied']
                    )
                ){
                  //  $this->info('HOUR '.$hour);
                  
                //if($hour == $this->option('hour')){
                    //Determina si la operación se pudo utilizar en martingala
                    $use = false;

                    if(!$last_operation_evaluate){
                        $use = true;
                    }else{
                        //Si ya se ha evaluado una operación se evalua si la actual
                        //puede remplazar a la ultima evaluada
                        //Si la fecha de apertura de la actual es menor a la ultima evaluada
                        //la actual no pudo ser utilizada en martingala porque hay otra abierta (la ultima evaluada)
                        $current_open = strtotime($operation->open);
                        $last_expired = strtotime($last_operation_evaluate->expired);

                        if($current_open > $last_expired){
                            $use = true;
                        }else{
                            $skipped_operations++;
                        }
                    }

                    if($use){
                        if($skipped_operations > 0){
                            //$this->info('( ** '.$skipped_operations.' operaciones omitidas. )');
                            $skipped_operations = 0;
                        }
                        $last_operation_evaluate = $operation;
                        //$this->info($operation->res_real.'  -  '.$operation->expired);

                        if($operation->res_real == 1 || $operation->res_calc == 1){
                            $win++;
                            $utility_followed += ((float) $current_import * (float) $operation->profit) / 100;
                            if($utility_followed > $max_win)$max_win = $utility_followed;
                            //En la primera victoria se establece el importe con
                            //el valor ganado
                            if($win == 1){
                                $current_import = ((float) $current_import * (float) $operation->profit) / 100;
                            }else {
                                //Si ha ganado más de una operación el siguiente importe
                                //es igual al importe actual mas lo que se ha ganado
                                $current_import += ((float) $current_import * (float) $operation->profit) / 100;
                            }

                            //Si llegó a cuatro operaciones
                            //ganadas secutivamente
                            if($win == 6){
                                $win = 0;
                                $current_import = $this->argument('import');
                                $counter++;
                            }
                        }else if($operation->res_real == -1 || $operation->res_calc == -1){
                            $utility_followed -= $current_import;
                            if($utility_followed < $max_lose)$max_lose = $utility_followed;
                            $win = 0;
                            $current_import = $this->argument('import');
                        }
                    }
                }
            }

            $text .= ' W: '.$counter;
            while(strlen($text) < 153){
                $text .= ' ';
            }

            $text .= '| U: $'. number_format($utility_followed, 2);

            while(strlen($text) < 165){
                $text .= ' ';
            }

            $text .= '| ▲ $'. number_format($max_win, 2);

            while(strlen($text) < 178){
                $text .= ' ';
            }

            $text .= '| ▼ $'. number_format($max_lose, 2);

            $this->info(
                $this->days[date('w', strtotime($start))].date('d', strtotime($start)).'/'.date('m', strtotime($start))
                .'-'
                .$this->days[date('w', strtotime($end))].date('d', strtotime($end)).'/'.date('m', strtotime($end)).' '
                .$text
            );
            $this->info('');

            return [
                'normal' => $utility_normal,
                'martingale' => $utility_martingale,
                'followed' => $utility_followed
            ];
        }
        
        return false;
    }

    public function meetsPercentageConditions($operation, $day)
    {
        return $operation->avg <= $operation->amount;

        /*return ($day == 7 && $operation->avg * 2 <= $operation->amount && $operation->oper > 8 AND $operation->hit_perc <= 90 AND $operation->amount <= 50 AND $operation->perfor >= 30)
            || ($day == 1 && $operation->avg * 2 <= $operation->amount && $operation->oper > 8 AND $operation->hit_perc <= 93 AND $operation->amount <= 50 AND $operation->perfor >= 50)
            || ($day == 2 && $operation->avg * 2 <= $operation->amount && $operation->oper > 8 AND $operation->hit_perc <= 93 AND $operation->amount <= 20 AND $operation->perfor >= 30)
            || ($day == 3 && $operation->avg * 2.5 <= $operation->amount && $operation->oper > 8 AND $operation->hit_perc <= 100 AND $operation->amount >= 0 AND $operation->perfor >= 90)
            || ($day == 4 && $operation->avg * 3 <= $operation->amount && $operation->oper > 8 AND $operation->hit_perc >= 90 AND $operation->amount >= 0 AND $operation->perfor >= 30);*/
    }
}