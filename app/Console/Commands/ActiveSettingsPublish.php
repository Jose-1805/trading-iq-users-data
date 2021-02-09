<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ActiveSettingsPublish extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'active-settings-publish {--actives=*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Copia las configuraciones de los activos en sus respectivos archivos';

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
            $this->info("******* COPIANDO CONFIGURACIÖN DE ACTIVO $active_id *******");
            for($day=1; $day <= 7; $day++){
                $this->info("Copiando dia $day");
                $settings = $this->getActiveSettings($active_id, "", $day);
                if($settings){
                    $js_data = "active_settings[$active_id] = ".json_encode($settings);
                    file_put_contents('public/ForIqOption/active_settings_day_'.$day.'/active_'.$active_id.'_settings.js', $js_data);
                }

                $settings_best_users = $this->getActiveSettings($active_id, "/best_users", $day);
                if($settings_best_users){
                    $js_data = "active_settings[$active_id] = ".json_encode($settings_best_users);
                    file_put_contents('public/ForIqOption/best_users/active_settings_day_'.$day.'/active_'.$active_id.'_settings.js', $js_data);
                }
            }
        }
    }

    /**
     * Retorna la configuración establecida para un activo
     * @param  [type] $active_id [Activo a consultar]
     */
    public function getActiveSettings($active_id, $folder = "", $day){
        $path_file = base_path("app/Console/Commands$folder/active_settings_day_$day/active_".$active_id."_settings.json");
        if(file_exists($path_file)){
            $string = file_get_contents($path_file);
            $active_settings = json_decode($string);
            return $active_settings;
        }
    }
}
