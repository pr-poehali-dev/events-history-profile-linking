import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SERVICES = [
  {
    num: "01",
    title: "Стратегия",
    desc: "Анализ рынка, позиционирование бренда и дорожная карта продукта — фундамент, на котором всё строится.",
    icon: "Compass",
  },
  {
    num: "02",
    title: "Дизайн",
    desc: "Интерфейсы, которые не просто красивы — они решают задачи бизнеса и влюбляют пользователей.",
    icon: "Layers",
  },
  {
    num: "03",
    title: "Разработка",
    desc: "Быстрый, масштабируемый код. От лендинга до сложной веб-платформы под ключ.",
    icon: "Code2",
  },
  {
    num: "04",
    title: "Запуск",
    desc: "Настройка аналитики, SEO и первичного продвижения. Выходим на рынок с максимальным эффектом.",
    icon: "Rocket",
  },
];

const CASES = [
  {
    tag: "E-commerce",
    title: "Люксовый ювелирный бренд",
    metric: "+340%",
    metricLabel: "рост конверсии",
    year: "2024",
  },
  {
    tag: "SaaS",
    title: "B2B-платформа аналитики",
    metric: "×2.8",
    metricLabel: "рост MAU за 6 мес",
    year: "2024",
  },
  {
    tag: "Fintech",
    title: "Мобильный банк для МСБ",
    metric: "120k",
    metricLabel: "пользователей за год",
    year: "2023",
  },
];

const NUMBERS = [
  { value: "8+", label: "лет на рынке" },
  { value: "140+", label: "проектов" },
  { value: "94%", label: "клиентов возвращаются" },
  { value: "3×", label: "быстрее рынка" },
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);
  const navigate = useNavigate();

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Hero line animation
  const [lineVisible, setLineVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLineVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background noise-bg overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 bg-background/80 backdrop-blur-md border-b border-border">
        <a href="#" className="font-display text-2xl text-foreground tracking-wider">
          FORMA
        </a>
        <div className="hidden md:flex items-center gap-10">
          {["Услуги", "Кейсы", "О нас", "Контакты"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body text-sm text-muted-foreground hover:text-gold transition-colors duration-200 tracking-wider uppercase"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/complaints")}
            className="btn-outline-gold flex items-center gap-2"
          >
            <Icon name="ShieldAlert" size={13} />
            Журнал жалоб
          </button>
          <button className="btn-gold">
            <span>Обсудить проект</span>
          </button>
        </div>
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden">
          {["Услуги", "Кейсы", "О нас", "Контакты"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-display text-4xl text-foreground hover:text-gold transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button className="btn-gold mt-4">
            <span>Обсудить проект</span>
          </button>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative min-h-screen grid-lines flex flex-col justify-center px-8 md:px-16 pt-24 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gold/3 blur-[80px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto w-full">
          {/* Eyebrow */}
          <p
            className="font-body text-xs tracking-[0.3em] uppercase text-gold opacity-0 animate-fade-in delay-100"
            style={{ animationFillMode: "forwards" }}
          >
            Цифровая студия · Москва
          </p>

          {/* Main headline */}
          <h1
            className="font-display mt-6 text-[clamp(3.5rem,9vw,9rem)] leading-[0.9] font-light text-foreground opacity-0 animate-fade-in delay-200"
            style={{ animationFillMode: "forwards" }}
          >
            Мы создаём
            <br />
            <span className="gold-shimmer italic">продукты,</span>
            <br />
            которые растут.
          </h1>

          {/* Decorative line */}
          <div className="mt-10 h-px bg-gold/40 overflow-hidden" style={{ width: "100%" }}>
            <div
              className="h-full bg-gold transition-all duration-1000 ease-out"
              style={{ width: lineVisible ? "33%" : "0%" }}
            />
          </div>

          <div className="mt-10 flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
            <p
              className="font-body text-base md:text-lg text-muted-foreground max-w-sm leading-relaxed opacity-0 animate-fade-in delay-400"
              style={{ animationFillMode: "forwards" }}
            >
              Стратегия, дизайн и разработка в одном месте — от идеи до масштабирования.
            </p>
            <div
              className="flex gap-4 opacity-0 animate-fade-in delay-600"
              style={{ animationFillMode: "forwards" }}
            >
              <button className="btn-gold">
                <span>Начать проект</span>
              </button>
              <button className="btn-outline-gold flex items-center gap-2">
                Кейсы <Icon name="ArrowRight" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in delay-900"
          style={{ animationFillMode: "forwards" }}
        >
          <span className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent animate-float" />
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section className="px-8 md:px-16 py-16 border-t border-b border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {NUMBERS.map((item, i) => (
            <div key={i} className="reveal text-center md:text-left" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light text-gold leading-none">
                {item.value}
              </div>
              <div className="font-body text-sm text-muted-foreground mt-2 tracking-wide">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="услуги" className="px-8 md:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="reveal flex items-end justify-between mb-16 flex-wrap gap-4">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Услуги</p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-light text-foreground leading-tight">
                Что мы делаем
              </h2>
            </div>
            <p className="font-body text-sm text-muted-foreground max-w-xs leading-relaxed">
              Полный цикл создания цифрового продукта — без лишних подрядчиков и потерь в коммуникации.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {SERVICES.map((service, i) => (
              <div
                key={i}
                className="reveal bg-background p-10 card-hover group"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-display text-5xl font-light text-gold/20 group-hover:text-gold/40 transition-colors duration-300">
                    {service.num}
                  </span>
                  <Icon name={service.icon} size={20} className="text-gold/40 group-hover:text-gold transition-colors duration-300 mt-1" />
                </div>
                <h3 className="font-display text-2xl font-light text-foreground mb-4 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
                <div className="mt-8 flex items-center gap-2 text-gold/40 group-hover:text-gold transition-colors duration-300">
                  <span className="font-body text-xs tracking-widest uppercase">Подробнее</span>
                  <Icon name="ArrowRight" size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASES ── */}
      <section id="кейсы" className="px-8 md:px-16 py-24 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="reveal mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Кейсы</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-light text-foreground leading-tight">
              Результаты,<br />
              <span className="italic text-gold">которые говорят</span>
            </h2>
          </div>

          <div className="space-y-px bg-border">
            {CASES.map((c, i) => (
              <div
                key={i}
                className="reveal bg-card p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer hover:bg-background/60 transition-colors duration-300"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="flex items-start gap-6">
                  <span className="font-body text-xs tracking-widest uppercase text-muted-foreground pt-1 w-20 shrink-0">
                    {c.tag}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-light text-foreground group-hover:text-gold transition-colors duration-300">
                      {c.title}
                    </h3>
                    <span className="font-body text-xs text-muted-foreground mt-1 block">{c.year}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 md:gap-12 shrink-0">
                  <div className="text-right">
                    <div className="font-display text-3xl md:text-4xl font-light text-gold">
                      {c.metric}
                    </div>
                    <div className="font-body text-xs text-muted-foreground mt-1">{c.metricLabel}</div>
                  </div>
                  <div className="text-muted-foreground group-hover:text-gold transition-colors duration-300">
                    <Icon name="ArrowUpRight" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal mt-10 text-center">
            <button className="btn-outline-gold">Все кейсы</button>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="о-нас" className="px-8 md:px-16 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/3 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-6">О студии</p>
              <h2 className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-light text-foreground leading-tight mb-8">
                Мы — команда,<br />
                <span className="italic">одержимая</span><br />
                качеством.
              </h2>
              <p className="font-body text-base text-muted-foreground leading-loose mb-6">
                FORMA — студия полного цикла. Мы работаем с брендами, которые хотят выделиться, и стартапами, которым нужно расти быстро и красиво.
              </p>
              <p className="font-body text-base text-muted-foreground leading-loose mb-10">
                Каждый проект — это партнёрство. Мы погружаемся в ваш бизнес, чтобы создавать решения, которые работают на долгосрочный результат.
              </p>
              <button className="btn-gold">
                <span>Познакомиться</span>
              </button>
            </div>

            <div className="reveal grid grid-cols-2 gap-4">
              {/* Abstract visual blocks */}
              <div className="aspect-square bg-card border border-border rounded-sm flex items-center justify-center group hover:border-gold/30 transition-colors duration-300 card-hover">
                <div className="text-center">
                  <div className="font-display text-6xl font-light text-gold/30 group-hover:text-gold/60 transition-colors">F</div>
                  <div className="font-body text-xs text-muted-foreground mt-2 tracking-widest uppercase">Форма</div>
                </div>
              </div>
              <div className="aspect-square bg-gold/8 border border-gold/15 rounded-sm flex items-center justify-center group hover:bg-gold/12 transition-colors duration-300 card-hover col-start-2 mt-8">
                <Icon name="Zap" size={40} className="text-gold/50 group-hover:text-gold transition-colors duration-300" />
              </div>
              <div className="aspect-square bg-card border border-border rounded-sm flex items-center justify-center card-hover col-start-1">
                <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gold/20" />
                </div>
              </div>
              <div className="aspect-square bg-card border border-border rounded-sm flex items-center justify-center card-hover">
                <div className="font-display text-4xl font-light text-muted-foreground/30">8+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="контакты" className="px-8 md:px-16 py-24 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="reveal font-body text-xs tracking-[0.3em] uppercase text-gold mb-6">Старт</p>
          <h2 className="reveal font-display text-[clamp(3rem,7vw,7rem)] font-light text-foreground leading-tight mb-8">
            Готовы к проекту<br />
            <span className="italic text-gold">мечты?</span>
          </h2>
          <p className="reveal font-body text-base text-muted-foreground max-w-md mx-auto leading-relaxed mb-12">
            Расскажите о задаче — ответим в течение рабочего дня и предложим стратегию бесплатно.
          </p>

          {/* Contact form */}
          <div className="reveal bg-card border border-border p-8 md:p-12 text-left max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  placeholder="Александр"
                  className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="alex@company.ru"
                  className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>
            <div className="mb-8">
              <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                Расскажите о проекте
              </label>
              <textarea
                rows={4}
                placeholder="Коротко о задаче, бюджете и сроках..."
                className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />
            </div>
            <button className="btn-gold w-full text-center">
              <span>Отправить заявку</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-8 md:px-16 py-10 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#" className="font-display text-xl text-foreground tracking-wider">
            FORMA
          </a>
          <div className="flex items-center gap-8">
            {["Telegram", "Instagram", "Behance"].map((s) => (
              <a
                key={s}
                href="#"
                className="font-body text-xs text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase"
              >
                {s}
              </a>
            ))}
          </div>
          <p className="font-body text-xs text-muted-foreground/50">
            © 2025 FORMA Studio
          </p>
        </div>
      </footer>
    </div>
  );
}