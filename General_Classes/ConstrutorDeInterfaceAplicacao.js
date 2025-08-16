// Importando as classes necessárias do framework
import { BarraDeBotoes } from './ConstrutorDeBarrasDeBotoes.js';

/**
 * Construtor de Interface de Aplicação
 * Baseado na lógica testada e validada do ui_menu.js
 * Cria interfaces completas através de configuração parametrizada
 */
export class ConstrutorDeInterfaceAplicacao {
    constructor(config) {
        // Propriedades básicas da aplicação (passadas pelo desenvolvedor)
        this.titulo = config.titulo || "Aplicação DSB";
        this.descricao = config.descricao || "Sistema desenvolvido com Framework DSB";
        this.icone = config.icone || "Assets/icon_app.svg";
        
        // Configuração dos menus (estrutura baseada em ui_menu.js)
        this.menus = config.menus || [];
        
        // Referências aos contêineres principais da interface
        this.divApp = null;
        this.divCabecalho = null;
        this.divCorpo = null;
        this.divRodape = null;
        
        // Estado interno de controle
        this.menusRenderizados = new Map(); // Controla menus criados
        
        // Inicializar referências dos contêineres
        this.inicializarConteineres();
    }

    /**
     * Inicializa as referências dos contêineres principais
     */
    inicializarConteineres() {
        this.divApp = document.getElementById('app');
        this.divCabecalho = document.getElementById('divCabecalho');
        this.divCorpo = document.getElementById('divCorpo');
        this.divRodape = document.getElementById('divRodape');
    }

    /**
     * Método principal que constrói toda a interface
     * Baseado na sequência: criarTitulos() -> constroiMenus() do ui_menu.js
     */
    construirInterface() {
        this.criarTitulosIntegrado();
        this.construirMenus();
        console.log(`Interface construída: ${this.titulo}`);
    }

    /**
     * Cria o título da aplicação (funcionalidade integrada)
     * Substitui a necessidade da classe CriarTitulos
     */
    criarTitulosIntegrado() {
        // Busca o divTitulo
        const divTitulo = document.getElementById('divTitulo');
        if (!divTitulo) {
            console.error('divTitulo não existe.');
            return;
        }
        
        // Preenche o ícone
        const divIcone = divTitulo.querySelector('#divIcone');
        if (divIcone) {
            if (this.icone) {
                divIcone.innerHTML = `<img src="${this.icone}" alt="Ícone" style="width:100%;height:100%;object-fit:contain;">`;
            } else {
                divIcone.innerHTML = `<span style="font-size:2rem;font-weight:bold;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">X</span>`;
            }
        }
        
        // Preenche o nome da aplicação
        const divNomeApp = divTitulo.querySelector('#divNomeApp');
        if (divNomeApp) {
            divNomeApp.textContent = this.titulo;
        }
        
        // Preenche a descrição
        const divDescricao = divTitulo.querySelector('#divDescricao');
        if (divDescricao) {
            divDescricao.textContent = this.descricao;
        }
    }

    /**
     * Constrói todos os menus definidos na configuração
     * Replica a função constroiMenus() do ui_menu.js de forma parametrizada
     */
    construirMenus() {
        this.menus.forEach(menuConfig => {
            this.construirMenu(menuConfig);
        });

        // Exibe apenas o menu principal (seguindo lógica do ui_menu.js)
        this.exibirMenuPrincipal();
    }

    /**
     * Constrói um menu específico
     * Baseado na lógica dos menus individuais do ui_menu.js
     */
    construirMenu(menuConfig) {
        const menu = new BarraDeBotoes(
            menuConfig.botoes,
            menuConfig.orientacao || "horizontal",
            menuConfig.id,
            menuConfig.classe || "cmd"
        );
        
        menu.renderizar();
        
        // Registra o menu como renderizado
        this.menusRenderizados.set(menuConfig.id, menu);
        
        // Oculta menus que não são principais (como no ui_menu.js)
        if (!menuConfig.principal) {
            document.getElementById(menuConfig.id).style.display = "none";
        }
    }

    /**
     * Exibe apenas o menu principal
     * Baseado na lógica de exibição do ui_menu.js
     */
    exibirMenuPrincipal() {
        const menuPrincipal = this.menus.find(menu => menu.principal);
        if (menuPrincipal) {
            // Garante que apenas o menu principal seja exibido
            this.menus.forEach(menu => {
                const elemento = document.getElementById(menu.id);
                if (elemento) {
                    elemento.style.display = menu.principal ? 'flex' : 'none';
                }
            });
        }
    }

    /**
     * Método utilitário para alternar entre menus
     * Replica o comportamento de show/hide do ui_menu.js
     */
    alternarMenu(menuIdParaOcultar, menuIdParaExibir) {
        const menuOcultar = document.getElementById(menuIdParaOcultar);
        const menuExibir = document.getElementById(menuIdParaExibir);
        
        if (menuOcultar) menuOcultar.style.display = 'none';
        if (menuExibir) menuExibir.style.display = 'flex';
    }

    /**
     * Retorna informações sobre os menus construídos
     */
    obterMenusRenderizados() {
        return Array.from(this.menusRenderizados.keys());
    }
}
