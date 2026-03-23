import type { Core } from '@strapi/strapi';


export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register({ strapi }: { strapi: Core.Strapi }) {
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
    const adminLastName = process.env.ADMIN_LAST_NAME || 'User';

    if(adminEmail && adminPassword){
      const existingAdmins = await strapi.query('admin::user').findMany();

      if (existingAdmins.length === 0) {
        const hashedPassword = await strapi.admin.services.auth.hashPassword(adminPassword);

        // Fetch role object
        const [superAdminRole] = await strapi.query('admin::role').findMany({ where: { code: 'strapi-super-admin' } });


        await strapi.query('admin::user').create({
          data: {
            firstname: adminFirstName,
            lastname: adminLastName,
            email: adminEmail,
            username: adminEmail,
            password: hashedPassword,
            roles: [superAdminRole.id],
            blocked: false,
            isActive: true,
          },
        });

        console.log(`✅ Admin user created: ${adminEmail}`);
      } else {
        console.log('⚠️ Admin user already exists. Skipping.');
      }
    }
  },
};
