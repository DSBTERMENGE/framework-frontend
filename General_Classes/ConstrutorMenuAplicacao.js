/**
 ************ ConstrutorMenuAplicacao **************
 * Constrói os botões do menu no cabeçalho da interface da aplicação
 */

export class CriarMenuAplicacao {
    // Constantes de cor para os botões
    static COR_DE_FUNDO1 = "#888"; // medium-gray
    static COR_DE_FUNDO2 = "yellow";
    static COR_DE_TEXTO1 = "white";
    static COR_DE_TEXTO2 = "green";
    /**
     * @param {Array<string>} labels - Lista de nomes dos botões (ex: ["alterar", "excluir", "ler", "sair"])
     * @param {string} orientacao - "horizontal" (padrão) ou "vertical"
     * @param {string} idDiv - id do div onde a barra será inserida (opcional)
     * @param {string} idBase - prefixo do id dos botões (opcional, padrão: "cmd")
     * @param {string|number} top - posição top em mvh (opcional)
     * @param {string|number} left - posição left em mvw (opcional)
     * @param {string|number} width - largura do bloco em vw(opcional)
     * @param {string|number} height - altura do bloco em vh(opcional)
     */
    constructor(labels, orientacao = "horizontal", idDiv = "divMenu", idBase = "cmd") {
        this.labels = labels;
        this.orientacao = orientacao;
        this.idDiv = idDiv;
        this.idBase = idBase;
    }

    renderizar() {
        const flexDir = this.orientacao === "vertical" ? "column" : "row";
        let div = document.getElementById(this.idDiv);
        if (!div) {
            div = document.createElement('div');
            div.id = this.idDiv;
            // Adiciona como filha da divMenu principal
            const divMenu = document.getElementById('divMenu');
            if (divMenu) {
                divMenu.appendChild(div);
            } else {
                console.error("divMenu principal não existe no HTML.");
                return;
            }
        }
        // Limpa/remover conteúdo anterior
        div.innerHTML = "";
        // Aplica apenas estilos de layout relevantes
        div.style.display = "flex";
        div.style.flexDirection = flexDir;
        div.style.gap = "0.5vw";
        div.style.padding = "0.2vw";
        div.style.alignItems = "center";

        // Cria os botões
        this.labels.forEach((label, index) => {
            const id = `${this.idBase}-${label}`;
            const btn = document.createElement('button');
            btn.id = id;
            btn.textContent = label.charAt(0).toUpperCase() + label.slice(1);
            // Estilos normais para botões (usando constantes)
            btn.style.flex = "0 0 auto";
            btn.style.padding = "0.3vw 0.6vw";
            btn.style.margin = "0";
            btn.style.boxSizing = "border-box";
            btn.style.fontSize = "1vw";
            btn.style.whiteSpace = "nowrap";
            btn.style.height = "auto";
            btn.style.minHeight = "2.2vh";
            btn.style.backgroundColor = CriarMenuAplicacao.COR_DE_FUNDO1;
            btn.style.color = CriarMenuAplicacao.COR_DE_TEXTO1;
            btn.style.cursor = "pointer";
            btn.style.display = "inline-block";
            
            // ✅ NOVO: Adiciona classe CSS para controle de hover via CSS
            btn.classList.add('btn-menu');
            
            // ✅ NOVO: Sistema de reset forçado (como nos botões do rodapé)
            btn.addEventListener('mouseleave', () => {
                this._resetarEstadoBotaoMenu(btn);
            });
            
            btn.addEventListener('blur', () => {
                this._resetarEstadoBotaoMenu(btn);
            });
            
            div.appendChild(btn);
            btn.onclick = () => {
                div.dispatchEvent(new CustomEvent("botao-clicado", {
                    detail: {
                        label: label,
                        indice: this.labels.indexOf(label),
                        idDiv: this.idDiv,
                        extra: { idBotao: btn.id }
                    }
                }));
            };
        });
    }
    
    /**
     * ✅ NOVO: Reseta o estado visual do botão do menu para o padrão
     * Corrige problema do estado "travado" (baseado no sistema dos botões do rodapé)
     * 
     * @param {HTMLButtonElement} elemento - Elemento do botão
     * @private
     */
    _resetarEstadoBotaoMenu(elemento) {
        if (!elemento || elemento.disabled) return;
        
        // Força aplicação dos estilos padrão via JavaScript como fallback
        setTimeout(() => {
            if (!elemento.matches(':hover') && !elemento.matches(':focus')) {
                // Remove estilos inline que possam estar travados
                elemento.style.backgroundColor = '';
                elemento.style.color = '';
                elemento.style.borderColor = '';
                elemento.style.transform = '';
                elemento.style.boxShadow = '';
                
                // Força reaplicação da classe CSS
                elemento.classList.remove('btn-menu');
                elemento.classList.add('btn-menu');
            }
        }, 10);
    }
}
