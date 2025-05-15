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

      // Fetch the entity by documentId and locale
      const [entity] = await strapi.entityService.findMany(
        "api::blog-post.blog-post",
        {
          filters: {
            documentId: documentId,
          },
          locale,
        }
      );

      if (!entity) {
        return ctx.notFound("Invalid id or missing locale-specific entry");
      }

      const currentViews = entity.views ?? 0;

      // Increment using the internal numeric id
      await strapi.entityService.update("api::blog-post.blog-post", entity.id, {
        data: { views: currentViews + 1 },
        locale,
      });

      return { success: true, views: currentViews + 1 };
    },

    async views(ctx) {
      const { id: documentId } = ctx.params;
      const { locale } = ctx.query;

      // Fetch the entity by documentId and locale
      const [entity] = await strapi.entityService.findMany(
        "api::blog-post.blog-post",
        {
          filters: {
            documentId: documentId,
          },
          locale, // <- this ensures the correct localized version is fetched
        }
      );

      if (!entity) {
        return ctx.notFound("Invalid id or missing locale-specific entry");
      }

      const currentViews = entity.views ?? 0;

      // Set Cache-Control header
      ctx.set("Cache-Control", "public, max-age=300");

      return { views: currentViews  };
    },
  })
);
