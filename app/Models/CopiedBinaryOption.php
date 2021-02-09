<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CopiedBinaryOption extends Model
{
    protected $table = 'copied_binary_options';

    public $timestamps = false;

    protected $fillable = [
        'sent',
        'profit',
        'broker_id',
        'result',
        'use_for_martingale',
        'from_performance',
        'from_percentage',
        'from_best_users_copied',
        'from_best_users',
        'ranking_position',
        'avg',
        'hit_percentage',
        'performance',
        'operations',
        'binary_option_id'
    ];

    public function binaryOption()
    {
    	return $this->belongsTo(BinaryOption::class);
    }
}
