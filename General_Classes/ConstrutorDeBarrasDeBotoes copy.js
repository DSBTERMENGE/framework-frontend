export class BarraDeBotoes {
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
    constructor(labels, orientacao = "horizontal", idDiv = "barra-botoes", idBase = "cmd", top = null, left = null, width = null, height = null) {
        this.labels = labels;
        this.orientacao = orientacao;
        this.idDiv = idDiv;
        this.idBase = idBase;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }

    renderizar() {
        const flexDir = this.orientacao === "vertical" ? "column" : "row";
        let div = document.getElementById(this.idDiv);
        if (!div) {
            div = document.createElement('div');
            div.id = this.idDiv;
            const app = document.getElementById('app');
            if (app) {
                app.appendChild(div);
            } else {
                console.error('Container pai "app" não existe. Menu não foi inserido.');
                return;
            }
        }
        
        // Limpa/remover conteúdo anterior
        div.innerHTML = "";
        
        // Aplica estilos do container sem conflito CSS
        div.style.display = "flex";
        div.style.flexDirection = flexDir;
        div.style.gap = "0.5vw";
        div.style.padding = "0.2vw";
        div.style.boxSizing = "border-box";
        div.style.alignItems = "center";
        div.style.flexWrap = "nowrap";
        div.style.overflow = "visible";
        div.style.position = "absolute";
        div.style.whiteSpace = "normal";
        
        if (this.top !== null) div.style.top = this.top;
        if (this.left !== null) div.style.left = this.left;
        
        // Auto-ajuste de largura se não especificada
        if (this.width !== null) {
            div.style.width = this.width;
            div.style.maxWidth = this.width;
        } else {
            div.style.width = "auto";
            div.style.minWidth = "fit-content";
        }
        
        if (this.height !== null) div.style.height = this.height;

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
            btn.style.backgroundColor = BarraDeBotoes.COR_DE_FUNDO1;
            btn.style.color = BarraDeBotoes.COR_DE_TEXTO1;
            btn.style.cursor = "pointer";
            btn.style.position = "static";
            btn.style.display = "inline-block";
            
            // Efeito hover usando constantes
            btn.onmouseenter = function() {
                btn.style.backgroundColor = BarraDeBotoes.COR_DE_FUNDO2;
                btn.style.color = BarraDeBotoes.COR_DE_TEXTO2;
            };
            btn.onmouseleave = function() {
                btn.style.backgroundColor = BarraDeBotoes.COR_DE_FUNDO1;
                btn.style.color = BarraDeBotoes.COR_DE_TEXTO1;
            };
            
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
}
