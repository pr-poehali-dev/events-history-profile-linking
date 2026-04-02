import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────
type Status = "new" | "in_progress" | "resolved" | "rejected" | "hidden";
type Priority = "high" | "medium" | "low";
type Section = "events" | "users" | "chats";

interface Complaint {
  id: number;
  date: string;
  status: Status;
  subject: string;
  reason: string;
  priority: Priority;
  section: Section;
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  status: Status[];
  priority: Priority[];
}

// ─── Mock Data ────────────────────────────────────────────
const MOCK_DATA: Complaint[] = [
  // Events
  { id: 1, date: "2025-03-28", status: "new", subject: "Концерт «Ночь в опере»", reason: "Неверная информация о мероприятии", priority: "high", section: "events" },
  { id: 2, date: "2025-03-27", status: "in_progress", subject: "Бизнес-форум 2025", reason: "Некорректный возрастной ценз", priority: "medium", section: "events" },
  { id: 3, date: "2025-03-25", status: "resolved", subject: "Марафон «Весенний бег»", reason: "Дискриминационный контент", priority: "high", section: "events" },
  { id: 4, date: "2025-03-22", status: "rejected", subject: "Арт-выставка «Форма»", reason: "Подозрительная организация", priority: "low", section: "events" },
  { id: 5, date: "2025-03-20", status: "hidden", subject: "Нетворкинг-вечер IT", reason: "Массовые жалобы на спам", priority: "high", section: "events" },
  { id: 6, date: "2025-03-18", status: "new", subject: "Мастер-класс по кулинарии", reason: "Вводящее в заблуждение описание", priority: "medium", section: "events" },
  // Users
  { id: 7, date: "2025-03-29", status: "new", subject: "@maxim_k", reason: "Оскорбительное поведение", priority: "high", section: "users" },
  { id: 8, date: "2025-03-28", status: "in_progress", subject: "@designpro_anna", reason: "Рассылка спама участникам", priority: "medium", section: "users" },
  { id: 9, date: "2025-03-26", status: "resolved", subject: "@user_8821", reason: "Фейковый профиль", priority: "high", section: "users" },
  { id: 10, date: "2025-03-24", status: "rejected", subject: "@travel_sergey", reason: "Подозрительная активность", priority: "low", section: "users" },
  { id: 11, date: "2025-03-21", status: "hidden", subject: "@bot_account_x", reason: "Превышен лимит жалоб (12)", priority: "high", section: "users" },
  { id: 12, date: "2025-03-19", status: "new", subject: "@katerina_m", reason: "Нарушение правил сообщества", priority: "medium", section: "users" },
  // Chats
  { id: 13, date: "2025-03-30", status: "new", subject: "Чат мероприятия #4821", reason: "Оскорбительные сообщения", priority: "high", section: "chats" },
  { id: 14, date: "2025-03-29", status: "in_progress", subject: "Сообщение от @user_334", reason: "Угрозы и агрессия", priority: "high", section: "chats" },
  { id: 15, date: "2025-03-27", status: "resolved", subject: "Чат «Форум предпринимателей»", reason: "Реклама и спам", priority: "medium", section: "chats" },
  { id: 16, date: "2025-03-25", status: "rejected", subject: "Сообщение от @anna_d", reason: "Дезинформация", priority: "low", section: "chats" },
  { id: 17, date: "2025-03-23", status: "hidden", subject: "Группа «Инвесторы 2025»", reason: "Массовые жалобы (9)", priority: "high", section: "chats" },
  { id: 18, date: "2025-03-20", status: "new", subject: "Сообщение от @maxim_k", reason: "Экстремистские материалы", priority: "high", section: "chats" },
];

// ─── Config ───────────────────────────────────────────────
const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  new:         { label: "Новая",            color: "bg-blue-500/15 text-blue-300 border-blue-500/30",    dot: "bg-blue-400" },
  in_progress: { label: "В работе",         color: "bg-amber-500/15 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
  resolved:    { label: "Решена",           color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
  rejected:    { label: "Отклонена",        color: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",    dot: "bg-zinc-500" },
  hidden:      { label: "Скрыто системой",  color: "bg-red-500/15 text-red-400 border-red-500/30",       dot: "bg-red-500" },
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  high:   { label: "Высокий", color: "text-red-400" },
  medium: { label: "Средний", color: "text-amber-400" },
  low:    { label: "Низкий",  color: "text-zinc-500" },
};

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: "events", label: "Жалобы на мероприятия", icon: "Calendar" },
  { key: "users",  label: "Жалобы на пользователей", icon: "Users" },
  { key: "chats",  label: "Жалобы на чаты", icon: "MessageSquare" },
];

// ─── Default Filters ──────────────────────────────────────
const DEFAULT_FILTERS: Filters = {
  dateFrom: "",
  dateTo: "",
  status: [],
  priority: [],
};

// ─── Status Badge ─────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Priority Cell ────────────────────────────────────────
function PriorityCell({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  const bars = priority === "high" ? 3 : priority === "medium" ? 2 : 1;
  return (
    <span className={`inline-flex items-center gap-2 font-medium text-xs ${cfg.color}`}>
      <span className="flex items-end gap-0.5">
        {[1, 2, 3].map((b) => (
          <span
            key={b}
            className={`w-1 rounded-sm transition-all ${b <= bars ? cfg.color.replace("text-", "bg-") : "bg-zinc-700"}`}
            style={{ height: `${b * 4 + 4}px` }}
          />
        ))}
      </span>
      {cfg.label}
    </span>
  );
}

// ─── Filter Modal ─────────────────────────────────────────
function FilterModal({
  open,
  onClose,
  filters,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onApply: (f: Filters) => void;
}) {
  const [local, setLocal] = useState<Filters>(filters);

  if (!open) return null;

  const toggleStatus = (s: Status) => {
    setLocal((prev) => ({
      ...prev,
      status: prev.status.includes(s)
        ? prev.status.filter((x) => x !== s)
        : [...prev.status, s],
    }));
  };

  const togglePriority = (p: Priority) => {
    setLocal((prev) => ({
      ...prev,
      priority: prev.priority.includes(p)
        ? prev.priority.filter((x) => x !== p)
        : [...prev.priority, p],
    }));
  };

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleReset = () => {
    setLocal(DEFAULT_FILTERS);
  };

  const activeCount =
    (local.dateFrom || local.dateTo ? 1 : 0) +
    local.status.length +
    local.priority.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#13120f] border border-gold/20 rounded-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <Icon name="SlidersHorizontal" size={16} className="text-gold" />
            <span className="font-body text-sm font-semibold text-foreground tracking-wide">
              Фильтрация данных
            </span>
            {activeCount > 0 && (
              <span className="bg-gold text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {activeCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-7">
          {/* Date Range */}
          <div>
            <label className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
              Дата
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-body text-xs text-muted-foreground/60 mb-1.5 block">От</span>
                <input
                  type="date"
                  value={local.dateFrom}
                  onChange={(e) => setLocal((p) => ({ ...p, dateFrom: e.target.value }))}
                  className="w-full bg-background border border-border px-3 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors rounded-sm [color-scheme:dark]"
                />
              </div>
              <div>
                <span className="font-body text-xs text-muted-foreground/60 mb-1.5 block">До</span>
                <input
                  type="date"
                  value={local.dateTo}
                  onChange={(e) => setLocal((p) => ({ ...p, dateTo: e.target.value }))}
                  className="w-full bg-background border border-border px-3 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors rounded-sm [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
              Статус
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([key, cfg]) => {
                const active = local.status.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleStatus(key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-200 ${
                      active ? cfg.color : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    {active && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
              Приоритет
            </label>
            <div className="flex gap-3">
              {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(([key, cfg]) => {
                const active = local.priority.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => togglePriority(key)}
                    className={`flex-1 py-2.5 rounded-sm text-xs font-medium border transition-all duration-200 ${
                      active
                        ? `border-gold/40 bg-gold/10 text-foreground`
                        : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground/40"
                    }`}
                  >
                    <span className={active ? cfg.color : ""}>{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wide"
          >
            Сбросить всё
          </button>
          <button
            onClick={handleApply}
            className="btn-gold flex items-center gap-2"
          >
            <span className="flex items-center gap-2">
              <Icon name="Check" size={13} />
              Применить
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Complaints Table ─────────────────────────────────────
function ComplaintsTable({ data }: { data: Complaint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Icon name="SearchX" size={32} className="text-muted-foreground/30 mb-4" />
        <p className="font-body text-sm text-muted-foreground">Нет жалоб по выбранным фильтрам</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {["ID", "Дата", "Статус", "Объект жалобы", "Причина жалобы", "Приоритет"].map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id}
              className="border-b border-border/50 hover:bg-gold/3 transition-colors duration-150 group cursor-pointer"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <td className="px-4 py-3.5">
                <span className="font-display text-gold/50 text-sm font-light">
                  #{String(row.id).padStart(4, "0")}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span className="font-body text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(row.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3.5">
                <span className="font-body text-sm text-foreground group-hover:text-gold transition-colors duration-150">
                  {row.subject}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span className="font-body text-xs text-muted-foreground">{row.reason}</span>
              </td>
              <td className="px-4 py-3.5">
                <PriorityCell priority={row.priority} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function ComplaintsJournal() {
  const [activeSection, setActiveSection] = useState<Section>("events");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<Filters>(DEFAULT_FILTERS);

  const activeFilterCount =
    (filters.dateFrom || filters.dateTo ? 1 : 0) +
    filters.status.length +
    filters.priority.length;

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter((c) => {
      if (c.section !== activeSection) return false;
      if (filters.status.length > 0 && !filters.status.includes(c.status)) return false;
      if (filters.priority.length > 0 && !filters.priority.includes(c.priority)) return false;
      if (filters.dateFrom && c.date < filters.dateFrom) return false;
      if (filters.dateTo && c.date > filters.dateTo) return false;
      return true;
    });
  }, [activeSection, filters]);

  const countBySection = (section: Section) =>
    MOCK_DATA.filter((c) => c.section === section).length;

  const handleOpenFilter = () => {
    setPendingFilters(filters);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-body">
      {/* ── Header ── */}
      <div className="border-b border-border px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon name="ShieldAlert" size={16} className="text-gold" />
              <p className="font-body text-xs tracking-[0.25em] uppercase text-gold">Модерация</p>
            </div>
            <h1 className="font-display text-3xl font-light text-foreground">Журнал жалоб</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-body text-xs text-muted-foreground">
              Обновлено: {new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button className="btn-outline-gold flex items-center gap-2 text-xs py-2 px-4">
              <Icon name="Archive" size={13} />
              Архив жалоб
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* ── Section Tabs ── */}
        <div className="flex items-center gap-1 mb-8 bg-card border border-border rounded-sm p-1 w-fit">
          {SECTIONS.map((s) => {
            const count = countBySection(s.key);
            const newCount = MOCK_DATA.filter((c) => c.section === s.key && c.status === "new").length;
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-sm transition-all duration-200 font-body text-sm ${
                  activeSection === s.key
                    ? "bg-gold text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={s.icon} size={14} />
                {s.label}
                <span
                  className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                    activeSection === s.key ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
                {newCount > 0 && activeSection !== s.key && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                    {newCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Table Card ── */}
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <h2 className="font-body text-sm font-semibold text-foreground">
                {SECTIONS.find((s) => s.key === activeSection)?.label}
              </h2>
              <span className="font-body text-xs text-muted-foreground">
                {filteredData.length} записей
              </span>
              {activeFilterCount > 0 && (
                <span className="bg-gold/15 text-gold border border-gold/30 text-[11px] font-medium px-2 py-0.5 rounded-full">
                  {activeFilterCount} фильтр{activeFilterCount === 1 ? "" : activeFilterCount < 5 ? "а" : "ов"}
                </span>
              )}
            </div>

            <button
              onClick={handleOpenFilter}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium border transition-all duration-200 ${
                activeFilterCount > 0
                  ? "bg-gold/10 border-gold/40 text-gold"
                  : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
              }`}
            >
              <Icon name="SlidersHorizontal" size={13} />
              Фильтры
              {activeFilterCount > 0 && (
                <span className="bg-gold text-background w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Table */}
          <ComplaintsTable data={filteredData} />

          {/* Table Footer */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-border/50 bg-background/30">
              <span className="font-body text-xs text-muted-foreground/60">
                Показано {filteredData.length} из {MOCK_DATA.filter((c) => c.section === activeSection).length} записей
              </span>
              <div className="flex items-center gap-1">
                {[1].map((p) => (
                  <button key={p} className="w-7 h-7 rounded-sm bg-gold text-background text-xs font-medium">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([key, cfg]) => {
            const count = filteredData.filter((c) => c.status === key).length;
            return (
              <div key={key} className="bg-card border border-border rounded-sm px-4 py-3 flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <div>
                  <div className="font-display text-xl font-light text-foreground">{count}</div>
                  <div className="font-body text-[11px] text-muted-foreground mt-0.5">{cfg.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filter Modal ── */}
      <FilterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        filters={pendingFilters}
        onApply={setFilters}
      />
    </div>
  );
}
