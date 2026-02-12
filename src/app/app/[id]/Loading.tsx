export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 pb-32 animate-in fade-in duration-300">
      <header className="max-w-3xl mx-auto mb-6">
        <div className="mb-6 flex items-center gap-2">
           <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
           <div className="w-20 h-4 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-[200px] relative overflow-hidden">
          <div className="space-y-4">
             <div className="h-10 w-3/4 bg-gray-100 rounded-2xl animate-pulse" />
             
             <div className="h-4 w-1/3 bg-gray-50 rounded-lg animate-pulse" />

             <div className="w-full bg-gray-100 h-4 rounded-full mt-6 overflow-hidden">
                <div className="h-full w-1/3 bg-gray-200 animate-pulse" />
             </div>

             <div className="flex justify-between items-end mt-2">
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-6 w-10 bg-gray-100 rounded animate-pulse" />
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto mb-8">
        <div className="w-full h-[60px] bg-gray-200 rounded-[2rem] animate-pulse shadow-sm" />
      </div>

      <main className="max-w-3xl mx-auto space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm h-[88px] flex items-center justify-between"
          >
            <div className="flex items-center gap-5 flex-1">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl animate-pulse flex-shrink-0" />
              <div className="space-y-2 w-full">
                <div className="h-5 w-1/2 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-3 w-1/4 bg-gray-50 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-xl animate-pulse" />
          </div>
        ))}
      </main>
    </div>
  );
}