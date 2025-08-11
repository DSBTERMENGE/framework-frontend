// Importando as classes necessárias do framework
import { BarraDeBotoes } from './ConstrutorDeBarrasDeBotoes.js';
import { CriarTitulos } from './ConstrutorDeTitulos.js';

/**
 * Classe responsável por criar e gerenciar a interface base de uma aplicação
 * Inclui cabeçalho, corpo/canvas e rodapé, além do sistema de menus
 */
export class InterfaceAplicacao {
    constructor(config) {
        // Configurações básicas da aplicação
        this.titulo = config.titulo || "Aplicação DSB";
        this.descricao = config.descricao || "Sistema desenvolvido com Framework DSB";
        this.icone = config.icone || "Assets/icon_app.svg";
        this.versao = config.versao || "1.0.0";
        
        // Configurações dos menus
        this.menus = config.menus || [];
        this.handlers = config.handlers || {};
        
        // Estado interno
        this.menuAtivo = null;
        this.formularios = new Map(); // Para gerenciar formulários no canvas
    }

    /**
     * Inicializa toda a interface da aplicação
     */
    inicializar() {
        this.criarEstruturaTela();
        this.criarTitulo();
        this.criarMenus();
        this.configurarEventos();
        console.log(`${this.titulo} v${this.versao} inicializada com sucesso!`);
    }

    /**
     * Cria a estrutura básica da tela (cabeçalho, corpo, rodapé)
     */
    criarEstruturaTela() {
        // Remove conteúdo existente se houver
        document.body.innerHTML = '';
        
        // Cria a estrutura HTML base
        const estrutura = `
            <div id="cabecalho" class="cabecalho">
                <!-- Título e menus serão inseridos aqui -->
            </div>
            <div id="corpo" class="corpo">
                <!-- Canvas para formulários e conteúdo -->
            </div>
            <div id="rodape" class="rodape">
                <!-- Rodapé da aplicação -->
            </div>
        `;
        
        document.body.innerHTML = estrutura;
    }

    /**
     * Cria o título da aplicação no cabeçalho
     */
    criarTitulo() {
        const titulo = new CriarTitulos(
            this.titulo,
            this.descricao,
            this.icone
        );
        titulo.renderizar();
    }

    /**
     * Cria todos os menus definidos na configuração
     */
    criarMenus() {
        this.menus.forEach(menuConfig => {
            this.criarMenu(menuConfig);
        });
        
        // Exibe o menu principal por padrão
        if (this.menus.length > 0) {
            this.exibirMenu(this.menus[0].id);
        }
    }

    /**
     * Cria um menu específico
     */
    criarMenu(menuConfig) {
        const menu = new BarraDeBotoes(
            menuConfig.botoes,
            menuConfig.orientacao || "horizontal",
            menuConfig.id,
            menuConfig.classe || "cmd"
        );
        
        menu.renderizar();
        
        // Oculta menus que não são principais
        if (!menuConfig.principal) {
            document.getElementById(menuConfig.id).style.display = "none";
        }
    }

    /**
     * Configura os event listeners para todos os menus
     */
    configurarEventos() {
        this.menus.forEach(menuConfig => {
            const elemento = document.getElementById(menuConfig.id);
            if (elemento) {
                elemento.addEventListener('botao-clicado', (e) => {
                    this.processarClique(e, menuConfig.id);
                });
            }
        });
    }

    /**
     * Processa o clique em um botão de menu
     */
    processarClique(evento, menuId) {
        const { label, indice } = evento.detail;
        
        console.log(`Clique no menu ${menuId}: ${label} (índice: ${indice})`);
        
        // Busca o handler específico para este botão
        const nomeHandler = this.encontrarHandler(label, menuId);
        
        if (nomeHandler && this.handlers[nomeHandler]) {
            // Executa o handler passando a instância da interface
            this.handlers[nomeHandler](this, evento.detail);
        } else {
            console.warn(`Handler não encontrado para: ${label} (menu: ${menuId})`);
        }
    }

    /**
     * Encontra o nome do handler para um botão específico
     */
    encontrarHandler(label, menuId) {
        // Converte o label para um nome de handler válido
        // Ex: "Relatórios-1" → "relatorios1"
        const labelNormalizado = label
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ''); // Remove caracteres especiais
        
        return labelNormalizado;
    }

    /**
     * Exibe um menu específico e oculta os outros
     */
    exibirMenu(menuId) {
        this.menus.forEach(menu => {
            const elemento = document.getElementById(menu.id);
            if (elemento) {
                elemento.style.display = menu.id === menuId ? 'flex' : 'none';
            }
        });
        this.menuAtivo = menuId;
    }

    /**
     * Adiciona um formulário ao canvas
     */
    adicionarFormulario(formulario, posicao = {}) {
        const corpo = document.getElementById('corpo');
        if (corpo && formulario) {
            // Remove formulário anterior se existir
            this.limparCanvas();
            
            // Adiciona o novo formulário
            corpo.appendChild(formulario);
            
            // Aplica posicionamento se especificado
            if (posicao.x !== undefined || posicao.y !== undefined) {
                formulario.style.position = 'absolute';
                if (posicao.x !== undefined) formulario.style.left = posicao.x + 'px';
                if (posicao.y !== undefined) formulario.style.top = posicao.y + 'px';
            }
            
            console.log('Formulário adicionado ao canvas');
        }
    }

    /**
     * Limpa o canvas removendo todos os formulários
     */
    limparCanvas() {
        const corpo = document.getElementById('corpo');
        if (corpo) {
            corpo.innerHTML = '';
        }
    }

    /**
     * Retorna ao menu principal
     */
    voltarMenuPrincipal() {
        const menuPrincipal = this.menus.find(menu => menu.principal);
        if (menuPrincipal) {
            this.exibirMenu(menuPrincipal.id);
        }
    }

    /**
     * Atualiza informações da aplicação
     */
    atualizarInfo(novaConfig) {
        if (novaConfig.titulo) this.titulo = novaConfig.titulo;
        if (novaConfig.descricao) this.descricao = novaConfig.descricao;
        if (novaConfig.versao) this.versao = novaConfig.versao;
        
        // Recria o título se foi alterado
        if (novaConfig.titulo || novaConfig.descricao) {
            this.criarTitulo();
        }
    }
}
