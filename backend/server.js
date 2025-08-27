// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); 

const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
const port = 6969; 

app.use(bodyParser.json());

// Habilitar CORS (Cross-Origin Resource Sharing) se seu frontend estiver em um domínio diferente
// Para desenvolvimento, você pode permitir todas as origens, mas em produção, restrinja-o ao domínio do seu frontend.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Substitua * pelo seu domínio de frontend em produção
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

// Middleware para servir arquivos estáticos (se server.js estiver em 'backend/', serve a pasta pai)
// Isso é crucial para que seu HTML, CSS e JS do frontend sejam acessíveis
app.use(express.static(__dirname + '/../')); // Serve todos os arquivos da pasta raiz do projeto
app.use('/pages', express.static(__dirname + '/../pages')); // Serve arquivos da subpasta 'pages'
app.use('/img', express.static(__dirname + '/../img'));     // Serve arquivos da subpasta 'img'
app.use('/css', express.static(__dirname + '/../css'));     // Serve arquivos da subpasta 'css'

app.post('/send-email', async (req, res) => {
    const { nome, email, telefone, plataforma, quantidadeCoins } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail', // 'gmail' ou use 'host' e 'port'
        auth: {
            user: process.env.EMAIL_USER,    
            pass: process.env.EMAIL_PASS     
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'lucasr6out@gmail.com', 
        subject: 'Novo Formulário de Contato do Site',
        html: `
            <p>Você recebeu uma nova mensagem do formulário de contato:</p>
            <ul>
                <li><strong>Nome:</strong> ${nome}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Telefone:</strong> ${telefone}</li>
                <li><strong>Plataforma:</strong> ${plataforma}</li>
                <li><strong>Quantidade de Coins:</strong> ${quantidadeCoins}</li>
            </ul>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso');
        res.status(200).send('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).send('Erro ao enviar e-mail. Por favor, tente novamente mais tarde.');
    }
});

app.post('/create-mercadopago-preference', async (req, res) => {
    try {
        const { items } = req.body; 

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Nenhum item válido foi fornecido para criar a preferência.' });
        }

        const preferenceItems = items.map(item => ({
            id: item.id,
            title: item.name,        
            quantity: item.quantity,
            unit_price: parseFloat(item.price) 
        }));

        const preferenceBody = {
            items: preferenceItems,
            back_urls: {
                success: "http://localhost:6969/paginaspagamento/success.html", 
                failure: "http://localhost:6969/paginaspagamento/failure.html", 
                pending: "http://localhost:6969/paginaspagamento/pending.html"  
            }
        };

        const preference = new Preference(client);
        const result = await preference.create({ body: preferenceBody });

        console.log('Preferência do Mercado Pago criada:', result);
        res.status(200).json({ init_point: result.init_point });

    } catch (error) {
        console.error('Erro ao criar preferência do Mercado Pago:', error);
        res.status(500).json({ error: 'Erro interno ao processar pagamento.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});