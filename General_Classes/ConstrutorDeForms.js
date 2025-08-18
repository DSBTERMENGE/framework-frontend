

/**
 * Classe para construção dinâmica de formulários que herda de FormularioBase
 * Reaproveita TODAS as funcionalidades do sistema de formulários
 * + Sistema de campos label-elemento
 * + Posicionamento por linha/coluna
 * + Validação robusta
 * + Integração com CriarSelects (igual às tabelas)
 */

import { FormularioBase } from './ConstrutorDeFormularioBase.js';
import { CriarBtnRodape } from './ConstrutorBtnRodapeForms.js';
import { CriarSelects } from './ConstrutorDeSelects.js';

/**
 * Classe para for            const evento = new CustomEvent('formulario-acao', {
                bubbles: true,
                detail: {
                    acao: acao,
                    instancia: this,
                    ...detalhe
                }
            });
            
            divRodape.dispatchEvent(evento);
            console.log(`Evento customizado disparado: formulario-acao.${acao}`);, herda de FormularioBase
 */
export class FormComum extends FormularioBase {
    /**
     * Cria um formulário comum.
     * @param {string} titulo - Título do formulário (ex: "Cadastro de Clientes")
     * @param {string} descricao - Descrição do propósito do formulário (ex: "1o nível de classificação")
     * @param {Array<string>} tipo - Lista de tipos de campo ('input', 'combo', 'radio', 'checkbox', 'textarea')
     * @param {Array<string>} label - Lista de rótulos dos campos
     * @param {Array<string>} nomeCampo - Lista de nomes/ids dos campos
     * @param {Array<string|null>} format - Lista de formatos ('moeda', 'pct', 'data', null)
     * @param {Array<Object>} pos - Lista de posições dos campos ({linha, coluna})
     * @param {Array<string>} alinhamento - Lista de alinhamentos ('H' para horizontal, 'V' para vertical)
     * @param {Array<string>} largCampos - Lista de larguras dos campos em rem
     * @param {Object} posicaoCanvas - Posição {x, y} em vw/vh
     * @param {Object} opcoes - Opções avançadas
     * @param {Array<string>} opcoes.grupoBotoes - Array ['S'|'N', 'S'|'N', 'S'|'N'] para grupos [Encerrar, Navegação, CRUD]. Padrão: ['S','N','S']
     * @param {Object} opcoes.selects - Configuração das selects: {labels: [], campos: [], larguras: [], arranjo: 'linha'|'coluna'}
     */
    constructor(titulo = '', descricao = '', tipo = [], label = [], nomeCampo = [], format = [], pos = [], alinhamento = [], largCampos = [], posicaoCanvas = {x: 3, y: 5}, opcoes = {}) {
        super(titulo, posicaoCanvas, 'comum');  // ✅ Correto: 'comum' em vez de 'formulario'
        
        // Validação dos parâmetros
        FormComum.validacao(tipo, label, nomeCampo, format, pos, alinhamento, largCampos);
        
        // Propriedades específicas do formulário
        this.descricao = descricao;
        this.tipo = tipo;
        this.label = label;
        this.nomeCampo = nomeCampo;
        this.format = format;
        this.pos = pos;
        this.alinhamento = alinhamento;
        this.largCampos = largCampos;
        
        // Arrays para controle dos campos
        this.fields = [];
        this.buttons = [];
        
        // Sistema de botões configurável (seguindo padrão das tabelas)
        this.grupoBotoes = opcoes.grupoBotoes || ['S', 'N', 'S']; // Padrão: Encerrar + CRUD
        this.criarBotoes = null; // Será criado no render()
        
        // Sistema de selects (seguindo padrão das tabelas)
        this.objSelect = null;
        if (opcoes.selects) {
            const { labels, campos, larguras, arranjo = 'linha' } = opcoes.selects;
            if (labels && campos && larguras) {
                this.objSelect = new CriarSelects(labels, campos, larguras, arranjo);
            }
        }
        
        // ✅ RENDERIZAÇÃO AUTOMÁTICA - Seguindo padrão das tabelas
        // O objeto já sai pronto para uso
        this.render();
    }

    /**
     * Validação dos parâmetros do formulário (método estático)
     */
    static validacao(tipo, label, nomeCampo, format, pos, alinhamento, largCampos) {
        const n = tipo.length;
        const listas = [label, nomeCampo, format, pos, alinhamento, largCampos];
        
        // Verifica se todas as listas têm o mesmo tamanho
        for (let l of listas) {
            if (l.length !== n) throw new Error('Todas as listas devem ter o mesmo número de itens.');
        }

        // Verifica formatos válidos
        const formatosValidos = ['texto', 'moeda', 'pct', 'data', null];
        for (let f of format) {
            if (f !== null && !formatosValidos.includes(f)) {
                throw new Error(`Formato '${f}' não é permitido. Use apenas: ${formatosValidos.join(', ')}`);
            }
        }
        
        // Verifica coordenadas
        for (let p of pos) {
            if (typeof p !== 'object' || !('linha' in p) || !('coluna' in p)) {
                throw new Error('Cada posição deve ser um objeto {linha, coluna}.');
            }
            if (typeof p.linha !== 'number' || typeof p.coluna !== 'number') {
                throw new Error('linha e coluna devem ser números.');
            }
        }
        
        // Verifica alinhamento
        const alinhamentosValidos = ['H', 'V'];
        for (let a of alinhamento) {
            if (!alinhamentosValidos.includes(a)) {
                throw new Error(`Alinhamento '${a}' não é permitido. Use apenas: 'H' (horizontal) ou 'V' (vertical).`);
            }
        }
        
        // Validações extras da propriedade pos
        // Checa se as linhas são sequenciais (0,1,2,...n)
        const linhas = pos.map(p => p.linha);
        const linhasUnicas = [...new Set(linhas)].sort((a, b) => a - b);
        const maxLinha = Math.max(...linhas);
        const linhasEsperadas = Array.from({length: maxLinha + 1}, (_, i) => i);
        const linhasOk = linhasUnicas.length === linhasEsperadas.length && linhasUnicas.every((v, i) => v === linhasEsperadas[i]);
        if (!linhasOk) {
            throw new Error(`As linhas em 'pos' não são sequenciais (0,1,2,...n). Linhas encontradas: ${linhasUnicas.join(', ')}`);
        }

        // Para cada linha, checa se as colunas são sequenciais a partir de zero
        for (let l of linhasUnicas) {
            const colunasLinha = pos.filter(p => p.linha === l).map(p => p.coluna).sort((a, b) => a - b);
            const maxColLinha = Math.max(...colunasLinha);
            for (let c = 0; c <= maxColLinha; c++) {
                if (!colunasLinha.includes(c)) {
                    throw new Error(`Linha ${l} está com colunas não sequenciais. Faltando coluna ${c}.`);
                }
            }
        }
        
        return true; // Se passou por todas as validações, retorna true
    }

    /**
     * Posiciona as divs no formulário conforme a ordem de linha/coluna
     */
    _posicionarDivs() {
        // Agrupa os índices dos campos por linha
        const { fields, pos, form } = this;
        if (!fields || !pos || !form) {
            throw new Error('Instância deve possuir fields, pos e form definidos.');
        }
        const mainConteudo = form.querySelector('#mainConteudo');
        if (!mainConteudo) throw new Error('mainConteudo não encontrado no formulário.');

        // Limpa o conteúdo anterior
        mainConteudo.innerHTML = '';

        // Agrupa os campos por linha
        const linhas = {};
        for (let i = 0; i < pos.length; i++) {
            const l = pos[i].linha;
            if (!linhas[l]) linhas[l] = [];
            linhas[l].push({ idx: i, coluna: pos[i].coluna });
        }

        // Para cada linha, ordena os campos por coluna e adiciona ao container da linha
        const linhasOrdenadas = Object.keys(linhas).map(Number).sort((a, b) => a - b);
        for (const l of linhasOrdenadas) {
            const divLinha = document.createElement('div');
            divLinha.className = `linha-form linha-${l}`;
            divLinha.style.display = 'flex';
            divLinha.style.gap = '1%'; // Espaço entre campos, ajuste conforme necessário
            divLinha.style.width = 'max-content'; // Ocupa só o necessário
            divLinha.style.minWidth = '0'; // Previne overflow

            // Ordena os campos da linha por coluna
            const camposOrdenados = linhas[l].sort((a, b) => a.coluna - b.coluna);
            for (const { idx } of camposOrdenados) {
                divLinha.appendChild(fields[idx]);
            }
            mainConteudo.appendChild(divLinha);
        }
    }

    /**
     * Cria as divs posicionadas (divPos) com rótulo e campo, alinhamento horizontal ou vertical
     */
    _criarDivsCampos() {
        document.getElementById('divFormCrud').classList.remove('hidden');
        for (let i = 0; i < this.tipo.length; i++) {
            const tipo = this.tipo[i];
            const label = this.label[i];
            const nomeCampo = this.nomeCampo[i];
            const format = this.format[i];
            const pos = this.pos[i];
            const alinhamento = this.alinhamento[i] || 'H';
            const div = document.createElement('div');
            div.className = `divPos-${pos.linha}-${pos.coluna}`;
            div.style.display = 'flex';
            div.style.flexDirection = alinhamento === 'V' ? 'column' : 'row';
            div.style.width = 'max-content'; // Ocupa só o necessário para label + campo
            // Rótulo
            if (label) {
                const lbl = document.createElement('label');
                lbl.htmlFor = nomeCampo;
                lbl.textContent = label + ":";
                lbl.style.whiteSpace = 'nowrap'; // Impede quebra de linha no rótulo
                lbl.style.marginRight = '5 rem'; // margem responsiva entre label e campo
                div.appendChild(lbl);
            }
            // Campo
            let campo;
            switch (tipo) {
                case 'input':
                    campo = document.createElement('input');
                    campo.type = 'text';
                    if (this.largCampos && this.largCampos[i] !== undefined) campo.style.width = this.largCampos[i] + 'rem';
                    break;
                case 'combo':
                    campo = document.createElement('select');
                    if (this.largCampos && this.largCampos[i] !== undefined) campo.style.width = this.largCampos[i] + 'rem';
                    break;
                case 'radio':
                    campo = document.createElement('div');
                    campo.className = 'radio-group';
                    break;
                case 'checkbox':
                    campo = document.createElement('input');
                    campo.type = 'checkbox';
                    break;
                case 'textarea':
                    campo = document.createElement('textarea');
                    if (this.largCampos && this.largCampos[i] !== undefined) campo.style.width = this.largCampos[i] + 'rem';
                    break;
                default:
                    campo = document.createElement('input');
                    campo.type = 'text';
            }
            campo.id = nomeCampo;
            campo.name = nomeCampo;
            if (format) campo.setAttribute('data-format', format);
            div.appendChild(campo);
            // Adiciona a div ao formulário (mainConteudo)
            if (this.form && this.form.querySelector('#mainConteudo')) {
                this.form.querySelector('#mainConteudo').appendChild(div);
            }
            this.fields.push(div);
        }
    }

    /**
     * Cria e configura os botões no footer do formulário comum
     */
    _criarBotoesRodape() {
        console.log('🔧 DEBUG: _criarBotoesRodape() chamado');
        console.log('🔧 DEBUG: this.criarBotoes existe?', !!this.criarBotoes);
        
        if (!this.criarBotoes) {
            console.log('❌ criarBotoes não existe, saindo...');
            return;
        }
        
        console.log('✅ Inserindo botões no footer do formulário comum...');
        
        // Busca o container no footer do formulário comum
        const divBotoesFormComum = document.querySelector('#divBotoesFormComum');
        
        console.log('🔧 DEBUG: divBotoesFormComum encontrado?', !!divBotoesFormComum);
        
        if (divBotoesFormComum) {
            try {
                // Insere os botões no container do formulário
                this.criarBotoes.inserirEm(divBotoesFormComum);
                console.log('✅ Botões inseridos no divBotoesFormComum via inserirEm()');
            } catch (error) {
                console.error('❌ Erro ao inserir botões:', error);
            }
        } else {
            console.log('❌ divBotoesFormComum não encontrado no formulário');
        }
    }

    // MÉTODO REMOVIDO: _ocultarFooterLocal() 
    // Era usado para ocultar footer vazio, mas agora sempre temos pelo menos botão Encerrar

    /**
     * ✅ NOVA ABORDAGEM - ESCUTA EVENTOS DO CriarBtnRodape
     * 
     * SOLUÇÃO PARA CONFLITO DE EVENT LISTENERS:
     * - Escuta o evento 'botao-clicado' disparado pelo CriarBtnRodape
     * - Converte para 'formulario-acao' que é esperado pelos form_grupos.js/form_subgrupos.js
     * 
     * FLUXO:
     * Botão → CriarBtnRodape → 'botao-clicado' → [ESTE MÉTODO] → 'formulario-acao' → form_grupos.js
     * 
     * @private
     */
    _configurarEscutaEventosRodape() {
        console.log('🔧 DEBUG FRAMEWORK: Configurando escuta de eventos do CriarBtnRodape');
        
        // Aguarda um pouco para garantir que o DOM está pronto
        setTimeout(() => {
            // Busca o container dos botões (onde CriarBtnRodape dispara 'botao-clicado')
            const containerBotoes = document.querySelector('.botoes-container');
            console.log('🔧 DEBUG FRAMEWORK: Container de botões encontrado:', containerBotoes);
            
            if (containerBotoes) {
                containerBotoes.addEventListener('botao-clicado', (event) => {
                    console.log('🔧 DEBUG FRAMEWORK: Evento botao-clicado capturado!', event.detail);
                
                const { acao, botaoId } = event.detail;
                
                // Mapeia as ações do CriarBtnRodape para as ações do formulário
                const mapeamentoAcoes = {
                    'encerrar': 'encerrar',
                    'primeiro': 'primeiro', 
                    'recua': 'anterior',
                    'avanca': 'proximo',
                    'ultimo': 'ultimo',
                    'incluir': 'novo',
                    'editar': 'editar',
                    'deletar': 'excluir',
                    'salvar': 'salvar'
                };
                
                const acaoFormulario = mapeamentoAcoes[acao];
                
                if (acaoFormulario) {
                    console.log(`🔧 DEBUG FRAMEWORK: Convertendo '${acao}' → '${acaoFormulario}'`);
                    
                    // Dispara o evento que os formulários específicos estão esperando
                    this._dispararEventoCustomizado(acaoFormulario, {
                        dados: this.obterDadosFormulario()
                    });
                } else {
                    console.warn(`🔧 DEBUG FRAMEWORK: Ação '${acao}' não mapeada`);
                }
            });
            
            console.log('✅ DEBUG FRAMEWORK: Listener configurado no container de botões');
        } else {
            console.warn('⚠️ DEBUG FRAMEWORK: Container de botões (.botoes-container) não encontrado');
        }
        }, 500); // Timeout para aguardar DOM
    }

    // Métodos de eventos dos botões - Disparam eventos customizados (padrão das selects)
    _onEncerrar() {
        console.log('🔧 DEBUG FRAMEWORK: _onEncerrar() chamado!'); // DEBUG
        console.log('Encerrando formulário...');
        
        // Dispara evento customizado
        this._dispararEventoCustomizado('encerrar', {
            dados: this.obterDadosFormulario()
        });
        
        // COMENTADO: Teste - pode estar causando reinicialização
        // const divRodape = document.getElementById('divRodape');
        // const divBotoes = divRodape?.querySelector('#divBotoes');
        // if (divBotoes) {
        //     divBotoes.innerHTML = '';
        // }
        
        console.log('✅ Evento de encerramento disparado para o formulário específico');
    }

    _onPrimeiro() {
        console.log('Primeiro registro');
        this._dispararEventoCustomizado('primeiro', {
            dados: this.obterDadosFormulario()
        });
    }

    _onAnterior() {
        console.log('Registro anterior');
        this._dispararEventoCustomizado('anterior', {
            dados: this.obterDadosFormulario()
        });
    }

    _onProximo() {
        console.log('Próximo registro');
        this._dispararEventoCustomizado('proximo', {
            dados: this.obterDadosFormulario()
        });
    }

    _onUltimo() {
        console.log('Último registro');
        this._dispararEventoCustomizado('ultimo', {
            dados: this.obterDadosFormulario()
        });
    }

    _onNovo() {
        console.log('Novo registro');
        this._dispararEventoCustomizado('novo', {
            dados: this.obterDadosFormulario()
        });
        
        // Ação padrão: limpar campos
        this.limparCampos();
    }

    _onEditar() {
        console.log('Editar registro');
        this._dispararEventoCustomizado('editar', {
            dados: this.obterDadosFormulario()
        });
        
        // Ação padrão: habilitar campos
        this.habilitarCampos(true);
    }

    _onExcluir() {
        console.log('Excluir registro');
        this._dispararEventoCustomizado('excluir', {
            dados: this.obterDadosFormulario()
        });
    }

    _onSalvar() {
        console.log('Salvar registro');
        if (this.validarEDados()) {
            this._dispararEventoCustomizado('salvar', {
                dados: this.obterDadosFormulario()
            });
        }
    }

    /**
     * Dispara evento customizado no rodapé global (seguindo padrão das selects)
     * @param {string} acao - Ação do botão (ex: 'salvar', 'excluir')
     * @param {Object} detalhe - Dados do evento
     */
    _dispararEventoCustomizado(acao, detalhe) {
        // Busca o footer do formulário para disparar o evento
        const formFooter = document.querySelector('#divFormCrud footer');
        
        if (formFooter) {
            // Cria evento customizado com dados necessários
            const eventoCustom = new CustomEvent('formulario-acao', {
                detail: {
                    acao: acao,
                    instancia: this,
                    dados: detalhe.dados,
                    formTipo: 'FormComum'  // Identificador do tipo de formulário
                },
                bubbles: true  // Permite que o evento suba na árvore DOM
            });
            
            // Dispara o evento no footer do formulário
            formFooter.dispatchEvent(eventoCustom);
            
            console.log(`✅ Evento 'formulario-acao' disparado no footer do formulário para ação '${acao}'`);
        } else {
            console.warn('⚠️ Footer do formulário não encontrado para disparar evento');
        }
    }

    // Métodos auxiliares para controle do formulário
    limparCampos() {
        this.fields.forEach(field => {
            const input = field.querySelector('input, select, textarea');
            if (input) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            }
        });
    }

    habilitarCampos(habilitar = true) {
        this.fields.forEach(field => {
            const input = field.querySelector('input, select, textarea');
            if (input) {
                input.disabled = !habilitar;
            }
        });
    }

    validarEDados() {
        // Implementar validação dos dados
        // Por enquanto retorna true
        return true;
    }

    salvarDados() {
        // Implementar salvamento dos dados
        // Por enquanto apenas log
        const dados = this.obterDadosFormulario();
        console.log('Dados para salvar:', dados);
        return true;
    }

    /**
     * Define altura específica para textareas do formulário
     * @param {string|Object} altura - Altura em rem (ex: '6rem') ou objeto com campos específicos
     */
    definirAlturaTextarea(altura) {
        this.fields.forEach(field => {
            const textarea = field.querySelector('textarea');
            if (textarea) {
                if (typeof altura === 'string') {
                    // Altura igual para todos os textareas
                    textarea.style.height = altura;
                } else if (typeof altura === 'object' && altura[textarea.name]) {
                    // Altura específica por nome do campo
                    textarea.style.height = altura[textarea.name];
                }
            }
        });
    }

    obterDadosFormulario() {
        const dados = {};
        
        // Coleta dados dos campos do formulário
        this.fields.forEach(field => {
            const input = field.querySelector('input, select, textarea');
            if (input) {
                if (input.type === 'checkbox') {
                    dados[input.name] = input.checked;
                } else if (input.type === 'radio') {
                    if (input.checked) dados[input.name] = input.value;
                } else {
                    dados[input.name] = input.value;
                }
            }
        });
        
        // Coleta dados das selects se existirem
        if (this.objSelect) {
            const valoresSelects = this.objSelect.obterValores();
            Object.assign(dados, valoresSelects);
        }
        
        return dados;
    }

    setForm(form) {
        this.form = form;
    }

    addField(field) {
        this.fields.push(field);
    }

    addButton(button) {
        this.buttons.push(button);
    }

    /**
     * Renderização completa do formulário (OVERRIDE da classe base)
     */
    render() {
        // Configuração específica do formulário
        this.configurarContainer();
        this.posicionarNoCanvas(this.posicaoCanvas.x, this.posicaoCanvas.y);
        this.exibir();
        
        // Aplica título e descrição
        this.configurarHeader(this.titulo, this.descricao);
        
        // Cria e posiciona os campos
        this._criarDivsCampos();
        this._posicionarDivs();
        
        // Renderiza selects se configuradas (igual às tabelas)
        if (this.objSelect) {
            this._criarSelects();
        }
        
        // Cria instância dos botões (antes de configurar rodapé)
        if (this.grupoBotoes) {
            console.log('✅ Criando instância CriarBtnRodape com grupos:', this.grupoBotoes);
            this.criarBotoes = new CriarBtnRodape(this.grupoBotoes);
        }
        
        // Configura os botões usando o método correto
        this._criarBotoesRodape();
        
        // ✅ NECESSÁRIO: Configura listener para converter botao-clicado → formulario-acao  
        this._configurarEscutaEventosRodape();
    }

    /**
     * Cria e renderiza as selects no formulário (seguindo padrão EXATO das tabelas)
     * @private
     */
    _criarSelects() {
        if (!this.form || !this.objSelect) return;
        
        // Usa o container pré-existente (mesmo padrão das tabelas)
        const divControles = this.form.querySelector('#divControlesFormulario');
        
        if (divControles) {
            // Limpa controles anteriores
            divControles.innerHTML = '';
            
            // ✅ EXATAMENTE como nas tabelas: usa inserirEm()
            this.objSelect.inserirEm(divControles);
            
            console.log('✅ Selects criadas seguindo padrão das tabelas');
        }
    }

    // ============= MÉTODOS PÚBLICOS PARA SELECTS =============
    // Seguindo o padrão das tabelas

    /**
     * Popula um select específico com dados
     * @param {string} campo - Nome do campo do select
     * @param {Array<Object>} dados - Array de {value, text}
     * @param {boolean} manterPrimeiro - Se deve manter "Selecione..."
     * @returns {boolean} Sucesso da operação
     */
    popularSelect(campo, dados, manterPrimeiro = true) {
        if (this.objSelect) {
            return this.objSelect.popularSelect(campo, dados, manterPrimeiro);
        }
        console.warn('❌ Selects não configuradas neste formulário');
        return false;
    }

    /**
     * Popula todos os selects de uma vez
     * @param {Object} todosDados - {campo: [{value, text}]}
     * @param {boolean} manterPrimeiro - Se deve manter "Selecione..."
     * @returns {Object} Relatório {sucesso: [], falha: []}
     */
    popularTodosSelects(todosDados, manterPrimeiro = true) {
        if (this.objSelect) {
            return this.objSelect.popularTodosSelects(todosDados, manterPrimeiro);
        }
        console.warn('❌ Selects não configuradas neste formulário');
        return { sucesso: [], falha: [] };
    }

    /**
     * Limpa um select específico
     * @param {string} campo - Nome do campo do select
     * @returns {boolean} Sucesso da operação
     */
    limparSelect(campo) {
        if (this.objSelect) {
            return this.objSelect.limparSelect(campo);
        }
        console.warn('❌ Selects não configuradas neste formulário');
        return false;
    }

    /**
     * Obtém valores selecionados em todas as selects
     * @returns {Object} {campo: valor} dos selects preenchidos
     */
    obterValoresSelects() {
        if (this.objSelect) {
            return this.objSelect.obterValores();
        }
        console.warn('❌ Selects não configuradas neste formulário');
        return {};
    }

    /**
     * Obtém elemento select específico
     * @param {string} campo - Nome do campo
     * @returns {HTMLSelectElement|null} Elemento select
     */
    obterElementoSelect(campo) {
        if (this.objSelect) {
            return this.objSelect.obterElementoSelect(campo);
        }
        console.warn('❌ Selects não configuradas neste formulário');
        return null;
    }

    /**
     * Verifica se o formulário tem selects configuradas
     * @returns {boolean} True se tem selects
     */
    temSelects() {
        return this.objSelect !== null;
    }

    // ============= MÉTODOS DE EVENTOS INTERNOS =============
    
    _onEncerrar() {
        this._dispararEvento('encerrar');
    }
    
    _onPrimeiro() {
        this._dispararEvento('primeiro');
    }
    
    _onAnterior() {
        this._dispararEvento('anterior');
    }
    
    _onProximo() {
        this._dispararEvento('proximo');
    }
    
    _onUltimo() {
        this._dispararEvento('ultimo');
    }
    
    _dispararEvento(acao) {
        const evento = new CustomEvent('formulario-acao', {
            detail: {
                acao: acao,
                instancia: this,
                dados: this.obterDados()
            }
        });
        
        const divRodape = document.getElementById('divRodape');
        if (divRodape) {
            divRodape.dispatchEvent(evento);
        }
    }
}

export default FormComum;