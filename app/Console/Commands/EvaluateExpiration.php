<?php

namespace App\Console\Commands;

use App\Models\Active;
use App\Models\BrokerUser;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class EvaluateExpiration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'evaluate:expiration {active} {expiration} {level}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Evalua las operaciones que expiraron en determinado minuto';

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
        $active = Active::where('broker_id', $this->argument('active'))->first();
        $level = $this->argument('level');
        $expiration = $this->argument('expiration');
        if($active){
            $this->info('Actualizando resultados ...');
            DB::select("
                UPDATE binary_options
                SET 
                    level_close = $level, 
                    result = IF(level_open = $level, 0, (
                                IF(direction = 1, (
                                    IF(level_open > $level, -1, 1)
                                ), (
                                    IF(level_open < $level, -1, 1)
                                ))
                            ))
                WHERE expiration_time = $expiration
                AND active_id = $active->id
            ");

            $this->info('Actualizando valores de ranking ...');
            //Se asignan los valores para los ranking
            BrokerUser::setDataRankingFromExpirationTime($expiration);

            $this->info('Evaluación finalizada con éxito');
        }
    }
}
