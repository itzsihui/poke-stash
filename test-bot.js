// Test script to verify bot connection
const BOT_TOKEN = '8061583959:AAFCVsFXKKWAyrLCVHZbzPsY_sGQ1gj7v6w';

async function testBot() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const data = await response.json();
    
    if (data.ok) {
      console.log('✅ Bot connected successfully!');
      console.log('Bot info:', data.result);
      console.log('Bot username:', data.result.username);
      console.log('Bot name:', data.result.first_name);
    } else {
      console.log('❌ Bot connection failed:', data.description);
    }
  } catch (error) {
    console.log('❌ Error testing bot:', error);
  }
}

// Run the test
testBot();
