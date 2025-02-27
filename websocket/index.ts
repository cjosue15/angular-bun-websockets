import type { ServerWebSocket } from 'bun';

interface ChatMessage {
  type: 'message' | 'join' | 'leave';
  user: string;
  content: string;
  timestamp: number;
}

const clients = new Map<ServerWebSocket<unknown>, { username: string }>();

const sendMessageToClients = (message: ChatMessage) => {
  clients.forEach((_, client) => {
    client.send(JSON.stringify(message));
  });
};

Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response('Upgrade failed', { status: 500 });
  },
  websocket: {
    open() {
      console.log('WebSocket server started');
    },
    message(ws, message) {
      const data = JSON.parse(message as string) as ChatMessage;

      if (data.type === 'join') {
        clients.set(ws, { username: data.user });

        // mandar mensaje de que se unio alguien
        sendMessageToClients({
          type: 'join',
          user: data.user,
          content: `Bienvenido al chat ${data.user}`,
          timestamp: Date.now(),
        });

        return;
      }

      if (data.type === 'message') {
        const client = clients.get(ws);

        if (!client) return;

        sendMessageToClients({
          type: 'message',
          user: client.username,
          content: data.content,
          timestamp: Date.now(),
        });
      }
    },
    close(ws) {
      const client = clients.get(ws);

      if (!client) return;

      sendMessageToClients({
        type: 'leave',
        user: client.username,
        content: `Adios ${client.username}`,
        timestamp: Date.now(),
      });

      clients.delete(ws);
    },
  },
});
