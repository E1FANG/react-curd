import { extend } from "umi-request";

export const request = extend({
  baseUrl: "/api",
  header: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
