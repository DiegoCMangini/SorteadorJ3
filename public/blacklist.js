async function carregar() {
  const res = await fetch('/api/blacklist');
  const lista = await res.json();

  const ul = document.getElementById('lista-negra');
  ul.innerHTML = '';
  lista.forEach(nome => {
    const li = document.createElement('li');
    li.textContent = nome;
    ul.appendChild(li);
  });
}

async function adicionar() {
  const nome = document.getElementById('nome').value.trim();
  if (!nome) return alert('Digite um nome');
  await fetch('/api/blacklist/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome })
  });
  document.getElementById('nome').value = '';
  carregar();
}

async function remover() {
  const nome = document.getElementById('nome').value.trim();
  if (!nome) return alert('Digite um nome');
  await fetch('/api/blacklist/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome })
  });
  document.getElementById('nome').value = '';
  carregar();
}

carregar();
