const images = Object.entries(
  import.meta.glob("../assets/product/*.jpeg", { eager: true, import: "default" })
)
  .sort(([a], [b]) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]))
  .map(([, src]) => src);

// قائمة مؤقتة من الصور المحلية.
// لما نربط الباك إند هنستبدلها بنتيجة الـ API، ونفس الحقول: id و name و image.
export const products = images.map((image, index) => ({
  id: index + 1,
  name: `منتج ${index + 1}`,
  image,
}));
