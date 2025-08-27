/*
************************************************************
        OPERAÇÕES CRUD - FRAMEWORK DSB
************************************************************

Este arquivo implementa as operações de CRUD, navegação e filtros
para formulários após validação de dados (Framework DSB).

ESPECIALIZAÇÃO: Manipulação de interface e população de formulários
- Recebe dados da API e popula formulários
- Executa operações de navegação e filtros
- Gerencia interface durante operações

FLUXO DE EXECUÇÃO:
1. ValidarDadosForms.js → Validação obrigatória
2. OperacoesCRUD.js → Execução das operações (este arquivo)

RESPONSABILIDADES:
- Popular formulários com dados recebidos da API
- Executar operações de navegação (próximo, anterior, primeiro, último)
- Executar filtros de busca
- Executar inserção de novos registros
- Executar atualização de registros existentes
- Gerenciar interface durante operações

INTEGRAÇÃO:
- Trabalha com dados da frontend_api.js
- Atualiza interface de formulários
- Funciona para múltiplas aplicações

ÚLTIMA ATUALIZAÇÃO: Remanejado para frontend (Framework DSB)
************************************************************
*/

// ============= POPULAÇÃO DE FORMULÁRIOS =============

/**
 * Popula formulário com dados recebidos da API
 */
export async function popularFormulario() {
    try {
        console.log(`📋 Populando formulário`);
        
        if (!window.api_finctl) {
            throw new Error("API global não disponível (window.api_finctl)");
        }
        
        const resultadoAPI = await window.api_finctl.consulta_dados_form();
        
        if (resultadoAPI.mensagem === "sucesso") {
            const dadosRecebidos = resultadoAPI.dados;
            if (dadosRecebidos && dadosRecebidos.length > 0) {
                // ✅ INICIALIZA NAVEGAÇÃO DIRETAMENTE (otimização sugerida pelo usuário)
                dadosDisponiveis = dadosRecebidos || [];
                reg_num = 0; // SEMPRE INICIA EM 0 (primeiro registro = índice 0)
                console.log(`📊 Navegação inicializada: ${dadosDisponiveis.length} registros disponíveis`);
                console.log(`📍 Posição atual: reg_num=${reg_num} (registro ${reg_num + 1} de ${dadosDisponiveis.length})`);
                
                // ✅ POPULA FORMULÁRIO COM PRIMEIRO REGISTRO (reg_num = 0)
                _popularFormularioAutomatico(dadosRecebidos[0]);
                _popularSelectNavegacao(dadosRecebidos);
            }
            
            console.log(`✅ Formulário populado com ${dadosRecebidos.length} registros`);
            
            return { 
                sucesso: true, 
                registros: dadosRecebidos.length,
                dados: dadosRecebidos
            };
        } else {
            console.log(`⚠️ Erro na consulta: ${resultadoAPI.mensagem}`);
            return { 
                sucesso: false, 
                mensagem: resultadoAPI.mensagem,
                registros: 0
            };
        }
        
    } catch (error) {
        console.error(`❌ Erro ao popular formulário:`, error);
        return { sucesso: false, erro: error.message };
    }
}

// ============= OPERAÇÕES DE FILTRO =============

/**
 * Executa filtro de busca
 * @param {string} formulario - Nome do formulário
 * @param {Object} criterios - Critérios de filtro
 */
export async function executarFiltro(formulario, criterios) {
    console.log(`🔍 Executando filtro - ${formulario}`, criterios);
    // TODO: Implementar filtro
}

/**
 * Limpa filtros ativos
 * @param {string} formulario - Nome do formulário
 */
export async function limparFiltro(formulario) {
    console.log(`🧹 Limpando filtros - ${formulario}`);
    // TODO: Implementar limpeza de filtros
}

// ============= OPERAÇÕES CRUD =============

/**
 * Insere novo registro
 * @param {string} formulario - Nome do formulário
 * @param {Object} dados - Dados para inserção
 */
export async function inserirRegistro(formulario, dados) {
    try {
        console.log(`📝 Inserindo novo registro - ${formulario}`, dados);
        // TODO: Implementar usando API global ou instância específica
        return { sucesso: true, mensagem: "Registro inserido" };
        
    } catch (error) {
        console.error(`❌ Erro ao inserir registro - ${formulario}:`, error);
        throw error;
    }
}

/**
 * Atualiza registro existente
 * @param {string} formulario - Nome do formulário
 * @param {number|string} id - ID do registro
 * @param {Object} dados - Dados para atualização
 */
export async function salvarRegistro(formulario, id, dados) {
    try {
        console.log(`💾 Salvando registro - ${formulario} ID: ${id}`, dados);
        // TODO: Implementar usando API global ou instância específica
        return { sucesso: true, mensagem: "Registro salvo" };
        
    } catch (error) {
        console.error(`❌ Erro ao salvar registro - ${formulario}:`, error);
        throw error;
    }
}

/**
 * Remove registro
 * @param {string} formulario - Nome do formulário
 * @param {number|string} id - ID do registro
 */
export async function removerRegistro(formulario, id) {
    try {
        console.log(`🗑️ Removendo registro - ${formulario} ID: ${id}`);
        
        // Confirmar remoção
        if (!confirm(`Deseja realmente excluir este registro?`)) {
            console.log(`❌ Remoção cancelada pelo usuário - ${formulario}`);
            return { sucesso: false, cancelado: true };
        }
        
        // TODO: Implementar usando API global ou instância específica
        return { sucesso: true, mensagem: "Registro removido" };
        
    } catch (error) {
        console.error(`❌ Erro ao remover registro - ${formulario}:`, error);
        throw error;
    }
}

// ============= UTILITÁRIOS =============

/**
 * Popula formulário automaticamente por convenção de nomes
 * CONVENÇÃO: Nome dos elementos HTML = Nome das colunas da view
 * 
 * @param {string} formulario - Nome do formulário
 * @param {Object} dados - Dados do primeiro registro
 */
function _popularFormularioAutomatico(dados) {
    console.log(`🔄 Populando formulário automaticamente:`, dados);
    
    for (const [campo, valor] of Object.entries(dados)) {
        // ✅ FILTRO: Ignora campos que não devem ser exibidos (como 'id')
        if (campo === 'id') {
            console.log(`🔍 Campo ${campo} = ${valor} (ignorado - campo interno)`);
            continue; // Pula para o próximo campo
        }
        
        console.log(`🔍 Procurando elemento para campo: ${campo} = ${valor}`);
        
        const elemento = document.querySelector(`[name="${campo}"]`) || 
                         document.querySelector(`#${campo}`) ||
                         document.querySelector(`input[id*="${campo}"], textarea[id*="${campo}"], select[id*="${campo}"]`);
        
        if (elemento) {
            elemento.value = valor || '';
            console.log(`✅ Campo ${campo} populado: ${valor}`);
        } else {
            console.warn(`⚠️ Elemento não encontrado para campo: ${campo}`);
        }
    }
}

/**
 * Popula select de navegação com todos os registros
 * 
 * @param {string} formulario - Nome do formulário
 * @param {Array} dados - Todos os registros recebidos
 */
function _popularSelectNavegacao(formulario, dados) {
    console.log(`🔄 Populando select de navegação - ${formulario}`);
    
    // Procura select de navegação (convenção: select com id contendo 'navegacao' ou 'nav')
    const selectNav = document.querySelector(`select[id*="navegacao"], select[id*="nav"], select[class*="navegacao"]`);
    
    if (selectNav && dados.length > 0) {
        // Limpa opções existentes
        selectNav.innerHTML = '';
        
        // Adiciona opções baseadas nos dados
        dados.forEach((registro, index) => {
            const option = document.createElement('option');
            option.value = index;
            
            // Usa primeiro campo como texto da opção (ou campo específico se conhecido)
            const campoTexto = registro.grupo || registro.nome || registro.descricao || Object.values(registro)[0];
            option.textContent = `${index + 1} - ${campoTexto}`;
            
            selectNav.appendChild(option);
        });
        
        console.log(`✅ Select navegação populado com ${dados.length} opções`);
    }
}

/**
 * Atualiza interface após operação
 */
export function atualizarInterface(operacao) {
    console.log(`🔄 Atualizando interface após ${operacao}`);
    // TODO: Implementar atualização de interface
}

/**
 * Mostra loading durante operação
 * @param {boolean} mostrar - true para mostrar, false para ocultar
 */
export function mostrarLoading(mostrar) {
    // TODO: Implementar loading visual
    if (mostrar) {
        console.log('⏳ Mostrando loading...');
    } else {
        console.log('✅ Ocultando loading...');
    }
}

// ============= SISTEMA DE NAVEGAÇÃO GENÉRICO =============

// 📊 VARIÁVEIS DE CONTROLE DE NAVEGAÇÃO
let dadosDisponiveis = [];  // Array com todos os registros carregados
let reg_num = 0;           // ÍNDICE ATUAL (BASE 0) - corresponde ao índice do array
let contadorExecucoes = 0; // Contador para detectar execuções múltiplas
let listenerConfigurado = false; // Flag para evitar listeners duplicados

/**
 * 🔊 BEEP DE AVISO: Emite som quando usuário tenta ir além dos limites
 * @param {string} limite - Tipo de limite atingido ('primeiro' ou 'ultimo')
 */
function emitirBeepLimite(limite) {
    // Beep do sistema usando AudioContext (mais compatível)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800; // Frequência do beep
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        
        console.log(`🔊 BEEP: Limite ${limite} atingido!`);
    } catch (error) {
        // Fallback: alert ou console se AudioContext não disponível
        console.log(`🔊 BEEP: Limite ${limite} atingido! (AudioContext não disponível)`);
    }
}

/**
 * 🎯 CONFIGURAÇÃO DE LISTENERS: Sistema de navegação genérico para todos os formulários
 * Intercepta eventos 'formulario-acao' e processa navegação de forma unificada
 */
function configurarListenersNavegacao() {
    // ✅ PROTEÇÃO: Evita listeners duplicados
    if (listenerConfigurado) {
        console.log('⚠️ DEBUG OperacoesCRUD: Listener já configurado - ignorando');
        return;
    }
    
    setTimeout(() => {
        const formFooter = document.querySelector('#divFormCrud footer');
        if (formFooter) {
            console.log('🔧 DEBUG OperacoesCRUD: Configurando listeners de navegação genéricos');
            
            formFooter.addEventListener('formulario-acao', function(event) {
                const { acao, instancia, dados } = event.detail;
                
                console.log('🚨🚨🚨 TESTE BREAKPOINT: OperacoesCRUD RECEBEU EVENTO! 🚨🚨🚨');
                console.log('📍 Evento capturado no OperacoesCRUD.js:', acao);
                console.log('📊 Detalhes completos:', event.detail);
                
                // Processa apenas ações de navegação
                if (['primeiro', 'anterior', 'proximo', 'ultimo'].includes(acao)) {
                    console.log(`🎯 DEBUG OperacoesCRUD: Processando navegação genérica: ${acao}`);
                    console.log('🔄 DIRECIONANDO PARA processarNavegacaoGenerica...');
                    processarNavegacaoGenerica(acao, instancia, dados);
                } else {
                    console.log(`⚠️ AÇÃO NÃO É DE NAVEGAÇÃO: ${acao} (ignorando)`);
                }
            });
            
            listenerConfigurado = true; // Marca como configurado
            console.log('✅ DEBUG OperacoesCRUD: Listeners de navegação configurados');
        } else {
            console.error('❌ DEBUG OperacoesCRUD: Footer não encontrado!');
        }
    }, 200);
}

/**
 * 🔄 PROCESSADOR PRINCIPAL: Switch case para ações de navegação
 * @param {string} acao - Ação de navegação (primeiro, anterior, proximo, ultimo)
 * @param {Object} instancia - Instância do formulário
 * @param {Object} dados - Dados do formulário
 */
function processarNavegacaoGenerica(acao, instancia, dados) {
    console.log('🚨🚨🚨 CHEGOU NO processarNavegacaoGenerica! 🚨🚨🚨');
    console.log(`🔄 Processando navegação: ${acao}`);
    console.log('📊 Instância recebida:', instancia);
    console.log('📊 Dados recebidos:', dados);
    
    switch(acao) {
        case 'primeiro':
            console.log('🎯 DIRECIONANDO PARA: navegarParaPrimeiro');
            navegarParaPrimeiro(instancia);
            break;
        case 'anterior':
            console.log('🎯 DIRECIONANDO PARA: navegarParaAnterior');
            navegarParaAnterior(instancia);
            break;
        case 'proximo':
            console.log('🎯 DIRECIONANDO PARA: navegarParaProximo');
            navegarParaProximo(instancia);
            break;
        case 'ultimo':
            console.log('🎯 DIRECIONANDO PARA: navegarParaUltimo');
            navegarParaUltimo(instancia);
            break;
        default:
            console.warn(`❓ Ação de navegação não reconhecida: ${acao}`);
            break;
    }
}

// ============= FUNÇÕES DE NAVEGAÇÃO (ESTRUTURA) =============

/**
 * 🏁 Navegar para o primeiro registro
 */
function navegarParaPrimeiro(instancia) {
    const timestampExecucao = Date.now();
    console.log(`🚨🚨🚨 CHEGOU EM navegarParaPrimeiro! (${timestampExecucao}) 🚨🚨🚨`);
    console.log('🏁 Tentando navegar para primeiro registro');
    console.log('📊 Instância disponível:', instancia);
    
    // ✅ PROTEÇÃO: Detecta execuções muito próximas (possível duplicação)
    if (window.ultimaExecucaoPrimeiro && (timestampExecucao - window.ultimaExecucaoPrimeiro) < 100) {
        console.log(`🚫 EXECUÇÃO DUPLICADA DETECTADA! Ignorando (diferença: ${timestampExecucao - window.ultimaExecucaoPrimeiro}ms)`);
        return;
    }
    window.ultimaExecucaoPrimeiro = timestampExecucao;
    
    // ✅ VALIDAÇÃO: Verifica se há dados disponíveis
    if (!dadosDisponiveis || dadosDisponiveis.length === 0) {
        console.warn('⚠️ Nenhum dado disponível para navegação');
        return;
    }
    
    // ✅ CONTROLE DE LIMITE: Verifica se já está no primeiro (BASE 0)
    if (reg_num === 0) {
        console.log('🔊 Já está no primeiro registro (reg_num=0) - emitindo beep');
        emitirBeepLimite('primeiro');
        return;
    }
    
    // ✅ NAVEGAÇÃO: Move para primeiro registro (reg_num = 0)
    reg_num = 0;
    console.log(`📍 Navegou para primeiro: reg_num=${reg_num} (registro ${reg_num + 1} de ${dadosDisponiveis.length})`);
    
    // ✅ ATUALIZAÇÃO: Popula formulário com novo registro
    _popularFormularioAutomatico(dadosDisponiveis[reg_num]);
    console.log('✅ Formulário atualizado com primeiro registro');
}

/**
 * ⬅️ Navegar para o registro anterior
 */
function navegarParaAnterior(instancia) {
    contadorExecucoes++;
    const timestampExecucao = Date.now();
    console.log(`🚨🚨🚨 CHEGOU EM navegarParaAnterior! EXECUÇÃO #${contadorExecucoes} (${timestampExecucao}) 🚨🚨🚨`);
    console.log(`⬅️ ESTADO INICIAL: reg_num=${reg_num} (registro ${reg_num + 1} de ${dadosDisponiveis.length})`);
    console.log('📊 Instância disponível:', instancia);
    
    // ✅ PROTEÇÃO: Detecta execuções muito próximas (possível duplicação)
    if (window.ultimaExecucaoAnterior && (timestampExecucao - window.ultimaExecucaoAnterior) < 100) {
        console.log(`🚫 EXECUÇÃO DUPLICADA DETECTADA! Ignorando (diferença: ${timestampExecucao - window.ultimaExecucaoAnterior}ms)`);
        return;
    }
    window.ultimaExecucaoAnterior = timestampExecucao;
    
    // ✅ VALIDAÇÃO: Verifica se há dados disponíveis
    if (!dadosDisponiveis || dadosDisponiveis.length === 0) {
        console.warn('⚠️ Nenhum dado disponível para navegação');
        return;
    }
    
    console.log(`🔍 VERIFICAÇÃO: reg_num=${reg_num}, condição (reg_num <= 0) = ${reg_num <= 0}`);
    
    // ✅ CONTROLE DE LIMITE: Verifica se já está no primeiro (BASE 0: reg_num <= 0)
    if (reg_num <= 0) {
        console.log('🔊 Já está no primeiro registro (reg_num<=0) - não pode ir para anterior - emitindo beep');
        emitirBeepLimite('primeiro');
        return;
    }
    
    // ✅ NAVEGAÇÃO: Move um registro para trás (reg_num = reg_num - 1)
    console.log(`🔄 ANTES DO DECREMENTO: reg_num=${reg_num}`);
    reg_num--;
    console.log(`🔄 APÓS DECREMENTO: reg_num=${reg_num}`);
    console.log(`📍 Navegou para anterior: reg_num=${reg_num} (registro ${reg_num + 1} de ${dadosDisponiveis.length})`);
    
    // ✅ ATUALIZAÇÃO: Popula formulário com novo registro
    console.log(`📝 Populando com dados[${reg_num}]:`, dadosDisponiveis[reg_num]);
    _popularFormularioAutomatico(dadosDisponiveis[reg_num]);
    console.log('✅ Formulário atualizado com registro anterior');
}

/**
 * ➡️ Navegar para o próximo registro
 */
function navegarParaProximo(instancia) {
    contadorExecucoes++;
    const timestampExecucao = Date.now();
    console.log(`🚨🚨🚨 CHEGOU EM navegarParaProximo! EXECUÇÃO #${contadorExecucoes} (${timestampExecucao}) 🚨🚨🚨`);
    console.log(`➡️ ESTADO INICIAL: reg_num=${reg_num} (registro ${reg_num + 1} de ${dadosDisponiveis.length})`);
    console.log('📊 Instância disponível:', instancia);
    
    // ✅ PROTEÇÃO: Detecta execuções muito próximas (possível duplicação)
    if (window.ultimaExecucaoProximo && (timestampExecucao - window.ultimaExecucaoProximo) < 100) {
        console.log(`🚫 EXECUÇÃO DUPLICADA DETECTADA! Ignorando (diferença: ${timestampExecucao - window.ultimaExecucaoProximo}ms)`);
        return;
    }
    window.ultimaExecucaoProximo = timestampExecucao;
    
    // ✅ VALIDAÇÃO: Verifica se há dados disponíveis
    if (!dadosDisponiveis || dadosDisponiveis.length === 0) {
        console.warn('⚠️ Nenhum dado disponível para navegação');
        return;
    }
    
    const ultimoIndice = dadosDisponiveis.length - 1; // ÚLTIMO ÍNDICE (BASE 0)
    console.log(`🔍 VERIFICAÇÃO: reg_num=${reg_num}, ultimoIndice=${ultimoIndice}`);
    
    // ✅ CONTROLE DE LIMITE: Verifica se já está no último (BASE 0: reg_num >= length-1)
    if (reg_num >= ultimoIndice) {
        console.log(`🔊 Já está no último registro (reg_num=${reg_num}, último=${ultimoIndice}) - não pode avançar - emitindo beep`);
        emitirBeepLimite('ultimo');
        return;
    }
    
    // ✅ NAVEGAÇÃO: Move um registro para frente (reg_num = reg_num + 1)
    console.log(`🔄 ANTES DO INCREMENTO: reg_num=${reg_num}`);
    reg_num++;
    console.log(`🔄 APÓS INCREMENTO: reg_num=${reg_num}`);
    console.log(`📍 Navegou para próximo: reg_num=${reg_num} (registro ${reg_num + 1} de ${dadosDisponiveis.length})`);
    
    // ✅ ATUALIZAÇÃO: Popula formulário com novo registro
    console.log(`📝 Populando com dados[${reg_num}]:`, dadosDisponiveis[reg_num]);
    _popularFormularioAutomatico(dadosDisponiveis[reg_num]);
    console.log('✅ Formulário atualizado com próximo registro');
}

/**
 * 🏁 Navegar para o último registro
 */
function navegarParaUltimo(instancia) {
    const timestampExecucao = Date.now();
    console.log(`🚨🚨🚨 CHEGOU EM navegarParaUltimo! (${timestampExecucao}) 🚨🚨🚨`);
    console.log('🏁 Tentando navegar para último registro');
    console.log('📊 Instância disponível:', instancia);
    
    // ✅ PROTEÇÃO: Detecta execuções muito próximas (possível duplicação)
    if (window.ultimaExecucaoUltimo && (timestampExecucao - window.ultimaExecucaoUltimo) < 100) {
        console.log(`🚫 EXECUÇÃO DUPLICADA DETECTADA! Ignorando (diferença: ${timestampExecucao - window.ultimaExecucaoUltimo}ms)`);
        return;
    }
    window.ultimaExecucaoUltimo = timestampExecucao;
    
    // ✅ VALIDAÇÃO: Verifica se há dados disponíveis
    if (!dadosDisponiveis || dadosDisponiveis.length === 0) {
        console.warn('⚠️ Nenhum dado disponível para navegação');
        return;
    }
    
    const ultimoIndice = dadosDisponiveis.length - 1; // ÚLTIMO ÍNDICE (BASE 0)
    
    // ✅ CONTROLE DE LIMITE: Verifica se já está no último (BASE 0)
    if (reg_num === ultimoIndice) {
        console.log(`🔊 Já está no último registro (reg_num=${reg_num}) - emitindo beep`);
        emitirBeepLimite('ultimo');
        return;
    }
    
    // ✅ NAVEGAÇÃO: Move para último registro (reg_num = length-1)
    reg_num = ultimoIndice;
    console.log(`📍 Navegou para último: reg_num=${reg_num} (registro ${reg_num + 1} de ${dadosDisponiveis.length})`);
    
    // ✅ ATUALIZAÇÃO: Popula formulário com novo registro
    _popularFormularioAutomatico(dadosDisponiveis[reg_num]);
    console.log('✅ Formulário atualizado com último registro');
}

// ============= INICIALIZAÇÃO =============

// Configura listeners ao carregar o módulo
configurarListenersNavegacao();

// Log de inicialização
console.log('📋 Módulo OperacoesCRUD.js (Framework DSB) carregado - Operações CRUD disponíveis');
