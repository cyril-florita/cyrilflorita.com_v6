// True when WebGL would run without a GPU (SwiftShader, llvmpipe, Microsoft's basic
// renderer) or not at all. The car and the smoke shader take seconds a frame there and
// stall the page — PageSpeed Insights, which has no GPU, reported the ad as hung — so
// both keep their stills. Chrome grants SwiftShader a context even under
// failIfMajorPerformanceCaveat, so the renderer's name decides. Checked once per page.
let result;
export default function softwareGL() {
  if (result !== undefined) return result;
  try {
    const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    result = !gl || /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch { result = true; }
  return result;
}
