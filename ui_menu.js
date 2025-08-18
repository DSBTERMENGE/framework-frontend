// (Constantes removidas pois não estão mais em uso)

// Importando as classes necessárias
import { CriarMenuAplicacao } from './General_Classes/ConstrutorMenuAplicacao.js';

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
    // NOTA: Esta função está mantida por compatibilidade
    // Em novos projetos, use ConstrutorDeInterfaceAplicacao.criarTitulosIntegrado()
    console.log('⚠️ Função criarTitulos() do ui_menu.js está obsoleta. Use ConstrutorDeInterfaceAplicacao.');
}

//Criando o menu principal e sub menus
export function constroiMenus() {
    // ====================== Menu principal =======================
    const menu_princ = new CriarMenuAplicacao(
        ["Extração de dados", "Reclassificar", "Cadastro", "Relatórios-1", "Relatórios-2", "Sair"],
        "horizontal",
        "id_menu_principal",
        "cmd"
    );
    menu_princ.renderizar();

    // =============== Criando o sub menu Cadastro ===============
    const menu_cadastro = new CriarMenuAplicacao(
        ["Classificação", "Dicas de classificação", "Retornar"],
        "horizontal",
        "id_menu_cadastro",
        "cmd"
    );
    menu_cadastro.renderizar();
    document.getElementById("id_menu_cadastro").style.display = "none";

    // =============== Criando o sub menu Relatórios-1 ===============
    const menu_rel_1 = new CriarMenuAplicacao(
        ["Despesas", "Despesas recorrentes", "RDM", "RDMCC", "Retornar"],
        "horizontal",
        "id_menu_rel_1",
        "cmd"
    );
    menu_rel_1.renderizar();
    document.getElementById("id_menu_rel_1").style.display = "none";

    // =============== Criando o sub menu Relatórios-2 ===============
    const menu_rel_2 = new CriarMenuAplicacao(
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


