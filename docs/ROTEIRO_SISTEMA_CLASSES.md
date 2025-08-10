# Roteiro de Funcionamento das Classes JavaScript

## **Filosofia do Projeto**

### **Objetivo Central**
Prover um sistema de classes JavaScript para gerar formulários variados de dois tipos principais:
1. **Formulários com Tabelas**: Apresentação de dados em formato tabular com filtros, cálculos e funcionalidades avançadas
2. **Formulários com Labels e Campos**: Interfaces de entrada de dados com campos customizáveis (input, select, radio, checkbox, textarea)

### **Princípio de Reutilização de Código**
O desenvolvedor, através das **propriedades das classes**, poderá atribuir valores às mesmas para criação de diferentes formulários, mantendo sempre **o mesmo código base**. Esta abordagem garante:

- **Código Único**: Uma única implementação serve para múltiplos cenários
- **Configuração por Propriedades**: Personalização através de parâmetros, não de código
- **Manutenibilidade**: Alterações centralizadas beneficiam todos os formulários
- **Consistência**: Padrões visuais e funcionais uniformes
- **Produtividade**: Criação rápida de interfaces complexas

### **Exemplo Prático da Filosofia**
```javascript
// MESMO CÓDIGO - Formulário Simples
const formSimples = new FormComum("Cadastro", ["input"], ["Nome"], ["nome"], ...);

// MESMO CÓDIGO - Formulário Complexo  
const formComplexo = new FormComum("Cadastro Completo", 
    ["input", "combo", "radio"], ["Nome", "Estado", "Sexo"], ...);

// MESMO CÓDIGO - Tabela com Filtros
const tabela = new CriarTabelas("Relatório", descricao, cabecalho, 
    larguras, alinhamento, formato, posicao, {selects: {...}, botoes: [...]});
```

---

## **Arquitetura de Módulos e Relacionamentos**

### **Classe Base e Sistema de Herança**

**Classe Base**: `FormularioBase`
- **Módulo**: `ConstrutorDeFormularioBase.js`
- **Função**: Concentra funcionalidades comuns de posicionamento, configuração de containers e gestão de header/footer

**Classes Herdeiras**:
1. **`FormComum`** - Módulo: `ConstrutorDeForms.js`
   - Formulários posicionáveis no canvas com campos customizáveis
2. **`FormModal`** - Módulo: `ConstrutorDeForms.js`
   - Formulários modais centralizados
3. **`CriarTabelas`** - Módulo: `ConstrutorDeTabelas.js`
   - Tabelas avançadas com cálculos e filtros integrados

### **Módulos de Componentes Especializados**

**`ConstrutorDeSelects.js`**:
- **Classe**: `CriarSelects`
- **Finalidade**: Criação de selects configuráveis com arranjo flexível
- **Integração**: Composta automaticamente em `CriarTabelas`

**`ConstrutorDeBotoes.js`**:
- **Classe**: `CriarBotoes`
- **Finalidade**: Grupos de botões configuráveis (Encerrar, Navegação, CRUD)
- **Integração**: Composta automaticamente em `CriarTabelas`

### **Módulos de Interface (UI)**

**`ui_tabelas.js`**:
- **Finalidade**: Gerenciamento de eventos e população de dados para tabelas
- **Funções**: Handlers de cascata, eventos de botões, população automática

**`ui_formularios.js`** *(não implementado ainda)*:
- **Finalidade**: Gerenciamento de eventos e população de dados para formulários
- **Propósito**: Mesmo conceito que `ui_tabelas.js`, mas focado em FormComum/FormModal

### **Relacionamentos Entre Classes**

```
FormularioBase (base)
    ├── FormComum ──────────────── ui_formularios.js (planejado)
    ├── FormModal ──────────────── ui_formularios.js (planejado)
    └── CriarTabelas ──────────── ui_tabelas.js
            ├── CriarSelects (composição)
            └── CriarBotoes (composição)
```

### **Técnicas de Integração e População**

#### **1. Composição Automática (CriarTabelas)**
```javascript
// CriarTabelas integra automaticamente outras classes
constructor(titulo, descricao, cabecalho, ..., opcoes = {}) {
    // Cria instância de CriarSelects se configurado
    if (opcoes.selects) {
        this.objSelect = new CriarSelects(labels, campos, larguras, arranjo);
    }
    
    // Cria instância de CriarBotoes se configurado
    if (opcoes.grupoBotoes) {
        this.objBotoes = new CriarBotoes(opcoes.grupoBotoes);
    }
}
```

#### **2. Técnicas de População Cross-Module**

**População de Selects a partir de CriarTabelas**:
```javascript
// Em CriarTabelas - popula select de outro módulo
_popularPrimeiraSelect(dados) {
    const elemento = this.objSelect.obterElementoSelect(primeiroCampo);
    const valoresUnicos = [...new Set(dados.map(item => item[primeiroCampo]))];
    this.objSelect.popularSelect(primeiroCampo, dadosSelect);
}
```

**Técnica de Acesso a DIVs de Outras Classes**:
- **Map Cache**: `CriarSelects` mantém `Map` dos elementos DOM
- **Métodos de Acesso**: `obterElementoSelect()` permite acesso externo
- **Eventos Customizados**: Sistema de comunicação entre módulos

#### **3. Sistema de Eventos Cross-Module**

**ui_tabelas.js → CriarSelects**:
```javascript
// Registra listener na div de controles
const divControles = document.getElementById('divControlesTabela');
divControles.addEventListener('select-alterada', handlerSelectsCascata);

// Handler processa evento de qualquer select do módulo CriarSelects
function handlerSelectsCascata(event) {
    const { campo, valor } = event.detail;
    // Acessa CriarTabelas através de referência global
    window.objFormTabela.filtrarDados(campo, valor);
}
```

#### **4. Técnicas de População Entre Módulos**

**Auto-População (CriarTabelas → CriarSelects)**:
```javascript
// CriarTabelas detecta dados e popula select automaticamente
setDados(dados) {
    this.dados = dados;
    if (this.objSelect && dados.length > 0) {
        this._popularPrimeiraSelect(dados); // Cross-module population
    }
}
```

**População Manual (ui_tabelas → CriarSelects)**:
```javascript
// ui_tabelas acessa CriarSelects através da instância CriarTabelas
function popularSegundaSelect(dadosFiltrados) {
    const selectObj = window.objFormTabela.objSelect;
    selectObj.popularSelect('Cidade', dadosFiltrados);
}
```

### **Vantagens da Arquitetura**

1. **Separação de Responsabilidades**: Cada módulo tem função específica
2. **Reutilização**: Componentes podem ser usados independentemente
3. **Comunicação Flexível**: Eventos customizados + referências diretas
4. **Manutenibilidade**: Mudanças isoladas por módulo
5. **Extensibilidade**: Fácil adição de novos componentes

Esta arquitetura permite que uma classe em um módulo (como `CriarTabelas`) gerencie e popule componentes de outros módulos (como `CriarSelects`) de forma transparente, mantendo a coesão funcional e a flexibilidade do sistema.

---

## 1. **ConstrutorDeFormularioBase.js** - Classe Base do Sistema

### **FormularioBase** (Classe Base)
**Finalidade**: Classe base especializada para formulários posicionáveis que concentra funcionalidades comuns.

**Características Principais**:
- **Herança**: Base para FormComum, FormModal e CriarTabelas
- **Posicionamento**: Sistema de coordenadas responsivas (vw/vh) no canvas
- **Tipos de Container**: 'comum', 'modal', 'tabela'
- **Gestão de Header/Footer**: Título, descrição e elementos estruturais

**Funcionalidades**:
- `configurarContainer()`: Define IDs específicos por tipo (divFormCrud, divFormModal, divFormTabela)
- `configurarHeader()`: Gerencia título e descrição com seletores flexíveis
- `configurarFooter()`: Prepara rodapé para uso futuro
- `posicionarNoCanvas()`: Sistema de posicionamento absoluto

---

## 2. **ConstrutorDeForms.js** - Sistema de Formulários Dinâmicos

### **Forms_Base** (Classe Utilitária)
**Finalidade**: Classe estática com métodos utilitários para construção de formulários.

**Métodos Principais**:
- `criarForm()`: Orquestra a construção completa do formulário
- `posicionarDivs()`: Organiza campos por linha/coluna com flexbox
- `validacao()`: Validação robusta de arrays e propriedades

### **FormComum** (Herda de FormularioBase)
**Finalidade**: Formulários posicionáveis no canvas com campos customizáveis.

**Parâmetros do Construtor**:
- `titulo`: Título do formulário
- `tipo[]`: Tipos de campo ('input', 'combo', 'radio', 'checkbox', 'textarea')
- `label[]`: Rótulos dos campos
- `nomeCampo[]`: IDs/nomes dos campos
- `format[]`: Formatos ('texto', 'moeda', 'pct', 'data', null)
- `pos[]`: Posições ({linha, coluna})
- `alinhamento[]`: Orientação ('H'/'V')
- `largCampos[]`: Larguras em rem
- `posicaoCanvas`: Coordenadas {x, y}

**Fluxo de Funcionamento**:
1. Validação completa dos parâmetros
2. Configuração do container (divFormCrud)
3. Criação dinâmica de campos com flexbox
4. Posicionamento por grid linha/coluna
5. Renderização no canvas

### **FormModal** (Herda de FormularioBase)
**Finalidade**: Formulários modais centralizados.

**Diferenças do FormComum**:
- Container: divFormModal
- Posicionamento: Centrado e fixo (não no canvas)
- Z-index: 1000 (sobreposição)

---

## 3. **ConstrutorDeSelects.js** - Sistema de Selects Configuráveis

### **CriarSelects**
**Finalidade**: Construção de selects com arranjo flexível e população automática.

**Parâmetros**:
- `labels[]`: Nomes dos labels (auto-adiciona ":")
- `campos[]`: Nomes dos campos correspondentes
- `largCampos[]`: Larguras (aceita px, %, vw, em, rem)
- `arranjo`: 'linha' (horizontal) ou 'coluna' (vertical)

**Funcionalidades Avançadas**:
- **Validação Robusta**: Tamanhos iguais dos arrays
- **Cache de Elementos**: Map para controle de DOM
- **População Automática**: Método para preencher selects
- **Eventos Customizados**: Sistema de cascata entre selects
- **Formatação Automática**: Labels padronizados

**Métodos Principais**:
- `_validarParametros()`: Validação completa
- `gerarHTML()`: Criação do HTML com classes CSS
- `popularSelect()`: População de dados
- `obterValorSelecionado()`: Recuperação de valores
- `obterElementoSelect()`: Acesso direto ao elemento DOM

---

## 4. **ConstrutorDeBotoes.js** - Sistema de Botões Agrupados

### **CriarBotoes**
**Finalidade**: Construção de grupos de botões configuráveis por array de controle.

**Sistema de Grupos**:
- **Posição 0**: grupoBtn01 (Encerrar)
- **Posição 1**: grupoBtn02 (Navegação)
- **Posição 2**: grupoBtn03 (CRUD)

**Controle por Array**:
- `['S','N','S']`: Ativa Encerrar + CRUD
- `['S','S','S']`: Ativa todos os grupos
- `['N','S','S']`: Navegação + CRUD (sem Encerrar)

**Funcionalidades**:
- **Validação**: Array de exatamente 3 elementos ('S'/'N')
- **Ordem de Renderização**: 3, 2, 1 (esquerda para direita)
- **Cache de Elementos**: Map para controle de botões
- **Classes CSS**: Sistema padronizado de estilização

---

## 5. **ConstrutorDeTabelas.js** - Sistema Avançado de Tabelas

### **CriarTabelas** (Herda de FormularioBase)
**Finalidade**: Tabelas com cálculos estatísticos, filtros integrados e formatação avançada.

**Parâmetros Principais**:
- `titulo/descricao`: Identificação da tabela
- `cabecalho[]`: Títulos das colunas
- `larguraColunas[]`: Larguras em vw
- `alinhamento[]`: Alinhamento ('E', 'C', 'D')
- `formato[]`: Formatos ('T', 'M', '%', 'D')
- `opcoes{}`: Configurações avançadas

**Integrações Automáticas**:
- **CriarSelects**: Filtros em cascata
- **CriarBotoes**: Grupos de ação
- **Sistema de Cálculos**: Estatísticas avançadas

**Funcionalidades Avançadas**:
- **Validação Robusta**: Consistência entre arrays
- **Auto-População**: Primeira select com dados únicos
- **Cálculos Estatísticos**: 13 tipos (Tot, Med, Cnt, Max, Min, etc.)
- **Formatação Dinâmica**: Moeda, percentual, data
- **Edição Inline**: Sistema opcional de edição de dados

**Configurações de Cálculos** (`configResultados`):
- `null`: Sem cálculo
- `'Tot'`: Total
- `'Med'`: Média
- `'Cnt'`: Contagem
- `'Max'/'Min'`: Máximo/Mínimo
- `'DPad'/'Var'`: Desvio padrão/Variância
- `'CV'`: Coeficiente de variação
- `'MDn'`: Mediana
- `'Q1'/'Q3'`: Quartis
- `'Amp'`: Amplitude

**Métodos Principais**:
- `setDados()`: Define dados e popula primeira select automaticamente
- `prepararFiltros()`: Popula filtros sem carregar dados na tabela
- `construirTabela()`: Cria estrutura HTML da tabela
- `calcularResultados()`: Processa cálculos estatísticos
- `formatarValor()`: Aplica formatação por tipo de dados

---

## 6. **ui_tabelas.js** - Interface e Handlers

### **Funcionalidades de Interface**:
**Finalidade**: Gerenciamento de eventos e população de dados das tabelas.

**Principais Funções**:
- `exibirTabelaExemplo1()`: Demonstração completa do sistema
- `registrarListenersSelects()`: Sistema de eventos para cascata
- `handlerSelectsCascata()`: Gerenciamento de filtros em cadeia
- `handlerBotoesCrud()`: Ações dos botões de comando

**Fluxo de Funcionamento**:
1. **Configuração**: Definição de parâmetros da tabela
2. **Integração**: Selects e botões automáticos
3. **Renderização**: Criação da estrutura vazia
4. **Filtros**: População inicial dos selects
5. **Eventos**: Registro de listeners para interação
6. **Cascata**: Sistema automático de filtros dependentes

---

## **Fluxo Geral do Sistema**

### 1. **Inicialização**
```javascript
// Criação automática com integração completa
const tabela = new CriarTabelas(titulo, descricao, cabecalho, larguras, 
    alinhamento, formato, posicao, opcoes);
```

### 2. **Renderização Automática**
- FormularioBase configura container
- CriarSelects gera filtros
- CriarBotoes cria grupos de ação
- CriarTabelas constrói estrutura

### 3. **Interação do Usuário**
- Selects em cascata para filtragem
- Botões para ações CRUD
- Sistema de eventos customizados
- População automática de dados

### 4. **Sistema de Herança**
```
FormularioBase (base)
    ├── FormComum (formulários posicionáveis)
    ├── FormModal (formulários modais)
    └── CriarTabelas (tabelas avançadas)
        ├── CriarSelects (filtros integrados)
        └── CriarBotoes (ações integradas)
```

---

## **Resumo dos Arquivos do Projeto**

### **Arquivos de Classes (Core)**
- `ConstrutorDeFormularioBase.js` - Classe base FormularioBase
- `ConstrutorDeForms.js` - Classes FormComum e FormModal + Forms_Base
- `ConstrutorDeTabelas.js` - Classe CriarTabelas
- `ConstrutorDeSelects.js` - Classe CriarSelects
- `ConstrutorDeBotoes.js` - Classe CriarBotoes

### **Arquivos de Interface (UI)**
- `ui_tabelas.js` - Handlers e eventos para tabelas
- `ui_formularios.js` - Handlers para formulários (planejado)

### **Arquivos de Suporte**
- `index.html` - Estrutura HTML base
- `style-*.css` - Estilos especializados por componente

---

## **Pontos-Chave para Desenvolvimento**

### **Técnicas Implementadas**
1. **Herança**: FormularioBase como base comum
2. **Composição**: Integração automática de componentes
3. **Events**: Sistema de comunicação cross-module
4. **Maps**: Cache de elementos DOM
5. **Validação**: Robusta verificação de parâmetros
6. **Auto-população**: Preenchimento automático de selects

### **Padrões de Código**
- Arrays de propriedades com validação de tamanhos iguais
- Prefixo `_` para métodos privados
- Classes exportadas com `export`
- Imports com destructuring quando necessário
- Configuração por objeto `opcoes` para flexibilidade

Este sistema oferece uma arquitetura modular e extensível para criação de interfaces dinâmicas com validação robusta e integração automática entre componentes, sempre mantendo o princípio fundamental de **reutilização de código através da configuração por propriedades**.

---

## **Como o Sistema Funciona**

### **FormTabela - Fluxo de Renderização e População**

O sistema renderiza o **FormTabela completamente** (Header, Main e Footer), porém **nada está populado** até este ponto inicial. O comportamento subsequente depende da configuração de selects definida pelo desenvolvedor:

#### **📋 Cenário 1: Tabela SEM Selects**
- **Comportamento**: A tabela é **populada imediatamente** após a renderização
- **Uso**: Exibição direta de dados sem necessidade de filtros

#### **🔽 Cenário 2: Tabela com UMA Select**
1. **Renderização**: A select é **populada imediatamente** com a opção padrão "Selecione..."
2. **Estado Inicial**: Select permanece **estática** aguardando escolha do usuário
3. **Interação**: Após seleção pelo usuário:
   - **Evento customizado** é disparado automaticamente
   - **Dados filtrados** são exibidos na tabela
4. **Funcionamento Contínuo**: A cada nova seleção, a tabela é **repopulada automaticamente**

#### **🔽🔽 Cenário 3: Tabela com MÚLTIPLAS Selects (Cascata)**
1. **População Inicial**: Apenas a **primeira select** é populada automaticamente
2. **Cascata Sequencial**:
   - **Segunda select**: Populada após seleção na primeira
   - **Terceira select**: Populada após seleção na segunda
   - **Processo continua** até a última select
3. **População da Tabela**: Ocorre somente quando o usuário faz escolha na **última select**
4. **Lógica de Reset**: Se usuário altera seleção em select anterior à última:
   - **Selects seguintes** são esvaziadas automaticamente
   - **Processo de população recomeça** a partir da select alterada

#### **🔄 Sistema de Eventos em Cascata**
- **Eventos Customizados**: Comunicação automática entre selects
- **Estado Reativo**: Cada alteração dispara recálculo da cascata
- **Validação Contínua**: Sistema garante consistência dos filtros
- **Performance**: População sob demanda evita processamento desnecessário

### **Vantagens do Fluxo de Funcionamento**
- **✅ Experiência Intuitiva**: Usuário entende naturalmente a sequência de filtros
- **✅ Performance Otimizada**: Dados carregados apenas quando necessário
- **✅ Flexibilidade Total**: Desenvolvedor controla comportamento por configuração
- **✅ Manutenibilidade**: Lógica centralizada e reutilizável
- **✅ Escalabilidade**: Suporte a qualquer quantidade de selects em cascata

---

## **Arquitetura de Módulos e Relacionamentos**
