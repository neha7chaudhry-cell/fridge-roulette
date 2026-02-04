function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-primary-500">
            Fridge Roulette
          </h1>
          <p className="text-gray-600 mt-1">What&apos;s for dinner tonight?</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <p className="text-red-500">
          Tailwind is working if this text is red!
        </p>
      </main>
    </div>
  );
}

export default App;
