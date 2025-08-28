const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
chatbotToggle.onclick = () => chatbotWindow.toggleAttribute('hidden');
chatbotForm.onsubmit = e => {
  e.preventDefault();
  const msg = chatbotInput.value.trim();
  if (!msg) return;
  chatbotMessages.innerHTML += `<div class='user-msg'>${msg}</div>`;
  // Mock AI response
  let response = 'Sorry, I didn\'t understand.';
  if (/symptom|pain|fever/i.test(msg)) response = 'Symptom checker: Please describe your symptoms in detail.';
  if (/faq|help|support/i.test(msg)) response = 'FAQ: Visit our Help Center or ask your question here.';
  chatbotMessages.innerHTML += `<div class='ai-msg'>${response}</div>`;
  chatbotInput.value = '';
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}; 