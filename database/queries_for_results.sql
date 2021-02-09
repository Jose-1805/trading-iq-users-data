SELECT * FROM (
	SELECT 

		copied_binary_options.id, 
		copied_binary_options.sent,
		broker_users.broker_id as b_i_user, 
		binary_options.type,
		copied_binary_options.broker_id as b_i_operation, 
		from_unixtime(CAST(binary_options.opening_time/1000 as INT)) as open,
		from_unixtime(CAST(binary_options.expiration_time/1000 as INT)) as expired,
		binary_options.result as res_calc, 
		copied_binary_options.result as res_real, 
		copied_binary_options.use_for_martingale as mart, 
		copied_binary_options.from_performance as f_perfor, 
		copied_binary_options.from_percentage as f_perce, 
		copied_binary_options.from_best_users_copied as f_b_u_c, 
		copied_binary_options.from_best_users as f_b_u, 
		copied_binary_options.ranking_position as pos, 
		copied_binary_options.avg, 
		copied_binary_options.hit_percentage as hit_perc, 
		copied_binary_options.operations as oper, 
		binary_options.amount,
		copied_binary_options.binary_option_id as b_o_id

	FROM `copied_binary_options` 
	INNER JOIN binary_options on copied_binary_options.binary_option_id = binary_options.id 
	INNER JOIN broker_users ON binary_options.broker_user_id = broker_users.id
) as copies
WHERE f_perce = 1 AND avg * 2 <= amount AND oper > 8
and expired > '2020-05-21'
GROUP BY expired  
ORDER BY `copies`.`id` ASC




SELECT * FROM (
	SELECT 

		copied_binary_options.id, 
		copied_binary_options.sent,
		broker_users.broker_id as b_i_user, 
		binary_options.type,
		copied_binary_options.broker_id as b_i_operation, 
		from_unixtime(CAST(binary_options.opening_time/1000 as INT)) as open,
		from_unixtime(CAST(binary_options.expiration_time/1000 as INT)) as expired,
		binary_options.result as res_calc, 
		copied_binary_options.result as res_real, 
		copied_binary_options.use_for_martingale as mart, 
		copied_binary_options.from_performance as f_perfor, 
		copied_binary_options.from_percentage as f_perce, 
		copied_binary_options.from_best_users_copied as f_b_u_c, 
		copied_binary_options.from_best_users as f_b_u, 
		copied_binary_options.ranking_position as pos, 
		copied_binary_options.avg, 
		copied_binary_options.hit_percentage as hit_perc, 
		copied_binary_options.operations as oper, 
		binary_options.amount,
		copied_binary_options.binary_option_id as b_o_id

	FROM `copied_binary_options` 
	INNER JOIN binary_options on copied_binary_options.binary_option_id = binary_options.id 
	INNER JOIN broker_users ON binary_options.broker_user_id = broker_users.id
) as copies
WHERE f_perfor = 1 AND avg > 300 AND pos < 15
and expired > '2020-05-21'
GROUP BY expired  
ORDER BY `copies`.`id` ASC




SELECT * FROM (
	SELECT 

		copied_binary_options.id, 
		copied_binary_options.sent,
		broker_users.broker_id as b_i_user, 
		binary_options.type,
		copied_binary_options.broker_id as b_i_operation, 
		from_unixtime(CAST(binary_options.opening_time/1000 as INT)) as open,
		from_unixtime(CAST(binary_options.expiration_time/1000 as INT)) as expired,
		binary_options.result as res_calc, 
		copied_binary_options.result as res_real, 
		copied_binary_options.use_for_martingale as mart, 
		copied_binary_options.from_performance as f_perfor, 
		copied_binary_options.from_percentage as f_perce, 
		copied_binary_options.from_best_users_copied as f_b_u_c, 
		copied_binary_options.from_best_users as f_b_u, 
		copied_binary_options.ranking_position as pos, 
		copied_binary_options.avg, 
		copied_binary_options.hit_percentage as hit_perc, 
		copied_binary_options.operations as oper, 
		binary_options.amount,
		copied_binary_options.binary_option_id as b_o_id

	FROM `copied_binary_options` 
	INNER JOIN binary_options on copied_binary_options.binary_option_id = binary_options.id 
	INNER JOIN broker_users ON binary_options.broker_user_id = broker_users.id
) as copies
WHERE f_b_u_C = 1 AND f_b_u = 1 AND f_perce = 1
and expired > '2020-05-21'
GROUP BY expired  
ORDER BY `copies`.`id` ASC




SELECT * FROM (
	SELECT 

		copied_binary_options.id, 
		copied_binary_options.sent,
		broker_users.broker_id as b_i_user, 
		binary_options.type,
		copied_binary_options.broker_id as b_i_operation, 
		from_unixtime(CAST(binary_options.opening_time/1000 as INT)) as open,
		from_unixtime(CAST(binary_options.expiration_time/1000 as INT)) as expired,
		binary_options.result as res_calc, 
		copied_binary_options.result as res_real, 
		copied_binary_options.use_for_martingale as mart, 
		copied_binary_options.from_performance as f_perfor, 
		copied_binary_options.from_percentage as f_perce, 
		copied_binary_options.from_best_users_copied as f_b_u_c, 
		copied_binary_options.from_best_users as f_b_u, 
		copied_binary_options.ranking_position as pos, 
		copied_binary_options.avg, 
		copied_binary_options.hit_percentage as hit_perc, 
		copied_binary_options.operations as oper, 
		binary_options.amount,
		copied_binary_options.binary_option_id as b_o_id

	FROM `copied_binary_options` 
	INNER JOIN binary_options on copied_binary_options.binary_option_id = binary_options.id 
	INNER JOIN broker_users ON binary_options.broker_user_id = broker_users.id
) as copies
WHERE f_b_u = 1 AND amount >= 10
and expired > '2020-05-21'
GROUP BY expired  
ORDER BY `copies`.`id` ASC



CREATE VIEW filtered_results AS
ALTER VIEW filtered_results AS
SELECT * FROM (
	SELECT 

		copied_binary_options.id, 
		copied_binary_options.sent,
		broker_users.broker_id as b_i_user, 
		binary_options.type,
		copied_binary_options.broker_id as b_i_operation, 
		from_unixtime(CAST(binary_options.opening_time/1000 as INT)) as open,
		from_unixtime(CAST(binary_options.expiration_time/1000 as INT)) as expired,
		(binary_options.expiration_time - binary_options.opening_time)/1000 as seconds_to_expired,
		binary_options.result as res_calc, 
		copied_binary_options.result as res_real, 
		copied_binary_options.use_for_martingale as mart, 
		copied_binary_options.from_performance as f_perfor, 
		copied_binary_options.from_percentage as f_perce, 
		copied_binary_options.from_best_users_copied as f_b_u_c, 
		copied_binary_options.from_best_users as f_b_u, 
		copied_binary_options.ranking_position as pos, 
		copied_binary_options.avg, 
		copied_binary_options.hit_percentage as hit_perc, 
		copied_binary_options.performance as perfor, 
		copied_binary_options.operations as oper, 
		binary_options.amount,
		copied_binary_options.binary_option_id as b_o_id

	FROM `copied_binary_options` 
	INNER JOIN binary_options on copied_binary_options.binary_option_id = binary_options.id 
	INNER JOIN broker_users ON binary_options.broker_user_id = broker_users.id
) as copies
/*WHERE 
	(f_perce = 1 AND (avg * 2) <= amount AND oper > 8)
    OR (f_perfor = 1 AND avg > 300 AND pos < 15)
    OR (f_b_u_c = 1 AND f_b_u = 1 AND f_perce = 1)
    OR (f_b_u = 1 AND amount >= 10)*/
/*and expired > '2020-05-21'*/
GROUP BY expired, b_i_user
ORDER BY `copies`.`id` ASC

/******OPERACIONES SIN RESULTADOS**************/
SELECT 
	from_unixtime(CAST(binary_options.expiration_time/1000 as INT)) as expired,
	binary_options.* 
FROM `binary_options`WHERE result IS NULL ORDER BY `id`  DESC

/******OPERACIONES COPIADAS**************/

SELECT
    FROM_UNIXTIME(
        CAST(
            binary_options.opening_time / 1000 AS INT
        )
    ) AS opened,
    FROM_UNIXTIME(
        CAST(
            binary_options.expiration_time / 1000 AS INT
        )
    ) AS expired,
    binary_options.active_id,
    binary_options.result,
    copied_binary_options.*
FROM
    `binary_options`
INNER JOIN copied_binary_options ON copied_binary_options.binary_option_id = binary_options.id

WHERE 
	/*binary_options.expiration_time in (1596037620000,1596037320000,1596035040000,1596034440000,1596033960000,1596034020000,1596033300000,1596033300000,1596033120000,1596030420000,1596030600000,1596030360000,1596028800000,1596028500000,1596028020000,1596028200000,1596028140000,1596028200000,1596027120000,1596026700000,1596024600000,1596024300000,1596021900000,1596021600000,1596021300000,1596020400000,1596013980000)
    AND*/ (from_best_users = 1
    OR from_best_users_copied = 1)
    AND from_performance = -1
    AND from_percentage = -1
ORDER BY binary_options.opening_time DESC

/******** OPERACIONES CON DATOS DE TARDEMOOD  ***********/
SELECT sum(profit_value), count(*), o.* FROM (
	SELECT 
		binary_options.id,
		FROM_UNIXTIME(
		    CAST(
		        binary_options.opening_time / 1000 AS INT
		    )
		) AS opened,
		FROM_UNIXTIME(
		    CAST(
		        binary_options.expiration_time / 1000 AS INT
		    )
		) AS expired,
    	second(
        	FROM_UNIXTIME(
                CAST(
                    binary_options.opening_time / 1000 AS INT
                )
            )
        ) as second_opened,
    	(
            second(
                FROM_UNIXTIME(
                    CAST(
                        binary_options.opening_time / 1000 AS INT
                    )
                )
            ) * 0.5
        ) as min_operations,    
		binary_options.active_id,
		binary_options.direction,
	    copied_binary_options.profit,
		binary_options.result as res_calc,
	    copied_binary_options.result as res_real,
	    IF(binary_options.result = 1,(1*copied_binary_options.profit/100),(IF(binary_options.result = -1,-1,0))) as profit_value,
		(binary_options.operations_up + binary_options.operations_down) as trademood_operations,
		IFNULL(((IF(binary_options.direction = 1, binary_options.operations_up, binary_options.operations_down) * 100)/(binary_options.operations_up + binary_options.operations_down)),0) as trademood_operations_percentage,
		(binary_options.amount_up + binary_options.amount_down) as trademood_amount,
		IFNULL(((IF(binary_options.direction = 1, binary_options.amount_up, binary_options.amount_down) * 100)/(binary_options.amount_up + binary_options.amount_down)),0) as trademood_amount_percentage,
	    copied_binary_options.from_percentage,
	    copied_binary_options.from_performance,
	    copied_binary_options.from_best_users,
	    copied_binary_options.from_best_users_copied
	FROM binary_options
	INNER JOIN copied_binary_options ON copied_binary_options.binary_option_id = binary_options.id
	WHERE binary_options.operations_up > 0 OR binary_options.operations_down > 0
) as o
WHERE  /*o.expired < '2020-08-06 16:00'
AND */o.expired > '2020-08-02 22:00'
AND o.trademood_operations >= 7
AND o.profit < 94
AND (o.from_best_users = 1) 
AND o.trademood_operations_percentage >= 60
AND o.trademood_amount_percentage >= 60
ORDER BY `o`.`opened` DESC



SELECT sum(profit_value), count(*), o.* FROM (
	SELECT 
		binary_options.id,
		FROM_UNIXTIME(
		    CAST(
		        binary_options.opening_time / 1000 AS INT
		    )
		) AS opened,
		FROM_UNIXTIME(
		    CAST(
		        binary_options.expiration_time / 1000 AS INT
		    )
		) AS expired,
    	second(
        	FROM_UNIXTIME(
                CAST(
                    binary_options.opening_time / 1000 AS INT
                )
            )
        ) as second_opened,
    	(
            second(
                FROM_UNIXTIME(
                    CAST(
                        binary_options.opening_time / 1000 AS INT
                    )
                )
            ) * 0.5
        ) as min_operations,    
		binary_options.active_id,
		binary_options.direction,
	    copied_binary_options.profit,
		binary_options.result as res_calc,
	    copied_binary_options.result as res_real,
	    IF(binary_options.result = 1,(1*copied_binary_options.profit/100),(IF(binary_options.result = -1,-1,0))) as profit_value,
		(binary_options.operations_up + binary_options.operations_down) as trademood_operations,
		IFNULL(((IF(binary_options.direction = 1, binary_options.operations_up, binary_options.operations_down) * 100)/(binary_options.operations_up + binary_options.operations_down)),0) as trademood_operations_percentage,
		(binary_options.amount_up + binary_options.amount_down) as trademood_amount,
		IFNULL(((IF(binary_options.direction = 1, binary_options.amount_up, binary_options.amount_down) * 100)/(binary_options.amount_up + binary_options.amount_down)),0) as trademood_amount_percentage,
	    copied_binary_options.from_percentage,
	    copied_binary_options.from_performance,
	    copied_binary_options.from_best_users,
	    copied_binary_options.from_best_users_copied
	FROM binary_options
	INNER JOIN copied_binary_options ON copied_binary_options.binary_option_id = binary_options.id
	WHERE binary_options.operations_up > 0 OR binary_options.operations_down > 0
) as o
WHERE  /*o.expired < '2020-08-06 16:00'
AND o.expired > '2020-08-05 22:00'
AND*/ o.trademood_operations >= o.min_operations
AND o.trademood_operations >= 5
AND o.min_operations > 0
AND o.profit < 95
AND (o.from_best_users = 1) 
AND o.trademood_operations_percentage >= 60
AND o.trademood_amount_percentage >= 60
ORDER BY `o`.`opened` DESC

SELECT /*SUM(profit_value_other), count(*)*/* FROM (
	SELECT * FROM (
		SELECT 
	    	b_o_1.id as id_original,
	    	b_o_2.id as id_other,
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
			b_o_1.active_id,
			b_o_1.level_open,
			b_o_1.level_close,
			b_o_1.direction,
			b_o_1.amount,
			c_b_o.profit,

			c_b_o.result as res_real,
			b_o_1.result as res_calc_original,
			b_o_2.result as res_calc_other,
	    
			IF(b_o_1.result = 1,(1*c_b_o.profit/100),(IF(b_o_1.result = -1,-1,0))) as profit_value_original,
			IF(b_o_2.result = 1,(1*c_b_o.profit/100),(IF(b_o_2.result = -1,-1,0))) as profit_value_other,
	    
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
			c_b_o.from_best_users_copied

		FROM copied_binary_options c_b_o
		INNER JOIN binary_options b_o_1 ON c_b_o.binary_option_id = b_o_1.id
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
			AND (b_o_3.operations_up + b_o_3.operations_down) >= 20
			AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 60
		    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 60
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
			b_o_1.opening_time >= UNIX_TIMESTAMP(STR_TO_DATE('2020-08-11 23:00', '%Y-%m-%d %H:%i')) * 1000 
			AND b_o_1.opening_time <= UNIX_TIMESTAMP(STR_TO_DATE('2020-08-12 16:00', '%Y-%m-%d %H:%i')) * 1000 
			AND c_b_o.from_best_users = 1
			AND c_b_o.profit < 94
		ORDER BY b_o_1.opening_time DESC
	) results GROUP BY expired, active_id ORDER BY opened DESC
) res


SELECT * FROM (
    SELECT  o.*,
            b_o.id as b_o_id,
            FROM_UNIXTIME(
                CAST(
                    b_o.opening_time / 1000 AS INT
                )
            ) AS b_o_opened,
            b_o.result as b_o_res_calc,
    		IF(b_o.result = 1,(1*o.profit/100),(IF(b_o.result = -1,-1,0))) as b_o_profit_value,
            (b_o.operations_up + b_o.operations_down) as b_o_trademood_operations,
            IFNULL(((IF(b_o.direction = 1, b_o.operations_up, b_o.operations_down) * 100)/(b_o.operations_up + b_o.operations_down)),0) as b_o_trademood_operations_percentage,
            (b_o.amount_up + b_o.amount_down) as b_o_trademood_amount,
            IFNULL(((IF(b_o.direction = 1, b_o.amount_up, b_o.amount_down) * 100)/(b_o.amount_up + b_o.amount_down)),0) as b_o_trademood_amount_percentage
    FROM (
        SELECT 
            binary_options.id,
            FROM_UNIXTIME(
                CAST(
                    binary_options.opening_time / 1000 AS INT
                )
            ) AS opened,
            FROM_UNIXTIME(
                CAST(
                    binary_options.expiration_time / 1000 AS INT
                )
            ) AS expired,
            binary_options.opening_time,
            binary_options.expiration_time,
            binary_options.active_id,
            binary_options.level_open,
            second(
                FROM_UNIXTIME(
                    CAST(
                        binary_options.opening_time / 1000 AS INT
                    )
                )
            ) as second_opened,
            (
                second(
                    FROM_UNIXTIME(
                        CAST(
                            binary_options.opening_time / 1000 AS INT
                        )
                    )
                ) * 0.5
            ) as min_operations,    
            binary_options.direction,
            copied_binary_options.profit,
            binary_options.result as res_calc,
            copied_binary_options.result as res_real,
            IF(binary_options.result = 1,(1*copied_binary_options.profit/100),(IF(binary_options.result = -1,-1,0))) as profit_value,
            (binary_options.operations_up + binary_options.operations_down) as trademood_operations,
            IFNULL(((IF(binary_options.direction = 1, binary_options.operations_up, binary_options.operations_down) * 100)/(binary_options.operations_up + binary_options.operations_down)),0) as trademood_operations_percentage,
            (binary_options.amount_up + binary_options.amount_down) as trademood_amount,
            IFNULL(((IF(binary_options.direction = 1, binary_options.amount_up, binary_options.amount_down) * 100)/(binary_options.amount_up + binary_options.amount_down)),0) as trademood_amount_percentage,
            copied_binary_options.from_percentage,
            copied_binary_options.from_performance,
            copied_binary_options.from_best_users,
            copied_binary_options.from_best_users_copied
        FROM binary_options
        INNER JOIN copied_binary_options ON copied_binary_options.binary_option_id = binary_options.id
        WHERE binary_options.operations_up > 0 OR binary_options.operations_down > 0
    ) as o
    INNER JOIN binary_options as b_o ON b_o.expiration_time = o.expiration_time
    WHERE 
    o.opened >= '2020-08-10 23:00'
    AND o.opened <= '2020-08-11 16:00'
    AND o.profit < 94
    AND (o.from_best_users = 1) 
    AND o.trademood_operations_percentage >= 60
	AND o.trademood_amount_percentage >= 60  
    AND o.direction = b_o.direction
    AND o.active_id = b_o.active_id
    AND o.opening_time <= b_o.opening_time
    AND (
        (o.direction = 1 AND b_o.level_open <= o.level_open)
        OR (o.direction = -1 AND b_o.level_open >= o.level_open)
    )
    AND minute(
        FROM_UNIXTIME(
                    CAST(
                        o.opening_time / 1000 AS INT
                    )
                )
    ) = minute (
    	FROM_UNIXTIME(
                    CAST(
                        b_o.opening_time / 1000 AS INT
                    )
                )
    )
) as o_ WHERE b_o_trademood_operations >= 8
AND b_o_trademood_operations_percentage >= 80
AND b_o_trademood_amount_percentage >= 80  
GROUP BY o_.expiration_time
ORDER BY `o_`.`b_o_opened` DESC

SELECT /*SUM(profit_value_other), count(*)*/* FROM (
	SELECT * FROM (
		SELECT 
	    	b_o_1.id as id_original,
	    	b_o_2.id as id_other,
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
			b_o_1.active_id,
			b_o_1.level_open,
			b_o_1.level_close,
			b_o_1.direction,
			b_o_1.amount,
			c_b_o.profit,

			c_b_o.result as res_real,
			b_o_1.result as res_calc_original,
			b_o_2.result as res_calc_other,
	    
			IF(b_o_1.result = 1,(1*c_b_o.profit/100),(IF(b_o_1.result = -1,-1,0))) as profit_value_original,
			IF(b_o_2.result = 1,(1*c_b_o.profit/100),(IF(b_o_2.result = -1,-1,0))) as profit_value_other,
	    
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
			c_b_o.from_best_users_copied

		FROM copied_binary_options c_b_o
		INNER JOIN binary_options b_o_1 ON c_b_o.binary_option_id = b_o_1.id AND b_o_1.active_id in (1, 2, 4, 6, 99) 
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
			/********************************/
			/********************************/
			AND (b_o_3.operations_up + b_o_3.operations_down) >= 15
            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
			AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 60
		    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 60
			/********************************/
			/********************************/
		    	
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
			b_o_1.opening_time >= UNIX_TIMESTAMP(STR_TO_DATE('2020-07-13 23:00', '%Y-%m-%d %H:%i')) * 1000 
			AND b_o_1.opening_time <= UNIX_TIMESTAMP(STR_TO_DATE('2020-08-14 16:00', '%Y-%m-%d %H:%i')) * 1000 
			AND c_b_o.from_best_users = 1
			/********************************/
			/********************************/
			AND c_b_o.profit <= 93
        	AND c_b_o.profit >= 76
			/********************************/
			/********************************/
		ORDER BY b_o_1.opening_time DESC
	) results GROUP BY expired, active_id ORDER BY opened DESC
) res WHERE tm_operations_original >= 12
		AND tm_op_percentage_original >= 40 
		AND tm_am_percentage_original >= 40 

SELECT /*SUM(profit_value_other), count(*)*/* FROM (
	SELECT * FROM (
		SELECT 
	    	b_o_1.id as id_original,
	    	b_o_2.id as id_other,
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
			b_o_1.active_id,
			b_o_1.level_open,
			b_o_1.level_close,
			b_o_1.direction,
			b_o_1.amount,
			c_b_o.profit,

			c_b_o.result as res_real,
			b_o_1.result as res_calc_original,
			b_o_2.result as res_calc_other,
	    
			IF(b_o_1.result = 1,(1*c_b_o.profit/100),(IF(b_o_1.result = -1,-1,0))) as profit_value_original,
			IF(b_o_2.result = 1,(1*c_b_o.profit/100),(IF(b_o_2.result = -1,-1,0))) as profit_value_other,
	    
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
			c_b_o.from_best_users_copied

		FROM copied_binary_options c_b_o
		INNER JOIN binary_options b_o_1 ON c_b_o.binary_option_id = b_o_1.id AND b_o_1.active_id in (1, 2, 4, 6, 99, 76, 77, 78, 80, 81, 86) 
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
				/*EUR-USD*/
				(
					b_o_1.active_id = 1
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 15
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 60
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 60
		    	)
				/*EUR-GBP*/
				OR (
					b_o_1.active_id = 2
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 15
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 80
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 80
		    	)
				/*EUR-JPY*/
				OR (
					b_o_1.active_id = 4
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 18
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 60
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 60
		    	)
				/*USD-JPY*/
				OR (
					b_o_1.active_id = 6
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 15
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 80
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 80
		    	)
				/*AUD-USD*/
				OR (
					b_o_1.active_id = 99
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 7
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 60
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 60
		    	)
				/*  */
				OR (
					b_o_1.active_id = 76
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 12
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 40
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 40
		    	)
				/*  */
				OR (
					b_o_1.active_id = 77
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 4
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 40
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 40
		    	)
				/*  */
				OR (
					b_o_1.active_id = 78
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 20
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 70
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 70
		    	)
				/*  */
				OR (
					b_o_1.active_id = 80
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 12
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 40
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 40
		    	)
				/*  */
				OR (
					b_o_1.active_id = 81
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 10
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 60
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 60
		    	)
				/*  */
				OR (
					b_o_1.active_id = 86
					AND (b_o_3.operations_up + b_o_3.operations_down) >= 15
		            AND (b_o_3.operations_up + b_o_3.operations_down) <= 1000
					AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.operations_up, b_o_3.operations_down) * 100)/(b_o_3.operations_up + b_o_3.operations_down)),0) >= 50
				    AND IFNULL(((IF(b_o_3.direction = 1, b_o_3.amount_up, b_o_3.amount_down) * 100)/(b_o_3.amount_up + b_o_3.amount_down)),0) >= 50
		    	)
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
			b_o_1.opening_time >= UNIX_TIMESTAMP(STR_TO_DATE('2020-08-15 22:00', '%Y-%m-%d %H:%i')) * 1000 
			AND b_o_1.opening_time <= UNIX_TIMESTAMP(STR_TO_DATE('2020-08-16 16:00', '%Y-%m-%d %H:%i')) * 1000 
			AND c_b_o.from_best_users = 1
			AND (
				/*EUR-USD*/
				(
					b_o_1.active_id = 1
					AND c_b_o.profit <= 93
        			AND c_b_o.profit >= 76
				)
				/*EUR-GBP*/
				OR (
					b_o_1.active_id = 2
					AND c_b_o.profit <= 82
        			AND c_b_o.profit >= 70
				)
				/*EUR-JPY*/
				OR (
					b_o_1.active_id = 4
					AND c_b_o.profit <= 93
        			AND c_b_o.profit >= 76
				)
				/*USD-JPY*/
				OR (
					b_o_1.active_id = 6
					AND c_b_o.profit <= 82
        			AND c_b_o.profit >= 70
				)
				/*AUD-USD*/
				OR (
					b_o_1.active_id = 99
					AND c_b_o.profit <= 93
        			AND c_b_o.profit >= 76
				)
				/**/
				OR (
					b_o_1.active_id = 76
					AND c_b_o.profit <= 100
        			AND c_b_o.profit >= 50
				)
				/**/
				OR (
					b_o_1.active_id = 77
					AND c_b_o.profit <= 100
        			AND c_b_o.profit >= 50
				)
				/**/
				OR (
					b_o_1.active_id = 78
					AND c_b_o.profit <= 100
        			AND c_b_o.profit >= 50
				)
				/**/
				OR (
					b_o_1.active_id = 80
					AND c_b_o.profit <= 100
        			AND c_b_o.profit >= 50
				)
				/**/
				OR (
					b_o_1.active_id = 81
					AND c_b_o.profit <= 100
        			AND c_b_o.profit >= 50
				)
				/**/
				OR (
					b_o_1.active_id = 86
					AND c_b_o.profit <= 100
        			AND c_b_o.profit >= 50
				)
			)
		ORDER BY b_o_1.opening_time DESC
	) results GROUP BY expired, active_id ORDER BY opened DESC
) res WHERE (
	/*EUR-USD*/
	(
		active_id = 1
		AND tm_operations_original >= 12
		AND tm_op_percentage_original >= 40 
		AND tm_am_percentage_original >= 40 
	)
	/*EUR-GBP*/
	OR (
		active_id = 2
		AND tm_operations_original >= 10
		AND tm_op_percentage_original >= 60 
		AND tm_am_percentage_original >= 60 
	)
	/*EUR-JPY*/
	OR (
		active_id = 4
		AND tm_operations_original >= 14
		AND tm_op_percentage_original >= 60 
		AND tm_am_percentage_original >= 60 
	)
	/*USD-JPY*/
	OR (
		active_id = 6
		AND tm_operations_original >= 6
		AND tm_op_percentage_original >= 60 
		AND tm_am_percentage_original >= 60 
	)
	/*AUD-USD*/
	OR (
		active_id = 99
		AND tm_operations_original >= 4
		AND tm_op_percentage_original >= 60 
		AND tm_am_percentage_original >= 70 
	)
	/**/
	OR (
		active_id = 76
		AND tm_operations_original >= 4
		AND tm_op_percentage_original >= 40 
		AND tm_am_percentage_original >= 40 
	)
	/**/
	OR (
		active_id = 77
		AND tm_operations_original >= 3
		AND tm_op_percentage_original >= 40 
		AND tm_am_percentage_original >= 40 
	)
	/**/
	OR (
		active_id = 78
		AND tm_operations_original >= 12
		AND tm_op_percentage_original >= 70 
		AND tm_am_percentage_original >= 70 
	)
	/**/
	OR (
		active_id = 80
		AND tm_operations_original >= 12
		AND tm_op_percentage_original >= 40 
		AND tm_am_percentage_original >= 40 
	)
	/**/
	OR (
		active_id = 81
		AND tm_operations_original >= 10
		AND tm_op_percentage_original >= 60 
		AND tm_am_percentage_original >= 60 
	)
	/**/
	OR (
		active_id = 86
		AND tm_operations_original >= 10
		AND tm_op_percentage_original >= 50
		AND tm_am_percentage_original >= 50
	)
)


SELECT 
FROM_UNIXTIME(
    CAST(
        binary_options.opening_time / 1000 AS INT
    )
) AS opened,
FROM_UNIXTIME(
    CAST(
        binary_options.expiration_time / 1000 AS INT
    )
) AS expired,
binary_options.active_id,
binary_options.level_open,
binary_options.level_close,
binary_options.result as res_calc,
copied_binary_options.*
FROM `copied_binary_options`
INNER JOIN binary_options ON copied_binary_options.binary_option_id = binary_options.id  
ORDER BY `copied_binary_options`.`id`  DESC


SELECT
    *
FROM
    (
    SELECT
        binary_options.result result_calc,
        (
            binary_options.operations_up + binary_options.operations_down
        ) AS trademood_operations,
        IFNULL(
            (
                (
                    IF(
                        binary_options.direction = 1,
                        binary_options.operations_up,
                        binary_options.operations_down
                    ) * 100
                ) /(
                    binary_options.operations_up + binary_options.operations_down
                )
            ),
            0
        ) AS trademood_operations_percentage,
        (
            binary_options.amount_up + binary_options.amount_down
        ) AS trademood_amount,
        IFNULL(
            (
                (
                    IF(
                        binary_options.direction = 1,
                        binary_options.amount_up,
                        binary_options.amount_down
                    ) * 100
                ) /(
                    binary_options.amount_up + binary_options.amount_down
                )
            ),
            0
        ) AS trademood_amount_percentage,
        FROM_UNIXTIME(
            CAST(
                binary_options.expiration_time / 1000 AS INT
            )
        ) AS expired,
        (
            binary_options.expiration_time - binary_options.opening_time
        ) / 1000 AS seconds_to_expired,
        binary_options.active_id,
        copied_binary_options.*
    FROM
        `copied_binary_options`
    INNER JOIN binary_options ON copied_binary_options.binary_option_id = binary_options.id
    WHERE
        from_best_users = 1 AND hit_percentage > 50 AND from_performance = -1 AND from_percentage = -1 AND from_best_users_copied = -1 AND operations >= 20
    GROUP BY
        binary_options.expiration_time,
        binary_options.active_id
) t
WHERE
    (t.trademood_operations_percentage >= 70 AND t.trademood_amount_percentage >= 70) AND t.trademood_operations >= 5  AND t.profit <= 90
ORDER BY `t`.`expired` DESC


/*  RESULTADOS PARA BEST USERS  */
SELECT * FROM (SELECT 
	from_unixtime(CAST(binary_options.opening_time/1000 as INT)) as open,
	from_unixtime(CAST(binary_options.expiration_time/1000 as INT)) as expired,
	binary_options.expiration_time, 
    binary_options.result, 
    binary_options.active_id,
    copied_binary_options.operations,
    copied_binary_options.profit,
    IF(binary_options.result = 1, 1 * copied_binary_options.profit / 100,
    IF(binary_options.result = -1, -1, 0)) as profit_value
FROM `copied_binary_options`
	INNER JOIN binary_options ON copied_binary_options.binary_option_id = binary_options.id
	WHERE from_best_users = 1 
               AND (                   
                   (
                       binary_options.active_id = 1
	                   AND operations >= 60
                   )
                   OR
                   (
                       binary_options.active_id = 99
	                   AND operations >= 40
                   )
                   OR
                   (
                       binary_options.active_id = 5
	                   AND operations >= 40
                   )
               )
	GROUP BY binary_options.expiration_time, binary_options.active_id  
	ORDER BY `open` DESC) results  
ORDER BY `results`.`expired`  DESC