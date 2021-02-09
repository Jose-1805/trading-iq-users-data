<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SetBestHours extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'best-hours:set {start} {--actives=*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Asigna los valores de las mejores horas en los archivos de configuración';

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
        foreach ($this->option("actives") as $active_id){
            $this->info("****** ACTIVO  $active_id ******");
            $this->info("");
            $this->info("Asignando percentage al activo $active_id");
            $this->call("best-hours", [
                "start" => $this->argument("start"),
                "from" => "percentage",
                "active" => $active_id
            ]);

            $this->info("");
            $this->info("Asignando performance al activo $active_id");
            $this->call("best-hours", [
                "start" => $this->argument("start"),
                "from" => "performance",
                "active" => $active_id
            ]);

            $this->info("");
            $this->info("Asignando best_users al activo $active_id");
            $this->call("best-hours", [
                "start" => $this->argument("start"),
                "from" => "best_users",
                "active" => $active_id
            ]);

            $this->info("");
            $this->info("Asignando best_users_copied al activo $active_id");
            $this->call("best-hours", [
                "start" => $this->argument("start"),
                "from" => "best_users_copied",
                "active" => $active_id
            ]);
            $this->info("");
            $this->info("");
        }
    }
}
