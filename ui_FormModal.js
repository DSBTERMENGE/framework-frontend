/**
 * UI Module para FormModal
 * Segue o padrão de ui_formularios.js e ui_tabelas.js
 * 
 * RESPONSABILIDADES:
 * - Criar instâncias de FormModal
 * - Capturar eventos 'form-modal-acao'
 * - Implementar lógica de negócio específica para modais
 * - Fornecer templates para customização
 */

import FormModal from './General_Classes/ConstrutorDeFormModal.js';

// ============= FUNÇÕES DE CRIAÇÃO DE MODAIS =============

/**
 * 🎯 EXEMPLO 1: Modal de Cadastro Simples
 */
export function criarModalCadastroSimples() {
    const modal = new FormModal(
        'Novo Cliente',
        ['input', 'input', 'input'],
        ['Nome', 'Email', 'Telefone'],
        ['nome', 'email', 'telefone'],
        ['texto', 'texto', 'texto'],
        [{linha: 0, coluna: 0}, {linha: 1, coluna: 0}, {linha: 2, coluna: 0}],
        ['H', 'H', 'H'],
        [20, 20, 15], // Larguras em rem
        {
            botoesModal: ['Cancelar', 'Salvar'],
            estiloModal: {
                larguraMinima: '400px',
                alturaMinima: '300px'
            }
        }
    );

    // Configura listeners para este modal específico
    configurarEventosModal(modal);
    
    // Torna global para debugging
    window.modalCadastroSimples = modal;
    
    return modal;
}

/**
 * 🎯 EXEMPLO 2: Modal de Edição Complexo
 */
export function criarModalEdicaoComplexo() {
    const modal = new FormModal(
        'Editar Produto',
        ['input', 'input', 'textarea', 'input', 'combo'],
        ['Código', 'Nome', 'Descrição', 'Preço', 'Categoria'],
        ['codigo', 'nome', 'descricao', 'preco', 'categoria'],
        ['texto', 'texto', 'texto', 'moeda', 'texto'],
        [
            {linha: 0, coluna: 0}, {linha: 0, coluna: 1},
            {linha: 1, coluna: 0}, {linha: 1, coluna: 1}, 
            {linha: 2, coluna: 0}
        ],
        ['H', 'H', 'V', 'H', 'H'],
        [10, 25, 35, 12, 15],
        {
            botoesModal: ['Cancelar', 'Atualizar'],
            estiloModal: {
                larguraMinima: '600px'
            }
        }
    );

    configurarEventosModal(modal);
    window.modalEdicaoComplexo = modal;
    
    return modal;
}

/**
 * 🎯 EXEMPLO 3: Modal de Confirmação
 */
export function criarModalConfirmacao(titulo, mensagem, callback) {
    const modal = new FormModal(
        titulo,
        ['textarea'],
        [''],
        ['mensagem'],
        ['texto'],
        [{linha: 0, coluna: 0}],
        ['V'],
        [40],
        {
            botoesModal: ['Não', 'Sim']
        }
    );

    // Preenche a mensagem
    setTimeout(() => {
        const textArea = modal.form.querySelector('#mensagem');
        if (textArea) {
            textArea.value = mensagem;
            textArea.disabled = true;
            textArea.style.border = 'none';
            textArea.style.resize = 'none';
            textArea.style.backgroundColor = 'transparent';
        }
    }, 100);

    // Listener específico para confirmação
    modal.container.addEventListener('form-modal-acao', function(event) {
        const { acao } = event.detail;
        
        if (acao === 'submit') {
            callback(true);
        } else if (acao === 'encerrar') {
            callback(false);
        }
        
        modal.destruir();
    });

    window.modalConfirmacao = modal;
    return modal;
}

// ============= CONFIGURAÇÃO DE EVENTOS =============

/**
 * 🎯 CONFIGURAÇÃO PRINCIPAL: 
 * Configura listeners para eventos dos modais
 * @param {FormModal} modal - Instância do modal
 */
function configurarEventosModal(modal) {
    if (!modal.container) {
        console.error('❌ Modal sem container para configurar eventos');
        return;
    }

    // Listener principal para eventos do modal
    modal.container.addEventListener('form-modal-acao', function(event) {
        const { acao, instancia, dados } = event.detail;
        
        console.log(`📱 ui_FormModal.js: Evento form-modal-acao.${acao} capturado`);
        
        // Roteamento das ações específicas do modal
        switch(acao) {
            case 'encerrar':
                manipularEncerrarModal(instancia, dados);
                break;
            case 'submit':
                manipularSubmitModal(instancia, dados);
                break;
            default:
                console.warn(`Ação '${acao}' não reconhecida em ui_FormModal.js`);
        }
    });
    
    console.log('✅ ui_FormModal.js: Eventos configurados para modal');
}

// ============= HANDLERS CUSTOMIZÁVEIS =============

/**
 * 🚪 TEMPLATE: Encerrar modal
 * @param {FormModal} instancia - Instância do modal
 * @param {Object} dados - Dados do formulário
 */
async function manipularEncerrarModal(instancia, dados) {
    console.log('🚪 ui_FormModal.js: Encerrando modal', dados);
    
    // 🔧 CUSTOMIZAR: Lógica específica de encerramento
    // Exemplo: verificar se há dados não salvos
    
    if (temDadosNaoSalvos(dados)) {
        const confirmar = confirm('Há dados não salvos. Deseja realmente fechar?');
        if (!confirmar) {
            instancia.exibir(); // Reabre o modal
            return;
        }
    }
    
    // Lógica padrão: apenas fecha
    console.log('✅ Modal encerrado com sucesso');
}

/**
 * ✅ TEMPLATE: Submit do modal
 * @param {FormModal} instancia - Instância do modal
 * @param {Object} dados - Dados do formulário
 */
async function manipularSubmitModal(instancia, dados) {
    console.log('✅ ui_FormModal.js: Processando submit do modal', dados);
    
    try {
        // 🔧 CUSTOMIZAR: Validação específica do modal
        if (!validarDadosModal(dados)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // 🔧 CUSTOMIZAR: Processamento dos dados
        const resultado = await processarDadosModal(dados);
        
        if (resultado.sucesso) {
            alert('Dados salvos com sucesso!');
            instancia.ocultar();
            
            // 🔧 CUSTOMIZAR: Ações pós-sucesso
            aposSuccessoModal(resultado);
        } else {
            alert('Erro ao salvar: ' + resultado.erro);
        }
        
    } catch (error) {
        console.error('Erro no submit do modal:', error);
        alert('Erro no processamento: ' + error.message);
    }
}

// ============= FUNÇÕES AUXILIARES PARA CUSTOMIZAR =============

/**
 * 🔧 TEMPLATE: Verificar dados não salvos
 * @param {Object} dados - Dados do formulário
 * @returns {boolean} True se há dados não salvos
 */
function temDadosNaoSalvos(dados) {
    // 🔧 CUSTOMIZAR: Lógica para detectar dados não salvos
    
    // Exemplo: verifica se algum campo tem valor
    const temValores = Object.values(dados).some(valor => 
        valor && valor.toString().trim().length > 0
    );
    
    return temValores;
}

/**
 * 🔧 TEMPLATE: Validar dados do modal
 * @param {Object} dados - Dados do formulário
 * @returns {boolean} True se dados válidos
 */
function validarDadosModal(dados) {
    // 🔧 CUSTOMIZAR: Validações específicas
    
    // Exemplo: campos obrigatórios
    const camposObrigatorios = ['nome', 'email'];
    
    for (const campo of camposObrigatorios) {
        if (!dados[campo] || dados[campo].trim().length === 0) {
            console.warn(`Campo obrigatório não preenchido: ${campo}`);
            return false;
        }
    }
    
    // Exemplo: validação de email
    if (dados.email && !isEmailValido(dados.email)) {
        console.warn('Email inválido');
        return false;
    }
    
    return true;
}

/**
 * 🔧 TEMPLATE: Processar dados do modal
 * @param {Object} dados - Dados do formulário
 * @returns {Promise<Object>} Resultado do processamento
 */
async function processarDadosModal(dados) {
    console.log('💾 Processando dados do modal:', dados);
    
    // 🔧 CUSTOMIZAR: Envio para backend
    
    // Simulação de API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Exemplo de implementação real:
    // const response = await fetch('/api/modal-data', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(dados)
    // });
    // return await response.json();
    
    // Simulação de sucesso
    return { 
        sucesso: true, 
        id: Date.now(),
        dados: dados
    };
}

/**
 * 🔧 TEMPLATE: Ações após sucesso
 * @param {Object} resultado - Resultado do processamento
 */
function aposSuccessoModal(resultado) {
    // 🔧 CUSTOMIZAR: Ações específicas pós-sucesso
    
    console.log('🎉 Processamento concluído:', resultado);
    
    // Exemplos:
    // - Recarregar tabela principal
    // - Atualizar contadores
    // - Navegar para outra tela
    // - Exibir notificação
    
    // Exemplo: dispara evento customizado para atualizar UI principal
    document.dispatchEvent(new CustomEvent('modal-dados-salvos', {
        detail: resultado
    }));
}

/**
 * 🔧 HELPER: Validar email
 * @param {string} email - Email para validar
 * @returns {boolean} True se email válido
 */
function isEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ============= FUNÇÕES DE CONVENIÊNCIA =============

/**
 * 🎯 CONVENIÊNCIA: Exibir modal de cadastro
 */
export function exibirModalCadastro() {
    const modal = criarModalCadastroSimples();
    modal.exibir();
    return modal;
}

/**
 * 🎯 CONVENIÊNCIA: Exibir modal de edição com dados
 * @param {Object} dados - Dados para preencher
 */
export function exibirModalEdicao(dados = {}) {
    const modal = criarModalEdicaoComplexo();
    
    // Preenche campos com dados existentes
    setTimeout(() => {
        preencherCamposModal(modal, dados);
        modal.exibir();
    }, 100);
    
    return modal;
}

/**
 * 🎯 CONVENIÊNCIA: Exibir modal de confirmação
 * @param {string} titulo - Título do modal
 * @param {string} mensagem - Mensagem de confirmação
 * @returns {Promise<boolean>} Promise que resolve com true/false
 */
export function confirmarAcao(titulo, mensagem) {
    return new Promise((resolve) => {
        const modal = criarModalConfirmacao(titulo, mensagem, resolve);
        modal.exibir();
    });
}

/**
 * 🔧 HELPER: Preencher campos do modal
 * @param {FormModal} modal - Instância do modal
 * @param {Object} dados - Dados para preencher
 */
function preencherCamposModal(modal, dados) {
    for (const [campo, valor] of Object.entries(dados)) {
        const elemento = modal.form.querySelector(`#${campo}`);
        if (elemento) {
            elemento.value = valor;
        }
    }
    
    console.log('✅ Campos do modal preenchidos:', dados);
}

// ============= EXEMPLO DE USO =============

/**
 * 🎯 EXEMPLO COMPLETO: Como usar os modais
 */
export function exemploUsoModais() {
    console.log('📋 Exemplo de uso dos modais:');
    
    // 1. Modal simples
    console.log('1. Criando modal cadastro simples...');
    const modalSimples = exibirModalCadastro();
    
    // 2. Modal com dados pré-preenchidos
    setTimeout(() => {
        console.log('2. Criando modal edição com dados...');
        const dadosExistentes = {
            codigo: 'PROD001',
            nome: 'Produto Exemplo',
            preco: '99.90'
        };
        exibirModalEdicao(dadosExistentes);
    }, 2000);
    
    // 3. Modal de confirmação
    setTimeout(async () => {
        console.log('3. Testando modal de confirmação...');
        const confirmado = await confirmarAcao(
            'Confirmar Exclusão', 
            'Deseja realmente excluir este item?'
        );
        console.log('Resultado da confirmação:', confirmado);
    }, 4000);
}

// ============= LISTENERS GLOBAIS (OPCIONAL) =============

/**
 * 🎯 SETUP: Configurar listeners globais para modais
 * Chame esta função uma vez na inicialização da aplicação
 */
export function configurarListenersGlobaisModais() {
    // Listener global para dados salvos em modais
    document.addEventListener('modal-dados-salvos', function(event) {
        console.log('🔄 Dados salvos via modal - atualizando UI:', event.detail);
        
        // 🔧 CUSTOMIZAR: Ações globais após salvamento
        // Exemplo: recarregar tabelas, atualizar contadores, etc.
    });
    
    // Listener para tecla ESC fechar modais
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Fecha o modal ativo (se houver)
            const modalAtivo = document.querySelector('#modal-backdrop[style*="block"]');
            if (modalAtivo) {
                // Busca a instância do modal e fecha
                const modais = [
                    window.modalCadastroSimples,
                    window.modalEdicaoComplexo,
                    window.modalConfirmacao
                ].filter(m => m && m.estaVisivel());
                
                modais.forEach(modal => modal.ocultar());
            }
        }
    });
    
    console.log('✅ Listeners globais de modais configurados');
}
