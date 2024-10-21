const mysql = require('mysql2/promise');

async function salvarDadosMysql(dados, connParams) {
    const connection = await mysql.createConnection(connParams);

    try {
        for (const dado of dados) {
            await connection.execute(`
                INSERT INTO weather_data (country, date, description)
                VALUES (?, ?, ?)
            `, [dado.country, dado.date, dado.text]);
        }
        console.log('Dados inseridos com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar dados no MySQL:', error.message);
    } finally {
        await connection.end();
    }
}

const dados = [
    {
        country: "BR",
        date: "2024-03-31",
        text: "A Zona de Convergência Intertropical (ZCIT) está ativa e espalha nuvens carregadas pelo RN e o norte do CE. Uma nova frente fria já começa a influenciar o tempo no RS. No começo da tarde deste domingo (31), pancadas de chuva eram observadas na fronteira com o Uruguai. Até à noite, as pancadas de chuva se espalham por mais áreas do estado. Uma área de baixa pressão no Paraguai, associado a um cavado nos níveis médios da atmosfera, estimula a formação de nuvens carregadas em MS."
    }
];

const connParams = {
    host: '34.206.117.8',
    user: 'admin',
    database: 'llabsrdspgdbapps',
    password: 'llabs1278',
    port: 3306,
};

salvarDadosMysql(dados, connParams);
