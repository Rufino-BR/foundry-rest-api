/**
 * Foundry REST API Module
 * 
 * Este módulo expõe APIs REST para integração externa com o Foundry VTT
 * 
 * @author DMHUB Team
 * @version 1.0.0
 */

class FoundryRestApi {
    constructor() {
        this.apiToken = null;
        this.endpoints = {
            actors: '/api/actors',
            items: '/api/items',
            scenes: '/api/scenes',
            status: '/api/status',
            users: '/api/users',
            journal: '/api/journal'
        };
        
        this.init();
    }

    /**
     * Inicializa o módulo
     */
    init() {
        // Verifica se o Foundry VTT está disponível
        if (typeof game === 'undefined') {
            console.error('FoundryRestApi: Foundry VTT não está disponível');
            return;
        }

        // Registra as configurações do módulo primeiro
        this.registerSettings();
        
        // Configura o token de API
        this.apiToken = game.settings.get('foundry-rest-api', 'apiToken') || this.generateToken();
        
        // Registra os hooks
        this.registerHooks();
        
        // Inicia o servidor REST
        this.startRestServer();
        
        console.log('FoundryRestApi: Módulo inicializado com sucesso');
    }

    /**
     * Gera um token de API único
     */
    generateToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    /**
     * Registra as configurações do módulo
     */
    registerSettings() {
        game.settings.register('foundry-rest-api', 'apiToken', {
            name: 'Token de API',
            hint: 'Token usado para autenticação das APIs REST',
            scope: 'world',
            config: true,
            type: String,
            default: this.apiToken
        });

        game.settings.register('foundry-rest-api', 'enableRestApi', {
            name: 'Habilitar API REST',
            hint: 'Habilita ou desabilita as APIs REST',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true
        });

        game.settings.register('foundry-rest-api', 'allowedOrigins', {
            name: 'Origens Permitidas',
            hint: 'Lista de origens permitidas para CORS (separadas por vírgula)',
            scope: 'world',
            config: true,
            type: String,
            default: '*'
        });
    }

    /**
     * Registra os hooks do Foundry VTT
     */
    registerHooks() {
        // Hook para quando o jogo está pronto
        Hooks.on('ready', () => {
            console.log('FoundryRestApi: Jogo pronto, APIs REST disponíveis');
        });

        // Hook para quando um ator é criado
        Hooks.on('createActor', (actor) => {
            this.notifyWebhook('actor_created', actor);
        });

        // Hook para quando um ator é atualizado
        Hooks.on('updateActor', (actor, changes) => {
            this.notifyWebhook('actor_updated', { actor, changes });
        });

        // Hook para quando um item é criado
        Hooks.on('createItem', (item) => {
            this.notifyWebhook('item_created', item);
        });

        // Hook para quando uma cena é criada
        Hooks.on('createScene', (scene) => {
            this.notifyWebhook('scene_created', scene);
        });
    }

    /**
     * Inicia o servidor REST
     */
    startRestServer() {
        if (!game.settings.get('foundry-rest-api', 'enableRestApi')) {
            console.log('FoundryRestApi: API REST desabilitada');
            return;
        }

        // Cria endpoints REST usando o sistema de rotas do Foundry
        this.createEndpoints();
        
        console.log('FoundryRestApi: Servidor REST iniciado');
    }

    /**
     * Cria os endpoints REST
     */
    createEndpoints() {
        // Endpoint de status
        this.createEndpoint('/api/status', 'GET', (request) => {
            return {
                success: true,
                status: 'online',
                version: game.version,
                world: game.world.title,
                users: game.users.size,
                timestamp: new Date().toISOString()
            };
        });

        // Endpoint de atores
        this.createEndpoint('/api/actors', 'GET', (request) => {
            const actors = game.actors.map(actor => this.sanitizeActor(actor));
            return {
                success: true,
                data: actors,
                count: actors.length,
                timestamp: new Date().toISOString()
            };
        });

        // Endpoint de ator específico
        this.createEndpoint('/api/actors/:id', 'GET', (request) => {
            const actorId = request.params.id;
            const actor = game.actors.get(actorId);
            
            if (!actor) {
                return {
                    success: false,
                    error: 'Actor não encontrado',
                    status: 404
                };
            }

            return {
                success: true,
                data: this.sanitizeActor(actor),
                timestamp: new Date().toISOString()
            };
        });

        // Endpoint de itens
        this.createEndpoint('/api/items', 'GET', (request) => {
            const items = game.items.map(item => this.sanitizeItem(item));
            return {
                success: true,
                data: items,
                count: items.length,
                timestamp: new Date().toISOString()
            };
        });

        // Endpoint de cenas
        this.createEndpoint('/api/scenes', 'GET', (request) => {
            const scenes = game.scenes.map(scene => this.sanitizeScene(scene));
            return {
                success: true,
                data: scenes,
                count: scenes.length,
                timestamp: new Date().toISOString()
            };
        });

        // Endpoint de usuários
        this.createEndpoint('/api/users', 'GET', (request) => {
            const users = game.users.map(user => this.sanitizeUser(user));
            return {
                success: true,
                data: users,
                count: users.length,
                timestamp: new Date().toISOString()
            };
        });
    }

    /**
     * Cria um endpoint REST
     */
    createEndpoint(path, method, handler) {
        // Simula a criação de endpoints REST
        // Em um ambiente real, isso seria integrado com o sistema de rotas do Foundry
        console.log(`FoundryRestApi: Endpoint ${method} ${path} registrado`);
        
        // Armazena o handler para uso posterior
        if (!this.endpointHandlers) {
            this.endpointHandlers = {};
        }
        
        this.endpointHandlers[`${method}:${path}`] = handler;
    }

    /**
     * Sanitiza dados do ator para API
     */
    sanitizeActor(actor) {
        return {
            _id: actor.id,
            name: actor.name,
            type: actor.type,
            img: actor.img,
            active: actor.active,
            ownership: actor.ownership,
            data: {
                name: actor.data.name,
                type: actor.data.type,
                img: actor.data.img,
                // Adicione outros campos conforme necessário
            },
            flags: actor.flags,
            createdAt: actor.createdAt,
            updatedAt: actor.updatedAt
        };
    }

    /**
     * Sanitiza dados do item para API
     */
    sanitizeItem(item) {
        return {
            _id: item.id,
            name: item.name,
            type: item.type,
            img: item.img,
            data: {
                name: item.data.name,
                type: item.data.type,
                img: item.data.img,
                rarity: item.data.rarity,
                // Adicione outros campos conforme necessário
            },
            flags: item.flags,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };
    }

    /**
     * Sanitiza dados da cena para API
     */
    sanitizeScene(scene) {
        return {
            _id: scene.id,
            name: scene.name,
            img: scene.img,
            active: scene.active,
            visible: scene.visible,
            data: {
                name: scene.data.name,
                img: scene.data.img,
                width: scene.data.width,
                height: scene.data.height,
                // Adicione outros campos conforme necessário
            },
            flags: scene.flags,
            createdAt: scene.createdAt,
            updatedAt: scene.updatedAt
        };
    }

    /**
     * Sanitiza dados do usuário para API
     */
    sanitizeUser(user) {
        return {
            _id: user.id,
            name: user.name,
            avatar: user.avatar,
            active: user.active,
            role: user.role,
            flags: user.flags,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    /**
     * Notifica webhooks sobre eventos
     */
    notifyWebhook(event, data) {
        // Implementação de webhooks seria adicionada aqui
        console.log(`FoundryRestApi: Evento ${event} disparado`, data);
    }

    /**
     * Valida token de API
     */
    validateToken(token) {
        return token === this.apiToken;
    }

    /**
     * Processa requisição REST
     */
    processRequest(path, method, request) {
        const handlerKey = `${method}:${path}`;
        const handler = this.endpointHandlers[handlerKey];
        
        if (!handler) {
            return {
                success: false,
                error: 'Endpoint não encontrado',
                status: 404
            };
        }

        try {
            return handler(request);
        } catch (error) {
            console.error('FoundryRestApi: Erro ao processar requisição', error);
            return {
                success: false,
                error: 'Erro interno do servidor',
                status: 500
            };
        }
    }
}

// Inicializa o módulo quando o Foundry VTT estiver pronto
Hooks.once('ready', () => {
    window.foundryRestApi = new FoundryRestApi();
});

// Exporta a classe para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FoundryRestApi;
}
