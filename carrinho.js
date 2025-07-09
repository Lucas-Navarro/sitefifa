document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('contador__carrinho');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button'); //

    let cart = [];

    // Carrega o carrinho do localStorage
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('leroFifaCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        } else {
            cart = [];
        }
        updateCartCount();
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

    // Calcula o total do carrinho
    function calculateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Renderiza os itens no container do carrinho
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            cartTotalElement.textContent = 'R$ 0,00';
            checkoutButton.disabled = true;
            return;
        } else {
            checkoutButton.disabled = false;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.dataset.id = item.id;

            let platformLogo = '';
            if (item.platform === 'PSN') {
                platformLogo = '<img src="img/psnlogo.png" alt="Logo PSN" class="cart-item-logo">';
            } else if (item.platform === 'Xbox') {
                platformLogo = '<img src="img/logoxbox.png" alt="Logo Xbox" class="cart-item-logo">';
            }

            itemElement.innerHTML = `
                <div class="cart-item-info">
                    ${platformLogo}
                    <h4>${item.name}</h4>
                    <p>Preço unitário: ${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remover</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = calculateCartTotal();
        addCartItemListeners();
    }

    // Adiciona listeners para os botões de controle de quantidade e remover
    function addCartItemListeners() {
        const removeItemButtons = document.querySelectorAll('.remove-item-btn');
        const decreaseQuantityButtons = document.querySelectorAll('.decrease-quantity');
        const increaseQuantityButtons = document.querySelectorAll('.increase-quantity');

        removeItemButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.id;
                cart = cart.filter(item => item.id !== itemId);
                saveCartToLocalStorage();
                renderCartItems();
                updateCartCount();
            });
        });

        decreaseQuantityButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.id;
                const itemToUpdate = cart.find(item => item.id === itemId);
                if (itemToUpdate && itemToUpdate.quantity > 1) {
                    itemToUpdate.quantity--;
                    saveCartToLocalStorage();
                    renderCartItems();
                    updateCartCount();
                } else if (itemToUpdate && itemToUpdate.quantity === 1) {
                    cart = cart.filter(item => item.id !== itemId);
                    saveCartToLocalStorage();
                    renderCartItems();
                    updateCartCount();
                }
            });
        });

        increaseQuantityButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.id;
                const itemToUpdate = cart.find(item => item.id === itemId);
                if (itemToUpdate) {
                    itemToUpdate.quantity++;
                    saveCartToLocalStorage();
                    renderCartItems();
                    updateCartCount();
                }
            });
        });
    }

    // --- Ação de Finalizar Compra com Mercado Pago (Chama o seu novo Backend) ---
    checkoutButton.addEventListener('click', async () => { //
        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione itens antes de finalizar a compra.');
            return;
        }

        // Prepara os itens para enviar ao seu backend
        const itemsToSend = cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            platform: item.platform
        }));

        try {
            // **Chamada para o seu backend Node.js**
            // A URL deve ser a do seu servidor e o endpoint que você criou.
            // Se o frontend e o backend estiverem no mesmo host/porta, pode ser um caminho relativo.
            const response = await fetch('http://localhost:6969/create-mercadopago-preference', { // Caminho relativo se o server.js servir o frontend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: cart }) // Envia os itens para o backend
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao chamar o backend para Mercado Pago:', errorData);
                alert('Ocorreu um erro ao tentar finalizar a compra. Por favor, tente novamente.');
                return;
            }

            const data = await response.json();
            const init_point = data.init_point; // Recebe a URL de checkout do seu backend

            if (init_point) {
                window.location.href = init_point; // Redireciona para o checkout do Mercado Pago
                saveCartToLocalStorage();
                renderCartItems();
                updateCartCount();
            } else {
                alert('Não foi possível obter a URL de pagamento do Mercado Pago.');
            }

        } catch (error) {
            console.error('Erro na requisição para o backend:', error);
            alert('Ocorreu um erro de rede ao tentar finalizar a compra. Por favor, verifique sua conexão.');
        }
    });

    // --- Inicialização da Página do Carrinho ---
    loadCartFromLocalStorage();
    renderCartItems();
});