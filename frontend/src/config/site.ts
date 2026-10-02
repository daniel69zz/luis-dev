/**
 * Datos personales del portafolio.
 * ✏️  Edita este archivo con tu información: nombre, bio, redes y stack.
 */
export const site = {
  name: 'Luis Daniel Rojas',
  handle: 'luis',
  domain: 'luis.dev',
  role: 'Full Stack Developer',
  /** Frases que va escribiendo el hero */
  taglines: ['Full Stack Developer', 'Construyo APIs escalables', 'Interfaces rápidas y accesibles'],
  location: 'Tu ciudad, País',
  available: true,

  /** Frase corta bajo tu nombre en la portada */
  intro: 'Diseño backends limpios y escalables, y construyo interfaces rápidas y cuidadas.',

  /** Párrafos de la sección "sobre mí" */
  bio: [
    'Soy desarrollador full stack. Disfruto el ciclo completo: modelar datos, diseñar APIs, desplegarlas y construir la interfaz que las usa.',
    'Me importan el código legible, los tests y las arquitecturas que aguantan crecer. Aquí vas a encontrar los proyectos en los que he trabajado, las tecnologías que uso y cómo contactarme.',
  ],

  /** Datos que se muestran en el bloque de código de "sobre mí" */
  about: {
    focus: ['backend', 'arquitectura', 'devex'],
    learning: 'Rust',
    coffee: true,
  },

  email: 'tu@email.com',
  socials: {
    github: 'https://github.com/tu-usuario',
    linkedin: 'https://www.linkedin.com/in/tu-usuario',
  },

  stack: [
    { category: 'frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML/CSS'] },
    { category: 'backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'REST APIs'] },
    { category: 'devops', items: ['Docker', 'Linux', 'Nginx', 'CI/CD', 'Git'] },
    { category: 'también', items: ['Python', 'Testing', 'Figma'] },
  ],

  /** Certificaciones: `url` es el enlace público de verificación e `image` la insignia */
  certifications: [
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services Training and Certification',
      url: 'https://www.credly.com/badges/abcaec50-2e6a-415c-88d4-fd052aa85c30/public_url',
      image: 'https://images.credly.com/size/340x340/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png',
    },
    {
      name: 'Network Technician Career Path',
      issuer: 'Cisco',
      url: 'https://www.credly.com/badges/815c7103-94d1-4ba4-9dfb-80969a97e52b/public_url',
      image: 'https://images.credly.com/size/340x340/images/978f88dc-c247-4093-9d39-6efac3651297/image.png',
    },
  ],
} as const;
