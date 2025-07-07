document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('contador__carrinho');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = [];

    // Carrega o carrinho do localStorage
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('leroFifaCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        } else {
            cart = [];
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

    // Calcula o total do carrinho
    function calculateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Renderiza os itens no container do carrinho
    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Limpa a lista atual

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            cartTotalElement.textContent = 'R$ 0,00';
            checkoutButton.disabled = true; // Desabilita o botão de finalizar se o carrinho estiver vazio
            return;
        } else {
            checkoutButton.disabled = false; // Habilita se tiver itens
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.dataset.id = item.id; // Adiciona o ID para fácil manipulação

            // Verifica qual logo exibir baseado na plataforma
            let platformLogo = '';
            if (item.platform === 'PSN') {
                platformLogo = '<img src="img/psnlogo.png" alt="Logo PSN" class="cart-item-logo">';
            } else if (item.platform === 'Xbox') {
                platformLogo = '<img src="img/logoxbox.png" alt="Logo Xbox" class="cart-item-logo">';
            }

            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <img src="img/fifacoins.png" alt="Logo LeroCoins" class="img__carrinho">
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

        // Atualiza o total
        cartTotalElement.textContent = calculateCartTotal();
        addCartItemListeners(); // Adiciona listeners aos botões de cada item
    }

    // Adiciona listeners para os botões de controle de quantidade e remover
    function addCartItemListeners() {
        const removeItemButtons = document.querySelectorAll('.remove-item-btn');
        const decreaseQuantityButtons = document.querySelectorAll('.decrease-quantity');
        const increaseQuantityButtons = document.querySelectorAll('.increase-quantity');

        removeItemButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.id;
                cart = cart.filter(item => item.id !== itemId); // Remove o item do array
                saveCartToLocalStorage();
                renderCartItems(); // Re-renderiza para atualizar a lista
                updateCartCount(); // Atualiza o contador do header
            });
        });

        decreaseQuantityButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.id;
                const itemToUpdate = cart.find(item => item.id === itemId);
                if (itemToUpdate && itemToUpdate.quantity > 1) {
                    itemToUpdate.quantity--;
                    saveCartToLocalStorage();
                    renderCartItems(); // Re-renderiza
                    updateCartCount(); // Atualiza o contador do header
                } else if (itemToUpdate && itemToUpdate.quantity === 1) {
                    // Se a quantidade for 1 e diminuir, remove o item
                    cart = cart.filter(item => item.id !== itemId);
                    saveCartToLocalStorage();
                    renderCartItems(); // Re-renderiza
                    updateCartCount(); // Atualiza o contador do header
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
                    renderCartItems(); // Re-renderiza
                    updateCartCount(); // Atualiza o contador do header
                }
            });
        });
    }

    // --- Inicialização da Página do Carrinho ---
    loadCartFromLocalStorage(); // Carrega o carrinho ao abrir a página
    renderCartItems();           // Renderiza os itens na página
});