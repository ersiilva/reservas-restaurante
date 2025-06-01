const form = document.getElementById('reservationForm');

const popupOverlay = document.getElementById('popupOverlay');
const popupMessage = document.getElementById('popupMessage');
const closePopupButton = document.getElementById('closePopupButton');
const popupOkButton = document.getElementById('popupOkButton');
const whatsappShareButton = document.getElementById('whatsappShareButton'); // Certifique-se que este ID está no seu HTML

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw9guma6NmDhsGI38WM9-MWTsS2c1oQjXA4ctGfnlrsUPSjMu-U03ennozfyvz2hIP9/exec'; // Verifique se este é o URL mais recente do seu Apps Script    

// NOVO: NÚMERO DO WHATSAPP DO RESTAURANTE PARA O LINK DIRETO (SEM SÍMBOLOS)
// *** MUDE ESTE NÚMERO PARA O WHATSAPP REAL DO SEU RESTAURANTE ***
const RESTAURANT_WHATSAPP_NUMBER_FRONTEND = '558835216126'; // Ex: 55 (Brasil) 88 (DDD) 35216126
// NOVO: MENSAGEM PADRÃO DO WHATSAPP PARA O RESTAURANTE
const DEFAULT_WHATSAPP_MESSAGE = encodeURIComponent('Olá! Um novo pedido de reserva foi feita pelo site.');


// NOVO: LISTA DE DATAS BLOQUEADAS (Formato: 'YYYY-MM-DD')
// Ajuste estas datas conforme necessário.
const BLOCKED_DATES = [
    '2025-06-12', // Dia dos namorados
    '2025-12-25',  // Natal
    '2025-12-31',  // Virada ne ano
  ];
  
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Resetar o link do WhatsApp para garantir que não use um link antigo e esconde o botão
    if (whatsappShareButton) {
        whatsappShareButton.style.display = 'none'; // Esconde o botão antes de processar
        // Define o link padrão para o WhatsApp do restaurante com a mensagem padrão
        whatsappShareButton.href = `https://api.whatsapp.com/send?phone=${RESTAURANT_WHATSAPP_NUMBER_FRONTEND}&text=${DEFAULT_WHATSAPP_MESSAGE}`;
    }

    const formData = {
        nome: document.getElementById('nome').value,
        whatsapp: document.getElementById('whatsapp').value,
        dataReserva: document.getElementById('dataReserva').value, // Formato YYYY-MM-DD
        horaChegada: document.getElementById('horaChegada').value,   // Formato HH:MM
        quantidadePessoas: parseInt(document.getElementById('quantidadePessoas').value),
        observacao: document.getElementById('observacao').value
    };

    console.log('Dados do formulário para envio:', formData);

    // --- VALIDAÇÕES ---
    // Validação de campos obrigatórios e quantidade de pessoas
    if (!formData.nome || !formData.whatsapp || !formData.dataReserva || !formData.horaChegada || isNaN(formData.quantidadePessoas) || formData.quantidadePessoas <= 0) {
        showMessage('Por favor, preencha todos os campos obrigatórios e a quantidade de pessoas deve ser um número válido e no mínimo 1.', 'error');
        return;
    }

    // Validação de data e hora no passado
    const now = new Date();
    // Garante que a data e hora sejam interpretadas corretamente no fuso horário local
    const reservaDateTime = new Date(`${formData.dataReserva}T${formData.horaChegada}:00`);

    if (reservaDateTime < now) {
        showMessage('A data e hora da reserva não podem ser no passado. Por favor, escolha uma data e hora futura.', 'error');
        return;
    }

    // Validação de data bloqueada
    if (BLOCKED_DATES.includes(formData.dataReserva)) {
        showMessage('Ops! Nesta data, não estamos aceitando reservas. Por favor, escolha outra data.', 'error');
        return; // Impede o envio do formulário
    }
    // --- FIM DAS VALIDAÇÕES ---

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Mantido 'no-cors' para a alternativa simples. Não permite ler a resposta do Apps Script.
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Como mode é 'no-cors', não podemos ler a resposta real do Apps Script.
        // Assumimos sucesso se a requisição de rede não falhar.
        showMessage('Pedido de reserva enviado! Assim que possível, entraremos em contato!', 'success');
        form.reset();

        // NOVO: EXIBE O BOTÃO DO WHATSAPP APÓS O ENVIO (Assumindo sucesso)
        if (whatsappShareButton) {
            whatsappShareButton.style.display = 'none';
             // inline-block Torna o botão visível
             // none Torna o botão invisível
        }

    } catch (error) {
        console.error('Erro ao enviar a reserva:', error);
        showMessage('Ocorreu um erro ao enviar sua reserva. Tente novamente mais tarde.', 'error');
    }
});

// A função showMessage agora mostrará o popup
function showMessage(msg, type) {
    popupMessage.textContent = msg;

    // Altera a cor e o texto do botão OK do popup e controla a visibilidade do botão WhatsApp
    if (type === 'error') {
        popupOkButton.style.backgroundColor = '#f44336'; // Vermelho para erro
        popupOkButton.textContent = 'Entendi'; // Texto mais adequado para erro
        if (whatsappShareButton) {
            whatsappShareButton.style.display = 'none'; // Oculta o botão do WhatsApp em caso de erro
        }
    } else { // type === 'success'
        popupOkButton.style.backgroundColor = '#4CAF50'; // Verde para sucesso
        popupOkButton.textContent = 'OK'; // Texto padrão para sucesso
        // O botão do WhatsApp é exibido no bloco try/catch após o envio bem-sucedido
    }

    popupOverlay.style.display = 'flex'; // Exibe o popup
}

// Ouvintes para fechar o popup
closePopupButton.addEventListener('click', () => {
    popupOverlay.style.display = 'none'; // Esconde o popup
    if (whatsappShareButton) {
        whatsappShareButton.style.display = 'none'; // Esconde o botão do WhatsApp ao fechar
    }
});

popupOkButton.addEventListener('click', () => {
    popupOverlay.style.display = 'none'; // Esconde o popup
    if (whatsappShareButton) {
        whatsappShareButton.style.display = 'none'; // Esconde o botão do WhatsApp ao fechar
    }
});

// Código para formatação do WhatsApp
const whatsappInput = document.getElementById('whatsapp');

if (whatsappInput) { // Adicionado verificação para garantir que o elemento existe
    whatsappInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue += '(' + value.substring(0, 2);
        }
        if (value.length > 2) {
            formattedValue += ') ' + value.substring(2, 7);
        }
        if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 11);
        }
        if (value.length > 11) {
            formattedValue =
                '(' +
                value.substring(0, 2) +
                ') ' +
                value.substring(2, 3) +
                ' ' +
                value.substring(3, 7) +
                '-' +
                value.substring(7, 11);
        }

        e.target.value = formattedValue;
    });
}
