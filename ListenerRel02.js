// Função de tratamento
//document.getElementById('id_menu_rel_2').addEventListener('botao-clicado', handlerMenuRel2);

// Funções de tratamento
export function handlerMenuRel2(e) {
    // Adicione aqui o tratamento do evento 'botao-clicado'

    // Ações específicas para o menu de relatórios 2
    console.log('Menu relatórios 2:', e.detail.label, e.detail.indice, e.detail.idDiv, e.detail.extra);

    switch (e.detail.label) {
        case "Retornar":
            document.getElementById('id_menu_principal').style.display = 'flex';
            document.getElementById('id_menu_rel_2').style.display = 'none';
            break;
        case "RDMCC 12M":
            console.log('Ação: RDMCC 12M');
            break;
        case "RDMCC ANO":
            console.log('Ação: RDMCC ANO');
            break;
        default:
            console.log('Ação não reconhecida:', e.detail.label);
            break;
    }
}