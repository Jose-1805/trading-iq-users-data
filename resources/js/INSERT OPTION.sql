let params_server_op = {
    active_id: 1,
    active_name: "EUR/USD",
    active_image: "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png",
    expiration_time: 1598477100,
    direction: -1
}

fetch(domain_server+"/api/option-trader", {
    method: 'POST',
    body: JSON.stringify(params_server_op),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
})


INSERT INTO options (active_id, active_name, active_image, expiration_time, direction, commission_paid, user_id) VALUES (1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1598477100, -1, -1, 47)

select user_licenses.id as user_license,  users_start_trading.id as user_start_trading from users_start_trading IN
NER JOIN users ON users_start_trading.user_id = users.id INNER JOIN user_licenses ON users.id = user_licenses.user_id whe
re users_start_trading.stop is null order by user_licenses.id;

INSERT INTO options (option_broker_id, active_id, active_name, active_image, level, amount, profit_percentage, profit_value, result, expiration_time, direction, commission_paid, is_demo, user_id, user_start_trading_id, parent_option_id, user_license_id) values
(69982508070002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4075, 9342, 99),
(69982508200002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4076, 9342, 105),
(69941666940002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4077, 9342, 106),
(69982508140002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4079, 9342, 112),
(69982507930002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4078, 9342, 114),
(69982508100002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4080, 9342, 116),
(69982507850002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4081, 9342, 124),
(69982508060002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4082, 9342, 128),
(69982507900002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4083, 9342, 135),
(69982507950002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4085, 9342, 136),
(69982508000002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4084, 9342, 144),
(69982507960002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, -1, NULL, 4088, 9342, 149),
(69982507890002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4087, 9342, 151),
(69982508090002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4090, 9342, 167),
(69982508150002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4094, 9342, 184),
(69982508190002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4089, 9342, 185),
(69982508220002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4092, 9342, 202),
(69982508170002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4091, 9342, 212),
(69982508080002, 1, "EUR/USD", "https://static.cdnpub.info/files/storage/public/5a/c8/f1a43625d.png", 1.1823, 1, 89, -1, -1, 1598477100, -1, -1, 1, NULL, 4093, 9342, 214);

