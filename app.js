const app = {
  activeTab: 'beranda',
  showSearch: false,
  quran: [],
  currentSurah: null,
  doaList: [],
  murotalList: [],
  jadwal: {},
  cityName: 'Memuat lokasi...',
  checklist: [
    { id: 1, name: 'Sholat Subuh', description: 'Sholat wajib 2 rakaat', icon: '🌅', done: false },
    { id: 2, name: 'Sholat Dzuhur', description: 'Sholat wajib 4 rakaat', icon: '☀️', done: false },
    { id: 3, name: 'Sholat Ashar', description: 'Sholat wajib 4 rakaat', icon: '🌤️', done: false },
    { id: 4, name: 'Sholat Maghrib', description: 'Sholat wajib 3 rakaat', icon: '🌆', done: false },
    { id: 5, name: 'Sholat Isya', description: 'Sholat wajib 4 rakaat', icon: '🌙', done: false },
    { id: 6, name: 'Dzikir Pagi', description: 'Dzikir setelah subuh', icon: '📿', done: false },
    { id: 7, name: 'Dzikir Sore', description: 'Dzikir setelah ashar', icon: '📿', done: false },
    { id: 8, name: 'Baca Al-Quran', description: 'Minimal 1 halaman', icon: '📖', done: false },
    { id: 9, name: 'Sedekah', description: 'Berbagi kepada yang membutuhkan', icon: '💝', done: false },
    { id: 10, name: 'Doa Malam', description: 'Doa sebelum tidur', icon: '🌛', done: false }
  ],

  async init() {
    console.log('🚀 BarakahKu - Memulai aplikasi...');
    await this.loadQuran();
    this.loadDoa();
    this.loadJadwal();
    this.loadChecklist();
    await this.loadMurotalList();
    this.registerServiceWorker();
    console.log('✅ Aplikasi siap digunakan');
  },

  // Load daftar 114 surah dari API
  async loadQuran() {
    try {
      console.log('📖 Memuat daftar surah...');
      const res = await fetch('https://equran.id/api/v2/surat');
      const data = await res.json();
      this.quran = data.data.map(s => ({
        nomor: s.nomor,
        namaLatin: s.namaLatin,
        arti: s.arti,
        jumlahAyat: s.jumlahAyat
      }));
      console.log(`✅ ${this.quran.length} surah berhasil dimuat`);
    } catch (err) {
      console.error('❌ Gagal memuat Quran:', err);
    }
  },

  // Load detail surah dengan semua ayat
  async loadSurah(nomor) {
    try {
      console.log(`📖 Membuka surah nomor ${nomor}...`);
      const res = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
      const data = await res.json();
      this.currentSurah = {
        namaLatin: data.data.namaLatin,
        ayat: data.data.ayat.map(a => ({
          nomorAyat: a.nomorAyat,
          arab: a.teksArab,
          latin: a.teksLatin,
          teks: a.teksIndonesia
        }))
      };
      localStorage.setItem('lastRead', nomor);
      console.log(`✅ Surah ${data.data.namaLatin} berhasil dimuat`);
      
      // Scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('❌ Gagal memuat surah:', err);
    }
  },

  // Load doa-doa harian
  loadDoa() {
    console.log('🙏 Memuat doa-doa harian...');
    this.doaList = [
      {
        id: 1,
        judul: 'Doa Sebelum Makan',
        arab: 'بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ',
        latin: 'Bismillahi wa \'ala barakatillah',
        terjemah: 'Dengan menyebut nama Allah dan atas berkah Allah'
      },
      {
        id: 2,
        judul: 'Doa Sesudah Makan',
        arab: 'اَلْحَمْدُ ِللهِ الَّذِىْ اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ',
        latin: 'Alhamdulillahilladzi ath\'amana wasaqona waja\'alana muslimin',
        terjemah: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami muslim'
      },
      {
        id: 3,
        judul: 'Doa Bangun Tidur',
        arab: 'اَلْحَمْدُ ِللهِ الَّذِيْ اَحْيَانَا بَعْدَمَآ اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ',
        latin: 'Alhamdu lillahil ladzi ahyana ba\'da ma amatana wa ilaihin nusyur',
        terjemah: 'Segala puji bagi Allah yang telah menghidupkan kami sesudah kami mati dan hanya kepada-Nya kami kembali'
      },
      {
        id: 4,
        judul: 'Doa Sebelum Tidur',
        arab: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        latin: 'Bismika Allahumma amuutu wa ahyaa',
        terjemah: 'Dengan nama-Mu ya Allah aku mati dan aku hidup'
      },
      {
        id: 5,
        judul: 'Doa Masuk Kamar Mandi',
        arab: 'اَللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
        latin: 'Allahumma inni a\'udzu bika minal khubutsi wal khaba\'its',
        terjemah: 'Ya Allah, aku berlindung kepada-Mu dari godaan setan laki-laki dan perempuan'
      },
      {
        id: 6,
        judul: 'Doa Keluar Kamar Mandi',
        arab: 'غُفْرَانَكَ',
        latin: 'Ghufraanaka',
        terjemah: 'Aku mohon ampunan-Mu'
      },
      {
        id: 7,
        judul: 'Doa Masuk Masjid',
        arab: 'اَللَّهُمَّ افْتَحْ لِيْ أَبْوَابَ رَحْمَتِكَ',
        latin: 'Allahummaftah lii abwaaba rahmatika',
        terjemah: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu'
      },
      {
        id: 8,
        judul: 'Doa Keluar Masjid',
        arab: 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        latin: 'Allahumma inni as\'aluka min fadhlika',
        terjemah: 'Ya Allah, sesungguhnya aku mohon kepada-Mu dari karunia-Mu'
      },
      {
        id: 9,
        judul: 'Doa Memakai Pakaian',
        arab: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ كَسَانِيْ هَذَا وَرَزَقَنِيْهِ مِنْ غَيْرِ حَوْلٍ مِنِّيْ وَلاَ قُوَّةٍ',
        latin: 'Alhamdu lillahil ladzi kasani hadza wa razaqanihi min ghairi haulin minni wa laa quwwata',
        terjemah: 'Segala puji bagi Allah yang memberi aku pakaian ini dan memberi rizki kepadaku tanpa daya dan kekuatan dariku'
      },
      {
        id: 10,
        judul: 'Doa Ketika Turun Hujan',
        arab: 'اَللَّهُمَّ صَيِّبًا نَافِعًا',
        latin: 'Allahumma shayyiban naafi\'aa',
        terjemah: 'Ya Allah, turunkanlah hujan yang bermanfaat'
      }
    ];
    console.log(`✅ ${this.doaList.length} doa berhasil dimuat`);
  },

  // Load daftar murottal dari API - 114 Surah Lengkap
  async loadMurotalList() {
    try {
      console.log('🎵 Memuat daftar murottal...');
      const res = await fetch('https://equran.id/api/v2/surat');
      const data = await res.json();
      
      // Ambil SEMUA 114 surah dengan audio lengkap
      this.murotalList = data.data.map(s => {
        // Pastikan audio URL valid
        let audioUrl = '';
        if (s.audioFull && s.audioFull['05']) {
          audioUrl = s.audioFull['05'];
        } else if (s.audioFull && s.audioFull['01']) {
          audioUrl = s.audioFull['01'];
        }
        
        return {
          id: s.nomor,
          nomor: s.nomor,
          judul: s.namaLatin + ' - ' + s.nama,
          qari: 'Mishari Rashid Al-Afasy',
          audio: audioUrl
        };
      });
      
      console.log(`✅ ${this.murotalList.length} murottal berhasil dimuat`);
    } catch (err) {
      console.error('❌ Gagal memuat murottal:', err);
      this.murotalList = [];
    }
  },

  // Load jadwal sholat berdasarkan kota dari GPS
  async loadJadwal() {
    if (!navigator.geolocation) {
      this.cityName = 'Lokasi tidak tersedia';
      console.warn('⚠️ Geolocation tidak didukung browser');
      return;
    }
    
    console.log('📍 Mendapatkan lokasi...');
    this.cityName = 'Mendapatkan lokasi...';
    
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      console.log(`📍 Lokasi: ${latitude}, ${longitude}`);
      
      try {
        // Get city name from reverse geocoding
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const geoData = await geoRes.json();
        
        // Ambil nama kota/kabupaten
        this.cityName = geoData.address.city || 
                       geoData.address.town || 
                       geoData.address.county || 
                       geoData.address.state || 
                       'Lokasi Anda';
        
        console.log(`📍 Kota: ${this.cityName}`);
        
        // Get prayer times
        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=11`);
        const data = await res.json();
        this.jadwal = data.data.timings;
        
        console.log('✅ Jadwal sholat berhasil dimuat');
      } catch (err) {
        console.error('❌ Gagal memuat jadwal sholat:', err);
        this.cityName = 'Gagal memuat lokasi';
      }
    }, err => {
      console.error('❌ Gagal mendapatkan lokasi:', err);
      this.cityName = 'Lokasi ditolak';
    });
  },

  // Load checklist dari localStorage dan reset jika hari berganti
  loadChecklist() {
    console.log('✅ Memuat checklist ibadah...');
    const saved = localStorage.getItem('checklist');
    if (saved) {
      try {
        this.checklist = JSON.parse(saved);
      } catch (e) {
        console.error('❌ Error parsing checklist:', e);
      }
    }
    
    // Reset checklist setiap hari baru
    const lastDate = localStorage.getItem('checklistDate');
    const today = new Date().toDateString();
    if (lastDate !== today) {
      console.log('🔄 Hari baru, reset checklist');
      this.checklist.forEach(item => item.done = false);
      localStorage.setItem('checklistDate', today);
      this.saveChecklist();
    }
    
    const doneCount = this.checklist.filter(i => i.done).length;
    console.log(`✅ Checklist dimuat: ${doneCount}/${this.checklist.length} selesai`);
  },

  // Simpan checklist ke localStorage
  saveChecklist() {
    try {
      localStorage.setItem('checklist', JSON.stringify(this.checklist));
      const doneCount = this.checklist.filter(i => i.done).length;
      console.log(`💾 Checklist disimpan: ${doneCount}/${this.checklist.length} selesai`);
    } catch (e) {
      console.error('❌ Error saving checklist:', e);
    }
  },

  // Bookmark ayat favorit
  bookmarkAyat(nomorAyat) {
    try {
      let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const key = `${this.currentSurah.namaLatin}-${nomorAyat}`;
      
      if (!bookmarks.includes(key)) {
        bookmarks.push(key);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        alert(`✅ Ayat ${nomorAyat} dari Surah ${this.currentSurah.namaLatin} berhasil disimpan! 🔖`);
        console.log('🔖 Bookmark disimpan:', key);
      } else {
        alert('ℹ️ Ayat sudah tersimpan sebelumnya');
      }
    } catch (e) {
      console.error('❌ Error bookmarking ayat:', e);
      alert('❌ Gagal menyimpan ayat');
    }
  },

  // Install PWA
  installApp() {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ User menerima install prompt');
        } else {
          console.log('❌ User menolak install prompt');
        }
        window.deferredPrompt = null;
      });
    } else {
      alert('ℹ️ Aplikasi sudah terinstall atau browser tidak mendukung instalasi PWA.\n\nUntuk menginstall:\n• Chrome Android: Buka menu → Install app\n• Safari iOS: Tap Share → Add to Home Screen');
    }
  },

  // Register service worker untuk PWA
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
          console.log('✅ Service Worker registered:', registration);
        })
        .catch(err => {
          console.error('❌ SW registration failed:', err);
        });
    } else {
      console.warn('⚠️ Service Worker tidak didukung browser');
    }
  }
};

// Simpan install prompt untuk digunakan nanti
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  window.deferredPrompt = e;
  console.log('📲 Install prompt tersedia');
});

// Log ketika app terinstall
window.addEventListener('appinstalled', () => {
  console.log('✅ BarakahKu berhasil diinstall!');
  window.deferredPrompt = null;
});