import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";

function Hero() {
  return (
    <section id="request-quote" dir="rtl" className="relative isolate overflow-hidden bg-[#07152c] font-['Cairo'] text-white">
      <img
        src={heroImage}
        alt="موتور كهربائي صناعي داخل مصنع"
        className="absolute inset-0 h-full w-full object-cover object-[center_28%] md:object-[28%_center]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#07152c] via-[#07152c]/80 to-[#07152c]/35 md:bg-linear-to-l md:from-[#07152c] md:via-[#07152c]/78 md:to-[#0a2748]/15" />

      <div className="relative mx-auto flex min-h-[calc(100svh-6.25rem)] max-w-7xl items-end px-5 pb-14 pt-16 sm:px-8 md:min-h-[calc(100svh-9.75rem)] md:items-center md:py-20 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[#8eb7ef]">
            مواتير · طلمبات · جيربوكسات
          </p>
          <h1 className="mt-4 max-w-xl text-[2.35rem] font-semibold leading-[1.25] sm:text-5xl lg:text-[3.5rem]">
            نشغّل الصناعة.
            <span className="mt-1 block text-[#e7f0fb]">ونسلّم الموثوقية.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#d5e3f5] sm:text-lg">
            مواتير كهربائية وطلمبات مياه صناعية وجيربوكسات للتشغيل المستمر. معدات تُختار للمصانع التي تقاس كفاءتها بزمن التشغيل.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/products"
              className="inline-flex h-12 items-center justify-center bg-white px-6 text-sm font-semibold text-[#0b2548] transition duration-200 hover:bg-[#d7e6f8]"
            >
              استكشف المنتجات
            </Link>
            <a
              href="#request-quote"
              className="inline-flex h-12 items-center justify-center border border-white/35 bg-white/5 px-6 text-sm font-semibold text-white transition duration-200 hover:border-[#8eb7ef] hover:bg-[#12325c]"
            >
              اطلب عرض سعر
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
