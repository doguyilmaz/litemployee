import {
  employeeStore,
  DEPARTMENTS,
  POSITIONS,
} from '../store/employee-store.js';

const turkishFirstNames = [
  'Ahmet',
  'Mehmet',
  'Ayşe',
  'Fatma',
  'Ali',
  'Zeynep',
  'Mustafa',
  'Elif',
  'Can',
  'Deniz',
  'Emre',
  'Selin',
  'Burak',
  'Ebru',
  'Cem',
  'Merve',
  'Kemal',
  'Gamze',
  'Oğuz',
  'Burcu',
  'Murat',
  'Gizem',
  'Serkan',
  'Pınar',
  'Tolga',
];

const turkishLastNames = [
  'Yılmaz',
  'Kaya',
  'Demir',
  'Çelik',
  'Şahin',
  'Öz',
  'Aydın',
  'Arslan',
  'Özdemir',
  'Koç',
  'Aktaş',
  'Çetin',
  'Yıldız',
  'Polat',
  'Korkmaz',
  'Erdoğan',
  'Güneş',
  'Aksoy',
  'Acar',
  'Kurt',
  'Özkan',
  'Şen',
  'Aslan',
  'Tekin',
  'Doğan',
];

const phonePrefix = ['532', '533', '534', '535', '536', '537', '538', '539'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePhoneNumber() {
  const prefix = getRandomElement(phonePrefix);
  const middle = Math.floor(Math.random() * 900) + 100;
  const last = Math.floor(Math.random() * 9000) + 1000;
  return `0${prefix} ${middle} ${last}`;
}

function generateEmail(firstName, lastName) {
  const turkishToEnglish = {
    ğ: 'g',
    Ğ: 'g',
    ü: 'u',
    Ü: 'u',
    ş: 's',
    Ş: 's',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ç: 'c',
    Ç: 'c',
  };

  const cleanString = (str) =>
    str
      .split('')
      .map((char) => turkishToEnglish[char] || char)
      .join('');

  return `${cleanString(firstName).toLowerCase()}.${cleanString(
    lastName
  ).toLowerCase()}@company.com`;
}

function generateBirthDate() {
  const year = 1970 + Math.floor(Math.random() * 30);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateEmploymentDate() {
  const year = 2015 + Math.floor(Math.random() * 10);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function seedEmployees(count = 25) {
  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(turkishFirstNames);
    const lastName = getRandomElement(turkishLastNames);

    const employee = {
      firstName,
      lastName,
      email: generateEmail(firstName, lastName),
      phone: generatePhoneNumber(),
      dateOfBirth: generateBirthDate(),
      dateOfEmployment: generateEmploymentDate(),
      department: getRandomElement(DEPARTMENTS),
      position: getRandomElement(POSITIONS),
    };

    employeeStore.add(employee);
  }

  console.log(`Seeded ${count} employees for testing`);
}
