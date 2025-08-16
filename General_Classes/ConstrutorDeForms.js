

/**
 * Classe para construção dinâmica de formulários que herda de FormularioBase
 * Reaproveita TODAS as funcionalidades do sistema de formulários
 * + Sistema de campos label-elemento
 * + Posicionamento por linha/coluna
 * + Validação robusta
 * + Integração com CriarSelects (igual às tabelas)
 */

import { FormularioBase } from './ConstrutorDeFormularioBase.js';
import { CriarBotoes } from './ConstrutorDeBotoes.js';
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
     * Cria e configura os botões no rodapé global (seguindo padrão das tabelas)
     */
    _criarBotoesRodape() {
        const divRodape = document.getElementById('divRodape');
        if (!divRodape || !this.criarBotoes) return;
        
        console.log('✅ Configurando botões no rodapé global...');
        
        // Limpa botões anteriores do rodapé
        const divBotoes = divRodape.querySelector('#divBotoes');
        if (divBotoes) {
            divBotoes.innerHTML = '';
            
            // Adiciona botões no rodapé global (mesmo padrão das tabelas)
            const botoesHTML = this.criarBotoes.gerarHTML();
            divBotoes.innerHTML = botoesHTML;
            
            console.log('✅ Botões inseridos no rodapé global');
        } else {
            console.log('❌ divBotoes não encontrado no rodapé');
        }
    }

    /**
     * Remove botões do footer local e o oculta para não ocupar espaço
     */
    _ocultarFooterLocal() {
        if (!this.form) return;
        
        const footer = this.form.querySelector('footer');
        if (footer) {
            // Remove todos os botões do footer local
            footer.innerHTML = '';
            
            // Oculta o footer para não ocupar espaço no canvas
            footer.style.display = 'none';
            footer.style.height = '0px';
            footer.style.padding = '0px';
            footer.style.margin = '0px';
            footer.style.minHeight = '0px';
            
            console.log('✅ Footer local ocultado - espaço liberado no canvas');
        }
    }

    /**
     * Configura os eventos dos botões do formulário
     */
    _configurarEventosBotoes() {
        if (!this.criarBotoes) return;
        
        // Eventos para grupo Encerrar
        if (this.grupoBotoes[0] === 'S') {
            const btnEncerrar = this.criarBotoes.obterElementoBotao('btn_encerrar');
            console.log('🔧 DEBUG FRAMEWORK: Botão encerrar encontrado:', btnEncerrar); // DEBUG
            if (btnEncerrar) {
                btnEncerrar.addEventListener('click', () => {
                    console.log('🔧 DEBUG FRAMEWORK: Click no botão encerrar capturado!'); // DEBUG
                    this._onEncerrar();
                });
                console.log('🔧 DEBUG FRAMEWORK: Event listener adicionado ao botão encerrar'); // DEBUG
            } else {
                console.warn('🔧 DEBUG FRAMEWORK: Botão encerrar NÃO encontrado!'); // DEBUG
            }
        }
        
        // Eventos para grupo Navegação 
        if (this.grupoBotoes[1] === 'S') {
            const btnPrimeiro = this.criarBotoes.obterElementoBotao('btn_primeiro');
            const btnRecua = this.criarBotoes.obterElementoBotao('btn_recua');
            const btnAvanca = this.criarBotoes.obterElementoBotao('btn_avanca');
            const btnUltimo = this.criarBotoes.obterElementoBotao('btn_ultimo');
            
            if (btnPrimeiro) btnPrimeiro.addEventListener('click', () => this._onPrimeiro());
            if (btnRecua) btnRecua.addEventListener('click', () => this._onAnterior());
            if (btnAvanca) btnAvanca.addEventListener('click', () => this._onProximo());
            if (btnUltimo) btnUltimo.addEventListener('click', () => this._onUltimo());
        }
        
        // Eventos para grupo CRUD
        if (this.grupoBotoes[2] === 'S') {
            const btnIncluir = this.criarBotoes.obterElementoBotao('btn_incluir');
            const btnEditar = this.criarBotoes.obterElementoBotao('btn_editar');
            const btnDeletar = this.criarBotoes.obterElementoBotao('btn_deletar');
            const btnSalvar = this.criarBotoes.obterElementoBotao('btn_salvar');
            
            if (btnIncluir) btnIncluir.addEventListener('click', () => this._onNovo());
            if (btnEditar) btnEditar.addEventListener('click', () => this._onEditar());
            if (btnDeletar) btnDeletar.addEventListener('click', () => this._onExcluir());
            if (btnSalvar) btnSalvar.addEventListener('click', () => this._onSalvar());
        }
    }

    // Métodos de eventos dos botões - Disparam eventos customizados (padrão das selects)
    _onEncerrar() {
        console.log('🔧 DEBUG FRAMEWORK: _onEncerrar() chamado!'); // DEBUG
        console.log('Encerrando formulário...');
        
        // Dispara evento customizado
        this._dispararEventoCustomizado('encerrar', {
            dados: this.obterDadosFormulario()
        });
        
        // Limpa os botões do rodapé global
        const divRodape = document.getElementById('divRodape');
        const divBotoes = divRodape?.querySelector('#divBotoes');
        if (divBotoes) {
            divBotoes.innerHTML = '';
        }
        
        // Oculta o formulário
        this.ocultar();
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
        // Busca o rodapé global para disparar o evento (mesmo padrão das selects)
        const divRodape = document.getElementById('divRodape');
        
        if (divRodape) {
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
            
            // Dispara o evento no rodapé (será capturado pelo listener em ui_formularios.js)
            divRodape.dispatchEvent(eventoCustom);
            
            console.log(`� Evento 'formulario-acao' disparado para ação '${acao}'`);
        } else {
            console.warn('⚠️ Rodapé global não encontrado para disparar evento');
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
        
        // Remove botões duplicados do footer local e libera espaço no canvas
        this._ocultarFooterLocal();
        
        // Cria instância dos botões (antes de configurar rodapé)
        if (this.grupoBotoes) {
            console.log('✅ Criando instância CriarBotoes com grupos:', this.grupoBotoes);
            this.criarBotoes = new CriarBotoes(this.grupoBotoes);
        }
        
        // Configura os botões no rodapé global
        this._criarBotoesRodape();
        
        // Configura eventos dos botões
        this._configurarEventosBotoes();
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