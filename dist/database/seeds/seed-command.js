"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const initial_seed_1 = require("./initial-seed");
async function runSeed() {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log('🚀 Conexión a la base de datos establecida');
        console.log('📦 Iniciando seed de la base de datos...');
        const result = await (0, initial_seed_1.initialSeed)(data_source_1.AppDataSource);
        console.log('✅ Seed completado exitosamente');
        console.log('Resumen:');
        console.log(`- Roles creados: ${result.rolesCreated}`);
        console.log(`- Categorías creadas: ${result.categoriesCreated}`);
        console.log(`- Tarifas creadas: ${result.tariffsCreated}`);
    }
    catch (error) {
        console.error('❌ Error durante el seed:', error);
        throw error;
    }
    finally {
        await data_source_1.AppDataSource.destroy();
    }
}
runSeed()
    .then(() => {
    console.log('🏁 Proceso de seed finalizado');
    process.exit(0);
})
    .catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
});
//# sourceMappingURL=seed-command.js.map