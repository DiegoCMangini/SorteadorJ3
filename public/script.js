let usuarios = [];

async function buscarComentarios() {
  const urlInput = document.getElementById('liveUrl');
  const liveUrl = urlInput.value;

  if (!liveUrl) {
    alert('Por favor, insira o link da live.');
    return;
  }

  try {
    const res = await fetch('/buscar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ liveUrl })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    usuarios = data.usuarios;

    const lista = document.getElementById('usuarios');

    if (usuarios.length === 0) {
      lista.innerHTML = '<p>Nenhum usuário encontrado.</p>';
      return;
    }

    let html = `
      <strong>Usuários únicos encontrados:</strong>
      <table style="margin: 10px auto; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 6px 12px;">#</th>
            <th style="border: 1px solid #ccc; padding: 6px 12px;">Nome</th>
          </tr>
        </thead>
        <tbody>
    `;

    usuarios.forEach((nome, i) => {
      html += `
        <tr>
          <td style="border: 1px solid #ccc; padding: 6px 12px;">${i + 1}</td>
          <td style="border: 1px solid #ccc; padding: 6px 12px;">${nome}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    lista.innerHTML = html;

    document.getElementById('btnSortear').style.display = 'inline-block';

  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    alert('Erro ao buscar comentários. Veja o console.');
  }
}

async function fazerSorteio() {
  if (usuarios.length === 0) {
    alert('Nenhum usuário disponível para sortear.');
    return;
  }

  document.getElementById('contagem').textContent = 'Sorteando em 10 segundos...';

  let contagem = 10;
  const interval = setInterval(() => {
    contagem--;
    document.getElementById('contagem').textContent = `Sorteando em ${contagem} segundos...`;
    if (contagem === 0) {
      clearInterval(interval);
      sortearUsuario();
    }
  }, 1000);
}

async function sortearUsuario() {
  try {
    const res = await fetch('/sortear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuarios })
    });

    const data = await res.json();

    document.getElementById('contagem').textContent = '';
    document.getElementById('resultado').innerHTML = `<strong>🎉 Vencedor: ${data.vencedor} 🎉</strong>`;
  } catch (error) {
    console.error('Erro no sorteio:', error);
    alert('Erro ao sortear.');
  }
}
