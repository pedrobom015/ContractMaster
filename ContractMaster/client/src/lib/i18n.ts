export type Language = 'pt-BR' | 'en-US';

export interface Translations {
  // Navigation
  'nav.contracts': string;
  'nav.billing': string;
  'nav.customer_service': string;
  'nav.financial': string;
  'nav.tables': string;
  'nav.administration': string;
  
  // Common subsections
  'section.dashboard': string;
  'section.entries': string;
  'section.attendance_entries': string;
  'section.processing': string;
  'section.reports': string;
  'section.tables': string;
  'section.partners': string;
  'section.partner_types': string;
  'section.address_types': string;
  'section.addresses': string;
  'section.entity_addresses': string;
  'section.document_types': string;
  'section.documents': string;
  'section.entity_documents': string;
  'section.general': string;
  'section.auxiliary': string;
  
  // Financial Module sections
  'section.setup': string;
  'section.chart_of_accounts': string;
  'section.account_types': string;
  'section.cost_centers': string;
  'section.departments': string;
  'section.projects': string;
  'section.transactions': string;
  'section.journal_entries': string;
  'section.payments': string;
  'section.receipts': string;
  'section.transfers': string;
  'section.accounts': string;
  'section.accounts_receivable': string;
  'section.accounts_payable': string;
  'section.bank_accounts': string;
  'section.bank_reconciliation': string;
  'section.budgets': string;
  'section.budget_setup': string;
  'section.budget_vs_actual': string;
  'section.budget_analysis': string;
  'section.contacts': string;
  'section.vendors': string;
  'section.customers': string;
  'section.contact_types': string;
  'section.periods': string;
  'section.fiscal_years': string;
  'section.fiscal_periods': string;
  'section.period_closing': string;
  'section.balance_sheet': string;
  'section.income_statement': string;
  'section.cash_flow': string;
  'section.trial_balance': string;
  'section.general_ledger': string;
  'section.taxes': string;
  'section.tax_codes': string;
  'section.tax_reports': string;
  
  // Multi-level navigation items
  'section.batch_processing': string;
  'section.validation': string;
  'section.approval': string;
  'section.financial_reports': string;
  'section.operational_reports': string;
  'section.analytics': string;
  'section.partners_list': string;
  'section.relationships': string;
  'section.addresses_list': string;
  'section.documents_list': string;
  'section.organization': string;
  'section.user_management': string;
  'section.data_tools': string;
  
  // SysUser specific
  'sysuser.name': string;
  'sysuser.login': string;
  'sysuser.email': string;
  'sysuser.password': string;
  'sysuser.firstName': string;
  'sysuser.lastName': string;
  'sysuser.isAdmin': string;
  'sysuser.active': string;
  'sysuser.twoFactorEnabled': string;
  'sysuser.lastLogin': string;
  
  // Partner specific
  'partner.code': string;
  'partner.name': string;
  'partner.legalName': string;
  'partner.taxId': string;
  'partner.type': string;
  'partner.phone': string;
  'partner.email': string;
  'partner.website': string;
  'partner.contact': string;
  'partner.notes': string;
  'partner.isCustomer': string;
  'partner.isVendor': string;
  'partner.isCollector': string;
  'partner.isEmployee': string;
  'partner.isAccredited': string;
  
  // Administration specific
  'section.programs': string;
  'section.groups': string;
  'section.companies': string;
  'section.units': string;
  'section.users': string;
  'section.user_monitoring': string;
  'section.data_import': string;
  'section.database_explorer': string;
  'section.sql_panel': string;
  'section.preferences': string;
  'section.batch_management': string;
  
  // Common actions
  'action.save': string;
  'action.cancel': string;
  'action.edit': string;
  'action.delete': string;
  'action.create': string;
  'action.search': string;
  'action.export': string;
  'action.import': string;
  
  // Contract specific
  'contract.title': string;
  'contract.number': string;
  'contract.type': string;
  'contract.start_date': string;
  'contract.end_date': string;
  'contract.status': string;
  'contract.client': string;
  'contract.save_button': string;
  'contract.cancel_button': string;
  
  // Beneficiary specific
  'beneficiary.title': string;
  'beneficiary.name': string;
  'beneficiary.relationship': string;
  'beneficiary.birth_date': string;
  'beneficiary.primary': string;
  'beneficiary.status': string;
  
  // Charges specific
  'charge.title': string;
  'charge.amount': string;
  'charge.due_date': string;
  'charge.payment_date': string;
  'charge.status': string;
  'charge.reference': string;
  
  // Common labels
  'label.name': string;
  'label.email': string;
  'label.phone': string;
  'label.address': string;
  'label.date': string;
  'label.amount': string;
  'label.status': string;
  'label.description': string;
  'label.active': string;
  'label.inactive': string;
  
  // Messages
  'message.save_success': string;
  'message.save_error': string;
  'message.delete_success': string;
  'message.delete_error': string;
  'message.loading': string;
  'message.no_data': string;
  'message.confirm_delete': string;

  // Contract Tables
  'contract_tables.performed_services': string;
  'contract_tables.performed_services_desc': string;
  'contract_tables.group_batches': string;
  'contract_tables.group_batches_desc': string;
  'contract_tables.classes': string;
  'contract_tables.classes_desc': string;
  'contract_tables.charges': string;
  'contract_tables.charges_desc': string;
  'contract_tables.prorated_services': string;
  'contract_tables.subtitle': string;
  'contract_tables.management': string;
  'contract_tables.configuration': string;

  // Cost Centers
  'Cost Centers': string;
  'Cost Center': string;
  'New Cost Center': string;
  'Edit Cost Center': string;
  'Create Cost Center': string;
  'Cost Center Code': string;
  'Cost Center Name': string;
  'Cost center code is required': string;
  'Cost center name is required': string;
  'Hierarchy Level': string;
  'Level in the cost center hierarchy (1-10)': string;
  'Manager Name': string;
  'Person responsible for this cost center': string;
  'Annual Budget': string;
  'Annual budget allocation for this cost center': string;
  'Marketing Department': string;
  'John Smith': string;
  'Brief description of the cost center purpose and scope': string;
  'Manage cost centers for tracking expenses and budgets across departments and projects': string;
  'Hierarchical structure for organizing and tracking costs by business units': string;
  'Loading cost centers...': string;
  'No cost centers found': string;
  'Create your first cost center to start organizing expenses by business units.': string;
  'Code': string;
  'Name': string;
  'Manager': string;
  'Budget': string;
  'Level': string;
  'Actions': string;
  'Are you sure you want to delete this cost center?': string;
  'Cost center created successfully': string;
  'The cost center has been added to the system.': string;
  'Error creating cost center': string;
  'Cost center updated successfully': string;
  'The cost center has been updated.': string;
  'Error updating cost center': string;
  'Cost center deleted successfully': string;
  'The cost center has been removed from the system.': string;
  'Error deleting cost center': string;
  'Update the cost center information below.': string;
  'Add a new cost center to organize expenses by business units.': string;
  'Unique identifier for the cost center': string;
  'Saving...': string;
  'Update': string;
  'Create': string;
  'Cancel': string;
  'Active': string;
  'Inactive': string;

  // Departments
  'Departments': string;
  'Department': string;
  'New Department': string;
  'Edit Department': string;
  'Create Department': string;
  'Department Code': string;
  'Department Name': string;
  'Department code is required': string;
  'Department name is required': string;
  'Human Resources': string;
  'Brief description of the department purpose and scope': string;
  'Manage organizational departments for tracking activities and resources across business units': string;
  'Hierarchical structure for organizing and tracking activities by business units': string;
  'Loading departments...': string;
  'No departments found': string;
  'Create your first department to start organizing activities by business units.': string;
  'Are you sure you want to delete this department?': string;
  'Department created successfully': string;
  'The department has been added to the system.': string;
  'Error creating department': string;
  'Department updated successfully': string;
  'The department has been updated.': string;
  'Error updating department': string;
  'Department deleted successfully': string;
  'The department has been removed from the system.': string;
  'Error deleting department': string;
  'Update the department information below.': string;
  'Add a new department to organize activities by business units.': string;
  'Delete Department': string;
  'Organizational Departments': string;

  // Projects
  'Projects': string;
  'Project': string;
  'New Project': string;
  'Edit Project': string;
  'Create Project': string;
  'Project Code': string;
  'Project Name': string;
  'Project code is required': string;
  'Project name is required': string;
  'Start Date': string;
  'End Date': string;
  'Completion Percentage': string;
  'Project Status': string;
  'Planned': string;
  'On Hold': string;
  'Completed': string;
  'Cancelled': string;
  'Select': string;
  'Loading projects...': string;
  'No projects found': string;
  'Create your first project to start tracking project activities and progress.': string;
  'Are you sure you want to delete this project?': string;
  'Project created successfully': string;
  'The project has been added to the system.': string;
  'Error creating project': string;
  'Project updated successfully': string;
  'The project has been updated.': string;
  'Error updating project': string;
  'Project deleted successfully': string;
  'The project has been removed from the system.': string;
  'Error deleting project': string;
  'Update the project information below.': string;
  'Add a new project to track activities and progress.': string;
  'Project Management': string;
  'Manage projects for tracking activities, budgets, and progress across business initiatives': string;
  'Track project progress, budgets, and deliverables': string;
  'Dates': string;
  'Creating...': string;
  'Updating...': string;
  'View Project Details': string;
  'Close': string;
  'Search projects...': string;
}

const translations: Record<Language, Translations> = {
  'pt-BR': {
    // Navigation
    'nav.contracts': 'Contratos',
    'nav.billing': 'Cobrança',
    'nav.customer_service': 'Atendimento',
    'nav.financial': 'Financeiro',
    'nav.tables': 'Tabelas',
    'nav.administration': 'Administração',
    
    // Common subsections
    'section.dashboard': 'Dashboard',
    'section.entries': 'Lançamentos',
    'section.attendance_entries': 'Atendimentos - Lançamentos',
    'section.processing': 'Processamentos',
    'section.reports': 'Relatórios',
    'section.tables': 'Tabelas',
    'section.partners': 'Parceiros',
    'section.partner_types': 'Tipos de Parceiros',
    'section.address_types': 'Tipos de Endereço',
    'section.addresses': 'Endereços',
    'section.entity_addresses': 'Vínculos de Endereço',
    'section.document_types': 'Tipos de Documento',
    'section.documents': 'Documentos',
    'section.entity_documents': 'Vínculos de Documento',
    'section.general': 'Gerais',
    'section.auxiliary': 'Auxiliares',
    
    // Financial Module sections
    'section.setup': 'Configuração',
    'section.chart_of_accounts': 'Plano de Contas',
    'section.account_types': 'Tipos de Conta',
    'section.cost_centers': 'Centros de Custo',
    'section.departments': 'Departamentos',
    'section.projects': 'Projetos',
    'section.transactions': 'Movimentações',
    'section.journal_entries': 'Lançamentos Contábeis',
    'section.payments': 'Pagamentos',
    'section.receipts': 'Recebimentos',
    'section.transfers': 'Transferências',
    'section.accounts': 'Contas',
    'section.accounts_receivable': 'Contas a Receber',
    'section.accounts_payable': 'Contas a Pagar',
    'section.bank_accounts': 'Contas Bancárias',
    'section.bank_reconciliation': 'Conciliação Bancária',
    'section.budgets': 'Orçamentos',
    'section.budget_setup': 'Configuração de Orçamento',
    'section.budget_vs_actual': 'Orçado vs Realizado',
    'section.budget_analysis': 'Análise Orçamentária',
    'section.contacts': 'Contatos',
    'section.vendors': 'Fornecedores',
    'section.customers': 'Clientes',
    'section.contact_types': 'Tipos de Contato',
    'section.periods': 'Períodos',
    'section.fiscal_years': 'Exercícios Fiscais',
    'section.fiscal_periods': 'Períodos Fiscais',
    'section.period_closing': 'Fechamento de Período',
    'section.balance_sheet': 'Balanço Patrimonial',
    'section.income_statement': 'DRE',
    'section.cash_flow': 'Fluxo de Caixa',
    'section.trial_balance': 'Balancete',
    'section.general_ledger': 'Razão Geral',
    'section.taxes': 'Impostos',
    'section.tax_codes': 'Códigos de Imposto',
    'section.tax_reports': 'Relatórios Fiscais',
    
    // Multi-level navigation items
    'section.batch_processing': 'Processamento em Lote',
    'section.validation': 'Validação',
    'section.approval': 'Aprovação',
    'section.financial_reports': 'Relatórios Financeiros',
    'section.operational_reports': 'Relatórios Operacionais',
    'section.analytics': 'Análises',
    'section.partners_list': 'Lista de Parceiros',
    'section.relationships': 'Relacionamentos',
    'section.addresses_list': 'Lista de Endereços',
    'section.documents_list': 'Lista de Documentos',
    'section.organization': 'Organização',
    'section.user_management': 'Gerenciamento de Usuários',
    'section.data_tools': 'Ferramentas de Dados',
    
    // SysUser specific
    'sysuser.name': 'Nome de Usuário',
    'sysuser.login': 'Login',
    'sysuser.email': 'Email',
    'sysuser.password': 'Senha',
    'sysuser.firstName': 'Primeiro Nome',
    'sysuser.lastName': 'Sobrenome',
    'sysuser.isAdmin': 'Administrador',
    'sysuser.active': 'Ativo',
    'sysuser.twoFactorEnabled': '2FA Habilitado',
    'sysuser.lastLogin': 'Último Login',
    
    // Partner specific
    'partner.code': 'Código do Parceiro',
    'partner.name': 'Nome do Parceiro',
    'partner.legalName': 'Razão Social',
    'partner.taxId': 'CPF/CNPJ',
    'partner.type': 'Tipo de Parceiro',
    'partner.phone': 'Telefone',
    'partner.email': 'Email',
    'partner.website': 'Website',
    'partner.contact': 'Pessoa de Contato',
    'partner.notes': 'Observações',
    'partner.isCustomer': 'Cliente',
    'partner.isVendor': 'Fornecedor',
    'partner.isCollector': 'Cobrador',
    'partner.isEmployee': 'Funcionário',
    'partner.isAccredited': 'Credenciado',
    
    // Administration specific
    'section.programs': 'Programas',
    'section.groups': 'Grupos',
    'section.companies': 'Empresas',
    'section.units': 'Unidades',
    'section.users': 'Usuários',
    'section.user_monitoring': 'Monitoramento de Usuários',
    'section.data_import': 'Importação de Dados',
    'section.database_explorer': 'Database Explorer',
    'section.sql_panel': 'Painel SQL',
    'section.preferences': 'Preferências',
    'section.batch_management': 'Lançamentos',
    
    // Common actions
    'action.save': 'Salvar',
    'action.cancel': 'Cancelar',
    'action.edit': 'Editar',
    'action.delete': 'Excluir',
    'action.create': 'Criar',
    'action.search': 'Pesquisar',
    'action.export': 'Exportar',
    'action.import': 'Importar',
    
    // Contract specific
    'contract.title': 'Contratos',
    'contract.number': 'Número do Contrato',
    'contract.type': 'Tipo de Contrato',
    'contract.start_date': 'Data de Início',
    'contract.end_date': 'Data de Término',
    'contract.status': 'Status',
    'contract.client': 'Cliente',
    'contract.save_button': 'Salvar Contrato',
    'contract.cancel_button': 'Cancelar',
    
    // Beneficiary specific
    'beneficiary.title': 'Beneficiários',
    'beneficiary.name': 'Nome',
    'beneficiary.relationship': 'Parentesco',
    'beneficiary.birth_date': 'Data de Nascimento',
    'beneficiary.primary': 'Principal',
    'beneficiary.status': 'Status',
    
    // Charges specific
    'charge.title': 'Cobranças',
    'charge.amount': 'Valor',
    'charge.due_date': 'Data de Vencimento',
    'charge.payment_date': 'Data de Pagamento',
    'charge.status': 'Status',
    'charge.reference': 'Referência',
    
    // Common labels
    'label.name': 'Nome',
    'label.email': 'E-mail',
    'label.phone': 'Telefone',
    'label.address': 'Endereço',
    'label.date': 'Data',
    'label.amount': 'Valor',
    'label.status': 'Status',
    'label.description': 'Descrição',
    'label.active': 'Ativo',
    'label.inactive': 'Inativo',
    
    // Messages
    'message.save_success': 'Salvo com sucesso!',
    'message.save_error': 'Erro ao salvar. Tente novamente.',
    'message.delete_success': 'Excluído com sucesso!',
    'message.delete_error': 'Erro ao excluir. Tente novamente.',
    'message.loading': 'Carregando...',
    'message.no_data': 'Nenhum dado encontrado.',
    'message.confirm_delete': 'Tem certeza que deseja excluir este item?',

    // Contract Tables
    'contract_tables.performed_services': 'Serviços Executados',
    'contract_tables.performed_services_desc': 'Gerenciar serviços executados e tipos de atendimento',
    'contract_tables.group_batches': 'Lotes de Grupos',
    'contract_tables.group_batches_desc': 'Configurar grupos de contratos para cobrança e rateio',
    'contract_tables.classes': 'Classes',
    'contract_tables.classes_desc': 'Definir classes de contratos com valores e condições',
    'contract_tables.charges': 'Cobranças',
    'contract_tables.charges_desc': 'Gerenciar cobranças contratuais e serviços rateados',
    'contract_tables.prorated_services': 'Serviços Rateados',
    'contract_tables.subtitle': 'Gerenciamento de tabelas auxiliares do módulo de contratos',
    'contract_tables.management': 'Gestão de Tabelas',
    'contract_tables.configuration': 'Configuração de Tabelas',

    // Cost Centers
    'Cost Centers': 'Centros de Custo',
    'Cost Center': 'Centro de Custo',
    'New Cost Center': 'Novo Centro de Custo',
    'Edit Cost Center': 'Editar Centro de Custo',
    'Create Cost Center': 'Criar Centro de Custo',
    'Cost Center Code': 'Código do Centro de Custo',
    'Cost Center Name': 'Nome do Centro de Custo',
    'Cost center code is required': 'Código do centro de custo é obrigatório',
    'Cost center name is required': 'Nome do centro de custo é obrigatório',
    'Hierarchy Level': 'Nível Hierárquico',
    'Level in the cost center hierarchy (1-10)': 'Nível na hierarquia do centro de custo (1-10)',
    'Manager Name': 'Nome do Gerente',
    'Person responsible for this cost center': 'Pessoa responsável por este centro de custo',
    'Annual Budget': 'Orçamento Anual',
    'Annual budget allocation for this cost center': 'Alocação de orçamento anual para este centro de custo',
    'Marketing Department': 'Departamento de Marketing',
    'John Smith': 'João Silva',
    'Brief description of the cost center purpose and scope': 'Breve descrição do propósito e escopo do centro de custo',
    'Manage cost centers for tracking expenses and budgets across departments and projects': 'Gerenciar centros de custo para rastrear despesas e orçamentos entre departamentos e projetos',
    'Hierarchical structure for organizing and tracking costs by business units': 'Estrutura hierárquica para organizar e rastrear custos por unidades de negócio',
    'Loading cost centers...': 'Carregando centros de custo...',
    'No cost centers found': 'Nenhum centro de custo encontrado',
    'Create your first cost center to start organizing expenses by business units.': 'Crie seu primeiro centro de custo para começar a organizar despesas por unidades de negócio.',
    'Code': 'Código',
    'Name': 'Nome',
    'Manager': 'Gerente',
    'Budget': 'Orçamento',
    'Level': 'Nível',
    'Actions': 'Ações',
    'Are you sure you want to delete this cost center?': 'Tem certeza que deseja excluir este centro de custo?',
    'Cost center created successfully': 'Centro de custo criado com sucesso',
    'The cost center has been added to the system.': 'O centro de custo foi adicionado ao sistema.',
    'Error creating cost center': 'Erro ao criar centro de custo',
    'Cost center updated successfully': 'Centro de custo atualizado com sucesso',
    'The cost center has been updated.': 'O centro de custo foi atualizado.',
    'Error updating cost center': 'Erro ao atualizar centro de custo',
    'Cost center deleted successfully': 'Centro de custo excluído com sucesso',
    'The cost center has been removed from the system.': 'O centro de custo foi removido do sistema.',
    'Error deleting cost center': 'Erro ao excluir centro de custo',
    'Update the cost center information below.': 'Atualize as informações do centro de custo abaixo.',
    'Add a new cost center to organize expenses by business units.': 'Adicione um novo centro de custo para organizar despesas por unidades de negócio.',
    'Unique identifier for the cost center': 'Identificador único para o centro de custo',
    'Saving...': 'Salvando...',
    'Update': 'Atualizar',
    'Create': 'Criar',
    'Cancel': 'Cancelar',
    'Active': 'Ativo',
    'Inactive': 'Inativo',

    // Departments
    'Departments': 'Departamentos',
    'Department': 'Departamento',
    'New Department': 'Novo Departamento',
    'Edit Department': 'Editar Departamento',
    'Create Department': 'Criar Departamento',
    'Department Code': 'Código do Departamento',
    'Department Name': 'Nome do Departamento',
    'Department code is required': 'Código do departamento é obrigatório',
    'Department name is required': 'Nome do departamento é obrigatório',
    'Human Resources': 'Recursos Humanos',
    'Brief description of the department purpose and scope': 'Breve descrição do propósito e escopo do departamento',
    'Manage organizational departments for tracking activities and resources across business units': 'Gerenciar departamentos organizacionais para rastrear atividades e recursos entre unidades de negócio',
    'Hierarchical structure for organizing and tracking activities by business units': 'Estrutura hierárquica para organizar e rastrear atividades por unidades de negócio',
    'Loading departments...': 'Carregando departamentos...',
    'No departments found': 'Nenhum departamento encontrado',
    'Create your first department to start organizing activities by business units.': 'Crie seu primeiro departamento para começar a organizar atividades por unidades de negócio.',
    'Are you sure you want to delete this department?': 'Tem certeza que deseja excluir este departamento?',
    'Department created successfully': 'Departamento criado com sucesso',
    'The department has been added to the system.': 'O departamento foi adicionado ao sistema.',
    'Error creating department': 'Erro ao criar departamento',
    'Department updated successfully': 'Departamento atualizado com sucesso',
    'The department has been updated.': 'O departamento foi atualizado.',
    'Error updating department': 'Erro ao atualizar departamento',
    'Department deleted successfully': 'Departamento excluído com sucesso',
    'The department has been removed from the system.': 'O departamento foi removido do sistema.',
    'Error deleting department': 'Erro ao excluir departamento',
    'Update the department information below.': 'Atualize as informações do departamento abaixo.',
    'Add a new department to organize activities by business units.': 'Adicione um novo departamento para organizar atividades por unidades de negócio.',
    'Delete Department': 'Excluir Departamento',
    'Organizational Departments': 'Departamentos Organizacionais',

    // Projects
    'Projects': 'Projetos',
    'Project': 'Projeto',
    'New Project': 'Novo Projeto',
    'Edit Project': 'Editar Projeto',
    'Create Project': 'Criar Projeto',
    'Project Code': 'Código do Projeto',
    'Project Name': 'Nome do Projeto',
    'Project code is required': 'Código do projeto é obrigatório',
    'Project name is required': 'Nome do projeto é obrigatório',
    'Start Date': 'Data de Início',
    'End Date': 'Data de Término',
    'Completion Percentage': 'Percentual de Conclusão',
    'Project Status': 'Status do Projeto',
    'Planned': 'Planejado',
    'On Hold': 'Em Espera',
    'Completed': 'Concluído',
    'Cancelled': 'Cancelado',
    'Select': 'Selecionar',
    'Loading projects...': 'Carregando projetos...',
    'No projects found': 'Nenhum projeto encontrado',
    'Create your first project to start tracking project activities and progress.': 'Crie seu primeiro projeto para começar a acompanhar atividades e progresso.',
    'Are you sure you want to delete this project?': 'Tem certeza que deseja excluir este projeto?',
    'Project created successfully': 'Projeto criado com sucesso',
    'The project has been added to the system.': 'O projeto foi adicionado ao sistema.',
    'Error creating project': 'Erro ao criar projeto',
    'Project updated successfully': 'Projeto atualizado com sucesso',
    'The project has been updated.': 'O projeto foi atualizado.',
    'Error updating project': 'Erro ao atualizar projeto',
    'Project deleted successfully': 'Projeto excluído com sucesso',
    'The project has been removed from the system.': 'O projeto foi removido do sistema.',
    'Error deleting project': 'Erro ao excluir projeto',
    'Update the project information below.': 'Atualize as informações do projeto abaixo.',
    'Add a new project to track activities and progress.': 'Adicione um novo projeto para acompanhar atividades e progresso.',
    'Project Management': 'Gestão de Projetos',
    'Manage projects for tracking activities, budgets, and progress across business initiatives': 'Gerenciar projetos para acompanhar atividades, orçamentos e progresso em iniciativas de negócio',
    'Track project progress, budgets, and deliverables': 'Acompanhar progresso, orçamentos e entregáveis de projetos',
    'Dates': 'Datas',
    'Creating...': 'Criando...',
    'Updating...': 'Atualizando...',
    'View Project Details': 'Ver Detalhes do Projeto',
    'Close': 'Fechar',
    'Search projects...': 'Buscar projetos...'
  },
  
  'en-US': {
    // Navigation
    'nav.contracts': 'Contracts',
    'nav.billing': 'Billing',
    'nav.customer_service': 'Customer Service',
    'nav.financial': 'Financial',
    'nav.tables': 'Tables',
    'nav.administration': 'Administration',
    
    // Common subsections
    'section.dashboard': 'Dashboard',
    'section.entries': 'Entries',
    'section.attendance_entries': 'Attendance - Entries',
    'section.processing': 'Processing',
    'section.reports': 'Reports',
    'section.tables': 'Tables',
    'section.partners': 'Partners',
    'section.partner_types': 'Partner Types',
    'section.address_types': 'Address Types',
    'section.addresses': 'Addresses',
    'section.entity_addresses': 'Entity Addresses',
    'section.document_types': 'Document Types',
    'section.documents': 'Documents',
    'section.entity_documents': 'Entity Documents',
    'section.general': 'General',
    'section.auxiliary': 'Auxiliary',
    
    // Financial Module sections
    'section.setup': 'Setup',
    'section.chart_of_accounts': 'Chart of Accounts',
    'section.account_types': 'Account Types',
    'section.cost_centers': 'Cost Centers',
    'section.departments': 'Departments',
    'section.projects': 'Projects',
    'section.transactions': 'Transactions',
    'section.journal_entries': 'Journal Entries',
    'section.payments': 'Payments',
    'section.receipts': 'Receipts',
    'section.transfers': 'Transfers',
    'section.accounts': 'Accounts',
    'section.accounts_receivable': 'Accounts Receivable',
    'section.accounts_payable': 'Accounts Payable',
    'section.bank_accounts': 'Bank Accounts',
    'section.bank_reconciliation': 'Bank Reconciliation',
    'section.budgets': 'Budgets',
    'section.budget_setup': 'Budget Setup',
    'section.budget_vs_actual': 'Budget vs Actual',
    'section.budget_analysis': 'Budget Analysis',
    'section.contacts': 'Contacts',
    'section.vendors': 'Vendors',
    'section.customers': 'Customers',
    'section.contact_types': 'Contact Types',
    'section.periods': 'Periods',
    'section.fiscal_years': 'Fiscal Years',
    'section.fiscal_periods': 'Fiscal Periods',
    'section.period_closing': 'Period Closing',
    'section.balance_sheet': 'Balance Sheet',
    'section.income_statement': 'Income Statement',
    'section.cash_flow': 'Cash Flow',
    'section.trial_balance': 'Trial Balance',
    'section.general_ledger': 'General Ledger',
    'section.taxes': 'Taxes',
    'section.tax_codes': 'Tax Codes',
    'section.tax_reports': 'Tax Reports',
    
    // Multi-level navigation items
    'section.batch_processing': 'Batch Processing',
    'section.validation': 'Validation',
    'section.approval': 'Approval',
    'section.financial_reports': 'Financial Reports',
    'section.operational_reports': 'Operational Reports',
    'section.analytics': 'Analytics',
    'section.partners_list': 'Partners List',
    'section.relationships': 'Relationships',
    'section.addresses_list': 'Addresses List',
    'section.documents_list': 'Documents List',
    'section.organization': 'Organization',
    'section.user_management': 'User Management',
    'section.data_tools': 'Data Tools',
    
    // SysUser specific
    'sysuser.name': 'Username',
    'sysuser.login': 'Login',
    'sysuser.email': 'Email',
    'sysuser.password': 'Password',
    'sysuser.firstName': 'First Name',
    'sysuser.lastName': 'Last Name',
    'sysuser.isAdmin': 'Administrator',
    'sysuser.active': 'Active',
    'sysuser.twoFactorEnabled': '2FA Enabled',
    'sysuser.lastLogin': 'Last Login',
    
    // Partner specific
    'partner.code': 'Partner Code',
    'partner.name': 'Partner Name',
    'partner.legalName': 'Legal Name',
    'partner.taxId': 'Tax ID',
    'partner.type': 'Partner Type',
    'partner.phone': 'Phone',
    'partner.email': 'Email',
    'partner.website': 'Website',
    'partner.contact': 'Primary Contact',
    'partner.notes': 'Notes',
    'partner.isCustomer': 'Customer',
    'partner.isVendor': 'Vendor',
    'partner.isCollector': 'Collector',
    'partner.isEmployee': 'Employee',
    'partner.isAccredited': 'Accredited',
    
    // Administration specific
    'section.programs': 'Programs',
    'section.groups': 'Groups',
    'section.companies': 'Companies',
    'section.units': 'Units',
    'section.users': 'Users',
    'section.user_monitoring': 'User Monitoring',
    'section.data_import': 'Data Import',
    'section.database_explorer': 'Database Explorer',
    'section.sql_panel': 'SQL Panel',
    'section.preferences': 'Preferences',
    'section.batch_management': 'Batch Management',
    
    // Common actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.create': 'Create',
    'action.search': 'Search',
    'action.export': 'Export',
    'action.import': 'Import',
    
    // Contract specific
    'contract.title': 'Contracts',
    'contract.number': 'Contract Number',
    'contract.type': 'Contract Type',
    'contract.start_date': 'Start Date',
    'contract.end_date': 'End Date',
    'contract.status': 'Status',
    'contract.client': 'Client',
    'contract.save_button': 'Save Contract',
    'contract.cancel_button': 'Cancel',
    
    // Beneficiary specific
    'beneficiary.title': 'Beneficiaries',
    'beneficiary.name': 'Name',
    'beneficiary.relationship': 'Relationship',
    'beneficiary.birth_date': 'Birth Date',
    'beneficiary.primary': 'Primary',
    'beneficiary.status': 'Status',
    
    // Charges specific
    'charge.title': 'Charges',
    'charge.amount': 'Amount',
    'charge.due_date': 'Due Date',
    'charge.payment_date': 'Payment Date',
    'charge.status': 'Status',
    'charge.reference': 'Reference',
    
    // Common labels
    'label.name': 'Name',
    'label.email': 'Email',
    'label.phone': 'Phone',
    'label.address': 'Address',
    'label.date': 'Date',
    'label.amount': 'Amount',
    'label.status': 'Status',
    'label.description': 'Description',
    'label.active': 'Active',
    'label.inactive': 'Inactive',
    
    // Messages
    'message.save_success': 'Saved successfully!',
    'message.save_error': 'Error saving. Please try again.',
    'message.delete_success': 'Deleted successfully!',
    'message.delete_error': 'Error deleting. Please try again.',
    'message.loading': 'Loading...',
    'message.no_data': 'No data found.',
    'message.confirm_delete': 'Are you sure you want to delete this item?',

    // Contract Tables
    'contract_tables.performed_services': 'Performed Services',
    'contract_tables.performed_services_desc': 'Manage executed services and service types',
    'contract_tables.group_batches': 'Group Batches',
    'contract_tables.group_batches_desc': 'Configure contract groups for billing and proration',
    'contract_tables.classes': 'Classes',
    'contract_tables.classes_desc': 'Define contract classes with values and conditions',
    'contract_tables.charges': 'Charges',
    'contract_tables.charges_desc': 'Manage contract charges and prorated services',
    'contract_tables.prorated_services': 'Prorated Services',
    'contract_tables.subtitle': 'Management of auxiliary tables for the contracts module',
    'contract_tables.management': 'Table Management',
    'contract_tables.configuration': 'Table Configuration',

    // Cost Centers
    'Cost Centers': 'Cost Centers',
    'Cost Center': 'Cost Center',
    'New Cost Center': 'New Cost Center',
    'Edit Cost Center': 'Edit Cost Center',
    'Create Cost Center': 'Create Cost Center',
    'Cost Center Code': 'Cost Center Code',
    'Cost Center Name': 'Cost Center Name',
    'Cost center code is required': 'Cost center code is required',
    'Cost center name is required': 'Cost center name is required',
    'Hierarchy Level': 'Hierarchy Level',
    'Level in the cost center hierarchy (1-10)': 'Level in the cost center hierarchy (1-10)',
    'Manager Name': 'Manager Name',
    'Person responsible for this cost center': 'Person responsible for this cost center',
    'Annual Budget': 'Annual Budget',
    'Annual budget allocation for this cost center': 'Annual budget allocation for this cost center',
    'Marketing Department': 'Marketing Department',
    'John Smith': 'John Smith',
    'Brief description of the cost center purpose and scope': 'Brief description of the cost center purpose and scope',
    'Manage cost centers for tracking expenses and budgets across departments and projects': 'Manage cost centers for tracking expenses and budgets across departments and projects',
    'Hierarchical structure for organizing and tracking costs by business units': 'Hierarchical structure for organizing and tracking costs by business units',
    'Loading cost centers...': 'Loading cost centers...',
    'No cost centers found': 'No cost centers found',
    'Create your first cost center to start organizing expenses by business units.': 'Create your first cost center to start organizing expenses by business units.',
    'Code': 'Code',
    'Name': 'Name',
    'Manager': 'Manager',
    'Budget': 'Budget',
    'Level': 'Level',
    'Actions': 'Actions',
    'Are you sure you want to delete this cost center?': 'Are you sure you want to delete this cost center?',
    'Cost center created successfully': 'Cost center created successfully',
    'The cost center has been added to the system.': 'The cost center has been added to the system.',
    'Error creating cost center': 'Error creating cost center',
    'Cost center updated successfully': 'Cost center updated successfully',
    'The cost center has been updated.': 'The cost center has been updated.',
    'Error updating cost center': 'Error updating cost center',
    'Cost center deleted successfully': 'Cost center deleted successfully',
    'The cost center has been removed from the system.': 'The cost center has been removed from the system.',
    'Error deleting cost center': 'Error deleting cost center',
    'Update the cost center information below.': 'Update the cost center information below.',
    'Add a new cost center to organize expenses by business units.': 'Add a new cost center to organize expenses by business units.',
    'Unique identifier for the cost center': 'Unique identifier for the cost center',
    'Saving...': 'Saving...',
    'Update': 'Update',
    'Create': 'Create',
    'Cancel': 'Cancel',
    'Active': 'Active',
    'Inactive': 'Inactive',

    // Departments
    'Departments': 'Departments',
    'Department': 'Department',
    'New Department': 'New Department',
    'Edit Department': 'Edit Department',
    'Create Department': 'Create Department',
    'Department Code': 'Department Code',
    'Department Name': 'Department Name',
    'Department code is required': 'Department code is required',
    'Department name is required': 'Department name is required',
    'Human Resources': 'Human Resources',
    'Brief description of the department purpose and scope': 'Brief description of the department purpose and scope',
    'Manage organizational departments for tracking activities and resources across business units': 'Manage organizational departments for tracking activities and resources across business units',
    'Hierarchical structure for organizing and tracking activities by business units': 'Hierarchical structure for organizing and tracking activities by business units',
    'Loading departments...': 'Loading departments...',
    'No departments found': 'No departments found',
    'Create your first department to start organizing activities by business units.': 'Create your first department to start organizing activities by business units.',
    'Are you sure you want to delete this department?': 'Are you sure you want to delete this department?',
    'Department created successfully': 'Department created successfully',
    'The department has been added to the system.': 'The department has been added to the system.',
    'Error creating department': 'Error creating department',
    'Department updated successfully': 'Department updated successfully',
    'The department has been updated.': 'The department has been updated.',
    'Error updating department': 'Error updating department',
    'Department deleted successfully': 'Department deleted successfully',
    'The department has been removed from the system.': 'The department has been removed from the system.',
    'Error deleting department': 'Error deleting department',
    'Update the department information below.': 'Update the department information below.',
    'Add a new department to organize activities by business units.': 'Add a new department to organize activities by business units.',
    'Delete Department': 'Delete Department',
    'Organizational Departments': 'Organizational Departments',

    // Projects
    'Projects': 'Projects',
    'Project': 'Project',
    'New Project': 'New Project',
    'Edit Project': 'Edit Project',
    'Create Project': 'Create Project',
    'Project Code': 'Project Code',
    'Project Name': 'Project Name',
    'Project code is required': 'Project code is required',
    'Project name is required': 'Project name is required',
    'Start Date': 'Start Date',
    'End Date': 'End Date',
    'Completion Percentage': 'Completion Percentage',
    'Project Status': 'Project Status',
    'Planned': 'Planned',
    'On Hold': 'On Hold',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled',
    'Select': 'Select',
    'Loading projects...': 'Loading projects...',
    'No projects found': 'No projects found',
    'Create your first project to start tracking project activities and progress.': 'Create your first project to start tracking project activities and progress.',
    'Are you sure you want to delete this project?': 'Are you sure you want to delete this project?',
    'Project created successfully': 'Project created successfully',
    'The project has been added to the system.': 'The project has been added to the system.',
    'Error creating project': 'Error creating project',
    'Project updated successfully': 'Project updated successfully',
    'The project has been updated.': 'The project has been updated.',
    'Error updating project': 'Error updating project',
    'Project deleted successfully': 'Project deleted successfully',
    'The project has been removed from the system.': 'The project has been removed from the system.',
    'Error deleting project': 'Error deleting project',
    'Update the project information below.': 'Update the project information below.',
    'Add a new project to track activities and progress.': 'Add a new project to track activities and progress.',
    'Project Management': 'Project Management',
    'Manage projects for tracking activities, budgets, and progress across business initiatives': 'Manage projects for tracking activities, budgets, and progress across business initiatives',
    'Track project progress, budgets, and deliverables': 'Track project progress, budgets, and deliverables',
    'Dates': 'Dates',
    'Creating...': 'Creating...',
    'Updating...': 'Updating...',
    'View Project Details': 'View Project Details',
    'Close': 'Close',
    'Search projects...': 'Search projects...'
  }
};

let currentLanguage: Language = 'pt-BR';

export function setLanguage(language: Language) {
  currentLanguage = language;
}

export function getCurrentLanguage(): Language {
  return currentLanguage;
}

export function t(key: string): string {
  const typedKey = key as keyof Translations;
  return translations[currentLanguage][typedKey] || key;
}

export function getTranslations(language: Language): Translations {
  return translations[language];
}