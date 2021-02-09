/**
 * Vista para generar un ranking que se ordena por el valor de rendimiento 
 * calculado para cada usuario
 */
CREATE VIEW ranking_performance AS
ALTER VIEW ranking_performance AS
SELECT 
	b_u.broker_id,  
	b_u.performance_1 as performance,  
	b_u.operations_1 as operations,  
	b_u.avg_amount_1 as avg,
	b_u.hit_percentage_1 as hit_percentage
FROM broker_users as b_u 
WHERE b_u.operations_1 > 4 AND b_u.performance_1 >= 1000 ORDER BY b_u.performance_1 DESC





/**
 * Vista para generar un ranking que se ordena por el porcentaje de acierto
 * calculado para cada usuario
 */
CREATE VIEW ranking_percentage AS
ALTER VIEW ranking_percentage AS
SELECT 
	b_u.broker_id,  
	b_u.performance_2 as performance,  
	b_u.operations_2 as operations,  
	b_u.avg_amount_2 as avg,
	b_u.hit_percentage_2 as hit_percentage
FROM broker_users as b_u 
WHERE b_u.operations_2 > 7 AND b_u.hit_percentage_2 >= 87 ORDER BY b_u.hit_percentage_2 DESC, b_u.performance_2 DESC




/**
 * Vista para obtener los usuarios cuyas operaciones han sido copiadas
 * y se han obtenido buenos resultados
 */
CREATE VIEW best_users_copied AS
ALTER VIEW best_users_copied AS
SELECT 
	broker_id,
	id as broker_user_id,
	copied_operations as operations ,
	copies_win as win,
	copies_loose as loose,
	copies_equal as equal,
	copies_min_amount as min_amount,
	copies_hit_percentage as hit_percentage
FROM broker_users 
WHERE copied_operations > 5 AND copies_hit_percentage >= 75
ORDER BY copies_hit_percentage DESC

/*SELECT * FROM (
	SELECT best_users_aux.*, ((best_users_aux.win * 100)/best_users_aux.operations) as hit_percentage FROM (
		SELECT 
			broker_users.broker_id,
			b_o.broker_user_id,
			(
				SELECT count(c_b_o_o.id) FROM copied_binary_options c_b_o_o 
				INNER JOIN binary_options ON c_b_o_o.binary_option_id = binary_options.id 
				WHERE binary_options.broker_user_id = b_o.broker_user_id
			) as operations,
			(
				SELECT count(c_b_o_o.id) FROM copied_binary_options c_b_o_o 
				INNER JOIN binary_options ON c_b_o_o.binary_option_id = binary_options.id 
				WHERE binary_options.broker_user_id = b_o.broker_user_id
				AND binary_options.result = 1
			) as win,
			(
				SELECT count(c_b_o_o.id) FROM copied_binary_options c_b_o_o 
				INNER JOIN binary_options ON c_b_o_o.binary_option_id = binary_options.id 
				WHERE binary_options.broker_user_id = b_o.broker_user_id
				AND binary_options.result = -1
			) as loose,
			(
				SELECT count(c_b_o_o.id) FROM copied_binary_options c_b_o_o 
				INNER JOIN binary_options ON c_b_o_o.binary_option_id = binary_options.id 
				WHERE binary_options.broker_user_id = b_o.broker_user_id
				AND binary_options.result = 0
			) as equal,
			(
				SELECT MIN(binary_options.amount) FROM copied_binary_options c_b_o_o 
				INNER JOIN binary_options ON c_b_o_o.binary_option_id = binary_options.id 
				WHERE binary_options.broker_user_id = b_o.broker_user_id
			) as min_amount
		FROM copied_binary_options c_b_o
		INNER JOIN binary_options b_o ON c_b_o.binary_option_id = b_o.id
		INNER JOIN broker_users ON b_o.broker_user_id = broker_users.id
		GROUP BY broker_users.broker_id
	) as best_users_aux
) as best_users_copied WHERE best_users_copied.operations > 3 AND best_users_copied.hit_percentage > 70
ORDER BY best_users_copied.hit_percentage DESC
*/




/**
 * Vista para obtener los usuarios cuyas operaciones han sido más acertadas
 */
CREATE VIEW best_users AS
ALTER VIEW best_users AS
SELECT 
	broker_users.broker_id,
	broker_users.id as broker_user_id, 
	broker_users.operations, 
	broker_users.hit_percentage 
FROM broker_users 
WHERE operations > 15 AND hit_percentage >= 80  
ORDER BY hit_percentage DESC




/*Ver operaciones copiadas*/
SELECT * FROM (
	SELECT 

		copied_binary_options.id, 
		copied_binary_options.sent,
		broker_users.broker_id as b_i_user, 
		copied_binary_options.broker_id as b_i_operation, 
		binary_options.type,
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
WHERE expired >= '2020-05-12'
AND b_i_user IN (16906640,23364181,23776074,52232030,56677197,62360643,62690674,62763002,65672768,65797103,66154881,67675768)
ORDER BY id DESC