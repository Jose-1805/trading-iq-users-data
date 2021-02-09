<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class EvaluateResultsTrademood extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trademood:evaluate {--start=} {--end=} {--only-day=} {--print-data=} {import} {--from=*} {--act=*} {--separate-each-day=} {--apply-hours=} {--full-percentages=} {--best-seconds=} {--min-operations-best-users=} {--use-general-settings}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evalua los resultados de copias con trademood';

    protected $days = [
            7 => 'Dom',
            1 => 'Lun',
            2 => 'Mar',
            3 => 'Mie',
            4 => 'Jue',
            5 => 'Vie',
            6 => 'Sab'
        ];

    //CONFIGURACIÓN DE DIVISAS    
    protected $trademood_settings = [
        //EUR-USD
        1 => [
            //Cantidad de operaciones mínimas para copiar una operacion
            "min_operations" => 15,
            //Estado de animo mínimo para hacer una entrada (porcentage de opraciones)
            "min_percentage_operations" => 60,
            //Estado de animo mínimo para hacer una entrada (porcentage de dinero ingresado)
            "min_percentage_amount" => 60,
            //Cantidad de operaciones mínimas para que una operación quede pendiente
            "min_operations_pending" => 8,
            //Estado de animo mínimo para que una operación quede pendiente (porcentage de opraciones)
            "min_percentage_operations_pending" => 60,
            //Estado de animo mínimo para  para que una operación quede pendiente (porcentage de dinero ingresado)
            "min_percentage_amount_pending" => 60,
            //Cantidad de operaciones mánimas para copiar una operacion
            "max_operations" => 1000,
            //Comisión mínima que debe tener el broker para copiar una entrada
            "min_commission_broker" => 1,
            //Comisión mínima que debe tener el broker para copiar una entrada
            "max_commission_broker" => 30,
        ],
        //EUR-GBP
        2 => [
            "min_operations" => 20,
            "min_percentage_operations" => 80,
            "min_percentage_amount" => 80,
            "min_operations_pending" => 10,
            "min_percentage_operations_pending" => 80,
            "min_percentage_amount_pending" => 80,
            "max_operations" => 200,
            "min_commission_broker" => 1,
            "max_commission_broker" => 30,
        ],
        //GBP-JPY
        3 => [
            "min_operations" => 8,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 4,
            "min_percentage_operations_pending" => 40,
            "min_percentage_amount_pending" => 40,
            "max_operations" => 1000,
            "min_commission_broker" => 1,
            "max_commission_broker" => 30,  
        ],
        //EUR-JPY
        4 => [
            "min_operations" => 15,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 4,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 100,
            "min_commission_broker" => 1,
            "max_commission_broker" => 30,
        ],
        //GBP-USD
        5 => [
            "min_operations" => 8,
            "min_percentage_operations" => 60,
            "min_percentage_amount" => 60,
            "min_operations_pending" => 6,
            "min_percentage_operations_pending" => 60,
            "min_percentage_amount_pending" => 60,
            "max_operations" => 1000,
            "min_commission_broker" => 1,
            "max_commission_broker" => 30,
        ],
        //USD-JPY
        6 => [
            "min_operations" => 6,
            "min_percentage_operations" => 40,
            "min_percentage_amount" => 40,
            "min_operations_pending" => 4,
            "min_percentage_operations_pending" => 40,
            "min_percentage_amount_pending" => 40,
            "max_operations" => 1000,
            "min_commission_broker" => 1,
            "max_commission_broker" => 30,
        ],
        //NZD-USD
        8 => [
            "min_operations" => 4,
            "min_percentage_operations" => 60,
            "min_percentage_amount" => 60,
            "min_operations_pending" => 4,
            "min_percentage_operations_pending" => 60,
            "min_percentage_amount_pending" => 60,
            "max_operations" => 1000,
            "min_commission_broker" => 1,
            "max_commission_broker" => 30,
        ],
        //AUD-USD
        99 => [
            "min_operations" => 7,
            "min_percentage_operations" => 60,
            "min_percentage_amount" => 60,
            "min_operations_pending" => 4,
            "min_percentage_operations_pending" => 60,
            "min_percentage_amount_pending" => 60,
            "max_operations" => 25,
            "min_commission_broker" => 1,
            "max_commission_broker" => 30,
        ],
        //EUR-USD (OTC)
        76 => [
            "min_operations" => 15,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 6,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 1,
            "max_commission_broker" => 50,
        ],
        //EUR-GBP (OTC)
        77 => [
            "min_operations" => 10,
            "min_percentage_operations" => 60,
            "min_percentage_amount" => 60,
            "min_operations_pending" => 4,
            "min_percentage_operations_pending" => 60,
            "min_percentage_amount_pending" => 60,
            "max_operations" => 1000,
            "min_commission_broker" => 1,
            "max_commission_broker" => 50,
        ],
        //USD-CHF (OTC)
        78 => [
            "min_operations" => 6,
            "min_percentage_operations" => 40,
            "min_percentage_amount" => 40,
            "min_operations_pending" => 4,
            "min_percentage_operations_pending" => 40,
            "min_percentage_amount_pending" => 40,
            "max_operations" => 1000,
            "min_commission_broker" => 6,
            "max_commission_broker" => 50,
        ],
        //NZD/USD (OTC)
        80 => [
            "min_operations" => 7,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 7,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 1,
            "max_commission_broker" => 50,
        ],
        //GBP-USD (OTC)
        81 => [
            "min_operations" => 10,
            "min_percentage_operations" => 60,
            "min_percentage_amount" => 60,
            "min_operations_pending" => 10,
            "min_percentage_operations_pending" => 60,
            "min_percentage_amount_pending" => 60,
            "max_operations" => 1000,
            "min_commission_broker" => 1,
            "max_commission_broker" => 50,
        ],
        //AUD-CAD (OTC)
        86 => [
            "min_operations" => 15,
            "min_percentage_operations" => 60,
            "min_percentage_amount" => 60,
            "min_operations_pending" => 10,
            "min_percentage_operations_pending" => 60,
            "min_percentage_amount_pending" => 60,
            "max_operations" => 1000,
            "min_commission_broker" => 1,
            "max_commission_broker" => 50,
        ]
    ];

    //CONFIGURACIÓN DE DIVISAS    
    protected $trademood_settings_general = [
        //EUR-USD
        1 => [
            //Cantidad de operaciones mínimas para copiar una operacion
            "min_operations" => 5,
            //Estado de animo mínimo para hacer una entrada (porcentage de opraciones)
            "min_percentage_operations" => 70,
            //Estado de animo mínimo para hacer una entrada (porcentage de dinero ingresado)
            "min_percentage_amount" => 70,
            //Cantidad de operaciones mínimas para que una operación quede pendiente
            "min_operations_pending" => 5,
            //Estado de animo mínimo para que una operación quede pendiente (porcentage de opraciones)
            "min_percentage_operations_pending" => 70,
            //Estado de animo mínimo para  para que una operación quede pendiente (porcentage de dinero ingresado)
            "min_percentage_amount_pending" => 70,
            //Cantidad de operaciones mánimas para copiar una operacion
            "max_operations" => 1000,
            //Comisión mínima que debe tener el broker para copiar una entrada
            "min_commission_broker" => 10,
            //Comisión mínima que debe tener el broker para copiar una entrada
            "max_commission_broker" => 30,
        ],
        //EUR-GBP
        2 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 200,
            "min_commission_broker" => 10,
            "max_commission_broker" => 30,
        ],
        //GBP-JPY
        3 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 30,  
        ],
        //EUR-JPY
        4 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 100,
            "min_commission_broker" => 10,
            "max_commission_broker" => 30,
        ],
        //GBP-USD
        5 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 30,
        ],
        //USD-JPY
        6 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 30,
        ],
        //NZD-USD
        8 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 30,
        ],
        //AUD-USD
        99 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 25,
            "min_commission_broker" => 10,
            "max_commission_broker" => 30,
        ],
        //EUR-USD (OTC)
        76 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 50,
        ],
        //EUR-GBP (OTC)
        77 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 50,
        ],
        //USD-CHF (OTC)
        78 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 50,
        ],
        //NZD/USD (OTC)
        80 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 50,
        ],
        //GBP-USD (OTC)
        81 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 50,
        ],
        //AUD-CAD (OTC)
        86 => [
            "min_operations" => 5,
            "min_percentage_operations" => 70,
            "min_percentage_amount" => 70,
            "min_operations_pending" => 5,
            "min_percentage_operations_pending" => 70,
            "min_percentage_amount_pending" => 70,
            "max_operations" => 1000,
            "min_commission_broker" => 10,
            "max_commission_broker" => 50,
        ]
    ];

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
        $tm_settings = $this->trademood_settings;
        if($this->option("use-general-settings")){
            $tm_settings = $this->trademood_settings_general;
        }
        
        //Strategy from percentage
        $hours_for_day_percentage = [
            7 => [
                1 => true
              ],
              1 => [
                1 => true,
                3 => true,
                9 => true,
                10 => true,
              ],
              2 => [
                23 => true,
                10 => true,
              ],
              3 => [
                0 => true,
                9 => true,
                12 => true,
              ],
              4 => [
                0 => true,
                9 => true,
                10 => true
              ],
              5 => [],
              6 => [],
        ];

        //Strategy from performance
        $hours_for_day_performance = [
              7 => [
                7 => true
              ],
              1 => [
                0 => true,
                7 => true,
                8 => true,
              ],
              2 => [
                8 => true,
                10 => true,
              ],
              3 => [
                7 => true,
              ],
              4 => [
              ],
              5 => [],
              6 => [],
        ];

        //Strategy from best users
        $hours_for_day_best_users = [
              7 => [
                23 => true
              ],
              1 => [
                5 => true
              ],
              2 => [
                0 => true,
              ],
              3 => [
                1 => true,
                9 => true,
                11 => true,
              ],
              4 => [
              ],
              5 => [],
              6 => [],
        ];

        //Strategy from best users copies
        $hours_for_day_best_users_copied = [
             7 => [],
             1 => [],
             2 => [
                23=>true,
             ],
             3 => [],
             4 => [],
             5 => [],
             6 => [],
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
            $end =  date('Y-m-d', strtotime('+2 day')).' '.$this->end_time;
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

        $operations_profit = 0;
        $win = 0;
        $lose = 0;
        $counter_operations = 0;
        $text = "";

        while ($continue) {
            $new_start = date('Y-m-d H:i', strtotime('+1day '.$new_start));
            $new_end = date('Y-m-d H:i', strtotime('+1day '.$new_end));            
            
            //NO se debe consultar fechas superiores $end 
            if(strtotime($new_end) > $end_time){
                $continue = false;
            }else{
                $print = true;
                $day = date('N', strtotime($new_start));
                if($this->option('only-day')){
                    if($day != $this->option('only-day'))
                        $print = false;
                }

                if($print){
                    $where_1 = "";

                    foreach ($tm_settings as $key => $setting) {
                        $setting = (object) $setting;
                        $where_1 .= "OR (
                                b_o_1.active_id = $key
                                AND (b_o_3.operations_up + b_o_3.operations_down) >= $setting->min_operations
                                AND (b_o_3.operations_up + b_o_3.operations_down) <= $setting->max_operations
                                AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= $setting->min_percentage_operations
                                AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= $setting->min_percentage_amount
                            )
                        ";
                    }

                    $where_1 = trim($where_1, "OR ");

                    $where_2 = "";

                    foreach ($tm_settings as $key => $setting) {
                        $setting = (object) $setting;
                        $where_2 .= "OR (
                                b_o_1.active_id = $key
                                AND c_b_o.profit <= ".(100-$setting->min_commission_broker)
                                ." AND c_b_o.profit >= ".(100-$setting->max_commission_broker)
                            .")
                        ";
                    }

                    $where_2 = trim($where_2, "OR ");

                    $where_3 = "";

                    foreach ($tm_settings as $key => $setting) {
                        $setting = (object) $setting;
                        $where_3 .= "OR (
                                active_id = $key
                                AND tm_operations_original >= $setting->min_operations_pending
                                AND tm_op_percentage_original >= $setting->min_percentage_operations_pending 
                                AND tm_am_percentage_original >= $setting->min_percentage_amount_pending 
                            )
                        ";
                    }

                    $where_3 = trim($where_3, "OR ");


                    $from_argument = "";

                    if($this->option('from')){
                        if(count($this->option('from'))){
                            $from_argument = "AND (";
                            $from_data = "";

                            foreach ($this->option('from') as $from_value) {
                                if($from_value == 'from_best_users'){
                                    $from_data .= "OR (c_b_o.$from_value = 1 AND c_b_o.operations >= ".$this->option("min-operations-best-users").")";
                                }else{
                                    $from_data .= "OR c_b_o.$from_value = 1 ";
                                }
                            }

                            $from_data = trim($from_data, "OR ");

                            $from_argument .= $from_data.")";
                        }
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
                                    b_o_1.direction,
                                    b_o_1.amount,
                                    c_b_o.profit,

                                    c_b_o.result as res_real,
                                    b_o_1.result as res_calc_original,
                                    b_o_2.result as res_calc_other,
                                
                                    IF(b_o_1.result = 1,(".$this->argument('import')."*c_b_o.profit/100),(IF(b_o_1.result = -1,-1,0))) as profit_value_original,
                                    IF(b_o_2.result = 1,(".$this->argument('import')."*c_b_o.profit/100),(IF(b_o_2.result = -1,-1,0))) as profit_value_other,
                                
                                    (b_o_1.operations_up + b_o_1.operations_down) as tm_operations_original,
                                    (b_o_2.operations_up + b_o_2.operations_down) as tm_operations_other, 
                                
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
                                INNER JOIN binary_options b_o_1 ON c_b_o.binary_option_id = b_o_1.id AND b_o_1.active_id in (".implode(",", $this->option("act")).") 
                                INNER JOIN 
                                    binary_options b_o_2 
                                ON b_o_2.id = (
                                    SELECT b_o_3.id FROM binary_options b_o_3
                                    WHERE b_o_3.expiration_time = b_o_1.expiration_time 
                                    AND b_o_3.active_id = b_o_1.active_id
                                    AND b_o_3.direction = b_o_1.direction
                                    AND b_o_3.opening_time >= b_o_1.opening_time
                                    AND b_o_3.id >= b_o_1.id
                                    AND (
                                        (b_o_3.direction = 1 AND b_o_3.level_open <= b_o_1.level_open)
                                        OR (b_o_3.direction = -1 AND b_o_3.level_open >= b_o_1.level_open)
                                    )
                                    AND (
                                        $where_1
                                    )
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
                                    b_o_1.opening_time >= UNIX_TIMESTAMP(STR_TO_DATE('$new_start', '%Y-%m-%d %H:%i')) * 1000 
                                    AND b_o_1.opening_time <= UNIX_TIMESTAMP(STR_TO_DATE('$new_end', '%Y-%m-%d %H:%i')) * 1000
                                    $from_argument
                                    AND (
                                        $where_2
                                    )
                                ORDER BY b_o_1.opening_time DESC
                            ) results GROUP BY expired, active_id ORDER BY opened DESC
                        ) res WHERE (
                            $where_3
                        )
                    ";

                    //$this->info($sql_operations);
                    $operations = DB::select($sql_operations);

                    $profit_value_martingale = 0;
                    $operations_martingale = 0;
                    $current_amount_martingale = $this->argument('import');
                    $attemps_martingale = 0;
                    $last_expired_martingale = 0;
                    $lose_martingale = 0;

                    if(count($operations)){
                        $counter_operations += count($operations);
                        if($this->option('separate-each-day') && strtolower($this->option('separate-each-day')) == 'yes'){
                            $operations_profit = 0;
                            $win = 0;
                            $lose = 0;
                            $text = "";
                        }else{
                            $text .= "\nDE ".$this->days[$day]." $new_start A $new_end -- (".count($operations)." OPERACIONES)\n";
                        }
                        $operations_aux = [];
                        for ($i = count($operations)-1; $i >= 0; $i--) {
                            $operations_aux[] = $operations[$i];
                        }

                        $operations = $operations_aux;
                        foreach ($operations as $operation) {
                            $hour = (int) date('H', strtotime($operation->opened));
                            if(
                                !$this->option('apply-hours')
                                || (
                                    $this->option('apply-hours')
                                    && $this->option('apply-hours') != "yes"
                                )
                                || (
                                    $this->option('apply-hours')
                                    && $this->option('apply-hours') == "yes"
                                    && (
                                        (
                                            $operation->from_percentage == 1 && array_key_exists($hour, $hours_for_day_percentage[$day]) && $operation->avg <= $operation->amount
                                            && $strategy_for_day[$day]['percentage']
                                            && (
                                                !$this->option('from')
                                                || in_array('from_percentage', $this->option('from'))
                                            )
                                            //&& $this->meetsPercentageConditions($operation, $day)
                                        )
                                        || (
                                            $operation->from_best_users == 1 && array_key_exists($hour, $hours_for_day_best_users[$day])
                                            && $strategy_for_day[$day]['best_users']
                                            && (
                                                !$this->option('from')
                                                || in_array('from_best_users', $this->option('from'))
                                            )
                                        )
                                        || (
                                            $operation->from_performance == 1 && array_key_exists($hour, $hours_for_day_performance[$day]) && $operation->avg <= $operation->amount
                                            && $strategy_for_day[$day]['performance']
                                            && (
                                                !$this->option('from')
                                                || in_array('from_performance', $this->option('from'))
                                            )
                                        )
                                        || (
                                            $operation->from_best_users_copied == 1 && array_key_exists($hour, $hours_for_day_best_users_copied[$day]) && $operation->avg <= $operation->amount
                                            && $strategy_for_day[$day]['best_users_copied']
                                            && (
                                                !$this->option('from')
                                                || in_array('from_best_users_copied', $this->option('from'))
                                            )
                                        )
                                    )
                                )
                            ){
                                $percentages_full = ($operation->tm_op_percentage_original == 100 && $operation->tm_op_percentage_other == 100 && $operation->tm_am_percentage_original == 100 && $operation->tm_am_percentage_other == 100)?true:false;
                                $more_operations = ($operation->tm_operations_other > $operation->tm_operations_original);
                                if( 
                                    //Si no se necesita validación de porcentaje o buenos segundos
                                    (
                                        !$this->option('full-percentages')
                                        && !$this->option('best-seconds')
                                    )
                                    //Se requiere validación de porcentaje y buenos minutos
                                    || (
                                        $this->option('full-percentages') == 'yes'
                                        && $this->option('best-seconds') == 'yes'
                                        && ($percentages_full || $more_operations)
                                        && ($operation->seconds_to_expired <= 200 && $operation->seconds_to_expired >= 62)
                                    )
                                    //Se requiere validación de porcentaje
                                    || (
                                        $this->option('full-percentages') == 'yes'
                                        && !$this->option('best-seconds')
                                        && ($percentages_full || $more_operations)
                                    )
                                    //Se requiere validación de buenos minutos
                                    || (
                                        $this->option('best-seconds') == 'yes'
                                        && !$this->option('full-percentages')
                                        && ($operation->seconds_to_expired <= 200 && $operation->seconds_to_expired >= 62)
                                    )
                                ){     
                                    //La operación sirve para martingale
                                    if($last_expired_martingale < $operation->opening_time){
                                        $last_expired_martingale = $operation->expiration_time;
                                        if($operation->res_calc_other == 1){
                                            $operations_martingale++;
                                            $profit_value_martingale += ($current_amount_martingale * $operation->profit)/100;

                                            $current_amount_martingale = $this->argument('import');
                                            $attemps_martingale = 0;
                                        }else if($operation->res_calc_other == -1){
                                            $operations_martingale++;
                                            $attemps_martingale++;
                                            $profit_value_martingale -= $current_amount_martingale;
                                            if($attemps_martingale == 3){
                                                $current_amount_martingale = $this->argument('import');
                                                $attemps_martingale = 0;
                                                $lose_martingale++;
                                            }else{
                                                $current_amount_martingale *= 2.25;
                                            }
                                        }
                                    }

                                    $text .= $percentages_full && $more_operations?'*****':($percentages_full?'**':($more_operations?'***':''));
                                    $increase = $percentages_full && $more_operations?4:($percentages_full?2:($more_operations?3:1));
                                    $increase = 1;
                                    $text .= "($operation->active_id) $operation->opened --> $operation->expired | $operation->seconds_to_expired sec | $operation->profit% | \$".$operation->profit_value_original*$increase." | \$".$operation->profit_value_other*$increase." | $operation->tm_operations_original | $operation->tm_operations_other | $operation->tm_op_percentage_original% | $operation->tm_op_percentage_other% | $operation->tm_am_percentage_original% | $operation->tm_am_percentage_other%";

                                    $operations_profit += $operation->profit_value_other * $increase;
                                    if($operation->res_calc_other == 1){
                                        $win++;
                                    }else if($operation->res_calc_other == -1){
                                        $lose++;
                                    }
                                    $text .= "\n";
                                }
                            }
                        }

                        if($this->option('separate-each-day') && strtolower($this->option('separate-each-day')) == 'yes'){
                            $this->info("");
                            $this->info("");
                            $this->info("DE ".$this->days[$day]." $new_start A $new_end");
                            $this->info(count($operations)." OPERACIONES");
                            $this->info("$win GANADAS - $lose PERDIDAS");
                            $hit_percentage = 0;
                            if(($win + $lose) > 0)
                                $hit_percentage = ($win * 100)/($win + $lose);
                            $hit_percentage = number_format($hit_percentage, 2);
                            $this->info("$hit_percentage% DE ACIERTO");
                            $this->info("\$$operations_profit UTILIDAD");
                            
                            $this->info("*********** MARTINGALE ***********");
                            $this->info("OPERACIONES $operations_martingale");
                            $this->info("UTILIDAD \$$profit_value_martingale");
                            $this->info("TOPES ALCANZADOS: $lose_martingale");
                            $this->info("");
                            $this->info("");

                            if($this->option('print-data') && strtolower($this->option('print-data')) == 'yes')
                                $this->info($text);
                        }else{
                            $text .= "\n";                            
                        }
                    }
                }
            }            
        }

        if(!$this->option('separate-each-day') || strtolower($this->option('separate-each-day')) != 'yes'){
            if($this->option('print-data') && strtolower($this->option('print-data')) == 'yes')
                $this->info($text);
            $this->info("");
            $this->info("$counter_operations OPERACIONES");
            $this->info("$win GANADAS - $lose PERDIDAS");
            $hit_percentage = 0;
            if(($win + $lose) > 0)
                $hit_percentage = ($win * 100)/($win + $lose);
            $hit_percentage = number_format($hit_percentage, 2);
            $this->info("$hit_percentage% DE ACIERTO");
            $this->info("\$$operations_profit UTILIDAD");
        }        
    }
}
