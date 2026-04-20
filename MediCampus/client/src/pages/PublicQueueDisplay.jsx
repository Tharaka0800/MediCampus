import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function PublicQueueDisplay() {
  const [queues, setQueues] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const load = () => axios.get(`${API}/queue/public`).then(r => setQueues(r.data)).catch(() => {});
    load();
    const qi = setInterval(load, 5000);
    const ti = setInterval(() => setTime(new Date()), 1000);
    return () => { clearInterval(qi); clearInterval(ti); };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d2137] to-[#0a1628] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-teal to-teal-dark rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 26 26" fill="none" width="28" height="28">
              <path d="M13 3C13 3 7 7 7 13.5C7 17.09 9.69 20 13 20C16.31 20 19 17.09 19 13.5C19 7 13 3 13 3Z" fill="white" fillOpacity="0.9"/>
              <rect x="10" y="10" width="6" height="1.5" rx="0.75" fill="#0d9488"/>
              <rect x="12.25" y="8" width="1.5" height="6" rx="0.75" fill="#0d9488"/>
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-4xl">MediCampus <span className="text-teal-light">Queue</span></h1>
            <p className="text-white/40 text-sm">Campus Health Centre — Live Queue Display</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-5xl tracking-tight tabular-nums">
            {time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-white/40 text-sm mt-1">{time.toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {queues.map((group, i) => (
          <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden">
            {/* Doctor Info */}
            <div className="p-6 border-b border-white/10">
              <div className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">{group.doctor?.room}</div>
              <h2 className="font-serif text-2xl text-white">{group.doctor?.name}</h2>
              <p className="text-teal-light text-sm mt-1">{group.doctor?.specialization}</p>
            </div>

            {/* Now Serving */}
            <div className="p-6 bg-gradient-to-r from-teal/20 to-transparent border-b border-white/10">
              <div className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">NOW SERVING</div>
              <div className="font-serif text-7xl text-teal-light leading-none">
                {group.currentToken || '—'}
              </div>
            </div>

            {/* Waiting List */}
            <div className="p-6">
              <div className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">WAITING ({group.waitingCount})</div>
              <div className="flex flex-wrap gap-2">
                {group.queue
                  .filter(q => q.status === 'waiting')
                  .slice(0, 12)
                  .map(q => (
                    <div key={q._id}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        q.priority === 'emergency'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                          : 'bg-white/10 text-white/70 border border-white/10'
                      }`}>
                      {q.tokenNumber}
                    </div>
                  ))}
              </div>
              <div className="mt-4 text-white/40 text-xs">
                ⏳ Estimated wait: ~{group.waitingCount * 15} minutes
              </div>
            </div>
          </div>
        ))}

        {queues.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="text-6xl mb-4">🏥</div>
            <h2 className="font-serif text-3xl text-white/60 mb-2">No Active Queues</h2>
            <p className="text-white/30">The clinic queue will appear here when patients check in</p>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-xs text-white/40">
              <span className="w-2 h-2 bg-teal rounded-full animate-pulse" /> Auto-refreshing every 5 seconds
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 flex items-center justify-between text-white/30 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live — Refreshes automatically
        </div>
        <p>MediCampus Queue Display System</p>
      </div>
    </div>
  );
}
