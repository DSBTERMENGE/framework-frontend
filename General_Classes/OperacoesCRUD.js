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
 * 
 * OPERAÇÃO DE LEITURA - Propriedades necessárias:
 * - window.api_finctl.view (obrigatório) - Nome da view para consulta
 * - window.api_finctl.campos (opcional) - Campos a retornar (padrão: ["Todos"])
 * 
 * Propriedades NÃO usadas em leitura:
 * - tabela_alvo (só para operações CRUD)
 * - campos_obrigatorios (só para validação em CRUD)
 * 
 * @param {string} formulario - Nome do formulário
 * @param {Object} parametros - Parâmetros de consulta (ordenacao, filtros, etc.)
 */
export async function popularFormulario(formulario, parametros = {}) {
    try {
        console.log(`📋 Populando formulário - ${formulario}`, parametros);
        
        // ✅ ESPECIALIZAÇÃO: Acessa dados via API global e invoca função da API do cliente
        if (!window.api_finctl) {
            throw new Error("API global não disponível (window.api_finctl)");
        }
        
        // ✅ FLUXO: OperacoesCRUD → window.api_finctl.popularform()
        const resultadoAPI = await window.api_finctl.popularform(formulario, {
            ordenacao: parametros.ordenacao
        }, parametros.parametros);
        
        // ✅ NOVA ESTRUTURA: Verifica se houve erro
        if (!resultadoAPI || !resultadoAPI.dados) {
            console.log(`⚠️ Nenhum dado disponível para popular - ${formulario}`);
            return { 
                sucesso: false, 
                mensagem: "Nenhum dado disponível",
                registros: 0
            };
        }
        
        // ✅ POPULAÇÃO AUTOMÁTICA: Se dados recebidos, popula formulário
        const dadosRecebidos = resultadoAPI.dados;
        if (dadosRecebidos && dadosRecebidos.length > 0) {
            // População automática por convenção de nomes
            _popularFormularioAutomatico(formulario, dadosRecebidos[0]); // Primeiro registro
            
            // Popular select de navegação se existir
            _popularSelectNavegacao(formulario, dadosRecebidos);
        }
        
        console.log(`✅ Formulário ${formulario} populado com ${dadosRecebidos.length} registros`);
        
        return { 
            sucesso: true, 
            registros: dadosRecebidos.length,
            formulario: formulario,
            dados: dadosRecebidos
        };
        
    } catch (error) {
        console.error(`❌ Erro ao popular formulário - ${formulario}:`, error);
        return { sucesso: false, erro: error.message };
    }
}

// ============= OPERAÇÕES DE NAVEGAÇÃO =============

/**
 * Navega para o primeiro registro
 * @param {string} formulario - Nome do formulário
 */
export async function navegarPrimeiro(formulario) {
    console.log(`🏁 Navegando para primeiro registro - ${formulario}`);
    // TODO: Implementar navegação primeiro
}

/**
 * Navega para o último registro
 * @param {string} formulario - Nome do formulário
 */
export async function navegarUltimo(formulario) {
    console.log(`🏁 Navegando para último registro - ${formulario}`);
    // TODO: Implementar navegação último
}

/**
 * Navega para o registro anterior
 * @param {string} formulario - Nome do formulário
 */
export async function navegarAnterior(formulario) {
    console.log(`⬅️ Navegando para registro anterior - ${formulario}`);
    // TODO: Implementar navegação anterior
}

/**
 * Navega para o próximo registro
 * @param {string} formulario - Nome do formulário
 */
export async function navegarProximo(formulario) {
    console.log(`➡️ Navegando para próximo registro - ${formulario}`);
    // TODO: Implementar navegação próximo
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
function _popularFormularioAutomatico(formulario, dados) {
    console.log(`🔄 Populando formulário ${formulario} automaticamente:`, dados);
    
    for (const [campo, valor] of Object.entries(dados)) {
        console.log(`🔍 Procurando elemento para campo: ${campo} = ${valor}`);
        
        // Procura elemento por name, id ou querySelector
        const elemento = document.querySelector(`[name="${campo}"]`) || 
                         document.querySelector(`#${campo}`) ||
                         document.querySelector(`input[id*="${campo}"], textarea[id*="${campo}"], select[id*="${campo}"]`);
        
        if (elemento) {
            elemento.value = valor || '';
            console.log(`✅ Campo ${campo} populado: ${valor}`);
        } else {
            console.warn(`⚠️ Elemento não encontrado para campo: ${campo}`);
            // Debug adicional: listar todos os inputs/textareas disponíveis
            const todosElementos = document.querySelectorAll('input, textarea, select');
            console.log('📋 Elementos disponíveis:', Array.from(todosElementos).map(el => ({
                tag: el.tagName,
                name: el.name,
                id: el.id,
                class: el.className
            })));
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
 * @param {string} formulario - Nome do formulário
 * @param {string} operacao - Tipo de operação executada
 */
export function atualizarInterface(formulario, operacao) {
    console.log(`🔄 Atualizando interface - ${formulario} após ${operacao}`);
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

// Log de inicialização
console.log('📋 Módulo OperacoesCRUD.js (Framework DSB) carregado - Operações CRUD disponíveis');
