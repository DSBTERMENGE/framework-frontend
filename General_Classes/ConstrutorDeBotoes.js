/**
 * Classe para construir botões de formulário com grupos configuráveis
 * Focada em flexibilidade de grupos (Encerrar, Navegação, CRUD)
 * Sistema de ativação por array ['S','N','S'] para cada grupo
 */

export class CriarBotoes {
    /**
     * Construtor da classe CriarBotoes
     * 
     * @param {Array<string>} grupoBotoes - Array com 'S' ou 'N' para cada grupo de botões
     *                                     Posição 0: grupoBtn01 (Encerrar)
     *                                     Posição 1: grupoBtn02 (Navegação) 
     *                                     Posição 2: grupoBtn03 (CRUD)
     *                                     Exemplo: ['S','N','S'] = Encerrar + CRUD
     * 
     * @throws {Error} Lança erro se grupoBotoes não for um array de 3 elementos
     * @throws {Error} Lança erro se algum elemento não for 'S' ou 'N'
     * 
     * @example
     * // Apenas botão Encerrar
     * const botoes = new CriarBotoes(['S','N','N']);
     * 
     * @example
     * // Todos os grupos
     * const botoes = new CriarBotoes(['S','S','S']);
     * 
     * @example
     * // Navegação + CRUD (sem Encerrar)
     * const botoes = new CriarBotoes(['N','S','S']);
     */
    constructor(grupoBotoes) {
        // Validação dos parâmetros
        this._validarParametros(grupoBotoes);
        
        // Propriedade principal
        this.grupoBotoes = grupoBotoes;
        
        // Classes CSS padrão
        this.cssClasses = {
            container: 'botoes-container',
            grupo: 'grupo-botoes',
            botao: 'btn-formulario'
        };
        
        // Maps para controle interno
        this.botoesElementos = new Map(); // Cache dos elementos DOM dos botões
        
        // Configuração inicial
        this._inicializar();
    }
    
    /**
     * Valida os parâmetros fornecidos ao construtor
     * 
     * @param {Array<string>} grupoBotoes - Array de controle dos grupos
     * 
     * @throws {Error} Se alguma validação falhar
     * 
     * @private
     */
    _validarParametros(grupoBotoes) {
        // Validação de grupoBotoes
        if (!Array.isArray(grupoBotoes) || grupoBotoes.length !== 3) {
            throw new Error('O parâmetro "grupoBotoes" deve ser um array com exatamente 3 elementos.');
        }
        
        if (!grupoBotoes.every(item => typeof item === 'string' && ['S', 'N'].includes(item))) {
            throw new Error('Todos os elementos de "grupoBotoes" devem ser "S" ou "N".');
        }
    }

    /**
     * Inicializa as configurações internas da classe
     * Prepara os Maps de controle
     * 
     * @private
     */
    _inicializar() {
        // Log de inicialização
        const gruposAtivos = this.grupoBotoes.map((status, index) => 
            status === 'S' ? `grupo${index + 1}` : null
        ).filter(Boolean);
        
        console.log(`CriarBotoes inicializada: Grupos ativos [${gruposAtivos.join(', ')}]`);
    }

    /**
     * Gera o HTML completo dos botões baseado nos grupos ativos
     * @returns {string} HTML completo dos botões
     */
    gerarHTML() {
        let html = `<div class="${this.cssClasses.container}">`;
        
        // Gera grupos na ordem: 3, 2, 1 (esquerda para direita)
        if (this.grupoBotoes[2] === 'S') { // Grupo 3 - CRUD
            html += this._criarGrupoBtn03();
        }
        
        if (this.grupoBotoes[1] === 'S') { // Grupo 2 - Navegação
            html += this._criarGrupoBtn02();
        }
        
        if (this.grupoBotoes[0] === 'S') { // Grupo 1 - Encerrar
            html += this._criarGrupoBtn01();
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Cria o HTML do Grupo 1 - Botão Encerrar
     * @returns {string} HTML do grupo 1
     * @private
     */
    _criarGrupoBtn01() {
        return `
            <div class="${this.cssClasses.grupo} grupo-btn01" data-grupo="grupoBtn01">
                <button id="btn_encerrar" class="${this.cssClasses.botao}" data-acao="encerrar">
                    ENCERRAR
                </button>
            </div>
        `;
    }

    /**
     * Cria o HTML do Grupo 2 - Botões de Navegação
     * @returns {string} HTML do grupo 2
     * @private
     */
    _criarGrupoBtn02() {
        return `
            <div class="${this.cssClasses.grupo} grupo-btn02" data-grupo="grupoBtn02">
                <button id="btn_primeiro" class="${this.cssClasses.botao}" data-acao="primeiro" title="Primeiro registro">
                    ⏮
                </button>
                <button id="btn_recua" class="${this.cssClasses.botao}" data-acao="recua" title="Registro anterior">
                    ⏪
                </button>
                <button id="btn_avanca" class="${this.cssClasses.botao}" data-acao="avanca" title="Próximo registro">
                    ⏩
                </button>
                <button id="btn_ultimo" class="${this.cssClasses.botao}" data-acao="ultimo" title="Último registro">
                    ⏭
                </button>
            </div>
        `;
    }

    /**
     * Cria o HTML do Grupo 3 - Botões CRUD
     * @returns {string} HTML do grupo 3
     * @private
     */
    _criarGrupoBtn03() {
        return `
            <div class="${this.cssClasses.grupo} grupo-btn03" data-grupo="grupoBtn03">
                <button id="btn_editar" class="${this.cssClasses.botao}" data-acao="editar">
                    Editar
                </button>
                <button id="btn_incluir" class="${this.cssClasses.botao}" data-acao="incluir">
                    Incluir
                </button>
                <button id="btn_salvar" class="${this.cssClasses.botao}" data-acao="salvar">
                    Salvar
                </button>
                <button id="btn_deletar" class="${this.cssClasses.botao}" data-acao="deletar">
                    Deletar
                </button>
            </div>
        `;
    }

    /**
     * Insere os botões em um container específico
     * @param {string|HTMLElement} containerIdOuElemento - ID do container ou elemento DOM
     */
    inserirEm(containerIdOuElemento) {
        let container;
        
        if (typeof containerIdOuElemento === 'string') {
            container = document.getElementById(containerIdOuElemento);
            if (!container) {
                throw new Error(`Container com ID '${containerIdOuElemento}' não encontrado.`);
            }
        } else if (containerIdOuElemento instanceof HTMLElement) {
            container = containerIdOuElemento;
        } else {
            throw new Error('Container deve ser um ID (string) ou elemento DOM.');
        }

        // Insere o HTML no container
        container.innerHTML = this.gerarHTML();
        
        // Armazena referências dos elementos criados e registra event listeners
        this._mapearElementos();
    }

    /**
     * Mapeia os elementos botões criados no DOM e registra event listeners
     * @private
     */
    _mapearElementos() {
        // Lista de todos os possíveis botões
        const todosBotoes = [
            'btn_encerrar', 'btn_primeiro', 'btn_recua', 'btn_avanca', 
            'btn_ultimo', 'btn_editar', 'btn_incluir', 'btn_salvar', 'btn_deletar'
        ];
        
        todosBotoes.forEach(botaoId => {
            const elemento = document.getElementById(botaoId);
            if (elemento) {
                this.botoesElementos.set(botaoId, elemento);
            }
        });
        
        // Registra os event listeners após mapear todos os elementos
        this._registrarEventListeners();
        console.log('✅ Botões mapeados e event listeners registrados');
    }

    /**
     * Registra os event listeners para todos os botões após inserção no DOM
     * Cada botão dispara evento 'botao-clicado' quando clicado
     * 
     * @private
     */
    _registrarEventListeners() {
        this.botoesElementos.forEach((elemento, botaoId) => {
            if (elemento) {
                // Adiciona listener para cliques no botão
                elemento.addEventListener('click', (event) => {
                    this._handleBotaoClick(botaoId, event);
                });
                
                // ========================================
                // CORREÇÃO: Event listeners para mouse
                // ========================================
                // Força reset quando mouse sai do botão
                elemento.addEventListener('mouseleave', () => {
                    this._resetarEstadoBotao(elemento, botaoId);
                });
                
                // Força reset quando focus é perdido
                elemento.addEventListener('blur', () => {
                    this._resetarEstadoBotao(elemento, botaoId);
                });
                
                // Garante estado correto no mouseenter
                elemento.addEventListener('mouseenter', () => {
                    if (!elemento.disabled) {
                        elemento.classList.add('hover-ativo');
                    }
                });
            }
        });
    }
    
    /**
     * Reseta o estado visual do botão para o padrão
     * Corrige problema do estado "travado"
     * 
     * @param {HTMLButtonElement} elemento - Elemento do botão
     * @param {string} botaoId - ID do botão
     * @private
     */
    _resetarEstadoBotao(elemento, botaoId) {
        if (!elemento || elemento.disabled) return;
        
        // Remove classes temporárias
        elemento.classList.remove('hover-ativo');
        
        // Força aplicação dos estilos padrão via JavaScript como fallback
        setTimeout(() => {
            if (!elemento.matches(':hover') && !elemento.matches(':focus')) {
                // Detecta qual grupo pertence para aplicar cor correta
                const grupoContainer = elemento.closest('[data-grupo]');
                const grupo = grupoContainer?.getAttribute('data-grupo');
                
                // Remove estilos inline que possam estar travados
                elemento.style.backgroundColor = '';
                elemento.style.color = '';
                elemento.style.borderColor = '';
                elemento.style.transform = '';
                elemento.style.boxShadow = '';
                
                // Log para debug
                console.log(`🔄 Estado resetado para botão ${botaoId} do ${grupo}`);
            }
        }, 50);
    }

    /**
     * Handler interno para cliques em qualquer botão
     * Dispara evento customizado
     * 
     * @param {string} botaoId - ID do botão que foi clicado
     * @param {Event} event - Evento original de clique
     * @private
     */
    _handleBotaoClick(botaoId, event) {
        const acao = event.target.getAttribute('data-acao');
        const grupo = event.target.closest('[data-grupo]')?.getAttribute('data-grupo');
        
        // Log para debug
        console.log(`🔘 Botão '${acao}' clicado (ID: ${botaoId}, Grupo: ${grupo})`);
        
        // Dispara evento customizado que será capturado pelo sistema externo
        this._dispararEventoBotao(botaoId, acao, grupo);
    }

    /**
     * Dispara o evento customizado 'botao-clicado' 
     * Este evento será capturado pelo sistema externo (ex: ui_tabelas1.js)
     * 
     * @param {string} botaoId - ID do botão clicado
     * @param {string} acao - Ação do botão (data-acao)
     * @param {string} grupo - Grupo do botão
     * @private
     */
    _dispararEventoBotao(botaoId, acao, grupo) {
        // Busca o container principal dos botões para disparar o evento
        const container = document.querySelector(`.${this.cssClasses.container}`);
        
        if (container) {
            // Cria evento customizado com dados necessários
            const eventoCustom = new CustomEvent('botao-clicado', {
                detail: {
                    botaoId: botaoId,
                    acao: acao,
                    grupo: grupo,
                    gruposAtivos: this.grupoBotoes
                },
                bubbles: true  // Permite que o evento suba na árvore DOM
            });
            
            // Dispara o evento no container
            container.dispatchEvent(eventoCustom);
            
            console.log(`📡 Evento 'botao-clicado' disparado para ação '${acao}'`);
        } else {
            console.warn('⚠️ Container de botões não encontrado para disparar evento');
        }
    }

    /**
     * Obtém o elemento botão de um ID específico
     * @param {string} botaoId - ID do botão
     * @returns {HTMLButtonElement|null} Elemento botão ou null se não encontrado
     */
    obterElementoBotao(botaoId) {
        return this.botoesElementos.get(botaoId) || null;
    }

    /**
     * Habilita ou desabilita um botão específico
     * @param {string} botaoId - ID do botão
     * @param {boolean} habilitado - true para habilitar, false para desabilitar
     * @returns {boolean} true se operação bem-sucedida
     */
    habilitarBotao(botaoId, habilitado) {
        const elemento = this.obterElementoBotao(botaoId);
        if (elemento) {
            elemento.disabled = !habilitado;
            return true;
        }
        console.warn(`Botão '${botaoId}' não encontrado para habilitar/desabilitar.`);
        return false;
    }

    /**
     * Remove todos os event listeners (útil para cleanup)
     * Chama antes de destruir a instância
     */
    removerEventListeners() {
        this.botoesElementos.forEach((elemento, botaoId) => {
            if (elemento) {
                // Remove todos os listeners (clone e substitui o elemento)
                const novoElemento = elemento.cloneNode(true);
                elemento.parentNode.replaceChild(novoElemento, elemento);
                
                // Atualiza referência no Map
                this.botoesElementos.set(botaoId, novoElemento);
            }
        });
        
        console.log('🧹 Event listeners removidos de todos os botões');
    }
}
