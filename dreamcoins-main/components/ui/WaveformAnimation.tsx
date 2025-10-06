const WaveformAnimation = () => {
  return (
    <div className="flex items-center gap-0.5 h-full px-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="w-0.5 h-4 bg-red-500 rounded-full animate-waveform"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default WaveformAnimation; 