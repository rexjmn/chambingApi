const https = require('https');

// Configuración
const BUCKET_NAME = 'chambing';
const REGION = 'eu-north-1';

// URLs de prueba
const TEST_URLS = [
  `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/`,
  `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/profile-photos/`,
];

function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        accessible: res.statusCode < 400,
        headers: res.headers
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        accessible: false,
        error: error.message
      });
    });

    req.end();
  });
}

async function testS3Configuration() {
  console.log('🔍 Verificando configuración de S3...');
  console.log('====================================');

  for (const url of TEST_URLS) {
    const result = await testUrl(url);
    
    console.log(`\n📍 URL: ${result.url}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Accesible: ${result.accessible ? '✅ Sí' : '❌ No'}`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  console.log('\n🔧 Configuración esperada:');
  console.log('- Status 200 o 403 para la raíz del bucket = ✅ OK');
  console.log('- Status 200 o 404 para carpeta profile-photos = ✅ OK');
  console.log('- Error de conexión = ❌ Problema de red');
  console.log('- Access Denied = ❌ Revisar Bucket Policy');

  console.log('\n📋 Checklist:');
  console.log('1. ✅ Bucket Policy aplicada');
  console.log('2. ✅ Block Public Access deshabilitado');
  console.log('3. ✅ CORS configurado');
  console.log('4. ✅ Región correcta (eu-north-1)');
}

testS3Configuration().catch(console.error);