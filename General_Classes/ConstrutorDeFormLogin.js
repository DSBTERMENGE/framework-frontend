/**
 * Construtor de Form Login
 * Classe reutilizável para criar formulários de login parametrizados
 * Baseada no padrão estabelecido em ui_FormModal.js
 * 
 * RESPONSABILIDADES:
 * - Criar formulários de login customizáveis
 * - Gerenciar autenticação e validação
 * - Fornecer eventos padronizados para integração
 * - Suportar diferentes layouts e estilos
 */

import FormModal from './ConstrutorDeFormModal.js';

export class ConstrutorDeFormLogin {
    constructor(config = {}) {
        // Configurações básicas do formulário de login
        this.titulo = config.titulo || 'Login';
        this.subtitulo = config.subtitulo || 'Acesse sua conta';
        this.logoPath = config.logoPath || null;
        
        // Configurações dos campos
        this.mostrarLembrarSenha = config.mostrarLembrarSenha !== false;
        this.mostrarEsqueceuSenha = config.mostrarEsqueceuSenha !== false;
        this.mostrarCadastrar = config.mostrarCadastrar !== false;
        
        // Configurações de estilo
        this.estiloModal = {
            larguraMinima: '400px',
            alturaMinima: '450px',
            ...config.estiloModal
        };
        
        // Configurações de autenticação
        this.urlAutenticacao = config.urlAutenticacao || '/api/login';
        this.redirecionarApos = config.redirecionarApos || '/dashboard';
        
        // Callbacks customizáveis
        this.onLoginSucesso = config.onLoginSucesso || this.handleLoginSucesso.bind(this);
        this.onLoginErro = config.onLoginErro || this.handleLoginErro.bind(this);
        this.onValidacao = config.onValidacao || this.validarCampos.bind(this);
        
        // Estado interno
        this.modal = null;
        this.formData = {};
        this.tentativasLogin = 0;
        this.maxTentativas = config.maxTentativas || 3;
        
        // Elementos do formulário
        this.elementos = {};
        
        this.criarFormulario();
    }

    /**
     * Cria o formulário de login usando FormModal
     */
    criarFormulario() {
        // Define os campos do formulário de login
        const tipos = ['input', 'input'];
        const labels = ['Usuário/Email', 'Senha'];
        const nomes = ['usuario', 'senha'];
        const tiposInput = ['texto', 'texto']; // Ambos como 'texto', depois modificamos o de senha
        const posicoes = [
            {linha: 0, coluna: 0},
            {linha: 1, coluna: 0}
        ];
        const orientacoes = ['H', 'H'];
        const larguras = [30, 30];

        // Botões do modal
        const botoesModal = ['Cancelar', 'Entrar'];

        // Cria o modal base
        this.modal = new FormModal(
            this.titulo,
            tipos,
            labels,
            nomes,
            tiposInput,
            posicoes,
            orientacoes,
            larguras,
            {
                botoesModal: botoesModal,
                estiloModal: this.estiloModal
            }
        );

        // Personaliza o modal após criação
        this.personalizarFormulario();
        this.configurarEventos();
        
        console.log('✅ ConstrutorDeFormLogin: Formulário criado');
    }

    /**
     * Personaliza o formulário com elementos específicos do login
     */
    personalizarFormulario() {
        setTimeout(() => {
            // Converte o campo senha para type="password"
            this.configurarCampoSenha();

            // Adiciona logo se fornecido
            if (this.logoPath) {
                this.adicionarLogo();
            }

            // Adiciona subtítulo
            if (this.subtitulo) {
                this.adicionarSubtitulo();
            }

            // Adiciona elementos extras
            this.adicionarElementosExtras();

            // Aplica estilos específicos do login
            this.aplicarEstilosLogin();

        }, 100);
    }

    /**
     * Configura o campo de senha para type="password"
     */
    configurarCampoSenha() {
        const campoSenha = this.modal.form.querySelector('#senha');
        if (campoSenha) {
            campoSenha.type = 'password';
            campoSenha.autocomplete = 'current-password';
            console.log('✅ Campo senha configurado como password');
        }
    }

    /**
     * Adiciona logo ao formulário
     */
    adicionarLogo() {
        const modalHeader = this.modal.container.querySelector('.modal-header');
        if (modalHeader && this.logoPath) {
            const logoDiv = document.createElement('div');
            logoDiv.style.cssText = `
                text-align: center;
                margin-bottom: 10px;
            `;
            logoDiv.innerHTML = `
                <img src="${this.logoPath}" alt="Logo" style="
                    max-width: 80px;
                    max-height: 60px;
                    object-fit: contain;
                ">
            `;
            modalHeader.insertBefore(logoDiv, modalHeader.firstChild);
        }
    }

    /**
     * Adiciona subtítulo ao formulário
     */
    adicionarSubtitulo() {
        const modalHeader = this.modal.container.querySelector('.modal-header');
        if (modalHeader) {
            const subtituloDiv = document.createElement('div');
            subtituloDiv.style.cssText = `
                text-align: center;
                color: #666;
                font-size: 0.9rem;
                margin-top: 5px;
            `;
            subtituloDiv.textContent = this.subtitulo;
            modalHeader.appendChild(subtituloDiv);
        }
    }

    /**
     * Adiciona elementos extras (lembrar senha, esqueceu senha, etc.)
     */
    adicionarElementosExtras() {
        const form = this.modal.form;
        if (!form) return;

        // Container para elementos extras
        const extrasDiv = document.createElement('div');
        extrasDiv.style.cssText = `
            margin-top: 15px;
            margin-bottom: 15px;
        `;

        // Checkbox "Lembrar senha"
        if (this.mostrarLembrarSenha) {
            const lembrarDiv = document.createElement('div');
            lembrarDiv.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            `;
            lembrarDiv.innerHTML = `
                <input type="checkbox" id="lembrar-senha" style="margin-right: 8px;">
                <label for="lembrar-senha" style="font-size: 0.9rem; color: #555;">
                    Lembrar senha
                </label>
            `;
            extrasDiv.appendChild(lembrarDiv);
        }

        // Link "Esqueceu a senha?"
        if (this.mostrarEsqueceuSenha) {
            const esqueceuDiv = document.createElement('div');
            esqueceuDiv.style.cssText = `
                text-align: right;
                margin-bottom: 10px;
            `;
            esqueceuDiv.innerHTML = `
                <a href="#" id="esqueceu-senha" style="
                    font-size: 0.9rem;
                    color: #007bff;
                    text-decoration: none;
                ">Esqueceu a senha?</a>
            `;
            extrasDiv.appendChild(esqueceuDiv);

            // Event listener para "Esqueceu a senha"
            setTimeout(() => {
                const linkEsqueceu = document.getElementById('esqueceu-senha');
                if (linkEsqueceu) {
                    linkEsqueceu.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.handleEsqueceuSenha();
                    });
                }
            }, 100);
        }

        // Link "Criar conta"
        if (this.mostrarCadastrar) {
            const cadastrarDiv = document.createElement('div');
            cadastrarDiv.style.cssText = `
                text-align: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            `;
            cadastrarDiv.innerHTML = `
                <span style="color: #666; font-size: 0.9rem;">Não tem uma conta? </span>
                <a href="#" id="criar-conta" style="
                    color: #007bff;
                    text-decoration: none;
                    font-weight: 500;
                ">Criar conta</a>
            `;
            extrasDiv.appendChild(cadastrarDiv);

            // Event listener para "Criar conta"
            setTimeout(() => {
                const linkCriar = document.getElementById('criar-conta');
                if (linkCriar) {
                    linkCriar.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.handleCriarConta();
                    });
                }
            }, 100);
        }

        // Adiciona os elementos extras ao formulário
        form.appendChild(extrasDiv);
    }

    /**
     * Aplica estilos específicos do formulário de login
     */
    aplicarEstilosLogin() {
        // Estiliza campos de entrada
        const inputs = this.modal.form.querySelectorAll('input[type="text"], input[type="password"]');
        inputs.forEach(input => {
            input.style.cssText += `
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
                transition: border-color 0.3s;
            `;

            // Efeitos de foco
            input.addEventListener('focus', () => {
                input.style.borderColor = '#007bff';
                input.style.boxShadow = '0 0 0 2px rgba(0,123,255,0.25)';
            });

            input.addEventListener('blur', () => {
                input.style.borderColor = '#ddd';
                input.style.boxShadow = 'none';
            });
        });

        // Estiliza botão de login
        const botaoLogin = this.modal.container.querySelector('button[data-acao="submit"]');
        if (botaoLogin) {
            botaoLogin.textContent = 'Entrar';
            botaoLogin.style.cssText += `
                background-color: #007bff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 500;
                transition: background-color 0.3s;
            `;

            botaoLogin.addEventListener('mouseenter', () => {
                botaoLogin.style.backgroundColor = '#0056b3';
            });

            botaoLogin.addEventListener('mouseleave', () => {
                botaoLogin.style.backgroundColor = '#007bff';
            });
        }
    }

    /**
     * Configura eventos específicos do formulário de login
     */
    configurarEventos() {
        if (!this.modal.container) return;

        // Event listener principal do modal
        this.modal.container.addEventListener('form-modal-acao', (event) => {
            const { acao, dados } = event.detail;

            switch(acao) {
                case 'submit':
                    this.handleSubmitLogin(dados);
                    break;
                case 'encerrar':
                    this.handleEncerrarLogin();
                    break;
                default:
                    console.warn(`ConstrutorDeFormLogin: Ação '${acao}' não reconhecida`);
            }
        });

        // Event listener para tecla Enter
        setTimeout(() => {
            const inputs = this.modal.form.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.executarLogin();
                    }
                });
            });
        }, 100);

        console.log('✅ ConstrutorDeFormLogin: Eventos configurados');
    }

    /**
     * Manipula o submit do formulário de login
     */
    async handleSubmitLogin(dados) {
        console.log('🔐 ConstrutorDeFormLogin: Processando login...');

        try {
            // Validação customizável
            if (!this.onValidacao(dados)) {
                return;
            }

            // Exibe loading
            this.exibirLoading(true);

            // Realiza autenticação
            const resultado = await this.autenticar(dados);

            if (resultado.sucesso) {
                await this.onLoginSucesso(resultado);
            } else {
                this.tentativasLogin++;
                await this.onLoginErro(resultado);
            }

        } catch (error) {
            console.error('Erro no login:', error);
            await this.onLoginErro({ erro: error.message });
        } finally {
            this.exibirLoading(false);
        }
    }

    /**
     * Realiza a autenticação
     */
    async autenticar(dados) {
        console.log('🔑 Autenticando usuário...');

        // Simulação de autenticação - CUSTOMIZAR conforme necessário
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Exemplo de implementação real:
        /*
        const response = await fetch(this.urlAutenticacao, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: dados.usuario,
                senha: dados.senha
            })
        });

        return await response.json();
        */

        // Simulação para demonstração
        if (dados.usuario && dados.senha) {
            return {
                sucesso: true,
                usuario: dados.usuario,
                token: 'token-simulado-' + Date.now()
            };
        } else {
            return {
                sucesso: false,
                erro: 'Usuário ou senha inválidos'
            };
        }
    }

    /**
     * Validação padrão dos campos
     */
    validarCampos(dados) {
        if (!dados.usuario || dados.usuario.trim().length === 0) {
            this.exibirErro('Por favor, informe o usuário/email');
            return false;
        }

        if (!dados.senha || dados.senha.trim().length === 0) {
            this.exibirErro('Por favor, informe a senha');
            return false;
        }

        if (dados.senha.length < 4) {
            this.exibirErro('A senha deve ter pelo menos 4 caracteres');
            return false;
        }

        return true;
    }

    /**
     * Handler padrão para login com sucesso
     */
    async handleLoginSucesso(resultado) {
        console.log('✅ Login realizado com sucesso:', resultado);

        // Salva dados do usuário (localStorage, sessionStorage, etc.)
        if (resultado.token) {
            localStorage.setItem('auth-token', resultado.token);
            localStorage.setItem('usuario', resultado.usuario);
        }

        // Exibe mensagem de sucesso
        this.exibirSucesso('Login realizado com sucesso!');

        // Fecha o modal após delay
        setTimeout(() => {
            this.fechar();
            
            // Redireciona ou executa ação pós-login
            if (this.redirecionarApos) {
                window.location.href = this.redirecionarApos;
            }

            // Dispara evento customizado
            document.dispatchEvent(new CustomEvent('login-sucesso', {
                detail: resultado
            }));

        }, 1500);
    }

    /**
     * Handler padrão para erro de login
     */
    async handleLoginErro(resultado) {
        console.warn('❌ Erro no login:', resultado);

        this.exibirErro(resultado.erro || 'Erro ao realizar login');

        // Verifica limite de tentativas
        if (this.tentativasLogin >= this.maxTentativas) {
            this.exibirErro(`Muitas tentativas de login. Tente novamente em alguns minutos.`);
            
            setTimeout(() => {
                this.fechar();
            }, 3000);

            return;
        }

        // Limpa campo de senha após erro
        setTimeout(() => {
            const campoSenha = this.modal.form.querySelector('#senha');
            if (campoSenha) {
                campoSenha.value = '';
                campoSenha.focus();
            }
        }, 500);
    }

    /**
     * Manipula evento "Esqueceu a senha"
     */
    handleEsqueceuSenha() {
        console.log('🔄 Esqueceu a senha clicado');
        
        // Dispara evento customizado
        document.dispatchEvent(new CustomEvent('esqueceu-senha', {
            detail: { origem: 'form-login' }
        }));

        // Implementação padrão: redirecionar ou abrir modal
        // CUSTOMIZAR conforme necessário
        alert('Funcionalidade "Esqueceu a senha" não implementada ainda.');
    }

    /**
     * Manipula evento "Criar conta"
     */
    handleCriarConta() {
        console.log('👤 Criar conta clicado');
        
        // Dispara evento customizado
        document.dispatchEvent(new CustomEvent('criar-conta', {
            detail: { origem: 'form-login' }
        }));

        // Implementação padrão: redirecionar ou abrir modal
        // CUSTOMIZAR conforme necessário
        alert('Funcionalidade "Criar conta" não implementada ainda.');
    }

    /**
     * Manipula encerramento do formulário
     */
    handleEncerrarLogin() {
        console.log('🚪 Fechando formulário de login');
        
        // Dispara evento customizado
        document.dispatchEvent(new CustomEvent('login-cancelado', {
            detail: { tentativas: this.tentativasLogin }
        }));
    }

    // ============= MÉTODOS PÚBLICOS =============

    /**
     * Exibe o formulário de login
     */
    exibir() {
        if (this.modal) {
            this.tentativasLogin = 0;
            this.modal.exibir();
            
            // Foca no primeiro campo
            setTimeout(() => {
                const primeiroInput = this.modal.form.querySelector('input');
                if (primeiroInput) {
                    primeiroInput.focus();
                }
            }, 300);
        }
        
        return this;
    }

    /**
     * Fecha o formulário de login
     */
    fechar() {
        if (this.modal) {
            this.modal.ocultar();
        }
        return this;
    }

    /**
     * Executa o login programaticamente
     */
    async executarLogin() {
        const dados = this.obterDadosFormulario();
        await this.handleSubmitLogin(dados);
    }

    /**
     * Obtém os dados atuais do formulário
     */
    obterDadosFormulario() {
        const dados = {};
        if (this.modal && this.modal.form) {
            const inputs = this.modal.form.querySelectorAll('input[type="text"], input[type="password"]');
            inputs.forEach(input => {
                dados[input.id] = input.value;
            });

            // Checkbox "Lembrar senha"
            const lembrarSenha = this.modal.form.querySelector('#lembrar-senha');
            if (lembrarSenha) {
                dados.lembrarSenha = lembrarSenha.checked;
            }
        }
        return dados;
    }

    /**
     * Preenche os campos do formulário
     */
    preencherDados(dados) {
        if (!this.modal || !this.modal.form) return this;

        Object.entries(dados).forEach(([campo, valor]) => {
            const input = this.modal.form.querySelector(`#${campo}`);
            if (input) {
                input.value = valor;
            }
        });

        return this;
    }

    /**
     * Exibe mensagem de loading
     */
    exibirLoading(mostrar) {
        const botaoLogin = this.modal.container.querySelector('button[data-acao="submit"]');
        if (botaoLogin) {
            if (mostrar) {
                botaoLogin.disabled = true;
                botaoLogin.textContent = 'Entrando...';
            } else {
                botaoLogin.disabled = false;
                botaoLogin.textContent = 'Entrar';
            }
        }
    }

    /**
     * Exibe mensagem de erro
     */
    exibirErro(mensagem) {
        // Remove erro anterior
        this.removerMensagens();

        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = 'login-mensagem login-erro';
        mensagemDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            border: 1px solid #f5c6cb;
            font-size: 0.9rem;
        `;
        mensagemDiv.textContent = mensagem;

        const form = this.modal.form;
        if (form) {
            form.insertBefore(mensagemDiv, form.firstChild);
        }

        // Remove mensagem após 5 segundos
        setTimeout(() => {
            if (mensagemDiv.parentNode) {
                mensagemDiv.parentNode.removeChild(mensagemDiv);
            }
        }, 5000);
    }

    /**
     * Exibe mensagem de sucesso
     */
    exibirSucesso(mensagem) {
        // Remove mensagens anteriores
        this.removerMensagens();

        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = 'login-mensagem login-sucesso';
        mensagemDiv.style.cssText = `
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            border: 1px solid #c3e6cb;
            font-size: 0.9rem;
        `;
        mensagemDiv.textContent = mensagem;

        const form = this.modal.form;
        if (form) {
            form.insertBefore(mensagemDiv, form.firstChild);
        }
    }

    /**
     * Remove todas as mensagens de erro/sucesso
     */
    removerMensagens() {
        if (this.modal && this.modal.form) {
            const mensagens = this.modal.form.querySelectorAll('.login-mensagem');
            mensagens.forEach(msg => msg.remove());
        }
    }

    /**
     * Destrói a instância do formulário
     */
    destruir() {
        if (this.modal) {
            this.modal.destruir();
            this.modal = null;
        }
        
        this.elementos = {};
        this.formData = {};
        
        console.log('🗑️ ConstrutorDeFormLogin: Instância destruída');
    }

    /**
     * Verifica se o formulário está visível
     */
    estaVisivel() {
        return this.modal ? this.modal.estaVisivel() : false;
    }
}

// ============= FUNÇÕES DE CONVENIÊNCIA =============

/**
 * Cria e exibe um formulário de login básico
 */
export function criarLoginBasico(config = {}) {
    const login = new ConstrutorDeFormLogin(config);
    login.exibir();
    return login;
}

/**
 * Cria um formulário de login personalizado
 */
export function criarLoginPersonalizado(config) {
    return new ConstrutorDeFormLogin({
        titulo: 'Acesso ao Sistema',
        subtitulo: 'Entre com suas credenciais',
        mostrarLembrarSenha: true,
        mostrarEsqueceuSenha: true,
        mostrarCadastrar: false,
        ...config
    });
}

/**
 * Configura eventos globais para formulários de login
 */
export function configurarEventosLogin() {
    // Listener para evento de login bem-sucedido
    document.addEventListener('login-sucesso', (event) => {
        console.log('🎉 Login bem-sucedido - dados:', event.detail);
        // CUSTOMIZAR: ações globais pós-login
    });

    // Listener para login cancelado
    document.addEventListener('login-cancelado', (event) => {
        console.log('❌ Login cancelado - tentativas:', event.detail.tentativas);
        // CUSTOMIZAR: ações quando login é cancelado
    });

    // Listener para "esqueceu senha"
    document.addEventListener('esqueceu-senha', (event) => {
        console.log('🔄 Esqueceu senha acionado');
        // CUSTOMIZAR: abrir modal ou redirecionar
    });

    // Listener para "criar conta"
    document.addEventListener('criar-conta', (event) => {
        console.log('👤 Criar conta acionado');
        // CUSTOMIZAR: abrir modal de cadastro ou redirecionar
    });

    console.log('✅ Eventos globais de login configurados');
}
