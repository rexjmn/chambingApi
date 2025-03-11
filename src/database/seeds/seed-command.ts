import { AppDataSource } from '../data-source';
import { initialSeed } from './initial-seed';

async function runSeed() {
  try {
    // Inicializar la conexión
    await AppDataSource.initialize();
    console.log('🚀 Conexión a la base de datos establecida');

    // Ejecutar el seed
    console.log('📦 Iniciando seed de la base de datos...');
    const result = await initialSeed(AppDataSource);

    // Mostrar resultados
    console.log('✅ Seed completado exitosamente');
    console.log('Resumen:');
    console.log(`- Roles creados: ${result.rolesCreated}`);
    console.log(`- Categorías creadas: ${result.categoriesCreated}`);
    console.log(`- Tarifas creadas: ${result.tariffsCreated}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    // Cerrar la conexión
    await AppDataSource.destroy();
  }
}

// Ejecutar el seed
runSeed()
  .then(() => {
    console.log('🏁 Proceso de seed finalizado');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });