// Quando a página for carregada, inicia a função carregarHistorico
window.onload = carregarHistorico;

async function carregarHistorico() {
  const container = document.getElementById('listaHistorico');
  container.innerHTML = '<p>Carregando histórico...</p>';

  try {
    const resposta = await fetch('/historico');
    const data = await resposta.json();

    if (!data.historico || data.historico.length === 0) {
      container.innerHTML = '<p>Nenhum sorteio registrado ainda.</p>';
      return;
    }

    // Início da tabela sem avatar
    let html = `
      <table style="margin: 20px auto; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ccc;">#</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Nome</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Data</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Gera uma linha para cada sorteio no histórico
    data.historico.forEach((item, index) => {
      html += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${item.nome}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${item.data}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

  } catch (erro) {
    console.error('Erro ao carregar histórico:', erro);
    container.innerHTML = '<p>Erro ao carregar histórico. Tente novamente.</p>';
  }
}
