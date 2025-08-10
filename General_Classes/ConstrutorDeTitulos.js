// Classe para criar o título da aplicação na tela
// Exporte se for usar módulos
// export { CriarTitulos };

export class CriarTitulos {
    /**
     * @param {string} tituloDoProjeto - Nome do projeto
     * @param {string} descProjeto - Descrição do projeto
     * @param {string} end_icone - Caminho do ícone
     */
    constructor(tituloDoProjeto, descProjeto, end_icone) {
        this.tituloDoProjeto = tituloDoProjeto;
        this.descProjeto = descProjeto;
        this.end_icone = end_icone;
    }

    renderizar() {
        // Assume que divTitulo já existe
        const divTitulo = document.getElementById('divTitulo');
        if (!divTitulo) {
            console.error('divTitulo não existe.');
            return;
        }
        // divIcone
        const divIcone = divTitulo.querySelector('#divIcone');
        if (divIcone) {
            if (this.end_icone) {
                divIcone.innerHTML = `<img src="${this.end_icone}" alt="Ícone" style="width:100%;height:100%;object-fit:contain;">`;
            } else {
                divIcone.innerHTML = `<span style="font-size:2rem;font-weight:bold;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">X</span>`;
            }
        }
        // divNomeApp
        const divNomeApp = divTitulo.querySelector('#divNomeApp');
        if (divNomeApp) {
            divNomeApp.textContent = this.tituloDoProjeto;
        }
        // divDescricao
        const divDescricao = divTitulo.querySelector('#divDescricao');
        if (divDescricao) {
            divDescricao.textContent = this.descProjeto;
        }
    }
}

