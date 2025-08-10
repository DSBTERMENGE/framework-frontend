import { CriarTabelas } from './General_Classes/ConstrutorDeTabelas.js';

// Função para exibir tabela de exemplo
export function exibirTabelaExemplo1() {
    // Exemplo de configuração para a nova classe
    const titulo = 'Estudantes';
    const descricao = 'localização EstadoxCidade';
    const cabecalho = ['Nome', 'Estado', 'Cidade', 'Curso'];
    const larguras = [20, 8, 20, 20];
    const alinhamento = ['E', 'C', 'E', 'E'];
    const formato = ['T', 'T', 'T', 'T'];
    const tabelaConfig = {};
    const configResultados = [null, null, null, null];
 
    // Configurações dos selects integrados
    const labelsSelects = ['Estado', 'Cidade'];
    const camposSelects = ['estado', 'cidade']; // ← Corrigido: usar os nomes reais dos campos nos dados
    const largCamposSelects = ['8rem', '10rem']; // Larguras fixas em rem - independentes do container
    const arranjoSelects = 'linha'; // ← String: 'linha' ou 'coluna'

    // Configurações dos botões integrados
    const grupoBotoes = ['S', 'N', 'S']; // ← Encerrar + CRUD (sem Navegação)

    // Criação do formulário de tabela COM selects e botões integrados - NOVA SINTAXE!
    const objFormTabela = new CriarTabelas(
        titulo,           // título
        descricao,        // descrição
        cabecalho,        // cabeçalho
        larguras,         // larguras das colunas
        alinhamento,      // alinhamento
        formato,          // formato
        {x: 30, y: 2},    // posição centralizada no topo
        {                 // opções avançadas
            edicaoDeDados: false,
            configResultados: configResultados,
            tabelaConfig: tabelaConfig,
            selects: {
                labels: labelsSelects,
                campos: camposSelects,
                larguras: largCamposSelects,
                arranjo: arranjoSelects
            },
            grupoBotoes: grupoBotoes
        }
    );

    // ✅ NÃO configura dados iniciais - tabela fica vazia
    // A primeira select será populada automaticamente com estados fixos
    // objFormTabela.setDados(estudantes); // ← REMOVIDO!
    
    // Registrar os listeners para cascata  
    registrarListenersSelects();
    
    // Torna o objeto global para debugging
    window.objFormTabela = objFormTabela;
}

// Função de conveniência para ocultar (opcional, já que agora tem botão)
export function ocultarTabelaExemplo1() {
    CriarTabelas.fecharTabela();
}

/*=======================================================
 * HANDLERS - POPULAÇÃO DE SELECTS E TABELAS
 *=======================================================*/

export function registrarListenersSelects() {
/**
 * Registra o listener para eventos de alteração dos selects em cascata.
 * Adiciona o handler 'handlerSelectsCascata' à div de controles dos selects,
 * permitindo que o sistema reaja a cada seleção feita pelo usuário, populando
 * a próxima select ou disparando a consulta final para a tabela.
 * O padrão segue o mesmo modelo dos botões de comando, usando eventos customizados.
 */
    const divControles = document.getElementById('divControlesTabela');
    if (divControles) {
        divControles.addEventListener('select-alterada', handlerSelectsCascata);
    } else {
        console.warn("Div de controles de selects não existe no momento do registro do listener.");
    }
    
    // ========================================
    // SEÇÃO: LISTENER DE BOTÕES (MEM)
    // ========================================
    // Listener para eventos dos botões de formulário
    
    const divBotoes = document.getElementById('divBotoes');
    if (divBotoes) {
        divBotoes.addEventListener('botao-clicado', handlerBotoesCrud);
    } else {
        console.warn("Div de botões não existe no momento do registro do listener.");
    }
}

/**
 * Handler para eventos de alteração dos selects em cascata.
 * Recebe o evento 'select-alterada' disparado por um select.
 * O evento deve conter em event.detail:
 *   - campo: nome do campo do select alterado
 *   - valor: valor selecionado
 *   - selecionados: objeto ou array com todos os valores selecionados até o momento
 * Exemplo de uso: atualizar o próximo select ou filtrar a tabela.
 */
function handlerSelectsCascata(event) {
    // Obtém a lista de campos dos selects (preferencialmente do evento, senão do window)
    const camposSelects = event.detail.camposSelects || window.camposSelects || [];
    const opt = [...camposSelects];

    // O campo que foi alterado vem do evento
    const campo = event.detail.campo;
    const selecionados = event.detail.selecionados;
    
    // Encontra o índice do campo que foi alterado
    const indice = opt.indexOf(campo);
    
    console.log('🔄 Select alterado:', campo, 'Índice:', indice, 'Selecionados:', selecionados, 'opt:', opt);

    // Lista de SQL para Selectst- as queries poderão ser as mesmas ou diferentes.
    // Para multiplos selects, poderá ser necessária criar uma consulta INNER JOIN envolvendos dos os campos e chaves primárias
    //Descomente as SQLs abaixo de acordo com a quantidade de selects
    // Nome de campo usado para popular os selects deve ser igual ao nome no banco de dados
    const sqlFiltro = [
        "SELECT opt(1) FROM queryDB1",
        //"SELECT opt(2) FROM queryDB2",
        //"SELECT opt(3) FROM queryDB3",
        //"SELECT opt(4) FROM queryDB4",
        //"SELECT opt(5) FROM queryDB5"
    ];

    // SQL para popular tabela
    const sqlTabela = "SELECT * query WHERE 1=1";

    switch (campo) {
        case opt[0]:
            //popularSelect_Tabela(sqlFiltro[0], selecionados, 0, opt, window.objFormTabela);
            popularSelect_Tabela_temp(selecionados, 0, opt, window.objFormTabela);
            break;
        case opt[1]:
            //popularSelect_Tabela(sqlFiltro[1], selecionados, 1, opt, window.objFormTabela);
            popularSelect_Tabela_temp(selecionados, 1, opt, window.objFormTabela);
            break;
        case opt[2]:
            popularSelect_Tabela(sqlFiltro[2], selecionados, 2, opt, window.objFormTabela);
            break;
        case opt[3]:
            popularSelect_Tabela(sqlFiltro[3], selecionados, 3, opt, window.objFormTabela);
            break;
        case opt[4]:
            popularSelect_Tabela(sqlFiltro[4], selecionados, 4, opt, window.objFormTabela);
            break;
        default:
            popularSelect_Tabela(sqlFiltro[0], selecionados, 0, opt, window.objFormTabela);
            break;
    }
}

/**
 * Monta a SQL final incluindo cláusula WHERE conforme filtros selecionados
 * Monta a SQL para popular a tabela se for a opção incluindo as cláusulas WHERE conforme filtros selecionados
 * Popula uma Select por vez ou a tabela conforme o select clicado
 * @param {string} sqlBase - SQL base
 * @param {object|array} filtros - Filtros selecionados
 * @returns {string} SQL pronta para consulta
 */
/**
 * Popula um select ou a tabela conforme o select clicado.
 * Se for o último select, monta SQL para a tabela e chama o método para popular a tabela.
 * Se não for o último, monta SQL para o próximo select e chama o método para popular o select.
 * @param {string} sqlBase - SQL base
 * @param {object|array} filtros - Filtros selecionados
 * @param {number} indice - índice do select acionado
 * @param {array} opt - lista de campos dos selects
 * @param {object} objFormTabela - instância do objeto da tabela
 */
function popularSelect_Tabela(sqlBase, filtros, indice, opt, objFormTabela) {
    let where = '';
    if (Array.isArray(filtros)) {
        // Adapte conforme estrutura dos filtros se necessário
    } else if (filtros && typeof filtros === 'object') {
        const clausulas = Object.entries(filtros)
            .filter(([campo, valor]) => valor !== '' && valor != null)
            .map(([campo, valor]) => `${campo} = '${valor}'`);
        if (clausulas.length > 0) {
            where = ' WHERE ' + clausulas.join(' AND ');
        }
    }
    const sqlFinal = sqlBase + where;

    if (indice === opt.length - 1) {
        // Último select: popular a tabela
        if (objFormTabela && typeof objFormTabela.popularTabela === 'function') {
            objFormTabela.popularTabela(sqlFinal);
        } else {
            console.log('🔵 Populando TABELA com:', sqlFinal);
        }
    } else {
        // Não é o último: popular o próximo select
        if (objFormTabela && typeof objFormTabela.popularSelect === 'function') {
            objFormTabela.popularSelect(opt[indice + 1], sqlFinal);
        } else {
            console.log('🟢 Populando SELECT', opt[indice + 1], 'com:', sqlFinal);
        }
    }
}

/*
========================================================
BASE DE DADOS DE ESTUDANTES PARA TESTES
========================================================
*/
export const estudantes = [
  { nome: 'Ana Souza', estado: 'SP', cidade: 'São Paulo', curso: 'Engenharia' },
  { nome: 'Bruno Lima', estado: 'SP', cidade: 'Campinas', curso: 'Direito' },
  { nome: 'Carla Dias', estado: 'SP', cidade: 'Santos', curso: 'Medicina' },
  { nome: 'Daniel Alves', estado: 'SP', cidade: 'São Paulo', curso: 'Arquitetura' },
  { nome: 'Eduarda Pires', estado: 'SP', cidade: 'Campinas', curso: 'Engenharia' },
  { nome: 'Felipe Silva', estado: 'SP', cidade: 'Santos', curso: 'Administração' },
  { nome: 'Gabriela Costa', estado: 'RJ', cidade: 'Rio de Janeiro', curso: 'Engenharia' },
  { nome: 'Henrique Souza', estado: 'RJ', cidade: 'Niterói', curso: 'Direito' },
  { nome: 'Isabela Ramos', estado: 'RJ', cidade: 'Petrópolis', curso: 'Medicina' },
  { nome: 'João Pedro', estado: 'RJ', cidade: 'Rio de Janeiro', curso: 'Arquitetura' },
  { nome: 'Katia Luz', estado: 'RJ', cidade: 'Niterói', curso: 'Engenharia' },
  { nome: 'Lucas Rocha', estado: 'RJ', cidade: 'Petrópolis', curso: 'Administração' },
  { nome: 'Marina Dias', estado: 'MG', cidade: 'Belo Horizonte', curso: 'Engenharia' },
  { nome: 'Nicolas Alves', estado: 'MG', cidade: 'Uberlândia', curso: 'Direito' },
  { nome: 'Olivia Castro', estado: 'MG', cidade: 'Contagem', curso: 'Medicina' },
  { nome: 'Paulo Mendes', estado: 'MG', cidade: 'Belo Horizonte', curso: 'Arquitetura' },
  { nome: 'Quésia Silva', estado: 'MG', cidade: 'Uberlândia', curso: 'Engenharia' },
  { nome: 'Rafael Lima', estado: 'MG', cidade: 'Contagem', curso: 'Administração' },
  { nome: 'Sofia Martins', estado: 'RS', cidade: 'Porto Alegre', curso: 'Engenharia' },
  { nome: 'Tiago Souza', estado: 'RS', cidade: 'Caxias do Sul', curso: 'Direito' },
  { nome: 'Ursula Dias', estado: 'RS', cidade: 'Pelotas', curso: 'Medicina' },
  { nome: 'Vinicius Luz', estado: 'RS', cidade: 'Porto Alegre', curso: 'Arquitetura' },
  { nome: 'Wesley Castro', estado: 'RS', cidade: 'Caxias do Sul', curso: 'Engenharia' },
  { nome: 'Xuxa Ramos', estado: 'RS', cidade: 'Pelotas', curso: 'Administração' },
  { nome: 'Yara Silva', estado: 'BA', cidade: 'Salvador', curso: 'Engenharia' },
  { nome: 'Zeca Dias', estado: 'BA', cidade: 'Feira de Santana', curso: 'Direito' },
  { nome: 'Amanda Luz', estado: 'BA', cidade: 'Vitória da Conquista', curso: 'Medicina' },
  { nome: 'Brenda Rocha', estado: 'BA', cidade: 'Salvador', curso: 'Arquitetura' },
  { nome: 'Caio Martins', estado: 'BA', cidade: 'Feira de Santana', curso: 'Engenharia' },
  { nome: 'Duda Souza', estado: 'BA', cidade: 'Vitória da Conquista', curso: 'Administração' }
];

// Array de estados únicos
export const estados = [...new Set(estudantes.map(e => e.estado))];

// Função para obter cidades únicas de um estado
export function cidadesPorEstado(estado) {
  return [...new Set(estudantes.filter(e => e.estado === estado).map(e => e.cidade))];
}

// Função para filtrar estudantes por estado e cidade
export function filtrarEstudantes(estado, cidade) {
  return estudantes.filter(e =>
    (!estado || e.estado === estado) &&
    (!cidade || e.cidade === cidade)
  );
}


function popularSelect_Tabela_temp(filtros, indice, opt, objFormTabela) {
    console.log('🔄 [TEMP] popularSelect_Tabela_temp chamado:', {indice, filtros, opt});
    
    if (indice === 0) {
        // Clicou no primeiro select (Estado) → popular o próximo select (Cidade)
        const estadoSelecionado = filtros[opt[0]]; // Pega o estado que foi selecionado
        
        if (estadoSelecionado && estadoSelecionado !== '') {
            // Busca cidades do estado selecionado
            const cidades = cidadesPorEstado(estadoSelecionado);
            const dadosCidades = [{ value: '', text: 'Todas' }, ...cidades.map(c => ({ value: c, text: c }))];
            
            if (objFormTabela && objFormTabela.objSelect && typeof objFormTabela.objSelect.popularSelect === 'function') {
                console.log('🟢 [TEMP] Estado selecionado:', estadoSelecionado);
                console.log('🟢 [TEMP] Populando SELECT cidades com:', dadosCidades);
                objFormTabela.objSelect.popularSelect(opt[1], dadosCidades); // opt[1] = campo Cidade
            } else {
                console.warn('⚠️ [TEMP] objFormTabela.objSelect.popularSelect não disponível para cidades');
            }
        } else {
            console.log('🟡 [TEMP] Estado vazio ou "Todos" - limpando select de cidades');
            // Se selecionou "Todos" ou vazio, limpa o select de cidades
            if (objFormTabela && objFormTabela.objSelect && typeof objFormTabela.objSelect.limparSelect === 'function') {
                objFormTabela.objSelect.limparSelect(opt[1]);
            }
        }
        
    } else if (indice === 1) {
        // Clicou no segundo select (Cidade) → popular a tabela
        const estadoSelecionado = filtros[opt[0]] || '';  // Estado selecionado (pode ser vazio)
        const cidadeSelecionada = filtros[opt[1]] || '';  // Cidade selecionada (pode ser vazio)
        
        console.log('🔵 [TEMP] Filtrando tabela - Estado:', estadoSelecionado, 'Cidade:', cidadeSelecionada);
        
        // Filtra dados conforme seleções (permite valores vazios = "Todos")
        const dadosTabela = filtrarEstudantes(
            estadoSelecionado === '' ? null : estadoSelecionado,
            cidadeSelecionada === '' ? null : cidadeSelecionada
        );
        
        if (objFormTabela && typeof objFormTabela.popularTabela === 'function') {
            console.log('🔵 [TEMP] Populando TABELA com:', dadosTabela.length, 'registros');
            objFormTabela.popularTabela(dadosTabela);
        } else {
            console.warn('⚠️ [TEMP] objFormTabela.popularTabela não disponível');
        }
    }
}

// ========================================
// SEÇÃO: HANDLER DE BOTÕES (MEM)
// ========================================

/**
 * Handler para eventos de clique dos botões de formulário.
 * Recebe o evento 'botao-clicado' disparado por um botão.
 * O evento deve conter em event.detail:
 *   - botaoId: ID do botão clicado
 *   - acao: ação do botão (encerrar, editar, incluir, salvar, deletar, etc.)
 *   - grupo: grupo do botão (grupoBtn01, grupoBtn02, grupoBtn03)
 *   - gruposAtivos: array dos grupos ativos
 * 
 * @param {CustomEvent} event - Evento customizado com dados do botão
 */
function handlerBotoesCrud(event) {
    const { botaoId, acao, grupo, gruposAtivos } = event.detail;
    
    console.log(`🔘 Handler Botões - Ação: '${acao}', Grupo: '${grupo}', ID: '${botaoId}'`);
    console.log('📊 Grupos ativos:', gruposAtivos);
    
    // Processa as diferentes ações
    switch(acao) {
        case 'encerrar':
            console.log('🚪 Ação: Encerrar formulário');
            // Implementar lógica para fechar/ocultar formulário
            break;
            
        case 'primeiro':
            console.log('⏮ Ação: Ir para primeiro registro');
            // Implementar navegação para primeiro registro
            break;
            
        case 'recua':
            console.log('⏪ Ação: Ir para registro anterior');
            // Implementar navegação para registro anterior
            break;
            
        case 'avanca':
            console.log('⏩ Ação: Ir para próximo registro');
            // Implementar navegação para próximo registro
            break;
            
        case 'ultimo':
            console.log('⏭ Ação: Ir para último registro');
            // Implementar navegação para último registro
            break;
            
        case 'editar':
            console.log('✏️ Ação: Entrar em modo de edição');
            // Implementar modo de edição
            // Exemplo: habilitar campos, desabilitar alguns botões
            if (window.objFormTabela && window.objFormTabela.objBotoes) {
                window.objFormTabela.objBotoes.habilitarBotao('btn_salvar', true);
                window.objFormTabela.objBotoes.habilitarBotao('btn_editar', false);
                window.objFormTabela.objBotoes.habilitarBotao('btn_incluir', false);
            }
            break;
            
        case 'incluir':
            console.log('➕ Ação: Entrar em modo de inclusão');
            // Implementar modo de inclusão
            // Exemplo: limpar campos, habilitar edição
            if (window.objFormTabela && window.objFormTabela.objBotoes) {
                window.objFormTabela.objBotoes.habilitarBotao('btn_salvar', true);
                window.objFormTabela.objBotoes.habilitarBotao('btn_editar', false);
                window.objFormTabela.objBotoes.habilitarBotao('btn_incluir', false);
            }
            break;
            
        case 'salvar':
            console.log('💾 Ação: Salvar dados');
            // Implementar salvamento
            // Exemplo: validar dados, enviar para servidor, voltar modo visualização
            if (window.objFormTabela && window.objFormTabela.objBotoes) {
                window.objFormTabela.objBotoes.habilitarBotao('btn_salvar', false);
                window.objFormTabela.objBotoes.habilitarBotao('btn_editar', true);
                window.objFormTabela.objBotoes.habilitarBotao('btn_incluir', true);
            }
            break;
            
        case 'deletar':
            console.log('🗑️ Ação: Deletar registro');
            // Implementar exclusão
            // Exemplo: confirmar exclusão, remover registro
            break;
            
        default:
            console.warn(`⚠️ Ação desconhecida: '${acao}'`);
    }
}