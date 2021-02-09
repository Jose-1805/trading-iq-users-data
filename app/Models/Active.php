<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Active extends Model
{
    protected $table = 'actives';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'img',
        'broker_id'
    ];

    public function binaryOptions()
    {
    	return $this->hasMany(BinaryOption::class);
    }
}
