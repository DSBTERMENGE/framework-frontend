// ==================== Resposta a eventos ====================
//document.getElementById('id_menu_principal').addEventListener('botao-clicado', handlerMenuPrincipal);

// Função de tratamento
export function handlerMenuPrincipal(e) {
    console.log('Menu principal:', e.detail.label, e.detail.indice, e.detail.idDiv, e.detail.extra);

    switch (e.detail.label) {
        case "Sair":
            console.log('Ação: Sair');
            break;
        case "Relatórios-2":
            document.getElementById('id_menu_principal').style.display = 'none';
            document.getElementById('id_menu_rel_2').style.display = 'flex';
            break;
        case "Relatórios-1":
            document.getElementById('id_menu_principal').style.display = 'none';
            document.getElementById('id_menu_rel_1').style.display = 'flex';
            break;
        case "Cadastro":
            document.getElementById('id_menu_principal').style.display = "none";
            document.getElementById('id_menu_cadastro').style.display = 'flex';
            break
        case "Reclassificar":
            console.log('Ação: Reclassificar');
            break;
        case "Extração de dados":
            console.log('Ação: Extração de dados');
            break;
        default:
            console.log('Ação não reconhecida:', e.detail.label);
            break;
    }
    
}