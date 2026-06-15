// The built logo .glb model doesn't resolve under the local base path, so the
// scene renders blank locally. Capture from the deployed experiment instead,
// where it renders correctly. The dissolve animation sweeps continuously, so a
// short delay lands on a frame with the logo mostly intact + dissolving edge.
export default {
  url: "https://experiments.matiasgf.dev/basement-logo/",
  delayMs: 1300,
};
