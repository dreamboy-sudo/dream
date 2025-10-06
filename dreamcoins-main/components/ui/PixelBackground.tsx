const PixelBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200">
      {/* Pixelated Clouds */}
      <div className="absolute top-[10%] left-[10%] w-32 h-20 bg-white rounded-3xl shadow-inner animate-float-slow">
        <div className="absolute -bottom-4 left-6 w-20 h-12 bg-white rounded-3xl" />
      </div>
      <div className="absolute top-[20%] right-[15%] w-40 h-24 bg-white rounded-3xl shadow-inner animate-float-slower">
        <div className="absolute -bottom-6 left-8 w-24 h-16 bg-white rounded-3xl" />
      </div>
      <div className="absolute top-[40%] left-[30%] w-36 h-20 bg-white rounded-3xl shadow-inner animate-float">
        <div className="absolute -bottom-4 left-6 w-24 h-12 bg-white rounded-3xl" />
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-600 to-green-500">
        <div className="absolute top-0 left-0 right-0 h-8 bg-[url('/grass-pixel.png')] bg-repeat-x opacity-50" />
      </div>
    </div>
  );
};

export default PixelBackground; 