const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  // Mot de passe par défaut pour la démo
  const password = 'admin123';
  
  console.log('🔐 Génération du hash pour le mot de passe administrateur...\n');
  
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ Hash généré avec succès !');
    console.log('📋 Copiez cette valeur dans votre fichier .env.local :');
    console.log('');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('');
    console.log(`🔑 Mot de passe: ${password}`);
    console.log('⚠️  Changez ce mot de passe en production !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du hash:', error);
  }
}

generatePasswordHash();