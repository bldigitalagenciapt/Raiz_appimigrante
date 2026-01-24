/*
 * VOY App - Service Worker para Notificações
 */

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'Notificação VOY', body: 'Você tem uma nova atualização.' };

    const options = {
        body: data.body,
        icon: '/logo.png', // Substituir pelo ícone real se disponível
        badge: '/badge.png',
        data: data.url
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});
