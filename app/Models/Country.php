<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'name',
        'broker_id'
    ];

    public function brokerUsers()
    {
    	return $this->hasMany(BrokerUser::class);
    }
}
