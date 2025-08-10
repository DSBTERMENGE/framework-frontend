// Funções utilitárias para layout de tela

/**
 * Classe para posicionar uma div horizontalmente ao lado de outra.
 *
 * Uso:
 *   const layout = new DivFilaHor("idA", "idB", margem, alinhamento);
 *   layout.posicionar();
 */
export class DivFilaHor {

    /**
     * Posiciona uma div horizontalmente ao lado de outra.
     * @param {string} idA - id da div de referência (à esquerda)
     * @param {string} idB - id da div a ser posicionada (à direita)
     * @param {number} margem - espaço em pixels entre as divs (opcional)
     * @param {string} alinhamento - 'superior', 'meio' ou 'inferior' (opcional, padrão: 'superior')
     */
    static posicionar(idA, idB, margem = 0, alinhamento = 'superior') {
        const divA = document.getElementById(idA);
        const divB = document.getElementById(idB);
        if (divA && divB) {
            const rectA = divA.getBoundingClientRect();
            const rectB = divB.getBoundingClientRect();
            let top;
            if (alinhamento === 'meio') {
                top = rectA.top + window.scrollY + (rectA.height - rectB.height) / 2;
            } else if (alinhamento === 'inferior') {
                top = rectA.bottom + window.scrollY - rectB.height;
            } else {
                top = rectA.top + window.scrollY;
            }
            // Convertendo top para vh
            const topVH = (top / window.innerHeight) * 100;
            divB.style.position = "absolute";
            divB.style.top = `${topVH}vh`;
            // Calculando left
            let left;
            if (typeof margem === 'string' && (margem.endsWith('vw') || margem.endsWith('vh'))) {
                // Se margem já está em unidade responsiva, calcula left em vw
                left = ((rectA.right + window.scrollX) / window.innerWidth) * 100;
                if (margem.endsWith('vw')) {
                    left += parseFloat(margem);
                } else if (margem.endsWith('vh')) {
                    // Convertendo vh para vw proporcionalmente
                    left += (window.innerHeight * parseFloat(margem) / 100) / window.innerWidth * 100;
                }
                divB.style.left = `${left}vw`;
            } else {
                // margem em px ou número
                left = ((rectA.right + window.scrollX + (typeof margem === 'number' ? margem : parseFloat(margem) || 0)) / window.innerWidth) * 100;
                divB.style.left = `${left}vw`;
            }
        }
    }
}

/**
 * Classe utilitária para ajustar largura, altura e fonte de um elemento (e seus filhos) por percentual.
 * pctWidth, pctHeight, pctFonte: valores em porcentagem (ex: 10 para +10%, -20 para -20%)
 */
export class AjustePercentualDiv {
 
    /**
     * Aplica ajuste percentual de largura, altura e fonte em um elemento, usando unidade responsiva.
     * @param {HTMLElement|string} elemento - Elemento alvo ou id do elemento
     * @param {number} pctWidth - Percentual de ajuste da largura, use valores positivos para aumentar e negativos para diminuir
     * @param {number} pctHeight - Percentual de ajuste da altura,  use valores positivos para aumentar e negativos para diminuir
     * @param {number} pctFonte - Percentual de ajuste do tamanho da fonte, use valores positivos para aumentar e negativos para diminuir
     */
    static aplicar(elemento, pctWidth = 0, pctHeight = 0, pctFonte = 0) {
        const el = typeof elemento === 'string' ? document.getElementById(elemento) : elemento;
        if (!el) return;
        // Ajusta largura em vw
        if (pctWidth !== 0) {
            let larguraAtualVw = parseFloat(window.getComputedStyle(el).width) / window.innerWidth * 100;
            if (isNaN(larguraAtualVw) || larguraAtualVw === 0) larguraAtualVw = 1;
            const novaLarguraVw = larguraAtualVw * (1 + pctWidth / 100);
            el.style.width = novaLarguraVw + 'vw';
        }
        // Ajusta altura em vh
        if (pctHeight !== 0) {
            let alturaAtualVh = parseFloat(window.getComputedStyle(el).height) / window.innerHeight * 100;
            if (isNaN(alturaAtualVh) || alturaAtualVh === 0) alturaAtualVh = 1;
            const novaAlturaVh = alturaAtualVh * (1 + pctHeight / 100);
            el.style.height = novaAlturaVh + 'vh';
        }
        // Ajusta fonte do elemento e dos filhos em vw
        if (pctFonte !== 0) {
            AjustePercentualDiv._ajustarFonteRecursivo(el, pctFonte);
        }
    }

    static _ajustarFonteRecursivo(elemento, pctFonte) {
        const style = window.getComputedStyle(elemento);
        const fontSizeAtualVw = parseFloat(style.fontSize) / window.innerWidth * 100;
        const novaFonteVw = fontSizeAtualVw * (1 + pctFonte / 100);
        elemento.style.fontSize = novaFonteVw + 'vw';
        Array.from(elemento.children).forEach(filho => {
            AjustePercentualDiv._ajustarFonteRecursivo(filho, pctFonte);
        });
    }
}

/*
Classse para ajustar bloco de controle à direita da tela
*/

export class AjusteBlocoMgDireita {

    /**
     * Alinha a div filha com a margem direita do pai, usando afastamento em qualquer unidade CSS.
     * @param {string} idDivFilha - id da div filha (o bloco a ser ajustado)
     * @param {string} margemDireita - margem da direita (ex: '2vw', '10px', '5%')
     *
     * Observação: O pai deve ter position diferente de static (relative, absolute, ou fixed).
     */

    static alinharDireitaDivFilha(idDivFilha, margemDireita) {
        const divFilha = document.getElementById(idDivFilha);
        if (!divFilha || !divFilha.parentElement) return;
        const divPai = divFilha.parentElement;
        
        // Garante que o pai seja um contexto de posicionamento (qualquer position exceto static)
        const positionPai = window.getComputedStyle(divPai).position;
        if (positionPai === 'static') {
            divPai.style.position = 'relative';
        }
        
        // Garante que o pai tenha largura explícita se não tiver
        const larguraPai = window.getComputedStyle(divPai).width;
        if (larguraPai === 'auto' || larguraPai === '0px') {
            divPai.style.width = '100%';
        }
        
        // Limpa propriedades de posicionamento conflitantes
        divFilha.style.position = 'absolute';
        divFilha.style.left = '';
        divFilha.style.transform = '';
        divFilha.style.marginLeft = '';
        divFilha.style.marginRight = '';
        
        // Define o alinhamento à direita
        divFilha.style.right = margemDireita;
    }
}
