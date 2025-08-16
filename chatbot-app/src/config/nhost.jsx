// // nhost.js
// import { NhostClient } from '@nhost/react';

// const nhost = new NhostClient({
//   subdomain: 'dcthotdhgvfbsxyyguyi',
//   region: 'ap-south-1'
// });

// export default nhost;


// nhost.js
import { NhostClient } from "@nhost/nhost-js";

export const nhost = new NhostClient({
  subdomain: "dcthotdhgvfbsxyyguyi",
  region: "ap-south-1",
});
