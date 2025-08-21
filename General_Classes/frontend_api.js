/**
 * Frontend API - Framework DSB
 * Classe api_fe para comunicação entre frontend e backend
 * Instanciável para múltiplas aplicações
 */

/**
 * API Frontend para Framework DSB
 * Classe instanciável para cada aplicação
 * Gerencia comunicação frontend-backend via HTTP
 */
export class api_fe {
    /**
     * Inicializa a API Frontend
     * 
     * @param {string} app_name - Nome da aplicação
     * @param {string} backend_url - URL do backend (padrão: http://localhost:5000)
     * @param {object} database_config - Configuração do database
     */
    constructor(app_name = "framework_app", backend_url = "http://localhost:5000", database_config = {}) {
        /**
         * Nome da aplicação
         * @type {string}
         */
        this.app_name = app_name;
        
        /**
         * URL do backend para comunicação REST
         * @type {string}
         */
        this.backend_url = backend_url;
        
        /**
         * Configurações do banco de dados
         * @type {object}
         */
        this.database_config = database_config;
        
        /**
         * Caminho completo do arquivo de banco de dados
         * @type {string}
         * @example "c:/projetos/finctl/finctl_database.db"
         */
        this.database_path = "";
        
        /**
         * Nome do banco de dados (sem caminho)
         * @type {string}
         * @example "finctl_database.db"
         */
        this.database_name = "";
        
        /**
         * Host do servidor de banco (para bancos remotos)
         * @type {string}
         * @example "localhost" ou "192.168.1.100"
         */
        this.database_host = "";
        
        // Configurações de request
        this.timeout = 10000; // 10 segundos
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        /**
         * Nome da view ativa para consultas
         * @type {string}
         * @example "grupos_view" ou "despesas_view"
         */
        this.view = '';
        
        /**
         * Campos que serão retornados da consulta
         * @type {Array<string>}
         * @example ["Todos"] para todos os campos ou ["idgrupo", "grupo"] para específicos
         */
        this.campos = ["Todos"];
        
        /**
         * Array com nomes dos campos necessários para a operação
         * @type {Array<string>}
         * @example ["id", "nome", "descricao", "data_criacao"]
         */
        this.campos_ativos = [];
        
        /**
         * Dados que vão para o formulário (template/estrutura)
         * @type {object}
         * @example {nome: "", email: "", telefone: ""}
         */
        this.dados_form_out = {};
        
        /**
         * Dados que vêm do formulário (valores preenchidos pelo usuário)
         * @type {object}
         * @example {nome: "João", email: "joao@email.com", telefone: "123456"}
         */
        this.dados_form_in = {};
        
        console.log(`api_fe inicializada para aplicação '${app_name}' apontando para ${backend_url}`);
    }
    
    // =====================================
    // CONFIGURAÇÕES E PROPRIEDADES
    // =====================================
    
    /**
     * Configura a tabela ou view ativa para operações CRUD
     * 
     * @param {string} nome_tabela_or_view - Nome da tabela (tb_) ou view (vw_)
     * @param {Array<string>} campos - Array de campos necessários para a operação
     * @example 
     * // Para uma tabela
     * api.configurar_tabela("tb_grupos_finctl", ["grupo", "descricao"]);
     * 
     * // Para uma view
     * api.configurar_tabela("vw_lancamentos_completos", ["id", "descricao", "valor"]);
     */
    configurar_tabela(nome_tabela_or_view, campos = []) {
        this.tabela_or_view = nome_tabela_or_view;
        this.campos_ativos = campos;
        console.log(`Tabela/View configurada: ${nome_tabela_or_view} com campos:`, campos);
    }
    
    /**
     * Configura dados que vão para o formulário (template)
     * 
     * @param {object} dados - Objeto com estrutura dos dados
     */
    configurar_dados_form_out(dados) {
        this.dados_form_out = dados;
        console.log('Dados form out configurados:', dados);
    }
    
    /**
     * Configura dados que vêm do formulário (valores preenchidos pelo usuário)
     * 
     * @param {object} dados - Objeto com dados preenchidos pelo usuário
     * @example
     * // Dados vindos do formulário
     * api.configurar_dados_form_in({
     *     grupo: "Alimentação",
     *     descricao: "Despesas com comida e bebida"
     * });
     */
    configurar_dados_form_in(dados) {
        this.dados_form_in = dados;
        console.log('Dados form in configurados:', dados);
    }
    
    /**
     * Atualiza configuração do database
     * 
     * @param {object} config - Nova configuração do database
     * @example
     * // Configuração de banco SQLite local
     * api.configurar_database({
     *     tipo: "sqlite",
     *     caminho: "./dados/finctl.db"
     * });
     * 
     * // Configuração de banco remoto
     * api.configurar_database({
     *     tipo: "postgresql",
     *     host: "localhost",
     *     porta: 5432,
     *     database: "finctl_db"
     * });
     */
    configurar_database(config) {
        this.database_config = config;
        console.log('Database configurado:', config);
    }
    
    // =====================================
    // MÉTODOS AUXILIARES INTERNOS
    // =====================================
    
    /**
     * Executa request HTTP para o backend
     * 
     * @param {string} endpoint - Endpoint da API
     * @param {object} dados - Dados a serem enviados
     * @return {Promise} - Promise com resultado
     */
    async _executar_request(endpoint, dados = {}) {
        try {
            const url = `${this.backend_url}${endpoint}`;
            
            const config = {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(dados)
            };
            
            console.log(`Executando request para ${url}:`, dados);
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
            
            const resultado = await response.json();
            console.log(`Resposta recebida de ${endpoint}:`, resultado);
            
            return resultado;
            
        } catch (error) {
            console.error(`Erro no request para ${endpoint}:`, error);
            return { erro: error.message };
        }
    }
    
    /**
     * Monta payload padrão para operações CRUD
     * 
     * @param {object} dados_extras - Dados adicionais específicos
     * @return {object} - Payload completo
     */
    _montar_payload(dados_extras = {}) {
        return {
            tabela: this.tabela_or_view,
            campos: this.campos_ativos,
            database_config: this.database_config,
            database_path: this.database_path,
            database_name: this.database_name,
            database_host: this.database_host,
            dados_form_in: this.dados_form_in,
            dados_form_out: this.dados_form_out,
            ...dados_extras
        };
    }
    
    // =====================================
    // OPERAÇÕES CRUD
    // =====================================
    
    /**
     * Insere dados na tabela configurada
     * 
     * @return {Promise} - Resultado da inserção
     */
    async inserir() {
        if (!this.tabela_or_view) {
            return { erro: "Tabela/View não configurada. Use configurar_tabela() primeiro." };
        }
        
        if (Object.keys(this.dados_form_in).length === 0) {
            return { erro: "Dados não configurados. Use configurar_dados_form_in() primeiro." };
        }
        
        const payload = this._montar_payload();
        return await this._executar_request('/inserir', payload);
    }
    
    /**
     * Atualiza dados na tabela configurada
     * 
     * @return {Promise} - Resultado da atualização
     */
    async atualizar() {
        if (!this.tabela_or_view) {
            return { erro: "Tabela/View não configurada. Use configurar_tabela() primeiro." };
        }
        
        if (Object.keys(this.dados_form_in).length === 0) {
            return { erro: "Dados não configurados. Use configurar_dados_form_in() primeiro." };
        }
        
        const payload = this._montar_payload();
        return await this._executar_request('/atualizar', payload);
    }
    
    /**
     * Exclui dados da tabela configurada
     * 
     * @return {Promise} - Resultado da exclusão
     */
    async excluir() {
        if (!this.tabela_or_view) {
            return { erro: "Tabela/View não configurada. Use configurar_tabela() primeiro." };
        }
        
        if (Object.keys(this.dados_form_in).length === 0) {
            return { erro: "Dados não configurados. Use configurar_dados_form_in() primeiro." };
        }
        
        const payload = this._montar_payload();
        return await this._executar_request('/excluir', payload);
    }
    
    // =====================================
    // CONSULTAS
    // =====================================
    
    /**
     * Obtém dados de uma VIEW com filtros automáticos
     * 
     * @param {string} nome_view - Nome da VIEW
     * @param {object} filtros - Filtros específicos (opcional, usa dados_form_in se não fornecido)
     * @return {Promise} - Dados da consulta
     */
    async obter_view(nome_view, filtros = null) {
        if (!nome_view) {
            nome_view = this.view; // Usa a propriedade view configurada
        }
        
        const payload = this._montar_payload({
            view: nome_view,
            campos: this.campos,
            filtros: filtros || this.dados_form_in
        });
        
        return await this._executar_request('/obter_view', payload);
    }
    
    /**
     * Obtém dados de tabela (implementação futura)
     * 
     * @param {object} filtros - Filtros para a consulta
     * @return {Promise} - Dados da consulta
     */
    async obter_tabela(filtros = {}) {
        if (!this.tabela_or_view) {
            return { erro: "Tabela/View não configurada. Use configurar_tabela() primeiro." };
        }
        
        const payload = this._montar_payload({
            filtros: filtros
        });
        
        return await this._executar_request('/obter', payload);
    }
    
    // =====================================
    // UTILITÁRIOS
    // =====================================
    
    /**
     * Testa conectividade com o backend
     * 
     * @return {Promise} - Status da conexão
     */
    async testar_conexao() {
        try {
            const response = await fetch(`${this.backend_url}/health`);
            
            if (response.ok) {
                const dados = await response.json();
                console.log('Conexão com backend OK:', dados);
                return { sucesso: true, dados: dados };
            } else {
                return { erro: `Backend indisponível: ${response.status}` };
            }
        } catch (error) {
            console.error('Erro ao testar conexão:', error);
            return { erro: `Falha na conexão: ${error.message}` };
        }
    }
    
    /**
     * Limpa todos os dados configurados
     */
    limpar_dados() {
        this.dados_form_in = {};
        this.dados_form_out = {};
        console.log('Dados limpos');
    }
    
    /**
     * Obtém configuração atual da instância
     * 
     * @return {object} - Configuração atual
     */
    obter_configuracao() {
        return {
            app_name: this.app_name,
            backend_url: this.backend_url,
            database_config: this.database_config,
            database_path: this.database_path,
            database_name: this.database_name,
            database_host: this.database_host,
            tabela_or_view: this.tabela_or_view,
            campos_ativos: this.campos_ativos
        };
    }
    
    /**
     * Atualiza URL do backend
     * 
     * @param {string} nova_url - Nova URL do backend
     */
    atualizar_backend_url(nova_url) {
        this.backend_url = nova_url;
        console.log(`Backend URL atualizada para: ${nova_url}`);
    }
}

// =====================================
// FUNÇÕES UTILITÁRIAS GLOBAIS
// =====================================

/**
 * Função helper para criar API pré-configurada para uma aplicação
 * 
 * @param {string} app_name - Nome da aplicação
 * @param {object} database_config - Configuração do database
 * @param {string} backend_url - URL do backend
 * @return {api_fe} - Instância configurada da API
 */
export function criar_api_aplicacao(app_name, database_config, backend_url = "http://localhost:5000") {
    const api = new api_fe(app_name, backend_url, database_config);
    console.log(`API criada para aplicação ${app_name}`);
    return api;
}

/**
 * Função para testar múltiplas APIs simultaneamente
 * 
 * @param {Array} apis - Array de instâncias api_fe
 * @return {Promise} - Resultado dos testes
 */
export async function testar_multiplas_apis(apis) {
    const resultados = [];
    
    for (const api of apis) {
        const resultado = await api.testar_conexao();
        resultados.push({
            app: api.app_name,
            status: resultado.sucesso ? 'OK' : 'ERRO',
            detalhes: resultado
        });
    }
    
    console.log('Teste de múltiplas APIs:', resultados);
    return resultados;
}

// Log de inicialização
console.log('Módulo frontend_api carregado - Classe api_fe disponível');
