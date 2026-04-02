import { Memory } from '@/shared/types';

// Mock approved memories for display
export const mockMemories: Memory[] = [
  {
    id: "m1",
    martyrId: "1",
    authorName: "Mariam El-Sayed",
    relationship: "family",
    type: "story",
    contentEn: "Ahmed used to share his tea with everyone at the barricades. He would say, 'Tea is the revolution's fuel.' Even in the most tense moments, he found a way to make people smile with his poetry.",
    contentAr: "كان أحمد يشارك شايه مع الجميع عند المتاريس. كان يقول: 'الشاي هو وقود الثورة.' حتى في أكثر اللحظات توترًا، كان يجد طريقة لإضحاك الناس بشعره.",
    date: "2024-06-03",
    approved: true
  },
  {
    id: "m2",
    martyrId: "1",
    authorName: "Tarig Nour",
    relationship: "friend",
    type: "story",
    contentEn: "We studied engineering together. Ahmed always talked about building a Sudan where nobody would be homeless. He sketched designs for affordable housing in his notebooks between classes.",
    contentAr: "درسنا الهندسة معًا. كان أحمد يتحدث دائمًا عن بناء سودان لا يكون فيه أحد بلا مأوى. كان يرسم تصاميم لمساكن ميسورة التكلفة في دفاتره بين المحاضرات.",
    date: "2024-07-15",
    approved: true
  },
  {
    id: "m3",
    martyrId: "2",
    authorName: "Dr. Hanan Idris",
    relationship: "friend",
    type: "story",
    contentEn: "Sara was my classmate in medical school. She never hesitated to help anyone. On the night of the march, she stayed behind to tend to the wounded when everyone else ran. That was Sara — always putting others first.",
    contentAr: "كانت سارة زميلتي في كلية الطب. لم تتردد أبدًا في مساعدة أي شخص. في ليلة المسيرة، بقيت لتعتني بالجرحى عندما هرب الجميع. هذه كانت سارة — دائمًا تضع الآخرين أولاً.",
    date: "2024-11-17",
    approved: true
  },
  {
    id: "m4",
    martyrId: "5",
    authorName: "Anonymous",
    relationship: "stranger",
    type: "story",
    contentEn: "I never knew his name until I saw this site. But I stood next to him in Atbara that day. He was chanting louder than anyone else. He had a voice that could move mountains.",
    contentAr: "لم أعرف اسمه حتى رأيت هذا الموقع. لكنني وقفت بجانبه في عطبرة ذلك اليوم. كان يهتف بصوت أعلى من أي شخص آخر. كان لديه صوت يمكنه تحريك الجبال.",
    date: "2025-01-10",
    approved: true
  },
  {
    id: "m5",
    martyrId: "8",
    authorName: "Amna Osman",
    relationship: "family",
    type: "story",
    contentEn: "My sister Fatima always said: 'A doctor's oath doesn't end when the shift is over.' She lived by those words until her last breath. We are proud of her sacrifice.",
    contentAr: "أختي فاطمة كانت تقول دائمًا: 'قسم الطبيب لا ينتهي عندما تنتهي المناوبة.' عاشت بهذه الكلمات حتى آخر نفس. نحن فخورون بتضحيتها.",
    date: "2025-03-01",
    approved: true
  },
  {
    id: "m6",
    martyrId: "9",
    authorName: "Teacher Mokhtar",
    relationship: "stranger",
    type: "story",
    contentEn: "Khalid was in my class. A bright boy with a contagious laugh. He told me the morning before the march: 'Teacher, today we write our own history.' He was seventeen.",
    contentAr: "كان خالد في صفي. ولد ذكي بضحكة معدية. قال لي صباح يوم المسيرة: 'يا أستاذ، اليوم نكتب تاريخنا بأنفسنا.' كان في السابعة عشرة.",
    date: "2025-02-14",
    approved: true
  },
  {
    id: "m7",
    martyrId: "3",
    authorName: "Leena Ahmed",
    relationship: "friend",
    type: "story",
    contentEn: "Mohamed designed the banner I carried at the sit-in. He gave it to me for free and said, 'Art should never have a price tag when it speaks for the people.' I still have it hanging in my room.",
    contentAr: "محمد صمم اللافتة التي حملتها في الاعتصام. أعطاها لي مجانًا وقال: 'الفن لا يجب أن يكون له ثمن عندما يتحدث باسم الشعب.' لا تزال معلقة في غرفتي.",
    date: "2024-12-20",
    approved: true
  }
];
