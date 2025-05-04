// Script untuk mendaftarkan Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Daftarkan Service Worker dengan path yang benar
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker terdaftar dengan scope:', registration.scope);
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Status Service Worker baru:', newWorker.state);
          
          newWorker.addEventListener('statechange', () => {
            console.log('Status Service Worker berubah menjadi:', newWorker.state);
          });
        });
      })
      .catch(error => {
        console.error('Pendaftaran Service Worker gagal:', error);
      });
    
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Controller Service Worker berubah');
    });
  });
  
  function checkForUpdates() {
    navigator.serviceWorker.getRegistration().then(registration => {
      if (registration) {
        registration.update();
        console.log('Memeriksa pembaruan Service Worker');
      }
    });
  }
  
  setInterval(checkForUpdates, 60 * 60 * 1000);
  
  function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.style.position = 'fixed';
    updateBanner.style.bottom = '20px';
    updateBanner.style.left = '20px';
    updateBanner.style.backgroundColor = 'var(--accent-color)';
    updateBanner.style.color = 'white';
    updateBanner.style.padding = '15px 20px';
    updateBanner.style.borderRadius = '8px';
    updateBanner.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    updateBanner.style.zIndex = '1000';
    updateBanner.style.display = 'flex';
    updateBanner.style.alignItems = 'center';
    updateBanner.style.justifyContent = 'space-between';
    updateBanner.style.maxWidth = '300px';
    
    updateBanner.innerHTML = `
      <div>
        <strong>Update Tersedia!</strong>
        <p style="margin: 5px 0 0 0; font-size: 0.9rem;">Refresh halaman untuk melihat konten terbaru.</p>
      </div>
      <button style="background: white; color: var(--accent-color); border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-left: 10px;">Refresh</button>
    `;
    
    document.body.appendChild(updateBanner);
    
    updateBanner.querySelector('button').addEventListener('click', () => {
      window.location.reload();
    });
  }
  
  navigator.serviceWorker.addEventListener('message', event => {
    console.log('Pesan diterima dari Service Worker:', event.data);
    
    if (event.data === 'NEW_VERSION_AVAILABLE') {
      showUpdateNotification();
    }
  });
}

// Deteksi saat aplikasi online/offline
window.addEventListener('online', () => {
  console.log('Aplikasi online');
  document.body.classList.remove('offline-mode');
});

window.addEventListener('offline', () => {
  console.log('Aplikasi offline');
  document.body.classList.add('offline-mode');
});