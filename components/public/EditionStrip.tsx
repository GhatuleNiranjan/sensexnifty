export default function EditionStrip() {
    return (
        <div className="bg-[#F8F8F8] border-b border-[#E0E0E0] text-[10px] font-sans font-semibold uppercase tracking-widest text-[#6B6B6B] py-1.5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Markets Open</span>
                    <span>•</span>
                    <span>BSE Sensex & Nifty 50 Real-Time Coverage</span>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <span>Independent Journalism</span>
                    <span>•</span>
                    <span>No Paywalls</span>
                </div>
            </div>
        </div>
    );
}