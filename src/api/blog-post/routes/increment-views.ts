export default {
  routes: [
    {
      method: "POST",
      path: "/blog-posts/:id/increment-views",
      handler: "blog-post.incrementViews",
      config: {
        auth: false, // Make public if needed
      },
    },
  ],
};
