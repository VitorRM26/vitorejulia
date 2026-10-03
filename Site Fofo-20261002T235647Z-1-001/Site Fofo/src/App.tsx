import {
  FormEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type TimeTogether = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
};

const EMPTY_TIME: TimeTogether = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalDays: 0,
};

// Coloque as fotos na pasta src com estes nomes: 1.jpg, 2.jpg, 3.jpg...
// Para adicionar outro momento, copie um item e siga a sequência no nome da imagem.
const TIMELINE_MOMENTS = [
  {
    image: new URL("./1.jpg", import.meta.url).href,
    chapter: "Capítulo 01",
    title: "Onde tudo começou",
    description:
      "O primeiro encontro, o primeiro sorriso e o início da nossa história.",
  },
  {
    image: new URL("./2.jpg", import.meta.url).href,
    chapter: "Capítulo 02",
    title: "Nossa primeira aventura",
    description:
      "Um daqueles dias que gostaríamos de guardar para sempre na memória.",
  },
  {
    image: new URL("./3.jpg", import.meta.url).href,
    chapter: "Capítulo 03",
    title: "Um momento inesquecível",
    description:
      "Entre risadas e carinho, criamos mais uma lembrança só nossa.",
  },
  {
    image: new URL("./4.jpg", import.meta.url).href,
    chapter: "Capítulo 04",
    title: "E a história continua",
    description:
      "Ainda temos muitos lugares, sonhos e momentos para viver juntos.",
  },
];

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getTimeTogether(start: Date, end: Date): TimeTogether {
  if (start > end) return EMPTY_TIME;

  const cursor = new Date(start);
  let years = end.getFullYear() - cursor.getFullYear();
  cursor.setFullYear(cursor.getFullYear() + years);

  if (cursor > end) {
    years -= 1;
    cursor.setFullYear(cursor.getFullYear() - 1);
  }

  let months =
    (end.getFullYear() - cursor.getFullYear()) * 12 +
    end.getMonth() -
    cursor.getMonth();
  cursor.setMonth(cursor.getMonth() + months);

  if (cursor > end) {
    months -= 1;
    cursor.setMonth(cursor.getMonth() - 1);
  }

  const remaining = end.getTime() - cursor.getTime();
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);
  const totalDays = Math.floor(
    (end.getTime() - start.getTime()) / 86_400_000,
  );

  return { years, months, days, hours, minutes, seconds, totalDays };
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SparkleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 2.75c.45 4.97 3.12 7.64 8.1 8.1-4.98.45-7.65 3.12-8.1 8.1-.45-4.98-3.12-7.65-8.1-8.1 4.98-.46 7.65-3.13 8.1-8.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TimelinePhoto({
  src,
  number,
  alt,
}: {
  src: string;
  number: number;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.style.display = "none";
    setHasError(true);
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#f9e7ec]">
      {!hasError && (
        <img
          alt={alt}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          onError={handleError}
          src={src}
        />
      )}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#fff8fa_0%,#f5dce3_100%)] text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-[#e5b6c3] bg-white/70 shadow-sm">
            <svg
              aria-hidden="true"
              className="w-6 text-[#b95b75]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 16.5 8.2 12l3.1 3.2 2.1-2.2 6.6 6M7.5 8.5h.01M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#a75068]">
            Adicione sua foto
          </p>
          <p className="mt-1.5 font-serif text-lg font-semibold text-[#70263e]">
            src/{number}.jpg
          </p>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#4c1528]/30 to-transparent" />
      <span className="absolute right-4 bottom-4 flex size-8 items-center justify-center rounded-full border border-white/50 bg-white/85 text-xs font-extrabold text-[#8f2949] shadow-md backdrop-blur-sm">
        {String(number).padStart(2, "0")}
      </span>
    </div>
  );
}

export default function App() {
  const oneYearAgo = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return toInputDate(date);
  }, []);

  const [savedDate, setSavedDate] = useState(
    () => localStorage.getItem("love-start-date") || oneYearAgo,
  );
  const [inputDate, setInputDate] = useState(savedDate);
  const [now, setNow] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showConfirmation) return;
    const timer = window.setTimeout(() => setShowConfirmation(false), 2600);
    return () => window.clearTimeout(timer);
  }, [showConfirmation]);

  const startDate = useMemo(() => parseLocalDate(savedDate), [savedDate]);
  const time = getTimeTogether(startDate, now);
  const isFutureDate = startDate > now;
  const totalSeconds = isFutureDate
    ? 0
    : Math.floor((now.getTime() - startDate.getTime()) / 1_000);
  const timeConversions = [
    {
      label: "Segundos",
      description: "Cada pequeno instante",
      value: totalSeconds,
    },
    {
      label: "Minutos",
      description: "Todos os momentos",
      value: Math.floor(totalSeconds / 60),
    },
    {
      label: "Horas",
      description: "Dias e noites juntos",
      value: Math.floor(totalSeconds / 3_600),
    },
    {
      label: "Dias",
      description: "Páginas dessa história",
      value: Math.floor(totalSeconds / 86_400),
    },
  ];

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(startDate);

  const units = [
    { value: time.years, label: time.years === 1 ? "ano" : "anos" },
    { value: time.months, label: time.months === 1 ? "mês" : "meses" },
    { value: time.days, label: time.days === 1 ? "dia" : "dias" },
    { value: time.hours, label: time.hours === 1 ? "hora" : "horas" },
    {
      value: time.minutes,
      label: time.minutes === 1 ? "minuto" : "minutos",
    },
    {
      value: time.seconds,
      label: time.seconds === 1 ? "segundo" : "segundos",
    },
  ];

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!inputDate) return;
    setSavedDate(inputDate);
    localStorage.setItem("love-start-date", inputDate);
    setShowConfirmation(true);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff9fa] px-4 py-6 text-[#4d2435] sm:px-7 sm:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-[#f8cdd8]/60 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#f9dce3]/70 blur-3xl" />
        <HeartIcon className="floating-heart absolute left-[7%] top-[15%] w-5 rotate-[-18deg] text-[#e9a0b2]/50" />
        <HeartIcon className="floating-heart-delay absolute right-[9%] top-[12%] w-8 rotate-[16deg] text-[#d97891]/30" />
        <HeartIcon className="floating-heart absolute bottom-[16%] left-[12%] w-7 rotate-[12deg] text-[#d97891]/25" />
        <SparkleIcon className="absolute right-[7%] top-[48%] w-5 text-[#d9a656]/45" />
        <SparkleIcon className="absolute bottom-[12%] left-[4%] w-4 text-[#d9a656]/40" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#8f2949] shadow-[0_8px_20px_rgba(143,41,73,0.22)]">
              <HeartIcon className="w-4 text-white" />
            </span>
            <span className="font-serif text-lg font-semibold tracking-[-0.02em] text-[#71223d]">
              Nosso tempo
            </span>
          </div>
          <p className="hidden text-xs font-bold uppercase tracking-[0.18em] text-[#b77a8b] sm:block">
            Cada segundo importa
          </p>
        </header>

        <section className="flex flex-1 items-center py-10 sm:py-14">
          <div className="grid w-full items-center gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            <div className="mx-auto max-w-lg text-center lg:mx-0 lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#edc7d1] bg-white/70 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#a04460] shadow-sm backdrop-blur-sm">
                <SparkleIcon className="w-3.5 text-[#cc9b4a]" />
                Uma história só nossa
              </div>
              <h1 className="font-serif text-[3.25rem] leading-[0.95] font-medium tracking-[-0.055em] text-[#72213d] sm:text-7xl lg:text-[5.25rem]">
                Estamos juntos
                <span className="mt-2 block italic text-[#c45170]">há...</span>
              </h1>
              <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-[#8d6270] sm:text-base sm:leading-7 lg:mx-0">
                O tempo passa, mas o carinho cresce. Conte cada pedacinho da
                história que vocês estão construindo juntos.
              </p>

              <form
                className="mx-auto mt-8 max-w-md rounded-[1.4rem] border border-white/90 bg-white/70 p-2 shadow-[0_18px_55px_rgba(104,30,56,0.09)] backdrop-blur-md lg:mx-0"
                onSubmit={handleSubmit}
              >
                <label className="sr-only" htmlFor="start-date">
                  Data em que a história começou
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex flex-1 items-center">
                    <svg
                      aria-hidden="true"
                      className="absolute left-4 w-[18px] text-[#bd657d]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.7"
                      />
                    </svg>
                    <input
                      className="min-h-12 w-full rounded-2xl bg-[#fff7f9] py-3 pr-3 pl-11 text-sm font-bold text-[#6d3145] outline-none transition focus:ring-2 focus:ring-[#d98ba0]/40"
                      id="start-date"
                      max={toInputDate(new Date())}
                      onChange={(event) => setInputDate(event.target.value)}
                      type="date"
                      value={inputDate}
                    />
                  </div>
                  <button
                    className="min-h-12 rounded-2xl bg-[#8f2949] px-5 text-sm font-extrabold text-white shadow-[0_9px_22px_rgba(143,41,73,0.24)] transition hover:-translate-y-0.5 hover:bg-[#7d203e] focus:outline-none focus:ring-2 focus:ring-[#8f2949]/40 focus:ring-offset-2 active:translate-y-0"
                    type="submit"
                  >
                    Contar nossa história
                  </button>
                </div>
              </form>
              <p
                aria-live="polite"
                className={`mt-3 text-xs font-bold text-[#a04460] transition-opacity ${
                  showConfirmation ? "opacity-100" : "opacity-0"
                }`}
              >
                Data atualizada com carinho.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-3 rotate-2 rounded-[2.4rem] bg-[#e9a0b2]/25" />
              <div className="relative rounded-[2.4rem] border border-white/90 bg-white/75 p-5 shadow-[0_28px_80px_rgba(110,31,59,0.14)] backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex flex-col gap-3 border-b border-[#f0dbe0] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.19em] text-[#b16a7e]">
                      Desde
                    </p>
                    <p className="font-serif text-xl font-semibold capitalize text-[#682138] sm:text-2xl">
                      {formattedDate}
                    </p>
                  </div>
                  {!isFutureDate && (
                    <div className="flex items-center gap-2 self-start rounded-full bg-[#fbecf0] px-3 py-2 text-xs font-extrabold text-[#a13d5a] sm:self-auto">
                      <HeartIcon className="w-3.5" />
                      {time.totalDays.toLocaleString("pt-BR")} dias de história
                    </div>
                  )}
                </div>

                {isFutureDate ? (
                  <div className="flex min-h-72 flex-col items-center justify-center text-center">
                    <HeartIcon className="mb-5 w-12 text-[#d77891]" />
                    <h2 className="font-serif text-3xl font-semibold text-[#72213d]">
                      Essa data ainda vai chegar
                    </h2>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-[#936d79]">
                      Escolha uma data de hoje ou do passado para começar a
                      contar essa história.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {units.map((unit, index) => (
                      <div
                        className={`group relative overflow-hidden rounded-3xl border p-4 transition duration-300 hover:-translate-y-1 sm:p-5 ${
                          index < 2
                            ? "border-[#e4a9b8]/55 bg-[#9a3151] text-white shadow-[0_12px_30px_rgba(143,41,73,0.18)]"
                            : "border-[#f0dbe0] bg-[#fff9fa] text-[#71223d]"
                        }`}
                        key={unit.label}
                      >
                        {index < 2 && (
                          <HeartIcon className="absolute -right-3 -bottom-4 w-16 rotate-[-15deg] text-white/8" />
                        )}
                        <p className="relative font-serif text-4xl leading-none font-semibold tabular-nums sm:text-5xl">
                          {String(unit.value).padStart(2, "0")}
                        </p>
                        <p
                          className={`relative mt-3 text-[10px] font-extrabold uppercase tracking-[0.16em] ${
                            index < 2 ? "text-[#f4ced8]" : "text-[#b16a7e]"
                          }`}
                        >
                          {unit.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-3 text-center text-xs font-semibold text-[#a47b87]">
                  <span className="h-px w-8 bg-[#e7c6cf]" />
                  E que venham muitos outros momentos
                  <span className="h-px w-8 bg-[#e7c6cf]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="timeline-title"
          className="relative mb-12 py-5 sm:py-10"
        >
          <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#edc7d1] bg-white/70 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#a04460] shadow-sm backdrop-blur-sm">
              <HeartIcon className="w-3.5" />
              Nossas memórias
            </div>
            <h2
              className="font-serif text-4xl font-medium tracking-[-0.035em] text-[#72213d] sm:text-5xl"
              id="timeline-title"
            >
              Nossa linha do tempo
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#916b77]">
              Alguns instantes especiais que fizeram o nosso amor chegar até
              aqui.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-[#d9879e]/10 via-[#d9879e]/70 to-[#d9879e]/10 md:left-1/2 md:-translate-x-px" />
            <div className="space-y-8 md:space-y-12">
              {TIMELINE_MOMENTS.map((moment, index) => {
                const isEven = index % 2 === 0;

                return (
                  <article
                    className="group relative grid pl-12 md:grid-cols-2 md:gap-16 md:pl-0"
                    key={moment.chapter}
                  >
                    <span className="absolute top-7 left-4 z-10 flex size-4 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-[#fff9fa] bg-[#a73d5c] shadow-[0_0_0_4px_rgba(226,159,177,0.28)] md:left-1/2">
                      <span className="size-1 rounded-full bg-white" />
                    </span>

                    <div
                      className={`overflow-hidden rounded-[1.7rem] border border-white bg-white/80 shadow-[0_18px_50px_rgba(104,30,56,0.11)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(104,30,56,0.15)] ${
                        isEven ? "md:col-start-1" : "md:col-start-2"
                      }`}
                    >
                      <TimelinePhoto
                        alt={`Foto de ${moment.title.toLowerCase()}`}
                        number={index + 1}
                        src={moment.image}
                      />
                      <div className="p-5 sm:p-6">
                        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#bc647c]">
                          {moment.chapter}
                        </p>
                        <h3 className="font-serif text-2xl font-semibold text-[#692139]">
                          {moment.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#94707b]">
                          {moment.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="time-conversion-title"
          className="mb-10 overflow-hidden rounded-[2rem] border border-[#efd9df] bg-white/65 shadow-[0_20px_60px_rgba(104,30,56,0.08)] backdrop-blur-md"
        >
          <div className="flex flex-col gap-3 border-b border-[#efdde2] px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div>
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.19em] text-[#b16a7e]">
                Nosso tempo por inteiro
              </p>
              <h2
                className="font-serif text-2xl font-semibold text-[#682138] sm:text-3xl"
                id="time-conversion-title"
              >
                O amor também pode ser contado assim
              </h2>
            </div>
            <p className="max-w-xs text-xs leading-5 text-[#9a7480] sm:text-right">
              Valores totais desde o começo da nossa história, atualizados a
              cada segundo.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b16a7e]">
                  <th className="px-8 py-4 font-extrabold" scope="col">
                    Medida
                  </th>
                  <th className="px-8 py-4 font-extrabold" scope="col">
                    Significado
                  </th>
                  <th
                    className="px-8 py-4 text-right font-extrabold"
                    scope="col"
                  >
                    Tempo total
                  </th>
                </tr>
              </thead>
              <tbody>
                {timeConversions.map((conversion) => (
                  <tr
                    className="border-t border-[#f3e4e8]"
                    key={conversion.label}
                  >
                    <th
                      className="px-8 py-5 text-sm font-extrabold text-[#752741]"
                      scope="row"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-[#fbecf0]">
                          <HeartIcon className="w-3.5 text-[#c45170]" />
                        </span>
                        {conversion.label}
                      </span>
                    </th>
                    <td className="px-8 py-5 text-sm text-[#96717d]">
                      {conversion.description}
                    </td>
                    <td className="px-8 py-5 text-right font-serif text-2xl font-semibold tabular-nums text-[#682138]">
                      {conversion.value.toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="flex items-center justify-center gap-2 pb-2 text-[11px] font-bold tracking-wide text-[#b08390]">
          Feito para celebrar o amor
          <HeartIcon className="w-3 text-[#c45170]" />
        </footer>
      </div>
    </main>
  );
}
