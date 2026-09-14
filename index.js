const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.get('/tes', (req, res) => {
    console.log('Endpoint /tes diakses');
    res.send('Server signaling aktif dan dapat diakses!');
});

const server = http.createServer(app);

// Inisialisasi Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Mengizinkan koneksi dari mana saja (Next.js / Android)
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Perangkat terhubung dengan ID:', socket.id);

    // 1. Klien (PC/HP) meminta bergabung ke ruangan dengan kode tertentu
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Perangkat ${socket.id} masuk ke ruangan: ${roomId}`);

        socket.to(roomId).emit('peer-joined');
    });


    // 2. Meneruskan SDP Offer dari PC ke HP
    socket.on('offer', (data) => {
        socket.to(data.roomId).emit('offer', data.offer);
        console.log(`Meneruskan SDP Offer dari ${socket.id} ke ruangan: ${data.roomId}`);
    });

    // 3. Meneruskan SDP Answer dari HP kembali ke PC
    socket.on('answer', (data) => {
        socket.to(data.roomId).emit('answer', data.answer);
        console.log(`Meneruskan SDP Answer dari ${socket.id} ke ruangan: ${data.roomId}`);
    });

    socket.on('answerAccepted', (data) => {
        socket.to(data.roomId).emit('answerAccepted');
        console.log(`Perangkat ${socket.id} menerima jawaban (Answer)`);
    });


    // 4. Meneruskan rute jaringan (ICE Candidate) antar perangkat
    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', data.candidate);
        console.log(`Meneruskan ICE Candidate dari ${socket.id} ke ruangan: ${data.roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Perangkat terputus:', socket.id);
    });
});

// Gunakan port dari environment server, atau 3000 untuk lokal
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Signaling Server aktif di port ${PORT}`);
});