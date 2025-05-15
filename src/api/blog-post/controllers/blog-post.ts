import { factories } from "@strapi/strapi";
import { isBot } from "../../../lib/util";

export default factories.createCoreController(
  "api::blog-post.blog-post",
  ({ strapi }: any) => ({
    async incrementViews(ctx) {
      const { id: documentId } = ctx.params;
      const { locale } = ctx.query;

      // Bot filtering
      const userAgent = ctx.request.header["user-agent"];
      if (isBot(userAgent)) {
        return ctx.badRequest("Bots are not allowed to increment views");
      }

      // Find the default locale entity and its localizations
      const [defaultEntity] = await strapi.entityService.findMany(
        "api::blog-post.blog-post",
        {
          filters: { documentId },
          locale
        }
      );

      if (!defaultEntity) {
        return ctx.notFound("Invalid id or missing default locale entry");
      }

      const currentViews = defaultEntity.views ?? 0;

      // Update the localized entity's views
      await strapi.entityService.update(
        "api::blog-post.blog-post",
        defaultEntity.id,
        {
          data: { views: currentViews + 1 },
          locale,
        }
      );

      return { success: true, views: currentViews + 1 };
    },

    async views(ctx) {
      const { id: documentId } = ctx.params;
      const { locale } = ctx.query;

      // Find the default locale entity and its localizations
      const [defaultEntity] = await strapi.entityService.findMany(
        "api::blog-post.blog-post",
        {
          filters: { documentId },
          populate: ["localizations", "id"],
        }
      );

      if (!defaultEntity) {
        return ctx.notFound("Invalid id or missing default locale entry");
      }

      // Determine the localized entity ID
      const entity = defaultEntity.localizations.find(
        (l) => l.locale === locale
      );

      if (!entity.id) {
        return ctx.notFound("Missing localized entry for this locale");
      }

      // Fetch the full localized entity
      const localizedEntity = await strapi.entityService.findOne(
        "api::blog-post.blog-post",
        entity.id
      );

      const currentViews = localizedEntity.views ?? 0;

      // Set Cache-Control header
      ctx.set("Cache-Control", "public, max-age=300");

      return { views: currentViews };
    },
  })
);
