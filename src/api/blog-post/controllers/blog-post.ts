import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::blog-post.blog-post",
  ({ strapi }: any) => ({
    async incrementViews(ctx) {
      const { id } = ctx.params;
      // Fetch the current entity to check if views is null
      const entity = await strapi.entityService.findOne(
        "api::blog-post.blog-post",
        id
      );

      if (!entity) {
        return ctx.notFound("Invalid id");
      }
      // If views is null, set it to 0 before incrementing
      const currentViews = entity?.views ?? 0;

      // Increment the views safely
      await strapi.entityService.update("api::blog-post.blog-post", id, {
        data: { views: currentViews + 1 },
      });

      return { success: true, views: currentViews + 1 };
    },
  })
);
