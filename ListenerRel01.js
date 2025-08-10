import { exibirTabelaExemplo1 } from './ui_tabelas.js';
import { construirFormulario } from './ui_formularios.js';
// ==================== Resposta a eventos ====================
//document.getElementById('id_menu_rel_1').addEventListener('botao-clicado', handlerMenuRel1);

// Função de tratamento
export function handlerMenuRel1(e) {
    console.log('Menu relatórios 1:', e.detail.label, e.detail.indice, e.detail.idDiv, e.detail.extra);

    switch (e.detail.label) {
        case "Retornar":
            document.getElementById('id_menu_principal').style.display = 'flex';
            document.getElementById('id_menu_rel_1').style.display = 'none';
            break;
        case "RDMCC":
            console.log('Ação: RDMCC');
            construirFormulario();
            break;
        case "RDM":
            console.log('Ação: RDM');
            exibirTabelaExemplo1();
            break;
        case "Despesas recorrentes":
            console.log('Ação: Despesas recorrentes');
            break;
        case "Despesas":
            console.log('Ação: Despesas');
            break;
        default:
            console.log('Ação não reconhecida:', e.detail.label);
            break;
    }
}