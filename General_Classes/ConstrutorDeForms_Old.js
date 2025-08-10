

/**
 * Classe base para construção dinâmica de formuláriosComuns e modais.
 *
 */
class Forms_Base {
    /**
     * Orquestra a construção do formulário: cria campos, posiciona e renderiza.
     * @param {Forms_Base} instancia - Instância do formulário (FormComum ou FormModal)
     */
    static criarForm(instancia) {
            if (!instancia.form) {
        // Atribuindo o elemento do formulário definido em index.html ao objeto
        instancia.setForm(document.getElementById('formCrud'));
    }
        instancia.criarDivsCampos();
        Forms_Base.posicionarDivs(instancia);
        instancia.render();
    }
    /** Título do formulário (ex: "Cadastro de Clientes") */
    titulo = '';

    /** Lista de tipos de campo ('input', 'combo', 'radio', 'checkbox', 'textarea') */
    tipo = [];
    /** Lista de rótulos dos campos */
    label = [];
    /** Lista de nomes/ids dos campos */
    nomeCampo = [];
    /** Lista de formatos ('texto', 'moeda', 'pct', 'data', null) */
    format = [];
    /** Lista de opções para combos/radios (array de strings ou objetos {value, label}) */
    pos = [];
    /** Lista de alinhamentos ('H' para horizontal, 'V' para vertical) */
    alinhamento = [];
    /** Elemento do formulário */
    form = null;
    /** Campos do formulário */
    fields = [];
    /** Botões do formulário */
    buttons = [];

    /**
     * Construtor da classe base de formulários.
     * @param {string} titulo - Título do formulário (ex: "Cadastro de Clientes")
     * @param {Array<string>} tipo - Lista de tipos de campo
     * @param {Array<string>} label - Lista de rótulos dos campos
     * @param {Array<string>} nomeCampo - Lista de nomes/ids dos campos
     * @param {Array<string|null>} format - Lista de formatos
     * @param {Array<Object>} pos - Lista de posições dos campos
     * @param {Array<string>} alinhamento - Lista de alinhamentos
     * @param {Array<string>} largCampos - Lista de larguras dos campos em rem
     */
    constructor(titulo = '', tipo = [], label = [], nomeCampo = [], format = [], pos = [], alinhamento = [], largCampos = []) {
        Forms_Base.validacao(tipo, label, nomeCampo, format, pos, alinhamento, largCampos);
        this.titulo = titulo;
        this.tipo = tipo;
        this.label = label;
        this.nomeCampo = nomeCampo;
        this.format = format;
        this.pos = pos;
        this.alinhamento = alinhamento;
        this.largCampos = largCampos; // Largura dos campos, se necessário
        this.form = null;
        this.fields = [];
        this.buttons = [];
    }

    /**
     * Posiciona as divs no formulário conforme a ordem de linha/coluna.
     * Não agrupa por linhas, apenas ordena e insere, deixando o layout flexível.
     * @param {Array<HTMLElement>} divs - Array de divs criadas para os campos
     * @param {Array<Object>} pos - Array de objetos {linha, coluna} para cada campo
     * @param {HTMLElement} form - Elemento do formulário onde as divs serão inseridas
     */
    /**
     * Posiciona as divs no formulário conforme a ordem de linha/coluna usando as propriedades do objeto.
     * @param {Object} instancia - Instância da classe que possui as propriedades divs, pos e form
     */
    static posicionarDivs(instancia) {
    // Agrupa os índices dos campos por linha
    const { fields, pos, form } = instancia;
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
    
    static validacao(tipo, label, nomeCampo, format,  pos, alinhamento, largCampos) {

        const n = tipo.length;
        const listas = [label, nomeCampo, format,  pos, alinhamento, largCampos];
        // Verifica se todas as listas têm o mesmo tamanho
        for (let l of listas) {
            if (l.length !== n) throw new Error('Todas as listas devem ter o mesmo número de itens.');
        }

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
        return true; // Se passou por todas as validações, retorna true
    
    // --- Validações extras da propriedade pos ---
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
    
    }

    /**
     * Cria as divs posicionadas (divPos) com rótulo e campo, alinhamento horizontal ou vertical
     */

    /**
     * Valida a propriedade pos e define o tipo de grid: 'coluna', 'linha' ou 'retangular'.
     * Também define o CSS do #mainConteudo conforme o tipo detectado.
     * @returns {Object} { tipo: 'coluna'|'linha'|'retangular', linhas, colunas, maxLinha, maxColuna }
     */
    validarPos_old() {
        if (!this.form || !this.form.querySelector('#mainConteudo')) {
            throw new Error('Formulário não está definido ou não possui uma seção <main> para inserir os campos.');
        }
        const main = this.form.querySelector('#mainConteudo');
        const pos = this.pos;
        const linhas = pos.map(p => p.linha);
        const colunas = pos.map(p => p.coluna);
        const linhasUnicas = [...new Set(linhas)].sort((a, b) => a - b);
        const colunasUnicas = [...new Set(colunas)].sort((a, b) => a - b);
        const maxLinha = Math.max(...linhas);
        const maxColuna = Math.max(...colunas);

        // Teste coluna única
        if (colunasUnicas.length === 1) {
            // Checa se linhas são sequenciais
            const sequencial = linhasUnicas.every((v, i) => v === i);
            if (!sequencial) {
                console.error('Erro de layout: As linhas não são sequenciais (0,1,2,...n) para coluna única.');
                return { tipo: 'erro', motivo: 'linhas não sequenciais' };
            }
            main.style.display = 'flex';
            main.style.flexDirection = 'column';
            main.style.removeProperty('gridTemplateColumns');
            main.style.removeProperty('gridTemplateRows');
            main.style.removeProperty('gridTemplateAreas');
            return { tipo: 'coluna', linhas: linhasUnicas.length, colunas: 1, maxLinha, maxColuna };
        }
        // Teste linha única
        if (linhasUnicas.length === 1) {
            // Checa se colunas são sequenciais
            const sequencial = colunasUnicas.every((v, i) => v === i);
            if (!sequencial) {
                console.error('Erro de layout: As colunas não são sequenciais (0,1,2,...n) para linha única.');
                return { tipo: 'erro', motivo: 'colunas não sequenciais' };
            }
            main.style.display = 'flex';
            main.style.flexDirection = 'row';
            main.style.removeProperty('gridTemplateColumns');
            main.style.removeProperty('gridTemplateRows');
            main.style.removeProperty('gridTemplateAreas');
            return { tipo: 'linha', linhas: 1, colunas: colunasUnicas.length, maxLinha, maxColuna };
        }
        // Teste linhas irregulares (grid flexível)
        // 1. As linhas devem ser sequenciais (0,1,2,...n)
        const linhasEsperadas = Array.from({length: maxLinha + 1}, (_, i) => i);
        const linhasOk = linhasUnicas.length === linhasEsperadas.length && linhasUnicas.every((v, i) => v === linhasEsperadas[i]);
        if (!linhasOk) {
            console.error('Erro de layout: As linhas não são sequenciais (0,1,2,...n) para grid flexível. Linhas encontradas:', linhasUnicas);
            return { tipo: 'erro', motivo: 'linhas não sequenciais', linhasEncontradas: linhasUnicas };
        }
        // 2. Para cada linha, as colunas devem ser sequenciais a partir de zero
        let faltantes = [];
        for (let l of linhasUnicas) {
            const colunasLinha = pos.filter(p => p.linha === l).map(p => p.coluna).sort((a,b)=>a-b);
            const maxColLinha = Math.max(...colunasLinha);
            for (let c = 0; c <= maxColLinha; c++) {
                if (!colunasLinha.includes(c)) {
                    faltantes.push(`(${l},${c})`);
                }
            }
        }
        if (faltantes.length > 0) {
            main.style.display = 'block';
            main.style.removeProperty('flexDirection');
            main.style.removeProperty('gridTemplateColumns');
            main.style.removeProperty('gridTemplateRows');
            main.style.removeProperty('gridTemplateAreas');
            console.error(
                `Erro de layout: O grid flexível está inconsistente. Faltam as posições: ${faltantes.join(', ')}.\n` +
                'Cada linha deve ter colunas sequenciais a partir de zero.'
            );
            return { tipo: 'erro', motivo: 'grid flexível inconsistente', faltantes };
        }
        // Se passou, aplica grid com linhas automáticas
        main.style.display = 'grid';
        main.style.gridTemplateColumns = `repeat(${maxColuna + 1}, 1fr)`;
        main.style.gridAutoRows = 'auto';
        main.style.removeProperty('flexDirection');
        main.style.removeProperty('gridTemplateRows');
        main.style.removeProperty('gridTemplateAreas');
        return { tipo: 'grid-flex', linhas: maxLinha + 1, colunas: maxColuna + 1, maxLinha, maxColuna };
    }

/**
     * Valida a propriedade pos para grid de uma coluna: cada linha da grid recebe todas as divs daquela linha.
     * Aplica grid-template-columns: 1fr e grid-auto-rows: auto.
     * @returns {Object} { tipo: 'grid-1col', linhas, maxLinha }
     */
    _validarPos() {
        if (!this.form || !this.form.querySelector('#mainConteudo')) {
            throw new Error('Formulário não está definido ou não possui uma seção <main> para inserir os campos.');
        }
        const main = this.form.querySelector('#mainConteudo');
        const pos = this.pos;
        const linhas = pos.map(p => p.linha);
        const linhasUnicas = [...new Set(linhas)].sort((a, b) => a - b);
        const maxLinha = Math.max(...linhas);
        // Checa se linhas são sequenciais
        const linhasEsperadas = Array.from({length: maxLinha + 1}, (_, i) => i);
        const linhasOk = linhasUnicas.length === linhasEsperadas.length && linhasUnicas.every((v, i) => v === linhasEsperadas[i]);
        if (!linhasOk) {
            console.error('Erro de layout: As linhas não são sequenciais (0,1,2,...n) para grid de uma coluna. Linhas encontradas:', linhasUnicas);
            return { tipo: 'erro', motivo: 'linhas não sequenciais', linhasEncontradas: linhasUnicas };
        }
        // Aplica grid de uma coluna
        main.style.display = 'grid';
        main.style.gridTemplateColumns = '1fr';
        main.style.gridAutoRows = 'auto';
        main.style.removeProperty('flexDirection');
        main.style.removeProperty('gridTemplateRows');
        main.style.removeProperty('gridTemplateAreas');
        return { tipo: 'grid-1col', linhas: maxLinha + 1, maxLinha };
    }



    criarDivsCampos() {
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
                    campo.type = 'text';
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
                    break;
                default:
                    campo = document.createElement('input');
                    campo.type = 'text';
            }
            campo.id = nomeCampo;
            campo.name = nomeCampo;
            if (format) campo.setAttribute('data-format', format);
            div.appendChild(campo);
            // Adiciona a div ao formulário (exemplo: formConteudo)
            if (this.form && this.form.querySelector('mainConteudo')) {
                this.form.querySelector('mainConteudo').appendChild(div);
            }
            this.fields.push(div);
        }
    }

        /**
     * Checagem das posições e definição da propriedade flex position do main
     */




    setForm(form) {
        this.form = form;
    }

    addField(field) {
        this.fields.push(field);
    }

    addButton(button) {
        this.buttons.push(button);
    }

    render() {
        // Logic to render the form with fields and buttons
        console.log("Rendering form with fields:", this.fields, "and buttons:", this.buttons);
    }
}

/**
 * Classe para formulários modais, herda de Forms_Base
 */
export class FormModal extends Forms_Base {
    constructor(titulo, tipo, label, nomeCampo, format, pos, alinhamento) {
        super(titulo, tipo, label, nomeCampo, format, pos, alinhamento);
        // Aqui podem ser adicionadas propriedades ou métodos específicos para modal
    }
}

/**
 * Classe para formulários comuns, herda de Forms_Base
 */
export class FormComum extends Forms_Base {
    /**
     * Cria um formulário comum.
     * @param {string} titulo - Título do formulário (ex: "Cadastro de Clientes")
     * @param {Array<string>} tipo - Lista de tipos de campo ('input', 'combo', 'radio', 'checkbox', 'textarea')
     * @param {Array<string>} label - Lista de rótulos dos campos
     * @param {Array<string>} nomeCampo - Lista de nomes/ids dos campos
     * @param {Array<string|null>} format - Lista de formatos ('moeda', 'pct', 'data', null)
     * @param {Array<Object>} pos - Lista de posições dos campos ({linha, coluna})
     * @param {Array<string>} alinhamento - Lista de alinhamentos ('H' para horizontal, 'V' para vertical)
     * @param {Array<string>} largCampos - Lista de larguras dos campos em percentual (ex: 50 para 50%). O símbolo '%' será acrescentado automaticamente pelo código.
     */
    constructor(titulo, tipo, label, nomeCampo, format, pos, alinhamento, largCampos) {
        super(titulo, tipo, label, nomeCampo, format, pos, alinhamento, largCampos);
        // Aqui podem ser adicionadas propriedades ou métodos específicos para comum
    }
}