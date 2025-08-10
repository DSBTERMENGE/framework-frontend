# Resumo da Organização dos Projetos

## 1. Organização dos Projetos
- Todos os projetos estão centralizados na pasta `MyProjects`.
- Existe uma pasta `General_Classes` para armazenar classes reutilizáveis em JavaScript, acessadas por vários projetos.

## 2. Compartilhamento e Atualização das Classes
- Os projetos acessam `General_Classes` por caminho relativo/absoluto.
- Alterações feitas em `General_Classes` ficam disponíveis para todos os projetos automaticamente.
- O uso de npm não é obrigatório para manter os projetos atualizados localmente, mas pode ser útil para deploy/versionamento.

## 3. Deploy/Servidor
- No deploy para a nuvem, é importante garantir que `General_Classes` também seja enviada ou esteja acessível no servidor.
- Alternativamente, pode-se copiar `General_Classes` para dentro do projeto antes do deploy, ajustando os caminhos de importação.

## 4. Testes de Componentes
- Para testar/prototipar as classes de `General_Classes`, recomenda-se criar uma pasta `FrontEnd_Test` com:
  - `index.html`: interface de teste
  - `test.js`: importa e testa os componentes
  - `style.css`: estilos opcionais

## 5. Limitação do VS Code
- Ao trocar de workspace/pasta, a sessão do chat é reiniciada e o histórico se perde.
- Recomenda-se salvar/resumir informações importantes em um arquivo de notas para continuar o trabalho em outro workspace.

## 6. Sistema de Formulários Implementado
### **Classes Principais:**
- **FormularioBase**: Classe base para todos os formulários
- **FormComum**: Formulários posicionáveis no canvas com botões no rodapé global
- **FormModal**: Formulários modais com backdrop, drag e botões próprios  
- **CriarTabelas**: Tabelas avançadas com filtros e cálculos

### **FormModal - Características Específicas:**
- ✅ **Herda de FormComum** (reutiliza toda lógica de campos)
- ✅ **Container modal**: `divFormModal` com backdrop escurecido
- ✅ **Draggable**: Pode ser arrastado pelo header
- ✅ **Z-index alto**: Sempre no topo (z-index: 10000)
- ✅ **Botões próprios**: "Encerrar" + "Submit" no footer local
- ✅ **Eventos específicos**: `form-modal-acao` (não usa rodapé global)
- ✅ **Sem selects**: Focado em campos simples
- ✅ **Tamanho adaptativo**: Baseado nos campos e propriedade `pos`

### **Módulos UI Implementados:**
- **ui_formularios.js**: Gerencia FormComum
- **ui_tabelas.js**: Gerencia CriarTabelas  
- **ui_FormModal.js**: Gerencia FormModal (NOVO)

### **Arquivos Criados:**
- `General_Classes/ConstrutorDeFormModal.js`
- `ui_FormModal.js`

---

Se precisar de scripts para automatizar cópia/atualização das classes ou outras sugestões, é só pedir!
