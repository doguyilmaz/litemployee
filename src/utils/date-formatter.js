import {i18n} from '../i18n/translations.js';

export function formatDate(isoDate) {
  if (!isoDate) return '';

  const [year, month, day] = isoDate.split('-');
  const lang = i18n.getCurrentLanguage();

  if (lang === 'tr') {
    return `${day}/${month}/${year}`;
  }

  return `${month}/${day}/${year}`;
}

export function parseDate(formattedDate, lang = 'en') {
  if (!formattedDate) return '';

  const parts = formattedDate.split('/');
  if (parts.length !== 3) return '';

  if (lang === 'tr') {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
