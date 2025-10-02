const translations = {
  en: {
    employeeList: 'Employees',
    addEmployee: 'Add Employee',
    addNew: 'Add New',
    editEmployee: 'Edit Employee',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Confirm Delete',
    confirmDeleteMessage:
      'Are you sure you want to delete this employee? This action cannot be undone.',
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfEmployment: 'Date of Employment',
    dateOfBirth: 'Date of Birth',
    phone: 'Phone',
    email: 'Email',
    department: 'Department',
    position: 'Position',
    selectDepartment: 'Select Department',
    selectPosition: 'Select Position',
    save: 'Save',
    cancel: 'Cancel',
    actions: 'Actions',
    showing: 'Showing',
    of: 'of',
    itemsPerPage: 'Items per page',
    employeesSelected: 'employees selected',
    clearSelection: 'Cancel',
    confirmDeleteMultiple:
      'Are you sure you want to delete {count} employees? This action cannot be undone.',
    clearData: 'Clear Data',
    confirmClearData:
      'Are you sure you want to clear all employee data? This action cannot be undone.',
  },
  tr: {
    employeeList: 'Çalışanlar',
    addEmployee: 'Çalışan Ekle',
    addNew: 'Yeni Ekle',
    editEmployee: 'Çalışanı Düzenle',
    edit: 'Düzenle',
    delete: 'Sil',
    confirmDelete: 'Silmeyi Onayla',
    confirmDeleteMessage:
      'Bu çalışanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    firstName: 'Ad',
    lastName: 'Soyad',
    dateOfEmployment: 'İşe Başlama Tarihi',
    dateOfBirth: 'Doğum Tarihi',
    phone: 'Telefon',
    email: 'E-posta',
    department: 'Departman',
    position: 'Pozisyon',
    selectDepartment: 'Departman Seçin',
    selectPosition: 'Pozisyon Seçin',
    save: 'Kaydet',
    cancel: 'İptal',
    actions: 'İşlemler',
    showing: 'Gösteriliyor',
    of: '/',
    itemsPerPage: 'Sayfa başına',
    employeesSelected: 'çalışan seçildi',
    clearSelection: 'İptal',
    confirmDeleteMultiple:
      '{count} çalışanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    clearData: 'Verileri Temizle',
    confirmClearData:
      'Tüm çalışan verilerini temizlemek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
  },
};

const LANG_KEY = 'app-language';

export const i18n = (() => {
  let currentLang = 'en';

  return {
    set(lang) {
      if (translations[lang]) {
        currentLang = lang;
        document.documentElement.lang = lang;
        localStorage.setItem(LANG_KEY, lang);
        window.dispatchEvent(
          new CustomEvent('language-changed', {detail: {lang}})
        );
      }
    },

    toggle() {
      const newLang = currentLang === 'en' ? 'tr' : 'en';
      this.set(newLang);
      return newLang;
    },

    t(key) {
      return translations[currentLang]?.[key] || key;
    },

    getCurrentLanguage() {
      return currentLang;
    },

    init() {
      const stored = localStorage.getItem(LANG_KEY);
      const htmlLang = stored || document.documentElement.lang || 'en';
      this.set(htmlLang);
    },
  };
})();
