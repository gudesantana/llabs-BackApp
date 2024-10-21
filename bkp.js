const axios = require('axios');
const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Função para buscar dados do Climatempo
async function buscarDadosClimatempo(apiUrl) {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar dados da API');
    }
}

// Função para salvar dados no MySQL
async function salvarDadosMysql(dados, connParams) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(connParams);

    try {
        for (const dado of dados) {
            await connection.execute(`
                INSERT INTO weather_data (country, date, description)
                VALUES (?, ?, ?)
            `, [dado.country, dado.date, dado.text]);
        }
    } catch (error) {
        throw new Error('Erro ao salvar dados no MySQL: ' + error.message);
    } finally {
        await connection.end();
    }
}

// URL da API do Climatempo (exemplo)
const apiUrl = 'http://apiadvisor.climatempo.com.br/api/v1/anl/synoptic/locale/BR?token=dbb770dd72b02812c430b49d7ab394ea';

// Parâmetros de conexão com o MySQL
const connParams = {
    host: '34.206.117.8',
    user: 'admin',
    database: 'llabsrdspgdbapps',
    password: 'llabs1278',
    port: 3306,
    ssl: {
        rejectUnauthorized: false
    }
};

// Endpoint para atualizar a previsão
app.get('/atualizar-previsao', async (req, res) => {
    try {
        const dados = await buscarDadosClimatempo(apiUrl);
        await salvarDadosMysql(dados, connParams);
        res.send('Dados salvos com sucesso!');
    } catch (error) {
        res.status(500).send(`Erro: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
