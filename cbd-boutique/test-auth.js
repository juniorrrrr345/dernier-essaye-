const bcrypt = require('bcryptjs');

// Test du hash du mot de passe
async function testPassword() {
  const password = 'admin123';
  const hash = '$2b$10$uh8OTKJhC9X5A7s5RoD7kuRJtQeb8Qbqimv4q65GK7CXge5NR2ucW';
  
  console.log('🔐 Test d\'authentification...');
  console.log('Mot de passe:', password);
  console.log('Hash stocké:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('✅ Mot de passe valide:', isValid);
  
  if (isValid) {
    console.log('🎉 L\'authentification fonctionne !');
    console.log('📝 Utilisez "admin123" pour vous connecter au panel admin');
  } else {
    console.log('❌ L\'authentification ne fonctionne pas');
  }
}

testPassword();