import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';
import { User } from '../../modules/users/entities/user.entity';
import { CategoriaServicio } from '../../modules/services/entities/categoria-servicio.entity';
import { TarifaCategoria } from '../../modules/services/entities/tarifa-categoria.entity';
import { RolAdministrativo } from '../../modules/roles/entities/rol-administrativo.entity';
import * as bcrypt from 'bcrypt';

export async function initialSeed(dataSource: DataSource) {
  try {
    console.log('Iniciando proceso de seed...');
    
    // Definición de datos iniciales para roles del sistema
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

    // Definición de datos iniciales para categorías de servicios
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

    // Contadores para seguimiento de entidades creadas
    let rolesCreados = 0;
    let categoriasCreadas = 0;
    let tarifasCreadas = 0;

    // Inicialización de repositorios
    const roleRepo = dataSource.getRepository(Role);
    const userRepo = dataSource.getRepository(User);
    const rolAdminRepo = dataSource.getRepository(RolAdministrativo);
    const categoriaRepo = dataSource.getRepository(CategoriaServicio);
    const tarifaRepo = dataSource.getRepository(TarifaCategoria);

    // 1. Creación de roles
    console.log('Verificando y creando roles...');
    const roles: Role[] = [];
    for (const roleData of rolesData) {
      let role = await roleRepo.findOne({ where: { nombre: roleData.nombre } });
      
      if (!role) {
        console.log(`Creando rol: ${roleData.nombre}`);
        role = new Role();
        Object.assign(role, roleData);
        role = await roleRepo.save(role);
        rolesCreados++;
      } else {
        console.log(`El rol ${roleData.nombre} ya existe`);
      }
      
      roles.push(role);
    }

    // 2. Creación de usuario super admin
    console.log('Verificando usuario super admin...');
    let superAdmin = await userRepo.findOne({ 
      where: { email: 'admin@example.com' } 
    });

    if (!superAdmin) {
      console.log('Creando usuario super admin...');
      const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);
      
      superAdmin = new User();
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

      // Asignación de rol super_admin al usuario
      console.log('Asignando rol super_admin...');
      const rolAdmin = new RolAdministrativo();
      Object.assign(rolAdmin, {
        usuario: { id: superAdmin.id },
        rol: { id: roles[0].id },
        asignadoPor: { id: superAdmin.id },
        activo: true
      });
      await rolAdminRepo.save(rolAdmin);
    } else {
      console.log('El usuario super admin ya existe');
    }

    // 3. Creación de categorías
    console.log('Verificando y creando categorías de servicios...');
    const categorias: CategoriaServicio[] = [];
    for (const catData of categoriasData) {
      let categoria = await categoriaRepo.findOne({ 
        where: { nombre: catData.nombre } 
      });

      if (!categoria) {
        console.log(`Creando categoría: ${catData.nombre}`);
        categoria = new CategoriaServicio();
        Object.assign(categoria, catData);
        categoria = await categoriaRepo.save(categoria);
        categoriasCreadas++;
      } else {
        console.log(`La categoría ${catData.nombre} ya existe`);
      }

      categorias.push(categoria);
    }

    // 4. Creación de tarifas para cada categoría
    console.log('Verificando y creando tarifas base...');
    for (const categoria of categorias) {
      // Creación de tarifa por hora
      const existingHourlyRate = await tarifaRepo.findOne({
        where: {
          categoria: { id: categoria.id },
          tipoTarifa: 'hora'
        }
      });

      if (!existingHourlyRate) {
        console.log(`Creando tarifa por hora para ${categoria.nombre}`);
        const tarifaHora = new TarifaCategoria();
        Object.assign(tarifaHora, {
          categoria: { id: categoria.id },
          tipoTarifa: 'hora',
          monto: 5.00,
          unidad: 'USD/hora'
        });
        await tarifaRepo.save(tarifaHora);
        tarifasCreadas++;
      }

      // Creación de tarifa por día
      const existingDailyRate = await tarifaRepo.findOne({
        where: {
          categoria: { id: categoria.id },
          tipoTarifa: 'dia'
        }
      });

      if (!existingDailyRate) {
        console.log(`Creando tarifa por día para ${categoria.nombre}`);
        const tarifaDia = new TarifaCategoria();
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

  } catch (error) {
    console.error('Error durante el proceso de seed:', error);
    throw error;
  }
}