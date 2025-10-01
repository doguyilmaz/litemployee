const translations = {
  en: {
    employeeList: 'Employees',
    addEmployee: 'Add Employee',
    editEmployee: 'Edit Employee',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this employee?',
  },
  tr: {
    employeeList: 'Çalışanlar',
    addEmployee: 'Çalışan Ekle',
    editEmployee: 'Çalışanı Düzenle',
    edit: 'Düzenle',
    delete: 'Sil',
    confirmDelete: 'Bu çalışanı silmek istediğinizden emin misiniz?',
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
