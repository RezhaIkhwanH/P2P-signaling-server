# P2P Signaling Server

Server signaling untuk aplikasi peer-to-peer berbasis WebRTC yang digunakan untuk koordinasi koneksi antar client sebelum data real-time ditransfer langsung.

Project ini biasanya digunakan untuk membantu client saling bertukar informasi seperti offer, answer, dan ICE candidate agar koneksi P2P dapat terbentuk di browser atau aplikasi mobile.

## Fitur

- Sinkronisasi koneksi antar peer melalui Socket.IO
- Broadcast dan routing pesan signaling antar client
- Mendukung room/channel untuk komunikasi grup atau per sesi
- Mudah diintegrasikan dengan aplikasi WebRTC frontend
- Konfigurasi port dan environment variable sederhana
- Cocok untuk aplikasi video call, chat peer-to-peer, live collaboration, dan transfer data langsung

## Teknologi

- Node.js
- JavaScript / TypeScript (opsional tergantung implementasi)
- Socket.IO
- WebRTC
- Express.js (jika digunakan untuk HTTP endpoint tambahan)

## Arsitektur Umum

Server ini berperan sebagai mediator signaling layer. Ketika peer A dan peer B ingin terhubung:

1. Peer A membuat offer dan mengirimkannya ke signaling server
2. Signaling server meneruskan ke peer target atau ke room tertentu
3. Peer B membalas dengan answer
4. ICE candidate dipertukarkan melalui server
5. Setelah negotiation selesai, koneksi P2P langsung terbentuk antar peer

## Prasyarat

- Node.js v18+ atau versi yang sesuai
- npm atau yarn
- Akses jaringan untuk komunikasi antara client dan server

## Instalasi

```bash
npm install
```

## Konfigurasi

Buat file `.env` jika diperlukan, misalnya:

```env
PORT=3000
CORS_ORIGIN=http://localhost:8080
```

Sesuaikan dengan kebutuhan project Anda. Jika project tidak menggunakan `.env`, bisa langsung atur nilai di file konfigurasi.

## Menjalankan Server

```bash
npm start
```

Atau jika project memakai mode development:

```bash
npm run dev
```

## Contoh Alur Kerja

### 1. Client join room

```javascript
socket.emit("join-room", { roomId: "room-123", userId: "user-1" });
```

### 2. Client mengirim offer

```javascript
socket.emit("signal", {
  roomId: "room-123",
  to: "user-2",
  type: "offer",
  payload: offer,
});
```

### 3. Server meneruskan ke peer tujuan

```javascript
socket.to(targetSocketId).emit("signal", {
  from: socket.id,
  type: "offer",
  payload: offer,
});
```

## API / Event Umum

Berikut adalah event yang umum dipakai pada signaling server:

- `join-room`
- `leave-room`
- `signal`
- `peer-connected`
- `peer-disconnected`
- `user-online`
- `user-offline`

Nama event bisa berbeda tergantung implementasi project, namun biasanya pola yang dipakai adalah broadcast ke room dan direct message ke socket tertentu.

## Struktur Project (Contoh)

```text
p2p-signaling-server/
├── src/
│   ├── server.js
│   ├── socket.js
│   ├── room.js
│   └── config.js
├── .env.example
├── package.json
├── README.md
└── .gitignore
```
