export default function (api) {
  api.cache(true);

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
        },
      ],
      "nativewind/babel",
    ],

    plugins: [
      "@babel/plugin-transform-class-static-block",
      [
        "module-resolver",
        {
          root: ["./"],

          alias: {
            "@": "./",
            "tailwind.config": "./tailwind.config.js",
            "@colyseus/httpie": "@colyseus/httpie/fetch",
            "stream": "stream-browserify",
            "ws": "isomorphic-ws",
          },
        },
      ],
    ],
  };
};
