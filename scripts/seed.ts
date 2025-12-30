import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash de contraseña común
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  const demoPassword = await bcrypt.hash('Demo123456!', 10);

  // 1. Usuario Admin (cuenta de prueba obligatoria)
  const admin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'Admin Principal',
      role: 'admin',
      company: 'SIi Goo Consultores',
      phone: '+34 900 123 456',
    },
  });
  console.log('✓ Admin creado:', admin.email);

  // 2. Usuario Gestor
  const gestor = await prisma.user.upsert({
    where: { email: 'gestor@siigoo.com' },
    update: {},
    create: {
      email: 'gestor@siigoo.com',
      password: demoPassword,
      name: 'María González',
      role: 'gestor',
      company: 'SIi Goo Consultores',
      phone: '+34 900 123 457',
    },
  });
  console.log('✓ Gestor creado:', gestor.email);

  // 3. Cliente Demo 1 - Empresa de Reformas
  const cliente1 = await prisma.user.upsert({
    where: { email: 'demo@siigoo.com' },
    update: {},
    create: {
      email: 'demo@siigoo.com',
      password: demoPassword,
      name: 'Usuario Demo',
      role: 'client',
      company: 'Empresa Demo',
      phone: '+34 600 111 222',
      cif: 'B12345678',
      address: 'Calle Mayor 1, Madrid',
    },
  });
  console.log('✓ Cliente Demo creado:', cliente1.email);

  // 4. Cliente 2 - Empresa de Reformas
  const cliente2 = await prisma.user.upsert({
    where: { email: 'info@reformasgarcia.com' },
    update: {},
    create: {
      email: 'info@reformasgarcia.com',
      password: demoPassword,
      name: 'Carlos García',
      role: 'client',
      company: 'Reformas García S.L.',
      phone: '+34 600 333 444',
      cif: 'B87654321',
      address: 'Av. Andalucía 45, Sevilla',
    },
  });
  console.log('✓ Cliente 2 creado:', cliente2.email);

  // 5. Cliente 3 - Empresa de Construcción
  const cliente3 = await prisma.user.upsert({
    where: { email: 'contacto@construccioneslopez.es' },
    update: {},
    create: {
      email: 'contacto@construccioneslopez.es',
      password: demoPassword,
      name: 'Ana López',
      role: 'client',
      company: 'Construcciones López',
      phone: '+34 600 555 666',
      cif: 'B11223344',
      address: 'Polígono Industrial Norte, Valencia',
    },
  });
  console.log('✓ Cliente 3 creado:', cliente3.email);

  // === PROYECTOS DE EJEMPLO PARA CLIENTE DEMO ===

  // Proyecto 1: Obra altamente rentable
  const proyecto1 = await prisma.project.create({
    data: {
      userId: cliente1.id,
      name: 'Reforma Integral Vivienda - Calle Serrano',
      type: 'obra',
      reference: 'OBR-2024-001',
      description: 'Reforma completa de vivienda de 120m² en zona premium de Madrid',
      status: 'completado',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      budget: 85000,
      totalIncome: 95000,
      totalExpenses: 58000,
      netProfit: 37000,
      profitMargin: 38.95,
    },
  });
  console.log('✓ Proyecto 1 creado:', proyecto1.name);

  // Proyecto 2: Obra con rentabilidad media
  const proyecto2 = await prisma.project.create({
    data: {
      userId: cliente1.id,
      name: 'Reforma Baño y Cocina - Getafe',
      type: 'obra',
      reference: 'OBR-2024-002',
      description: 'Renovación de baño completo y cocina en vivienda familiar',
      status: 'completado',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-15'),
      budget: 28000,
      totalIncome: 32000,
      totalExpenses: 24500,
      netProfit: 7500,
      profitMargin: 23.44,
    },
  });
  console.log('✓ Proyecto 2 creado:', proyecto2.name);

  // Proyecto 3: Obra con baja rentabilidad (problemas)
  const proyecto3 = await prisma.project.create({
    data: {
      userId: cliente1.id,
      name: 'Rehabilitación Fachada - Móstoles',
      type: 'obra',
      reference: 'OBR-2024-003',
      description: 'Arreglo de fachada con problemas estructurales no previstos',
      status: 'completado',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-04-20'),
      budget: 45000,
      totalIncome: 48000,
      totalExpenses: 46800,
      netProfit: 1200,
      profitMargin: 2.5,
    },
  });
  console.log('✓ Proyecto 3 creado:', proyecto3.name);

  // Proyecto 4: Siniestro (muy rentable)
  const proyecto4 = await prisma.project.create({
    data: {
      userId: cliente1.id,
      name: 'Siniestro Incendio - Local Comercial',
      type: 'siniestro',
      reference: 'SIN-2024-001',
      description: 'Reparación de daños por incendio en local comercial de 200m²',
      status: 'completado',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-07-15'),
      budget: 120000,
      totalIncome: 135000,
      totalExpenses: 78000,
      netProfit: 57000,
      profitMargin: 42.22,
    },
  });
  console.log('✓ Proyecto 4 creado:', proyecto4.name);

  // Proyecto 5: Proyecto activo
  const proyecto5 = await prisma.project.create({
    data: {
      userId: cliente1.id,
      name: 'Reforma Oficinas - Torre Empresarial',
      type: 'proyecto',
      reference: 'PRY-2024-001',
      description: 'Acondicionamiento de 3 plantas de oficinas (500m² total)',
      status: 'activo',
      startDate: new Date('2024-09-01'),
      endDate: null,
      budget: 180000,
      totalIncome: 95000, // parcial
      totalExpenses: 72000, // parcial
      netProfit: 23000, // parcial
      profitMargin: 24.21, // parcial
    },
  });
  console.log('✓ Proyecto 5 creado:', proyecto5.name);

  // Proyecto 6: Obra pequeña rentable
  const proyecto6 = await prisma.project.create({
    data: {
      userId: cliente1.id,
      name: 'Instalación Parquet - Vivienda Particular',
      type: 'obra',
      reference: 'OBR-2024-004',
      description: 'Instalación de parquet en vivienda de 90m²',
      status: 'completado',
      startDate: new Date('2024-05-10'),
      endDate: new Date('2024-05-20'),
      budget: 8500,
      totalIncome: 9200,
      totalExpenses: 5800,
      netProfit: 3400,
      profitMargin: 36.96,
    },
  });
  console.log('✓ Proyecto 6 creado:', proyecto6.name);

  // === PROYECTOS PARA CLIENTE 2 ===
  const proyectoCliente2_1 = await prisma.project.create({
    data: {
      userId: cliente2.id,
      name: 'Reforma Integral Casa Rural',
      type: 'obra',
      reference: 'OBR-2024-005',
      description: 'Restauración completa de casa rural en Andalucía',
      status: 'activo',
      startDate: new Date('2024-08-01'),
      budget: 250000,
      totalIncome: 120000,
      totalExpenses: 98000,
      netProfit: 22000,
      profitMargin: 18.33,
    },
  });
  console.log('✓ Proyecto Cliente 2 creado:', proyectoCliente2_1.name);

  // === SOLICITUDES DE SERVICIO ===
  const solicitud1 = await prisma.serviceRequest.create({
    data: {
      userId: cliente1.id,
      service: 'Análisis de rentabilidad',
      description: 'Necesito un informe detallado de rentabilidad de todos mis proyectos del último trimestre',
      status: 'completado',
      priority: 'alta',
      assignedTo: gestor.id,
    },
  });
  console.log('✓ Solicitud 1 creada');

  const solicitud2 = await prisma.serviceRequest.create({
    data: {
      userId: cliente2.id,
      service: 'Constitución de sociedad',
      description: 'Quiero constituir una LLC en Estados Unidos para expansión internacional',
      status: 'en_proceso',
      priority: 'normal',
      assignedTo: gestor.id,
    },
  });
  console.log('✓ Solicitud 2 creada');

  // === MENSAJES ===
  const mensaje1 = await prisma.message.create({
    data: {
      senderId: gestor.id,
      receiverId: cliente1.id,
      subject: 'Informe de rentabilidad Q4 2024',
      content: 'Hola, te adjunto el informe de rentabilidad solicitado. Destacar que tus proyectos de siniestros tienen un margen excelente del 42%. Te recomendaría enfocarte más en este tipo de trabajos.',
      read: true,
    },
  });
  console.log('✓ Mensaje 1 creado');

  const mensaje2 = await prisma.message.create({
    data: {
      senderId: cliente1.id,
      receiverId: gestor.id,
      subject: 'Consulta sobre proyecto Torre Empresarial',
      content: 'Buenos días María, ¿podrías revisar los gastos del proyecto PRY-2024-001? Creo que hay una discrepancia en las facturas de material.',
      read: false,
    },
  });
  console.log('✓ Mensaje 2 creado');

  console.log('\n✅ Seeding completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`- ${await prisma.user.count()} usuarios creados`);
  console.log(`- ${await prisma.project.count()} proyectos creados`);
  console.log(`- ${await prisma.serviceRequest.count()} solicitudes de servicio`);
  console.log(`- ${await prisma.message.count()} mensajes`);
  console.log('\n🔐 Credenciales de acceso:');
  console.log('Admin: john@doe.com / johndoe123');
  console.log('Gestor: gestor@siigoo.com / Demo123456!');
  console.log('Cliente Demo: demo@siigoo.com / Demo123456!');
  console.log('Cliente 2: info@reformasgarcia.com / Demo123456!');
  console.log('Cliente 3: contacto@construccioneslopez.es / Demo123456!');
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
