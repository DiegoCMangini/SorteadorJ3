require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.YOUTUBE_API_KEY;

app.use(express.static('public'));
app.use(express.json());

let historico = [];

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Página de histórico
app.get('/historico.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'historico.html'));
});

// API para buscar comentários ao vivo
app.post('/buscar', async (req, res) => {
  const { liveUrl } = req.body;

  try {
    const videoId = extractVideoId(liveUrl);

    // Busca o liveChatId
    const videoRes = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'liveStreamingDetails',
        id: videoId,
        key: API_KEY
      }
    });

    const liveChatId = videoRes.data.items[0]?.liveStreamingDetails?.activeLiveChatId;
    if (!liveChatId) return res.status(404).json({ error: 'Live não encontrada ou sem chat ativo.' });

    // Pega mensagens do chat ao vivo
    const chatRes = await axios.get(`https://www.googleapis.com/youtube/v3/liveChat/messages`, {
      params: {
        liveChatId,
        part: 'snippet,authorDetails',
        maxResults: 200,
        key: API_KEY
      }
    });

    const usuarios = chatRes.data.items.map(item => item.authorDetails.displayName);
    const unicos = [...new Set(usuarios)];

    res.json({ usuarios: unicos });
  } catch (err) {
    console.error('Erro ao buscar comentários:', err);
    res.status(500).json({ error: 'Erro ao buscar comentários.' });
  }
});

// API para fazer o sorteio
app.post('/sortear', (req, res) => {
  const { usuarios } = req.body;

  if (!usuarios || usuarios.length === 0) {
    return res.status(400).json({ error: 'Nenhum usuário disponível para sortear.' });
  }

  const sorteado = usuarios[Math.floor(Math.random() * usuarios.length)];
  const data = new Date().toLocaleString('pt-BR');

  historico.push({ nome: sorteado, data });
  res.json({ vencedor: sorteado });
});

// API para consultar histórico
app.get('/historico', (req, res) => {
  res.json({ historico });
});

// Função auxiliar: extrair ID da URL
function extractVideoId(url) {
  const regex = /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
