export default ({ env }) => ({
  i18n: {
    enabled: true,
  },
  // upload: {
  //   config: {
  //     provider: "aws-s3",
  //     providerOptions: {
  //       accessKeyId: env("AWS_ACCESS_KEY_ID"),
  //       secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
  //       region: env("AWS_REGION"),
  //       params: {
  //         Bucket: env("AWS_BUCKET"),
  //       },
  //     },
  //   },
  // },
  upload: {
    config: {
      provider: "local",
      providerOptions: {
        sizeLimit: 100000000, // optional: limit in bytes
      },
    },
  },
  "import-export-entries": {
    enabled: false,
  },
});
