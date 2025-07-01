// Recebe a lista de usuários via sessionStorage
const usuarios = JSON.parse(sessionStorage.getItem('usuarios'));

if (!usuarios || usuarios.length === 0) {
  document.getElementById('contagem').textContent = 'Nenhum usuário para sortear.';
} else {
  let contagem = 10;
  const contagemEl = document.getElementById('contagem');
  const resultadoEl = document.getElementById('resultado');

  const interval = setInterval(() => {
    contagem--;
    contagemEl.textContent = `Sorteando em ${contagem} segundos...`;

    if (contagem === 0) {
      clearInterval(interval);
      sortearUsuario();
    }
  }, 1000);

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

      contagemEl.textContent = '';
      resultadoEl.innerHTML = `<strong> Vencedor: ${data.vencedor} </strong>`;
    } catch (error) {
      console.error('Erro no sorteio:', error);
      contagemEl.textContent = 'Erro ao sortear.';
    }
  }
}

function voltar() {
  sessionStorage.removeItem('usuarios');
  window.location.href = '/';
}
