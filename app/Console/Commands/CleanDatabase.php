<?php

namespace App\Console\Commands;

use App\Models\BinaryOption;
use App\Models\BrokerUser;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'database:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Elimina registros que no se consideran necesarios en la base de datos.';

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
        $date = date('Y-m-d', strtotime('-7days'));
        $this->info('');
        $this->info('USUARIOS SIN DATOS DESDE '.$date);
        $this->info('');

        //Ids de usuarios con operaciones copiadas
        $users_with_operations_copied = "SELECT broker_user_id FROM binary_options JOIN copied_binary_options ON binary_options.id = copied_binary_options.binary_option_id GROUP BY broker_user_id";

        //Usuarios sin operaciones desde hace más de 7 días
        //y que nunca han tenido operaciones copiadas
        $query_users = "SELECT id FROM broker_users WHERE updated_at < $date AND id NOT IN ($users_with_operations_copied)";

        //Usuarios con malos resultados 
        //y que nunca han tenido operaciones copiadas
        $query_bad_users = "
            SELECT id FROM broker_users 
            WHERE (
                (hit_percentage <= 40 AND operations >= 5) 
                OR (operations >= 5 AND performance_1 < 0 AND performance_2 < 0) 
                /*Usuarios con tres o más operaciones perdidas*/
                OR (operations > 2 AND hit_percentage = 0)
            ) AND id NOT IN ($users_with_operations_copied)";

        //Usuarios sin operaciones registradas
        $query_users_without_operations = "SELECT id FROM broker_users WHERE id NOT IN (SELECT broker_user_id FROM binary_options)";

        //Operaciones sin registro de resultado
        $query_operations_result_null = "SELECT id FROM binary_options WHERE result IS NULL";
        
        //Operaciones de hace más de un mes
        $query_old_operations = "SELECT count(id) as total FROM binary_options WHERE expiration_time < ".strtotime('-2month '.date('Y-m-d'))."000";

        //Cantidad de usuarios sin operaciones desde hace mas de 7 días
        $count_users = count(DB::select($query_users));
        //Cantidad de operaciones de usuarios sin datos desde hace más e 7 días
        $count_operations = BinaryOption::select('id')
            ->whereRaw('binary_options.broker_user_id IN ('.$query_users.')')
            ->count();

        $this->info("Se eliminarán $count_users usuarios");        
        $this->info("Se eliminarán $count_operations operaciones");        

        $this->info('');
        $this->info('');
        $this->info('USUARIOS CON MALOS RESULTADOS');        
        
        $count_bad_users = count(DB::select($query_bad_users));

        $count_operations_bad_users = BinaryOption::select('id')
            ->whereRaw('binary_options.broker_user_id IN ('.$query_bad_users.')')
            ->count();

        $this->info('');
        $this->info("Se eliminarán $count_bad_users usuarios");        
        $this->info("Se eliminarán $count_operations_bad_users operaciones");        
        $this->info('');
        $this->info('');

        $this->info('OPERACIONES VIEJAS');
        $count_old_operations = DB::select($query_old_operations)[0]->total;
        $this->info("Se eliminarán $count_old_operations operaciones");        
        $this->info('');
        $this->info('');

        $this->info('USUARIOS SIN OPERACIONES');        
        $count_users_without_operations = count(DB::select($query_users_without_operations));
        $this->info('');
        $this->info("Se eliminarán $count_users_without_operations usuarios");        
        $this->info('');
        $this->info('');

        $this->info('OPERACIONES SIN RESULTADO');        
        $count_operations_without_result = count(DB::select($query_operations_result_null));
        $this->info('');
        $this->info("Se eliminarán $count_operations_without_result operaciones");        
        $this->info('');
        $this->info('');

        $this->info('************ TOTAL ************');
        $this->info('');
        $this->info("Usuarios: ".($count_users+$count_bad_users+$count_users_without_operations));
        $this->info("Operaciones: ".($count_operations+$count_operations_bad_users+$count_operations_without_result+$count_old_operations));


        if($this->confirm('¿Desea continuar?')){

            $this->info('Eliminando datos...');

            $query_delete_users = "DELETE FROM broker_users WHERE updated_at < $date AND id NOT IN ($users_with_operations_copied)";

            $query_delete_bad_users = "DELETE FROM broker_users WHERE ((hit_percentage <= 40 AND operations >= 5) OR (operations >= 5 AND performance_1 < 0 AND performance_2 < 0) OR (operations > 2 AND hit_percentage = 0)) AND id NOT IN ($users_with_operations_copied)";

            $query_delete_users_without_operations = "DELETE FROM broker_users WHERE id NOT IN (SELECT broker_user_id FROM binary_options)";

            $query_delete_operations_result_null = "DELETE FROM binary_options WHERE result IS NULL";

            $query_delete_old_operations = "DELETE FROM binary_options WHERE expiration_time < ".strtotime('-2month '.date('Y-m-d'))."000";

            $this->info('Eliminando operaciones viejas...');
            DB::select($query_delete_old_operations);
            $this->info('OK');
            $this->info('Eliminando operaciones sin resultado...');
            DB::select($query_delete_operations_result_null);
            $this->info('OK');
            $this->info('Eliminando usuarios sin operaciones desde hace una semana...');
            DB::select($query_delete_users);
            $this->info('OK');
            $this->info('Eliminando usuarios sin operaciones...');
            DB::select($query_delete_users_without_operations);
            $this->info('OK');
            $this->info('Eliminando usuarios con malos resultados...');
            DB::select($query_delete_bad_users);
            $this->info('OK');

            $this->info('****** Datos eliminados con éxito ******');

        }else{
            $this->info('La limpieza se canceló');
        }
    }
}
