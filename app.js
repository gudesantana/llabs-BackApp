const axios = require('axios');
const { Client } = require('pg');
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

// Função para salvar dados no PostgreSQL
async function salvarDadosPostgresql(dados, connParams) {
    const client = new Client(connParams);
    await client.connect();

    try {
        for (const dado of dados) {
            await client.query(`
                INSERT INTO previsao_tempo (data, temperatura, descricao)
                VALUES ($1, $2, $3)
            `, [new Date(), dado.temperature, dado.description]);
        }
    } catch (error) {
        throw new Error('Erro ao salvar dados no PostgreSQL');
    } finally {
        await client.end();
    }
}

// Endpoint para buscar e salvar dados
app.get('/atualizar-previsao', async (req, res) => {
    const apiUrl = 'https://api.climatempo.com.br/v1/forecast?city=Belo Horizonte&key=YOUR_API_KEY';
    const connParams = {
        user: 'postgres',
        host: 'llabsrdspgdb.cj0iow28m1f5.us-east-1.rds.amazonaws.com',
        database: 'llabsrdspgdbapps',
        password: 'xxx',
        port: 5432,
    };

    try {
        const dados = await buscarDadosClimatempo(apiUrl);
        await salvarDadosPostgresql(dados, connParams);
        res.send('Dados salvos com sucesso!');
    } catch (error) {
        res.status(500).send(`Erro: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
