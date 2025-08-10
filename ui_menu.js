// (Constantes removidas pois não estão mais em uso)

// Importando as classes necessárias
import { BarraDeBotoes } from './General_Classes/ConstrutorDeBarrasDeBotoes.js';
import { CriarTitulos } from './General_Classes/ConstrutorDeTitulos.js';

// Importando os handlers de eventos: (Os handlers de eventos precisam estar
// no mesmo arquivo que o evento foi registrado, por isto se está importando)
import { handlerMenuPrincipal } from './ListenerMenuPrincipal.js';
import { handlerMenuCadastro } from './ListenerMenuCadastro.js';
import { handlerMenuRel1 } from './ListenerRel01.js';
import { handlerMenuRel2 } from './ListenerRel02.js';


/* ==============================================================
CONSTRUÇÃO DE BLOCOS DE ELEMENTOS PARA O SISTEMA
=================================================================
*/


// (Constantes de margem removidas pois não estão mais em uso)

//Criando o título do projeto
export function criarTitulos(){
    const titulo = new CriarTitulos(
        "FinCtlByDSB", // tituloDoProjeto
        "Controle de despesas pessoais", // descProjeto
        "Assets/icon_app.svg" // end_icone
    );
    titulo.renderizar();

    // Margens agora são controladas via CSS, não é necessário aplicar via JS.
}

//Criando o menu principal e sub menus
export function constroiMenus() {
    // ====================== Menu principal =======================
    const menu_princ = new BarraDeBotoes(
        ["Extração de dados", "Reclassificar", "Cadastro", "Relatórios-1", "Relatórios-2", "Sair"],
        "horizontal",
        "id_menu_principal",
        "cmd"
    );
    menu_princ.renderizar();

    // =============== Criando o sub menu Cadastro ===============
    const menu_cadastro = new BarraDeBotoes(
        ["Classificação", "Dicas de classificação", "Retornar"],
        "horizontal",
        "id_menu_cadastro",
        "cmd"
    );
    menu_cadastro.renderizar();
    document.getElementById("id_menu_cadastro").style.display = "none";

    // =============== Criando o sub menu Relatórios-1 ===============
    const menu_rel_1 = new BarraDeBotoes(
        ["Despesas", "Despesas recorrentes", "RDM", "RDMCC", "Retornar"],
        "horizontal",
        "id_menu_rel_1",
        "cmd"
    );
    menu_rel_1.renderizar();
    document.getElementById("id_menu_rel_1").style.display = "none";

    // =============== Criando o sub menu Relatórios-2 ===============
    const menu_rel_2 = new BarraDeBotoes(
        ["RDMCC ANO", "RDMCC 12M", "Retornar"],
        "horizontal",
        "id_menu_rel_2",
        "cmd"
    );
    menu_rel_2.renderizar();
    document.getElementById("id_menu_rel_2").style.display = "none";

}


// Registrando os listeners de botões
export function registrarListeners() {
    const divs = [
        { id: 'id_menu_principal', handler: handlerMenuPrincipal },
        { id: 'id_menu_cadastro', handler: handlerMenuCadastro },
        { id: 'id_menu_rel_1', handler: handlerMenuRel1 },
        { id: 'id_menu_rel_2', handler: handlerMenuRel2 }
    ];
    divs.forEach(({ id, handler }) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('botao-clicado', handler);
        } else {
            console.warn(`Div de menu '${id}' não existe no momento do registro do listener.`);
        }
    });
}


