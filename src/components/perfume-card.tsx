import Image from "next/image";

export type Perfume = {
    id: string;
    name: string;
    brand: string;
    matchScore: number;
    notes: string[];
    description: string;
    imageUrl?: string;
    tags: string[];
    reasoning?: string;
};

export default function PerfumeCard({ perfume }: { perfume: Perfume }) {
    return (
        <div className="bg-perfume-card group rounded-xl overflow-hidden border border-gray-800 hover:border-perfume-gold transition-all duration-300 hover:shadow-2xl hover:shadow-perfume-gold/10">
            <div className="relative h-64 w-full bg-gray-800">
                {perfume.imageUrl ? (
                    <Image
                        src={perfume.imageUrl}
                        alt={perfume.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-gradient-to-br from-gray-800 to-black">
                        <span>No Image</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-perfume-gold/50">
                    <span className="text-perfume-gold font-bold">{perfume.matchScore}% Match</span>
                </div>
            </div>

            <div className="p-5">
                <div className="mb-2 flex justify-between items-start">
                    <div>
                        <h4 className="text-gray-400 text-xs uppercase tracking-widest">{perfume.brand}</h4>
                        <h3 className="text-xl font-serif text-white">{perfume.name}</h3>
                    </div>
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{perfume.description}</p>

                {/* Reasoning Badge */}
                {perfume.reasoning && (
                    <div className="mb-4 bg-perfume-gold/10 border border-perfume-gold/20 p-2 rounded-lg">
                        <p className="text-xs text-perfume-gold italic">✨ {perfume.reasoning}</p>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                    {perfume.notes.map((note) => (
                        <span key={note} className="px-2 py-1 bg-white/5 text-xs rounded text-gray-300">
                            {note}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                        Sample $5
                    </button>
                    <button className="border border-gray-600 text-white py-2 rounded-lg hover:border-white transition-colors">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
}
