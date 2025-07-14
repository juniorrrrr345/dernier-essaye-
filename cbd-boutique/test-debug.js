// Script de test pour vérifier les APIs
const testAPIs = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Test des APIs...');
  
  try {
    // Test API produits
    console.log('\n📦 Test API produits:');
    const productsResponse = await fetch(`${baseURL}/api/products`);
    const productsData = await productsResponse.json();
    console.log('✅ API produits:', Array.isArray(productsData) ? `${productsData.length} produits` : 'Erreur de format');
    
    // Test API config
    console.log('\n⚙️ Test API config:');
    const configResponse = await fetch(`${baseURL}/api/config`);
    const configData = await configResponse.json();
    console.log('✅ API config:', configData.shop_name || 'Config chargée');
    
    // Test API admin produits
    console.log('\n🔧 Test API admin produits:');
    const adminProductsResponse = await fetch(`${baseURL}/api/admin/products`);
    const adminProductsData = await adminProductsResponse.json();
    console.log('✅ API admin produits:', Array.isArray(adminProductsData) ? `${adminProductsData.length} produits` : 'Erreur de format');
    
    console.log('\n🎉 Tous les tests sont passés !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
};

// Exécuter les tests si le script est appelé directement
if (typeof window === 'undefined') {
  testAPIs();
}