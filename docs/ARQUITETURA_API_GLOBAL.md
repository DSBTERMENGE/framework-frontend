# 🌐 ARQUITETURA DE API GLOBAL POR APLICAÇÃO

## 📋 Visão Geral

Esta documentação descreve a arquitetura de instâncias globais da API frontend, onde cada aplicação cria uma única instância da `api_fe` anexada ao objeto `window`, permitindo acesso global em todos os formulários da aplicação.

## 🏗️ Estrutura da Arquitetura

### 1. Classe Base Reutilizável
```javascript
// framework_dsb/frontend/General_Classes/frontend_api.js
export class api_fe {
    // Classe única e reutilizável para todas as aplicações
}
```

### 2. Instância Global por Aplicação
```javascript
// No main.js de cada aplicação
window.api_[NOME_APP] = new api_fe();
```

### 3. Configuração Específica por App
```javascript
// Configurações únicas para cada aplicação
window.api_finctl.aplicacao = "FinCtl";
window.api_finctl.base_url = "http://localhost:5000";

window.api_invctl.aplicacao = "InvCtl"; 
window.api_invctl.base_url = "http://localhost:5001";
```

## 🎯 Implementação Prática

### FinCtl (Controle Financeiro)
```javascript
// FinCtl/main.js
import {api_fe} from '../framework_dsb/frontend/General_Classes/frontend_api.js';

window.api_finctl = new api_fe();
window.api_finctl.aplicacao = "FinCtl";
window.api_finctl.versao = "1.0.0";
window.api_finctl.base_url = "http://localhost:5000";
window.api_finctl.debug = true;
```

### Uso em Formulários do FinCtl
```javascript
// FinCtl/form_grupos.js
async function criarGrupo(dados) {
    // Configura operação específica
    window.api_finctl.tabela = 'tb_grupos_finctl';
    window.api_finctl.dados = {
        grupo: dados.grupo,
        descricao: dados.descricao
    };
    
    // Executa operação
    const resultado = await window.api_finctl.inserir();
    return resultado;
}
```

### InvCtl (Controle de Inventário) - Exemplo
```javascript
// InvCtl/main.js
window.api_invctl = new api_fe();
window.api_invctl.aplicacao = "InvCtl";
window.api_invctl.base_url = "http://localhost:5001";

// InvCtl/form_produtos.js
async function criarProduto(dados) {
    window.api_invctl.tabela = 'tb_produtos';
    window.api_invctl.dados = dados;
    return await window.api_invctl.inserir();
}
```

## ✅ Vantagens desta Arquitetura

### 1. **Uma Instância por Aplicação**
- `window.api_finctl` para FinCtl
- `window.api_invctl` para InvCtl  
- `window.api_cliente` para ClienteCtl
- Etc...

### 2. **Configuração Global Única**
- Propriedades definidas uma vez no `main.js`
- Todos os formulários herdam automaticamente
- Mudanças centralizadas e propagadas

### 3. **Zero Conflitos Entre Aplicações**
- Cada aplicação tem sua instância isolada
- Configurações completamente independentes
- Possibilidade de backends diferentes

### 4. **Sintaxe Limpa e Semântica**
```javascript
// Muito mais legível que instanciar em cada formulário
api_finctl.tabela = "grupos";
api_finctl.dados = {...};
await api_finctl.inserir();
```

### 5. **Reutilização Total do Framework**
- Mesma classe `api_fe` para todas as aplicações
- Zero duplicação de código
- Manutenção centralizada no framework

## 🔄 Fluxo de Operações

### Inserção
```javascript
// 1. Configurar tabela e dados
window.api_finctl.tabela = 'tb_grupos_finctl';
window.api_finctl.dados = {grupo: 'Alimentação', descricao: 'Despesas alimentares'};

// 2. Executar
const resultado = await window.api_finctl.inserir();
```

### Consulta
```javascript
// 1. Configurar view
window.api_finctl.tabela = 'vw_grupos_finctl';

// 2. Executar  
const grupos = await window.api_finctl.obter_view();
```

### Atualização
```javascript
// 1. Configurar tabela, dados e condição
window.api_finctl.tabela = 'tb_grupos_finctl';
window.api_finctl.dados = {descricao: 'Nova descrição'};
window.api_finctl.condicao = "grupo = 'Alimentação'";

// 2. Executar
const resultado = await window.api_finctl.atualizar();
```

### Exclusão
```javascript
// 1. Configurar tabela e condição
window.api_finctl.tabela = 'tb_grupos_finctl';
window.api_finctl.condicao = "grupo = 'Alimentação'";

// 2. Executar
const resultado = await window.api_finctl.excluir();
```

## 🔧 Implementação Step-by-Step

### Passo 1: Criar a Instância Global
```javascript
// No main.js da aplicação
import {api_fe} from '../framework_dsb/frontend/General_Classes/frontend_api.js';

window.api_[NOME_APP] = new api_fe();
```

### Passo 2: Configurar Propriedades Globais
```javascript
window.api_[NOME_APP].aplicacao = "[NOME_APP]";
window.api_[NOME_APP].versao = "1.0.0";
window.api_[NOME_APP].base_url = "http://localhost:[PORTA]";
window.api_[NOME_APP].debug = true;
```

### Passo 3: Usar nos Formulários
```javascript
// Em qualquer formulário da aplicação
async function operacaoCRUD() {
    window.api_[NOME_APP].tabela = 'tabela_exemplo';
    window.api_[NOME_APP].dados = {...};
    
    const resultado = await window.api_[NOME_APP].inserir();
    return resultado;
}
```

## 🎯 Casos de Uso

### Aplicação Financeira (FinCtl)
- Grupos de despesas
- Subgrupos de classificação  
- Lançamentos financeiros
- Relatórios

### Aplicação de Inventário (InvCtl)
- Produtos
- Categorias
- Fornecedores
- Movimentações de estoque

### Aplicação de Clientes (ClienteCtl)
- Cadastro de clientes
- Endereços
- Contatos
- Histórico

## 🛡️ Isolamento e Segurança

Cada aplicação opera de forma completamente isolada:

- **Namespaces separados**: `window.api_finctl` vs `window.api_invctl`
- **Configurações independentes**: URLs, portas, bancos diferentes
- **Contextos isolados**: Operações não interferem entre si
- **Debugging separado**: Logs identificados por aplicação

## 📈 Escalabilidade

Esta arquitetura escala facilmente:

1. **Novas aplicações**: Apenas crie nova instância global
2. **Novas funcionalidades**: Extend a classe `api_fe` base
3. **Múltiplos backends**: Configure URLs diferentes por app
4. **Ambientes diferentes**: Dev, test, prod configurados por app

## 🔍 Debugging e Monitoramento

```javascript
// Logs automáticos por aplicação
console.log('✅ API FinCtl inicializada:', window.api_finctl);
console.log('📊 Operação realizada:', resultado);

// Debug específico por aplicação
window.api_finctl.debug = true;  // Apenas FinCtl
window.api_invctl.debug = false; // InvCtl sem debug
```

## 🎉 Conclusão

Esta arquitetura fornece:
- ✅ **Simplicidade**: Uma instância por app
- ✅ **Reutilização**: Mesma classe para tudo  
- ✅ **Isolamento**: Zero conflitos entre apps
- ✅ **Manutenibilidade**: Configuração centralizada
- ✅ **Escalabilidade**: Fácil adição de novas apps
- ✅ **Legibilidade**: Sintaxe limpa e semântica

A estratégia `window.api_[NOME_APP] = new api_fe()` é a solução ideal para frameworks multi-aplicação!
