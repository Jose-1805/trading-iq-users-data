<?php

namespace App\Console\Commands;

use App\Models\BinaryOption;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DeleteBinaryOptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'binary-options:delete {amount}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Elimina las opciones binarias que se pueden borrar';

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
        DB::beginTransaction();

        //Se deshabilitan las opciones binarias que no se pudieron elimnar 
        //porque han sido copiadas
        BinaryOption::limit($this->argument('amount'))
        ->update([
            'enabled' => -1
        ]);

        $d = BinaryOption::whereNotIn('binary_options.id', function($q){
            $q->select('binary_option_id')->from('copied_binary_options');
        })
        ->limit($this->argument('amount'))
        ->delete();

        if($d){
            if ($this->confirm("Se eliminarán $d opciones binarias del sistema ¿Continuar?")) {
                $this->info("$d Opciones binarias eliminadas");
                DB::commit();
            }else{
                $this->info("Eliminación de opciones binarias cancelada");
                DB::rollBack();
            }
        }else{
            $this->info("No se encontraron opciones binarias para eliminar");
            DB::rollBack();
        }
    }
}
