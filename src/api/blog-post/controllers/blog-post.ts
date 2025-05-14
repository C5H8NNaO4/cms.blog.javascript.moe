import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::blog-post.blog-post",
  ({ strapi }: any) => ({
    async findOne(ctx) {
      // Fetch the blog post as usual
      const { id } = ctx.params;
      const query = ctx.query;

      // Get the post
      const entity = await strapi.entityService.findOne(
        "api::blog-post.blog-post",
        id,
        query
      );

      if (entity) {
        // Increment the view count
        await strapi.entityService.update("api::blog-post.blog-post", id, {
          data: {
            views: (entity.views || 0) + 1,
          },
        });
      }

      // Return the post (optionally, you can re-fetch to get the updated views)
      return this.transformResponse(entity);
    },
    async incrementViews(ctx) {
      const { id } = ctx.params;
      // Fetch the current entity to check if views is null
      const entity = await strapi.entityService.findOne(
        "api::blog-post.blog-post",
        id
      );

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
