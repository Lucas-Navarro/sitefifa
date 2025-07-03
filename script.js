document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('contador__carrinho');
    const addToCartButtons = document.querySelectorAll('.botao__comprar'); 
    const cartIconLink = document.getElementById('icon__carrinho'); 

    let carrinho = []; 

    // --- Funções de Utilitário ---

    // Carrega o carrinho do localStorage
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('leroFifaCart');
        if (storedCart) {
            carrinho = JSON.parse(storedCart);
        } else {
            carrinho = []; // Garante que o carrinho esteja vazio se não houver nada no localStorage
        }
        updateCartCount(); // Atualiza a contagem no cabeçalho ao carregar
    }

    // Salva o carrinho no localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('leroFifaCart', JSON.stringify(carrinho));
    }

    // Atualiza a contagem de itens no cabeçalho
    function updateCartCount() {
        const totalItems = carrinho.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    // Adicionar item ao carrinho
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.estilo__coins'); // Pega o LI pai
            if (!productElement) {
                console.error("Não foi possível encontrar o elemento pai do produto.");
                return;
            }

            const productId = productElement.dataset.id;
            const productName = productElement.dataset.name;
            const productPrice = parseFloat(productElement.dataset.price);
            const productPlatform = productElement.dataset.platform;

            // Verifica se o item já existe no carrinho
            const existingItem = carrinho.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++; // Se existe, apenas incrementa a quantidade
            } else {
                // Se não existe, adiciona o novo item
                carrinho.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    platform: productPlatform,
                    quantity: 1
                });
            }

            saveCartToLocalStorage();    // Salva o carrinho
            updateCartCount();           // Atualiza a contagem no cabeçalho
            alert(`"${productName}" adicionado ao carrinho!`); // Feedback para o usuário
            console.log('Carrinho atual:', carrinho);
        });
    });

    // --- Inicialização ---
    loadCartFromLocalStorage(); // Carrega o carrinho quando a página é carregada pela primeira vez
});

// script.js

// Dados DEFINIDOS para o gráfico
const graficoCoins = {
    labels: ['2016','2017','2018','2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [{
        label: 'Desempenho Anual em vendas de coins',
        data: [190,233,240,223, 200, 401, 320, 468, 512, 713], // Seus valores pré-definidos aqui
        backgroundColor: [
            'rgba(255, 99, 132, 0.6)', 
            'rgba(54, 162, 235, 0.6)',  
            'rgba(255, 206, 86, 0.6)',  
            'rgba(75, 192, 192, 0.6)',  
            'rgba(153, 102, 255, 0.6)', 
            'rgba(255, 159, 64, 0.6)',  
            'rgba(255, 255, 255, 0.6)',
        ]
    }]
};

// Opções do gráfico (para controle de animação e aparência)
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Valores em Milhões',
                color: '#fff'
            },
            ticks: {
                color: '#fff'
            }
            
        },
        x: {
            title: {
                display: true,
                text: 'Anos',
                color: '#fff'
            },
            ticks: {
                color: '#fff'
            }
        }
    },
    plugins: {
        tooltip: {
            enabled: true,
        },
        legend: {
            display: true, 
            position: 'top',
        }
    },
    animation: {
        duration: 1500, 
        easing: 'easeInOutQuad'
    }
};

const ctx = document.getElementById('graficoCoins').getContext('2d');

let graficoCoinss = new Chart(ctx, {
    type: 'bar', 
    data: graficoCoins,
    options: chartOptions
});