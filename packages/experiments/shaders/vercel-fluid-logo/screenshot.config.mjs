// The fluid logo is pointer-driven — without mouse movement it stays a flat
// triangle. Swirl the pointer across the canvas to energize the fluid, then let
// it flow for a moment before capturing.
export default {
  delayMs: 1500,
  async prepare(page) {
    const box = await page.locator("canvas").boundingBox();
    if (!box) return;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const r = box.width * 0.22;
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 4;
      await page.mouse.move(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.7, {
        steps: 2,
      });
    }
  },
};
