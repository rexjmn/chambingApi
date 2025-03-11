"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialSeed = initialSeed;
const role_entity_1 = require("../../modules/roles/entities/role.entity");
const user_entity_1 = require("../../modules/users/entities/user.entity");
const categoria_servicio_entity_1 = require("../../modules/services/entities/categoria-servicio.entity");
const tarifa_categoria_entity_1 = require("../../modules/services/entities/tarifa-categoria.entity");
const rol_administrativo_entity_1 = require("../../modules/roles/entities/rol-administrativo.entity");
const bcrypt = require("bcrypt");
async function initialSeed(dataSource) {
    try {
        console.log('Iniciando proceso de seed...');
        const rolesData = [
            {
                nombre: 'super_admin',
                descripcion: 'Administrador con acceso total al sistema',
                nivelAcceso: 100,
                permisos: {
                    users: ['create', 'read', 'update', 'delete'],
                    roles: ['create', 'read', 'update', 'delete'],
                    services: ['create', 'read', 'update', 'delete'],
                    documents: ['create', 'read', 'update', 'delete']
                }
            },
            {
                nombre: 'admin',
                descripcion: 'Administrador con acceso limitado',
                nivelAcceso: 80,
                permisos: {
                    users: ['read', 'update'],
                    roles: ['read'],
                    services: ['create', 'read', 'update'],
                    documents: ['read', 'update']
                }
            },
            {
                nombre: 'verificador',
                descripcion: 'Usuario que verifica documentos',
                nivelAcceso: 60,
                permisos: {
                    documents: ['read', 'update'],
                    users: ['read']
                }
            }
        ];
        const categoriasData = [
            {
                nombre: 'Limpieza Doméstica',
                descripcion: 'Servicios de limpieza para hogares',
                requisitosDocumentos: {
                    requeridos: ['DUI', 'Antecedentes Penales'],
                    opcionales: ['Referencias Laborales']
                },
                activo: true
            },
            {
                nombre: 'Jardinería',
                descripcion: 'Mantenimiento de jardines y áreas verdes',
                requisitosDocumentos: {
                    requeridos: ['DUI'],
                    opcionales: ['Certificaciones de Jardinería']
                },
                activo: true
            },
            {
                nombre: 'Construcción',
                descripcion: 'Servicios de construcción y remodelación',
                requisitosDocumentos: {
                    requeridos: ['DUI', 'Antecedentes Penales', 'Seguro de Riesgos'],
                    opcionales: ['Certificaciones Técnicas']
                },
                activo: true
            }
        ];
        let rolesCreados = 0;
        let categoriasCreadas = 0;
        let tarifasCreadas = 0;
        const roleRepo = dataSource.getRepository(role_entity_1.Role);
        const userRepo = dataSource.getRepository(user_entity_1.User);
        const rolAdminRepo = dataSource.getRepository(rol_administrativo_entity_1.RolAdministrativo);
        const categoriaRepo = dataSource.getRepository(categoria_servicio_entity_1.CategoriaServicio);
        const tarifaRepo = dataSource.getRepository(tarifa_categoria_entity_1.TarifaCategoria);
        console.log('Verificando y creando roles...');
        const roles = [];
        for (const roleData of rolesData) {
            let role = await roleRepo.findOne({ where: { nombre: roleData.nombre } });
            if (!role) {
                console.log(`Creando rol: ${roleData.nombre}`);
                role = new role_entity_1.Role();
                Object.assign(role, roleData);
                role = await roleRepo.save(role);
                rolesCreados++;
            }
            else {
                console.log(`El rol ${roleData.nombre} ya existe`);
            }
            roles.push(role);
        }
        console.log('Verificando usuario super admin...');
        let superAdmin = await userRepo.findOne({
            where: { email: 'admin@example.com' }
        });
        if (!superAdmin) {
            console.log('Creando usuario super admin...');
            const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);
            superAdmin = new user_entity_1.User();
            Object.assign(superAdmin, {
                email: 'admin@example.com',
                password: hashedPassword,
                nombre: 'Super',
                apellido: 'Admin',
                tipo_usuario: 'admin',
                activo: true,
                telefono: null,
                direccion: null,
                dui: null,
                foto_perfil: null,
                tipo_foto_perfil: null
            });
            superAdmin = await userRepo.save(superAdmin);
            console.log('Asignando rol super_admin...');
            const rolAdmin = new rol_administrativo_entity_1.RolAdministrativo();
            Object.assign(rolAdmin, {
                usuario: { id: superAdmin.id },
                rol: { id: roles[0].id },
                asignadoPor: { id: superAdmin.id },
                activo: true
            });
            await rolAdminRepo.save(rolAdmin);
        }
        else {
            console.log('El usuario super admin ya existe');
        }
        console.log('Verificando y creando categorías de servicios...');
        const categorias = [];
        for (const catData of categoriasData) {
            let categoria = await categoriaRepo.findOne({
                where: { nombre: catData.nombre }
            });
            if (!categoria) {
                console.log(`Creando categoría: ${catData.nombre}`);
                categoria = new categoria_servicio_entity_1.CategoriaServicio();
                Object.assign(categoria, catData);
                categoria = await categoriaRepo.save(categoria);
                categoriasCreadas++;
            }
            else {
                console.log(`La categoría ${catData.nombre} ya existe`);
            }
            categorias.push(categoria);
        }
        console.log('Verificando y creando tarifas base...');
        for (const categoria of categorias) {
            const existingHourlyRate = await tarifaRepo.findOne({
                where: {
                    categoria: { id: categoria.id },
                    tipoTarifa: 'hora'
                }
            });
            if (!existingHourlyRate) {
                console.log(`Creando tarifa por hora para ${categoria.nombre}`);
                const tarifaHora = new tarifa_categoria_entity_1.TarifaCategoria();
                Object.assign(tarifaHora, {
                    categoria: { id: categoria.id },
                    tipoTarifa: 'hora',
                    monto: 5.00,
                    unidad: 'USD/hora'
                });
                await tarifaRepo.save(tarifaHora);
                tarifasCreadas++;
            }
            const existingDailyRate = await tarifaRepo.findOne({
                where: {
                    categoria: { id: categoria.id },
                    tipoTarifa: 'dia'
                }
            });
            if (!existingDailyRate) {
                console.log(`Creando tarifa por día para ${categoria.nombre}`);
                const tarifaDia = new tarifa_categoria_entity_1.TarifaCategoria();
                Object.assign(tarifaDia, {
                    categoria: { id: categoria.id },
                    tipoTarifa: 'dia',
                    monto: 35.00,
                    unidad: 'USD/día'
                });
                await tarifaRepo.save(tarifaDia);
                tarifasCreadas++;
            }
        }
        console.log('Seed completado exitosamente');
        return {
            rolesCreated: rolesCreados,
            categoriesCreated: categoriasCreadas,
            tariffsCreated: tarifasCreadas
        };
    }
    catch (error) {
        console.error('Error durante el proceso de seed:', error);
        throw error;
    }
}
//# sourceMappingURL=initial-seed.js.map