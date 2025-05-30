const form = document.getElementById('reservationForm');
const messageDiv = document.getElementById('message');

// ... (código existente do script.js) ...

// Adicione esta seção de código abaixo da sua função showMessage ou no final do arquivo
// MAS ANTES do fechamento do <script> se estivesse em um HTML, ou simplesmente no final do seu script.js

const whatsappInput = document.getElementById('whatsapp');

whatsappInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    let formattedValue = '';

    if (value.length > 0) {
        formattedValue += '(' + value.substring(0, 2);
    }
    if (value.length > 2) {
        formattedValue += ') ' + value.substring(2, 7); // 5 dígitos para o primeiro bloco (ex: 9 9256)
    }
    if (value.length > 7) {
        formattedValue += '-' + value.substring(7, 11); // 4 dígitos para o segundo bloco (ex: 7419)
    }
    if (value.length > 11) { // Se tiver 11 dígitos, é o formato com "9" na frente (ex: (88) 9 9256-7419)
        formattedValue = '(' + value.substring(0, 2) + ') ' + value.substring(2, 3) + ' ' + value.substring(3, 7) + '-' + value.substring(7, 11);
    }

    e.target.value = formattedValue;
});

// ... (fim do código existente do script.js) ...

// SEU URL DO WEB APP DO GOOGLE APPS SCRIPT JÁ CONFIGURADO
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw9guma6NmDhsGI38WM9-MWTsS2c1oQjXA4ctGfnlrsUPSjMu-U03ennozfyvz2hIP9/exec';

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    messageDiv.style.display = 'none'; // Esconde mensagens anteriores
    messageDiv.className = 'message'; // Limpa classes de estilo

    const formData = {
        nome: document.getElementById('nome').value,
        whatsapp: document.getElementById('whatsapp').value,
        dataReserva: document.getElementById('dataReserva').value,
        quantidadePessoas: parseInt(document.getElementById('quantidadePessoas').value),
        observacao: document.getElementById('observacao').value
    };

    // Adicionando um console.log para verificar o formData ANTES do envio
    console.log('Dados do formulário para envio:', formData);

    // Validação simples
    if (!formData.nome || !formData.whatsapp || !formData.dataReserva || !formData.quantidadePessoas) {
        showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }

    if (isNaN(formData.quantidadePessoas) || formData.quantidadePessoas <= 0) {
        showMessage('A quantidade de pessoas deve ser um número válido e no mínimo 1.', 'error');
        return;
    }

    // Validação de data futura
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera a hora para comparação
    const reservaDate = new Date(formData.dataReserva + 'T00:00:00'); // Adiciona T00:00:00 para garantir que a data seja interpretada no fuso horário local e evitar problemas de dia anterior.

    if (reservaDate < today) {
        showMessage('A data da reserva não pode ser no passado.', 'error');
        return;
    }

    try {
        // Envia os dados para o Google Apps Script
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Necessário para evitar erros CORS com Apps Script
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Devido a 'no-cors', não podemos ler a resposta real do Apps Script aqui.
        // A suposição é que se não houver erro de rede, a requisição foi enviada.
        showMessage('Pedido de Reserva enviada!', 'success');
        form.reset(); // Limpa o formulário após o envio

    } catch (error) {
        console.error('Erro ao enviar a reserva:', error);
        showMessage('Ocorreu um erro ao enviar sua reserva. Tente novamente mais tarde.', 'error');
    }
});

function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.classList.add(type);
    messageDiv.style.display = 'block';
}
