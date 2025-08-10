import FormComum from "./General_Classes/ConstrutorDeForms.js";

export function construirFormulario(){ 
    const frmDSB = new FormComum(
        'Cadastro de Clientes',
        ['input', 'input', 'input','input', 'input', 'input', 'input', 'input'],
        ['Razão Social', 'Email', 'Telefone','Rua', 'Bairro', 'Cidade', 'Estado', 'CEP'],
        ['nome', 'email', 'telefone','rua', 'bairro', 'cidade', 'estado', 'cep'],
        ['texto', 'texto', 'texto','texto', 'texto', 'texto', 'texto', 'texto'],
        [{linha: 0, coluna: 0}, {linha: 0, coluna: 1}, {linha: 0, coluna: 2}, 
            {linha: 1, coluna: 0}, {linha: 1, coluna: 1}, {linha: 1, coluna: 2},
            {linha: 2, coluna: 0}, {linha: 2, coluna: 1}],
        ['H', 'H', 'H','H', 'H', 'H', 'H', 'H'],
        [15, 10, 7, 17, 7, 7, 10, 7], // Larguras dos campos em rem
        {x: 3, y: 5}, // Posição no canvas
        {
            grupoBotoes: ['S', 'S', 'S'], // Todos os grupos de botões: Encerrar + Navegação + CRUD
            selects: {
                labels: ['Categoria', 'Status', 'Região'],
                campos: ['categoria', 'status', 'regiao'],
                larguras: ['150px', '120px', '130px'],
                arranjo: 'linha'
            }
        }
    );

    // Configura listeners de eventos customizados no novo padrão
    configurarEventosFormulario();

    // Exemplo de população das selects (simular dados do banco)
    setTimeout(() => {
        popularSelectsExemplo(frmDSB);
    }, 100);

    return frmDSB;
}

/**
 * 🎯 TEMPLATE PARA DESENVOLVEDOR:
 * Configura os eventos customizados do formulário (novo padrão igual às selects)
 * COPIE, COLE, RENOMEIE e CUSTOMIZE conforme sua necessidade
 */
function configurarEventosFormulario() {
    
    // Listener principal no divRodape (padrão das selects)
    const divRodape = document.getElementById('divRodape');
    if (divRodape) {
        divRodape.addEventListener('formulario-acao', function(event) {
            const { acao, instancia, dados } = event.detail;
            
            console.log(`📝 ui_formularios.js: Evento formulario-acao.${acao} capturado`);
            
            // Roteamento das ações
            switch(acao) {
                case 'encerrar':
                    manipularEncerrar(instancia, dados);
                    break;
                case 'primeiro':
                    manipularPrimeiro(instancia, dados);
                    break;
                case 'anterior':
                    manipularAnterior(instancia, dados);
                    break;
                case 'proximo':
                    manipularProximo(instancia, dados);
                    break;
                case 'ultimo':
                    manipularUltimo(instancia, dados);
                    break;
                case 'novo':
                    manipularNovo(instancia, dados);
                    break;
                case 'editar':
                    manipularEditar(instancia, dados);
                    break;
                case 'excluir':
                    manipularExcluir(instancia, dados);
                    break;
                case 'salvar':
                    manipularSalvar(instancia, dados);
                    break;
                default:
                    console.warn(`Ação '${acao}' não reconhecida em ui_formularios.js`);
            }
        });
        
        console.log('✅ ui_formularios.js: Listener configurado no divRodape');
    } else {
        console.error('❌ ui_formularios.js: divRodape não encontrado');
    }
}

// ============= HANDLERS CUSTOMIZÁVEIS =============

/**
 * 🚪 TEMPLATE: Encerrar formulário
 */
async function manipularEncerrar(instancia, dados) {
    console.log('🏁 ui_formularios.js: Encerrando formulário', dados);
    // 🔧 CUSTOMIZAR: Lógica de encerramento específica
}

/**
 * ⏮️ TEMPLATE: Primeiro registro
 */
async function manipularPrimeiro(instancia, dados) {
    console.log('⏮️ ui_formularios.js: Primeiro registro');
    // 🔧 CUSTOMIZAR: Buscar primeiro registro do banco
    await carregarRegistro('primeiro', instancia);
}

/**
 * ⏪ TEMPLATE: Registro anterior
 */
async function manipularAnterior(instancia, dados) {
    console.log('⏪ ui_formularios.js: Registro anterior');
    // 🔧 CUSTOMIZAR: Navegar para registro anterior
    await carregarRegistro('anterior', instancia);
}

/**
 * ⏩ TEMPLATE: Próximo registro
 */
async function manipularProximo(instancia, dados) {
    console.log('⏩ ui_formularios.js: Próximo registro');
    // 🔧 CUSTOMIZAR: Navegar para próximo registro
    await carregarRegistro('proximo', instancia);
}

/**
 * ⏭️ TEMPLATE: Último registro
 */
async function manipularUltimo(instancia, dados) {
    console.log('⏭️ ui_formularios.js: Último registro');
    // 🔧 CUSTOMIZAR: Buscar último registro do banco
    await carregarRegistro('ultimo', instancia);
}

/**
 * 🆕 TEMPLATE: Novo registro
 */
async function manipularNovo(instancia, dados) {
    console.log('🆕 ui_formularios.js: Novo registro');
    // A classe já limpa os campos automaticamente
    // 🔧 CUSTOMIZAR: Adicionar valores padrão
    preencherValoresPadrao(instancia);
}

/**
 * ✏️ TEMPLATE: Editar registro
 */
async function manipularEditar(instancia, dados) {
    console.log('✏️ ui_formularios.js: Modo edição ativado', dados);
    // A classe já habilita os campos automaticamente
    // 🔧 CUSTOMIZAR: Lógica específica de edição
}

/**
 * 🗑️ TEMPLATE: Excluir registro
 */
async function manipularExcluir(instancia, dados) {
    console.log('🗑️ ui_formularios.js: Excluindo registro', dados);
    
    if (confirm('Deseja realmente excluir este cliente?')) {
        try {
            // 🔧 CUSTOMIZAR: Substituir por lógica real
            const resultado = await excluirCliente(dados);
            
            if (resultado.sucesso) {
                alert('Cliente excluído com sucesso!');
                instancia.limparCampos();
            } else {
                alert('Erro ao excluir: ' + resultado.erro);
            }
        } catch (error) {
            console.error('Erro na exclusão:', error);
            alert('Erro na exclusão: ' + error.message);
        }
    }
}

/**
 * 💾 TEMPLATE: Salvar registro
 */
async function manipularSalvar(instancia, dados) {
    console.log('💾 ui_formularios.js: Salvando dados', dados);
    
    // Verifica se há dados das selects
    const valoresSelects = instancia.obterValoresSelects();
    if (Object.keys(valoresSelects).length > 0) {
        console.log('📋 Valores das selects:', valoresSelects);
        // Combina dados do formulário com dados das selects
        Object.assign(dados, valoresSelects);
    }
    
    try {
        // 🔧 CUSTOMIZAR: Substituir por lógica real
        const resultado = await salvarCliente(dados);
        
        if (resultado.sucesso) {
            alert('Cliente salvo com sucesso!');
            instancia.limparCampos();
        } else {
            alert('Erro ao salvar: ' + resultado.erro);
        }
    } catch (error) {
        console.error('Erro no salvamento:', error);
        alert('Erro no salvamento: ' + error.message);
    }
}

// ============= FUNÇÕES AUXILIARES PARA CUSTOMIZAR =============

/**
 * 🔧 TEMPLATE: Carregar registro por direção
 */
async function carregarRegistro(direcao, instancia) {
    console.log(`🔍 Simulando carregamento: ${direcao}`);
    // 🔧 CUSTOMIZAR: Implementar busca real no banco
    
    // Exemplo de implementação:
    // const registro = await buscarRegistro(direcao);
    // if (registro) {
    //     instancia.preencherFormulario(registro);
    // }
}

/**
 * 🔧 TEMPLATE: Salvar cliente
 */
async function salvarCliente(dados) {
    console.log('💾 Simulando salvamento:', dados);
    // 🔧 CUSTOMIZAR: Chamada real ao backend
    return { sucesso: true, id: Date.now() };
    
    // Exemplo real:
    // const response = await fetch('/api/clientes', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(dados)
    // });
    // return await response.json();
}

/**
 * 🔧 TEMPLATE: Excluir cliente
 */
async function excluirCliente(dados) {
    console.log('🗑️ Simulando exclusão:', dados);
    // 🔧 CUSTOMIZAR: Chamada real ao backend
    return { sucesso: true };
}

/**
 * 🔧 TEMPLATE: Valores padrão para novos registros
 */
function preencherValoresPadrao(instancia) {
    // 🔧 CUSTOMIZAR: Definir valores padrão
    // Exemplo: instancia.form.querySelector('#estado').value = 'SP';
    console.log('🆕 Preenchendo valores padrão...');
}

// ============= EXEMPLO DE USO DAS SELECTS =============

/**
 * 🔧 EXEMPLO: Popular selects com dados simulados
 * Em produção, estes dados viriam do banco de dados
 */
function popularSelectsExemplo(instanciaFormulario) {
    if (!instanciaFormulario.temSelects()) {
        console.log('📝 Formulário não possui selects configuradas');
        return;
    }
    
    // Simula dados vindos do banco
    const dadosSelects = {
        categoria: [
            { value: 'pf', text: 'Pessoa Física' },
            { value: 'pj', text: 'Pessoa Jurídica' },
            { value: 'gov', text: 'Governo' }
        ],
        status: [
            { value: 'ativo', text: 'Ativo' },
            { value: 'inativo', text: 'Inativo' },
            { value: 'pendente', text: 'Pendente' }
        ],
        regiao: [
            { value: 'sudeste', text: 'Sudeste' },
            { value: 'sul', text: 'Sul' },
            { value: 'nordeste', text: 'Nordeste' },
            { value: 'norte', text: 'Norte' },
            { value: 'centro-oeste', text: 'Centro-Oeste' }
        ]
    };
    
    // Popula todas as selects
    const resultado = instanciaFormulario.popularTodosSelects(dadosSelects);
    
    console.log('✅ Selects populadas:', resultado);
    
    // Configura listener para mudanças nas selects (padrão das tabelas)
    configurarListenerSelects();
}

/**
 * 🔧 EXEMPLO: Configurar listener para eventos das selects
 * Segue o mesmo padrão das tabelas
 */
function configurarListenerSelects() {
    const divControles = document.getElementById('divControlesFormulario');
    if (divControles) {
        divControles.addEventListener('select-alterada', function(event) {
            const { campo, valor, selecionados } = event.detail;
            
            console.log(`🔄 Select '${campo}' alterada para: '${valor}'`);
            console.log('📊 Todas as seleções:', selecionados);
            
            // 🔧 CUSTOMIZAR: Adicionar lógica de cascata ou validação
            // Exemplo: Se categoria mudou, filtrar outras selects
            if (campo === 'categoria') {
                console.log('🎯 Categoria alterada - implementar cascata se necessário');
            }
        });
        
        console.log('✅ Listener das selects configurado');
    }
}
