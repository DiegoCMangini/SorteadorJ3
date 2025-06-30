require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.YOUTUBE_API_KEY;

app.use(express.static('public'));
app.use(bodyParser.json());

const historicoVencedores = [];

app.get('/comentarios', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) return res.status(400).json({ error: 'videoId ausente' });

  try {
    const liveChatId = await obterLiveChatId(videoId);
    const usuarios = await buscarUsuariosUnicos(liveChatId);
    res.json({ usuarios });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
});

app.post('/sorteio', async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ error: 'videoId ausente' });

  try {
    const liveChatId = await obterLiveChatId(videoId);
    const usuarios = await buscarUsuariosUnicos(liveChatId);

    if (usuarios.length === 0) {
      return res.status(400).json({ error: 'Nenhum usuário encontrado para sortear.' });
    }

    const vencedor = usuarios[Math.floor(Math.random() * usuarios.length)];

    historicoVencedores.push({
      nome: vencedor,
      data: new Date().toLocaleString()
    });

    res.json({ vencedor });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao realizar o sorteio' });
  }
});

app.get('/historico', (req, res) => {
  res.json({ historico: historicoVencedores });
});

async function obterLiveChatId(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${API_KEY}`;
  const res = await axios.get(url);
  if (!res.data.items || res.data.items.length === 0) {
    throw new Error('Vídeo não encontrado ou não está ao vivo.');
  }
  return res.data.items[0].liveStreamingDetails.activeLiveChatId;
}

async function buscarUsuariosUnicos(liveChatId) {
  const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${API_KEY}`;
  const res = await axios.get(url);
  const nomes = new Set();

  res.data.items.forEach(item => {
    nomes.add(item.authorDetails.displayName);
  });

  return Array.from(nomes);
}

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
