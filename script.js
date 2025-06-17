document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos DOM ---
    const cartCountElement = document.getElementById('contador__carrinho');
    const addToCartButtons = document.querySelectorAll('.botao__comprar'); // Seleciona todos os botões de comprar
    const cartIconLink = document.getElementById('icon__carrinho'); // O link do ícone do carrinho no header

    // --- Variáveis de Estado do Carrinho ---
    let cart = []; // Array para armazenar os itens do carrinho

    // --- Funções de Utilitário ---

    // Carrega o carrinho do localStorage
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('leroFifaCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        } else {
            cart = []; // Garante que o carrinho esteja vazio se não houver nada no localStorage
        }
        updateCartCount(); // Atualiza a contagem no cabeçalho ao carregar
    }

    // Salva o carrinho no localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('leroFifaCart', JSON.stringify(cart));
    }

    // Atualiza a contagem de itens no cabeçalho
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    // --- Event Listeners ---

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
            // Garante que o preço seja um número. Substitui vírgula por ponto se necessário.
            const productPrice = parseFloat(productElement.dataset.price);
            const productPlatform = productElement.dataset.platform;

            // Verifica se o item já existe no carrinho
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++; // Se existe, apenas incrementa a quantidade
            } else {
                // Se não existe, adiciona o novo item
                cart.push({
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
            console.log('Carrinho atual:', cart);
        });
    });

    // --- Inicialização ---
    loadCartFromLocalStorage(); // Carrega o carrinho quando a página é carregada pela primeira vez
});