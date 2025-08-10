// ==================== Resposta a eventos ====================

//



// Funções de tratamento
export function handlerMenuCadastro(e) {
    console.log('Menu cadastro:', e.detail.label, e.detail.indice, e.detail.idDiv, e.detail.extra);

    switch (e.detail.label) {
        case "Retornar":
            document.getElementById('id_menu_principal').style.display = 'flex';
            document.getElementById('id_menu_cadastro').style.display = 'none';
            break;
        case "Dicas de classificação recorrentes":
            console.log('Ação: Dicas de classificação');
            break;
        case "Classificação":
            console.log('Ação: Classificação');
            break;
        default:
            console.log('Ação não reconhecida:', e.detail.label);
            break;
    }
}


