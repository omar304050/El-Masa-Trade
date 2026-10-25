import logo from "../../assets/mainIcon.png";

const points = [
  {
    title: "توزيع للتجار",
    text: "أسعار جملة وكميات تناسب المحلات والمقاولين.",
    icon: "M12 3 4 7.2v9.6L12 21l8-4.2V7.2L12 3Zm0 8.2L5.2 7.7 12 4.2l6.8 3.5L12 11.2Zm1 1.2v7.1l6-3.1V9.6l-6 2.8Z",
  },
  {
    title: "توصيل المحافظات",
    text: "نشحن الطلبات إلى كل محافظات مصر.",
    icon: "M3 7.5h11v8H3v-8Zm11 2.5h3.2L20 13v2.5h-6V10ZM6.2 17.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm9.4 0a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z",
  },
  {
    title: "توريد للمصانع",
    text: "مواتير وطلمبات وجيربوكسات للتشغيل المستمر.",
    icon: "M3 20V10.5l4.5 3V10.5L12 13.5V8h3V6h2v2h4v12H3Zm3-2h2v-3H6v3Zm5 0h2v-3h-2v3Z",
  },
];

function CompanyAbout() {
  return (
    <section data-company-about dir="rtl" className="border-y border-[#e6dfd4] bg-[#fbf8f3] font-['Cairo'] text-[#1c1915]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[18rem_1fr] lg:gap-16 lg:px-10 lg:py-20">
        <div className="mx-auto lg:mx-0">
          <div className="relative size-56 sm:size-64">
            <div className="absolute inset-4 rounded-full bg-[#d4a84a]/30 blur-xl" aria-hidden="true" />
            <div className="relative size-full overflow-hidden rounded-full bg-white shadow-[0_0_0_8px_#fbf8f3,0_0_0_9px_rgba(212,168,74,0.75),0_18px_40px_rgba(28,25,21,0.12)]">
              <img
                src={logo}
                alt="شعار ماسة تريد"
                className="size-full origin-center scale-[1.44] object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#d4893a]">عن ماسة تريد</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-snug sm:text-4xl">
            نوزّع للتجار.
            <span className="mt-1 block text-[#8a7460]">ونوصّل كل المحافظات.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#5c5348] sm:text-lg">
            ماسة تريد شركة توزيع لمعدات التشغيل الصناعي. نورّد مواتير كهربائية وطلمبات مياه وجيربوكسات للتجار والمقاولين بأسعار جملة، والشحن يوصل الطلب لأي محافظة في مصر.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {points.map((point) => (
              <li key={point.title} className="rounded-2xl border border-[#e6dfd4] bg-white px-4 py-4">
                <span className="grid size-10 place-items-center rounded-full bg-[#f6efe4] text-[#9a6b2f]">
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                    <path d={point.icon} />
                  </svg>
                </span>
                <h3 className="mt-3 text-sm font-bold">{point.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[#6d6256]">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default CompanyAbout;
