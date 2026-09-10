export interface JordanGovernorate {
  id: string;
  nameAr: string;
  nameEn: string;
  fee: number;
}

export const JORDAN_GOVERNORATES: JordanGovernorate[] = [
  { id: 'عمان', nameAr: 'عمان (توصيل دينار فقط)', nameEn: 'Amman (1 JOD)', fee: 1 },
  { id: 'الزرقاء', nameAr: 'الزرقاء (توصيل دينارين)', nameEn: 'Zarqa (2 JOD)', fee: 2 },
  { id: 'إربد', nameAr: 'إربد (توصيل دينارين)', nameEn: 'Irbid (2 JOD)', fee: 2 },
  { id: 'البلقاء', nameAr: 'البلقاء والسلط (توصيل دينارين)', nameEn: 'Balqa / Salt (2 JOD)', fee: 2 },
  { id: 'مادبا', nameAr: 'مادبا (توصيل دينارين)', nameEn: 'Madaba (2 JOD)', fee: 2 },
  { id: 'جرش', nameAr: 'جرش (توصيل دينارين)', nameEn: 'Jerash (2 JOD)', fee: 2 },
  { id: 'عجلون', nameAr: 'عجلون (توصيل دينارين)', nameEn: 'Ajloun (2 JOD)', fee: 2 },
  { id: 'المفرق', nameAr: 'المفرق (توصيل دينارين)', nameEn: 'Mafraq (2 JOD)', fee: 2 },
  { id: 'الكرك', nameAr: 'الكرك (توصيل دينارين)', nameEn: 'Karak (2 JOD)', fee: 2 },
  { id: 'الطفيلة', nameAr: 'الطفيلة (توصيل دينارين)', nameEn: 'Tafilah (2 JOD)', fee: 2 },
  { id: 'معان', nameAr: 'معان (توصيل دينارين)', nameEn: 'Ma\'an (2 JOD)', fee: 2 },
  { id: 'العقبة', nameAr: 'العقبة (توصيل دينارين)', nameEn: 'Aqaba (2 JOD)', fee: 2 },
];
