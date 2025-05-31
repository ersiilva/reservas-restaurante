const form = document.getElementById('reservationForm');

// REMOVEMOS A CONSTANTE messageDiv ANTIGA
// const messageDiv = document.getElementById('message');
// NOVAS CONSTANTES PARA O POPUP
const popupOverlay = document.getElementById('popupOverlay');
const popupMessage = document.getElementById('popupMessage');
const closePopupButton = document.getElementById('closePopupButton');
const popupOkButton = document.getElementById('popupOkButton');
// -----------------------------

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw9guma6NmDhsGI38WM9-MWTsS2c1oQjXA4ctGfnlrsUPSjMu-U03ennozfyvz2hIP9/exec';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // REMOVEMOS A MANIPULAÇÃO DA DIV DE MENSAGEM ANTIGA AQUI
  // messageDiv.style.display = 'none';
  // messageDiv.className = 'message';

  const formData = {
    nome: document.getElementById('nome').value,
    whatsapp: document.getElementById('whatsapp').value,
    dataReserva: document.getElementById('dataReserva').value,
    horaChegada: document.getElementById('horaChegada').value,
    quantidadePessoas: parseInt(document.getElementById('quantidadePessoas').value),
    observacao: document.getElementById('observacao').value
  };

  console.log('Dados do formulário para envio:', formData);

  // Validação simples
  if (
    !formData.nome ||
    !formData.whatsapp ||
    !formData.dataReserva ||
    !formData.horaChegada ||
    !formData.quantidadePessoas
  ) {
    showMessage('Por favor, preencha todos os campos obrigatórios.', 'error'); // A função showMessage será o popup
    return;
  }

  if (isNaN(formData.quantidadePessoas) || formData.quantidadePessoas <= 0) {
    showMessage('A quantidade de pessoas deve ser um número válido e no mínimo 1.', 'error'); // A função showMessage será o popup
    return;
  }

  const now = new Date();
  const reservaDateTime = new Date(`${formData.dataReserva}T${formData.horaChegada}`);

  if (reservaDateTime < now) {
    showMessage('A data e hora da reserva não podem ser no passado.', 'error'); // A função showMessage será o popup
    return;
  }

  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    showMessage('Pedido de reserva enviado! Assim que possível, entraremos em contato!', 'success'); // Chamando a função showMessage para o popup
    form.reset();
  } catch (error) {
    console.error('Erro ao enviar a reserva:', error);
    showMessage('Ocorreu um erro ao enviar sua reserva. Tente novamente mais tarde.', 'error'); // Chamando a função showMessage para o popup
  }
});

// A função showMessage agora mostrará o popup
function showMessage(msg, type) {
  popupMessage.textContent = msg; // Define a mensagem no popup
  // Você pode adicionar classes para sucesso/erro no popup-content se quiser cores diferentes
  // Ex: popupContent.classList.remove('success', 'error');
  // if (type === 'success') popupContent.classList.add('success');
  // else if (type === 'error') popupContent.classList.add('error');

  popupOverlay.style.display = 'flex'; // Exibe o popup
}

// Ouvintes para fechar o popup
closePopupButton.addEventListener('click', () => {
  popupOverlay.style.display = 'none'; // Esconde o popup
});

popupOkButton.addEventListener('click', () => {
  popupOverlay.style.display = 'none'; // Esconde o popup
});

// ... (código existente da formatação do WhatsApp) ...
const whatsappInput = document.getElementById('whatsapp');

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
