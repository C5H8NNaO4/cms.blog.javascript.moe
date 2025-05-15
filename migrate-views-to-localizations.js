const Strapi = require('@strapi/strapi').default;

async function migrateViewsToLocalizations() {
  // Initialize the app instance by calling Strapi() as a function, NOT with `new`
  const strapi = await Strapi();

  await strapi.load();

  try {
    const defaultLocale = 'en';

    const blogPosts = await strapi.entityService.findMany('api::blog-post.blog-post', {
      filters: { locale: defaultLocale },
      populate: ['localizations'],
    });

    console.log(`Found ${blogPosts.length} posts in default locale.`);

    for (const post of blogPosts) {
      console.log(`Post ID ${post.id} has ${post.localizations.length} localizations.`);

      const defaultViews = post.views ?? 0;

      for (const localized of post.localizations) {
        console.log(`Locale: ${localized.locale}, Current views: ${localized.views}`);

        await strapi.entityService.update('api::blog-post.blog-post', localized.id, {
          data: { views: defaultViews },
        });
        console.log(`Updated views for locale ${localized.locale} on post ID ${localized.id}`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await strapi.destroy();
    process.exit();
  }
}

migrateViewsToLocalizations();
