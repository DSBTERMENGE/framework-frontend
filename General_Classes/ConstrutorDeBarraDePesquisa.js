/**
 * Classe para criar uma barra de pesquisa composta por comboboxes e um botão Executar.
 *
 * Permite criar dinamicamente uma barra de pesquisa com várias comboboxes (selects) e um botão "Executar".
 * A orientação pode ser horizontal ou vertical. Dispara eventos customizados para popular as comboboxes
 * e para executar a pesquisa, permitindo integração fácil com código externo.
 *
 * Exemplo de uso:
 * const barra = new BarraDePesquisa(["Ano", "Mes", "Instituicao"]);
 * barra.renderizar();
 * document.getElementById("barra-pesquisa").addEventListener("PreencherPrimeiraCombox", () => { ... });
 * document.getElementById("barra-pesquisa").addEventListener("PreencherCombox", e => { ... });
 * document.getElementById("barra-pesquisa").addEventListener("ExecutarPesquisa", e => { ... });
 */
export class BarraDePesquisa {
    /**
 * @param {Array<string>} CBoxes - Lista com os nomes das comboboxes (ex: ["Ano", "Mes", "Instituicao"])
 * @param {string} orientacao - "horizontal" (padrão) ou "vertical"
 * @param {string} idDiv - id do div onde a barra será inserida (opcional)
 * @param {string|number} top - posição top em px, %, vh, vw, etc. (opcional)
 * @param {string|number} left - posição left em px, %, vh, vw, etc. (opcional)
 * @param {string|number} width - largura do bloco (opcional)
     */
    constructor(CBoxes, orientacao = "horizontal", idDiv = "barra-pesquisa", top = null, left = null, width = null) {
        this.CBoxes = CBoxes;
        this.orientacao = orientacao;
        this.idDiv = idDiv;
        this.top = top;
        this.left = left;
        this.width = width;
        this.combos = {}; // Guarda referências aos elementos select
        this.btnExecutar = null;
    }

    renderizar() {
        let div = document.getElementById(this.idDiv);
        if (!div) {
            div = document.createElement('div');
            div.id = this.idDiv;
            const app = document.getElementById('app');
            if (app) {
                app.appendChild(div);
            } else {
                console.error('Container pai "app" não existe. Barra de pesquisa não foi inserida.');
                return;
            }
        }
        div.innerHTML = "";
        div.style.display = "flex";
        div.style.flexDirection = this.orientacao === "vertical" ? "column" : "row";
        div.style.gap = "8px";
        div.style.alignItems = "center";
        // Aplica estilos de posicionamento e largura
        if (this.top !== null) {
            div.style.position = "absolute";
            div.style.top = typeof this.top === "number" ? `${this.top}px` : this.top;
        }
        if (this.left !== null) {
            div.style.position = "absolute";
            div.style.left = typeof this.left === "number" ? `${this.left}px` : this.left;
        }
        if (this.width !== null) {
            div.style.width = typeof this.width === "number" ? `${this.width}px` : this.width;
        }

        // Cria as comboboxes
        this.CBoxes.forEach((nome, idx) => {
            const select = document.createElement('select');
            select.id = `cbx-${nome}`;
            select.disabled = idx > 0; // Só a primeira ativa inicialmente
            select.dataset.idx = idx;
            select.dataset.nome = nome;
            select.addEventListener("change", (e) => this._onComboChange(e));
            this.combos[nome] = select;
            div.appendChild(select);
        });

        // Cria o botão Executar
        this.btnExecutar = document.createElement('button');
        this.btnExecutar.textContent = "Executar";
        this.btnExecutar.disabled = true;
        this.btnExecutar.onclick = () => this._onExecutar();
        div.appendChild(this.btnExecutar);

        // Dispara evento para popular a primeira combobox
        div.dispatchEvent(new CustomEvent("PreencherPrimeiraCombox", { bubbles: true }));
    }

    /**
     * Popula uma combobox com dados.
     * @param {string} nome - Nome da combobox (deve estar em CBoxes)
     * @param {Array<string>} dados - Lista de opções
     * @param {boolean} todas - Se true, adiciona opção "Todas" no topo
     */
    popularCombox(nome, dados, todas = false) {
        const select = this.combos[nome];
        if (!select) return;
        select.innerHTML = "";
        if (todas) {
            const optTodas = document.createElement('option');
            optTodas.value = "";
            optTodas.textContent = "Todas";
            select.appendChild(optTodas);
        }
        dados.forEach(valor => {
            const opt = document.createElement('option');
            opt.value = valor;
            opt.textContent = valor;
            select.appendChild(opt);
        });
        select.disabled = false;
    }

    // Evento interno: ao mudar uma combobox, ativa a próxima e dispara evento para popular
    _onComboChange(e) {
        const idx = parseInt(e.target.dataset.idx);
        const proxIdx = idx + 1;
        // Desabilita e limpa as próximas comboboxes
        for (let i = proxIdx; i < this.CBoxes.length; i++) {
            const nome = this.CBoxes[i];
            this.combos[nome].innerHTML = "";
            this.combos[nome].disabled = true;
        }
        // Se existe próxima, dispara evento para popular ela
        if (proxIdx < this.CBoxes.length) {
            const proxNome = this.CBoxes[proxIdx];
            const div = document.getElementById(this.idDiv);
            div.dispatchEvent(new CustomEvent("PreencherCombox", {
                detail: {
                    nome: proxNome,
                    filtro: this._getFiltro(idx + 1)
                },
                bubbles: true
            }));
        } else {
            // Última combobox preenchida, ativa o botão Executar
            this.btnExecutar.disabled = false;
        }
    }

    // Coleta os valores selecionados das comboboxes
    _getFiltro(qtd = this.CBoxes.length) {
        return this.CBoxes.slice(0, qtd).map(nome => this.combos[nome].value);
    }

    // Evento do botão Executar
    _onExecutar() {
        const filtro = this._getFiltro();
        const div = document.getElementById(this.idDiv);
        div.dispatchEvent(new CustomEvent("ExecutarPesquisa", {
            detail: { filtro },
            bubbles: true
        }));
    }
}