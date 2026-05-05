function fazerLogin() {
    const usuario = document.getElementById('user').value;
    const senha = document.getElementById('pass').value;

    if (usuario === 'admin' && senha === '123') {
        window.location.href = 'painel.html';
    } else {
        alert("Usuário ou senha incorretos!");
    }

}


function AdicionarHorta() {
    console.log("Tentando salvar...");

    // Capturando os valores
    const nome = document.getElementById('nome').value;
    const tipoCultura = document.getElementById('novaHorta').value;
    const areaCanteiro = document.getElementById('metros').value;
    const dataPlantio = document.getElementById('dataPlantio').value;

    // Verifica se os campos estão vazios
    if (!nome || !tipoCultura || !areaCanteiro || !dataPlantio) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const novaHorta = { 
        nome: nome, 
        tipoCultura: tipoCultura, 
        areaCanteiro: areaCanteiro, 
        dataPlantio: dataPlantio 
    };

    try {
        let hortas = JSON.parse(localStorage.getItem('minhasHortas') || "[]");
        hortas.push(novaHorta);
        localStorage.setItem('minhasHortas', JSON.stringify(hortas));
        
        alert('Horta Adicionada com Sucesso!');
        window.location.href = 'painel.html';
    } catch (e) {
        console.error("Erro ao salvar no localStorage", e);
    }
}

function carregarHortas() {
    const listaElemento = document.getElementById('listaHortas');
    if (!listaElemento) return;

    const dados = localStorage.getItem('minhasHortas');
    let hortas = JSON.parse(dados || "[]");

    if (hortas.length === 0) {
        listaElemento.innerHTML = "<p style='color:white;'>Nenhuma horta encontrada.</p>";
        return;
    }

    listaElemento.innerHTML = "";

    // Usamos o 'index' para saber qual item apagar depois
    hortas.forEach((horta, index) => {
        const prazos = { 'folhosa': 45, 'raiz': 90, 'tempero': 30 };
        const tipoChave = horta.tipoCultura ? horta.tipoCultura.toLowerCase() : '';
        const prazoDias = prazos[tipoChave] || 60;
        
        const dataPlantei = new Date(horta.dataPlantio);
        const dataHoje = new Date();
        const diasPassados = Math.floor((dataHoje - dataPlantei) / (1000 * 60 * 60 * 24));
        const diasRestantes = prazoDias - diasPassados;

        let statusTexto = diasRestantes <= 0 ? "✅ Pronto para Colher!" : `🌱 Faltam ${diasRestantes} dias`;
        let corStatus = diasRestantes <= 0 ? "#2ecc71" : "#5b9745ff";

        listaElemento.innerHTML += `
            <div class="card-horta" style="background: white; color: black; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 8px solid ${corStatus}; position: relative; width: 150%; display: flex;  align-items: center; gap: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h3>${horta.nome}</h3>
                <p><strong>Cultura:</strong> ${horta.tipoCultura}</p>
                <p><strong>Área:</strong> ${horta.areaCanteiro} m²</p>
                <p style="color: ${corStatus}; font-weight: bold;">Status: ${statusTexto}</p>
                
                <!-- BOTÃO DE EXCLUIR -->
                <button onclick="excluirHorta(${index})" style="position: absolute; top: ; right: 10px; background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; width: 60px;">
                    Excluir
                </button>
            </div>
        `;
    });
}

// --- FUNÇÃO PARA EXCLUIR ---
function excluirHorta(index) {
    // Pergunta antes de apagar para evitar acidentes
    if (confirm("Deseja realmente remover esta plantação?")) {
        // 1. Pega a lista do localStorage
        let hortas = JSON.parse(localStorage.getItem('minhasHortas') || "[]");

        // 2. Remove o item específico pelo índice
        hortas.splice(index, 1);

        // 3. Salva a nova lista (sem o item removido) no localStorage
        localStorage.setItem('minhasHortas', JSON.stringify(hortas));

        // 4. Recarrega a lista na tela imediatamente
        carregarHortas();
    }
}

// Executa ao carregar a página
window.onload = carregarHortas;