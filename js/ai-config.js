// Client-side AI configuration placeholder
// Sets the default AI model to use for client integrations.
window.SELNEXA_AI = window.SELNEXA_AI || {};
window.SELNEXA_AI.model = 'claude-haiku-4.5';
window.SELNEXA_AI.enabledForAllClients = true;
// Consumer code can check window.SELNEXA_AI.model and act accordingly.
console.info('SELNEXA_AI configured:', window.SELNEXA_AI.model, 'enabledForAllClients=', window.SELNEXA_AI.enabledForAllClients);
