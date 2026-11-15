import { Cpu, Layers, MousePointerClick, SlidersHorizontal } from 'lucide-react';

const PERFORMANCE_PRINCIPLES = [
  {
    icon: Cpu,
    title: 'Native Windows Desktop Experience',
    description:
      'Designed specifically as a Windows desktop browser rather than a generic web wrapper, respecting desktop ergonomics and window workflows.',
  },
  {
    icon: MousePointerClick,
    title: 'Responsive Interaction',
    description:
      'Navigation chrome, tab groups, and download controls are structured for immediate, predictable desktop responsiveness.',
  },
  {
    icon: Layers,
    title: 'Efficient UI',
    description:
      'Focused interface panels keep workspace tools accessible without burying everyday browsing behind cluttered chrome.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Controlled Visual Effects',
    description:
      'AUROUS and AETHER visual styling is balanced for practical performance and day-to-day clarity rather than visual overload.',
  },
];

export function PerformanceAndAboutSection() {
  return (
    <section className="relative border-t border-slate-800/70 bg-[#070912] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Performance Design Philosophy */}
          <div className="lg:col-span-7">
            <p className="text-xs font-medium text-cyan-300">Performance Philosophy</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Practical desktop performance by design
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              NEXORA XTINS pairs its distinctive visual identity with restrained interface
              engineering—prioritizing smooth everyday desktop interaction over visual excess.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PERFORMANCE_PRINCIPLES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-800/90 bg-[#0b1020]/70 p-5"
                  >
                    <Icon className="h-5 w-5 text-violet-300" aria-hidden="true" />
                    <h3 className="mt-3 font-display text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Built by NEXORA */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="rounded-3xl border border-slate-800 bg-[#0b1020] p-8 sm:p-10">
              <p className="text-xs font-medium text-cyan-300">Software Ecosystem</p>
              <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                Built by NEXORA
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
                NEXORA XTINS is part of the NEXORA software ecosystem—created to deliver a modern
                Windows desktop browser focused on privacy controls, organized tabs, local-first
                protection, and cohesive visual customization.
              </p>
              <div className="mt-6 border-t border-slate-800 pt-5 text-xs text-slate-400">
                <span>NEXORA XTINS</span>
                <span aria-hidden="true" className="mx-2 text-slate-600">
                  ·
                </span>
                <span>Windows Desktop Browser</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
