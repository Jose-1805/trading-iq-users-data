<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BinaryOption extends Model
{
    protected $table = 'binary_options';

    public $timestamps = false;

    protected $fillable = [
        'amount',
        'direction',
        'level_open',
        'level_close',
        'result',
        'type',
        'opening_time',
        'expiration_time',
        'operations_up',
        'operations_down',
        'amount_up',
        'amount_down',
        'broker_id',
        'active_id',
        'broker_user_id'
    ];

    public function brokerUser()
    {
    	return $this->belongsTo(BrokerUser::class);
    }

    public function active()
    {
    	return $this->belongsTo(Active::class);
    }
}
